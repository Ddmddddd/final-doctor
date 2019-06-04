import { getAllScheduleTypeApi } from '../../../utils/http'

Page({
  data: {
    colorData: {
      //基础色相，即左侧色盘右上顶点的颜色，由右侧的色相条控制
      hueData: {
        colorStopRed: 255,
        colorStopGreen: 0,
        colorStopBlue: 0,
      },
      //选择点的信息（左侧色盘上的小圆点，即你选择的颜色）
      pickerData: {
        x: 0, //选择点x轴偏移量
        y: 480, //选择点y轴偏移量
        red: 0, 
        green: 0,
        blue: 0, 
        hex: '#000000'
      },
      //色相控制条的位置
      barY: 0
    },
    rpxRatio: 1, //此值为你的屏幕CSS像素宽度/750，单位rpx实际像素
    moduleList: [],
    currentTag: {}
  },
  onLoad() {
    const that = this
    //设置rpxRatio
    wx.getSystemInfo({
      success(res) {
        that.setData({
          rpxRatio: res.screenWidth / 750
        })
      }
    })
    getAllScheduleTypeApi().then(res => {
      if(res.data.success) {
        that.setData({
          moduleList: res.data.result
        })
      }
    }) 
  },
  //选择改色时触发（在左侧色盘触摸或者切换右侧色相条）
  onChangeColor(e) {
    //返回的信息在e.detail.colorData中
    this.setData({
      colorData: e.detail.colorData
    })
  },
  editSelectTag: function(e) {
    const { id } = e.currentTarget.dataset
    const currentTag = this.data.moduleList.filter(v => v.id === id)[0]
    this.setData({ currentTag })
  }
})