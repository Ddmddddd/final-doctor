// components/drug-add-modal/drug-add-modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModal:Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
    note: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideModal:function(){
      this.triggerEvent('hideModal')
    },
    onConfirm:function(){
      const { note } = this.data
      this.triggerEvent('onConfirm', { note })
    },
    inputNote: function(e) {
      const note = e.detail.value
      this.setData({
        note
      })
    },
    preventTouchMove() {
      return
    }
  }
})
