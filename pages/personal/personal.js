import { getAllPersonalKnoApi, addNewPersonalKnoApi, deletePersonalKnoApi } from '../../utils/http'
Page({
  data: {
    knoList: [],
    addKnoModal: false,
  },
  onLoad: function () {
    const that = this
    getAllPersonalKnoApi().then(res => {
      if(res.data.success) {
        that.setData({ knoList: res.data.result })
      }
    })
  },
  showKnoDetail: function (e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: '/pages/personal/detail/detail?id=' + id})
  },
  deleteKno: function (e) {
    const that = this
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '提示',
      content: '确定删除知识？',
      success(res) {
        if (res.confirm) {
          deletePersonalKnoApi({ id }).then(res => {
            if (res.data.success) {
              let { knoList } = that.data
              knoList = knoList.filter(v => v.id != id)
              that.setData({ knoList })
            } else {
              wx.showToast({
                icon: 'none',
                title: '删除知识失败'
              }) 
            }
          })
        }
      }
    })
  },
  hideAddKnoModal () {
    this.setData({ addKnoModal: false })
  },
  showAddKnoModal () {
    this.setData({ addKnoModal: true })
  },
  addKnoConfirm: function (e) {
    const that = this
    const { title, content } = e.detail
    addNewPersonalKnoApi({ title, content }).then(res => {
      if (res.data.success) {
        const { knoList } = that.data
        knoList.splice(0, 0, res.data.result)
        that.setData({ knoList })
      } else {
        wx.showToast({
          icon: 'none',
          title: '新增知识失败'
        })
      }
    })
  }
})