import { Component, OnInit, ViewChild, TemplateRef, Input, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../../shared/services/category.service';
import { Category } from '../../shared/classes/category';

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
  fields = [ 'Producto', 'Precio', 'Itbms' ];
  modal: any;
  role: string;
  interests = [];
  userform: any;
  interestsList: Category[] = [];

  @ViewChild( 'interests', { static: false } ) Interests: TemplateRef<any>;

  constructor(
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
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

    this.userform = JSON.parse( sessionStorage.userForm );
    this.categoryService.categoryList().subscribe( ( response: Category[] ) => {
      this.interestsList = [ ...response ];
    } );

    this.role = this.auth.getUserRol();
    this.route.url.subscribe( url => {
      if ( url.length === 2 ) {
        this.isPage = true;
      }
    } );
  }

  openModal(): void {
    this.modalOpen = true;
    this.modal = this.modalService.open( this.Interests );
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
    this.router.navigate( [ '/shop/register/success' ] );
  }

  onSubmit(): void {
    this.submitted = true;

    if ( this.interestForm.valid ) {
      this.userService.addUserInterest( this.userform._id, {interest: this.interests} ).subscribe( response => {

        if ( response.success ) {
          this.toastrService.info( response.message[ 0 ] );
          this.saveInterests();
        }
      } );
    }
  }

  private createForm(): void {
    this.interestForm = this.formBuilder.group( {
      interest: [ '', [ Validators.required ] ]
    } );
  }
}
