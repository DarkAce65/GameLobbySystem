Games = new Meteor.Collection("games");
/* Struture of Games document
{
	_id: String,
	gameName: String,
	inGame: Boolean,
	players: [String],
	password: String,
	lobbyData: {
		lobbyName: String,
		private: Boolean,
		minPlayers: Integer,
		maxPlayers: Integer
	},
	gameData: {
		// Game specific data
	}
}
*/