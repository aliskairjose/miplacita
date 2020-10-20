import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;

  constructor(
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

  decline() {
    this.activeModal.close(false);
  }

  accept() {
    this.activeModal.close(true);
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
