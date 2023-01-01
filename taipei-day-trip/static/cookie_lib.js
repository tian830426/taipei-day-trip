function cookie_lib(data){
  return fetch("/api/user/auth", {
      method: "GET",
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log("取得token", data);
        console.log("data",data["data"]);
        if (data["data"] != null) {
          console.log("登入中狀態");
          let navsignup = document.querySelector(".navbar_signup_signin_btn");
          navsignup.style.display = "none";
          let navsignout = document.querySelector(".navbar_signout_btn");
          navsignout.style.display = "block";
        }
        else{
          window.location.assign("/")
        }
      });
    }

export default cookie_lib