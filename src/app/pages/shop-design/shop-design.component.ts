import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbSlideEvent, NgbSlideEventSource, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-shop-design',
  templateUrl: './shop-design.component.html',
  styleUrls: ['./shop-design.component.scss']
})
export class ShopDesignComponent implements OnInit {
  @ViewChild('ngcarousel', { static: true }) ngCarousel: NgbCarousel;
  color: any;
  images = [{id:1,url:'../../../assets/images/dog.png'}, {id:2, url:'../../../assets/images/lookbook.jpg'}, {id:3, url:'../../../assets/images/dog.png'}];
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

  constructor() {
    
   }

  update(item){
    this.ngCarousel.select(item);
  }

  ngOnInit(): void {
  }

}
