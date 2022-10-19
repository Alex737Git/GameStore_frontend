import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { gamesRoutes } from '../../../routes/gamesRoutes';
import { IGame } from '../../../interfaces/game/IGame';
import { HttpErrorResponse } from '@angular/common/http';
import { IGameForUpdateDto } from '../../../interfaces/game/IGameForUpdateDto';
import { GamesRepositoryService } from '../../../services/repositories/games-repository.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { ICategory } from '../../../interfaces/category/ICategory';
import { ISelectedCategory } from '../../../interfaces/category/ISelectedCategory';
import { CategoriesRepositoryService } from '../../../services/repositories/category-repository.service';

@Component({
  selector: 'app-game-update',
  templateUrl: './game-update.component.html',
  styleUrls: ['./game-update.component.scss'],
})
export class GameUpdateComponent implements OnInit {
  //region Properties
  public gameForm: FormGroup;
  public imgUrl = '';
  public categories: ICategory[];
  private game: IGameForUpdateDto = {
    id: '',
    title: '',
    body: '',
    price: 0,
    photoUrl: '',
    categories: [],
  };
  private gameId: string;
  selectedCategories: ISelectedCategory[] = [];

  //endregion

  //region Ctor
  constructor(
    private location: Location,
    private gameRepo: GamesRepositoryService,
    private categoryRepo: CategoriesRepositoryService,
    private activeRoute: ActivatedRoute
  ) {}
  //endregion

  //region NgOnInit
  ngOnInit() {
    this.gameId = this.activeRoute.snapshot.params['id'];
    this.getGameDetails();
    this.categoryRepo.categoriesChanged.subscribe((s) => {
      this.categories = s;
    });
    this.createForm();
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

  //region OnCancel
  public onCancel = () => {
    this.location.back();
  };
  //endregion

  public updateGame = (gameFormValue: any) => {
    if (this.gameForm.valid) {
      this.executeGameUpdate(gameFormValue);
    }
  };

  private executeGameUpdate = (gameFormValue: any) => {
    let gameForUpdateDto: IGameForUpdateDto = {
      id: this.gameId,
      title: gameFormValue.title,
      body: gameFormValue.body,
      price: gameFormValue.price,
      photoUrl: gameFormValue.photoUrl,
      categories: [...this.selectedCategories.map((s) => s.id)],
    };

    this.gameRepo.update(gamesRoutes.updateGame, gameForUpdateDto).subscribe({
      next: (game) => {
        Swal.fire('Your have successfully updated the game');
        this.location.back();
      },
      error: (err: HttpErrorResponse) => {
        console.log('Error: ', err);

        Swal.fire('The game was not updated.');
        this.location.back();
      },
    });
  };

  //region getGameDetails
  getGameDetails = () => {
    this.gameRepo.getGame(gamesRoutes.getOneGame(this.gameId)).subscribe({
      next: (game: IGame) => {
        console.log('Update Game: ', game);

        this.game.body = game.body;
        this.game.title = game.title;
        this.game.photoUrl = game.photoUrl;
        this.game.price = game.price;

        this.imgUrl = game.photoUrl;
        // let  categoryId = this.categories.filter(s=>s.categoryName==game.categoryName).map(b=>b.id)
        // this.game.categoryId =  categoryId[0];
        // this.selectedValue = categoryId[0]
        this.gameForm.patchValue(this.game);
        this.fillSelectedCategories(game);
      },
      error: (err: HttpErrorResponse) => {
        console.log('Error: ', err);
        Swal.fire("We couldn't get your game for update from Db.");
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

  //region Handle Categories
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

  handleChecked(id: string): boolean {
    return !!this.selectedCategories.find((s) => s.id == id);
  }

  handleDeleteSelectedCategory(id: string) {
    this.selectedCategories = this.selectedCategories.filter(
      (c) => c.id !== id
    );
  }
  //endregion

  //region FillSelectedCategories
  fillSelectedCategories(game: IGame) {
    let arr: ISelectedCategory[] = [];
    let categories = this.categoryRepo.getDownloadedCategories();
    game.categories.forEach((c) => {
      arr.push({
        id: c,
        title: this.categoryRepo.getCategoryName(c, categories),
      });
    });

    this.selectedCategories.push(...arr);
  }
  //  endregion
}

//Plan
// fill selected categories
//
//
//
//
//
