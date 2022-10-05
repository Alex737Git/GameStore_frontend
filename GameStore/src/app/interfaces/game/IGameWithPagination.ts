import { IGame } from './IGame';

export interface IGameWithPagination {
  games: IGame[];
  data: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
}
