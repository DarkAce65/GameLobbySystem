/* Games document schema
{
	_id: String,
	gameKey: String,
	inGame: Boolean,
	players: [{
		"_id": String,
		"playerData": Object
	}],
	lobbyData: {
		lobbyName: String,
		password: String
	},
	gameData: {
		allowPlayersAfterStart: Boolean
		// Game specific data
	}
}
*/
Games = new Meteor.Collection("games");
GameDefinitions = new Meteor.Collection("game-definitions");