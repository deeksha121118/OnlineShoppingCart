import { Component, OnInit, TemplateRef } from '@angular/core';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  cartCount = 0

  constructor(private cs: CartService, private router: Router) { }

  ngOnInit(): void {
    this.cs.cart.subscribe(result => {
      // this.cartCount = result.length;
      this.cs.calculateCartCount()
    })

    this.cs.cartCount.subscribe(count => {
      this.cartCount = count;
    })
  }

  goToCart() {
    this.router.navigate(['/'])
  }
}
