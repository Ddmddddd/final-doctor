Component({
  properties: {
    info: Object
  },
  methods: {
    gotoSetting: function () {
      const { route } = this.properties.info
      this.triggerEvent('gotoSetting', { route } )
    }
  }
})