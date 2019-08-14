function init () {
  // NProgress
  NProgress.start()
  window.onload = function () { NProgress.done() }
  // mediumZoom
  mediumZoom('article .post-body img')
}
