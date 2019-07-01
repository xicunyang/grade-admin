// 网络请求提示
var show = {
  errorInternet:function () {
    layer.msg("网络请求有误,请稍后再试");
  },
  errorInnerSuccess:function (msg) {
    layer.msg(msg);
  }
}
