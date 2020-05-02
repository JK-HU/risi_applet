Page({
  data: {
    choose_index: 0,
    tabbar: {
      "color": "#999999",
      "selectedColor": "#7788dd",
      "borderStyle": "#dcdcdc",
      "backgroundColor": "#ffffff",
      "list": [{
          "key": "home",
          "iconPath": "/style/images/home.png",
          "selectedIconPath": "/style/images/homeactive.png",
          "text": "首页"
        },
        {
          "key": "new",
          "iconPath": "/style/images/ar.png",
          "selectedIconPath": "/style/images/aractive.png",
          "text": "AR",
        },
        {
          "key": "me",
          "iconPath": "/style/images/mine.png",
          "selectedIconPath": "/style/images/mineactive.png",
          "text": "我的"
        }
      ]
    },
    "list": [{
      "key": "home",
      "iconPath": "/style/images/home.png",
      "selectedIconPath": "/style/images/homeactive.png",
      "text": "首页"
    },
    {
      "key": "new",
      "iconPath": "/style/images/ar.png",
      "selectedIconPath": "/style/images/ar.png",
      "text": "AR",
    },
    {
      "key": "me",
      "iconPath": "/style/images/mine.png",
      "selectedIconPath": "/style/images/mineactive.png",
      "text": "我的"
    }]
  },
  onLoad: function () {
    
  },
  onReady: function () {
    let that = this;
    // setInterval(function () {
    //    that.takePhoto();
    // }, 2000);
  },
  tabChange: function(e) {
    //console.log(e);
    var key = e.detail.item.key
    if (key == 'new') {
     
      wx.navigateTo({
        url: '/pages/new/new',
      })

    } else {
      this.setData({
        choose_index: e.detail.index
      })
    }
  },
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log(res);
        wx.uploadFile({
          url: '/app/index.php?i=38&c=entry&j=2&a=wxapp&do=ar&m=wuyi_artrip', //仅为示例，非真实的接口地址
          filePath: res.tempImagePath,
          name: 'file',
          formData: {
            'user': 'test'
          },
          success(res) {
            let data = JSON.parse(res.data);
            console.log(data);
            if (data.code == 1) {
              wx.showToast({
                title: '识别成功',
                icon: 'success',
                duration: 2000
              })
              
            }
          }
        })
      },
      fail(e) {
        console.log(e)
      }
    })
  },
})