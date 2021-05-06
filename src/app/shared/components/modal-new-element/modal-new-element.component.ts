import { Component, OnInit, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { NgbModalOptions, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { close } from 'fs';
import { ContactComponent } from '../../../pages/account/contact/contact.component';

@Component( {
  selector: 'app-modal-new-element',
  templateUrl: './modal-new-element.component.html',
  styleUrls: [ './modal-new-element.component.scss' ]
} )
export class ModalNewElementComponent implements OnInit {
  @ViewChild( 'newElement', { static: false } ) AddElement: TemplateRef<any>;
  @Input() option = 1;

  modal: any;
  modalOpen = false;
  modalOption: NgbModalOptions = {};

  subCatForm: FormGroup;
  colorForm: FormGroup;
  sizeForm: FormGroup;

  color = '';

  submitted = false;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  get s() { return this.sizeForm.controls; }
  get sc() { return this.subCatForm.controls; }
  get c() { return this.colorForm.controls; }

  ngOnInit(): void {

  }

  onSubmit() {
    this.submitted = true;
    switch ( this.option ) {
      case 1:
        if ( this.sizeForm.valid ) {
          this.activeModal.close( { name: this.sizeForm.value.name, value: this.sizeForm.value.size } );
        }
        break;
      case 2:
        if ( this.subCatForm.valid ) {
          this.activeModal.close( this.subCatForm.value );
        }
        break;

      default:
        if ( this.color ) {
          this.colorForm.controls.color.clearValidators();
          this.colorForm.controls.color.updateValueAndValidity();
          this.colorForm.value.color = this.color;
        }
        if ( this.colorForm.valid ) { this.activeModal.close( { name: this.colorForm.value.name, value: this.color } ); }
        break;
    }
  }

  close() {
    this.activeModal.dismiss( true );
  }

  private createForm(): void {
    this.sizeForm = this.formBuilder.group( {
      name: [ '', Validators.required ],
      size: [ '', Validators.required ],
    } );

    this.colorForm = this.formBuilder.group( {
      name: [ '', Validators.required ],
      color: [ '', Validators.required ],
    } );

    this.subCatForm = this.formBuilder.group( {
      scname: [ '', [ Validators.required ] ],
      description: [ '', [ Validators.required ] ],
    } );
  }
}
