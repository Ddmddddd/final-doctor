import { getAllTypeApi} from '../../utils/http'

Component({
  data: {
    name: '',
    error: '',
    selectedTag: {}, // {id, name}
    showAutoComplete: false,
    resultList: [],
    tagList: []
  },
  lifetimes: {
    attached: function () {
      const that = this
      wx.showLoading({
        title: '加载中'
      })
      getAllTypeApi().then(res => {
        if (res.data.success) {
          console.log(res)
          that.setData({ tagList: res.data.result, resultList: res.data.result })
          wx.hideLoading()
        }
      })
    }
  },
  methods: {
    hideTagModal: function () {
      this.triggerEvent('hideModal', {})
    },
    onConfirm: function () {
      const { selectedTag } = this.data 
      if (!selectedTag.id) {
        wx.showToast({
          icon: 'none',
          title: '请选择已有标签'
        })
        return
      }
      this.triggerEvent('confirm', selectedTag )
    },
    showAutoComplete () {
      this.setData({
        showAutoComplete: true
      })
    },
    inputTagName: function (e) {
      const { value: name } = e.detail
      this.selectTagByName(name)
    },
    selectTagByName: function (name) {
      const { tagList } = this.data
      if (!name) {
        this.setData({ name, resultList: tagList, selectedTag: {name: '没有找到标签'}  })
        return
      }
      const resultList = tagList.filter(v => v.name.indexOf(name) >= 0)
      const selectedTag = tagList.filter(v => v.name === name)[0] || {}
      this.setData({ name, resultList, selectedTag  })
    },
    selectTagInList: function (e) {
      const { name } = e.currentTarget.dataset
      this.selectTagByName(name)
    }
  },
})