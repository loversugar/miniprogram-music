// pages/player/player.js
let musiclist = []
//正在播放歌曲的index
let nowPlayingIndex = 0 

// 调用全局属性和方法
const app = getApp()

// 获取全局唯一的背景音频管理器(相当于单例模式)
const backgroundAudioManager = wx.getBackgroundAudioManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false, // false表示不播放，true表示正在播放
    lyric: '',
    isLyricShow: false, // 表示前歌词是否显示
    isSame: false, // 表示是否为同一首歌曲
  },

  // 保存播放历史
  savePlayHitory() {
    const music = musiclist[nowPlayingIndex]
    const openid = app.globalData.openid
    console.log('openid' + openid)
    const history = wx.getStorageSync(openid)

    let bHave = false;
    for (let i=0; i<history.length; i++) {
      if (history[i].id == music.id) {
        bHave = true
        break
      }
    }

    if (!bHave) {
      history.unshift(music)
      wx.setStorageSync(openid, history);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    nowPlayingIndex = options.index
    musiclist = wx.getStorageSync('musiclist');
    this._loadMusicDetail(options.musicid)
  },

  _loadMusicDetail(musicId) {
    if (musicId == app.getPlayMusicId()) {
      this.setData({
        isSame: true
      })
    } else {
      this.setData({
        isSame: false
      })
    }

    if (!this.data.isSame) {
      backgroundAudioManager.stop()
    }

    let music = musiclist[nowPlayingIndex]
    console.log(musicId)
    wx.setNavigationBarTitle({
      title: music.name,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });

    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: false
    })

    app.setPlayMusicId(musicId)

    wx.showLoading({
      title: "歌曲加载中",
      mask: true,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });

    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl',
        // es6新语法
        // musicId: musicId
      }
    }).then((res) => {
      console.log(res)
      let result = JSON.parse(res.result)

      if (result.data[0].url == null) {
        wx.showToast({
          title: '无权限播放',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: (result)=>{
            
          },
          fail: ()=>{},
          complete: ()=>{}
        });

        return
      }

      if (!this.data.isSame) {
        backgroundAudioManager.title = music.name
        backgroundAudioManager.src = result.data[0].url
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        backgroundAudioManager.singer = music.ar[0].name
        backgroundAudioManager.epname = music.al.name

        this.savePlayHitory()
      }

      this.setData({
        isPlaying: true
      })
    })

    console.log("hhhaha" + this.data.isPlaying)

    wx.hideLoading();

    // 加载歌词
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'lyric',
      }
    }).then((res) => {
      console.log(res)
      let lyric = '暂无歌词'
      const lrc = JSON.parse(res.result).lrc
      if (lrc) {
        lyric = lrc.lyric
      }
      this.setData({
        lyric
      })
    })
  },

  togglePlaying() {
    if (this.data.isPlaying) {
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },

  onPrev() {
    nowPlayingIndex--
    if (nowPlayingIndex < 0) {
      nowPlayingIndex = musiclist.length - 1
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },
  
  onNext() {
    nowPlayingIndex++
    if (nowPlayingIndex === musiclist.length) {
      nowPlayingIndex = 0
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },

  onChangeLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
  timeUpdate(event) {
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },

  onPlay() {
    this.setData({
      isPlaying: true
    })
  },

  onPause() {
    this.setData({
      isPlaying: false
    })
  }
})