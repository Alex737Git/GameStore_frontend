import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentUrlService } from '../shared/environment-url.service';
import { BaseRepositoryService } from './base-repository.service';
import { IComment } from '../../interfaces/comment/IComment';
import { ICommentForCreationDto } from '../../interfaces/comment/ICommentForCreationDto';
import { IGameForUpdateDto } from '../../interfaces/game/IGameForUpdateDto';
import { ICommentForUpdateDto } from '../../interfaces/comment/ICommentForUpdateDto';

@Injectable({
  providedIn: 'root',
})
export class CommentRepositoryService extends BaseRepositoryService {
  //region Ctor
  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) {
    super();
  }

  //endregion

  //region getComments
  public getComments = (route: string) => {
    return this.http.get<IComment[]>(
      this.createCompleteRoute(route, this.envUrl.urlAddress)
    );
  };
  //endregion

  //region getDataDiff
  public getDataDiff(startDate: string) {
    let start = new Date(startDate);
    let endDate = new Date(Date.now());
    let diff = endDate.getTime() - start.getTime();
    let days = Math.floor(diff / (60 * 60 * 24 * 1000));
    let hours = Math.floor(diff / (60 * 60 * 1000)) - days * 24;
    let minutes =
      Math.floor(diff / (60 * 1000)) - (days * 24 * 60 + hours * 60);
    let seconds =
      Math.floor(diff / 1000) -
      (days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60);
    let time = '';
    if (days) time += ` ${days}:dd`;
    if (hours) time += ` ${hours}:hh`;
    time += ` ${minutes}:mm`;
    return time;
    // return { day: days, hour: hours, minute: minutes, second: seconds };
  }

  //  endregion

  //region CreateComments
  public create = (route: string, body: ICommentForCreationDto) => {
    return this.http.post(
      this.createCompleteRoute(route, this.envUrl.urlAddress),
      body,
      this.generateHeaders()
    );
  };
  //  endregion

  public delete = (route: string) => {
    return this.http.delete(
      this.createCompleteRoute(route, this.envUrl.urlAddress)
    );
  };

  public update = (route: string, body: ICommentForUpdateDto) => {
    return this.http.put(
      this.createCompleteRoute(route, this.envUrl.urlAddress),
      body,
      this.generateHeaders()
    );
  };
}
