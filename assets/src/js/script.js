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
    // lozad
    var observer = lozad('.lazyload')
    observer.observe({ threshold: 0.01 })

    // Disqus count
    // if (document.getElementsByClassName('post-body').length > 0) {
    //   // var body = document.getElementsByTagName('body')[0]
    //   // body.classList.add('fadein')
    //   // Reload disqus count
    //   if (typeof DISQUSWIDGETS === 'undefined') {
    //     setTimeout(function () {
    //       reloadDisqusCount()
    //     }, 3000)
    //   } else {
    //     reloadDisqusCount()
    //   }
    // }

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

    // Gitalk (delay 2s)
    loadGitalk()
    // setTimeout(function () { loadGitalk() }, 2000)

    // GA
    if (typeof ga !== 'undefined') {
      ga('set', 'page', window.location.pathname)
      ga('send', 'pageview')
    }

    // UeScroll
    UeScroll.init()

    // mediumZoom
    mediumZoom('img.post-content-img')
  }
}
