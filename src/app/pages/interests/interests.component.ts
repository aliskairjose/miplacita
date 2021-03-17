import { Component, OnInit, ViewChild, TemplateRef, Input, OnDestroy, Inject } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../../shared/services/category.service';
import { Category } from '../../shared/classes/category';
import { User } from 'src/app/shared/classes/user';
import { StorageService } from 'src/app/shared/services/storage.service';
import { url } from 'inspector';

@Component( {
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: [ './interests.component.scss' ]
} )
export class InterestsComponent implements OnInit, OnDestroy {

  interestForm: FormGroup;
  submitted: boolean;
  isPage = false;
  modalOpen = false;
  closeResult: string;
  modal: any;
  role: string;
  interests = [];
  userform: any;
  interestsList: Category[] = [];
  user: User;
  mustReturn = false; // variable que indica que debe retornar al origen despues de login
  private url = null;
  private _config = '';

  @Input() type = 'register';
  @ViewChild( 'interests', { static: false } ) Interests: TemplateRef<any>;

  constructor(
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private storage: StorageService,
    private userService: UserService,
    private toastrService: ToastrService,
    private categoryService: CategoryService

  ) {
    this.createForm();
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() { return this.interestForm.controls; }

  ngOnInit(): void {
    if ( this.type === 'register' ) {
      // this.userform = JSON.parse( sessionStorage.userForm );
      this.userform = this.storage.getItem( 'userForm' );
      // tslint:disable-next-line: deprecation
      this.categoryService.categoryList().subscribe( ( response: Category[] ) => {
        this.interestsList = [ ...response ];
      } );
    }
    this.role = this.auth.getUserRol();
    // tslint:disable-next-line: deprecation
    this.route.url.subscribe( data => {
      if ( data.length === 2 ) {
        this.isPage = true;
      }
    } );

    // tslint:disable-next-line: deprecation
    const role = this.route.queryParams.subscribe( params => {
      if ( Object.keys( params ).length !== 0 ) {
        this.role = params.role;
        if ( params.status ) { this.mustReturn = true; }
        if ( params.config ) {
          this.mustReturn = true;
          this._config = params.config;
        }
        this.url = params?.url;
      }
    } );
  }

  openModal( user ): void {
    this.user = user;
    this.modalOpen = true;
    this.modal = this.modalService.open( this.Interests );
    // tslint:disable-next-line: deprecation
    this.userService.getUserInterest( this.user._id ).subscribe( ( response ) => {
      if ( response.success ) {
        this.interestsList = response.users.config;
      }
    } );
  }

  close(): void {
    this.modal.close();
  }

  ngOnDestroy(): void {
    if ( this.modalOpen ) {
      this.modalService.dismissAll();
    }
  }

  selectInterest( event ): void {

    const interest = event.target.value; // id del interes del usuario
    const checked = event.target.checked; // boolean si esta o no marcado

    if ( checked ) {
      this.interests.push( interest );
    } else {
      const index = this.interests.indexOf( item => item === interest );
      this.interests.splice( index, 1 );
    }
  }

  saveInterests(): void {
    sessionStorage.removeItem( 'userForm' );

    const login = this.storage.getItem( 'prelogin' );

    // tslint:disable-next-line: deprecation
    this.auth.login( login ).subscribe( data => {
      this.storage.setLoginData( 'data', data );
      this.auth.authSubject( data.success );
      this.storage.removeItem( 'prelogin' );
      this.storage.removeItem( 'userForm' );
      sessionStorage.clear();
      if ( this.url ) {
        this.router.navigate( [ this.url ] );
      } else {
        ( this.mustReturn )
          ? this.router.navigate( [ 'shop/checkout/shipping' ], { queryParams: { config: this._config } } )
          : this.router.navigate( [ '/shop/register/success' ] );
      }
    } );

  }

  onSubmit(): void {
    this.submitted = true;

    if ( this.interestForm.valid ) {
      // tslint:disable-next-line: deprecation
      this.userService.addUserInterest( this.userform._id, { interest: this.interests } ).subscribe( response => {

        if ( response.success ) {
          this.toastrService.info( response.message[ 0 ] );
          this.saveInterests();
        }
      } );
    } else {
    }
  }

  private createForm(): void {
    this.interestForm = this.formBuilder.group( {
      interest: [ '', [ Validators.required ] ]
    } );
  }
}
