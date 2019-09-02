function init () {
  // Lazyload
  var observer = lozad() // lazy loads elements with default selector as '.lozad'
  observer.observe()
  // UeScroll
  UeScroll.init()
  // mediumZoom
  mediumZoom('article img', {
    background: 'rgba(153,153,153,0.6)'
  })
}
