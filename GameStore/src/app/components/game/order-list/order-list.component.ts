import { Component, OnInit } from '@angular/core';
import { CartRepositoryService } from '../../../services/repositories/cart-repository.service';
import { IOrderedItem } from '../../../interfaces/cart/IOrderedItem';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {
  public orderedItems: IOrderedItem[];
  public total = 0;
  constructor(
    private cartRepo: CartRepositoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.orderedItems = this.cartRepo.items;
    console.log('items: ', this.orderedItems);
    this.cartRepo.orderedItemsFullChanged.subscribe((i) => {
      this.orderedItems = i;
      this.total = this.cartRepo.getTotal();
    });
  }

  //region handleClose
  handleClose(id: string) {
    this.cartRepo.reduceItems(id);
  }
  //endregion

  //region handleSigns
  handleSigns(id: string, sing: string) {
    if (sing == 'plus') {
      this.cartRepo.addRemoveItemQuantity(id, 'plus');
    } else {
      this.cartRepo.addRemoveItemQuantity(id, 'minus');
    }
  }
  //  endregion

  //region getPricePerItem
  getPricePerItem(id: string) {
    return this.cartRepo.getTotalPerItem(id);
  }
  //  endregion

  handleProceedBtn() {
    this.router.navigate(['order']);
  }
}
