/* Games document schema
{
	_id: String,
	gameKey: String,
	inGame: Boolean,
	players: [String],
	password: String,
	lobbyData: {
		lobbyName: String,
		private: Boolean
	},
	gameData: {
		// Game specific data
	}
}
*/
Games = new Meteor.Collection("games");
GameDefinitions = new Meteor.Collection("game-definitions");