// components/me/me.js
const app = getApp();
const utils = require('../../utils/utils.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    bannerList: [ //banner
      { title: '测试1', imgUrl: 'https://shenpan.oss-cn-shanghai.aliyuncs.com/469/picture4.jpg' },
      { title: '测试2', imgUrl: 'https://shenpan.oss-cn-shanghai.aliyuncs.com/4626/25.jpg' },
      { title: '测试3', imgUrl: 'https://shenpan.oss-cn-shanghai.aliyuncs.com/469/picture4.jpg' }
    ],
    icon: "../../style/images/setting.png",
    icon1: "../../style/images/contact.png",
    icon2: "../../style/images/contact.png",
    nologin:"../../style/images/nologin.png",
    bannerNav:[
      { title: '我的积分', imgUrl: "../../style/images/jf.png", type: 0},
      { title: '浏览记录', imgUrl: "../../style/images/jd.png", type: 1},
      { title: '积分商城', imgUrl: "../../style/images/sc.png", type: 2},
      { title: '我的权益', imgUrl: "../../style/images/qy.png", type: 3}
    ],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    usename:null,
    userPhone:null,
    userImg:null,
    //userInfo: {'usename':null,'phone':null,'userImg':null},
    hasUserInfo: false,
    userid:null,
  },

  /**
   * Component lifetimes 生命周期函数在lifetimes字段中声明
   * @function attached 在组件实例进入页面节点树时执行
  */
  lifetimes:{
    attached(res){
      console.log('attached加载了')
      wx.getStorage({
        key: 'userId',
        success: (res) => {
          console.log(res)
          this.setData({
            userid : res.data
          })

          this.requestUsrer(res.data)
        },
        fail:() => {
          // wx.showToast({
          //   title: '失效',
          // })
        }

      })
     
    }
  },


  /**
   * 组件的方法列表
   */
  methods: {
    getUserInfo: function (e) {
      console.log(e)

      wx.getSetting({
        success : (res) => {
          console.log(res);
          console.log('getSetting - fail');
          //取消授权
          if (res.authSetting['scope.userInfo']){
            wx.getUserInfo({
              success: (res) => {
                //确认授权
                console.log('getUserInfo success')
                if (e.detail.userInfo) {
                  wx.request({
                    url: app.data.url + '/app/index.php?i=38&c=entry&j=2&a=wxapp&do=wxappLogin&m=wuyi_artrip',
                    method: "POST",
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                      openid: app.data.openid,
                      name: e.detail.userInfo.nickName,
                      img: e.detail.userInfo.avatarUrl
                    },
                    success: (results) => {
                      console.log(results);
                      wx.setStorage({
                        key: 'userId',
                        data: results.data.id,
                      })
                      this.setData({
                        userid: results.data.id
                      })
                      this.requestUsrer(results.data.id)
                      
                    },
                    fail: (res) => {
                      console.log('拒绝了')
                      wx.showToast({
                        title: '获取信息失败',
                      })
                    }

                  })
                }
              },
              fail: () => {
                console.log('getUserInfo fail')
              }
            });
          }
        },
        fail : () =>{
          console.log('getSetting - fail')
        }
      });
      //app.globalData.userInfo = e.detail.userInfo

      // this.setData({
      //   userInfo: e.detail.userInfo,
      //   hasUserInfo: true
      // })

      //登录/注册请求
      // if (e.detail.userInfo) {
      //   wx.request({
      //     url: app.data.url + '/app/index.php?i=38&c=entry&j=2&a=wxapp&do=wxappLogin&m=wuyi_artrip',
      //     method:"POST",
      //     header:{
      //       'content-type': 'application/x-www-form-urlencoded'
      //     },
      //     data:{
      //       openid: app.data.openid,
      //       name:e.detail.userInfo.nickName,
      //       img: e.detail.userInfo.avatarUrl
      //     },
      //     success:(res) => {
      //       console.log(res);
      //       app.data.userId = res.data.id;
      //       wx.setStorage({
      //         key: 'userId',
      //         data: res.data.id,
      //       })
      //     },
      //     fail : (res) => {
      //       console.log('拒绝了')
      //       wx.showToast({
      //         title: '获取信息失败',
      //       })
      //     }

      //   })
      // }

    },


    /**
     * navTap
     * 
    */
    navTap:function(e){
      console.log(e);
      console.log(e.currentTarget.dataset.type)
      if (this.data.userid == null) {
        wx.showToast({
          title: '还未登录',
          icon:'none',
          duration:870
        });
        return;
      }
      if (e.currentTarget.dataset.type == 1) {
        wx.navigateTo({
          url: "/components/me/browseRecord/browseRecord?userId=" + this.data.userid
        })
      }
    },

    /**
     * @function goUserDetails 去用户详情 
    */
    goUserDetails(){
      wx.navigateTo({
        url: 'components/me/medetail/medetail',
        success: function(res) {
          console.log(res);
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    },

    /**
     * 获取用户信息userid
    */
    requestUsrer:function(uid) {
      if (uid == null) {
        wx.showToast({
          title: '还未登录',
          icon:'none',
          duration:870
        });
        return;
      }

      wx.request({
        url: app.data.url + '/app/index.php?i=38&c=entry&j=2&a=wxapp&do=getUserInfo&m=wuyi_artrip',
        method:"POST",
        header:{
          'content-type': 'application/x-www-form-urlencoded'
        },
        data:{
          uid: uid
        },
        success: (res) => {
          console.log(res)
          this.setData({
            usename: res.data.data.nickname,
            userPhone: res.data.data.phone,
            userImg: res.data.data.head_portrait
          })
        },
        fail: (res) => {
          wx.showToast({
            title: '获取用户信息失败',
            icon:'none',
            duration:870
          })
        }
      })


    }




  },

})
