Meteor.methods({
	"createGame": function(gameKey, lobbyName, password) {
		if(!Meteor.users.findOne(this.userId)) {
			throw new Meteor.Error(401, "You are not logged in.");
		}
		var definition = GameDefinitions.findOne({"gameKey": gameKey});
		if(!definition) {
			throw new Meteor.Error("unrecognized-game", "A game of the specified type is not defined.");
		}
		var game = {
			"gameKey": gameKey,
			"inGame": false,
			"players": [{
				"_id": this.userId,
				"playerData": {}
			}],
			"lobbyData": {
				"lobbyName": lobbyName
			},
			"gameData": definition.gameDataDefaults
		};
		if(password) {
			game.lobbyData.password = password;
		}

		Games.insert(game);
	},
	"addPlayerToGame": function(lobbyName, password) {
		if(!Meteor.users.findOne(this.userId)) {
			throw new Meteor.Error(401, "You are not logged in.");
		}
		var game = Games.findOne({"lobbyData.lobbyName": lobbyName});
		if(!game) {
			throw new Meteor.Error(404, "Lobby not found.");
		}
		if(game.lobbyData.private && game.password !== password) {
			throw new Meteor.Error(401, "Incorrect password for lobby.");
		}
		for(var i = 0; i < game.players.length; i++) {
			if(game.players[i]._id === this.userId) {
				throw new Meteor.Error("already-joined", "You have already join this lobby.");
			}
		}
		if(GameDefinitions.findOne({"gameKey": game.gameKey}).maxPlayers <= game.players.length) {
			throw new Meteor.Error("lobby-full", "This lobby is full.");
		}

		Games.update({"lobbyData.lobbyName": lobbyName}, {
			$addToSet: {
				"players": {
					"_id": this.userId, "playerData": {}
				}
			}
		});
	}
});