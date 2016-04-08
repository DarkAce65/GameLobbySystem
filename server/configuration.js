AccountsGuest.anonymous = true;

Meteor.publish("gameList", function() {
	return Games.find({}, {
		fields: {
			"gameName": 1,
			"inGame": 1,
			"lobbyData": 1
		}
	});
});

Meteor.publish("gameData", function(_id) {
	return Games.find(_id);
});