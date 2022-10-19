import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentUrlService } from '../shared/environment-url.service';
import { ICategory } from '../../interfaces/category/ICategory';
import { BaseRepositoryService } from './base-repository.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { ISelectedCategory } from '../../interfaces/category/ISelectedCategory';
import { IGame } from '../../interfaces/game/IGame';

@Injectable({
  providedIn: 'root',
})
export class CategoriesRepositoryService extends BaseRepositoryService {
  //region Properties
  private categoriesChangeSub = new BehaviorSubject<ICategory[]>([]);
  public categoriesChanged = this.categoriesChangeSub.asObservable();

  private selectedCategoriesChangeSub = new Subject<ISelectedCategory[]>();
  public selectedCategoriesChanged =
    this.selectedCategoriesChangeSub.asObservable();

  private searchTxtChangeSub = new Subject<string>();
  public searchTxtChanged = this.searchTxtChangeSub.asObservable();
  //endregion

  //region Ctor
  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) {
    super();
  }
  //endregion

  //region getCategories
  public getCategories = (route: string) => {
    let cat = this.http.get<ICategory[]>(
      this.createCompleteRoute(route, this.envUrl.urlAddress)
    );
    cat.subscribe((s) => this.categoriesChangeSub.next(s));

    return cat;
  };
  //endregion

  public getDownloadedCategories() {
    return this.categoriesChangeSub.getValue();
  }

  //#region Send SelectedCategories State Change Notification
  public sendSelectedCategoriesStateChangeNotification = (
    categories: ISelectedCategory[]
  ) => {
    this.selectedCategoriesChangeSub.next(categories);
  };
  //#endregion

  // #region Send SearchTxt State Change Notification
  public sendSearchTxtStateChangeNotification = (txt: string) => {
    this.searchTxtChangeSub.next(txt);
  };
  //#endregion

  //region getCategoryName
  public getCategoryName(id: string, categories: ICategory[]) {
    let category = '';

    for (let cat of categories) {
      if (cat.id === id) {
        category = cat.title!;
        break;
      }

      if (cat.children.length > 0) {
        let b = this.getCategoryName(id, cat.children);
        if (b !== '') category = b;
      }
    }

    return category;
  }
  //endregion

  //region getCategoryNames
  public getCategoryNames(ids: string[]) {
    let cat = [] as string[];

    ids.forEach((id) => {
      cat.push(this.getCategoryName(id, this.categoriesChangeSub.getValue()));
    });

    return cat;
  }
  //endregion

  //region GetCategories names and insert them to games
  public getCategoryNamesAndInsertToGames(games: IGame[]) {
    let copyGames = [...games];
    copyGames.forEach((g) => {
      g.categories = this.getCategoryNames(g.categories);
    });
    return games;
  }
  //endregion
}
