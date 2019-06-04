Page({
  data: {
    user: {},
    settingsList: [
      {
        imageUrl: '../../resources/images/tag.png',
        desc: '模块设置',
        goImageUrl: '../../resources/images/go-right.png',
        route: '/pages/config/module/module'
      }, {
        imageUrl: '../../resources/images/class.png',
        desc: '系统课程',
        goImageUrl: '../../resources/images/go-right.png',
        route: '/pages/class/class'
      }, {
        imageUrl: '../../resources/images/leaf.png',
        desc: '标签管理',
        goImageUrl: '../../resources/images/go-right.png',
        route: '/pages/config/tag/tag'
      }, {
        imageUrl: '../../resources/images/personal.png',
        desc: '个性知识',
        goImageUrl: '../../resources/images/go-right.png',
        route: '/pages/personal/personal'
      }
    ],
    audioUrl: ''
  },
  onLoad: function () {
    const user = wx.getStorageSync('user') || {alias: '医生'}
    this.setData({
      user
    })
  },
  doLogout: function () {
    wx.removeStorageSync('user')
    wx.removeStorageSync('role')
    wx.redirectTo({ url: '../login/login'})
  },
  gotoSetting (e) {
    const { route: url } = e.detail
    wx.navigateTo({ url })
  }
})