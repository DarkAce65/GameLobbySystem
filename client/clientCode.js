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

Template.activeGames.helpers({
	"games": function() {
		return Games.find({"players": {$elemMatch: {"_id": Meteor.userId()}}}, {
			sort: {
				"gameName": 1,
				"lobbyData.lobbyName": 1
			}
		});
	},
	"maxPlayers": function(gameKey) {
		return GameDefinitions.findOne({"gameKey": gameKey}).maxPlayers;
	}
});

Template.searchGames.helpers({
	"games": function() {
		return Games.find({"players": {$elemMatch: {"_id": {$ne: Meteor.userId()}}}}, {
			sort: {
				"gameName": 1,
				"lobbyData.lobbyName": 1
			}
		});
	},
	"maxPlayers": function(gameKey) {
		return GameDefinitions.findOne({"gameKey": gameKey}).maxPlayers;
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