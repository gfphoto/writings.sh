function init () {
  Turbolinks.start()
  // https://stackoverflow.com/questions/20814531/local-mathjax-loading-with-turbolinks-in-rails-4
  document.addEventListener('turbolinks:load', function (e) {
    window.MathJax.Hub.Queue(['Typeset', MathJax.Hub])
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
  }, false)
  // UeScroll
  UeScroll.init()
  // mediumZoom
  mediumZoom('img.post-content-img', {
    background: 'rgba(153,153,153,0.6)'
  })
}
