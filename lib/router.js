Router.route("/", {
	name: "gamelist",
	template: "gamelist",
	waitOn: function() {
		return Meteor.subscribe("gameList");
	}
});

Router.route("/game/:_id", {
	name: "game",
	template: "game",
	waitOn: function() {
		return Meteor.subscribe("gameData", this.params._id);
	},
	data: function() {
		return Games.findOne(this.params._id);
	}
});