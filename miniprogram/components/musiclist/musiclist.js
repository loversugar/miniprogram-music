Component({
  data: {
    playingId: -1
  },
  properties: {
    musiclist: Array
  },
  methods: {
    onSelect(event) {
      // 事件源 事件处理函数 事件对象 事件类型
      console.log(event.currentTarget.dataset.musicid)
      const musicId = event.currentTarget.dataset.musicid
      this.setData({
        playingId: musicId
      })

      wx.navigateTo({
        url: `../../pages/player/player?musicid=${musicId}`,
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
  }
})