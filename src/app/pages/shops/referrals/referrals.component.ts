import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss']
})
export class ReferralsComponent implements OnInit {
  invalidEmail = environment.errorForm.invalidEmail;
  required = environment.errorForm.required;
  submitted = false;
  referralForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }
  get f() { return this.referralForm.controls; }

}
