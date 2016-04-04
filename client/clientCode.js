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