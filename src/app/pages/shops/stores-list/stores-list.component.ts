import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { Store } from 'src/app/shared/classes/store';
import { User } from 'src/app/shared/classes/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from '../../../shared/services/user.service';
import { StorageService } from '../../../shared/services/storage.service';

@Component( {
  selector: 'app-stores-list',
  templateUrl: './stores-list.component.html',
  styleUrls: [ './stores-list.component.scss' ]
} )
export class StoresListComponent implements OnInit, OnChanges {
  user: User;

  @Input() stores: Store[] = [];
  @Output() newStore: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectStore: EventEmitter<Store> = new EventEmitter<Store>();

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private storage: StorageService,

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
      const isStore = this.storage.getItem( 'isStore' );
      const mainStore = {
        name: 'Mi Placita',
        created_at: '2021-03-01T15:49:28.699Z',
        url_store: 'home',
        logo: 'assets/images/marketplace/svg/logo.svg',
        _id: ''
      };
      stores.unshift( mainStore );
      if ( isStore ) {
        const _stores = [ mainStore, isStore ];
        this.stores.push( ..._stores );
      } else {
        this.stores = [ ...stores ];
      }
    } );
  }

  addStore(): void {
    this.newStore.emit();
  }

  select( store: Store ): void {
    if ( this.user.role === 'merchant' ) { this.selectStore.emit( store ); }
  }

}
