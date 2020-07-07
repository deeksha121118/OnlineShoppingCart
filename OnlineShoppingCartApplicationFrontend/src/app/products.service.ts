import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  public apiURL = environment.apiURL;
  productsSubject = new BehaviorSubject<any>([]);
  products = this.productsSubject.asObservable();

  constructor(private http: HttpClient) { }

  getProductList(params) {
		this.http.get(`${this.apiURL}api/get-products-list`, {
      params: params
    }).subscribe((data) => {
      this.productsSubject.next(data)
    })
  }
}
