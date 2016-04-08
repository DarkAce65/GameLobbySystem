Meteor.methods({
	"createGame": function(gameName, lobbyName, password) {
		if(!GAME_DEFINITIONS.hasOwnProperty(gameName)) {
			throw new Meteor.Error("unrecognized-game", "A game of the specified type is not defined.");
		}
		if(Games.findOne({"lobbyData.lobbyName": lobbyName})) {
			throw new Meteor.Error("lobby-name-taken", "A lobby with this name already exists.");
		}
		var game = {
			"gameName": gameName,
			"inGame": false,
			"lobbyData": {
				"private": false,
				"lobbyName": lobbyName,
				"players": [this.userId],
				"minPlayers": GAME_DEFINITIONS[gameName].minPlayers,
				"maxPlayers": GAME_DEFINITIONS[gameName].maxPlayers
			},
			"gameData": GAME_DEFINITIONS[gameName].gameData
		};
		if(password) {
			game.lobbyData.private = true;
			game.password = password;
		}

		Games.insert(game);
		Roles.addUsersToRoles(this.userId, ["owner"], lobbyName);
	},
	"joinLobby": function(lobbyName, password) {
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

		Games.update({"lobbyData.lobbyName": lobbyName}, {$push: {"lobbyData.players": this.userId}});
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
		update.$unset["roles." + lobbyName] = "";
		Meteor.users.update({"_id": {$in: game.lobbyData.players}}, update, {"multi": true});
		Games.remove({"lobbyData.lobbyName": lobbyName});
	}
});