// 1.场景 只想在界面上显示自己的头像，别人的得不到
// <open-data type="userAvatarUrl"></open-data>
// <open-data type="userNickName"></open-data>
// <open-data type="userCountry"></open-data>
// <open-data type="userCity"></open-data>

// 2. 获取用户信息,可以将用户信息存储到数据
// 前提用户必须授权才可以
// wx.getUserInfo()

// 3. 由用户主动决定是否授权
// <button open-type="getUserInfo" bindgetUserInfo="onGetUserInfo"></button

// 4.如果想使用openid
// 传统方式
// 步骤  1. 小程序调用wx.login获取code 2.调用wx.getRequest将code传递给后端服务器
// 3.后端服务器拿到code访问微信服务器换取opendid和session_key
// 4.发送到小程序端

// 云开发模式
// 步骤 1.用户点击获取用户信息按钮 2.小程序调用云函数获取用户信息 3.返回用户信息
// 小程序将用户信息存储到云数据库

// pages/profile/profile.js

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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