function init () {
  // NProgress
  NProgress.start()
  window.onload = function () { NProgress.done() }
  // UeScroll
  UeScroll.init()
  // mediumZoom
  mediumZoom('article .post-body img')
}
