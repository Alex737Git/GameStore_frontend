import { Component, OnDestroy, OnInit } from '@angular/core';
import { IGame } from '../../../interfaces/game/IGame';
import { GamesRepositoryService } from '../../../services/repositories/games-repository.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { gamesRoutes } from '../../../routes/gamesRoutes';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { CategoriesRepositoryService } from '../../../services/repositories/category-repository.service';
import { CommentRepositoryService } from '../../../services/repositories/comment-repository.service';
import { IComment } from '../../../interfaces/comment/IComment';
import { commentsRoutes } from '../../../routes/commentsRoutes';
import { ICommentForCreationDto } from '../../../interfaces/comment/ICommentForCreationDto';
import { AuthenticationService } from '../../../services/shared/authentication.service';
import { ICommentForUpdateDto } from '../../../interfaces/comment/ICommentForUpdateDto';
import { browserRefresh } from '../../../app.component';
import { LS } from '../../../localStorage/localStorage';
import { CartRepositoryService } from '../../../services/repositories/cart-repository.service';
import { IOrderedItem } from '../../../interfaces/cart/IOrderedItem';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss'],
})
export class GameDetailsComponent implements OnInit, OnDestroy {
  //region Properties
  game: IGame;
  comments: IComment[];
  categories: string[];
  showForm: boolean = false;
  id: string;
  gameId: string;
  userId: string | undefined;
  editId: string;
  deletedComments: string[] = [];
  role: string = '';
  //endregion

  //region Ctor
  constructor(
    private repository: GamesRepositoryService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
    private location: Location,
    private categoryRepo: CategoriesRepositoryService,
    private commentRepo: CommentRepositoryService,
    private authService: AuthenticationService,
    private cartRepo: CartRepositoryService
  ) {}

  //endregion

  //region ngOnInit
  ngOnInit(): void {
    this.gameId = this.activeRoute.snapshot.params['id'];
    this.getGameDetails(this.gameId);
    if (this.authService.isUserAuthenticated()) {
      this.userId = this.authService.getUser()?.id;
    }
    if (browserRefresh) {
      this.deleteComment();
    }
    this.getGameComments(this.gameId);

    //region for Manager comments Crud functionality
    if (this.authService.isUserAuthenticated())
      this.role = this.authService.getUserRole();
    this.authService.authChanged.subscribe((res) => {
      if (res) this.role = this.authService.getUserRole();
      else this.role = '';
    });
    //  endregion
  }

  //endregion

  ngOnDestroy() {
    this.deleteComment();
  }

  handleBuy(item: IOrderedItem) {
    this.cartRepo.addItem(item);
  }

  //region getGameDetails
  getGameDetails = (id: string) => {
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
  //endregion

  //region getGameComments
  getGameComments = (id: string) => {
    this.commentRepo.getComments(commentsRoutes.getComments(id)).subscribe({
      next: (comments: IComment[]) => {
        this.comments = comments;
      },
      error: (err: HttpErrorResponse) => {
        this.errorHandler.handleError(err);

        Swal.fire(this.errorHandler.errorMessage);
      },
    });
  };
  //endregion

  //region changeDates
  changeDates(date: string) {
    return this.commentRepo.getDataDiff(date);
  }

  //endregion

  //region handleCancelForm
  handleCancelForm(form: string) {
    if (form == 'edit') {
      this.editId = '';
    } else if (form === '') {
      this.id = '';
    } else {
      this.showForm = false;
    }
  }

  //endregion

  //region handleSendForm
  handleSendForm(comment: ICommentForCreationDto) {
    console.log(comment);
    if (comment.body.length > 600) {
      Swal.fire('Comment should be less than 600 characters. ');
    } else {
      this.createComment(comment);
    }
  }

  //endregion

  //region handleMultipleRepeatComments
  handleMultipleRepeatComments(id: string) {
    if (this.authService.isUserAuthenticated()) {
      this.id = id;
    } else {
      Swal.fire('Please, log in first :-)');
    }
  }

  //endregion

  //region Check Id
  checkId(id: string, where: string = '') {
    if (where === 'edit') {
      return this.editId == id;
    }
    return this.id == id;
  }

  //endregion

  //region createComment
  createComment(data: ICommentForCreationDto) {
    this.commentRepo.create(commentsRoutes.createComment, data).subscribe({
      next: (_) => {
        Swal.fire(`Your have successfully added a new comment`);
        this.getGameComments(this.gameId);
        this.showForm = false;
        this.id = '';
      },
      error: (err: HttpErrorResponse) => {
        Swal.fire(`The comment was not added. Error: ${err}`);
      },
    });
  }

  //endregion

  //region handleAddComment
  handleAddComment() {
    if (this.authService.isUserAuthenticated()) {
      this.showForm = !this.showForm;
    } else {
      Swal.fire('Please, log in first :-)');
    }
  }

  //endregion

  //region handleDelete
  handleDelete(comment: ICommentForUpdateDto) {
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
        this.handleEditForm(comment);
      }
    });
  }

  //endregion

  //region setIsDeleted
  setIsDeleted(comments: IComment[]) {
    if (comments && comments.length > 0)
      comments.forEach((c) => {
        if (c.isDeleted) {
          console.log('Getting here c.isDeleted');
          this.commentRepo
            .delete(commentsRoutes.deleteComment(c.id))
            .subscribe({
              next: (_) => {},
              error: (err: HttpErrorResponse) => {},
            });
        }
        if (c.children && c.children.length > 0) {
          this.setIsDeleted(c.children);
        }
      });
  }

  //endregion

  //region deleteComments
  deleteComment() {
    if (this.deletedComments && this.deletedComments.length > 0)
      this.deletedComments.forEach((c) => {
        this.commentRepo.delete(commentsRoutes.deleteComment(c)).subscribe({
          next: (_) => {},
          error: (err: HttpErrorResponse) => {},
        });
      });
  }

  //endregion

  //region handleEdit
  handleEdit(id: string) {
    this.editId = id;
  }

  //endregion

  //region handleEditForm
  handleEditForm(form: ICommentForUpdateDto) {
    if (form.body.length > 600) {
      Swal.fire('Comment should be less than 600 characters. ');
    } else {
      if (form.isDeleted) this.deletedComments.push(form.id);
      else {
        this.deletedComments = this.deletedComments.filter(
          (c) => c !== form.id
        );
      }

      this.commentRepo.update(commentsRoutes.updateComment, form).subscribe({
        next: (_) => {
          Swal.fire(`Your have successfully updated the comment`);
          this.getGameComments(this.gameId);
          this.editId = '';
        },
        error: (err: HttpErrorResponse) => {
          Swal.fire(`The comment was not updated. Error: ${err}`);
        },
      });
    }
  }

  //endregion
}
