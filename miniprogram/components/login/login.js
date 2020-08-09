Component({
  data: {},
  properties: {
    modalShow: Boolean,
  },
  methods: {
    onGotUserInfo(event) {
      console.log(event)
      const userInfo = event.detail.userInfo
      if (userInfo) {
        this.setData({
          modalShow: false
        })
        this.triggerEvent('loginSuccess', userInfo)
      } else {
        this.triggerEvent('loginFail')
      }
    }
  }
})