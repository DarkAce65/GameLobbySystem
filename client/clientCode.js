Tracker.autorun(function(tracker) {
	try {
		UserStatus.startMonitor({
			idleOnBlur: true
		});
		return tracker.stop();
	} catch(error) {
		console.log(error);
	}
});

Template.registerHelper("gameNameFromKey", function(gameKey) {
	var definition = GameDefinitions.findOne({"gameKey": gameKey});
	if(definition) {
		return definition.gameName;
	}
	return "";
});

Template.entry.events({
	"click #loginGoogle": function(e) {
		Meteor.loginWithGoogle(function(error) {
			if(error) {
				console.log(error);
			}
		});
	}
});

Template.navigation.helpers({
	"username": function() {
		if(Meteor.user().username) {
			return Meteor.user().username;
		}
		return Meteor.user().profile.name;
	}
});

Template.navigation.events({
	"click #logout": function() {
		Meteor.logout();
	}
});

Template.createGame.helpers({
	"gameDefinitions": function() {
		return GameDefinitions.find();
	}
});

Template.createGame.events({
	"submit form": function(e) {
		e.preventDefault();
		var gameType = e.target.gameType.value.trim();
		var lobbyName = e.target.lobbyName.value.trim();
		var lobbyPassword = e.target.lobbyPassword.value.trim();
		var callback = function(error, data) {
			if(error) {
				console.log(error);
			}
			else {
				console.log(data);
			}
		};

		if(lobbyPassword) {
			Meteor.call("createGame", gameType, lobbyName, lobbyPassword, callback);
		}
		Meteor.call("createGame", gameType, lobbyName, callback);
	}
});

Template.activeGames.onCreated(function() {
	this.subscribe("gameList");
});

Template.activeGames.helpers({
	"games": function() {
		return Games.find({"players": {$elemMatch: {"_id": Meteor.userId()}}}, {
			sort: {
				"gameName": 1,
				"lobbyData.lobbyName": 1
			}
		});
	},
	"creator": function() {
		return this.players[0]._id;
	},
	"playerCount": function() {
		return this.players.length;
	},
	"maxPlayers": function(gameKey) {
		var definition = GameDefinitions.findOne({"gameKey": gameKey});
		if(definition.maxPlayers) {
			return definition.maxPlayers;
		}
		return "∞";
	}
});

Template.searchGames.onCreated(function() {
	var instance = this;

	instance.searchLobbyName = new ReactiveVar("");
	instance.searchPassword = new ReactiveVar("");
	instance.autorun(function() {
		instance.subscribe("gameList", instance.searchLobbyName.get(), instance.searchPassword.get());
	});
});

Template.searchGames.helpers({
	"games": function() {
		return Games.find({"players": {$not: {$elemMatch: {"_id": Meteor.userId()}}}}, {
			sort: {
				"gameName": 1,
				"lobbyData.lobbyName": 1
			}
		});
	},
	"creator": function() {
		return this.players[0]._id;
	},
	"playerCount": function() {
		return this.players.length;
	},
	"maxPlayers": function(gameKey) {
		var definition = GameDefinitions.findOne({"gameKey": gameKey});
		if(definition.maxPlayers) {
			return definition.maxPlayers;
		}
		return "∞";
	}
});

Template.searchGames.events({
	"submit form": function(e) {
		e.preventDefault();
		Template.instance().searchLobbyName.set(e.target.gameName.value);
		Template.instance().searchPassword.set(e.target.password.value);
	}
});

Template.gamelist.helpers({
	"users": function() {
		return Meteor.users.find();
	}
});

Template.gamelist.events({
	"click .cover": function(e) {

	}
});