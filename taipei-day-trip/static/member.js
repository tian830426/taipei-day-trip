// import navbar_signup_signin_lib from "./navbar_signup_signin_lib.js" 
// navbar_signup_signin_lib()

// import cookie_lib from "./cookie_lib.js"
// cookie_lib()

// import navbar_booking_lib from "./navbar_booking_lib.js"
// navbar_booking_lib()

// import navbar_member_lib from "./navbar_member_lib.js" 
// navbar_member_lib()

// let old_name = ""
// let old_email = ""

// let checkEye = document.getElementById("checkEye");
// let floatingPassword =  document.getElementById("floatingPassword");
// checkEye.addEventListener("click", function(e){
//   if(e.target.classList.contains('fa-eye')){
//     e.target.classList.remove('fa-eye');
//     e.target.classList.add('fa-eye-slash');
//     floatingPassword.setAttribute('type','text')
//   }else{
//     floatingPassword.setAttribute('type','password');
//     e.target.classList.remove('fa-eye-slash');
//     e.target.classList.add('fa-eye')
//   }
// });

// getcookie();
// //取得後端回傳token
// function getcookie() {
//   fetch("/api/user/auth", {
//     method: "GET",
//   }).then(function (response) {
//       return response.json();
//   }).then(function (data) {
//     console.log("取得token", data);
//     if (data["data"] != null) {
//     console.log(data["data"]["name"]);
//     console.log(data["data"]["email"]);

//     let old_name = document.querySelector("#name")
//     old_name.value = data["data"]["name"]
//     let old_email = document.querySelector("#email")
//     old_email.value = data["data"]["email"]

//     get_old_data(old_name,old_email)
//     // revise_user_data(old_name,old_email)

//     }
//     else{
//       window.location.assign("/")
//     }
//   });
// }

// function get_old_data(old_name,old_email){
//   console.log(old_name.value);
//   console.log(old_email.value);
//   revise_user_data()
// }


// function revise_user_data(old_name,old_email){
//   console.log(old_name.value);
//   console.log(old_email.value);
// document.querySelector('.revise_user_data_btn').addEventListener("click", (e)=>{
//   console.log("123");
//   let new_name = document.getElementById("#name").value;
//   console.log( new_name);
//   let new_email = document.getElementById("#email").value;
//   console.log(new_email);

//   //about email regex
//   let email_rule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

//   // validate ok or not
//   if(new_email.search(email_rule) != -1){
//       console.log('true');
//   }else{
//     console.log("格式輸入錯誤");
//       // document.querySelector(".navbar_signup_dialog").style.height = "390px";
//       // document.querySelector(".navbar_signup_email_status").innerHTML = "信箱格式輸入錯誤!";
//   }

//   const get_revise_data = {
//     old_name : old_name.value,
//     old_email : old_email.value,
//     new_name : new_name,
//     new_email : new_email
//   };
//   console.log(get_revise_data);

//   fetch("api/member",{
//     method: "POST",
//     credentials: "include",
//     body: JSON.stringify(get_revise_data),
//     caches: "no-cache",
//     headers: new Headers({
//     "content-type": "application/json",
//     }),
// }).then(function (response) {
//     return response.json();
// }).then(function (data) {
// if (data['ok'] == true && email.search(email_rule)!= -1) {
//     document.querySelector(".revise_success").style.display = "block"}
// else if (data['error'] == true) {
//    document.querySelector(".revise_error").style.display = "block"
//     } 
// else {
//         console.log("系統錯誤");
//     }
// })
// }
// ,false)}

