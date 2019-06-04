import { 
  getAllTypeV2Api,
  addNewTypeApi,
  deleteTypeApi,
} from '../../../utils/http'
Page({
  data: {
    tagList: [],
    name: ''
  },
  onLoad: function () {
    const that = this
    getAllTypeV2Api().then(res => {
      if (res.data.success) {
        that.setData({ tagList: res.data.result })
      }
    })
  },
  inputNameChange: function (e) {
    const name = e.detail.value
    this.setData({ name })
  },
  addNewTag: function () {
    const that = this
    const { name } = this.data
    if (!name.trim()) {
      return
    }
    addNewTypeApi({ name }).then(res => {
      if (res.data.success) {
        that.setData({ tagList: res.data.result, name: '' })
      } else {
        wx.showToast({
          icon: 'none',
          title: res.data.error.split(': ')[1]
        })
      }
    })
  },
  deleteTag: function (e) {
    const that = this
    const { id } = e.detail
    wx.showModal({
      title: '提示',
      content: '确定删除标签？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中'
          })
          deleteTypeApi({ 
            id
          }).then(res => {
            if (res.data.success) {
              wx.showToast({
                icon: 'none',
                title: '删除成功',
                duration: 1000
              })
              that.setData({ tagList: res.data.result })
            } else {
              wx.showToast({
                icon: 'none',
                title: '删除失败',
                duration: 1000
              })
            }
          })
        }
        wx.hideLoading()
      }
    })
  }
})