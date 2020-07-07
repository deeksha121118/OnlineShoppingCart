import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartSubject = new BehaviorSubject<any>([]);
  cart = this.cartSubject.asObservable();
  subtotalSubject = new BehaviorSubject<number>(0);
  subtotal = this.subtotalSubject.asObservable();
  cartCountSubject = new BehaviorSubject<number>(0);
  cartCount = this.cartCountSubject.asObservable();

  constructor() { }

  addToCart(data) {
    data['quantity'] = 1;
    if(this.cartSubject.getValue().length == 0) {
      this.cartSubject.next(this.cartSubject.getValue().concat(data))
    }else {
      let exist = false
      this.cartSubject.getValue().map((val) => {
        if(data._id == val._id) {
          val.quantity = val.quantity + 1;  
          exist = true        
        }
      })
      if(exist)
        this.cartSubject.next(this.cartSubject.getValue())
      else
        this.cartSubject.next(this.cartSubject.getValue().concat(data))
    } 
  }

  checkForID(): Boolean {
    let date = new Date()
    if(date.getDate() == 15 && date.getMonth() + 1 == 8)
      return true;
    else
      return false;
  }

  calculateTotal(idday) {
    let total = 0;
    this.cartSubject.getValue().map((val) => {
      if(!idday){
        total = total + ((val.cost - (val.cost * (val.discount/100))) * val.quantity)
      }else {
        total = total + ((val.cost - (val.cost * ((val.discount+val.addIDdiscount)/100))) * val.quantity)
      }
    })
    this.subtotalSubject.next(total)
  }

  deleteFromCart(idx) {
    this.cartSubject.getValue().splice(idx, 1)
    this.cartSubject.next(this.cartSubject.getValue())
  }

  calculateDeliveryCharges() : number {
    let catName = []
    let deliveryCharges = 0
    this.cartSubject.getValue().map((val) => {
      if(!catName.includes(val.category.name)){
        catName.push(val.category.name)
        deliveryCharges = deliveryCharges + val.category.deliveryCharges
      }      
    })
    return deliveryCharges;
  }

  calculateCartCount() {
    let total = 0;
    this.cartSubject.getValue().map((val) => {
      total = total + Number(val.quantity)
    })
    this.cartCountSubject.next(total)
  }

  clearCart() {
    this.cartSubject.next([])
  }
}
