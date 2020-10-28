import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ShopService } from 'src/app/shared/services/shop.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-commissions',
  templateUrl: './commissions.component.html',
  styleUrls: ['./commissions.component.scss']
})
export class CommissionsComponent implements OnInit {


  commissionsForm: FormGroup;
  submitted: boolean;
  required = environment.errorForm.required;


  constructor(
    private toastr: ToastrService,
    private shopService: ShopService,
    private formBuilder: FormBuilder,
  ) {
    this.createForm();
  }

  ngOnChanges( changes: SimpleChanges ): void {
  }

  ngOnInit(): void {
  }

  get f() { return this.commissionsForm.controls; }

  onSubmit(): void {
    this.submitted = true;

  }

  private createForm(): void {
    this.commissionsForm = this.formBuilder.group( {

    } );
  }

}
