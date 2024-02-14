import { Injectable } from '@angular/core';
import { retry, catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Routes, RouterModule, Router, ActivatedRoute } from "@angular/router";
import { environment } from '../environments/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({})
};
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  
  url: string = environment.commonURL;
  webcommonURL: string = environment.webcommonURL;
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
     
  }

   
   
  completeorder(assignContestObj: any) {
    return this.http.post<any>(this.url + "assignContest_byrazorpay", assignContestObj, httpOptions).pipe(
      retry(1),

      catchError(this.handleError)
    );
  } 
 
  formattedDate(dateStr: string) {
    return new Date(dateStr);
  }
  getuserById(id: any) {
    return this.http.get<any>(this.url + "detailsofstudentbycidint/" + id, httpOptions).pipe(
      retry(1),

      catchError(this.handleError)
    );
  }
  participateNow(login_id: any, order_id: any, amount: any) {
    let postdata = { login_id: login_id, order_id: order_id, amount: amount };



    return this.http.post<any>(this.url + "generateBackenedorder", postdata, httpOptions).pipe(
      retry(1),

      catchError(this.handleError)
    );
  }
  
  
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      console.log("Check your netwrok connectivity !!!");


      errorMessage = `Error: ${error.error.message}`;
    } else {
      console.log("Check your netwrok connectivity !");
      // server-side error 
      //this.showSnackbarMessage("Check your netwrok connectivity !", "red");
      //  errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      errorMessage = `Check your netwrok connectivity !`;
    }

    return throwError(errorMessage);

  }
}
