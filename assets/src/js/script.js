function init () {
  NProgress.start()
  window.onload = function () { NProgress.done() }
}
