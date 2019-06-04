// pages/evaluate/evaluate.js

import {
  bindTagToPatientApi,
  scheduleAddApi,
} from '../../utils/http'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentSource:'',
    currentType:'',
    currentTip: '',
    currentIndex:0,
    adviseArr: null,
    patientId: [],
    wrisk: [],
    frisk: 0,
    irisk: 0,
    patient: {
      name: [],
      sex: [],
      age: [],
      phoneNumber: [],
    },
    testtime: [],
    information: {
      drink: [],
      smoke: [],
      dia: [],
      tc: [],
      Hdlc: [],
      bmi: [],
      sbp: [],
      weight: [],
      height: [],
    },
    risk: {
      drink: [],
      smoke: [],
      dia: [],
      tc: [],
      Hdlc: [],
      bmi: [],
      bp: [],
    },
    showtip:false,
    intip:[],
    confirmlist:[]
  },

  makePhoneCall: function() {
    let phone = this.data.patient.phoneNumber
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function(e) {
        const {
          errMsg
        } = e
        if (errMsg == 'makePhoneCall:ok') {
          // 记录一次电话随访的时间
          console.log(errMsg)
        }
      }
    })
  },
  hideModal: function() {
    this.setData({
      showtip:false,
    })
  },
  cancel: function() {
    this.setData({
      showtip:false,
    })
  },
  stip: function (e) {
    console.log(e)
    const { tip: currentTip,index:currentIndex,type:currentType,source:currentSource } = e.currentTarget.dataset
    this.setData({
      showtip: true,
      currentType,
      currentTip,
      currentSource,
      currentIndex,
    })
  },
  inputtip: function (e) {
    this.setData({
      intip: e.detail.value
    })
  },
  confirmtip: function () {
    var index=this.data.currentIndex
    var tip = 'adviseArr[' + index + '].tip'
   // console.log(index)
    this.setData({
      [tip]:this.data.intip,
      showtip: false,
    })
   // console.log(this.data.adviseArr)
  },

  addadvice:function(e){
    const { value } = e.detail
    const { key } = e.currentTarget.dataset
    let { confirmlist } = this.data
    if(value.length == 0){
      confirmlist=this.removeItem(confirmlist,key)
    }
    else{
      confirmlist.push(Number.parseInt(value[0]))
    }
    console.log(confirmlist)
    this.setData({ confirmlist })
  },

removeItem:function(arr, item){
    let newArr = [];
    for(let value of arr) {
      if (value !== item) {
        newArr.push(value)
      }
    }
    return newArr;
  },

  confirm: function() {
    var patientId = this.data.patientId
    wx.request({
      method: 'GET',
      data: {
        "patientId": patientId.toString(),
      },
      url: 'https://eval.zjubiomedit.com/eval/doctor/tags',
    })
    const { adviseArr, confirmlist } = this.data
    for (let i of confirmlist){
      var detail=adviseArr[i].tip
      var typeId = adviseArr[i].id
        scheduleAddApi({ patientId, detail, typeId }).then(res => {
          const { data: { result, success } } = res
          console.log(res)
        })
    }
    wx.navigateBack()
    wx.navigateBack()
    wx.navigateTo({
      url: '../manage/manage?id=' + patientId
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var patientId = options.id
    var sex=options.sex
    this.setData({
      patientId: options.id,
      patient: {
        name: options.name,
        sex: options.sex,
        age: options.age,
        phoneNumber: options.phoneNumber,
      }
    })
/*    if (options.sex == '女') {
      this.setData({
        tip5: "不饮酒或限制饮酒，避免饮用高度酒。白酒、葡萄酒、啤酒摄入量分别少于25ml、50ml、150ml。",
      })
    }*/
    var that = this
    wx.request({
      method: 'GET',
      data: {
        "patientId": patientId.toString(),
      },
      url: 'https://eval.zjubiomedit.com/eval/doctor/getrecord',
      success: function(res) {
        console.log(res.data)
        switch (res.data.wrisk) {
          case "40":
            that.setData({
              wrisk: ">40%"
            })
            break
          case "30":
            that.setData({
              wrisk: "30~40%"
            })
            break
          case "20":
            that.setData({
              wrisk: "20~30%"
            })
            break
          case "10":
            that.setData({
              wrisk: "10~20%"
            })
            break
          case "1":
            that.setData({
              wrisk: "<10%"
            })
            break
        }
        that.setData({
          frisk: res.data.frisk,
          irisk: res.data.irisk,
        })
      }
    })
    Math.round
    wx.request({
      method: 'GET',
      data: {
        "patientId": patientId.toString()
      },
      url: 'https://eval.zjubiomedit.com/eval/doctor/patient/information',
      success: function(res) {
        console.log(res.data)
   /*     if (Math.round(res.data.bmi) > 29) {
          that.setData({
            tip1: "减轻体重，进行额外运动，每天进行中度活动75分钟。"
          })
        }*/
        that.setData({
          information: {
            drink: res.data.drink,
            smoke: res.data.smoke,
            dia: res.data.dia,
            tc: res.data.tc,
            Hdlc: res.data.Hdlc,
            bmi: res.data.bmi,
            sbp: res.data.sbp,
            weight: Math.round(res.data.weight),
            height: Math.round(res.data.height),
          }
        })
      }
    })
   // var tips = this.data.tips
    wx.request({
      method: 'GET',
      data: {
        "patientId": patientId.toString()
      },
      url: 'https://eval.zjubiomedit.com/eval/doctor/types',
      success: function(res) {
        that.setData({
          risk: {
            drink: res.data.drink,
            smoke: res.data.smoke,
            dia: res.data.dia,
            tc: res.data.tbc,
            Hdlc: res.data.Hdlc,
            bmi: res.data.bmi,
            sbp: res.data.sbp,
          }
        })
     /*   if (res.data.drink == '饮酒') {
          tips.drink = 1
        }
        if (res.data.smoke == '吸烟') {
          tips.smoke = 1
        }
        if (res.data.bmi == '超重') {
          tips.weight = 1,
            tips.exercise = 1,
            tips.salt = 1,
            tips.diet = 1
        }
        if (res.data.sbp == '血压过高') {
          tips.exercise = 1,
            tips.salt = 1,
            tips.diet = 1,
            tips.pressure = 1,
            tips.drug = 1
        }
        if (res.data.tc == '血总胆固醇异常' || res.data.Hdlc == '高密度脂蛋白胆固醇异常') {
          tips.exercise = 1,
            tips.salt = 1,
            tips.diet = 1,
            tips.drug = 1
        }
        if (res.data.dia == '血糖过高') {
          tips.adia = 1,
            tips.exercise = 1,
            tips.drug = 1,
            tips.diadiet = 1
        }
        console.log(tips)
        that.setData({
          tips: tips
        })*/
      }
    })
  //  console.log(this.data.tips)
    wx.request({
      method:'GET',
      data: { "patientId": patientId.toString(),
      "sex":sex.toString()},
      url: 'https://eval.zjubiomedit.com/eval/doctor/tips',
      success:function(res){
        console.log(res.data)
        that.setData({
          adviseArr:res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})