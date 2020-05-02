// pages/new/new.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '360',
    longitude: null,
    latitude:null,
    distinguish:false, //识别
    takePhos:'', // 接受定时器变量,用于当扫描成功后取消定时器

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('1')
    let winHeights = wx.getSystemInfoSync().windowHeight;
    wx.getSystemInfo({
      success: res => {
        this.setData({ height: winHeights });
      }
    });

    wx.getStorage({
      key: 'jwdData',
      success: (res) => {
        console.log(res);
        this.setData({
          longitude: res.data[0].longitude,
          latitude: res.data[0].latitude
        })
      },
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('2')
    let that = this;
    this.data.takePhos = setInterval(function () {
      that.takePhoto();
    }, 1700);
    
  },
  takePhoto() {
    const thi_s = this;
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log(res);
        wx.uploadFile({
          url: app.data.url + '/app/index.php?i=38&c=entry&j=2&a=wxapp&do=ar&m=wuyi_artrip',
          filePath: res.tempImagePath,
          name: 'file',
          formData: {
            'longitude': this.data.longitude,
            'latitude': this.data.latitude
          },
          success:(res) => {
            /**
             * 返回结果是景点列表,true越高则越相似
             * for循环冒泡排序,true高的则加入besimilarBest中
             **/
            let besimilarBest = [];
            let jdList_resu = JSON.parse(res.data); 
            console.log(jdList_resu);

            for (let i = 0; i < jdList_resu.data.length -1 ; i++) {
              
              for (let j = 0; j < jdList_resu.data.length - 1 - i; j++) {
                jdList_resu.data[j].true = j +3;
                if (Number(jdList_resu.data[j].true) > Number(jdList_resu.data[j + 1].true)) {
                  besimilarBest[0] = jdList_resu.data[j];
                  jdList_resu.data[j] = jdList_resu.data[j+1];
                  jdList_resu.data[j + 1] = besimilarBest[0]
                }
              }
            
            }
            console.log(besimilarBest);
            console.log(jdList_resu.data)

            if (besimilarBest.length == 0) {
              this.setData({
                distinguish:false
              })
              wx.showToast({
                title: '未识别',
                icon:'none'
              })
            }
            if (besimilarBest.length !== 0) {
              
              // 清除定时上传图片定时器
              clearInterval(this.data.takePhos);

              this.setData({
                distinguish:true
              })
              
              wx.setStorage({
                key: 'besimilarBest',
                data: besimilarBest,
              });
              wx.showToast({
                title: '识别成功',
                icon:'success',
                duration:870
              });
              // wx.navigateTo({
              //   url: '/pages/arlist/arlist?arlist'
              // })
            }



            
            // if (data.errno == 0) {
            //   wx.showToast({
            //     title: '识别成功',
            //     icon: 'success',
            //     duration: 850
            //   });

            //   wx.navigateTo({
            //     url: '/pages/arlist/arlist?arlist=' + tempdata,
            //     events: {
            //       acceptDataFromOpenedPage: function (data) {
            //         console.log(data)
            //       },
            //       someEvent: function (data) {
            //         console.log(data)
            //       },
            //       success: (res) => {
            //         res.eventChannel.emit('acceptDataFromOpenerPage', {
            //           data: '组件传值'
            //         })
            //       }
            //     }
            //   });
              
            // }

          }
        })
      },
      fail(e) {
        console.log(e)
      }
    })
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