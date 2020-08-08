let lyricHeight = 0

Component({
  data: {
    lrcList: [],
    nowLyricIndex: 0, // 表示选中歌词的索引ß
    scrollTop: 0, // 滚动条滚动高度
  },
  properties: {
    isLyricShow: {
      type: Boolean,
      value: false
    },
    lyric: String,
  },
  observers: {
    lyric(lrc) {
      if (lrc == '暂无歌词') {
        this.setData({
          lrcList: [
            {
              lrc,
              time: 0
            }
          ],
          nowLyricIndex: -1
        })
      } else {
        this._parseLyric(lrc)
      }
    }
  },
  lifetimes: {
    ready() {
      // 宽度750rpx
      wx.getSystemInfo({
        success: (result)=>{
          // 获取屏幕宽度
          // 获取1rpx的大小
          lyricHeight = result.screenWidth / 750 * 64
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    },
  },
  methods: {
    update(currentTime) {
      console.log(currentTime)
      let lrcList = this.data.lrcList
      if (lrcList.length == 0) {
        return
      }

      if (currentTime > lrcList[lrcList.length - 1].time) {
        if (this.data.nowLyricIndex != -1) {
          this.setData({
            nowLyricIndex: -1,
            scrollTop: lrcList.length * lyricHeight
          })
        }
      }

      for (let i=0, len=lrcList.length; i<len; i++) {
        if (currentTime <= lrcList[i].time) {
          this.setData({
            nowLyricIndex: i-1,
            scrollTop: (i - 1) * lyricHeight
          })
          break
        }
      }
    },

    _parseLyric(slyric) {
      let line = slyric.split('\n')
      console.log(line)

      let _lrcList = []

      line.forEach(element => {
        let time = element.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g) 
        if (time != null) {
          let lrc = element.split(time)[1]
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          console.log(timeReg)
          //把事件转换成秒
          let time2Seconds = parseInt(timeReg[1]) * 60 
              + parseInt(timeReg[2])
              + parseInt(timeReg[3]) / 1000

          _lrcList.push({
            lrc,
            time: time2Seconds,
          })
        }
      });

      this.setData({
        lrcList: _lrcList
      })
    }
  }
})