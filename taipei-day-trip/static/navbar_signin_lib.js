// import cookie_lib from "./cookie_lib.js"
// cookie_lib()

function navbar_signin_lib(){
    //click navbar-signup dialog
    let navSignup = document.querySelector(".nav-signup");
    navSignup.addEventListener("click",(e) => {
    let signupContainer = document.querySelector(".signupContainer");
    signupContainer.style.display = "block";
    let main = document.querySelector('#main');
    main.style.opacity=.7;},false)

    //click dialog-xmark
    let signupXmark = document.querySelector(".signupXmark");
    signupXmark.addEventListener("click",(e) => {
    let signupContainer = document.querySelector(".signupContainer");
    signupContainer.style.display = "none";
    main.style.opacity=1;},false)

    let signinXmark = document.querySelector(".signinXmark");
    signinXmark.addEventListener("click",(e) => {
    let signinContainer = document.querySelector(".signinContainer");
    signinContainer.style.display = "none";
    main.style.opacity=1;},false)

    //control signup and singin dialog toggle
    let signupToggle = document.querySelector(".signupToggle");
    signupToggle.addEventListener("click", (e) => {
    let signupContainer = document.querySelector(".signupContainer");
    signupContainer.style.display = "block";
    let signinContainer = document.querySelector(".signinContainer");
    signinContainer.style.display = "none";})

    let signinToggle = document.querySelector(".signinToggle");
    signinToggle.addEventListener("click",(e) => {
    let signupContainer = document.querySelector(".signupContainer");
    signupContainer.style.display = "none";
    let signinContainer = document.querySelector(".signinContainer");
    signinContainer.style.display = "block";
    main.style.opacity=.7;})

    //click signup_btn use post method to backend userinformation table
    let signupBtn = document.querySelector(".signupBtn");
    signupBtn.addEventListener("click", (e) => {
    signupData();
    })

    function signupData(){
        const name = document.getElementById("signup_name").value;
        const email = document.getElementById("signup_email").value;
        const password = document.getElementById("signup_password").value;
        //email 正規表達式
        let emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
        // validate ok or not
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

        fetch("/api/user",{
            method: "POST",
            credentials: "include",
            body: JSON.stringify(signupData),
            caches: "no-cache",
            headers: new Headers({
            "content-type": "application/json",
            }),
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
        if (data['ok'] == true && email.search(emailRule)!= -1) {
            let signupStatus = document.querySelector(".signupStatus");
            signupStatus.innerHTML = "恭喜你！註冊成功！"} 
        else if (data['error'] == true) {
            let signupContainer = document.querySelector(".signupContainer");
            signupContainer.style.height = "375px";
            let signupStatus = document.querySelector(".signupStatus");
            signupStatus.innerHTML = "此信箱已註冊過，請重新輸入";
            } else {
                console.log("系統錯誤");
            }
        })
    }

    //click signin_btn PUT method to backend userinformation table
    let signinBtn = document.querySelector(".signinBtn");
    signinBtn.addEventListener("click", (e) => {
    signinData();
    })    

    function signinData() {
        const email = document.getElementById("signin_email").value;
        const password = document.getElementById("signin_password").value;

        let emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    
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
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
        if (data['ok'] == true){
            let signinContainer = document.querySelector(".signinContainer");
            signinContainer.style.display = "none";
            main.style.opacity=1;

            get_cookie();

            // var cookie_data = cookie_lib()
            // console.log('6666',cookie_data);
            
            // if (cookie_data != null) {
            //     console.log("登入中狀態");
            //     let navsignup = document.querySelector(".nav-signup");
            //     navsignup.style.display = "none";
            //     let navsignout = document.querySelector(".nav-signout");
            //     navsignout.style.display = "block"; 
            // }
            // else{
            //     console.log('未登入狀態');
            // }  

            ;} 
        else if (data["error"] == true){
            let signinContainer = document.querySelector(".signinContainer");
            signinContainer.style.height = "320px";
            let signinStatus = document.querySelector(".signinStatus");
            signinStatus.innerHTML = "帳號密碼輸入錯誤，請重新輸入";
            }
        })
    } 
        function get_cookie(){ 
            fetch("/api/user/auth", {
                method: "GET",
                }).then(function (response) {
                return response.json();
                }).then(function (data) {
                console.log("取得token", data);
            if (data["data"] != null) {
                // window.location.assign("/")
                console.log("登入中狀態");
                let navsignup = document.querySelector(".nav-signup");
                navsignup.style.display = "none";
                let navsignout = document.querySelector(".nav-signout");
                navsignout.style.display = "block"; 
            }
            else{
                console.log('未登入狀態');
            }
        })     
    }

    window.addEventListener('load',function(){
    console.log('抓到你刷新頁面了嗎，讓我們檢查看看 token');
    get_cookie();
    get_cookie_booking();
    // let cookie_data = cookie_lib()
    })  

    //click signout_btn trun up index.html
    let navsignout = document.querySelector(".nav-signout");
    navsignout.addEventListener("click", (e) => {
    fetch("/api/user/auth", {
    method: "DELETE",
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
    if (data['ok'] == true ) {
        console.log("成功清除");
        let navsignup = document.querySelector(".nav-signup");
        navsignup.style.display = "block";
        let navsignout = document.querySelector(".nav-signout");
        navsignout.style.display = "none";
        console.log('回首頁');
        window.location.assign("/")
        } else {
        console.log("有問題");
        }
    });
    });
}

export default navbar_signin_lib
