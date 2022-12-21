import navbar_signin_lib from "./navbar_signin_lib.js" 
navbar_signin_lib()

// import cookie_lib from "./cookie_lib.js"
// cookie_lib()

import navbar_booking_lib from "./navbar_booking_lib.js"
navbar_booking_lib()

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

let attractionId = ""

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
  document.querySelector('#price').textContent = "2000";
},false);

document.getElementById('afternoon').addEventListener('click',(e)=>{
  document.querySelector('#price').textContent = "2500";
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

// click booking_btn 
document.querySelector('.readyBooking').addEventListener('click',(e)=>{
  console.log('進入 readybooking btm');
  getcookie_readybooking();
  // let cookie_lib = cookie_lib()
  // if (cookie_lib != null) {
  //   console.log("登入中狀態 ready book"); 
  //   insert_newtour();
  // }
  // else{
  //   //搜尋不到登入狀態 讓註冊登入視窗彈出
  //   console.log('未登入狀態');
  //   let signupContainer = document.querySelector(".signupContainer");
  //   signupContainer.style.display = "block";
  //   let main = document.querySelector('#main');
  //   main.style.opacity=.7;
  // } 
},false)

//點擊 開始預約行程 並判斷是否登入
function getcookie_readybooking(){
  fetch("/api/user/auth", {
    method: "GET",
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data["data"] != null) {
      console.log("登入中狀態 ready book"); 
      // console.log(data);
      // fetch('/api/booking',data = data["data"]['id'])
      // data = data["data"]['id']
      // console.log(data["data"]['id']);
      insert_newtour();
    }
    else{
      //搜尋不到登入狀態 讓註冊登入視窗彈出
      console.log('未登入狀態');
      let signupContainer = document.querySelector(".signupContainer");
      signupContainer.style.display = "block";
      let main = document.querySelector('#main');
      main.style.opacity=.7;
    } 
    });
}

function insert_newtour(){
  // let people_id = getcookie_readybooking()
  // people_id.then(data)
  // console.log(people_id);
  let date = document.getElementById('date').value;
  let time = document.getElementsByName('time');
  for (var i = 0 ; length = time.length ; i++){
    if(time[i].checked){
      break;
    }
  }
  let price = document.getElementById('price').textContent
  let new_tour = {
    attractionId: attractionId,
    date: date,
    time: time[i].value,
    price: price,
    // people: data
  }
  
  fetch("/api/booking",{
    method: "POST",
    credentials: "include",
    body: JSON.stringify(new_tour),
    caches: "no-cache",
    headers: new Headers({
      "content-type": "application/json",
  }),
}).then(function(response){
  return response.json();
}).then(function(data){
  if (data['ok'] == true){
    console.log(data);
    window.location.assign("/booking")
  }
  else{
    //未登入狀況進到/booking直接跳轉首頁
    window.location.assign("/")
  }
})
}

