Games = new Meteor.Collection("games");
/* Struture of Games document
{
	_id: string,
	gameType: string,
	lobbyName: string,
	status: {
		active: boolean,
		private: boolean,
		password: string
	},
	gameData: {
		maxPlayers: integer, // 0 for unlimited
		players: [string],
		roles: [string]
	}
}
*/