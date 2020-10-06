import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.scss']
})
export class InterestsComponent implements OnInit {
  @ViewChild( 'interests', { static: false } ) Interests: TemplateRef<any>;

  isPage = false;
  modalOpen = false;
  closeResult: string;
  interestsList = ['Carros', 'Tecnología y Computación', 'Hogar y Decoración'];
  fields = [ 'Producto', 'Precio', 'Itbms' ];
  modal: any;
  role: string;
  itemsSelected = []; 

  constructor(
    private auth: AuthService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.role = this.auth.getUserRol();
    this.route.url.subscribe( url => {
      console.log(url);
      if(url.length == 2){
        this.isPage = true;
      }
    });
  }

  openModal(  ) {
    this.modalOpen = true;
    this.modal = this.modalService.open( this.Interests );
  }

  close() {
    this.modal.close();
  }

  ngOnDestroy() {
    if ( this.modalOpen ) {
      this.modalService.dismissAll();
    }
  }
  selectInterest(interest, event){
    if(event.target.checked){
      this.itemsSelected.push(interest);
    } else {
      const index = this.itemsSelected.find( item => item === interest );
      this.itemsSelected.splice(index, 1);
    }
  }
  saveInterests(){
    this.router.navigate( [ '/shop/register/success' ] );
  }
}
