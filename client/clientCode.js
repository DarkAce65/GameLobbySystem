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

Template.createGame.helpers({
	"gameDefinitions": function() {
		return GameDefinitions.find();
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

Template.gamelist.events({
	"click .joinLobby": function(e) {
		var button = $(e.target);
		if(!button.hasClass("visibleInput")) {
			$(".showInput, .visibleInput").removeClass("showInput visibleInput");
			$(".joinLobby").html("Join");
		}

		var lobbyId = this._id;
		var lobbyName = this.lobbyData.lobbyName;

		if(this.lobbyData.private) {
			button.html("Enter");
			var lobbyPassword = button.closest(".lobby").find(".lobbyPassword");
			lobbyPassword.addClass("showInput");

			if(button.hasClass("visibleInput")) {
				Meteor.call("joinLobby", lobbyName, lobbyPassword.find("input").val(), function(error) {
					if(error) {
						console.log(error.message);
					}
					else {
						Router.go("lobby", {_id: lobbyId});
					}
				});
				lobbyPassword.find("input").val("");
			}
			else {
				button.addClass("visibleInput");
			}
		}
		else {
			Meteor.call("joinLobby", lobbyName, function(error) {
				if(error) {
					console.log(error.message);
				}
				else {
					Router.go("lobby", {_id: lobbyId});
				}
			});
		}
	}
});