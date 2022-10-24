import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { gamesRoutes } from '../../../routes/gamesRoutes';
import { IGameForCreationDto } from '../../../interfaces/game/IGameForCreationDto';
import { GamesRepositoryService } from '../../../services/repositories/games-repository.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { CategoriesRepositoryService } from '../../../services/repositories/category-repository.service';
import { ICategory } from '../../../interfaces/category/ICategory';
import { ISelectedCategory } from '../../../interfaces/category/ISelectedCategory';

@Component({
  selector: 'app-game-create',
  templateUrl: './game-create.component.html',
  styleUrls: ['./game-create.component.scss'],
})
export class GameCreateComponent implements OnInit {
  //region Properties
  public gameForm: FormGroup;
  public imgUrl = '';
  public categories: ICategory[];
  selectedValue: string;
  selectedCategories: ISelectedCategory[] = [];

  //endregion

  //region Ctor
  constructor(
    private location: Location,
    private gameRepo: GamesRepositoryService,
    private categoryRepo: CategoriesRepositoryService
  ) {}

  //endregion

  //region NgOnInit
  ngOnInit() {
    this.createForm();
    this.categoryRepo.categoriesChanged.subscribe((s) => {
      this.categories = s;
    });
  }

  //endregion

  //region Create Form
  createForm() {
    this.gameForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      body: new FormControl('', [Validators.required]),
      price: new FormControl(0, [Validators.required]),
      photoUrl: new FormControl('', [Validators.required]),
    });
  }

  //endregion

  //region On Cancel
  public onCancel = () => {
    this.location.back();
    // this.deleteMe();
  };
  //endregion

  //region Create Game
  public createGame = (gameFormValue: any) => {
    if (this.gameForm.valid) {
      this.executeGameCreation(gameFormValue);
    }
  };

  //endregion

  //region ExecuteGame Creation
  private executeGameCreation = (gameFormValue: any) => {
    let gameForCreationDto: IGameForCreationDto = {
      // categoryId: this.selectedValue,
      title: gameFormValue.title,
      body: gameFormValue.body,
      price: gameFormValue.price,
      photoUrl: gameFormValue.photoUrl,
      categories: this.selectedCategories.map((s) => s.id),
    };
    console.log('Game: ', gameForCreationDto);

    this.gameRepo.create(gamesRoutes.createGame, gameForCreationDto).subscribe({
      next: (game) => {
        Swal.fire(`Your have successfully added a new game`);
        this.location.back();
      },
      error: (err: HttpErrorResponse) => {
        Swal.fire(`The game was not added.`);
        this.location.back();
      },
    });
  };

  //endregion

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

  handleSelected($event: any) {
    if ($event.target.checked) {
      this.selectedCategories.push({
        id: $event.target.id,
        title: $event.target.labels[0].innerHTML,
      });
      console.log('Cat: push: ', this.selectedCategories);
    } else {
      this.handleDeleteSelectedCategory($event.target.id);
    }
  }

  // handleChecked(id: string): boolean {
  //   return !!this.selectedCategories.find((s) => s.id == id);
  // }

  handleDeleteSelectedCategory(id: string) {
    this.selectedCategories = this.selectedCategories.filter(
      (c) => c.id !== id
    );
  }
}
