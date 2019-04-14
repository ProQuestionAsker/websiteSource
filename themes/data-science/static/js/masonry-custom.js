let filterDrawerOpen = false;
let filterButton = document.getElementsByClassName('filters-click')[0]
let filterDrawer = document.getElementsByClassName('filters-drawer')[0]
let chevronUp = document.getElementsByClassName('inline-svg-chevron-up')[0]
let chevronDown = document.getElementsByClassName('inline-svg-chevron-down')[0]
let selectedTags = document.getElementsByClassName('tag-selected')
let allTags = document.getElementsByClassName('drawer-tag')
const emptyMessage = document.getElementsByClassName('portfolio__grid-empty')[0]
const fullFilters = document.getElementsByClassName('portfolio__grid-full')[0]
const pageTag = sessionStorage['tag']

chevronUp.hidden = true

const tagTimes = document.getElementsByClassName('inline-svg-times')
Array.from(tagTimes).forEach(function(element) {
  if (element.parentNode.classList.contains('drawer-tag')){
    element.hidden = true;
  }
});

let tags = {}

// dropdown selections
let singular = "All Categories"

// setup filter button click
filterButton.addEventListener('click', handleFilterDrawer)

Array.from(allTags).forEach(function(element) {
  element.addEventListener('click', handleAddTag);
});

Array.from(selectedTags).forEach(function(element) {
  element.addEventListener('click', handleAddTag);
});

var macy = Macy({
    container: '.portfolio__grid',
    trueOrder: true,
    waitForImages: true,
    margin: {
      x: 25,
      y: 25
    },
    columns: 1,
    breakAt: {
        750: 3,
        500: 2,
        350: 1
    },
    mobileFirst: true,
});

//macy.runOnImageLoad(function () { console.log("loaded") }, true)

function hide(selection){
  for (let i = 0; i < selection.length; ++i){
    selection[i].classList.add("hidden")
  }
}

function show(selection){

  for (let i = 0; i < selection.length; ++i){
    selection[i].classList.remove("hidden")
  }
}

function rearrange(){
  macy.recalculate(true)
}

const selectCat = document.getElementsByClassName("category-dropdown")[0]

function handleCatChange(){
  const val = selectCat.value
  singular = val.slice(0, -1)
  let anyTags = Object.values(tags).filter(d => d === true)

  if (anyTags.length === 0){
    if (val == "All Categories"){
      let selected = document.getElementsByClassName('item')
      show(selected)
      rearrange()
    }

    else if (val != "All Categories"){
      const unselected = document.querySelectorAll(`.item:not(.${singular})`)
      hide(unselected)

      const selected = document.getElementsByClassName(`item ${singular}`)
      show(selected)
      rearrange()
    }
  }

  else if (anyTags.length > 0){
    filterByTag()
    if (val == "All Categories"){
      let selected = document.getElementsByClassName('.tagFound')
      show(selected)
      rearrange()
    }

    else if (val != "All Categories"){
      const unselected = document.querySelectorAll(`.item:not(.${singular})`)
      hide(unselected)

      const selected = document.getElementsByClassName(`item ${singular} tagFound`)
      show(selected)
      rearrange()
    }
  }

}

selectCat.addEventListener("change", handleCatChange)



const selectTag = document.getElementById("tag-search")

function getTags(elem) {
  return elem.getAttribute('data-tags')
            .split(", ")
            .filter(function(el){
              return el.length > 0
            });
}

let tagMatches = []

function searchEachPost(allPosts, search){
  [...allPosts].forEach((post) => {
      //post.classList.remove('tagFound')
      let postTags = getTags(post)
      const success = search.every((val) => postTags.includes(val))
      if (success === true) post.classList.add('tagFound')
    });
  finalizeFilters()
}

// if (bodyVals.length){
// const success = bodyVals.every((val) => d.bodyParts.includes(val))
// const bp = d.bodyParts
// return success}
// else return false
// }

function finalizeFilters(){
  const unselected = document.querySelectorAll(`.item:not(.tagFound)`)
  hide(unselected)

  const selected = document.getElementsByClassName(`item tagFound`)
  show(selected)

  if (selected.length === 0){
    emptyMessage.classList.remove('is-hidden')
  } else emptyMessage.classList.add('is-hidden')

  rearrange()
}

function filterTags(){
  const val = selectTag.value
  const options = document.getElementById('tags').childNodes

  if (val === ""){
    const all = document.querySelectorAll('.item')

    const spread = [...all]
    spread.forEach((post) => {
        post.classList.remove('tagFound')
      });
    handleCatChange()
  }

  else {
    for (var i = 0; i < options.length; i++) {
        if (options[i].value === val) {
          const thisVal = options[i].value
          //const searchVal = thisVal === 'R' ? 'R' : thisVal.toLowerCase()
          const val = selectCat.value

          let selected = null
          if (singular == 'Post') {
            selected = document.querySelectorAll('.post')
          } else if (singular == 'Project'){
            selected = document.querySelectorAll('.project')
          } else selected = document.querySelectorAll('.item')
          searchEachPost(selected, sel)
          finalizeFilters()

          break;
        }
      }
  }

}

function handleSinglePageTag(){
  const sel = sessionStorage['tag']
  //const searchVal = sel === 'R' ? 'R' : sel.toLowerCase()
  let active = null

  tags[sel] = !active

  let tagToUnhide = document.querySelector(`[data-tag="${sel}"]`)
  tagToUnhide.hidden = !tagToUnhide.hidden
  filterByTag()

  // activate the correct tag in the drawer
  let drawerBtn = document.querySelector(`[data-drawertag="${sel}"]`)
  drawerBtn.classList.add('is-active')
  drawerBtn.setAttribute('aria-pressed', true)
  const plus = drawerBtn.getElementsByClassName('inline-svg-plus')[0]
  const times = drawerBtn.getElementsByClassName('inline-svg-times')[0]
  plus.hidden = true
  times.hidden = false



  // clear session storage tag variable
  sessionStorage['tag'] = ''
}


function handleFilterDrawer(){

  filterDrawerOpen = !filterDrawerOpen
  filterButton.setAttribute('aria-expanded', filterDrawerOpen)

  if(filterDrawerOpen === true) {
    filterDrawer.classList.add('visible')
    chevronUp.hidden = false
    chevronDown.hidden = true
    filterDrawer.hidden = false
  }
  if(filterDrawerOpen === false) {
    chevronUp.hidden = true
    chevronDown.hidden = false
    filterDrawer.classList.remove('visible')
    filterDrawer.hidden = true
  }
}

function handleAddTag(){
  const $btn = this
  const sel = this.innerText.trim();
  //const searchVal = sel === 'R' ? 'R' : sel.toLowerCase()
  let active = null

  // if the button was in the drawer
  if ($btn.classList.contains('drawer-tag')){
    active = $btn.classList.contains('is-active')
    const plus = this.getElementsByClassName('inline-svg-plus')[0]
    const times = this.getElementsByClassName('inline-svg-times')[0]

    if (active === false){
      plus.hidden = true
      times.hidden = false
      $btn.classList.add('is-active')
      $btn.setAttribute('aria-pressed', true)
    } else if (active === true){
      plus.hidden = false
      times.hidden = true
      $btn.classList.remove('is-active')
      $btn.setAttribute('aria-pressed', false)
    }
  } else if ($btn.classList.contains('tag-selected')){

    const drawerBtn = document.querySelector(`[data-drawertag="${sel}"]`)
    drawerBtn.classList.remove('is-active')

    drawerBtn.setAttribute('aria-pressed', false)

    const plus = drawerBtn.getElementsByClassName('inline-svg-plus')[0]
    const times = drawerBtn.getElementsByClassName('inline-svg-times')[0]

    times.hidden = true
    plus.hidden = false
    active = true
  }

  tags[sel] = !active

  let tagToUnhide = document.querySelector(`[data-tag="${sel}"]`)
  tagToUnhide.hidden = !tagToUnhide.hidden
  tagToUnhide.setAttribute('aria-pressed', !tagToUnhide.hidden)
  filterByTag()
}

function filterByTag(){
  const tagVals = Object.keys(tags)
    .filter(d => tags[d])
    .map(d => d)

  let selected = null
  if (singular == 'Post') {
    selected = document.querySelectorAll('.post')
  } else if (singular == 'Project'){
    selected = document.querySelectorAll('.project')
  } else selected = document.querySelectorAll('.item')

  const allItems = document.querySelectorAll('.item')

  // remove tag found from each post
  const removeTags = [...allItems].forEach((post) => {
      post.classList.remove('tagFound')
  })

  // stop user from entering more than 3 filters
  if (tagVals.length > 3) fullFilters.classList.remove('is-hidden')
  else {
    fullFilters.classList.add('is-hidden')
    searchEachPost(selected, tagVals)
  }

}

if (pageTag) handleSinglePageTag()
