import { Component, OnInit } from '@angular/core';
import { Store } from 'src/app/shared/classes/store';
import { AuthService } from 'src/app/shared/services/auth.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { User } from 'src/app/shared/classes/user';

@Component({
  selector: 'app-account-manage',
  templateUrl: './account-manage.component.html',
  styleUrls: ['./account-manage.component.scss']
})
export class AccountManageComponent implements OnInit {
  stores : Store[] = [];
  active = 'profile';
  public user: User = new User();

  constructor(       
    private storage: StorageService,

    ) { 
      this.user = this.storage.getItem( 'user' );
      console.log(this.user);
    this.stores.push({
      name:'tienda 1',
      created_at: '02-02-2020'
    },
      {
        name:'tienda 2',
        created_at: '02-02-2020'
      },{
      name:'tienda 3',
      created_at: '02-02-2020'
    },{
      name:'tienda 4',
      created_at: '02-02-2020'
    });
    console.log(this.stores);
  }
  
  ngOnInit(): void {

  }

  updateTab(tab){
    this.active = tab;
  }
}
