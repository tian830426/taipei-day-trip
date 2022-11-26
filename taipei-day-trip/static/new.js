
// function getData(){
//     fetch("/api/attractions?page=0").then(function(response){
//         return response.json();
//     }).then(function(data){
//         console.log(data)
    
//         let attractions = data["data"]
//         let attractionImg = ""
//         let attractionName = ""
//         let attractionMrt = ""
//         let attractionCategory = ""
        
//         // console.log(attractions[0]);
//         for(let i = 0 ; i < 1 ; i++){
//             // images
//             attractionImg = attractions[i]['images']
//             console.log(attractionImg.parse());
//             attractionImg.parse()

//             // let newImg = document.createElement("img") 
//             // newImg.setAttribute('src',attractionImg)      
//             // newImg.setAttribute('class','name-top')
//             // document.querySelectorAll('.name-top').appendChild(newImg)


//         }


//     });
// }

// getData()




// window.addEventListener('scroll',()=>{
//     const scrollable = document.documentElement.scrollHeight - window.innerHeight;
//     const scrolled = window.screenY;

//     if (Math.ceil(scrolled) === scrollable){
//         alert('hello world');
//     }
//  })