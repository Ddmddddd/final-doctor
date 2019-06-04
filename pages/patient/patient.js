import {
  patientAddApi,
  patientInfoApi,
  patientRoleApi,
  searchPatientApi,
  validatePhone,
  patientUpdateApi,

  getAllDoctorApi,
  patientCheckExistApi
} from '../../utils/http'
import { validateID } from '../../utils/validator'
Page({
  data: {
    patientInfo: {
      patientId: '',
      roleId: 1,
      phoneNumber: '',
      name: '',
      sex: '男',
      age: '',
      doctor: 'admin'
    },
    patientId: '', // 用以区分是新增或更新患者
    focusArr: [false, false, false, false],
    valueArr: ['name', 'patientId', 'phoneNumber'],
    sexArr: ['男', '女'],
    role: [],
    doctorList: [],
    currentRole: { },
    currentDoctor: {}
  },
  //focus wxss
  focusToggle: function (e) {
    let index = parseInt(e.currentTarget.dataset.info)
    let key = 'focusArr[' + index + ']'
    let data = !this.data.focusArr[index]
    this.setData({
      [key]: data
    })
    if (index == 1) { // 检查身份信息
      // console.log({ key, data })
      patientCheckExistApi({ patientId: this.data.patientInfo.patientId }).then(res => {
        let message = '检查账号失败'
        if (res.data.success) {
          if (res.data.result) {
            wx.showToast({ icon: 'none', title: "患者已存在" })
          }
        } else {
          wx.showToast({ icon: 'none', title: '账号检查错误' });
        }
      })
    }
  },
  valueInput: function (e) {
    let index = parseInt(e.currentTarget.dataset.info)
    let value = e.detail.value
    let key = 'patientInfo.' + this.data.valueArr[index]
    this.setData({
      [key]: value
    })
  },
  ageInput: function(e) {
    const { patientInfo } = this.data
    patientInfo.age = e.detail.value
    this.setData({ patientInfo })
  },
  selectSex: function(e) {
    const { patientInfo, sexArr } = this.data
    patientInfo.sex = sexArr[e.detail.value]
    this.setData({ patientInfo })
  },
  selectRole: function (e) {
    const currentRole = this.data.role[e.detail.value]
    let key = 'patientInfo.roleId'
    this.setData({
      [key]: currentRole.id,
      currentRole
    })
  },
  selectDoctor: function (e) {
    const currentDoctor = this.data.doctorList[e.detail.value]
    let key = 'patientInfo.doctor'
    this.setData({ 
      [key]: currentDoctor.username,
      currentDoctor
    })
  },
  clearAll: function () {
    this.setData({
      patientInfo: {
        patientId: '',
        roleId: 1,
        phoneNumber: '',
        name: '',
        sex: '男',
        age: '',
        doctor: 'admin'
      },
      currentRole: { id: 1, name: '系统组' },  // Todo 这里可以修改为根据用户的角色权限选择
      currentDoctor: { username: 'admin', alias: '通用账号'}
    })
  },
  tapConfirm: function () {
    //检查数据完整性
    const { patientInfo, patientId: patientPresence } = this.data
    const {
      patientId,
      phoneNumber,
      name,
      sex,
    } = patientInfo
    let toast = ''
    if (!name) toast = toast.concat('姓名，')
    if (!patientId) toast = toast.concat('病历号，')
    if (!phoneNumber) toast = toast.concat('手机号，')
    if (!sex) toast = toast.concat('性别，')
    if (toast) {
      wx.showToast({
        title: '请输入' + toast.slice(0, -1),
        icon: 'none',
        duration: 1500
      })
      return
    }

    //检查手机号
    const checkId = validateID(patientId) 
    if (!checkId.pass) {
      wx.showToast({
        title: checkId.tip,
        icon: 'none',
        duration: 1500
      })
      return
    } else {
      patientInfo.age = (new Date).getFullYear() - parseInt(patientId.slice(6,10))
      console.log(patientInfo.age)
    }
    if (!validatePhone(phoneNumber)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (!patientPresence) {
      //检查病历号是否存在
      let keyword = patientId
      searchPatientApi({
        keyword
      }).then(res => {
        if (res.data.success) {
          res.data.result.patients.map(obj => {
            if (patientId == obj.id) {
              wx.showToast({
                title: '该病例号已经存在',
                icon: 'none',
                duration: 1500
              })
              return
            }
          })
        }
      })
      wx.showModal({
        title: '提示',
        content: '确认添加？',
        success(res) {
          if (res.confirm) {
            patientAddApi({
              patientInfo
            }).then(res => {
              if (res.data.success == true) {
                wx.showToast({
                  title: '添加成功',
                  icon: 'success',
                }) 
                setTimeout(() => {
                  wx.navigateBack({})
                }, 500)
              } else {
                wx.showToast({
                  title: res.data.error.split(': ')[1],
                  icon: 'none',
                }) 
              }
            })
          } 
        }
      })
    } else {
      const data = {
        ...patientInfo,
        newPatientId: patientInfo.patientId
      }
      wx.showModal({
        title: '提示',
        content: '确认修改？',
        success(res) {
          if (res.confirm) {
            patientUpdateApi(data).then(res => {
              if (res.data.success == true) {
                wx.showToast({
                  title: '修改成功',
                  icon: 'success',
                }) 
                setTimeout(() => {
                  wx.navigateBack({})
                }, 500)
              } else {
                wx.showToast({
                  title: res.data.error.split(': ')[1],
                  icon: 'none',
                }) 
              }
            })
          } 
        }
      }) 
    }
  },
  getPatient () {
    const that = this
    const { patientId } = this.data
    patientInfoApi({ patientId }).then(res => {
      if (res.data.success) {
        const { result: patient } = res.data
        const roleId = patient.role ? patient.role.id : 1
        const doctor = patient.doctor ? patient.doctor.username : 'admin'
        that.setData({
          patientInfo: {
            patientId: patient.patientIdentifier,
            roleId,
            phoneNumber: patient.phoneNumber,
            name: patient.name,
            sex: patient.sex,
            age: patient.age,
            doctor
          },
          currentRole: that.data.role.filter(item => item.id == roleId)[0],
          currentDoctor: that.data.doctorList.filter(v => v.username == doctor)[0]
        })
      } else {
        that.setData({ patientId: null })
      }
      wx.hideLoading()
    })
  },
  onLoad: function (options) {
    const that = this
    const { patientId = '' } = options
    this.setData({
      patientId
    })
    wx.showLoading({ title: '加载中' })
    // const { patientId } = { patientId: 'T0001283' }
    // 角色信息
    patientRoleApi().then(res=> {
      if (res.data.success) {
        that.setData({
          role: res.data.result,
          patientId
        })
        // 拉取用户的数据
        if (!patientId) that.setData({ currentRole: res.data.result[0] })
        that.getAllDoctor()
      }
    })
  },
  getAllDoctor () {
    const that = this
    getAllDoctorApi().then(res => {
      if (res.data.success) {
        that.setData({ doctorList: res.data.result })
        if (!that.data.patientId) {
          that.setData({ currentDoctor: { username: 'admin', alias: '通用账户'} })
          wx.hideLoading()
        }
        else that.getPatient()
      }
    })
  }
})