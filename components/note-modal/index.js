import { followupAllNoteApi, wxCourseApi } from '../../utils/http'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModal: Boolean,
    patientId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideModal:function(){
      this.triggerEvent('hideModal')
    },
    // onConfirm:function(){
    //   const { note } = this.data
    //   this.triggerEvent('onConfirm', { note })
    // },
    inputNote: function(e) {
      const note = e.detail.value
      this.setData({
        note
      })
    },
    preventTouchMove() { return }
  },
  lifetimes: {
    attached() {
      const that = this
      // wx.showLoading({ title: '加载中' })
      const { patientId } = this.properties
      followupAllNoteApi({ patientId }).then(res => {
        if(res.data.success) {
          that.setData({ list: res.data.result })
          // wx.hideLoading()
        }
      })
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})
