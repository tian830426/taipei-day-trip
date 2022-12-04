//設定全域變數
let attractionIdDemo = "/api"
let attractionUrl = "";
attractionUrl = attractionIdDemo + window.location.pathname

let attractions = "";
let attractionName = "";
let attractionCategory = "";
let attractionMrt = "";
let attractionDescription = "";
let attractionAddress = "";
let attractionTransport = "";
let attractionImg = "";
let attractionImgLen = "";


if  (attractionUrl != ""){
    getData(); 
}
else{
    console.log("error page");
}

function getData(){
    fetch(attractionUrl).then(function(response){
        return response.json();
    }).then(function(data){

        attractionId = data["data"]["id"]
        attractions = data["data"];
        
        attractionImg = attractions["images"];
        attractionImgLen = attractionImg.length;
        
        attractionName = attractions["name"];
        attractionCategory = attractions["category"];
        attractionMrt = attractions["mrt"];
        attractionDescription = attractions["description"];
        attractionAddress = attractions["address"];
        attractionTransport = attractions["transport"];
   
        let name = document.querySelector('h2');
        name.textContent = attractionName;

        let category = document.querySelector('.category');
        category.textContent = attractionCategory;

        let mrt = document.querySelector('.mrt');
        mrt.textContent = attractionMrt;

        let description = document.querySelector('.content');
        description.textContent = attractionDescription;

        let address = document.querySelector('.address');
        address.textContent = attractionAddress;

        let traffic = document.querySelector('.traffic');
        traffic.textContent = attractionTransport

        for(let i = 0 ; i < attractionImgLen; i++){            
            let swiperImg = document.createElement('img');
            swiperImg.setAttribute('src',attractions["images"][i]);
            swiperImg.setAttribute('class','swiperImg');
            let imgBoxes = document.querySelector('.imgBoxes');
            imgBoxes.appendChild(swiperImg);
    
            let pagination = document.createElement('div');
            pagination.setAttribute('class','pagination');
            pagination.setAttribute('id',"circle-"+(i+1));

            // pagination.setAttribute('checked','');
            let swiperPagination = document.querySelector('.swiper-pagination');
            swiperPagination.appendChild(pagination);
            }
            let paginationId1 = document.getElementById('circle-'+1);
            paginationId1.style.backgroundColor='black';

            if(attractionImgLen != ''){
            changeImage();
        }
    });
}

document.getElementById('morning').addEventListener('click',(e)=>{
    document.querySelector('.price').textContent = "新台幣2000元";
},false);

document.getElementById('afternoon').addEventListener('click',(e)=>{
    document.querySelector('.price').textContent = "新台幣2500元";
},false);

        let imgBoxes = document.querySelector('imgBoxes');
        let prev = document.querySelector('.prev');
        let next = document.querySelector('.next');
        
        let idx = 0;

        function changeImage(){
                if (idx > attractionImgLen -1){
                    idx = 0;
                }else if (idx < 0){
                    idx = attractionImgLen - 1;
                }
            }

        function printImage(){   
            let swiperImg = document.querySelector(".swiperImg");
            swiperImg.setAttribute('src',attractions["images"][idx]);
            
        }

        function moveRightBall(){
            let pagination = document.querySelectorAll('.pagination');
            pagination[idx].style.backgroundColor = 'black';
            pagination[(idx-1)].style.backgroundColor = 'white';
        }
        
        function moveLeftBall(){
            let pagination = document.querySelectorAll('.pagination');  
            pagination[idx].style.backgroundColor = ' black';
            pagination[(idx+1)].style.backgroundColor = 'white';

        }

            prev.addEventListener('click',(e)=>{
                idx --
                changeImage();
                printImage();
                moveLeftBall();


                })
    
            next.addEventListener('click',(e)=>{
                idx ++
                changeImage();
                printImage();
                moveRightBall();
            })