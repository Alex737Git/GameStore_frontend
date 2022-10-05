import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { gamesRoutes } from '../../../routes/gamesRoutes';
import { IGameForCreationDto } from '../../../interfaces/game/IGameForCreationDto';
import { GamesRepositoryService } from '../../../services/repositories/games-repository.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { userRoutes } from '../../../routes/userRoutes';
import { IUserInfo } from '../../../interfaces/user/user';

@Component({
  selector: 'app-game-create',
  templateUrl: './game-create.component.html',
  styleUrls: ['./game-create.component.scss'],
})
export class GameCreateComponent implements OnInit {
  public gameForm: FormGroup;
  public imgUrl = '';

  // public categories: ICategory[];
  selectedValue: string;
  constructor(
    private location: Location,
    private gameRepo: GamesRepositoryService // private categoryRepo: CategoryRepositoryService,
  ) {}
  ngOnInit() {
    // this.getCategories();
    // this.imgUrl =
    //   'https://game-store-photos-bucket.s3.amazonaws.com/6950395a-5fb6-4332-9978-6523b2eee056';

    this.createForm();
  }

  createForm() {
    this.gameForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      body: new FormControl('', [Validators.required]),
      // category: new FormControl('', [Validators.required]),
      price: new FormControl(0, [Validators.required]),
      photoUrl: new FormControl('', [Validators.required]),
    });
  }

  // getCategories() {
  //   this.categoryRepo
  //     .getCategories(categoryRoutes.getAllCategories)
  //     .subscribe((res) => {
  //       this.categories = res;
  //     });
  // }

  public onCancel = () => {
    this.location.back();
  };
  public createGame = (gameFormValue: any) => {
    if (this.gameForm.valid) {
      this.executeGameCreation(gameFormValue);
    }
  };

  private executeGameCreation = (gameFormValue: any) => {
    let gameForCreationDto: IGameForCreationDto = {
      // categoryId: this.selectedValue,
      title: gameFormValue.title,
      body: gameFormValue.body,
      price: gameFormValue.price,
      photoUrl: gameFormValue.photoUrl,
    };
    console.log('Game: ', gameForCreationDto);

    this.gameRepo.create(gamesRoutes.createGame, gameForCreationDto).subscribe({
      next: (game) => {
        Swal.fire(`Your have successfully added a new game`);
        this.location.back();
      },
      error: (err: HttpErrorResponse) => {
        // this.alert.error(`The game was not added.`, {
        //   autoClose: true,
        //   keepAfterRouteChange: true,
        // });
        Swal.fire(`The game was not added.`);
        this.location.back();
      },
    });
  };

  //region Upload Photo
  uploadFile = async (files: any) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.gameRepo.imgGameUpload(gamesRoutes.uploadPhoto, formData).subscribe({
      next: async (res: Partial<{ path: string }>) => {
        this.imgUrl = <string>res.path;
        this.gameForm.patchValue({
          photoUrl: <string>res.path,
        });
      },
      error: (err: HttpErrorResponse) => {
        Swal.fire(`Could not upload  the photo. Error: ${err}`);
        console.log(err);
      },
    });
  };
  //  endregion
}
