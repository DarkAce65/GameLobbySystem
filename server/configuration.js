DDPRateLimiter.setErrorMessage(function(rateLimitResult) {
	return "Error, too many requests. You must wait " + Math.ceil(rateLimitResult.timeToReset / 1000) + " seconds before trying again."
});
DDPRateLimiter.addRule({
	type: "method",
	name: "createGame"
}, 1, 10000);

GameDefinitions.remove({});
var gameDefinitions = Meteor.settings.private.gameDefinitions;
for(var gameKey in gameDefinitions) {
	if(gameDefinitions.hasOwnProperty(gameKey)) {
		var definition = gameDefinitions[gameKey];
		definition.gameKey = gameKey;
		GameDefinitions.insert(definition);
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