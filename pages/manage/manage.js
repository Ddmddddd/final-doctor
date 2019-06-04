// pages/manage/manage.js
import { formatTimeYYMMDD, formatTimeForAxis, formatDate1 } from '../../utils/util'
import * as echarts from '../../components/ec-canvas/echarts.min'

import {
  // patientDetailApi,
  patientDeatilInfoApi,
  patientDeatilFollowupApi,
  patientDetailScheduleApi,
  patientDetailLearnApi,

  getBPRecordApi,

  followupEditApi,
  followupCompleteApi,
  scheduleAddApi,
  scheduleDeleteApi,
  scheduleUpdateApi,
  deletePatientApi,

  bindTagToPatientApi,
  unbindTagToPatientApi
} from '../../utils/http'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //生活计划type--color
    // tagcolor: ['', 'sport', 'alcohol', 'food', 'smoke', 'drug', 'self'],
    patient: {},
    schedule: {},
    followup: {},
    education: {},
    bpRecordList: null,

    ec: {
      lazyLoad: true
    },
    followupTime: '',
    followupModal: false,
    followupNoteModal: false,

    scheduleModal: false,
    defaultSchedule: {},
    selectedTypeId: null,

    tagModal: false,
    evaluatelab:0,
    drink:null,
    smoke:null,
    dia: null,
    bmi: null,
    tc: null,
    Hdlc:null,
    sbp: null,
    drinkid:0,
    smokeid:0,
    diaid:0,
    bmiid:0,
    tcid:0,
    Hdlc:0,
    sbp:0,
    advice:null,
    weightModal:false,
  },

  /**
   * 获取患者管理信息
   */
  getPaientDetailInfo() {
    const that = this
    patientDeatilInfoApi({patientId: this.data.patientId}).then(res => {
      if (res.data.success) that.setData({ patient: res.data.result})
    })
  },
  getPatientDetailFollowup() {
    const that = this
    patientDeatilFollowupApi({ patientId: this.data.patientId }).then(res => {
      const { data: { result, success } } = res
      if (success) {
        that.setData({ 
          followup: result.next,
          followupTime: result.next.followupTime })
      }
    }) 
  },
  getPatientDetailSchedule() {
    const that = this
    patientDetailScheduleApi({ patientId: this.data.patientId }).then(res => {
      const { data: { result, success }} = res
      if (success) {
        that.setData({schedule: result})
        wx.hideLoading()
      }
    })
  },
  getPaientDetailLearn() {
    const that = this
    patientDetailLearnApi({ patientId: this.data.patientId }).then(res => {
      const { data: { result, success }} = res
      if (success) {
        that.setData({education: result})
      }
    })
  },
  getPatientDetailBPRecord () {
    const that = this
    this.ecComponent = this.selectComponent('#mychart-dom-bar')
    const now = new Date()
    const start = formatTimeYYMMDD(new Date(now - 7*24*3600000))
    const end = formatTimeYYMMDD(now)
    getBPRecordApi({ patientId: this.data.patientId, start, end }).then(res => {
      if (res.statusCode === 200) {
        that.setData({
          bpRecordList: res.data
        })
        that.init()
      }
    })
  },
  patientDetail: function() {
    this.getPaientDetailInfo()
    this.getPatientDetailFollowup()
    this.getPatientDetailSchedule()
    this.getPaientDetailLearn()
    this.getPatientDetailBPRecord()
  },
  /**
   * 打电话 makePhoneCall
   */
  makePhoneCall:function(){
    let phone = this.data.patient.phoneNumber
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function(e) {
        const { errMsg } = e
        if (errMsg == 'makePhoneCall:ok') {
          // 记录一次电话随访的时间
          console.log(errMsg)
        }
      }
    })
  },
  /**
   * followupEdit 修改 随访时间 随访记录id newtime
   * followupComplete 完成随访 随访记录id
   */
  showFollowupModal: function() {
    this.setData({
      followupModal: true
    })
  },
  hideFollowupModal: function() {
    this.setData({
      followupModal: false
    })
  },
  hideFollowupNoteModal: function () {
    this.setData({ followupNoteModal: false })
  },
  followupEdit: function(e) {
    var that = this
    let id = that.data.followup.id
    let newTime = e.detail
    // console.log(newTime)
    followupEditApi({ id, newTime }).then(res => {
      if (res.data.success === true) {
        wx.showToast({
          icon: 'none',
          title: '修改成功',
          duration: 1000
        })
        that.setData({
          followupTime: newTime,
          followup: res.data.result
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '修改失败',
          duration: 1000
        })
      }
    })
  },
  followupComplete: function() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认随访已完成？',
      success(res) {
        if (res.confirm) {
          setTimeout(() => {
            that.setData({
              followupNoteModal: true
            })
          }, 200)
        }
      }
    })
  },
  editFollowupNoteComplete: function (e) {
    const that = this
    const id = this.data.followup.id
    const { note } = e.detail
    followupCompleteApi({ id, note }).then(res => {
      if (res.data.success === true) {
        wx.showToast({
          icon: 'none',
          title: '随访完成',
          duration: 1000
        })
        const { followupTime } = res.data.result
        that.setData({
          followup: res.data.result,
          followupTime
        })
        that.hideFollowupNoteModal()
      } else {
        wx.showToast({
          icon: 'none',
          title: '随访失败',
          duration: 1000
        })
      }
    })
  },
  /**
   * scheduleEdit 修改 随访时间 随访记录id newtime
   * scheduleDelete 删除 随访记录id
   */
  showScheduleModal: function(e) {
    let { index, typeid: selectedTypeId } = e.currentTarget.dataset
    this.setData({
      selectedTypeId,
      defaultSchedule:
        index > -1
          ? this.data.schedule[index]
          : { type: { id: 1, name: '运动' } },
      scheduleModal: true,
      index : index,
    })
  },
  hideScheduleModal: function() {
    this.setData({
      scheduleModal: false
    })
  },
  scheduleEdit: function(e) {
    var that = this
    let schedule = e.detail
    let index = schedule.index
    if (index > -1) {
      //edit
      let scheduleId = that.data.schedule[index].schedule.id
      let detail = schedule.content
      let typeId  = schedule.type
      scheduleUpdateApi({scheduleId,detail,typeId}).then(res => {
        if (res.data.success === true) {
          let key = 'schedule['+ index + '].schedule'
          that.setData({
            [key]:res.data.result 
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '修改失败',
            duration: 1000
          })
        }
      })

    } else {
      //add
      let patientId = that.data.patientId
      let detail = schedule.content
      let typeId = schedule.type
      console.log(detail)
      console.log(typeId)
      scheduleAddApi({patientId,detail,typeId}).then(res => {
        const { data: { result, success}} = res
        if (success) {
          const temp = {}
          temp.all = 0
          temp.complete = 0
          temp.schedule = result
          that.setData({
            schedule: that.data.schedule.concat(temp) 
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '新增失败',
            duration: 1000
          })
        }
      })
    }
  },
  scheduleDelete: function(e) {
    let index = e.currentTarget.dataset.index
    let scheduleId = this.data.schedule[index].schedule.id
    let patientId = this.data.patientId
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认删除该条计划？',
      success(res) {
        if (res.confirm) {
          scheduleDeleteApi({ patientId ,scheduleId}).then(res => {
            if (res.data.success) {
              that.setData({
                schedule: res.data.result
              })
            } else {
              wx.showToast({
                icon: 'none',
                title: '删除失败',
                duration: 1000
              })
            }
          })
        } else if (res.cancel) {
          console.log('cancel')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   *
   */
  onShow: function() {
    const { patientId } = this.data
    this.patientDetail(patientId)
    // const patientId = '620104198307240272'
    var DATE = formatDate1(new Date());
    var that = this
    wx.request({
      method: 'GET',
      data: { "patientId": patientId.toString() },
      url: 'https://eval.zjubiomedit.com/eval/doctor/types',
      success: function (res) {
        that.setData({
          drink: { name: res.data.drink,id:1 },
          smoke: { name: res.data.smoke,id:2 },
          tc: { name: res.data.tbc,id:3 },
          sbp: { name: res.data.sbp,id:4 },
          Hdlc: { name: res.data.Hdlc,id:5 },
          dia: { name: res.data.dia,id:6 },
          bmi: { name: res.data.bmi,id:7 },
        })
      }
    })
  },

  onLoad: function(options) {
    let patientId = options.id
    // const patientId = '620104198307240272'
    this.setData({
      patientId : patientId,
    })  
    var DATE = formatDate1(new Date());
    var that=this
    wx.request({
      method:'GET',
      data:{"patientId":patientId.toString(),
      "nowtime":DATE.toString()},
      url: 'https://eval.zjubiomedit.com/eval/doctor/evaluatelab',
      success:function(res){
        that.setData({
          evaluatelab:res.data
        })
      }
    })
    wx.request({
      method:'GET',
      data:{"patientId":patientId.toString()},
      url: 'https://eval.zjubiomedit.com/eval/doctor/gettags',
      success:function(res){
      //  console.log(res.data)
        that.setData({
          drinkid: res.data.drink ,
          smokeid: res.data.smoke ,
          tcid: res.data.tc ,
          sbpid: res.data.sbp ,
          Hdlcid: res.data.Hdlc ,
          diaid: res.data.dia ,
          bmiid: res.data.bmi ,
        })
      }
    })
    wx.request({
      method:'GET',
      data:{"patientId":patientId.toString()},
      url: 'https://eval.zjubiomedit.com/eval/doctor/types',
      success:function(res){
        that.setData({
            drink:{name:res.data.drink,id:1},
            smoke:{name:res.data.smoke,id:2},
            tc:{name:res.data.tbc,id:3},
            sbp:{name:res.data.sbp,id:4},
            Hdlc:{name:res.data.Hdlc,id:5},
            dia:{name:res.data.dia,id:6},
            bmi:{name:res.data.bmi,id:7},
        })
      }
    })
  },
  gotoEditPatientInfo: function () {
    const { patientId } = this.data
    wx.navigateTo({
      url: `../patient/patient?patientId=${patientId}`
    })
  },
  deletePatient: function () {
    const { patientId } = this.data
    wx.showModal({
      title: '提示',
      content: '确认删除患者？',
      success(res) {
        if (res.confirm) {
          deletePatientApi({ 
            patientId 
          }).then(res => {
            if (res.data.success) {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
              }) 
              setTimeout(() => {
                wx.navigateBack({})
              }, 500)
            } else {
              wx.showToast({
                title: '删除失败',
                icon: 'none',
              }) 
            }
          })
        } 
      }
    }) 
  },
  // 显示血压记录
  createData: function () {
    var average = []
    const { bpRecordList } = this.data

    bpRecordList.sort(function (a, b) {
      return a.measureTime > b.measureTime ? 1 : -1
    })
    this.setData({ bpRecordList })
    average = bpRecordList.map(function (item) {
      return [
        parseInt(item.diastolicPressure),
        parseInt(item.systolicPressure)
      ]
    })
    return average
  },
  setOption: function (chart) {
    const { bpRecordList } = this.data
    var data = (this.createData()).reverse()
    var yMax = 200
    var dataShadow = []

    for (var i = 0; i < data.length; i++) {
      dataShadow.push(yMax)
    }

    var dateAxis = bpRecordList.map(function (item) {
      return formatTimeForAxis(item.measureTime)
    })

    const series = this.data.bpRecordList.length > 0 ? 
      [{
        name: 'systolic bp',
        type: 'bar',
        itemStyle: {color: '#00C5CD'},
        label:{
          normal:{
            show:true,            
            position: 'top'  
          }
        },
        data: data.map(v => v[0])
      }, {
        name: 'diastolic bp',
        type: 'bar',
        itemStyle: {color: '#FF0000'},
        label:{
          normal:{
            show:true,            
            position: 'top'  
          }
        },
        data: data.map(v => v[1])
      }] : 
      [
        { // For shadow
          type: 'bar',
          itemStyle: {
            normal: { color: 'rgba(0,0,0,0.05)' }
          },
          barGap: '-100%',
          barCategoryGap: '40%',
          data: [200],
          animation: false
        },
      ]
    var option = {
      title: {
        text: '血压趋势',
        padding: [20, 20, 0, 20],
        textStyle: {
          color: '#188df0',
          fontWeight: 'bold',
          fontSize: 20
        },
      },
      xAxis: {
        data: dateAxis,
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        z: 10
      },
      yAxis: {
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#999'
          }
        }
      },
      series
    }
    chart.setOption(option)
  },
  init: function () {
    this.ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      this.setOption(chart)
      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart

      this.setData({
        isLoaded: true,
        isDisposed: false
      })

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart
    })
  },
  showTagModal: function() {
    this.setData({ tagModal: true })
  },
  hideTagModal: function() {
    this.setData({ tagModal: false})
  },
  onTagConfirm: function (e) {
    const that = this
    const tag = e.detail
    const { patientId } = this.data
    bindTagToPatientApi({ patientId, tagId: tag.id }).then(res => {
      if (res.data.success) {
        const { patient } = that.data
        patient.types = res.data.result
        that.setData({ patient })
        that.hideTagModal()
      } else {
        wx.showToast({
          icon: 'none',
          title: res.data.error.split(': ')[1]
        })
      }
    })
  },
  deleteTag : function (e) {
    const that = this
    const { id } = e.detail
    const { patient } = this.data

    wx.showModal({
      title: '提示',
      content: '确定删除标签？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中'
          })
          unbindTagToPatientApi({ 
            patientId: patient.patientIdentifier,
            tagId: id
          }).then(res => {
            if (res.data.success) {
              wx.showToast({
                icon: 'none',
                title: '删除成功',
                duration: 1000
              })
              patient.types = res.data.result
              that.setData({ patient })
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
  deleteeTag: function (e) {
    const {id}=e.detail
    console.log(id)
    var patientId=this.data.patientId
    var that=this

    wx.showModal({
      title: '提示',
      content: '确定删除标签？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中'
          })
          wx.request({
            method:'GET',
            data:{
              "patientId":patientId,
              "id":id.toString()
            },
            url: 'https://eval.zjubiomedit.com/eval/doctor/deletetag',
            success:function(res){
              wx.request({
                method: 'GET',
                data: { "patientId": patientId.toString() },
                url: 'https://eval.zjubiomedit.com/eval/doctor/gettags',
                success: function (res) {
                  console.log(res.data)
                  that.setData({
                    drinkid: res.data.drink,
                    smokeid: res.data.smoke,
                    tcid: res.data.tc,
                    sbpid: res.data.sbp,
                    Hdlcid: res.data.Hdlc,
                    diaid: res.data.dia,
                    bmiid: res.data.bmi,
                  })
                }
              })
              wx.showToast({
                icon: 'none',
                title: '删除成功',
                duration: 1000
              })
            }
          })
        }
        wx.hideLoading()
      }
    })
  },
})
