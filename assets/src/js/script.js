function reconfigMath () {
  window.MathJax.Hub.Queue(['Typeset', MathJax.Hub])
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
    // lozad
    var observer = lozad('.lazyload')
    observer.observe({ threshold: 0.01 })

    // Location href
    if (window.location.hash) {
      var hash = window.location.hash.substring(1)
      var decodedHash = decodeURIComponent(hash)
      var element = document.getElementById(decodedHash)
      if (element != null) {
        element.scrollIntoView()
        element.classList.add('highlighted')
      }
    }

    // MathJax
    if (typeof window.MathJax === 'undefined') {
      setTimeout(function () {
        reconfigMath()
      }, 2000)
    } else {
      reconfigMath()
    }

    // GA
    if (typeof ga !== 'undefined') {
      ga('set', 'page', window.location.pathname)
      ga('send', 'pageview')
    }

    // mediumZoom
    mediumZoom('img.post-content-img')
  }
}
