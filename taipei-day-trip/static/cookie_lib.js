function cookie_lib(){
  return fetch("/api/user/auth", {
      method: "GET",
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log("取得token", data);
        console.log("data",data["data"]);
        return data["data"]
      });
  }

export default cookie_lib