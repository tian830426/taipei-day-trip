// import cookie_lib from "./cookie_lib.js"
// cookie_lib()

function navbar_signup_signin_lib(){

    //click navbar_signup_signin_btn pop-up navbar_signup_dialog
    document.querySelector(".navbar_signup_signin_btn").addEventListener("click",(e) => {

    document.querySelector(".navbar_signup_dialog").style.display = "block";
    document.querySelector('#main').style.opacity=.7;}
    ,false)

    //click navbar_signup_xmark close navbar_signup_dialog 
    document.querySelector(".navbar_signup_xmark").addEventListener("click",(e) => {
    document.querySelector(".navbar_signup_dialog").style.display = "none";
    main.style.opacity=1;}
    ,false)

    //click navbar_signin_xmark close navbar_signup_dialog 
    document.querySelector(".navbar_signin_xmark").addEventListener("click",(e) => {
    document.querySelector(".navbar_signin_dialog").style.display = "none";
    main.style.opacity=1;}
    ,false)

    //toggle navbar_signup_dialog and navbar_signup_dialog  
    document.querySelector(".navbar_signup_toggle").addEventListener("click", (e) => {
    document.querySelector(".navbar_signup_dialog").style.display = "block";
    document.querySelector(".navbar_signin_dialog").style.display = "none";}
    ,false)

    document.querySelector(".navbar_signin_toggle").addEventListener("click",(e) => {
    document.querySelector(".navbar_signup_dialog").style.display = "none";
    document.querySelector(".navbar_signin_dialog").style.display = "block";
    main.style.opacity=.7;}
    ,false)

    //click navbar_signup_btn use post-method send name/email/password to backend userinformation table
    document.querySelector(".navbar_signup_btn").addEventListener("click", (e) => {
        get_signup_data();
        // get_signin_data();
    })

    let checkEye_signup = document.getElementById("checkEye_signup");
    let floatingPassword_signup =  document.getElementById("signup_password");
    checkEye_signup.addEventListener("click", function(e){
    if(e.target.classList.contains('fa-eye')){
        e.target.classList.remove('fa-eye');
        e.target.classList.add('fa-eye-slash');
        floatingPassword_signup.setAttribute('type','text')
    }else{
        floatingPassword_signup.setAttribute('type','password');
        e.target.classList.remove('fa-eye-slash');
        e.target.classList.add('fa-eye')
    }
    });

    function get_signup_data(){
        let name = document.getElementById("signup_name").value;
        let email = document.getElementById("signup_email").value;
        let password = document.getElementById("signup_password").value;

        //about email regex
        let email_rule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

        // validate ok or not
        if(email.search(email_rule) != -1){
            console.log('true');
        }else{
            document.querySelector(".navbar_signup_dialog").style.height = "390px";
            document.querySelector(".navbar_signup_email_status").innerHTML = "信箱格式輸入錯誤!";
        }

        const get_signup_data = {
            name: name,
            email: email,
            password: password,
            };

        fetch("/api/user",{
            method: "POST",
            credentials: "include",
            body: JSON.stringify(get_signup_data),
            caches: "no-cache",
            headers: new Headers({
            "content-type": "application/json",
            }),
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
        if (data['ok'] == true && email.search(email_rule)!= -1) {
            document.querySelector(".navbar_signup_status").innerHTML = "恭喜你！註冊成功！"} 
        else if (data['error'] == true) {
            document.querySelector(".navbar_signup_dialog").style.height = "375px";
            document.querySelector(".navbar_signup_status").innerHTML = "此信箱已註冊過，請重新輸入";
            } 
        else {
                console.log("系統錯誤");
            }
        })
    }

    //click navbar_signin_btn use post-method send email/password to backend userinformation table
    document.querySelector(".navbar_signin_btn").addEventListener("click", (e) => {
        get_signin_data();
    },false)


    let checkEye_signin = document.getElementById("checkEye_signin");
    let floatingPassword_signin =  document.getElementById("signin_password");
    checkEye_signin.addEventListener("click", function(e){
    if(e.target.classList.contains('fa-eye')){
        e.target.classList.remove('fa-eye');
        e.target.classList.add('fa-eye-slash');
        floatingPassword_signin.setAttribute('type','text')
    }else{
        floatingPassword_signin.setAttribute('type','password');
        e.target.classList.remove('fa-eye-slash');
        e.target.classList.add('fa-eye')
    }
    });

    // let checkEye_signup = document.getElementById("checkEye_signup");
    // let floatingPassword_signup =  document.getElementById("signup_password");
    // checkEye_signup.addEventListener("click", function(e){
    // if(e.target.classList.contains('fa-eye')){
    //     e.target.classList.remove('fa-eye');
    //     e.target.classList.add('fa-eye-slash');
    //     floatingPassword_signup.setAttribute('type','text')
    // }else{
    //     floatingPassword_signup.setAttribute('type','password');
    //     e.target.classList.remove('fa-eye-slash');
    //     e.target.classList.add('fa-eye')
    // }
    // });


    function get_signin_data() {
        let email = document.getElementById("signin_email").value;
        let password = document.getElementById("signin_password").value;

    
        let email_rule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    
        //validate ok or not
        if(email.search(email_rule)!= -1){
            console.log('true');
        }else{
            document.querySelector(".navbar_signin_dialog").style.height = "345px";
            document.querySelector(".navbar_signin_email_status").innerHTML = "信箱格式輸入錯誤!";
            document.querySelector("#checkEye_signin").style.top = "160px"
        }

        const get_signin_data = {
            email: email,
            password: password,
        };

        fetch("/api/user/auth", {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify(get_signin_data),
            caches: "no-cache",
            headers: new Headers({
            "content-type": "application/json",
            }),
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
        if (data['ok'] == true){
            document.querySelector(".navbar_signin_dialog").style.display = "none";
            main.style.opacity=1;

            get_cookie_token();

            ;} 
        else if (data["error"] == true){
            document.querySelector(".navbar_signin_dialog").style.height = "320px";
            document.querySelector(".navbar_signin_status").innerHTML = "帳號密碼輸入錯誤，請重新輸入";
            }
        })
    }
    // backend set up setcookies return frontend 
    function get_cookie_token(){ 
        fetch("/api/user/auth", {
            method: "GET",
            }).then(function (response) {
            return response.json();
            }).then(function (data) {
            console.log("get token", data);
        if (data["data"] != null) {
            // window.location.assign("/")
            console.log(" login status !");
            document.querySelector(".navbar_signup_signin_btn").style.display = "none";
            document.querySelector(".navbar_signout_btn").style.display = "block"; 
            // document.querySelector(".navbar_member_btn").style.display = "block";
        }
        else{
            console.log('signout status !');
        }
    })     
}
    //reload the page
    window.addEventListener('load',function(){
    console.log('we catch about reload the page, let me check get token or not');
        get_cookie_token();
    })  

    //click navbar_signout_btn redirect index.html
    document.querySelector(".navbar_signout_btn").addEventListener("click", (e) => {
    fetch("/api/user/auth", {
    method: "DELETE",
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
    if (data['ok'] == true ) {
        console.log("clean up");
        document.querySelector(".navbar_signup_signin_btn").style.display = "block";
        document.querySelector(".navbar_signout_btn").style.display = "none";
        // document.querySelector(".navbar_member_btn").style.display = "none";
        window.location.assign("/")
    } 
    else {
        console.log("error");
    }
    });
    });
}

export default navbar_signup_signin_lib
