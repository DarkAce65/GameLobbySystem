var updateGameDefinitions = function(gameDefinitions) {
	GameDefinitions.remove({});
	for(var gameKey in gameDefinitions) {
		if(gameDefinitions.hasOwnProperty(gameKey)) {
			var definition = gameDefinitions[gameKey];
			GameDefinitions.insert({
				"gameKey": gameKey,
				"gameName": definition.name,
				"minPlayers": definition.minPlayers,
				"maxPlayers": definition.maxPlayers,
				"gameDataDefaults": definition.gameDataDefaults
			});
		}
	}
}

/* GAME_DEFINITIONS schema
{
	gameKey: {
		name: String,
		minPlayers: Integer,
		maxPlayers: Integer,
		gameDataDefaults: {
			// Game specific data
		}
	}
}
*/
var GAME_DEFINITIONS = {
}
updateGameDefinitions(GAME_DEFINITIONS);

Meteor.publish("extraUserData", function() {
	return Meteor.users.find(this.userId, {
		fields: {
			"name": 1
		}
	});
});

Meteor.publish("gameDefinitions", function() {
	return GameDefinitions.find({}, {
		fields: {
			"gameDataDefaults": 0
		}
	});
});

Meteor.publish("gameList", function() {
	return Games.find({}, {
		fields: {
			"gameKey": 1,
			"inGame": 1,
			"lobbyData": 1
		}
	});
});

Meteor.publish("gameData", function(_id) {
	return Games.find({$and: [{"_id": _id}, {"players": this.userId}]});
});