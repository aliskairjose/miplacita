import { Component, OnInit, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { NgbModalOptions, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { close } from 'fs';

@Component({
  selector: 'app-modal-new-element',
  templateUrl: './modal-new-element.component.html',
  styleUrls: ['./modal-new-element.component.scss']
})
export class ModalNewElementComponent implements OnInit {
  @ViewChild( 'newElement', { static: false } ) AddElement: TemplateRef<any>;
  @Input() option: number = 1;

  modal: any;
  modalOpen = false;
  modalOption: NgbModalOptions = {};
  
  elementForm: FormGroup;
  constructor(  
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
    ) { }

    get f() { return this.elementForm.controls; }

  ngOnInit(): void {
    this.elementForm = this.formBuilder.group( {
      size: [ '' ],
      subcategory: ['']
      
    } );
  }

  save(){
    if(this.option == 1){
      this.activeModal.close({name: this.elementForm.value.size});
    } else {
      this.activeModal.close({name: this.elementForm.value.subcategory});
    }
  }

  close(){
    console.log("close");
    this.activeModal.dismiss("true");
  }
}
