const app = getApp()
import { doctorLoginApi,
  loginByWxAaccountApi,
  bindWxAaccountApi } from '../../utils/http'

Page({
  data: {
    username: '',
    password: '',
    bind: true, // 默认是本微信已经绑定了某个账号
    iv: '',
    encryptedData: ''
  },
  loginSuccess: function (doctor) {
    wx.switchTab({
      url: '../index/index'
    })
    wx.setStorageSync('user', doctor) 
  },
  gotoLogin () {
    const that = this
    const { username, password, bind } = this.data
    if ( bind ) {
      // 如果有绑定微信号，直接账户密码登录
      doctorLoginApi({username, password}).then(res=> {
        const { data: { result, success }} = res
        if (success) {
          wx.switchTab({
            url: '../index/index'
          })
          wx.setStorageSync('user', result)
        } else {
          wx.showToast({
            icon: 'none',
            title: '用户或密码错误',
            duration: 1000
          })
        }
      })
    } else {
      const { iv, encryptedData} = this.data
      bindWxAaccountApi({
        username,
        password,
        code: app.globalData.code,
        iv,
        encryptedData
      }).then(res => {
        if (res.data.success) {
          const { result: { bind, doctor } } = res.data
          if (bind) {
            wx.showToast({icon: 'none',title: '绑定成功'})
            that.loginSuccess(doctor)
          } else {
            wx.showToast({icon: 'none',title: '绑定失败'})
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: '网络异常'
          })
        }
      })
    }
  },
  inputUsername (e) {
    const {value: username } = e.detail
    this.setData({username})
  },
  inputPassword (e) {
    const {value: password } = e.detail
    this.setData({password})
  },
  onGotUserInfoAndLogin(e) {
    const that = this
    const data = {
      code: app.globalData.code,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }
    loginByWxAaccountApi(data).then((res) => {
      const { data } = res
      if (data.success) {
        const { result: {bind, doctor} } = data
        if (bind) {
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1000
          })
          that.loginSuccess(doctor)
        } else {
          wx.showToast({
            title: '请绑定账号',
            icon: 'none',
            duration: 1500
          })
          that.setData({iv: e.detail.iv, encryptedData: e.detail.encryptedData, bind: false })
        }
      } else {
        wx.showToast({
          icon: 'none',
          title: '登录失败',
          duration: 1000
        })
      }
      that.loginForCode()
    }).catch((e) => {
      console.log(e)
    })
  },
  loginForCode: function () {
    wx.login({
      success(res) {
        if (res.code) {
          app.globalData.code = res.code
        } else {
          console.log('微信登录失败！' + res.errMsg)
        }
      }
    })
  },
  cancelBindAccount: function () {
    this.setData({ bind: true })
  }
})