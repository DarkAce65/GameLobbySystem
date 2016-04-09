Router.waitOn(function() {
	return Meteor.subscribe("extraUserData");
});

Router.onBeforeAction(function() {
	if(Meteor.user().name) {
		this.next();
	}
	else {
		this.redirect("entry");
	}
}, {
	except: ["entry"]
});

Router.route("/", {
	name: "gamelist",
	template: "gamelist",
	waitOn: function() {
		return [Meteor.subscribe("gameDefinitions"), Meteor.subscribe("gameList")];
	}
});

Router.route("/entry", {
	name: "entry",
	template: "entry",
	onBeforeAction: function() {
		if(Meteor.user().name) {
			this.redirect("gamelist");
		}
		else {
			this.next();
		}
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