/**
 * 医生端上的健康课堂-系统性课程展示
 * 和患者端不同的地方就是没有进度控制，可以任意查看
 */
import {
  mainCourseApi,
  childCourseApi,
} from '../../utils/http'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //系统化教育data
    tabbarData: {
      navbarWidth: 50,
      tabs: []
    },
    subscribeList: [],
    subResult: [],
    sectionShow: [
      [
        [true]
      ]
    ],
    chapterShow: [
      [true]
    ],
  },
  /**
   * mainCourseInfor
   * 计算获取tabbar 数据
   */
  mainCourseInfor: function () {
    var that = this
    let tab = this.selectComponent('#mytab')
    return new Promise((resolve, reject) => {
      mainCourseApi().then((res)=>{
        let parentCourse = res.data.result
        var coidList = [],nameList = []
        parentCourse.map(function (item) {
          if (item) {
            coidList.push(item.id)
            nameList.push(item.name)
          }
        })
        that.setData({
          subResult: parentCourse
        })
        if (parentCourse.length > 0) {
          //计算 tabbarData
          let width = Math.floor(100 / parentCourse.length)
          that.setData({
            tabbarData: {
              navbarWidth: width,
              tabs: nameList
            },
            subscribeList: coidList
          })
          tab.setData({
            activeIndex: 0
          })
          resolve('class')
        } else {
          that.setData({
            tabbarData: {
              navbarWidth: 100,
              tabs: '当前没有课程'
            },
            subscribeList: coidList
          })
          tab.setData({
            activeIndex: 0
          })
          // reject('noclass')
        }

      })
    })
  },

  /**
   * 根据subscribeList获取classSchedule , 对应相应coid
   */
  classScheduleList: function () {
    var that = this
    this.data.subscribeList.map(function (item) {
      let coid = parseInt(item)
      childCourseApi({coid}).then(res => {
        let result = res.data.result
        let section = new Array(),
          chapter = new Array()
        for (let i = 0; i < result.length; i++) {
          section[i] = new Array()
          chapter[i] = true
          for (let j = 0; j < result[i].child.length; j++) {
            section[i][j] = true
          }
        }
        that.setData({
          ['classSchedule.' + item]: res.data.result,
          ['sectionShow[' + (item - 1) + ']']: section,
          ['chapterShow[' + (item - 1) + ']']: chapter
        })
      })
    })
  },

  /**
   * gotoStudy 前往学习页面 携带参数：toLearnList
   */
  gotoStudy: function (event) {
    var kid = event.currentTarget.dataset.kid
    wx.navigateTo({
      url: '../class/class-content/class-content?kid=' + kid
    })
  },
  changeShowStatus: function (e) {
    let id = e.currentTarget.dataset.stateid
    let key, value
    if (id.length > 2) {
      key = 'sectionShow[' + id[0] + '][' + id[1] + '][' + id[2] + ']'
      value = !this.data.sectionShow[id[0]][id[1]][id[2]]
    } else {
      key = 'chapterShow[' + id[0] + '][' + id[1] + ']'
      value = !this.data.chapterShow[id[0]][id[1]]
    }
    this.setData({
      [key]: value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    this.mainCourseInfor().then(res=>{
      that.classScheduleList()
    })
  },

})