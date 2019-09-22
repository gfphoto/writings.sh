function reconfigMath () {
  window.MathJax.Hub.Queue(['Typeset', MathJax.Hub])
}

function reloadDisqusCount () {
  if (typeof DISQUSWIDGETS !== 'undefined') {
    DISQUSWIDGETS.getCount({ reset: true })
  }
}

function init () {
  window.onload = function () {
    console.log(
      (' _       ______  _______________   _____________  _____ __  __\n') +
      ('| |     / / __ \/  _/_  __/  _/ | / / ____/ ___/ / ___// / / /\n') +
      ('| | /| / / /_/ // /  / /  / //  |/ / / __ \__ \  \__ \/ /_/ / \n') +
      ('| |/ |/ / _, _// /  / / _/ // /|  / /_/ /___/ / ___/ / __  /  \n') +
      ('|__/|__/_/ |_/___/ /_/ /___/_/ |_/\____//____(_)____/_/ /_/   \n') +
      ('\n') +
      ('欢迎光临！\n')
    )
  }
  // lozad
  var observer = lozad('.post-content-img')
  observer.observe({ threshold: 0.01 })

  // turbolinks
  Turbolinks.setProgressBarDelay(200)
  Turbolinks.start()

  document.addEventListener('turbolinks:load', function (e) {
    if (document.getElementsByClassName('post-body').length > 0) {
      // var body = document.getElementsByTagName('body')[0]
      // body.classList.add('fadein')
      // Reload disqus count
      if (typeof DISQUSWIDGETS === 'undefined') {
        setTimeout(function () {
          reloadDisqusCount()
        }, 3000)
      } else {
        reloadDisqusCount()
      }
    }
  }, false)
  // https://stackoverflow.com/questions/20814531/local-mathjax-loading-with-turbolinks-in-rails-4
  document.addEventListener('turbolinks:load', function (e) {
    if (typeof window.MathJax === 'undefined') {
      setTimeout(function () {
        reconfigMath()
      }, 2000)
    } else {
      reconfigMath()
    }
  }, false)
  // https://github.com/turbolinks/turbolinks/issues/75#issuecomment-443256173
  document.addEventListener('turbolinks:click', function (e) {
    if (e.target.getAttribute('href').charAt(0) === '#') {
      return e.preventDefault()
    }
  }, false)
  document.addEventListener('turbolinks:load', function (e) {
    if (window.location.hash) {
      var hash = window.location.hash.substring(1)
      var decodedHash = decodeURIComponent(hash)
      var element = document.getElementById(decodedHash)
      if (element != null) {
        element.scrollIntoView()
        element.classList.add('highlighted')
      }
    }
    // GA
    if (typeof ga !== 'undefined') {
      ga('set', 'page', window.location.pathname)
      ga('send', 'pageview')
    }
  }, false)

  // UeScroll
  UeScroll.init()

  // mediumZoom
  mediumZoom('img.post-content-img')
}
