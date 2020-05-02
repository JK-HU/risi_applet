const utils = require('/utils/utils.js');

App({

  data: {
   url:'https://risi.wuyiyizhan.com',
   code:null,
   openid:null,
   userId:null, //用户id
   session_key:null, //session_key 
  },
  onLaunch: function () {
      //console.log('App Launch')
    // 获取用户信息
    // utils.getUserInfoMsg();
      wx.getSetting({
        success: result => {
          if (result.authSetting['scope.userInfo']) {
            
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {

                console.log(res)
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo
                
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
                
                return res;
              },
              fail:(res)=>{
                console.log('拒绝了')
              }
            })
          }else{
            console.log('fail')
          }
        }
  })
  },
  onShow: function () {
      //console.log('App Show')
  },
  onHide: function () {
      //console.log('App Hide')
  },
  globalData: {
    //hasLogin: false
    userInfo:null
  }
});