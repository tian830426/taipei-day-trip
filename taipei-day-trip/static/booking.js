import navbar_signin_lib from "./navbar_signin_lib.js" 
navbar_signin_lib()

// import cookie_lib from "./cookie_lib.js"
// cookie_lib()

import navbar_booking_lib from "./navbar_booking_lib.js"
navbar_booking_lib()

getcookie();
function getcookie() {
  fetch("/api/user/auth", {
    method: "GET",
  }).then(function (response) {
      return response.json();
  }).then(function (data) {
    console.log("取得token", data);
    
    if (data["data"] != null) {
      console.log("登入中狀態");
      get_booker(data);
      get_booker_two(data);
      get_newtour();
      let navsignup = document.querySelector(".nav-signup");
      navsignup.style.display = "none";
      let navsignout = document.querySelector(".nav-signout");
      navsignout.style.display = "block";  
    }
  });
}

//取得預定資料 印在前端畫面上
function get_newtour(){
  fetch("/api/booking",{
  method:"GET",
  }).then(function(response){
    return response.json();
  }).then(function(data){
    console.log(data);
    if(data["data"] != null){
      let booking_image = document.querySelector('.booking_image')
      booking_image.setAttribute('src',data['data']["attraction"]["image"])

      let city_name = document.querySelector('.city_name')
      city_name.textContent = data['data']["attraction"]["name"]

      let city_date = document.querySelector('.city_date')
      city_date.textContent = data['data']["date"]

      let city_time = document.querySelector('.city_time')
      city_time.textContent = data['data']["time"]

      let city_fee = document.querySelector('.city_fee')
      city_fee.textContent = data['data']["price"]

      let city_site = document.querySelector('.city_site')
      city_site.textContent = data["data"]['attraction']["address"]

      let city_price = document.querySelector('.city_price')
      city_price.textContent = data['data']["price"]
    }
    else{
      document.querySelector('.main').style.display = 'none';
      document.querySelector('.main_page').style.display = 'block';
      document.querySelector('footer').style.display = 'none';
      document.querySelector('.footer_booking').style.display = 'block';
      // window.location.assign("/attraction/")
    }
  })
}

// function get_cookie(){ 
//   fetch("/api/user/auth", {
//       method: "GET",
//       }).then(function (response) {
//       return response.json();
//       }).then(function (data) {
//       console.log("取得token", data);
//       get_booker(data)
//       get_booker_two(data)

  // if (data["data"] != null) {
  //     // console.log("登入中狀態");
  //     // let navsignup = document.querySelector(".nav-signup");
  //     // navsignup.style.display = "none";
  //     // let navsignout = document.querySelector(".nav-signout");
  //     // navsignout.style.display = "block"; 
  // }
  // else{
  //     console.log('未登入狀態');
  // }
// })     
// }



//在booking 呼叫 token 資訊 取得登入者姓名
function get_booker(data){
  document.querySelector(".city_booker").textContent = data["data"]["name"]
}
  // cookie_lib()
  // let data = cookie_lib()
  

function get_booker_two(data){
  // let data = cookie_lib()
  document.querySelector(".city_booker_two").textContent = data["data"]["name"]
}
  
//delete method
document.querySelector('.icon_delete').addEventListener('click',(e)=>{
  // function delete_newtour(){ 
  fetch("/api/booking", {
    method: "DELETE",
  }).then(function (response) {
    console.log(response);
    return response.json();
  }).then(function (data) {
    console.log(data);
    if(data["ok"] == true){
      document.querySelector('.main').style.display='none';
      document.querySelector('.main_page').style.display ='block';

      document.querySelector('footer').style.display = 'none';
      document.querySelector('.footer_booking').style.display = 'block';
    }
    else{
      console.log('沒有成功刪除');
    }
   })
} 
,false)
// delete_newtour() ;



// window.addEventListener('load',function(){
//   console.log('抓到你刷新頁面了嗎，讓我們檢查看看 delete');
//       document.querySelector('.main').style.display='none';
//       document.querySelector('.main_page').style.display ='block';
//       document.querySelector('footer').style.display = 'none';
//       document.querySelector('.footer_booking').style.display = 'block';
//   // getcookie();
//   // let cookie_data = cookie_lib()
//   }) 