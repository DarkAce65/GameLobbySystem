Router.plugin("dataNotFound", {
	notFoundTemplate: "dataNotFound"
});

Router.configure({
	"onBeforeAction": function() {
		if(Meteor.user()) {
			this.next();
		}
		else {
			this.render("entry");
		}
	}
});

Router.route("/logout", function() {
	if(Meteor.user()) {
		Meteor.logout();
	}
	this.redirect('/');
}, {
	name: 'logout'
});

Router.route("/", {
	name: "gamelist",
	template: "gamelist",
	waitOn: function() {
		return [Meteor.subscribe("gameDefinitions")];
	}
});

Router.route("/createGame", {
	name: "createGame",
	template: "createGame",
	waitOn: function() {
		return [Meteor.subscribe("gameDefinitions")];
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
