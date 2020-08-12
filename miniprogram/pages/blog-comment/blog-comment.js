// pages/blog-comment/blog-comment.js
let blogId = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blog: {},
    commentList: [],
    blogId: ''
  },

  _getBlogDetail(blogId) {
    wx.showLoading({
      title: 'loading',
      mask: true,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });

    wx.cloud.callFunction({
      name: 'blog',
      data: {
        blogId,
        $url: 'detail',
      }
    }).then((res) => {
      wx.hideLoading();
      console.log(res)
      this.setData({
        blog: res.result.detail[0],
        commentList: res.result.commentList.data 
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      blogId: options.blogId
    })
    this._getBlogDetail(options.blogId)
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
    const blog = this.data.blog
    return {
      title: blog.content,
      path: '/pages/blog-comment/blog-comment?blogId=' + blog._id
    }
  }
})