//設定全域變數
let attractionIdDemo = "/api"
let attractionUrl = "";
attractionUrl = attractionIdDemo + window.location.pathname

let attractions = "";
let attractionName = "";
let attractionCategory = "";
let attractionMrt = "";
let attractionDescription = "";
let attractionAddress = "";
let attractionTransport = "";
let attractionImg = "";
let attractionImgLen = "";


if  (attractionUrl != ""){
    getData(); 
}
else{
    console.log("error page");
}

function getData(){
    fetch(attractionUrl).then(function(response){
        return response.json();
    }).then(function(data){
        console.log(data);
        attractionId = data["data"]["id"]
        
        attractions = data["data"];
        
        attractionImg = attractions["images"];
        attractionImgLen = attractionImg.length;
        
        attractionName = attractions["name"];
        attractionCategory = attractions["category"];
        attractionMrt = attractions["mrt"];
        attractionDescription = attractions["description"];
        attractionAddress = attractions["address"];
        attractionTransport = attractions["transport"];
   
        let name = document.querySelector('h2');
        name.textContent = attractionName;

        let category = document.querySelector('.category');
        category.textContent = attractionCategory;

        let mrt = document.querySelector('.mrt');
        mrt.textContent = attractionMrt;

        let description = document.querySelector('.content');
        description.textContent = attractionDescription;

        let address = document.querySelector('.address');
        address.textContent = attractionAddress;

        let traffic = document.querySelector('.traffic');
        traffic.textContent = attractionTransport

        for(let i = 0 ; i < attractionImgLen; i++){            
            let swiperImg = document.createElement('img');
            swiperImg.setAttribute('src',attractions["images"][i]);
            swiperImg.setAttribute('class','swiperImg');
            let imgBoxes = document.querySelector('.imgBoxes');
            imgBoxes.appendChild(swiperImg);
    
            let pagination = document.createElement('div');
            pagination.setAttribute('class','pagination');
            pagination.setAttribute('id',"circle-"+(i+1));

            // pagination.setAttribute('checked','');
            let swiperPagination = document.querySelector('.swiper-pagination');
            swiperPagination.appendChild(pagination);
            }
            let paginationId1 = document.getElementById('circle-'+1);
            paginationId1.style.backgroundColor='black';

            if(attractionImgLen != ''){
            changeImage();
        }
    });
}

document.getElementById('morning').addEventListener('click',(e)=>{
    document.querySelector('.price').textContent = "新台幣2000元";
},false);

document.getElementById('afternoon').addEventListener('click',(e)=>{
    document.querySelector('.price').textContent = "新台幣2500元";
},false);

        let imgBoxes = document.querySelector('imgBoxes');
        let prev = document.querySelector('.prev');
        let next = document.querySelector('.next');
        
        let idx = 0;

        function changeImage(){
                if (idx > attractionImgLen -1){
                    idx = 0;
                }else if (idx < 0){
                    idx = attractionImgLen - 1;
                }
            }

        function printImage(){   
            let swiperImg = document.querySelector(".swiperImg");
            swiperImg.setAttribute('src',attractions["images"][idx]);
            
        }

        function moveRightBall(){
            let pagination = document.querySelectorAll('.pagination');
            pagination[idx].style.backgroundColor = 'white';
            pagination[(idx+1)].style.backgroundColor = 'black';
        }
        
        function moveLeftBall(){
            let pagination = document.querySelectorAll('.pagination');  
            pagination[idx].style.backgroundColor = ' white';
            pagination[(idx-1)].style.backgroundColor = 'black';

        }

            prev.addEventListener('click',(e)=>{
                idx --
                changeImage();
                printImage();
                moveLeftBall();


                })
    
            next.addEventListener('click',(e)=>{
                idx ++
                changeImage();
                printImage();
                moveRightBall();
            })

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
function signoutData() {}
  let navsignout = document.querySelector(".nav-signout");
  navsignout.addEventListener("click", (e) => {
    fetch("/api/user/auth", {
      method: "DELETE",
    //   credentials: "include",
    //   body: JSON.stringify(hh),
    //   caches: "no-cache",
    //   headers: new Headers({
    //   "content-type": "application/json",
    // }),
    })
      .then(function (response) {
        // console.log(response);
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


