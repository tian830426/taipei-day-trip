//week-4 signin /signout
// click  signup container alert
let navSignup = document.querySelector(".nav-signup");
navSignup.addEventListener(
  "click",
  (e) => {
    let signupContainer = document.querySelector(".signupContainer");
    signupContainer.style.display = "block";
    let main = document.querySelector('#main');
    main.style.opacity=.7;
  },
  false
);

// control xmark
let signupXmark = document.querySelector(".signupXmark");
signupXmark.addEventListener(
  "click",
  (e) => {
    let signupContainer = document.querySelector(".signupContainer");
    signupContainer.style.display = "none";
    main.style.opacity=1;
  },
  false
);

let signinXmark = document.querySelector(".signinXmark");
signinXmark.addEventListener(
  "click",
  (e) => {
    let signinContainer = document.querySelector(".signinContainer");
    signinContainer.style.display = "none";
    main.style.opacity=1;
  },
  false
);

//control signup and singin container page
let signinToggle = document.querySelector(".signinToggle");
signinToggle.addEventListener("click", (e) => {
  let signupContainer = document.querySelector(".signupContainer");
  signupContainer.style.display = "none";
  let signinContainer = document.querySelector(".signinContainer");
  signinContainer.style.display = "block";
  main.style.opacity=.7;
});

let signupToggle = document.querySelector(".signupToggle");
signupToggle.addEventListener("click", (e) => {
  let signupContainer = document.querySelector(".signupContainer");
  signupContainer.style.display = "block";
  let signinContainer = document.querySelector(".signinContainer");
  signinContainer.style.display = "none";
});

// signup (POST)
let signupBtn = document.querySelector(".signupBtn");
signupBtn.addEventListener("click", (e) => {
  signupData();
});

function signupData() {
  const name = document.getElementById("signup_name").value;
  const email = document.getElementById("signup_email").value;
  const password = document.getElementById("signup_password").value;

  emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
 
  //validate ok or not
  if(email.search(emailRule)!= -1){
    console.log('true');
  }else{
    let signupContainer = document.querySelector(".signupContainer");
    signupContainer.style.height = "390px";
        let signup_emailStatus = document.querySelector(".signup_emailStatus");
        signup_emailStatus.innerHTML = "信箱格式輸入錯誤!";
  }

  const signupData = {
    name: name,
    email: email,
    password: password,
  };

  fetch("/api/user", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(signupData),
    caches: "no-cache",
    headers: new Headers({
      "content-type": "application/json",
    }),
  })
    .then(function (response) {
      // if (response.status == 200){
      // let signupStatus = document.querySelector(".signupStatus")
      // signupStatus.innerHTML = '此信箱已註冊過，請重新註冊或登入'
      // }
      // console.log(response.status);
      return response.json();
    })
    .then(function (data) {
      // console.log(data);
      // console.log(data[1]);
      if (data['ok'] == true && email.search(emailRule)!= -1) {
        let signupStatus = document.querySelector(".signupStatus");
        signupStatus.innerHTML = "恭喜你！註冊成功！";
      } else if (data['error'] == true) {
        let signupContainer = document.querySelector(".signupContainer");
        signupContainer.style.height = "375px";
        let signupStatus = document.querySelector(".signupStatus");
        signupStatus.innerHTML = "此信箱已註冊過，請重新輸入";
      } else {
        console.log("系統錯誤");
      }
    });
}

let signinBtn = document.querySelector(".signinBtn");
signinBtn.addEventListener("click", (e) => {
  signinData();
  // getcookies();
});

//signin (PUT)
function signinData() {
  const email = document.getElementById("signin_email").value;
  const password = document.getElementById("signin_password").value;

  emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
 
  //validate ok or not
  if(email.search(emailRule)!= -1){
    console.log('true');
  }else{
    let signinContainer = document.querySelector(".signinContainer");
    signinContainer.style.height = "345px";
        let signin_emailStatus = document.querySelector(".signin_emailStatus");
        signin_emailStatus.innerHTML = "信箱格式輸入錯誤!";
  }

  const signinData = {
    email: email,
    password: password,
  };

  fetch("/api/user/auth", {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify(signinData),
    caches: "no-cache",
    headers: new Headers({
      "content-type": "application/json",
    }),
  })
    .then(function (response) {
      // console.log(response);
      return response.json();
    })
    .then(function (data) {
      if (data['ok'] == true) {
        // console.log('123');
        // let navSignup = document.querySelector(".nav-signup")
        // navSignup.innerHTML = '已登入'
        let signinContainer = document.querySelector(".signinContainer");
        signinContainer.style.display = "none";
        main.style.opacity=1;
        getcookie();
      } else if (data["error"] == true) {
        // signinContainer.style.display= 'none';
        // let signinContainerPlus = document.querySelector(".signinContainerPlus");
        // signinContainerPlus.style.display= 'block';
        let signinContainer = document.querySelector(".signinContainer");
        signinContainer.style.height = "320px";
        let signinStatus = document.querySelector(".signinStatus");
        signinStatus.innerHTML = "帳號密碼輸入錯誤，請重新輸入";
      }
    });
}

// function xhrr(){
//   let xhr = new XMLHttpRequest();
// xhr.open('get',"/api/user/auth",true)
// xhr.send(null)
// xhr.onload = function(){
//  if (xhr.status === 200){
//   let navsignup = document.querySelector(".nav-signup");
//   navsignup.style.display = "none";
//   let navsignout = document.querySelector(".nav-signout");
//   navsignout.style.display = "block";

//   console.log(xhr);
//   console.log(xhr.response);
//  }
// }
// }

// console.log(xhr);

//signin (GET)

window.addEventListener('load',function(){
  console.log('抓到你刷新頁面了嗎，讓我們檢查看看 token');
  getcookie();
})

// getcookie();
function getcookie() {
  fetch("/api/user/auth", {
    method: "GET",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("取得token", data);
      get_booker(data);
      get_booker_two(data);
      if (data["data"] != null) {
        console.log("登入中狀態");
        let navsignup = document.querySelector(".nav-signup");
        navsignup.style.display = "none";
        let navsignout = document.querySelector(".nav-signout");
        navsignout.style.display = "block"; 
        
      } 
    });
}
// signoutData();
function signoutData(){}
  let navsignout = document.querySelector(".nav-signout");
  navsignout.addEventListener("click", (e) => {
    fetch("/api/user/auth", {
      method: "DELETE",
    })
      .then(function (response) {
        return response.json();
      })

      .then(function (data) {
        console.log(data);
        if (data['ok'] == true ) {
          console.log("成功清除");
          let navsignup = document.querySelector(".nav-signup");
          navsignup.style.display = "block";
          let navsignout = document.querySelector(".nav-signout");
          navsignout.style.display = "none";
        } else {
          console.log("有問題");
        }
      });
  });

//week-5

//點擊預定行程頁面，
let nav_booking = document.querySelector(".nav-booking")
nav_booking.addEventListener('click',(e)=>{
  console.log('確認登入狀態');
  getcookie_navbooking();
},false)

function getcookie_navbooking(){
  fetch("/api/user/auth", {
    method: "GET",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("取得token", data);
      if (data["data"] != null) {
        console.log("登入中狀態");
        
        window.location.assign("http://172.20.10.2:3000/booking")
      }
      else{
        //搜尋不到登入狀態 讓註冊登入視窗彈出
        console.log('未登入狀態');
        // window.location.replace(window.location.href);
        let signupContainer = document.querySelector(".signupContainer");
        signupContainer.style.display = "block";
        let main = document.querySelector('#main');
        main.style.opacity=.7;
      } 
    });
} 

//取得預定資料 印在前端畫面上
  get_newtour();
  function get_newtour(){
  fetch("/api/booking",{
    method:"GET",
  }).then(function(response){
    return response.json();
  }).then(function(data){
    console.log(data);
    console.log(data['data']["attraction"]["image"]);

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

  })
}
//在booking 呼叫 token 資訊 取得登入者姓名
function get_booker(data){
  let city_booker = document.querySelector(".city_booker")
  city_booker.textContent = data["data"]["name"]
  
}

function get_booker_two(data){
  let city_booker_two = document.querySelector(".city_booker_two")
  city_booker_two.textContent = data["data"]["name"]
}


//delete method
let icon_delete = document.querySelector('.icon_delete')
icon_delete.addEventListener('click',(e)=>{
  delete_newtour();
},)

function delete_newtour(){ 
fetch("/api/booking", {
  method: "DELETE",
}).then(function (response) {
    console.log(response);
    return response.json();
  }).then(function (data) {
    console.log(data);
    if(data["ok"] == true){
      let main = document.querySelector('.main')
      main.style.display='none';
      let main_page = document.querySelector('.main_page')
      main_page.style.display ='block';

      let footer = document.querySelector('footer')
      footer.style.display = 'none';
      let footer_booking = document.querySelector('.footer_booking')
      footer_booking.style.display = 'block';

    }
    else{
      console.log('沒有成功刪除');
    }
   })
  }

  //點擊 登出系統 跳回首頁
// let navsignout = document.querySelector(".nav-signout"); 
navsignout.addEventListener('click',(e)=>{
  console.log('回首頁');
  window.location.assign("http://172.20.10.2:3000/") 
})