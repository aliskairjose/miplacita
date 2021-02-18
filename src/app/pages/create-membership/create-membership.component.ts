import { Component, OnInit, TemplateRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Plan } from 'src/app/shared/classes/plan';
import { PlanService } from '../../shared/services/plan.service';
import { ToastrService } from 'ngx-toastr';
import { ERROR_FORM } from '../../shared/classes/global-constants';

@Component( {
  selector: 'app-create-membership',
  templateUrl: './create-membership.component.html',
  styleUrls: [ './create-membership.component.scss' ]
} )
export class CreateMembershipComponent implements OnInit {
  @ViewChild( 'createMembership', { static: false } ) CreateMembership: TemplateRef<any>;

  modalOpen = false;
  modalOption: NgbModalOptions = {};
  modal: any;
  planForm: FormGroup;
  submitted = false;
  required = ERROR_FORM.required;
  type = 1; // 1- crear 2- editar
  plan: Plan = {};

  @Output() reload: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private modalService: NgbModal,
    private _toast: ToastrService,
    private planService: PlanService,
    private formBuilder: FormBuilder,
  ) {
    this.createForm();
  }

  ngOnInit(): void { }

  createForm(): void {

    this.planForm = this.formBuilder.group( {
      name: [ '', [ Validators.required ] ],
      description: [ '', [ Validators.required ] ],
      price: [ '', [ Validators.required ] ],

    } );
  }

  get f() { return this.planForm.controls; }

  openModal( type: number, plan: Plan ) {
    this.type = type;
    this.plan = { ...plan };
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

  clear() {
    this.submitted = false;
    this.plan = {};
  }

  close() {
    this.clear();
    this.modal.dismiss();
    this.reload.emit( true );

  }

  onSubmit() {
    this.submitted = true;
    if ( this.planForm.valid && this.planForm.dirty ) {
      this.planService.updatePlan( this.plan._id, this.planForm.value ).subscribe( result => {
        if ( result.success ) {
          this._toast.info( result.message[ 0 ] );
          this.close();
        }
      } );
    }
  }

}
