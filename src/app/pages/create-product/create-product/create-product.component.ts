import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {
  categories = [];
  typesProduct = [];
  states = [];
  image1: any = '../../../../assets/images/marketplace/svg/upload-image.svg';
  image2: any = '../../../../assets/images/marketplace/svg/upload-image.svg';
  image3: any = '../../../../assets/images/marketplace/svg/upload-image.svg';

  constructor() { }

  ngOnInit(): void {
  }


}
