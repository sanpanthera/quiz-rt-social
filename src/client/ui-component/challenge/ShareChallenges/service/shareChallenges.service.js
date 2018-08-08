import {hideLoader} from "../../../loader/loader.controller"
export const getUserChallenges = (userId) => {
    const promise = new Promise(function(resolve, reject) {
      fetch("/api/userChallenges", {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({"userId": userId}),
        method: "post",
      }).then(
        res => res.json()
      ).then(json => {
         hideLoader()
        resolve(json)
      }, error => {
         hideLoader()
        reject(error)
      })
    })
    return promise
  }
  
  export const getUserFromUserMaster = (email) => {
    const promise = new Promise(function(resolve, reject) {
      fetch("/api/getUserFromUserMaster", {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        method: "post",
        body: JSON.stringify({"email": email}),
      }).then(
        res => res.json()
      ).then(json => {
        resolve(json)
      }, error => {
        reject(error)
      })
    })
    return promise
  }
  
  export const getFriendsToShareChallenges = (email) => {
    const promise = new Promise(function(resolve, reject) {
      var settings = {
        "url": "/api/friends",
        "data": {"userName" : email},
        "type": "GET",
        "mode": "no-cors",
        "headers": {
          "content-type": "application/json",
          "cache-control": "no-cache",
        },
      }
    
      $.ajax(settings).done(function(response) {
        console.log("Response.recieved from server" + email)
        console.log(response)
        //const friends = JSON.parse(response.data)
        const friends = response
        resolve(response)
        //Store.dispatch({type: "FETCH_FRIENDS_RES", users: friends})
      })
    })
    return promise
  }
  
  