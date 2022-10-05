import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentUrlService } from '../shared/environment-url.service';
import { IGameWithPagination } from '../../interfaces/game/IGameWithPagination';
import { IGame } from '../../interfaces/game/IGame';
import { IGameForUpdateDto } from '../../interfaces/game/IGameForUpdateDto';
import { IGameForCreationDto } from '../../interfaces/game/IGameForCreationDto';

@Injectable({
  providedIn: 'root',
})
export class GamesRepositoryService {
  constructor(
    private http: HttpClient,
    private envUrl: EnvironmentUrlService
  ) {}

  public getGames = (route: string) => {
    return this.http.get<IGameWithPagination>(
      this.createCompleteRoute(route, this.envUrl.urlAddress)
    );
  };

  public getGame = (route: string) => {
    return this.http.get<IGame>(
      this.createCompleteRoute(route, this.envUrl.urlAddress)
    );
  };

  public getUserGames(route: string) {
    return this.http.get<IGame[]>(
      this.createCompleteRoute(route, this.envUrl.urlAddress)
    );
  }

  public create = (route: string, body: IGameForCreationDto) => {
    return this.http.post(
      this.createCompleteRoute(route, this.envUrl.urlAddress),
      body,
      this.generateHeaders()
    );
  };

  public update = (route: string, body: IGameForUpdateDto) => {
    return this.http.put(
      this.createCompleteRoute(route, this.envUrl.urlAddress),
      body,
      this.generateHeaders()
    );
  };

  public delete = (route: string) => {
    return this.http.delete(
      this.createCompleteRoute(route, this.envUrl.urlAddress)
    );
  };

  public imgGameUpload = (route: string, body: FormData) => {
    return this.http.post(
      this.createCompleteRoute(route, this.envUrl.urlAddress),
      body
    );
  };

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  };

  private generateHeaders = () => {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
  };
}
