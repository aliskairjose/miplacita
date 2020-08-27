import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from '../../../shared/services/storage.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-my-shop',
  templateUrl: './my-shop.component.html',
  styleUrls: ['./my-shop.component.scss']
})
export class MyShopComponent implements OnInit {

  constructor(
    private router: Router,
    private auth: AuthService,
    private storage: StorageService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
  }

}
