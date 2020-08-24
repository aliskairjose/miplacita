import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'ngx-alerts';
import { HttpErrorResponse } from '@angular/common/http';
import { StorageService } from '../../shared/services/storage.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-shop-profile',
  templateUrl: './shop-profile.component.html',
  styleUrls: ['./shop-profile.component.scss']
})
export class ShopProfileComponent implements OnInit {

  profileForm: FormGroup;
  submitted: boolean;
  required = 'Campo obligatorio';
  invalidEmail = 'Email inválido';

  constructor(
    private router: Router,
    private auth: AuthService,
    private alert: AlertService,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
  ) {     this.createForm();  }

  ngOnInit(): void {
  }

  private createForm(): void {
    this.profileForm = this.formBuilder.group( {
      password: [ '', [ Validators.required ] ],
    } );
  }

}
