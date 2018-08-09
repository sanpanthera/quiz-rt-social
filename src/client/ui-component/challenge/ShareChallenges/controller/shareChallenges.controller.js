import {getShareChallengeTemplate, renderViewToContainer, getFriendsToShareChallengeTemplate} from "../view/shareChallenges.view"
import {Store} from '../../../../boot/Store'
import {getUserChallenges, getFriendsToShareChallenges, updateUserTransactionWithSharedChallenges} from "../service/shareChallenges.service"
import { showLoader } from "../../../loader/loader.controller";
import {loadFriends} from "../../../../ui-component/Friends/service"
import {updateUserTransaction} from "../../CreateChallenge/service/CreateChallengeService"
import {MDCDialog} from "@material/dialog"

var shareChallenges
export const createShareChallengesSection = (userId) => {
  showLoader()
  getUserChallenges(userId).then(function(userChallenges) {
    shareChallenges = userChallenges
    const currentState = Store.getState()
    const shareChallengesData = getShareChallengeTemplate(userChallenges)
    const shareBtnList = shareChallengesData.querySelectorAll(".shareChalBtn")
    shareBtnList.forEach((item) => {
      item.addEventListener("click", (event) => {
        const curChallengeId = event.currentTarget.id.split("_")[1]
        const curChallengeItem = userChallenges.filter((x) => {
          return x.challengeId.toString() === curChallengeId
        })[0]
        const email = currentState.menuReducer.currentUserInfo.email
        getFriendsToShareChallenges(email).then(function(friends) {
          fetchFriendsToShareChallenges(friends, userId, curChallengeItem)
        })
      })
    })   
    let challengeBtnList = shareChallengesData.querySelectorAll(".playChallengeBtnCls");
    challengeBtnList.forEach((item) => {
    item.addEventListener("click", (event) => {
      playChallengeOnPlayButton(event)
    })
  })
    renderViewToContainer(shareChallengesData, "#challengeSection");
  })
}

export const fetchFriendsToShareChallenges = (friends, userId, curChallengeItem) => {
  const shareChallengesWithFriendsData = getFriendsToShareChallengeTemplate(friends)
  shareChallengesWithFriendsData.getElementById("submitSharedChallenge").onclick = function() {
    var friendsListUL = document.querySelector("#friendsUl")
    var frnds = friendsListUL.querySelectorAll("#friendsLi")
    let selectedFriends = []
    const shareUserTranObj={"challengeId": "","challengeName": "","Created_By":"","shared_by":"","playedOn":"","score":"","userID":"","userName":""};
    for (let item of frnds) {
      if (item.querySelector(".mdl-checkbox__input").checked) {
        const friendUserId = item.children[1].children[1].id.split("_")[1]
        const friendDisplayName = item.children[1].children[1].id.split("_")[2]
        selectedFriends.push({"userID": friendUserId, "displayName": friendDisplayName, "email": item.children[1].children[1].innerText})
      }
    }
    for (let selFriend of selectedFriends) {
      shareUserTranObj.Created_By = curChallengeItem.Created_By
      shareUserTranObj.challengeId = curChallengeItem.challengeId
      shareUserTranObj.challengeName = curChallengeItem.challengeName
      shareUserTranObj.shared_by = userId
      shareUserTranObj.userID = selFriend.userID
      shareUserTranObj.userName = selFriend.displayName
      updateUserTransactionWithSharedChallenges(shareUserTranObj)
    }
    console.log("selectedFriends" + JSON.stringify(selectedFriends))
  }
  renderViewToContainer(shareChallengesWithFriendsData, "#challengeSection")
  const dialogElement = document.querySelector("#shareChall-mdc-dialog")
  const dialog = new MDCDialog(dialogElement)
  const target = document.querySelector("#shareChallengeButton")
  dialog.lastFocusedTarget = target
  dialog.show()
}

const playChallengeOnPlayButton = (event) => {
  const btnData = event.target.id.split("-");
  const challengeId = btnData[1]
  const curState = Store.getState()
  const curChallengeInfo = curState.dashboardReducer.ChallegeList.filter((x) => {return x.challengeId.toString() === challengeId })[0]
  let topicId = ""
  for (const topickey in curState.dashboardReducer.TopicList) {
    if(curState.dashboardReducer.TopicList[topickey].topicText === curChallengeInfo.topicName){
      topicId = curState.dashboardReducer.TopicList[topickey].id
      break
    }
  }
  switch (btnData[2]) {
  case "play":
    console.log("play" + challengeId)
    const url = "https://quiz-engine.herokuapp.com?topicId="+topicId+"&type=challenge"
    window.open(url , '_blank');
    break
  case "leader":
    console.log("leader" + challengeId)
    break
 default:
    break
  }
}
