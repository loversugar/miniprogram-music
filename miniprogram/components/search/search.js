let keyword = ''
Component({
  data: {},
  properties: {
    placeholder: {
      type: String,
      value: "please input"
    }
  },

  externalClasses: [
    'iconfont',
    'icon-sousuo'
  ],
  methods: {
    onInput(event) {
      keyword = event.detail.value
    },

    onSearch() {
      this.triggerEvent('search', {
        keyword
      })
    }
  }
})