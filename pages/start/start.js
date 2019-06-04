Page({
  onLoad: function () {
    const user = wx.getStorageSync('user') || null
    let url = '/pages/index/index'
    const timeout = 500
    if (!user) url = '/pages/login/login'
    setTimeout(() => {
      wx.reLaunch({ url })
    }, timeout)
  }
})