import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component( {
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: [ './forget-password.component.scss' ]
} )
export class ForgetPasswordComponent implements OnInit {

  recoveryForm: FormGroup;
  submitted: boolean;
  required = 'Campo obligatorio';
  invalidEmail = 'Email inválido';
  token = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
  ) { this.createForm(); }

  ngOnInit(): void {
    this.route.url.subscribe( url => {
      this.token = url[1].path;
    })
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.recoveryForm.controls; }


  onSubmit(): void {
    this.submitted = true;
    this.recoveryForm.value.token = this.token;
    console.log(this.recoveryForm.value);
    if ( this.recoveryForm.valid && 
        (this.recoveryForm.value.password == this.recoveryForm.value.confirm_password)) {
      this.auth.updatePassword( this.recoveryForm.value ).subscribe( (result) => {
        console.log(result);
        if(result.success){
          this.toastrService.info(  'Cambio de contraseña exitoso' );
          this.router.navigate(['pages/home']);
        }
        
      });
    } else if (this.recoveryForm.value.password !== this.recoveryForm.value.confirm_password) {
      this.toastrService.info( 'Recuerda! Las contraseñas deben coincidir' );
    }
  }


  createForm(): void {
    this.recoveryForm = this.formBuilder.group( {
      password: [ '', [ Validators.required ] ],
      confirm_password: ['',[Validators.required]],
      token: ['']
    } );
  }
}
