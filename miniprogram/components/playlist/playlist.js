Component({
  /**
   * 组建初始化数据
   * 组件内部数据
   */
  data: {
    _count: 0
  },

  /**
   * 组件的属性列表
   * 传递过来值
   */
  properties: {
    playlist: {
      type: Object
    }
  },

  // 进行监听
  observers: {
    ['playlist.playCount'](count) {
      // 如果监听某个值的时候，不能再对监听的值进行赋值，这样
      // 会形成死循环，因为监听值改变，会再次出发监听
      // 解决方案就是重新定义一个新的值
      this.setData({
        _count: this._tranNumber(count, 2)
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _tranNumber(num, point) {
      let numStr = num.toString().split('.')[0]
      if (numStr.length < 6) {
        return numStr
      } else if (numStr.length >= 6 && numStr.length <= 8) {
        let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point) 
        
        return parseFloat(parseInt(num /10000) + '.' + decimal) + '万'
      } else if (numStr.length > 8) {
        let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point)
        return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿'
      }
    },

    goToMusiclist() {
      wx.navigateTo({
        url: `../../pages/musiclist/musiclist?playlistId=${this.properties.playlist.id}`,
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
  }
})