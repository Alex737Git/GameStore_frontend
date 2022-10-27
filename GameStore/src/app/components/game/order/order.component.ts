import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmailValidation } from '../../../common/validations';
import { CartRepositoryService } from '../../../services/repositories/cart-repository.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  public orderForm: FormGroup;
  public paymentTypes = ['cash', 'card'];
  selectedValue: string;
  constructor(
    private router: Router,
    private cartRepo: CartRepositoryService
  ) {}

  ngOnInit(): void {
    this.buildOrderForm();
  }

  buildOrderForm() {
    this.orderForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', EmailValidation),
      payment: new FormControl('', Validators.required),
      comments: new FormControl(''),
    });
  }
  handleOrder(data: any) {
    if (data.comments.length < 600) {
      Swal.fire('Your order successfully created!!!');
      this.cartRepo.clearCart();
      this.router.navigate(['home']);
    } else {
      Swal.fire('Your comment should be less then 600 characters!!!');
    }
  }
}
