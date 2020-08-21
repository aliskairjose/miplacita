import { Component, OnInit, TemplateRef, OnDestroy, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.scss']
})
export class SuccessModalComponent implements OnInit, OnDestroy {
  @ViewChild('successModal', { static: false }) SuccessModal: TemplateRef<any>;
  modal: any;
  modalOpen = false;
  modalOption: NgbModalOptions = {}; // not null!
  constructor(
    public modalService: NgbModal,
    private router: Router) { }

  ngOnInit(): void {
  }

  openModal(){
    this.modalOpen = true;
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modal = this.modalService.open(this.SuccessModal, this.modalOption);
    this.modal.result.then((result) => {
      console.log(result);
    });
  }

  close(){

    this.modal.close();
    this.router.navigate( [ 'pages/login' ] );

  }

  ngOnDestroy() {
    if (this.modalOpen){
      this.modalService.dismissAll();
    }
  }

}
