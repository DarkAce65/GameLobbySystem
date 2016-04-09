Meteor.methods({
	"changeName": function(userId, name) {
		console.log(Meteor.users.findOne({"name": name}));
		if(Meteor.users.findOne({"name": name})) {
			throw new Meteor.Error("name-taken", "This name has already been taken.");
		}

		Meteor.users.update(this.userId, {$set: {"name": name}});
	},
	"createGame": function(gameKey, lobbyName, password) {
		if(!Meteor.users.findOne(this.userId).name) {
			throw new Meteor.Error(401, "You haven't set a name for yourself.");
		}
		var definition = GameDefinitions.findOne({"gameKey": gameKey});
		if(!definition) {
			throw new Meteor.Error("unrecognized-game", "A game of the specified type is not defined.");
		}
		if(Games.findOne({"lobbyData.lobbyName": lobbyName})) {
			throw new Meteor.Error("lobby-name-taken", "A lobby with this name already exists.");
		}
		var game = {
			"gameKey": gameKey,
			"inGame": false,
			"players": [this.userId],
			"lobbyData": {
				"lobbyName": lobbyName,
				"private": false,
				"playerCount": 1
			},
			"gameData": definition.gameDataDefaults
		};
		if(password) {
			game.lobbyData.private = true;
			game.password = password;
		}

		Games.insert(game);
		Roles.addUsersToRoles(this.userId, ["player", "owner"], lobbyName);
	},
	"joinLobby": function(lobbyName, password) {
		if(!Meteor.users.findOne(this.userId).name) {
			throw new Meteor.Error(401, "You haven't set a name for yourself.");
		}
		var game = Games.findOne({"lobbyData.lobbyName": lobbyName});
		if(!game) {
			throw new Meteor.Error(404, "Lobby not found.");
		}
		if(game.lobbyData.private && game.password !== password) {
			throw new Meteor.Error(401, "Incorrect password for lobby.");
		}
		if(Roles.userIsInRole(this.userId, "player", lobbyName)) {
			throw new Meteor.Error("already-joined", "You have already join this lobby.");
		}

		Games.update({"lobbyData.lobbyName": lobbyName}, {
			$set: {"lobbyData.playerCount": game.players.length + 1},
			$addToSet: {"players": this.userId}
		});
		Roles.addUsersToRoles(this.userId, ["player"], lobbyName);
	},
	"leaveLobby": function(lobbyName) {
		var game = Games.findOne({"lobbyData.lobbyName": lobbyName});
		if(!game) {
			throw new Meteor.Error(404, "Lobby not found.");
		}
		if(!Roles.userIsInRole(this.userId, "player", lobbyName)) {
			throw new Meteor.Error(400, "You are not in this lobby.");
		}

		var update = {$unset: {}};
		update["$unset"]["roles." + lobbyName] = "";
		Meteor.users.update(this.userId, update);

		if(game.players.length <= 1) {
			Games.remove({"lobbyData.lobbyName": lobbyName});
		}
		else {
			Games.update({"lobbyData.lobbyName": lobbyName}, {
				$set: {"lobbyData.playerCount": game.players.length - 1},
				$pull: {"players": this.userId}
			});
		}
	},
	"deleteLobby": function(lobbyName) {
		var game = Games.findOne({"lobbyData.lobbyName": lobbyName});
		if(!game) {
			throw new Meteor.Error(404, "Lobby not found.");
		}
		if(!Roles.userIsInRole(this.userId, "owner", lobbyName)) {
			throw new Meteor.Error(403, "You don't have permission to delete this lobby.");
		}

		var update = {$unset: {}};
		update["$unset"]["roles." + lobbyName] = "";
		Meteor.users.update({"_id": {$in: game.players}}, update, {"multi": true});
		Games.remove({"lobbyData.lobbyName": lobbyName});
	}
});