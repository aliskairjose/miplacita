import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {
  @Input() edit: boolean = false;
  editorKey = '';

  constructor() {
    this.editorKey = environment.editorKey;
  }

  ngOnInit(): void {
  }

}
