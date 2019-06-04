import { 
  getPersonalKnoDetailApi,
  unbindTagPersonalKnoApi,
  bindTagToPersonalKnoApi,
  updatePersonalKnoApi
} from '../../../utils/http'
Page({
  data: {
    kno: [],
    tagModal: false,
    tagList: []
  },
  onLoad: function(options) {
    const that = this
    const { id } = options
    getPersonalKnoDetailApi({ id }).then(res => {
      if (res.data.success) {
        that.setData({ kno: res.data.result })
      }
    })
  },
  unbindTagForPersonalKno: function (e) {
    const { id: tid } = e.currentTarget.dataset
    const { kno } = this.data
    const { id: kid } = kno
    const that = this
    wx.showModal({
      title: '提示',
      content: '确定删除标签？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中'
          })
          unbindTagPersonalKnoApi({kid, tid}).then(res => {
            if (res.data.success) {
              wx.showToast({
                icon: 'none',
                title: '删除成功',
                duration: 1000
              })
              kno.types = res.data.result
              that.setData({ kno })
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
  },
  hideTagModal () {
    this.setData({ tagModal: false })
  },
  showTagModal () {
    this.setData({ tagModal: true })
  },
  onTagConfirm: function (e) {
    const that = this
    const { id: tid} = e.detail
    const { kno } = that.data
    bindTagToPersonalKnoApi({ kid: kno.id, tid  }).then(res => {
      if (res.data.success) {
        kno.types = res.data.result
        that.setData({ kno })
        that.hideTagModal()
      } else {
        wx.showToast({
          icon: 'none',
          title: res.data.error.split(': ')[1]
        })
      }
    }) 
  },
  deletePersonalKno: function () {
    wx.showModal({
      title: '提示',
      content: '确定删除知识？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中'
          })
          // unbindTagPersonalKnoApi({ kid }).then(res => {
          //   if (res.data.success) {
          //     wx.showToast({
          //       icon: 'none',
          //       title: '删除成功',
          //       duration: 1000
          //     })
          //     wx.navigateBack()
          //   } else {
          //     wx.showToast({
          //       icon: 'none',
          //       title: '删除失败',
          //       duration: 1000
          //     })
          //   }
          // })
        }
        wx.hideLoading()
      }
    }) 
  },
  changeTitle: function(e) {
    const { kno } = this.data
    const title = e.detail.value
    kno.title = title
    this.setData(kno)
  },
  changeContent: function(e) {
    const { kno } = this.data
    const content = e.detail.value
    kno.content = content
    this.setData(kno)
  },
  updatePersonalKno: function () {
    const {kno} = this.data
    updatePersonalKnoApi({ kno }).then(res => {
      if(res.data.success) {
        wx.showToast({ title: '更新成功' })
      } else {
        wx.showToast({ icon:'none', title: '更新失败' })
      }
    })
  }
})