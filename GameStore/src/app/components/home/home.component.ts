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
import { CartRepositoryService } from '../../services/repositories/cart-repository.service';
import { IOrderedItem } from '../../interfaces/cart/IOrderedItem';
import { AuthenticationService } from '../../services/shared/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  games: IGame[];
  selectedCategories: ISelectedCategory[];
  searchTxt: string;
  role: string = '';

  //#region GameParams
  gameParams: IGameParams = {
    categoryName: '',
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
    private categoryRepo: CategoriesRepositoryService,
    private cartRepo: CartRepositoryService,
    private authRepo: AuthenticationService
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

    //region for Manager and Admin Crud All games functionality
    if (this.authRepo.isUserAuthenticated())
      this.role = this.authRepo.getUserRole();
    this.authRepo.authChanged.subscribe((res) => {
      if (res) this.role = this.authRepo.getUserRole();
      else this.role = '';
    });
    //  endregion
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
    } else {
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

  //region handleBuy
  handleBuy(item: IOrderedItem) {
    this.cartRepo.addItem(item);
  }
  //  endregion

  //  region Working on Manager and Admin functionality
  public redirectToUpdate = (id: string) => {
    const updateUrl: string = `/user/update/${id}`;
    this.router.navigate([updateUrl]);
  };
  public redirectToDelete = (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteGame(id);
      }
    });
  };

  private deleteGame(id: string) {
    this.repository.delete(gamesRoutes.deleteGame(id)).subscribe({
      next: (res) => {
        this.games = this.games.filter((g) => g.id != id);
        Swal.fire({
          title: 'Hurray!!',
          text: 'Game has been deleted successfully',
          icon: 'success',
        });
      },
      error: (res) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      },
    });
  }
  //endregion
}
