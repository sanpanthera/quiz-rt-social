import {Store} from '../../../../boot/Store'
import {createChallengeHeaderTemplate} from '../view/CreateChallengeView'

export const storeChallenge = (challengeJsonObj) => {

  var settings = {
    "url": "/api/challenge",
    "type": "POST",
    "mode": "no-cors",
    "headers": {
      "content-type": "application/json",
      "cache-control": "no-cache",
    },
    "data": JSON.stringify(challengeJsonObj),
  }

  $.ajax(settings).done(function(response) {
    console.log(response)
    const userTranObj={"challengeId": "","challengeName": "","Created_By":"","shared_by":"","playedOn":"","score":"","userID":"","userName":""};
    userTranObj.challengeId = response.challengeId;
    userTranObj.challengeName = response.challengeName;
    userTranObj.Created_By = response.Created_By;
        fetch("/api/getUserDetail", {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          method: "get",
        }).then(
          res => res.json()
        ).then(result => {
            console.log("user detail response :"+result);
             let userKey = response.Created_By.replace( /[^a-zA-Z0-9-. ]/g,"").replace(/[.]/g,"");
             console.log("userKey:",userKey);
            let userDetails = result[userKey];
            console.log("userDetails:" ,userDetails);
            userTranObj.userName = userDetails.displayName;
            userTranObj.userID = userDetails.userID;
           updateUserTransaction(userTranObj);
        }, error => {
          console.log(error)
        }) 
   
  })
}

export const updateUserTransaction = (userTranObj) => {
  var settings = {
    "url": "/api/userTransaction",
    "type": "POST",
    "mode": "no-cors",
    "headers": {
      "content-type": "application/json",
      "cache-control": "no-cache",
    },
    "data": JSON.stringify(userTranObj),
  }

  $.ajax(settings).done(function(response) {
    console.log("updateUserTransaction :" ,response)
  })
}

export const getTopics = () => {
    fetch("/api/topics/gettopics", {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      method: "get",
    }).then(
      res => res.json()
    ).then(result => {
      createChallengeHeaderTemplate(Object.values(result));
    }, error => {
      console.log(error)
    }) 
}

// export const getTopics = () => {
// const promise = new Promise(function(resolve, reject) {
// let topics ={};
// fetch("/api/topics/gettopics", {
// headers: {
// "Content-Type": "application/json",
// "Cache-Control": "no-cache",
// },
// method: "get",
// }).then(
// res => res.json()
// ).then(json => {
// console.log(json);
// json.forEach(item => {
// console.log(item)
// topics[''+item.id]= item;
// });
// resolve(topics)
// }, error => {
// reject(error)
// })
// })
// return promise 
// } 