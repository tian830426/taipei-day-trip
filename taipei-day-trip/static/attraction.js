import navbar_signup_signin_lib from "./navbar_signup_signin_lib.js" 
navbar_signup_signin_lib()

// import cookie_lib from "./cookie_lib.js"
// cookie_lib()

import navbar_booking_lib from "./navbar_booking_lib.js"
navbar_booking_lib()

// import navbar_member_lib from "./navbar_member_lib.js" 
// navbar_member_lib()

//set up global variable
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
    get_attraction_data(); 
}
else{
    console.log("error page");
}

function get_attraction_data(){
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
   
      document.querySelector(".attraction_page_tour_title").textContent = attractionName;

      document.querySelector('.attraction_page_tour_category').textContent = attractionCategory;

      document.querySelector('.attraction_page_tour_mrt').textContent = attractionMrt;

      document.querySelector('.attraction_page_btm_content').textContent = attractionDescription;

      document.querySelector('.attraction_page_btm_address').textContent = attractionAddress;

      document.querySelector('.attraction_page_btm_traffic').textContent = attractionTransport

      for(let i = 0 ; i < attractionImgLen; i++){            
        let swiperImg = document.createElement('img');
        swiperImg.setAttribute('src',attractions["images"][i]);
        swiperImg.setAttribute('class','swiper_img');
        let imgBoxes = document.querySelector('.attraction_page_top_imgBoxes');
        imgBoxes.appendChild(swiperImg);

        let pagination = document.createElement('div');
        pagination.setAttribute('class','pagination');
        pagination.setAttribute('id',"circle-"+(i+1));

        // pagination.setAttribute('checked','');
        let swiperPagination = document.querySelector('.swiper_pagination');
        swiperPagination.appendChild(pagination);
        }
        let paginationId1 = document.getElementById('circle-'+1);
        paginationId1.style.backgroundColor='black';

        if(attractionImgLen != ''){
        swiper_attraction_image();
        }
    });
}

document.getElementById('morning').addEventListener('click',(e)=>{
  document.querySelector('#price').textContent = "2000";
},false);

document.getElementById('afternoon').addEventListener('click',(e)=>{
  document.querySelector('#price').textContent = "2500";
},false);

let imgBoxes = document.querySelector('.attraction_page_top_imgBoxes');
let prev = document.querySelector('.prev');
let next = document.querySelector('.next');
        
let idx = 0;

function swiper_attraction_image(){
  if (idx > attractionImgLen -1){
    idx = 0;
  }else if (idx < 0){
    idx = attractionImgLen - 1;
  }
    }

function print_image(){   
  let swiperImg = document.querySelector(".swiper_img");
  swiperImg.setAttribute('src',attractions["images"][idx]);
}

function move_right_ball(){
  let pagination = document.querySelectorAll('.pagination');
  pagination[idx].style.backgroundColor = 'white';
  pagination[(idx+1)].style.backgroundColor = 'black';
}

function move_left_ball(){
  let pagination = document.querySelectorAll('.pagination');  
  pagination[idx].style.backgroundColor = 'white';
  pagination[(idx-1)].style.backgroundColor = 'black';

}

prev.addEventListener('click',(e)=>{
  idx --
  swiper_attraction_image();
  print_image();
  move_left_ball();
  })
    
next.addEventListener('click',(e)=>{
  idx ++
  swiper_attraction_image();
  print_image();
  move_right_ball();
})

// click booking_btn 
document.querySelector('.attraction_page_tour_block_booking_btn').addEventListener('click',(e)=>{
  console.log('進入 readybooking btm');
  get_cookie_readybooking();
},false)

//點擊 開始預約行程 並判斷是否登入
function get_cookie_readybooking(){
  fetch("/api/user/auth", {
    method: "GET",
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data["data"] != null) {
      console.log("登入中狀態 ready book"); 
      console.log(data);
      insert_booking();
    }
    else{
      //搜尋不到登入狀態 讓註冊登入視窗彈出
      console.log('未登入狀態');
      let signupContainer = document.querySelector(".navbar_signup_dialog");
      signupContainer.style.display = "block";
      let main = document.querySelector('#main');
      main.style.opacity=.7;
    } 
    });
}

function insert_booking(){

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

// 設定日期僅能選擇目前日期
var minDate = new Date();
minDate.setDate(minDate.getDate());
document.getElementById("date").min = minDate.toISOString().split("T")[0];
