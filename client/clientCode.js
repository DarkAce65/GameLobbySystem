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
		})
	}
});

Template.gamelist.helpers({
	"games": function() {
		return Games.find({}, {
			sort: {
				"gameName": 1,
				"lobbyData.lobbyName": 1
			}
		});
	},
	"maxPlayers": function(gameKey) {
		return GameDefinitions.findOne({"gameKey": gameKey}).maxPlayers;
	},
	"menuHeader": function() {
		var name = Meteor.user().name;
		if(name) {
			return name;
		}
		return "Menu";
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
	},
	"click .leaveLobby": function(e) {
		Meteor.call("leaveLobby", this.lobbyData.lobbyName, function(error) {
			if(error) {
				console.log(error.message);
			}
		});
	},
	"click .deleteLobby": function(e) {
		Meteor.call("deleteLobby", this.lobbyData.lobbyName, function(error) {
			if(error) {
				console.log(error.message);
			}
		});
	}
});

Template.lobby.events({
	"click #leaveLobby": function(e) {
		Meteor.call("leaveLobby", this.lobbyData.lobbyName, function(error) {
			if(error) {
				console.log(error.message);
			}
			else {
				Router.go("gamelist");
			}
		});
	},
	"click #deleteLobby": function(e) {
		Meteor.call("deleteLobby", this.lobbyData.lobbyName, function(error) {
			if(error) {
				console.log(error.message);
			}
			else {
				Router.go("gamelist");
			}
		});
	}
});