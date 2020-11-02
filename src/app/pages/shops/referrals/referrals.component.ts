import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormGroup } from '@angular/forms';
import { User } from 'src/app/shared/classes/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Store } from 'src/app/shared/classes/store';
import { Paginate } from 'src/app/shared/classes/paginate';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss']
})
export class ReferralsComponent implements OnInit {
  @Input() store: Store;
  invalidEmail = environment.errorForm.invalidEmail;
  required = environment.errorForm.required;
  submitted = false;
  referralForm: FormGroup;
  referrals = [];
  fields = ['Fecha', 'Código', 'Cliente'];
  user: User;
  paginate: Paginate;

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.auth.getUserActive();

  }
  get f() { return this.referralForm.controls; }
  
  setPage( page: number ) {
    this.loadData( page );
  }

  private loadData( page = 1 ): void {
    /**conexion con api de lista de referidos */
  }
}
