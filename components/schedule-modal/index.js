// components/drug-add-modal/drug-add-modal.js
import { getAllScheduleTypeApi } from '../../utils/http'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModal:Boolean,
    default:Object,
    index:Number,
    typeId:Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    type:[],
    selectType: null,
    selectTypeIndex: 0,
    contnet:'',
    inputTop: 20,
  },
  lifetimes: {
    attached() {
      const that = this
      const { typeId } = this.properties
      getAllScheduleTypeApi().then(res => {
        if(res.data.success) {
          that.setData({ 
            type: res.data.result,
            selectType: typeId ? res.data.result.filter(v => v.id === typeId)[0] : res.data.result[0]
          })
        }
      })
    }
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
    bindTextInput:function(e){
      let key = 'default.detail'
      this.setData({
        content: e.detail.value,
        [key]:''
      })
    },
    selectType: function(e){ 
      let key = 'default.detail'
      const { value: selectTypeIndex } = e.detail 
      this.setData({
        selectType: this.data.type[selectTypeIndex],
        selectTypeIndex,
        content:'',
        [key]:''
      })
    },
    onConfirm:function(){
      //add or edit?
      let index = this.data.index
      let schedule={
        type: this.data.selectType.id || this.data.default.type.schedule.id,
        content:this.data.content || this.data.default.schedule.detail,
        index: index
      }
      // console.log(schedule)
      this.triggerEvent('editData',schedule)
      this.triggerEvent('hideModal')
    },
    focus: function (e) {
      console.log(e)
      this.setData({ inputTop: 0 })
    },
    noFocus: function () {
      this.setData({ inputTop: 20 })
    }
  }
})
