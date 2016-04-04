AccountsGuest.anonymous = true;

Meteor.publish("games", function() {
	return Games.find();
});