let nextPage = 0; //預設page = 0
let urlPage = "";
let urlDemo = "/api/attractions?page=";
let keyword = "";
let urlKeywordDemo = "/api/attractions?page=0&keyword=";
let judge = 0; //判斷是否有下一頁

//進行全域變數宣告
let attractions = "";
let attractionImg = "";
let attractionName = "";
let attractionMrt = "";
let attractionCategory = "";
let attractionLen = 0;

//設定 id 全域變數
let attractionId = "";
let attractionIdUrl = "";

if (nextPage == 0) {
  urlPage = urlDemo + nextPage;
  getData();
}

function getData() {
  fetch(urlPage)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data["error"] == true) {
        console.log("error page");
        return "error page";
      } else {
        attractions = data["data"];
        attractionLen = attractions.length;
        loadPicture();

        // 判斷是不是最後ㄧ頁
        if (data["nextPage"] != null) {
          judge = 1;
        } else {
          judge = 0;
        }

        // 判斷是否有keyword
        if (urlPage.includes("keyword")) {
          urlPage =
            "/api/attractions?page=" + data["nextPage"] + "&keyword=" + keyword;
        } else {
          // console.log("nextPage= " + data["nextPage"]);
          urlPage = urlDemo + data["nextPage"];
          judge = 1;
          loadMore();
        }
      }
    });
}

//loading picture
function loadPicture() {
  for (let i = 0; i < attractionLen; i++) {
    let item = document.createElement("div");
    item.setAttribute("class", "item");
    //a 連結
    let itemId = document.createElement("a");
    itemId.appendChild(item);

    let nameTop = document.createElement("div");
    nameTop.setAttribute("class", "name-top");
    let nameBtm = document.createElement("div");
    nameBtm.setAttribute("class", "name-btm");
    item.appendChild(nameTop);
    item.appendChild(nameBtm);

    let imgBoxes = document.querySelector(".imgBoxes");
    imgBoxes.appendChild(itemId);
    // let imgBoxes = document.querySelector('.imgBoxes')
    // imgBoxes.appendChild(item)

    attractionImg = attractions[i]["images"][0];
    attractionName = attractions[i]["name"];
    attractionMrt = attractions[i]["mrt"];
    attractionCategory = attractions[i]["category"];
    // id
    attractionId = attractions[i]["id"];
    attractionIdUrl = "/attraction/" + attractionId;
    itemId.setAttribute("href", attractionIdUrl);

    let newImg = document.createElement("img");
    newImg.setAttribute("class", "name-top");
    newImg.setAttribute("src", attractionImg);

    let newName = document.createElement("p");
    newName.textContent = attractionName;
    document.querySelectorAll(".name-top")[i].appendChild(newName);

    let newMrt = document.createElement("p");
    newMrt.textContent = attractionMrt;
    document.querySelectorAll(".name-btm")[i].appendChild(newMrt);

    let newCategory = document.createElement("p");
    newCategory.textContent = attractionCategory;
    document.querySelectorAll(".name-btm")[i].appendChild(newCategory);

    nameTop.appendChild(newImg);
    nameTop.appendChild(newName);
    nameBtm.appendChild(newMrt);
    nameBtm.appendChild(newCategory);
  }
}

function loadMore() {
  if (judge == 1) {
    const loading = document.querySelector(".loading");
    window.addEventListener("scroll", () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;

      //提早感應
      if (Math.ceil(scrolled) > scrollable - 50 && judge == 1) {
        judge = 0;
        showLoading();
      }
    });

    function showLoading() {
      setTimeout(getPost(), 2000);
    }

    function getPost() {
      fetch(urlPage)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          attractions = data["data"];
          attractionLen = data["data"].length;
          loadPicture();

          if (data["nextPage"] != null) {
            urlPage = urlDemo + data["nextPage"];
            judge = 1;
            loadMore();
          } else {
            console.log("the last page");
          }
        });
    }
  } else {
    console.log("stop");
  }
}

let search = document.querySelector(".search");
search.addEventListener("click", submit);
function submit() {
  let searchContainer = document.querySelector(".searchContainer");
  let searchForm = document.querySelector(".searchForm");
  let searchItem = document.querySelectorAll(".searchItem");
  searchContainer.style.display = "block";
  // searchContainer.classList.toggle('down');

  //clean content
  if (searchItem.length != 0) {
    searchForm.innerHTML = "";
  }

  fetch("/api/categories")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let categoriesLen = data["data"].length;
      for (let i = 0; i < categoriesLen; i++) {
        let searchItemNew = document.createElement("div");
        searchItemNew.setAttribute("class", "searchItem");
        searchItemNew.setAttribute("id", data["data"][i]);
        let searchFormNew = document.querySelector(".searchForm");
        let itemName = data["data"][i];
        searchItemNew.textContent = itemName;
        searchFormNew.appendChild(searchItemNew);
      }

      for (let i = 0; i < categoriesLen; i++) {
        let itemName = "#" + data["data"][i];
        let itemSearchId = document.querySelector(itemName);
        itemSearchId.onclick = (e) => {
          let search = document.querySelector(".search");
          search.value = e.target.id;
          searchContainer.style.display = "none";
        };
      }

      let touchBody = document.querySelector("#body");
      touchBody.addEventListener(
        "click",
        (e) => {
          if (
            e.target.className != "searchForm" &&
            e.target.className != "searchItem" &&
            e.target.className != "search"
          ) {
            searchContainer.style.display = "none";
          }
        },
        false
      );
    });
}

//click icon -> clean imgBoxes -> return getDate()
function icon() {
  let icon = document.querySelector(".icon");
  icon.addEventListener(
    "click",
    (e) => {
      let imgBoxes = document.querySelector(".imgBoxes");
      while (imgBoxes.hasChildNodes()) {
        imgBoxes.removeChild(imgBoxes.firstChild);
      }
      urlPage = urlKeywordDemo + search.value;
      keyword = search.value;
      getData();
    },
    false
  );
}
icon();

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
// }

//signin (DELETE)
