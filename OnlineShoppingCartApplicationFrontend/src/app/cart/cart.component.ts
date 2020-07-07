import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  carts: []
  IDday: Boolean = false;
  subtotal: number = 0;
  qChanged: Boolean = false;
  deliveryCharges : number = 0;
  downloadPDF: Boolean = false;
  alerts: any[] = [];

  constructor(private cs: CartService, private router: Router) { }

  ngOnInit(): void {
    this.cs.cart.subscribe((result) => {
      this.carts = result
      this.cs.calculateTotal(this.cs.checkForID())
      this.deliveryCharges = this.cs.calculateDeliveryCharges()
    })

    this.IDday = this.cs.checkForID();

    this.cs.subtotal.subscribe(st => {
      this.subtotal = st
    })


  }

  valueChange(event) {
    if(event){
      this.cs.calculateTotal(this.cs.checkForID())
      this.cs.calculateCartCount()
      this.qChanged = false
    }else {
      this.qChanged = true
    }    
  }

  delete(idx) {
    this.cs.deleteFromCart(idx)
  }

  addProducts(){
    this.router.navigate(['/products'])
  }

  generateBill() {
    this.downloadPDF = true;
    setTimeout(() => {
      this.pdfDownload() 
    }, 500);       
  }

  pdfDownload() {
    var element  = document.getElementById('table-pdf') 

    html2canvas(element).then((canvas) => {

      var imgData = canvas.toDataURL('image/png')

      var doc = new jspdf()

      var imgHt = canvas.height * 208 / canvas.width
      doc.addImage(imgData, 0, 15, 208, imgHt)

      doc.save(`bill${new Date().getTime()}`)

      this.cs.clearCart()

      this.alerts.push('success')
    })
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }
}
