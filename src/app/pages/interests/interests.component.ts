import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.scss']
})
export class InterestsComponent implements OnInit {


  modalOpen = false;
  closeResult: string;
  interestsList = ['Carros'];
  fields = [ 'Producto', 'Precio', 'Itbms' ];
  modal: any;
  role: string;
  @ViewChild( 'interests', { static: false } ) Interests: TemplateRef<any>;

  constructor(
    private auth: AuthService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.role = this.auth.getUserRol();

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
}
