import navbar_signup_signin_lib from "./navbar_signup_signin_lib.js" 
navbar_signup_signin_lib()

// import cookie_lib from "./cookie_lib.js"
// cookie_lib()

import navbar_booking_lib from "./navbar_booking_lib.js"
navbar_booking_lib()

// import navbar_member_lib from "./navbar_member_lib.js" 
// navbar_member_lib()

// import TapPay from "./TapPay.js"
// TapPay()

// closeDiv();
// function closeDiv()
// {document.getElementById('loading').style.visibility='hidden';
// // document.getElementById('main').style.visibility='visible';
// }

getcookie();
//取得後端回傳token
function getcookie() {
  fetch("/api/user/auth", {
    method: "GET",
  }).then(function (response) {
      return response.json();
  }).then(function (data) {
    console.log("取得token", data);
    if (data["data"] != null) {
      console.log("登入中狀態");
      let navsignup = document.querySelector(".navbar_signup_signin_btn");
      navsignup.style.display = "none";
      let navsignout = document.querySelector(".navbar_signout_btn");
      navsignout.style.display = "block";  
      get_newtour();
      get_booker(data);
    }
    else{
      window.location.assign("/")
    }
  });
}

let attraction_data = ""
//取得預定資料 印在前端畫面上
function get_newtour(){
  fetch("/api/booking",{
  method:"GET",
  }).then(function(response){
    return response.json();
  }).then(function(data){
    // console.log(data);
    if(data["data"] != null){
      let booking_image = document.querySelector('.booking_image')
      booking_image.setAttribute('src',data['data']["attraction"]["image"])

      let city_name = document.querySelector('.city_name')
      city_name.textContent = data['data']["attraction"]["name"]

      let city_date = document.querySelector('.city_date')
      city_date.textContent = data['data']["date"]

      let city_time = document.querySelector('.city_time')
      city_time.textContent = data['data']["time"]

      let city_fee = document.querySelector('.city_fee')
      city_fee.textContent = data['data']["price"]

      let city_site = document.querySelector('.city_site')
      city_site.textContent = data["data"]['attraction']["address"]

      let city_price = document.querySelector('.city_price')
      city_price.textContent = data['data']["price"]
    }
    else{
      document.querySelector('.booking_page').style.display = 'none';
      document.querySelector('.other_booking_page').style.display = 'block';
      document.querySelector('footer').style.display = 'none';
      document.querySelector('.footer_booking_page_no_reservation').style.display = 'block'; 
    }
      attraction_data = data;
  })
}

//在booking 呼叫 token 資訊 取得登入者姓名
function get_booker(data){
  // console.log(data["data"]["name"]);
  let bookers = document.querySelectorAll(".city_booker");
  for(let booker of bookers){
    // console.log(booker);
    booker.textContent = data["data"]["name"]
  }
}

//delete method
delete_newtour() ;
function delete_newtour(){ 
document.querySelector('.icon_delete').addEventListener('click',(e)=>{
  fetch("/api/booking", {
    method: "DELETE",
  }).then(function (response) {
    console.log(response);
    return response.json();
  }).then(function (data) {
    console.log(data);
    if(data["ok"] == true){
      document.querySelector('.booking_page').style.display='none';
      document.querySelector('.other_booking_page').style.display ='block';
      document.querySelector('footer').style.display = 'none';
      document.querySelector('.footer_booking_page_no_reservation').style.display = 'block';
    }
    else{
      console.log('沒有成功刪除');
    }
   })
} 
,false)}

//設定TapPay參數
// TPDirect.setupSDK(`${APP_ID}`,`${APP_KEY}`, 'sandbox')
TPDirect.setupSDK(126946,"app_a8IwE6ugbKnbBObGwX624iLJJRwgGkkluDMG6GmyXxPzivIR5hmsbchImJMG","sandbox")
//設定外觀
TPDirect.card.setup({
  // Display ccv field
  fields : {
      number: {
          // css selector
          element: '#card-number',
          placeholder: '**** **** **** ****'
      },
      expirationDate: {
          // DOM object
          element: document.getElementById('card-expiration-date'),
          placeholder: 'MM / YY'
      },
      ccv: {
          element: '#card-ccv',
          placeholder: 'ccv'
      }
  },
  // Not display ccv field
  fields : {
      number: {
          // css selector
          element: '#card-number',
          placeholder: '**** **** **** ****'
      },
      expirationDate: {
          // DOM object
          element: document.getElementById('card-expiration-date'),
          placeholder: 'MM / YY'
      }
  },

  // fields: fields,
  styles: {
      // Style all elements
      'input': {
          'color': 'gray'
      },
      // Styling ccv field
      'input.ccv': {
          // 'font-size': '16px'
      },
      // Styling expiration-date field
      'input.expiration-date': {
          // 'font-size': '16px'
      },
      // Styling card-number field
      'input.card-number': {
          // 'font-size': '16px'
      },
      // style focus state
      ':focus': {
          // 'color': 'black'
      },
      // style valid state
      '.valid': {
          'color': 'green'
      },
      // style invalid state
      '.invalid': {
          'color': 'red'
      },
      // Media queries
      // Note that these apply to the iframe, not the root window.
      '@media screen and (max-width: 400px)': {
          'input': {
              'color': 'orange'
          }
      }
  },
  // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
  isMaskCreditCardNumber: true,
  maskCreditCardNumberRange: {
      beginIndex: 6,
      endIndex: 11
  }
})

//取得 TapPay Fields 狀態
// document.querySelector('.checkout_tappay').addEventListener("click",(e)=>{
//   console.log("----");
//   console.log("成功呼叫按鈕");
//   // let cardNumber = document.getElementsById("card-number").textContent
//   // console.log(cardNumber);
//   // let cardExpiration = document.getElementById("card-expiration-date").value
//   // console.log(cardExpiration);
//   // let cardCCV = document.getElementById("card-ccv").textContent
  
//   // const data = {
//   //   cardNumber : cardNumber,
//   //   cardExpiration : cardExpiration,
//   //   cardCCV : cardCCV 
//   // }
//   // 4242 4242 4242 4242
//   // console.log((data));
//   })
  // TPDirect.card.onUpdate();

 TPDirect.card.onUpdate(function (update) {
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    let submitButton = document.querySelector(".submitButton")
    // submitButton.setAttribute("type", "submit");
    if (update.canGetPrime === true) {
        // Enable submit Button to get prime.
        submitButton.removeAttribute('disabled')
    } else {
        // Disable submit Button to get prime.
        submitButton.setAttribute('disabled', true)
    }
  
    // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unionpay','unknown']
    if (update.cardType === 'visa') {
        // Handle card type visa.
    }
  
    // number 欄位是錯誤的
    if (update.status.number === 2) {
        // setNumberFormGroupToError("#card-number")
    } else if (update.status.number === 0) {
        // setNumberFormGroupToSuccess("#card-number")
    } else {
        // setNumberFormGroupToNormal("#card-number")
    }
  
    if (update.status.expiry === 2) {
        // setNumberFormGroupToError("#card-expiration-date")
    } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess("#card-expiration-date")
    } else {
        // setNumberFormGroupToNormal("#card-expiration-date")
    }
  
    if (update.status.ccv === 2) {
        // setNumberFormGroupToError("#card-ccv")
    } else if (update.status.ccv === 0) {
        // setNumberFormGroupToSuccess("#card-ccv")
    } else {
        // setNumberFormGroupToNormal("#card-ccv")
    }
  })

// call TPDirect.card.getPrime when user submit form to get tappay prime
// $('form').on('submit', onSubmit)

document.querySelector('.submitButton').addEventListener("click",
  function (event) {
    console.log(event);
    event.preventDefault()
    
    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    console.log(tappayStatus)
    
    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('can not get prime')
        return 
    }
  
    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
          console.log("沒有成功拿到prime");
            // alert('get prime error ' + result.msg)
            // return
        }
        // alert('get prime 成功，prime: ' + result.card.prime)

        let prime = result.card.prime
        console.log(prime);
        // let status = result.status

        let name = document.getElementById('name').value
        let email = document.getElementById('email').value
        let phone_number = document.getElementById
          ('phone_number').value 

        let email_rule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    
        //validate ok or not
        if(email.search(email_rule)!= -1){
            console.log('true');
        }else{
            document.querySelector(".page_btm_connect_email_status").innerHTML = "信箱格式輸入錯誤!";
          }
      
        // console.log(result.status);
        get_attraction_data(prime,name,email,phone_number);
        // return prime
        // get_prime_data(data);
        // send prime to your server, to pay with Pay by Prime API .
        // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    })
  }
)

// setup CCV fied
TPDirect.ccv.setup({
  fields: {
      ccv: {
          element: '#card-ccv',
          placeholder: 'ccv'
      }
  },
  styles: {
      // Style all elements
      'input': {
          'color': 'gray'
      },
      // Styling ccv field
      'input.ccv': {
          // 'font-size': '16px'
      },
      // style focus state
      ':focus': {
          // 'color': 'black'
      },
      // style valid state
      '.valid': {
          'color': 'green'
      },
      // style invalid state
      '.invalid': {
          'color': 'red'
      },
      // Media queries
      // Note that these apply to the iframe, not the root window.
      '@media screen and (max-width: 400px)': {
          'input': {
              'color': 'orange'
          }
      }
  }
})

//建立卡別
// TPDirect.ccv.setupCardType({TPDirect,CardType,VISA})
// TPDirect.ccv.setupCardType({TPDirect,CardType,JCB})
// TPDirect.ccv.setupCardType({TPDirect,CardType,AMEX})
// TPDirect.ccv.setupCardType({TPDirect,CardType,MASTERCARD})
// TPDirect.ccv.setupCardType({TPDirect,CardType,UNIONPAY})
// TPDirect.ccv.setupCardType({TPDirect,CardType,UNKNOWN})

// TPDirect.ccv.onUpdate((update) => {
//   console.log(update)
// })

// // Example Data
// {
// canGetPrime: true
// hasError: false
// status: {
//   ccv: 0
// }
// }

// let a = tappay();
// console.log(a);

// }

// async function get_prime_data(prime){
//   let a = await prime
//   console.log(a);
//   return a
// }

// TapPay(get_attraction_data)
function get_attraction_data(prime,name,email,phone_number){
  let data = attraction_data
  const prime_data = {
    "prime" : prime,
    "order" :{
      "price": data["data"]["price"],
      "trip":{
        "attraction":{
          "id": data["data"]["attraction"]["id"],
          "name": data["data"]["attraction"]["name"],
          "address": data["data"]["attraction"]["address"],
          "image": data["data"]["attraction"]["image"] ,
        },
        "date": data["data"]["date"],
        "time": data["data"]["time"]
      },
      "contact":{
        "name": name,
        "email": email,
        "phone": phone_number
      }
    }
  }

  fetch("/api/orders",{
    method: "POST",
    credentials: "include",
    body: JSON.stringify(prime_data),
    caches: "no-cache",
    headers: new Headers({
      "content-type": "application/json",
    }),
  }).then(function(response){
    return response.json();
  }).then(function(data){
    console.log(data);
    let thankyou_url = "";
    if (data["data"]["number"] != ""){
      let order_number = data["data"]["number"];
      console.log(order_number);
      thankyou_url = "/thankyou?number=" + order_number;
      window.location.assign(thankyou_url);
      // return get_order_number(order_number)
    }
    else{
      window.location.assign("/")
      console.log("有其他錯誤，返回首頁");
      // 製作失敗頁面及連結可跳回 booking頁面
      
    }
  })
}




