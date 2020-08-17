import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register-store',
  templateUrl: './register-store.component.html',
  styleUrls: ['./register-store.component.scss']
})
export class RegisterStoreComponent implements OnInit {
  planSelected = 2;
  step = 1;
  categories = [];
  imageLogo : any;
  imageProduct : any

  constructor() { }

  ngOnInit(): void {
  }

  updatePlan(plan:number){
    this.planSelected = plan;
  }

  storeRegister(){
    //consumo de api
    // si el registro de la tienda fue exitoso
    this.step = 2;
  }

  productRegister(){
    //consumo de api
  }

  updateImage($event){
    if($event.target.files.length == 0){
      return;
    }
    
    let image = $event.target.files[0];
    var mimeType = image.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(image); 
    reader.onload = (_event) => { 
      if(this.step == 1){
        this.imageLogo = reader.result;
      } else if(this.step == 2){
        this.imageProduct = reader.result;
      }
    }
    
  }
}
