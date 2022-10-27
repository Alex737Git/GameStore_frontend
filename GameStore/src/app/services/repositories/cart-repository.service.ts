import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentUrlService } from '../shared/environment-url.service';
import { BaseRepositoryService } from './base-repository.service';
import { IComment } from '../../interfaces/comment/IComment';
import { ICommentForCreationDto } from '../../interfaces/comment/ICommentForCreationDto';
import { IGameForUpdateDto } from '../../interfaces/game/IGameForUpdateDto';
import { ICommentForUpdateDto } from '../../interfaces/comment/ICommentForUpdateDto';
import { BehaviorSubject, Subject } from 'rxjs';
import { ICategory } from '../../interfaces/category/ICategory';
import { IOrderedItem } from '../../interfaces/cart/IOrderedItem';

@Injectable({
  providedIn: 'root',
})
export class CartRepositoryService {
  private orderedItemsChangeSub = new BehaviorSubject<number>(0);
  public orderedItemsChanged = this.orderedItemsChangeSub.asObservable();
  private orderedItemsFullChangeSub = new BehaviorSubject<IOrderedItem[]>([]);
  public orderedItemsFullChanged =
    this.orderedItemsFullChangeSub.asObservable();

  public items: IOrderedItem[] = [];

  //region Ctor
  constructor() {
    //this.getData();
  }

  //endregion

  //region AddItems
  addItem(item: IOrderedItem) {
    let flag = false;
    this.items.forEach((i) => {
      if (i.id == item.id) {
        i.quantity++;
        flag = true;
      }
    });
    if (!flag) {
      this.items.push(item);
    }
    this.setItems(this.items);
    this.orderedItemsChangeSub.next(this.calculateQuantity());
  }
  //endregion

  //region CalculateQuantity
  calculateQuantity() {
    return this.items.reduce((partialSum, a) => partialSum + a.quantity, 0);
  }

  //endregion

  //region GetTotal
  getTotal() {
    return this.items.reduce(
      (partialSum, a) => partialSum + a.quantity * a.price,
      0
    );
  }

  //endregion

  //region GET and SET Items
  getItems() {
    return this.orderedItemsFullChangeSub.getValue();
  }

  setItems(items: IOrderedItem[]) {
    this.orderedItemsFullChangeSub.next(items);
    this.items = items;
  }

  //endregion

  //region Reduce Items
  reduceItems(id: string) {
    this.items = this.items.filter((c) => c.id !== id);
    this.setItems(this.items);
    this.orderedItemsChangeSub.next(this.calculateQuantity());
  }

  //endregion

  //region addRemoveItemQuantity
  addRemoveItemQuantity(id: string, param: string) {
    for (let i of this.items) {
      if (i.id === id) {
        param == 'plus' ? i.quantity++ : i.quantity--;
      }
    }
    this.items = this.items.filter((c) => c.quantity != 0);
    this.setItems(this.items);
    this.orderedItemsChangeSub.next(this.calculateQuantity());
  }
  //endregion

  //region getTotalPerItem
  getTotalPerItem(id: string) {
    return this.items
      .filter((c) => c.id == id)
      .reduce((basis, i) => basis + i.quantity * i.price, 0);
  }
  //endregion

  clearCart() {
    // this.items=[]
    this.orderedItemsChangeSub.next(0);
    // this.orderedItemsFullChangedSub.next();
    this.setItems([]);
  }
}
