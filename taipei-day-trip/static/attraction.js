//設定全域變數
let attractionId = 1;
let attractionIdDemo = "/api/attraction/"
let urlattraction ="";

let attractions = "" ;
let attractionImg = "";
let attractionName = "";
let attractionCategory = "";
let attractionMrt = "";
let attractionDescription = "";
let attractionAddress = "";
let attractionTransport = "";


if  (attractionId != 0){
    urlattraction = attractionIdDemo + attractionId
    getData();
}
else{
   console.log("error page");
}

function getData(){
    fetch(urlattraction).then(function(response){
        return response.json();
    }).then(function(data){
        console.log(data);

        attractions = data["data"];

        if(attractionId ) 

    })
}
