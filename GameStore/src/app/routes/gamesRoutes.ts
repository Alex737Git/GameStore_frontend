import { IGameParams } from '../interfaces/game/IGameParams';

export const gamesRoutes = {
  getOneGame: (id: string) => `game/${id}`,
  getUserGames: 'game/user',
  createGame: 'game',
  updateGame: `game`,
  deleteGame: (id: string) => `game/${id}`,
  uploadPhoto: 'game/uploadPhoto',

  generateRoute: (
    pageNumber: number,
    pageSize: number,
    params: IGameParams
  ) => {
    let route = `game?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    Object.entries(params).map((p) => {

      if (p[1]) {
        route += `&${p[0]}=${p[1]}`;
      }
    });

    return route;
  },
};
