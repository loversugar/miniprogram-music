let userInfo = {}
const db = wx.cloud.database()
Component({
  data: {
    content: '',
    modalShow: false,
    bottomModal: false
  },
  properties: {
    blogId: String,
    blog: Object
  },
  externalClasses: [
    'iconfont',
    'icon-pinglun',
    'icon-share_icon'
  ],
  methods: {
    onLoginSuccess(event) {
      userInfo = event.detail
      this.setData({
        modalShow: false,
      }, () => {
        this.setData({
          bottomModal: true
        })
      })

    },
    onLoginFail() {
      wx.showModal({
        title: '授权用户才能进行评价',
      });
    },
    
    onSend(event) {
      console.log(event)
      let formId = event.detail.formId
      let content = event.detail.value.content;
      if (content.trim() == '') {
        wx.showModal({
          title: '评论不能为空',
        })
        return
      }

      wx.showLoading({
        title: '评价中',
        mask: true,
      })

      db.collection('blog-comment').add({
        data: {
          content,
          createTime: db.serverDate(),
          blogId: this.properties.blogId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      }).then((res) => {
        wx.hideLoading();
        wx.showToast({
          title: '评论成功',
        });
        this.setData({
          bottomModal: false,
          content: ''
        })
      })


      // 发送模版
      wx.cloud.callFunction({
        name: 'send-message',
        data: {
          content,
          formId,
          blogId: this.properties.blogId
        }
      }).then((res) => {
        console.log(res)
      })

      // 父元素刷新评论
      this.triggerEvent('refreshComment')

    },
    onComment() {
      console.log('11')
      // 判断用户是否授权
      wx.getSetting({
        success: (result)=>{
          console.log(result)
          if (result.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              withCredentials: 'false',
              lang: 'zh_CN',
              timeout:10000,
              success: (result)=>{
                userInfo = result.userInfo
                this.setData({
                  bottomModal: true
                })
              },
            });
          } else {
            this.setData({
              modalShow: true
            })
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
  }
})