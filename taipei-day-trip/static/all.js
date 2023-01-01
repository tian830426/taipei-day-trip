import navbar_signup_signin_lib from "./navbar_signup_signin_lib.js" 
navbar_signup_signin_lib()

// import cookie_lib from "./cookie_lib.js"
// cookie_lib()

import navbar_booking_lib from "./navbar_booking_lib.js"
navbar_booking_lib()

// import navbar_member_lib from "./navbar_member_lib.js" 
// navbar_member_lib()

let nextPage = 0; //預設page = 0
let urlPage = "";
let urlDemo = "/api/attractions?page=";
let keyword = "";
let urlKeywordDemo = "/api/attractions?page=0&keyword=";
let judge = 0; //判斷是否有下一頁

//set up global variable
let attractions = "";
let attractionImg = "";
let attractionName = "";
let attractionMrt = "";
let attractionCategory = "";
let attractionLen = 0;

//set up id global variable
let attractionId = "";
let attractionIdUrl = "";

if (nextPage == 0) {
  urlPage = urlDemo + nextPage;
  get_data();
}

//get attraction database
function get_data() {
  fetch(urlPage)
    .then(function (response) {
      return response.json();
    }).then(function (data) {
      if (data["error"] == true) {
        console.log("error page");
        return "error page";}
      else {
        attractions = data["data"];
        attractionLen = attractions.length;
        load_picture();

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
          load_more();
        }
      }
    });
}

//loading picture
function load_picture() {
  for(let i = 0; i < attractionLen; i++) {
    let item = document.createElement("div");
    item.setAttribute("class", "main_imgBoxes_item");

    //a 連結
    let itemId = document.createElement("a");
    itemId.appendChild(item);

    let nameTop = document.createElement("div");
    nameTop.setAttribute("class", "main_imgBoxes_item_nameTop");
    let nameBtm = document.createElement("div");
    nameBtm.setAttribute("class", "main_imgBoxes_item_nameBtm");
    item.appendChild(nameTop);
    item.appendChild(nameBtm);

    let imgBoxes = document.querySelector(".main_imgBoxes");
    imgBoxes.appendChild(itemId);

    attractionImg = attractions[i]["images"][0];
    attractionName = attractions[i]["name"];
    attractionMrt = attractions[i]["mrt"];
    attractionCategory = attractions[i]["category"];

    // id
    attractionId = attractions[i]["id"];
    attractionIdUrl = "/attraction/" + attractionId;
    itemId.setAttribute("href", attractionIdUrl);

    let newImg = document.createElement("img");
    newImg.setAttribute("class", "main_imgBoxes_item_nameTop");
    newImg.setAttribute("src", attractionImg);

    let newName = document.createElement("p");
    newName.textContent = attractionName;
    document.querySelectorAll(".main_imgBoxes_item_nameTop")[i].appendChild(newName);

    let newMrt = document.createElement("p");
    newMrt.textContent = attractionMrt;
    document.querySelectorAll(".main_imgBoxes_item_nameBtm")[i].appendChild(newMrt);

    let newCategory = document.createElement("p");
    newCategory.textContent = attractionCategory;
    document.querySelectorAll(".main_imgBoxes_item_nameBtm")[i].appendChild(newCategory);

    nameTop.appendChild(newImg);
    nameTop.appendChild(newName);
    nameBtm.appendChild(newMrt);
    nameBtm.appendChild(newCategory);
  }
}

function load_more() {
  if (judge == 1) {
    const loading = document.querySelector(".loading");
      window.addEventListener("scroll", () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
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
    }).then(function (data) {
      attractions = data["data"];
      attractionLen = data["data"].length;
      load_picture();

      if (data["nextPage"] != null) {
        urlPage = urlDemo + data["nextPage"];
        judge = 1;
        load_more();
        } else {
        console.log("the last page");
      }
    });
  }
  } else {
    console.log("stop");
  }
}

let search = document.querySelector(".main_bgimage_searchBar");
search.addEventListener("click", submit);
function submit() {
  let searchContainer = document.querySelector(".main_bgimage_search_dialog");
  let searchForm = document.querySelector(".main_bgimage_search_form");
  let searchItem = document.querySelectorAll(".main_bgimage_search_item");
  searchContainer.style.display = "block";
  // searchContainer.classList.toggle('down');

  //clean content
  if (searchItem.length != 0) {
    searchForm.innerHTML = "";
  }

  fetch("/api/categories")
    .then(function (response) {
      return response.json();
    }).then(function (data) {
      let categoriesLen = data["data"].length;
      for (let i = 0; i < categoriesLen; i++) {
        let searchItemNew = document.createElement("div");
        searchItemNew.setAttribute("class", "main_bgimage_search_item");
        searchItemNew.setAttribute("id", data["data"][i]);
        let searchFormNew = document.querySelector(".main_bgimage_search_form");
        let itemName = data["data"][i];
        searchItemNew.textContent = itemName;
        searchFormNew.appendChild(searchItemNew);
      }

      for (let i = 0; i < categoriesLen; i++) {
        let itemName = "#" + data["data"][i];
        let itemSearchId = document.querySelector(itemName);
        itemSearchId.onclick = (e) => {
        let search = document.querySelector(".main_bgimage_searchBar");
        search.value = e.target.id;
        searchContainer.style.display = "none";
        };
      }

      let touchBody = document.querySelector("body");
      touchBody.addEventListener("click",(e) => {
      if(
        e.target.className != "main_bgimage_search_form" &&
        e.target.className != "main_bgimage_search_item" &&
        e.target.className != "main_bgimage_searchBar"
        ){
        searchContainer.style.display = "none";
        }},false);
      });
}

//click icon -> clean imgBoxes -> return getDate()
function icon() {
  let icon = document.querySelector(".main_bgimage_searchIcon");
  icon.addEventListener("click",(e) => {
    let imgBoxes = document.querySelector(".main_imgBoxes");
    while (imgBoxes.hasChildNodes()) {
    imgBoxes.removeChild(imgBoxes.firstChild);
    }
    urlPage = urlKeywordDemo + search.value;
    keyword = search.value;

    get_data();
    
  },false)
}
icon();

