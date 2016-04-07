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
		Roles.addUsersToRoles(this.userId, ["player", "owner"], lobbyName);
	},
	"joinLobby": function(lobbyName, password) {
		var game = Games.findOne({"lobbyData.lobbyName": lobbyName});
		if(!game) {
			throw new Meteor.Error(404, "Lobby not found.");
		}
		if(game.lobbyData.private && game.password !== password) {
			throw new Meteor.Error(401, "Incorrect password for lobby.");
		}

		Roles.addUsersToRoles(this.userId, ["player"], lobbyName);
	}
});