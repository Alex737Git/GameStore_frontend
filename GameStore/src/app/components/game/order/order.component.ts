import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  EmailValidation,
  PasswordValidation,
} from '../../../common/validations';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  public orderForm: FormGroup;
  public paymentTypes = ['cash', 'card'];
  selectedValue: string;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.buildOrderForm();
  }

  buildOrderForm() {
    this.orderForm = new FormGroup({
      firstName: new FormControl('Alex', Validators.required),
      lastName: new FormControl('John', Validators.required),
      phone: new FormControl('076767786', Validators.required),
      email: new FormControl('a@a.com', EmailValidation),
      payment: new FormControl('', Validators.required),
      comments: new FormControl(''),
    });
  }
  handleOrder(data: any) {
    if (data.comments.length < 600) {
      Swal.fire('Your order successfully created!!!');
      this.router.navigate(['home']);
    } else {
      Swal.fire('Your comment should be less then 600 characters!!!');
    }
  }
}
