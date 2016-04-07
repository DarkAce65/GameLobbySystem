Template.registerHelper("contains", function(item, array) {
	return array.indexOf(item) !== -1;
});

Template.gamelist.helpers({
	"games": function() {
		return Games.find();
	},
	"numPlayers": function() {
		return this.lobbyData.players.length;
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
						Router.go("game", {_id: lobbyId});
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
					Router.go("game", {_id: lobbyId});
				}
			});
		}
	}
});