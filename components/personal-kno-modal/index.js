// components/drug-add-modal/drug-add-modal.js
import { getAllScheduleTypeApi } from '../../utils/http'
Component({
  /**
   * 组件的初始数据
   */
  data: {
    title: '',
    content: ''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    hideModal:function(){
      this.triggerEvent('hideModal')
    },
    preventTouchMove: function () {
      return false
    },
    bindTitleInput:function(e){
      this.setData({
        title: e.detail.value
      })
    },
    bindContentInput:function(e){
      this.setData({
        content: e.detail.value
      })
    },
    onConfirm:function(){
      // console.log(schedule)
      const { title, content } = this.data
      this.triggerEvent('onConfirm', { title, content })
      this.triggerEvent('hideModal')
    },
    focus: function () {
      this.setData({ inputTop: 0 })
    },
    noFocus: function () {
      this.setData({ inputTop: 20 })
    }
  }
})
