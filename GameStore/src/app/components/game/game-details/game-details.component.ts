import { Component, OnInit } from '@angular/core';
import { IGame } from '../../../interfaces/game/IGame';
import { GamesRepositoryService } from '../../../services/repositories/games-repository.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { gamesRoutes } from '../../../routes/gamesRoutes';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { CategoriesRepositoryService } from '../../../services/repositories/category-repository.service';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss'],
})
export class GameDetailsComponent implements OnInit {
  game: IGame;
  categories: string[];

  constructor(
    private repository: GamesRepositoryService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
    private location: Location,
    private categoryRepo: CategoriesRepositoryService
  ) {}

  ngOnInit(): void {
    this.getGameDetails();
  }

  getGameDetails = () => {
    const id: string = this.activeRoute.snapshot.params['id'];
    this.repository.getGame(gamesRoutes.getOneGame(id)).subscribe({
      next: (game: IGame) => {
        this.game = game;
        this.categories = this.categoryRepo.getCategoryNames(
          this.game.categories
        );
      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);

        Swal.fire(this.errorHandler.errorMessage);
      },
    });
  };

  backClicked() {
    // this.location.back();
    this.router.navigate(['/']);
  }
}
