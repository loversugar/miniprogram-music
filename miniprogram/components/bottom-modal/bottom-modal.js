Component({
  data: {},
  properties: {
    modalShow: Boolean
  },
  methods: {
    onClose() {
      this.setData({
        modalShow: false
      })
    }
  },
  options: {
    styleIsolation: 'apply-shared',
    multipleSlots: true,
  }
})