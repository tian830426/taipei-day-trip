import navbar_signup_signin_lib from "./navbar_signup_signin_lib.js" 
navbar_signup_signin_lib()

import cookie_lib from "./cookie_lib.js"
cookie_lib()

import navbar_booking_lib from "./navbar_booking_lib.js"
navbar_booking_lib()

// import navbar_member_lib from "./navbar_member_lib.js" 
// navbar_member_lib()

getcookie();
//取得後端回傳token
function getcookie() {
  fetch("/api/user/auth", {
    method: "GET",
  }).then(function (response) {
      return response.json();
  }).then(function (data) {
    console.log("取得token", data);
    if (data["data"] != null) {
      console.log("登入中狀態");
      let navsignup = document.querySelector(".navbar_signup_signin_btn");
      navsignup.style.display = "none";
      let navsignout = document.querySelector(".navbar_signout_btn");
      navsignout.style.display = "block";
     
    }
    else{
      window.location.assign("/")
    }
  });
}

 get_order_number();
function get_order_number(){
    let thankyou_page_url = window.location.search
    // let thankyou_url = "/thankyou"
    let order_number = thankyou_page_url.replace("?number=","")
    console.log(order_number);
    let order_number_url = "/api/order/" + order_number
    fetch (order_number_url,{
      method:"GET",
    }).then(function(response){
        console.log(response);
        console.log(response["status"]);
    if (response["status"] == 404){
        return window.location.assign("/")
    }
    else
        return response.json();  
    }).then(function(data){
        console.log(data);

    if (data["data"]["status"] == 0){
        console.log("訂購成功"); 
        console.log(thankyou_page_url);
        document.querySelector(".order_number").textContent = order_number
        document.querySelector('.thankyou_page_error').style.display = 'none';
        document.querySelector('footer').style.display = 'none';
        document.querySelector('.footer_booking_page_no_reservation').style.display = 'block';  
    }
    else{
        console.log("付款失敗");
        // document.querySelector(".order_number").textContent = order_number
        document.querySelector('.thankyou_page').style.display = 'none';
        document.querySelector('.thankyou_page_error').style.display = 'block';
        document.querySelector('footer').style.display = 'none';
        document.querySelector('.footer_booking_page_no_reservation').style.display = 'block'; 
      }
    })
  }
