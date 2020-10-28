import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Paginate } from 'src/app/shared/classes/paginate';
import { Plan } from 'src/app/shared/classes/plan';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-membership',
  templateUrl: './create-membership.component.html',
  styleUrls: ['./create-membership.component.scss']
})
export class CreateMembershipComponent implements OnInit {
  @ViewChild( 'createMembership', { static: false } ) CreateMembership: TemplateRef<any>;

  modalOpen = false;
  modalOption: NgbModalOptions = {};
  modal: any;
  planForm: FormGroup;
  submitted = false;
  required = environment.errorForm.required;
  type = 1; // 1- crear 2- editar
  plan: Plan = {};
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  createForm(): void {

    this.planForm = this.formBuilder.group( {
      name: [ '', [ Validators.required ] ],
      description: [ '', [ Validators.required ] ],
      price: [ '', [ Validators.required ] ],

    } );
  }

  get f() { return this.planForm.controls; }

  openModal(type: number, plan: Plan ) {
    this.type = type;
    this.plan = plan;
    this.modalOpen = true;
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'createProductModal';
    this.modal = this.modalService.open( this.CreateMembership, this.modalOption );
    this.modal.result.then( () => {
      // Cuando se envia la data cerrando el modal con el boton
    }, () => {
      // Cuando se cierra con la x de la esquina
      this.clear();
    } );
  }

  clear(){
    this.submitted = false;
    this.plan = {};
  }

  close() {
    this.clear();
    this.modal.dismiss();

  }

  onSubmit(){

  }

}
