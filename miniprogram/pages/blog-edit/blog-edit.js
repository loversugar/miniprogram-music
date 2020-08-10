// pages/blog-edit/blog-edit.js
const max_words_num = 140
const max_image_num = 9
const db = wx.cloud.database()
let content = ''
let userInfo = {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum : 0,
    footerBottom: 0,
    images:[],
    selectPhoto: true
  },

  onInput(event) {
    // console.log(event.detail.value)

    let wordsNum = event.detail.value.length
    if (wordsNum >= max_words_num) {
      wordsNum = `最大字数为${max_words_num}`
    }
    this.setData({
      wordsNum
    })
    content = event.detail.value
  },

  send() {
    if (content.trim() === '') {
      wx.showModal({
        title: 'please input something',
        content: '',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
      return
    }

    wx.showLoading({
      title: '发布中',
      mask: true,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });

    let promiseArr = []
    let fileIds = []
    for (let i=0, len=this.data.images.length; i < len; i++) {
      let p = new Promise((resolve, reject) => {
        let item = this.data.images[i]
        let suffix = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 1000000 + suffix,
          filePath: item,
          success: (res) => {
            fileIds = fileIds.concat(res.fileID)
            resolve()
          },
          fail: (err) => {
            console.error(err)
            reject()
          }
        })
      })

      promiseArr.push(p)
    }

    Promise.all(promiseArr).then((res) => {
      db.collection('blog').add({
        data: {
          ...userInfo,
          content,
          img: fileIds,
          createTime: db.serverDate()
        }
      }).then((res) => {
        wx.hideLoading();
        wx.showToast({
          title: 'success',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: (result)=>{
            
          },
          fail: ()=>{},
          complete: ()=>{}
        });

        wx.navigateBack()

        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2]
        prevPage.onPullDownRefresh()        
      })
    }).catch((err) =>{
      wx.hideLoading()
      wx.showToast({
        title: '当前发布失败',
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
    
  },

  onPreviewImage(event) {
    wx.previewImage({
      current: event.target.dataset.imagesrc,
      urls: this.data.images,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  onDelImage(event) {
    const index = event.target.dataset.index
    this.data.images.splice(index, 1)
    this.setData({
      images: this.data.images
    })

    if (this.data.images.length < max_image_num) {
      this.setData({
        selectPhoto: true
      })
    }
  },

  onChooseImg() {
    let max = max_image_num - this.data.images.length
    wx.chooseImage({
      count: max,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (result)=>{
        console.log(result)
        this.setData({
          images: this.data.images.concat(result.tempFilePaths)
        })

        max = max_image_num - this.data.images.length
        if (max <= 0) {
          this.setData({
            selectPhoto: false
          })
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  onFocus(event) {
    console.log(event)
    this.setData({
      footerBottom: event.detail.height
    })
  },
  onBlur() {
    this.setData({
      footerBottom: 0
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    userInfo = options
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

  }
})