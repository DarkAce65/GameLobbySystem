Router.waitOn(function() {
	return Meteor.subscribe("extraUserData");
});

Router.route("/", {
	name: "gamelist",
	template: "gamelist",
	waitOn: function() {
		return [Meteor.subscribe("gameDefinitions"), Meteor.subscribe("gameList")];
	}
});

Router.route("/lobby/:_id", {
	name: "lobby",
	template: "lobby",
	waitOn: function() {
		return [Meteor.subscribe("gameDefinitions"), Meteor.subscribe("gameData", this.params._id)];
	},
	data: function() {
		return Games.findOne(this.params._id);
	}
});