function test() {
    let src="https://api.kcg.gov.tw/api/service/Get/9c8e1450-e833-499c-8320-29b36b7ace5c";
    fetch(src).then(function(response) {
        return response.json()
    })  
}
let a = test()
console.log(a) // ?
console.log(typeof(a)) // ?
