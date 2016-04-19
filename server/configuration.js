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
		gameName: "TestName",
		minPlayers: 2,
		maxPlayers: 15,
		gameDataDefaults: {
			allowPlayersAfterStart: true
			// Game specific data
		}
	}
}
for(var gameKey in GAME_DEFINITIONS) {
	if(GAME_DEFINITIONS.hasOwnProperty(gameKey)) {
		var definition = GAME_DEFINITIONS[gameKey];
		definition.gameKey = gameKey;
		GameDefinitions.upsert({"gameKey": gameKey}, {
			$set: definition
		});
	}
}

Meteor.publish("gameDefinitions", function() {
	return GameDefinitions.find({}, {
		fields: {
			"gameDataDefaults": 0
		}
	});
});

Meteor.publish("gameList", function(lobbyName, password) {
	var fields = {
		"gameKey": 1,
		"inGame": 1,
		"players": 1,
		"lobbyData": 1
	};
	if(lobbyName && password) {
		return Games.find({"lobbyData.lobbyName": lobbyName, "lobbyData.password": password}, {fields: fields});
	}
	if(lobbyName) {
		return Games.find({"lobbyData.lobbyName": lobbyName, "lobbyData.password": {$exists: false}}, {fields: fields});
	}
	return Games.find({"players": {$elemMatch: {"_id": this.userId}}}, {fields: fields});
});

Meteor.publish("gameData", function(_id) {
	return Games.find({
		$and: [
			{"_id": _id},
			{"players": {$elemMatch: {"_id": this.userId}}}
		]
	});
});