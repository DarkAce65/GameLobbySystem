Games = new Meteor.Collection("games");
/* Struture of Games document
{
	_id: string,
	gameType: string,
	inGame: boolean,
	password: string,
	lobbyData: {
		lobbyName: string,
		players: [string],
		minPlayers: integer,
		maxPlayers: integer
	},
	gameData: {
		// Game specific data
	}
}
*/