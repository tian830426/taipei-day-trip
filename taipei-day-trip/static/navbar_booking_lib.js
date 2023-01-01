// import cookie_lib from "./cookie_lib.js"
// cookie_lib()

function navbar_booking_lib(){
    //click navbar_booking_btn 
    document.querySelector(".navbar_booking_btn").addEventListener('click',(e)=>{
    console.log('確認登入狀態');
    getcookie_navbooking();
    },false) }
    
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
                document.querySelector(".navbar_signup_dialog").style.display = "block";
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
            // console.log(data != 0);
            // console.log(data != "");
            // console.log(data == "");
            // console.log(data == null);
            if (data == null){
                // console.log('null comein');
                document.querySelector('.main').style.display = 'none';
                document.querySelector('.main_page').style.display = 'block';
                document.querySelector('footer').style.display = 'none';
                document.querySelector('.footer_booking_page_no_reservation').style.display = 'block';
            }
            else{
                console.log(data["data"]);
                window.location.assign("/booking")
            }

            // if (data['data'] != ""){
            //     console.log(data["data"]);
            //     window.location.assign("/booking")
            // }
            // else{
            //     console.log('null comein');
            //     document.querySelector('.main').style.display = 'none';
            //     document.querySelector('.main_page').style.display = 'block';
            //     document.querySelector('footer').style.display = 'none';
            //     document.querySelector('.footer_booking').style.display = 'block';
            // }
        })
    }
// })
// }
    
export default navbar_booking_lib