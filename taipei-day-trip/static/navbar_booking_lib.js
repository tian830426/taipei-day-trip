// import cookie_lib from "./cookie_lib.js"
// cookie_lib()

function navbar_booking_lib(){
    //click navbar_booking_btn 
    document.querySelector(".nav-booking").addEventListener('click',(e)=>{
    console.log('確認登入狀態');
    getcookie_navbooking();
    // let data = cookie_lib()
    // console.log('666');
    // console.log(data["data"]);
    // fetch("/api/user/auth", {
    //     method: "GET",
    //     }).then(function (response) {
    //        return response.json();
    //     }).then(function (data) {
    // if (data != null) {
    //     console.log("登入中狀態");
    //     // window.location.assign("http://172.20.10.2:3000/booking")
    //     check_if_reservation();
    // }
    // else{
    //     //搜尋不到登入狀態 讓註冊登入視窗彈出
    //     console.log('未登入狀態');
    //     // window.location.replace(window.location.href);
    //     let signupContainer = document.querySelector(".signupContainer");
    //     signupContainer.style.display = "block";
    //     let main = document.querySelector('#main');
    //     main.style.opacity=.7;
    //     }
    },false) }
    // )
    
    function getcookie_navbooking(){
        fetch("/api/user/auth", {
        method: "GET",
        }).then(function (response) {
           return response.json();
        }).then(function (data) {
        console.log("取得token", data);
            if (data["data"] != null) {
                console.log("登入中狀態，並確認登入者 id");
                //確認資料庫是否已有一筆資料
                check_if_reservation();
            }
            else{
                //搜尋不到登入狀態 讓註冊登入視窗彈出
                console.log('未登入狀態');
                document.querySelector(".signupContainer").style.display = "block";
                document.querySelector('#main').style.opacity=.7;
            } 
        });
    }
    
    function check_if_reservation(){
        fetch("/api/booking",{
            method:'GET',
        }).then(function(response){
            console.log(response);
            return response.json();
        }).then(function(data){
            console.log(data);
            if (data['data'] != ""){
                window.location.assign("http://172.20.10.2:3000/booking")
            }
            else{
                document.querySelector('.main').style.display = 'none';
                document.querySelector('.main_page').style.display = 'block';
                document.querySelector('footer').style.display = 'none';
                document.querySelector('.footer_booking').style.display = 'block';
            }
        })
    }
// })
// }
    
export default navbar_booking_lib