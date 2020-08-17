import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerSuccess = false;
  constructor() { }

  ngOnInit(): void {
  }

  register(){
    // consumo de api
    // si el registro fue exitoso
    this.registerSuccess = !this.registerSuccess;
    console.log(this.registerSuccess);
  }

}
