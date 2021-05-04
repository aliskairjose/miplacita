import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Store } from 'src/app/shared/classes/store';
import { User } from 'src/app/shared/classes/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from '../../../shared/services/user.service';

@Component( {
  selector: 'app-stores-list',
  templateUrl: './stores-list.component.html',
  styleUrls: [ './stores-list.component.scss' ]
} )
export class StoresListComponent implements OnInit, OnChanges {
  user: User;

  @Input() stores: Store[] = [];

  constructor(
    private auth: AuthService,
    private userService: UserService,

  ) {
    this.user = this.auth.getUserActive();
  }
  ngOnChanges(): void {
    if ( this.auth.getUserRol() === 'client' ) { this.myStores(); }
  }

  ngOnInit(): void {
  }

  /**
   * @description Tiendas donde el cliente ha comprado
   */
  private myStores(): void {

    this.userService.myStores().subscribe( stores => {
      this.stores = [ ...stores ];
    } );
  }

}
