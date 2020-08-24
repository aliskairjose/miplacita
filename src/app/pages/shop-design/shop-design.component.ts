import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop-design',
  templateUrl: './shop-design.component.html',
  styleUrls: ['./shop-design.component.scss']
})
export class ShopDesignComponent implements OnInit {
  color: any;
  images = [{url:'../../../assets/images/dog.png'}, {url:'../../../assets/images/dog.png'}, {url:'../../../assets/images/dog.png'}];
  public carouselConfig: any = {
    loop: true,
    nav: true,
    dots: false,
    navContainerClass: 'owl-nav',
    navClass: [ 'owl-prev', 'owl-next' ],
    navText: [ '<i class="ti-angle-left"></i>', '<i class="ti-angle-right"></i>' ],
    responsive: {
        0: {
            items: 1
        },
        400: {
            items: 1
        },
        740: {
            items: 1
        },
        940: {
            items: 1
        }
    },
};

  constructor() { }

  ngOnInit(): void {
  }

}
