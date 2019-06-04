// const baseUrl = 'http://localhost:8080/api'
// const baseUrl = 'https://zjubiomedit.com/eduexperiment/api'

import {hypertensionUrl, baseEducationUrl} from './config'

const request = ({
  data = {},
  url = '',
  method = 'GET',
  header = { 'content-type': 'application/json' },
  baseUrl = baseEducationUrl
}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + url,
      header: header,
      data: data,
      method: method,
      success: res => {
        // 判断服务器返回状态，辅助debug
        // console.log('http response', res)
        const { statusCode } = res
        if (statusCode > 400 && statusCode < 500) {
          wx.showToast({
            title: '端口请求错啦' + statusCode,
            icon: 'none'
          })
          return false
        } else if (statusCode > 500) {
          wx.showToast({
            title: '服务器请求失败' + statusCode,
            icon: 'none'
          })
          return false
        }
        resolve(res)
      },
      fail: err => {
        wx.showLoading({
          title: '网络错误!'
        })
        setTimeout(() => {
          wx.hideLoading()
        }, 3000)
        reject(err)
      }
    })
  })
}

// login
const doctorLoginUrl = '/doctor/login'
export const doctorLoginApi = function ({username, password}) {
  return request({url: doctorLoginUrl, data: {username, password}, method: 'POST', header: {'content-type': 'application/x-www-form-urlencoded'}})
}

// loginByWx
const loginByWxAaccountUrl = '/wx/login'
export const loginByWxAaccountApi = function(data) {
  return request({ url: loginByWxAaccountUrl, data, method: 'POST', header: {'content-type': 'application/x-www-form-urlencoded'}})
}
const bindWxAaccountUrl = '/wx/bind/account'
export const bindWxAaccountApi = function(data) {
  return request({ url: bindWxAaccountUrl, data, method: 'POST', header: {'content-type': 'application/x-www-form-urlencoded'}})
}

const getAllDoctorUrl =  '/doctor/all'
export const getAllDoctorApi = function () {
  return request({url: getAllDoctorUrl})
}
/**
 * manage.js
 */
//patient add 
const patientAddUrl =  '/patient/add'
export const patientAddApi = function ({ patientInfo  }){
  return request({url: patientAddUrl, data:patientInfo, method: 'POST', header: {'content-type': 'application/x-www-form-urlencoded'}})
}
// update patient
const patientUpdateUrl =  '/patient/update'
export const patientUpdateApi = function (data){
  return request({url: patientUpdateUrl, data: data, method: 'POST', header: {'content-type': 'application/x-www-form-urlencoded'}})
}

// get single patient info
const patientInfoUrl =  '/patient/info'
export const patientInfoApi = ({ patientId }) => {
  return request({ url: patientInfoUrl, data: { patientId }})
}
// get all patient Role
const patientRoleUrl =  '/patient/manage/role'
export const patientRoleApi = () => {
  return request({ url: patientRoleUrl })
}
// check patient exist or not
const patientCheckExistUrl =  '/patient/check/exist'
export const patientCheckExistApi = ({ patientId }) => {
  return request({ url: patientCheckExistUrl, data: { patientId }, method: 'POST', header: {'content-type': 'application/x-www-form-urlencoded'}})
}

// patientList
const patientListUrl =  '/patient/manage/list'
export const patientListApi = ({ role, currentPage = 1, pageSize = 10}) => {
  return request({ url: patientListUrl, data: { role, currentPage, pageSize }})
}

// delete Patient
const deletePatientUrl =  '/patient/delete'
export const deletePatientApi = ({ patientId }) => {
  return request({url: deletePatientUrl, data: { patientId }, method: 'POST', header: {'content-type': 'application/x-www-form-urlencoded'}})
}
// search Patient
const searchPatientUrl =  '/patient/search'
export const searchPatientApi = ({ keyword }) => {
  return request({ url: searchPatientUrl, data: {keyword}})
}
// patientDeatil
const patientDetailUrl =  '/patient/manage/detail'
export const patientDetailApi = function ({patientId}) {
  return request({url: patientDetailUrl, data: {patientId}})
}
/**
 * new Detail
 */
const patientDeatilInfoUrl =  '/patient/manage/detail/info'
export const patientDeatilInfoApi = ({ patientId }) => {
  return request({url: patientDeatilInfoUrl, data: { patientId }})
}
const patientDeatilFollowupUrl =  '/patient/manage/detail/followup'
export const patientDeatilFollowupApi = ({ patientId }) => {
  return request({url: patientDeatilFollowupUrl, data: { patientId }})
}
const patientDetailScheduleUrl =  '/patient/manage/detail/schedule'
export const patientDetailScheduleApi = ({ patientId }) => {
  return request({url: patientDetailScheduleUrl, data: { patientId }})
}
const patientDetailLearnUrl =  '/patient/manage/detail/learn' 
export const patientDetailLearnApi = ({ patientId }) => {
  return request({url: patientDetailLearnUrl, data: { patientId }})
}

//followup
const followupEditUrl =  '/followup/edit'
export const followupEditApi = function ({id , newTime}) {
  let url =  followupEditUrl + '?id=' + id + '&newTime=' + newTime  
  return request({url: url , method:'POST'})
}
const followupCompleteUrl =  '/followup/complete'
export const followupCompleteApi = function ({id, note}) {
  return request({url: followupCompleteUrl, data: { id, note },
    method:'POST',header: {'content-type': 'application/x-www-form-urlencoded'}} )
}

const followupAllNoteUrl =  '/followup/note/all' 
export const followupAllNoteApi = ({ patientId }) => {
  return request({url: followupAllNoteUrl, data: { patientId }})
}


// schedule
const getAllScheduleTypeUrl =  '/schedule/type/all'
export const getAllScheduleTypeApi = () => {
  return request({url: getAllScheduleTypeUrl})
}
//patientId detail typeid
const scheduleAddUrl =  '/schedule/doctor/add'
export const scheduleAddApi = function ({patientId,detail,typeId}) {
  return request({url: scheduleAddUrl, data:{patientId,detail,typeId}, method: 'POST', header: {'content-type': 'application/x-www-form-urlencoded'}})
}

const scheduleDeleteUrl =  '/schedule/doctor/delete'
export const scheduleDeleteApi = function ({patientId ,scheduleId }) {
  let url = scheduleDeleteUrl + '?patientId=' + patientId + '&scheduleId=' + scheduleId
  return request({url: url , method:'POST'})
}
const scheduleUpdateUrl =  '/schedule/doctor/update'
export const scheduleUpdateApi = function ({scheduleId,detail,typeId }) {
  let url = scheduleUpdateUrl + '?scheduleId=' + scheduleId + '&detail=' + detail + '&typeId=' +typeId
  return request({url: url , method:'POST'})
}
// knowledge
const mainCourseUrl =  '/course/parent'
export const mainCourseApi = function () {
  return request({url: mainCourseUrl})
}
const childCourseUrl =  '/course/children'
export const childCourseApi = function ({coid}) {
  return request({url: childCourseUrl, data :{coid}})
}
const wxCourseUrl =  '/kno/wx/knowledge'
export const wxCourseApi = function ({patientId , kid}) {
  return request({url: wxCourseUrl, data :{patientId , kid}, method: 'POST', header: {'content-type': 'application/x-www-form-urlencoded'}})
}
// phone
export const validatePhone = (phone) => {
  var reg = /^1[0-9][0-9]{9}$/ //验证规则
  return (reg.test(phone))
}

// query Bp Record
export const getBPRecordApi = ({ patientId, start, end }) => {
  const url = `/${patientId}/${start}/${end}`
  return request({ url, baseUrl: hypertensionUrl })
}

// type
const getAllTypeUrl =  '/tag/all'
export const getAllTypeApi = () => {
  return request({ url: getAllTypeUrl })
}

const getAllTypeV2Url =  '/tag/v2/all'
export const getAllTypeV2Api = () => {
  return request({ url: getAllTypeV2Url })
}


const addNewTypeUrl =  '/tag/add'
export const addNewTypeApi = ({ name }) => {
  return request({ url: addNewTypeUrl, data: { name }, method: 'POST', header: {'content-type': 'application/x-www-form-urlencoded'}})
}

const deleteTypeUrl =  '/tag/delete'
export const deleteTypeApi = ({ id }) => {
  return request({ url: deleteTypeUrl, data: { id }, method: 'POST', header: {'content-type': 'application/x-www-form-urlencoded'}})
}
const bindTagToPatientUrl =  '/tag/bind'
export const bindTagToPatientApi = ({ patientId, tagId }) => {
  return request({ url: bindTagToPatientUrl, data: {patientId, tagId}, method: 'POST', header: {'content-type': 'application/x-www-form-urlencoded'}})
}
const unbindTagToPatientUrl =  '/tag/unbind'
export const unbindTagToPatientApi = ({ patientId, tagId }) => {
  return request({ url: unbindTagToPatientUrl, data: {patientId, tagId}, method: 'POST', header: {'content-type': 'application/x-www-form-urlencoded'}})
}

// personal kno api
const getAllPersonalKnoUrl =  '/personal/kno/all'
export const getAllPersonalKnoApi = ( ) => {
  return request({ url: getAllPersonalKnoUrl })
}
const getPersonalKnoDetailUrl =  '/personal/kno/detail'
export const getPersonalKnoDetailApi = ({ id }) => {
  return request({ url: getPersonalKnoDetailUrl, data: { id } })
}

const addNewPersonalKnoUrl =  '/personal/kno/add'
export const addNewPersonalKnoApi = ({ title, content }) => {
  return request({ url: addNewPersonalKnoUrl, data: { title, content },  method: 'POST', header: {'content-type': 'application/x-www-form-urlencoded'} })
}

const updatePersonalKnoUrl =  '/personal/kno/update'
export const updatePersonalKnoApi = ({ kno }) => {
  return request({ url: updatePersonalKnoUrl, data: kno,  method: 'POST'})
}

const deletePersonalKnoUrl =  '/personal/kno/delete'
export const deletePersonalKnoApi = ({ id }) => {
  return request({ url: deletePersonalKnoUrl, data: { id },  method: 'POST', header: {'content-type': 'application/x-www-form-urlencoded'} })
}

const bindTagToPersonalKnoUrl =  '/personal/kno/bindtag'
export const bindTagToPersonalKnoApi = ({kid, tid}) => {
  return request({ url: bindTagToPersonalKnoUrl,  data: {kid, tid}, method: 'POST', header: {'content-type': 'application/x-www-form-urlencoded'} })
}

const unbindTagToPersonalKnoUrl = '/personal/kno/unbindtag'
export const unbindTagPersonalKnoApi = ({kid, tid}) => {
  return request({ url: unbindTagToPersonalKnoUrl,  data: {kid, tid}, method: 'POST', header: {'content-type': 'application/x-www-form-urlencoded'} })
}