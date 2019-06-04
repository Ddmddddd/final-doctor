Component({
  properties: {
    patient: Object
    // params structure
  },
  data: {
    colorMap: {
      '1': '#1E90FF',
      '2': '#2E8B57',
      '3': '#FA8072'
    }
  },
  methods: {
    gotoManage: function () {
      let { patientIdentifier } = this.properties.patient.info
      this.triggerEvent('gotoManage',{id: patientIdentifier})
    },
    gotoFollowup: function () {
      const { phoneNumber } = this.properties.patient.info
      wx.makePhoneCall({
        phoneNumber,
        success: function(e) {
          const { errMsg } = e
          if (errMsg == 'makePhoneCall:ok') {
            // 记录一次电话随访的时间
            console.log(errMsg)
          }
        }
      })
    }, 
    gotoShowNote: function () {
      const { patientIdentifier } = this.properties.patient.info
      this.triggerEvent('gotoShowNote',{id: patientIdentifier})
    }
  }
})