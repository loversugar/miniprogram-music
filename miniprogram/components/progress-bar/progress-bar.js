let movableAreaWidth = 0
let movableViewWidth = 0
const backAudioManager = wx.getBackgroundAudioManager();
let currentSec = -1 // 当前秒数
let isMoving = false; // 当前进度条是否再拖拽，解决当进度条拖动时，和updateTime事件冲突问题
let duration = 0; // 当前歌曲总时长, 以秒为单位

Component({
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00'
    },
    movableDis: 0,
    progress: 0
  },
  lifetimes: {
    ready() {
      if (this.properties.isSame
         && this.data.showTime.totalTime == '00:00') {
          this._setTime()
      }
      console.log('ready')
      this._getMovableDis()
      this._bindBGMEvent()
    }
  },
  properties: {
    isSame: Boolean
  },
  methods: {
    onChange(event) {
      // 拖动
      if (event.detail.source == 'touch') {
        this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth) * 100
        this.data.movableDis = event.detail.x
        isMoving = true
      }
    },
    onTouchEnd() {
      const currentTimeFmt = this._dateFormat(Math.floor(backAudioManager.currentTime))
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTime.currentTime']: currentTimeFmt.min + ':' + currentTimeFmt.sec
      })
      isMoving = false;
      backAudioManager.seek(duration * this.data.progress / 100)
    },
    _getMovableDis() {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()

      query.exec((rect) => {
        console.log(rect)
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
        console.log(movableAreaWidth, movableViewWidth)
      })
    },

    _setTime() {
      duration = backAudioManager.duration
      console.log(duration)
      const durationFmt = this._dateFormat(duration)
      console.log(durationFmt)

      this.setData({
        ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}` 
      })
    },

    // 格式化事件
    _dateFormat(sec) {
      const min = Math.floor(sec / 60)
      sec = Math.floor(sec % 60)
      return {
        'min': this._parse0(min),
        'sec': this._parse0(sec)
      }
    },

    // 补0
    _parse0(num) {
      return num < 10 ? '0' + num: num
    },

    _bindBGMEvent() {
      backAudioManager.onPlay(() => {
        // 小程序坑，如果再拖动的时候可能再停止的时候再次出发change事件
        isMoving = false;

        this.triggerEvent('musicPlay')
      })

      backAudioManager.onStop(() => {

      })

      backAudioManager.onPause(() => {
        this.triggerEvent('musicPause')
      })

      backAudioManager.onWaiting(() => {

      })

      backAudioManager.onCanplay(() => {
        // 里面的值可能为undefined, 这是小程序的坑
        console.log('1111' + backAudioManager.duration)

        if (typeof backAudioManager.duration != 'undefined') {
          this._setTime()
        } else {
          setTimeout(() => {
            this._setTime()
          }, 1000)
        }
      })

      backAudioManager.onTimeUpdate(() => {
        if (isMoving) {
          return
        }
        const currentTime = backAudioManager.currentTime
        const duration = backAudioManager.duration

        if (currentTime.toString().split('.')[0] != currentSec) {
            const currentTimeFmt = this._dateFormat(currentTime)
            this.setData({
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              progress: currentTime / duration * 100,
              ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
            })

            currentSec = currentTime.toString().split('.')[0]

            // 联动歌词
            this.triggerEvent('timeUpdate', {
              currentTime
            })
        } 
        
      })

      backAudioManager.onEnded(() => {
        this.triggerEvent('musicEnd')
      })

      backAudioManager.onError((res) => {
        console.error(res.errMsg)
        console.error(res.errCode) 
        wx.showToast({
          title: '错误' + res.errCode,
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: (result)=>{
            
          },
          fail: ()=>{},
          complete: ()=>{}
        });
      })

    }
  }
})