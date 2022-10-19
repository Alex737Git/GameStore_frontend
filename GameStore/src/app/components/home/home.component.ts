import { Component, OnInit } from '@angular/core';
import { gamesRoutes } from '../../routes/gamesRoutes';
import Swal from 'sweetalert2';
import { IGame } from '../../interfaces/game/IGame';
import { IGameParams } from '../../interfaces/game/IGameParams';
import { IPaginatorParams } from '../../interfaces/paginatorParams';
import { GamesRepositoryService } from '../../services/repositories/games-repository.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Router } from '@angular/router';
import { LS } from '../../localStorage/localStorage';
import { IGameWithPagination } from '../../interfaces/game/IGameWithPagination';
import { HttpErrorResponse } from '@angular/common/http';
import { ICategory } from '../../interfaces/category/ICategory';
import { CategoriesRepositoryService } from '../../services/repositories/category-repository.service';
import { categoriesRoutes } from '../../routes/categoriesRoutes';
import { ISelectedCategory } from '../../interfaces/category/ISelectedCategory';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  games: IGame[];
  selectedCategories: ISelectedCategory[];
  searchTxt: string;

  //#region Sort Params
  // sort = {
  //   type: ['desc', 'asc'],
  //   fields: ['title', 'categoryName', 'firstName', 'lastName', 'gameDate'],
  //   selectedField: '',
  //   selectedType: '',
  // };
  //#endregion

  //#region Accordion Names
  // firstPanel = 'Filter';
  // secondPanel = 'Search';
  // thirdPanel = 'Sort';
  //#endregion

  //#region GameParams
  gameParams: IGameParams = {
    categoryName: '',
    // gameFrom: '',
    // gameTo: '',
    searchTerm: '',
    orderBy: '',
  };
  //#endregion

  //#region My Paginator
  paginator: IPaginatorParams = {
    pageSize: 5,
    hasNext: false,
    hasPrevious: false,
    currentPage: 1,
    totalPages: 0,
  };

  //#endregion

  //#region Ctor
  constructor(
    private repository: GamesRepositoryService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private categoryRepo: CategoriesRepositoryService
  ) {}
  //#endregion

  //#region NgOnInit
  ngOnInit(): void {
    let size: number = Number(localStorage.getItem(LS.numberOfPages));
    if (size !== 0) this.paginator.pageSize = size;
    this.getAllGames();
    this.categoryRepo.selectedCategoriesChanged.subscribe((c) => {
      this.selectedCategories = c;
    });
    this.categoryRepo.searchTxtChanged.subscribe((c) => {
      this.searchTxt = c;
      this.getAllGames();
    });
  }
  //#endregion

  //#region Navigate to Details
  public navigateToDetails = (id: string) => {
    this.router.navigate([gamesRoutes.getOneGame(id)]);
  };
  //#endregion

  //#region Get All Games
  public getAllGames = () => {
    const link = this.getHref();
    if (link == '') return;
    console.log('link: ', link);
    this.repository.getGames(link).subscribe({
      next: (response: IGameWithPagination) => {
        this.paginator.hasNext = response.data.hasNext;
        this.paginator.hasPrevious = response.data.hasPrevious;
        this.paginator.pageSize = response.data.pageSize;
        this.paginator.currentPage = response.data.currentPage;
        this.paginator.totalPages = response.data.totalPages;

        this.games = this.categoryRepo.getCategoryNamesAndInsertToGames(
          response.games
        );
      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);
        Swal.fire(`When you make a mistake, be excited! Analyze what happened, and learn from it. Your mistake is
        ${this.errorHandler.errorMessage}`);
      },
    });
  };
  //#endregion

  //#region Paginator functions
  onClick(text: string) {
    text === 'right'
      ? (this.paginator.currentPage += 1)
      : (this.paginator.currentPage -= 1);
    this.getAllGames();
  }

  handleNumberOfPages(text: any) {
    if (text.trim().length > 0) {
      this.paginator.pageSize = Number(text);
      this.getAllGames();
      localStorage.setItem(LS.numberOfPages, text);
    }
  }

  //#endregion

  //#region OnClear
  onClear(text: string) {
    if (text == 'search') {
      this.gameParams.searchTerm = '';
    } else if (text === 'filter') {
      // this.gameParams.categoryName = '';
      // this.gameParams.gameTo = '';
      // this.gameParams.gameFrom = '';
    } else {
      // this.sort.selectedType = '';
      // this.sort.selectedField = '';
      this.gameParams.orderBy = '';
    }
  }

  //#endregion

  //#region Get Href
  getHref(): string {
    if (this.selectedCategories) {
      this.gameParams.categoryName = this.selectedCategories
        .map((c) => c.title)
        .join(',');
      console.log('Categories Params: ', this.gameParams.categoryName);
    } else {
      this.gameParams.categoryName = '';
    }

    if (this.searchTxt) {
      this.gameParams.searchTerm = this.searchTxt;
    } else {
      this.gameParams.searchTerm = '';
    }

    return gamesRoutes.generateRoute(
      this.paginator.currentPage,
      this.paginator.pageSize,
      this.gameParams
    );
  }

  //#endregion

  //#region Are Dates Wrong
  // AreDatesWrong(): boolean {
  //   if (
  //     this.gameParams.gameFrom &&
  //     this.gameParams.gameTo &&
  //     new Date(this.gameParams.gameFrom) > new Date(this.gameParams.gameTo)
  //   ) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Oops...',
  //       text: `From date ${this.gameParams.gameFrom} can't be bigger than End date ${this.gameParams.gameTo} in the filter panel`,
  //     });
  //     this.gameParams.gameTo = '';
  //     return true;
  //   }
  //   return false;
  // }

  //#endregion

  // onSort() {
  //   this.gameParams.orderBy = `${this.sort.selectedField} ${this.sort.selectedType}`;
  //   this.getAllGames();
  // }
  // }
}
