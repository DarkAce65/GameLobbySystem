Meteor.methods({
	"createGame": function(gameName, lobbyName, password) {
		if(!GAME_DEFINITIONS.hasOwnProperty(gameName)) {
			throw new Meteor.Error("unrecognized-game", "A game of the specified type is not defined.");
		}
		if(Games.findOne({"lobbbyData.lobbyName": lobbyName})) {
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
	}
});