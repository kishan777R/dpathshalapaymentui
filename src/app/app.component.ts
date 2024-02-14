import { Component } from '@angular/core';
import { CommonService } from './common.service';
import { Router, ActivatedRoute } from '@angular/router';


declare var Razorpay: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  order_id_for_backend = ''; orderid = '';
  amount = 0;
  login_id = '';
  subs: any;
  options: any = {
    "key": "", // Enter the Key ID generated from the Dashboard
    "amount": "", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "Dpathshala.live",
    "description": "Registration Fee Transaction",
    "image": "https://dpathshala.live/logo.png",
    "order_id": "", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    // "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
    // "prefill": {
    //   "name": "Gaurav Kumar",
    //   "email": "gaurav.kumar@example.com",
    //   "contact": "9999999999"
    // },
    // "notes": {
    //   "address": "Razorpay Corporate Office"
    // },
    // "theme": {
    //   "color": "#3399cc"
    // },
    "handler": (res: any) => {
      console.log(res);
    }

  };
  constructor(public CommonService: CommonService, private router: Router, private activeRoute: ActivatedRoute) {

  }

  ngOnInit(): void {

    this.subs = this.activeRoute.queryParams.subscribe(params => {
     console.log(params)
     
     
      this.login_id = params['login_id'];
      this.order_id_for_backend = params['order_id'];
      this.amount = parseFloat(params['amount']);
if(this.login_id){


      this.getuserById()
    }
    });

  }
  userDetail: any;
  getuserById() {  
    this.subs = this.CommonService.getuserById(this.login_id).subscribe((res) => {

      if (Boolean(res)) {
        this.userDetail = res;
        this.participateNow();
 
      } else {
      window.location.href = "https://dpathshala.live/checkout"
      }

    },
      (err) => {
      window.location.href = "https://dpathshala.live/checkout"
      });

  }
  participateNow() {

    this.orderid = '';

    this.subs = this.CommonService.participateNow(this.login_id, this.order_id_for_backend, this.amount).subscribe((res) => {

      this.orderid = res.order_id;

      this.options = {
        "key": res.key, // Enter the Key ID generated from the Dashboard
        "amount": this.amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise


        "order_id": res.rajororder.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1

        "prefill": {
          "name": this.userDetail.first_name,
          "email": this.userDetail.email,
          "contact": this.userDetail.mobile
        },
        "notes": res.rajororder.notes,
        "theme": {
          "color": "#3399cc"
        },
        modal: {
          // We should prevent closing of the form when esc key is pressed.
          escape: false,
        },


      };
      this.options.handler = ((response: any, error: any) => {
        this.options.response = response;
        console.log(response);
        console.log(this.options);
        // call your backend api to verify payment signature & capture transaction

        var obj = {
          "transaction_details": response, "login_id": this.login_id,
          "email": this.userDetail.email,
          "amount_paid": this.amount,
          "order_id": this.orderid, "transaction_id": response.razorpay_order_id
        };


        this.completeorder(response);
      });
      this.options.modal.ondismiss = (() => {
        // handle the case when user closes the form while transaction is in progress
        console.log('Transaction cancelled.');

        alert('Transaction cancelled.'); window.location.href = "https://dpathshala.live/checkout"
      });
      try {
        var rzp1 = new Razorpay(this.options);
        rzp1.open();
      }
      catch (e) {
     console.log(e);//   location.reload();
      }



    },
      (err) => {
        window.location.href = "https://dpathshala.live/checkout"

      });
  }


  completeorder(obj: any) {
    let payment_status ='Credit'

    window.location.href = this.CommonService.webcommonURL+ "redirect?razorpay_order_id="+obj.razorpay_order_id+'&razorpay_payment_id='+obj.razorpay_payment_id+'&razorpay_signature='+obj.razorpay_signature+'&payment_status='+payment_status+'&oid='+this.orderid
 
  }
}
