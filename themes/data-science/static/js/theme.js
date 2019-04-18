const body = document.getElementsByTagName('body')[0]
const lightDarkToggle = document.getElementsByClassName('theme-toggle')[0]
const moonIcon = document.getElementsByClassName('inline-svg-moon')[0]
const sunIcon = document.getElementsByClassName('inline-svg-sun')[0]
//const icon = lightDarkToggle.getElementsByTagName('i')[0]
const image = document.getElementsByClassName('introImage')[0]
let pageTags = document.getElementsByClassName('post-tag')
// does the user have a media query for preferring dark mode?
const themePreference = matchMedia('(prefers-color-scheme: dark)');
const disqus = document.getElementsByClassName('disqus-comments')[0]
const disqusButton = document.getElementsByClassName('disqus-show')[0]
const toTopButton = document.getElementsByClassName('toTop')[0]
const themeText = document.getElementsByClassName('theme-text')[0]
const scrollText = document.getElementsByClassName('scroll-text')
const syntaxLight = document.getElementById('syntaxLight')
const syntaxDark = document.getElementById('syntaxDark')


// looking for any stored value in session storage of 'theme'
let theme = sessionStorage['theme']

// looking for any tags selected from the non-home-page
let tag = sessionStorage['tag']

console.log({theme})

//////////////////////////////////////////////////
///////// Light vs. Dark Theme Code //////////////
//////////////////////////////////////////////////

// get current time for user
const currentTime = new Date().getHours()

// if there is already a value stored for theme
if (theme){
  // and the value stored is light, keep it light
  if (theme === 'light') makeLight('newPage')
  // and the value stored is dark, keep it dark
  if (theme === 'dark') makeDark('newPage')
}
if (!theme || theme === "undefined"){
  // if there is no value stored for theme
  // and if the user has a preference in their web browser for dark theme
  if (themePreference['matches'] === true) {
    makeDark('first')
  } else setTheme()
}

function setTheme(){
  // this is run if there is no stored theme

  // if after 10PM or before 6AM, make dark mode
  if (currentTime < 6 || currentTime >= 22) makeDark('first')
  else makeLight('first')
}

function makeDark(load){
  // set the key in session storage to 'dark'
  sessionStorage['theme'] = 'dark'

  // if this is not the first time the page loads, remove the light class
  if (load != 'first') body.classList.remove('light')

  // always add dark class, remove the (default) moon icon, and add the circle icon
  body.classList.add('dark')
    moonIcon.hidden = true
    sunIcon.hidden = false

  // if this is run on a page where the image exists, switch to the dark one
  if (image) image.src = 'images/introImage-dark.png'

  // if this is a page with an indicator of what the button means, adjust the text
  if (themeText) themeText.innerText = 'Enable Light Mode'

  // Switch aria label to be accurate
  if (!themeText) lightDarkToggle.setAttribute('aria-label', 'Enable Light Mode')

  // switch to dark syntax highlighting
  syntaxLight.rel = 'stylesheet alternate'
  syntaxDark.rel = 'stylesheet'



  // set the variable 'theme' to be equal to the value stored in session storage
  theme = sessionStorage['theme']
}

function makeLight(load){
  // set the key in session storage to 'light'
  sessionStorage['theme'] = 'light'

  // if this is the first time it loads, turn off the moon icon
  if (load === 'first'){
    moonIcon.hidden = false
    sunIcon.hidden = true 
  }

  // if this is not the first page load
  if (load != 'first'){
    // remove the dark tag
    body.classList.remove('dark')

    // remove the circle class and replace it with the (default) moon
    moonIcon.hidden = false
    sunIcon.hidden = true

    // the light image is default,
    // so if this isn't the first load & there's an image, change to the light image
    if (image){
      image.src = 'images/introImage-light.png'
    }

    // if this is a page with an indicator of what the button means, adjust the text
    if (themeText) themeText.innerText = 'Enable Dark Mode'

    // Switch aria label to be accurate
    if (!themeText) lightDarkToggle.setAttribute('aria-label', 'Enable Dark Mode')

    // light syntax highlighting is default, so if this isn't the first load, change to light highlighting
    syntaxDark.rel = 'stylesheet alternate'
    syntaxLight.rel = 'stylesheet'

  }
  // regardless of everything else, add 'light' class to the body
  body.classList.add('light')

  // set the variable 'theme' to be equal to the value stored in session storage
  theme = sessionStorage['theme']
}

function handleThemeToggle(){
  if (theme === 'light') makeDark('toggle')
  else if (theme === 'dark') makeLight('toggle')

  // set the variable 'theme' to be equal to the value stored in session storage
  theme = sessionStorage['theme']
}

// setup light dark theme toggle
lightDarkToggle.addEventListener('click', handleThemeToggle)



//////////////////////////////////////////////////
////// Tag Filtering Between Pages Code //////////
//////////////////////////////////////////////////

// In this file, we only need to store the value of the tag that was clicked

// Add event listener to each tag on the article page
Array.from(pageTags).forEach(function(element) {
  element.addEventListener('click', handleStoreTag);
});

function handleStoreTag(){
  const $btn = this
  const sel = this.innerText.trim();
  const searchVal = sel === 'R' ? 'R' : sel.toLowerCase()

  sessionStorage['tag'] = sel
  window.location.replace('/')
}

// Now we'll just access this from the masonry-custom.js file

///////////////////////////////////////////
////// Show/Hide Disqus Elements //////////
///////////////////////////////////////////

if (disqus){
  disqusButton.addEventListener('click', toggleDisqusComments)
}

function toggleDisqusComments(){
  // toggle the is-hidden class
  disqus.hidden = !disqus.hidden

  const message = disqusButton.getElementsByTagName('span')[0]

  if (disqus.hidden) message.innerText = 'Show Comments '
  else message.innerText = 'Hide Comments '
}


///////////////////////////////////////////
//// Scroll to Top on Long Articles ///////
///////////////////////////////////////////

if (toTopButton){
  window.onscroll = function(){handleScroll()}

  function handleScroll(){
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
      toTopButton.classList.remove('is-hidden')
      scrollText[0].classList.add('is-hidden')
      scrollText[1].classList.add('is-hidden')
    } else {
      toTopButton.classList.add('is-hidden')
      scrollText[0].classList.remove('is-hidden')
      scrollText[1].classList.remove('is-hidden')
    }
  }

  toTopButton.addEventListener('click', scrollToTop)

  // When the user clicks on the button, scroll to the top of the document
  function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

}
