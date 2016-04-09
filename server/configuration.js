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
			allowPlayersAfterStart: Boolean,
			// Game specific data
		}
	}
}
*/
var GAME_DEFINITIONS = {
	test: {
		name: "TestName",
		minPlayers: 2,
		maxPlayers: 15,
		gameDataDefaults: {
			allowPlayersAfterStart: true,
			// Game specific data
		}
	}
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

Meteor.publish("gameList", function(searchQuery) {
	var query = {"players": {$elemMatch: {"_id": this.userId}}};
	if(searchQuery) {
		query = searchQuery;
	}
	return Games.find(query, {
		fields: {
			"gameKey": 1,
			"inGame": 1,
			"players": 1,
			"lobbyData": 1
		}
	});
});

Meteor.publish("gameData", function(_id) {
	return Games.find({$and: [{"_id": _id}, {"players": {$elemMatch: {"_id": this.userId}}}]});
});