import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserRepositoryService } from '../../../services/repositories/user-repository.service';
import { userRoutes } from '../../../routes/userRoutes';
import { AuthenticationService } from '../../../services/shared/authentication.service';
import { IUserInfo } from '../../../interfaces/user/user';
import { Router } from '@angular/router';
import { GamesRepositoryService } from '../../../services/repositories/games-repository.service';
import { IGame } from '../../../interfaces/game/IGame';
import { gamesRoutes } from '../../../routes/gamesRoutes';
import Swal from 'sweetalert2';
import { CategoriesRepositoryService } from '../../../services/repositories/category-repository.service';
import { CartRepositoryService } from '../../../services/repositories/cart-repository.service';
import { IOrderedItem } from '../../../interfaces/cart/IOrderedItem';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  games: IGame[];
  role: string = '';

  constructor(
    private http: HttpClient,
    private userService: UserRepositoryService,
    private authService: AuthenticationService,
    private router: Router,
    private repoService: GamesRepositoryService,
    private categoryRepo: CategoriesRepositoryService,
    private cartRepo: CartRepositoryService
  ) {}

  ngOnInit() {
    this.getAllGames();

    //region for  Admin button  functionality
    if (this.authService.isUserAuthenticated())
      this.role = this.authService.getUserRole();
    this.authService.authChanged.subscribe((res) => {
      if (res) this.role = this.authService.getUserRole();
      else this.role = '';
    });
    //  endregion
  }

  //region Update File
  uploadFile = async (files: any) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.userService.avatarUpload(userRoutes.userUpload, formData).subscribe({
      next: async (res: Partial<{ photo: string }>) => {
        let user: IUserInfo | null = this.authService.getUser();
        if (user) {
          user.avatarUrl = <string>res.photo;
          this.authService.sendUserInfoChangeNotification(user);
          Swal.fire('Avatar successfully uploaded!!!');
        }
      },
      error: (err: HttpErrorResponse) => console.log(err),
    });
  };
  //endregion

  //region GetAllGames
  public getAllGames = () => {
    // if (this.authService.isUserInRole('Authenticated')){
    //   this.repoService.getUserGames(gamesRoutes.getUserGames).subscribe((res) => {
    //
    //     this.games = res as IGame[];
    //     this.games = this.categoryRepo.getCategoryNamesAndInsertToGames(res);
    //   });
    // }else{
    //   this.repoService.getGames(gamesRoutes.).subscribe((res) => {
    //
    //     this.games = res as IGame[];
    //     this.games = this.categoryRepo.getCategoryNamesAndInsertToGames(res);
    //   });
    // }

    this.repoService.getUserGames(gamesRoutes.getUserGames).subscribe((res) => {
      this.games = res as IGame[];
      this.games = this.categoryRepo.getCategoryNamesAndInsertToGames(res);
    });
  };
  //endregion
  public navigateToDetails = (id: string) => {
    this.router.navigate([`/game/${id}`]);
  };
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
    this.repoService.delete(gamesRoutes.deleteGame(id)).subscribe({
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

  handleBuy(item: IOrderedItem) {
    this.cartRepo.addItem(item);
  }
}
