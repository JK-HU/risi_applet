// pages/commonToilet/commonToilet.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: null,
    longitude: null,
    markers: [
      {
        id: 1,
        latitude: null,
        longitude: null,
        name: 'T.I.T 创意园'
      }
    ],
    toiletList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.userLocation" 这个 scope，也可直接调用wx.authorize请求授权；
    wx.getSetting({
      success: (res) => { // 查看所有权限
      console.log(res)
        let status = res.authSetting['scope.userLocation']// 查看位置权限的状态，此处为初次请求，所以值为undefined
        if (!status) {// 如果是首次授权(undefined)或者之前拒绝授权(false)
          wx.authorize({ // 发起请求用户授权
            scope: 'scope.userLocation',
            success :() => { // 用户允许了授权
              wx.getLocation({ // 请求位置信息
                type: 'gcj02',
                success: (res) => {
                  console.log(res);//  得到位置信息（经纬度，速度等等）
                  this.setData({
                    latitude: res.latitude,
                    longitude: res.longitude
                  })
                  //请求厕所
                  wx.request({
                    url: app.data.url + '/app/index.php?i=38&c=entry&j=2&a=wxapp&do=getToiletList&m=wuyi_artrip',
                    method: "POST",
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                      number: 10,
                      start: 0,
                      lat: res.latitude,
                      lng: res.longitude
                    },
                    success: (res) => {
                      console.log(res)
                      let toilesArr = [...res.data.data];

                      toilesArr.filter(item => {
                        item.distance = (item.distance).toFixed(2);
                      })
                      this.setData({
                        toiletList: toilesArr
                      })
                      console.log(this.data.toiletList);
                    },
                    fail: (res) => {

                    }
                  })
                  console.log(this.data.latitude);
                }
              })
            },
            fail(res){
              console.log('拒绝');
              wx.openSetting({
                success(data) {
                  console.log(data)
                  if (data.authSetting["scope.userLocation"] == true) {
                    wx.showToast({
                      title: '授权成功',
                      icon: 'success',
                      duration: 2000,
                      success() { }
                    })
                  }
                }
              })
            }
          })
        }
        if (status == true) {
          wx.getLocation({ // 请求位置信息
            type: 'gcj02',
            success: (res) => {
              console.log(res);//  得到位置信息（经纬度，速度等等）
              that.setData({
                latitude: res.latitude,
                longitude: res.longitude
              })
              //请求厕所
              wx.request({
                url: app.data.url + '/app/index.php?i=38&c=entry&j=2&a=wxapp&do=getToiletList&m=wuyi_artrip',
                method: "POST",
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  number: 10,
                  start: 0,
                  lat: res.latitude,
                  lng: res.longitude
                },
                success: (res) => {
                  console.log(res)
                  let toilesArr = [...res.data.data];

                  toilesArr.filter(item => {
                    item.distance = (item.distance).toFixed(2);
                  })
                  this.setData({
                    toiletList: toilesArr
                  })
                  console.log(this.data.toiletList);
                },
                fail: (res) => {

                }
              })
              console.log(that.data.latitude);
            }
          })
        }
      }
    })




  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap')
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