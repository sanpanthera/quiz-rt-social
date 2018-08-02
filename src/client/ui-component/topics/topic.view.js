export const topicView = (topicObj, topicId) => {
  console.log("topicView - ", topicObj)
  return `<li class="mdc-grid-tile pointer" id="grid_${topicId}">
    <div class="mdc-grid-tile__primary">
        <img class="mdc-grid-tile__primary-content mdc-image-list__image" src="${topicObj.topicImage}" />
        
    </div>
    <span class="mdc-grid-tile__secondary">
        <span class="mdc-grid-tile__title">${topicObj.topicText} </span>
    </span>
</li>`
}

