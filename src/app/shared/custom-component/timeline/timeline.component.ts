import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  listActive = [false, false, false, false];
  @Input() active: number;

  constructor() { 
  }

  ngOnInit(): void {
    for (let i = 0; i < this.active; i++){
      this.listActive[i] = true;
    }
  }

}
