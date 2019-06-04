// components/drug-add-modal/drug-add-modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModal:Boolean,
    default:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    date:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideModal:function(){
      this.triggerEvent('hideModal')
    },
    bindDateChange:function(e){
      this.setData({
        date:e.detail.value,
        default:e.detail.value
      })
    },
    onConfirm:function(){
      let date = this.data.date || this.data.default
      this.triggerEvent('editDate',date)
      this.triggerEvent('hideModal')
    },
    preventTouchMove() {
      return
    }
  }
})
