// pages/class/class-learn/class-learn.js
import { wxCourseApi } from '../../../utils/http'
const wxParser = require('../../../wxParser/index');
Page({
  /**R
   * 页面的初始数据
   */
  data: {
    studyingItem: {},
  },
  /**
   * 获取某知识的具体数据
   * POST patientId kid
   */
  knowledgeInfo: function(kid) {
    var that = this;
    let patientId = 'T0001283'
    wxCourseApi({patientId , kid}).then(res => {
      let result = res.data.result
      that.setData({
        studyingItem: result
      });
      if (result.type == 1){
        wxParser.parse({
          bind: 'richText',
          html: res.data.result.content,
          target: that,
          enablePreviewImage: false, // 禁用图片预览功能
          tapLink: (url) => { // 点击超链接时的回调函数
            // url 就是 HTML 富文本中 a 标签的 href 属性值
            // 这里可以自定义点击事件逻辑，比如页面跳转
          }
        })
      }
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var kid = options.kid;
    this.knowledgeInfo(kid);
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


});
