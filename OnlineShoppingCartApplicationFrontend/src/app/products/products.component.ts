import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { FormControl } from '@angular/forms';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: [];
  search = new FormControl('');
  params: Object = {search: ''}
  constructor(private ps: ProductsService, private cs: CartService, private router: Router) { }

  ngOnInit(): void {
    
    this.ps.products.subscribe((result) => {
      this.products = result
    })

    this.search.valueChanges.subscribe((val) => {
      this.params['search'] = val;
      this.ps.getProductList(this.params)
    })
    
    this.ps.getProductList(this.params)
  }

  addToCart(idx) {
    this.cs.addToCart(this.products[idx]);
    this.router.navigate(['/'])
  }
}
