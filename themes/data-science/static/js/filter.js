//import macy from './macy'

const selectCat = document.getElementsByClassName("category-dropdown")[0]

function handleCatChange(){
  const val = selectCat.value
  const singular = val.slice(0, -1)

  console.log({val, singular})

  const items = document.getElementsByClassName(`item ${singular}`)
  show(items)
  macy_instance.recalculate( true )
  let unselected = document.querySelectorAll(`.item:not(.${singular})`)
  hide(unselected)
}

function hide(selection){
  for (let i = 0; i < selection.length; ++i){
    selection[i].classList.add('hidden')
  }
}

function show(selection){
  for (let i = 0; i < selection.length; ++i){
    selection[i].classList.remove('hidden')
  }
}

selectCat.addEventListener("change", handleCatChange)
