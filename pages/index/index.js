//index.js
import { searchPatientApi, patientListApi } from '../../utils/http'

Page({
  data: {
    patientRoleArr: [],
    currentRole: 0,
    patientList: [],
    allPatientNum: 0,
    keyword: '',
    loading: true,
    loadingOver: false,
    currentPage: 1,
    pageSize: 10,
    followupNoteModal: false,
    currentPatientId: ''
  },
  clearPatientListForLoad: function () {
    this.setData({
      loading: true,
      loadingOver: false,
      currentPage: 1,
      patientList:[]
    })
  },
  onLoad: function (options) {
    const { update = true } = options
    if (update) this.clearPatientListForLoad()

    const patientRoleArr = wx.getStorageSync('user').accessRole || {}
    const currentRole = wx.getStorageSync('role') || patientRoleArr[0]
    this.setData({ patientRoleArr, currentRole })
    this.getPatientList({ role: currentRole.id })
  },
  onShow: function(){
    this.tabToRefresh()
  },
  /** */
  tabToRefresh: function () {
    this.clearPatientListForLoad()
    const currentRole = wx.getStorageSync('role') || {id: 1}
    this.getPatientList({ role: currentRole.id }) 
  },
  /**
   * 
   */
  getPatientList({ role, keyword }) {
    const that = this
    if (!keyword) {
      let { patientList, currentPage, pageSize, loadingOver } = this.data
      patientListApi({ role, currentPage, pageSize }).then(res => {
        if (res.data.success) {
          const {allPatientNum, expPatients} = res.data.result
          patientList = patientList.concat(expPatients)
          if (patientList.length === allPatientNum) loadingOver = true
          else loadingOver = false
          that.setData({ patientList, loading: false, 
            allPatientNum, loadingOver, currentPage: currentPage + 1 })
        } 
      })
    } else {
      searchPatientApi({ keyword }).then(res => {
        if (res.data.success) {
          const {allPatientNum, expPatients} = res.data.result
          that.setData({ patientList: expPatients, allPatientNum,
            loading: false, loadingOver: true })
        } else {
          that.setData({ patientList: [], allPatientNum: 0,
            loading: false, loadingOver: true })        }
      })
    }
  },
  bindRolePickerChange(e) {
    const itemId = e.detail.value
    const currentRole = this.data.patientRoleArr[itemId]
    this.setData({ currentRole, loading: true, patientList: [], 
      loadingOver: false, currentPage: 1,
      keyword: '' })
    this.getPatientList({ role: currentRole.id }) 
    wx.setStorageSync('role', currentRole)
  },
  bindKeywordChange (e) {
    const keyword = e.detail.value
    this.setData({ keyword, loading: true, patientList: [], currentPage: 1, allPatientNum: 0 })
    if (keyword) this.getPatientList({keyword})
    else {
      this.getPatientList({ role: this.data.currentRole.id })
    }
  },
  addPatient:function(){
    wx.navigateTo({
      url: '../patient/patient'
    })
  },
  gotoManage: function(e) {
    const { id: patientId } = e.detail
    wx.showLoading({
      title:'加载中'
    })
    wx.navigateTo({
      url: '../manage/manage?id=' + patientId
    })
  },
  hideFollowupNoteModal: function() {
    this.setData({ followupNoteModal: false })
  },
  gotoShowNote: function (e) {
    const { id: patientId } = e.detail
    this.setData({
      currentPatientId: patientId,
      followupNoteModal: true
    })
  },
  // 滚动到底部加载更多
  onReachBottom: function () {
    const { loadingOver, keyword, currentRole } = this.data
    if (loadingOver || keyword) return
    this.getPatientList({ role: currentRole.id })
  },
})
