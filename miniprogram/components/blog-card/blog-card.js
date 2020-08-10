import formatTime from '../../utils/formatTime.js'

Component({
  data: {
    _createTime: ''
  },
  properties: {
    blog: Object
  },
  observers: {
    ['blog.createTime'](val) {
      if (val) {
        this.setData({
          _createTime: formatTime(new Date(val))
        })
      }
    }
  },
  methods: {
    onPreviewImage(event) {
      const ds = event.target.dataset
      wx.previewImage({
        current: ds.imgsrc,
        urls: ds.imgs,
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
  }
})