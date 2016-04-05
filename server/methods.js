Meteor.methods({
	"createGame": function(gameType, lobbyName, password) {
		if(!GAME_DEFINITIONS.hasOwnProperty(gameType)) {
			throw new Meteor.Error("unrecognized-game", "A game of the specified type is not defined.");
		}
		if(Games.findOne({"lobbbyData.lobbyName": lobbyName})) {
			throw new Meteor.Error("lobby-name-taken", "A lobby with this name already exists.");
		}
		var game = {
			"gameType": gameType,
			"inGame": false,
			"password": false,
			"lobbyData": {
				"lobbyName": lobbyName,
				"players": [this.userId],
				"minPlayers": GAME_DEFINITIONS[gameType].minPlayers,
				"maxPlayers": GAME_DEFINITIONS[gameType].maxPlayers
			},
			"gameData": GAME_DEFINITIONS[gameType].gameData
		};
		if(password) {
			game.password = password;
		}

		Games.insert(game);
	}
});