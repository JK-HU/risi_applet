// components/me/medetail/medetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:212, //页面高度
    tximg:'', //头像
    nickname:'', //昵称
    sex:null, //性别
    userPhone:null, //手机
    userid:'',//uid
    array: ['私密','男', '女'],
    arrIndex:null,
    stosex:'',
    stoname:'',
    //用于接收
    getPhone:'', //用于接收输入手机号的值
    getVerifivals :'', //用于接收输入验证码的值
    verifiFlag:true,

    //存储验证码的值
    verifiMsg:null, //手机上的验证码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let winHeights = wx.getSystemInfoSync().windowHeight;
    
    this.setData({
      height: winHeights
    });
    // 获取userid
    wx.getStorage({
      key: 'userId',
      success: (result) => { 
        console.log(result.data);
        this.data.userid = result.data;

        //获取用户基本信息
        wx.request({
          url: app.data.url + '/app/index.php?i=38&c=entry&j=2&a=wxapp&do=getUserInfo&m=wuyi_artrip',
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            uid: result.data
          },
          success: (res) => {
            console.log(res);
            if (res.data.data.sex == 0) {
              res.data.data.sex = '私密';
              this.setData({
                arrIndex: 0
              })
            }
            if (res.data.data.sex == 1) {
              res.data.data.sex = '女';
              this.setData({
                arrIndex:2
              })
            }
            if (res.data.data.sex == 2) {
              res.data.data.sex = '男';
              this.setData({
                arrIndex: 1
              })
            }

            this.setData({
              tximg: res.data.data.head_portrait,
              nickname: res.data.data.nickname,
              sex: res.data.data.sex
            })
          },
          fail: (res) => {
            wx.showToast({
              title: '获取用户信息失败'
            });
          }


        });
      },
    })


  },

  /**
   * 修改资料
   * */ 
  modifyBtn:function() {
    if (this.data.nickname == this.data.stoname) {
      console.log('姓名一样');
      return;
    }
    if (this.data.sex == this.data.stosex) {
      console.log('性别一样');
      return;
    }
    wx.request({
      url: app.data.url + '/app/index.php?i=38&c=entry&j=2&a=wxapp&do=changeUserInfo&m=wuyi_artrip',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        username: this.data.stoname,
        sex:this.data.stosex,
        head_portrait: this.data.tximg,
        uid: this.data.userid
      },
      success:(res) => {
        console.log(res);
        if (res.data.errno == 0) {
          wx.showToast({
            title: '修改成功',
          });
          // wx.navigateBack({
          //   delta:1
          // })
          wx.redirectTo({
            url: '/components/me/me',
          })
        }else{
          wx.showToast({
            title: '修改失败',
          });
          wx.redirectTo({
            url: '/components/me/me',
          })
        }
      },
      fail:(res) => {
        wx.showToast({
          title: '修改失败',
        });
        wx.redirectTo({
          url: '/components/me/me',
        })
      }
    })
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      arrIndex: e.detail.value
    })
    this.data.stosex = e.detail.value;

  },

  getname:function(e){
    this.data.stoname = e.detail.value;
  },

  /**
   * uploadImg 上传图片
   **/

  uploadImg:function(event) {

    wx.chooseImage({
      success: (res) => {
        console.log(res);

        count:1;
        const tempFilePaths = res.tempFilePaths;
        this.setData({
          tximg: tempFilePaths
        })
        console.log(res.tempFilePaths[0]);
        wx.uploadFile({
          url: app.data.url + '/app/index.php?i=38&c=entry&j=2&a=wxapp&do=uploadImg&m=wuyi_artrip',
          filePath: res.tempFilePaths[0],
          name: 'file',
          header:{
            "Content-Type": "multipart/form-data",
          },
          formData:{
            uid: this.data.userid,
            img: res.tempFilePaths[0]
          },
          success:(res) => {
            console.log(res)
          },
          fail: (res) => {  
            console.log('上传失败')
          }
        })
      },
      fail:function(res) {
        console.log('取消上传')
      },
    });
  }, 

  /**
   * @function getPhoneVlaue 获取输入的手机号
   * 
  */
  getPhoneVlaue:function(e) {
    
    this.setData({
      getPhone:e.detail.value
    })
  },

  /**
   * @function getVerification 获取验证码
   * 
  */
  getVerification:function() {
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (this.data.getPhone == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon:'none',
        duration:870
      });
      return;
    }
    if (!(phoneReg.test(this.data.getPhone))) {
      wx.showToast({
        title: '手机号不正确',
        icon:'none',
        duration: 870
      });
      return;
    }
    //发送短信请求
    wx.request({
      url: app.data.url + '/app/index.php?i=38&c=entry&j=2&a=wxapp&do=sendSms&m=wuyi_artrip',
      method:"POST",
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        phone: this.data.getPhone,
        uid: app.data.userId
      },
      success:(res) => {
        console.log(res);
        if (res.data.errno == 0) {
          wx.showToast({
            title: res.data.message,
            duration:870
          });
        }else{
          wx.showToast({
            title: '发送失败',
            icon:'none',
            duration: 870
          });
        }
        // verifiMsg
      },
      fail:(res) => {
        wx.showToast({
          title: '获取验证码失败',
          icon:'none',
          duration:870
        });
      }


    });

  },

  /**
   * @function inputVerification 输入验证码
  */
  inputVerification:function(e) {
    this.data.verifiMsg = e.detail.value
  },

  /**
   * @function bindingPhone 绑定手机号-修改手机号,
   * @params phone 手机号 , uid 用户id , code 短信验证码
   **/

  bindingPhone: function () {

    if (this.data.getPhone == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 890
      });
      return;
    }

    if (this.data.verifiMsg == null || this.data.verifiMsg == '') {
      wx.showToast({
        title: '验证码为空',
        icon:'none',
        duration:870
      });
      return;
    }

    wx.request({
      url: app.data.url + '/app/index.php?i=38&c=entry&j=2&a=wxapp&do=changePhone&m=wuyi_artrip',
      method:"POST",
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        phone: this.data.getPhone,
        uid: app.data.userId,
        code: this.data.verifiMsg
      },
      success:function(res) {
        console.log(res)
        if (res.data.errno == 0) {
          wx.showToast({
            title: '绑定成功',
          });
          setTimeout( () => {
            wx.redirectTo({
              url: '/components/me/me'
            });
          },1000)
        }
      },
      fail:function(res){
        wx.showToast({
          title: '请求失败',
          icon:'none'
        })
      }

    })
    



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