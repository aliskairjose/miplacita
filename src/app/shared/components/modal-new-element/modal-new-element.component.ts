import { Component, OnInit, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { NgbModalOptions, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-new-element',
  templateUrl: './modal-new-element.component.html',
  styleUrls: ['./modal-new-element.component.scss']
})
export class ModalNewElementComponent implements OnInit {
  @ViewChild( 'newElement', { static: false } ) AddElement: TemplateRef<any>;
  @Input() option: number = 1;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  modal: any;
  modalOpen = false;
  modalOption: NgbModalOptions = {};
  

  constructor(  
    public modalService: NgbModal,
    public activeModal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    console.log("on init", this.option);
  }

  clear(){

  }
  close(){
    console.log("close");
    this.activeModal.dismiss();
  }
}
