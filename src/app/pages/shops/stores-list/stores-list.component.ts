import { Component, OnInit, Input } from '@angular/core';
import { Store } from 'src/app/shared/classes/store';

@Component({
  selector: 'app-stores-list',
  templateUrl: './stores-list.component.html',
  styleUrls: ['./stores-list.component.scss']
})
export class StoresListComponent implements OnInit {
  @Input() stores: Store[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
