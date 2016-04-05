Games = new Meteor.Collection("games");
/* Struture of Games document
{
	_id: string,
	gameName: string,
	inGame: boolean,
	password: string,
	lobbyData: {
		private: boolean,
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