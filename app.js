//app.js
App({
  globalData: {
    code: null,
    userInfo: null
  },
  onLaunch: function() {
    const that = this
    wx.login({
      success(res) {
        if (res.code) {
          console.log(res.code)
          that.globalData.code = res.code
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }
})