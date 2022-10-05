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

@Component({
  selector: 'app-game-update',
  templateUrl: './game-update.component.html',
  styleUrls: ['./game-update.component.scss'],
})
export class GameUpdateComponent implements OnInit {
  public gameForm: FormGroup;
  public imgUrl = '';
  // public categories:ICategory[]
  private game: IGameForUpdateDto = {
    id: '',
    title: '',
    body: '',
    price: 0,
    photoUrl: '',
    // categoryId:""
  };
  // selectedValue:string
  private gameId: string;
  constructor(
    private location: Location,
    private gameRepo: GamesRepositoryService,
    // private categoryRepo:CategoryRepositoryService,
    // private alert:AlertService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.gameId = this.activeRoute.snapshot.params['id'];
    // this.getCategories()
    this.getGameDetails();
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

  // getCategories(){
  //   this.categoryRepo.getCategories(categoryRoutes.getAllCategories).subscribe(res=>{
  //     this.categories=res;
  //   })
  // }
  public onCancel = () => {
    this.location.back();
  };

  public updateGame = (gameFormValue: any) => {
    if (this.gameForm.valid) {
      this.executeGameUpdate(gameFormValue);
    }
  };

  private executeGameUpdate = (gameFormValue: any) => {
    let gameForUpdateDto: IGameForUpdateDto = {
      id: this.gameId,
      // categoryId:this.selectedValue,
      title: gameFormValue.title,
      body: gameFormValue.body,
      price: gameFormValue.price,
      photoUrl: gameFormValue.photoUrl,
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

  getGameDetails = () => {
    this.gameRepo.getGame(gamesRoutes.getOneGame(this.gameId)).subscribe({
      next: (game: IGame) => {
        console.log('Game: ', game);

        this.game.body = game.body;
        this.game.title = game.title;
        this.game.photoUrl = game.photoUrl;
        this.game.price = game.price;

        this.imgUrl = game.photoUrl;
        // let  categoryId = this.categories.filter(s=>s.categoryName==game.categoryName).map(b=>b.id)
        // this.game.categoryId =  categoryId[0];
        // this.selectedValue = categoryId[0]
        this.gameForm.patchValue(this.game);
        console.log('getGameDetails: game: ', this.game);
      },
      error: (err: HttpErrorResponse) => {
        console.log('Error: ', err);
        Swal.fire("We couldn't get your game for update from Db.");
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
