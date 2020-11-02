import { Component, OnInit, Input } from '@angular/core';
import { Store } from 'src/app/shared/classes/store';
import { User } from 'src/app/shared/classes/user';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-stores-list',
  templateUrl: './stores-list.component.html',
  styleUrls: ['./stores-list.component.scss']
})
export class StoresListComponent implements OnInit {
  @Input() stores: Store[] = [];
  user: User;
  constructor(
    private auth: AuthService
  ) {
    this.user = this.auth.getUserActive();

   }

  ngOnInit(): void {
  }

}
