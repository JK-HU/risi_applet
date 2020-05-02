// pages/guideMap/guideMap.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: '', //经度
    latitude: '', // 维度
    winHeight: '', //页面高度
    bgImg: '', //背景
    imgsrc: '', //头像
    adreess_name: '',//景区名字
    current_adress: '', //当前地址
    adress_descript: '', //景区描述
    spid: null, //景点id
    uid: null, //uid
    bgimgw: '663px', //背景size width
    bgimgh: '938px', //背景size height
    bgpsx: '0', //背景 postion-x
    bgpsy: '0', //背景 position-y
    showHidden: true, //当播放弹框隐藏时,这个属性为false显示
    showModelHidden: false, //进入时会一开始显示弹框
    isTouch: false, //是否触摸屏幕
    throlleFlag:true, //节流状态
    //下面定义点击时,移动时的坐标
    touchStartX: 0,
    touchStartY: 0,
    touchMoveX: 0,
    touchMoveY: 0,
    touchEndX: 0,
    touchEndY: 0,

    //下面定义拖动四边变量
    startx: 0,
    starty: 0,
    endx: 0,
    endy: 0,
    result: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (app.data.userId == null) {
      wx.showToast({
        title: '还未登录',
        icon: 'none',
        duration: 590
      })
    }
    this.setData({
      longitude: options.longitud,
      latitude: options.latitude,
      winHeight: wx.getSystemInfoSync().windowHeight
    });
    this.data.spid = options.spid;
    wx.showToast({
      title: '正在加载中...',
      icon: 'loading',
      duration: 9000
    })

    // 请求数据获取导览图
    wx.request({
      url: app.data.url + '/app/index.php?i=38&c=entry&j=2&a=wxapp&do=getNavigationMap&m=wuyi_artrip',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        longitude: this.data.longitude,
        latitude: this.data.latitude
      },
      success: (res) => {
        console.log(res);
        this.setData({
          bgImg: res.data.data.navigation_map_img,
          imgsrc: app.data.url + '/attachment/' + res.data.data.current_spot.picture[0],
          current_adress: res.data.data.current_spot.formatted_address,
          adress_descript: res.data.data.current_spot.description,
          adreess_name: res.data.data.current_spot.title
        })
        wx.hideToast();
      },
      fail: (res) => {
        wx.hideToast();
        wx.showToast({
          title: '获取导览图失败',
          success: () => {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    });

    // 获取uid
    wx.getStorage({
      key: 'userId',
      success: (res) => {
        this.data.uid = res.data
      }
    });

  },

  /**
   * @function closeModel 关闭弹框
   * 
  */
  closeModel: function () {
    //console.log('123')
    this.setData({
      showModelHidden: true,
      showHidden: false
    });

  },

  /**
   * @function openModel 打开弹框
   * 
  */
  openModel: function () {
    this.setData({
      showModelHidden: false,
      showHidden: true
    });
  },

  /**
   * @function bgTouchStart 触摸屏幕时
   * @function bgTouchMove  移动时
   * @function bgTouchEnd   松手时
   * */

  bgTouchStart: function (event) {
    this.data.isTouch = true;
    this.data.startx = event.changedTouches[0].clientX;
    this.data.starty = event.changedTouches[0].clientY;

    this.setData({
      touchStartX: event.changedTouches[0].clientX,
      touchStartY: event.changedTouches[0].clientY
    });

    if (this.data.showModelHidden == true) {
      //按钮显示
      this.setData({
        showHidden: true
      });
    }
    //console.log(event)
  },
  bgTouchMove: function (event) {

    this.data.touchMoveX = Number(this.data.touchEndX) + Number(event.changedTouches[0].clientX) - Number(this.data.touchStartX);
    this.data.touchMoveY = Number(this.data.touchEndY) + Number(event.changedTouches[0].clientY) - Number(this.data.touchStartY);

    var w = wx.getSystemInfoSync().windowWidth;
    var h = wx.getSystemInfoSync().windowHeight;

    if (this.data.touchMoveX > 0 || this.data.touchMoveX == 0) {
      this.setData({
        bgpsx: 0 + 'px'
      });
      this.data.touchMoveX = 0;
    }
    if (this.data.touchMoveY > 0 || this.data.touchMoveY > 0) {
      this.setData({
        bgpsy: 0 + 'px'
      });
      this.data.touchMoveY = 0;
    }
    if (Math.abs(this.data.touchMoveX) >= Math.abs(w - 664)) {
      this.data.touchMoveX = w - 664;
    }
    if (Math.abs(this.data.touchMoveY) >= Math.abs(h - 938)) {
      this.data.touchMoveY = h - 938;
    }
    if (this.data.touchMoveX < 0 && this.data.touchMoveY < 0) {
      this.setData({
        bgpsx: this.data.touchMoveX + 'px',
        bgpsy: this.data.touchMoveY + 'px'
      });
    }

    console.log('移动了');
  },
  // bgTouchMove: function (event) {
  //   if (this.data.isTouch == true) {
  //     // console.log(this.data.touchMoveX)
  //     // console.log(this.data.touchMoveY)
  //     this.data.touchMoveX = Number(this.data.touchEndX) + Number(event.changedTouches[0].clientX) - Number(this.data.touchStartX);
  //     this.data.touchMoveY = Number(this.data.touchEndY) + Number(event.changedTouches[0].clientY) - Number(this.data.touchStartY);
  //     console.log('---物体宽带---');
  //     var w = wx.getSystemInfoSync().windowWidth;
  //     var h = wx.getSystemInfoSync().windowHeight;
  //     console.log(this.data.touchMoveY);
  //     console.log(h - 938)
  //     console.log('----结束-----');
  //     if (this.data.touchMoveX > 0 || this.data.touchMoveX == 0) {
  //       this.setData({
  //         bgpsx: 0 + 'px'
  //       });
  //       this.data.touchMoveX = 0;
  //     }
  //     if (this.data.touchMoveY > 0 || this.data.touchMoveY > 0) {
  //       this.setData({
  //         bgpsy: 0 + 'px'
  //       });
  //       this.data.touchMoveY = 0;
  //     }
  //     if (Math.abs(this.data.touchMoveX) >= Math.abs(w - 664)) {
  //       this.data.touchMoveX = w - 664;
  //     }
  //     if (Math.abs(this.data.touchMoveY) >= Math.abs(h - 938)) {
  //       this.data.touchEndY = h + 64 - 938;
  //     }
  //     if (this.data.touchMoveX < 0 && this.data.touchMoveY < 0) {
  //       this.setData({
  //         bgpsx: this.data.touchMoveX + 'px',
  //         bgpsy: this.data.touchMoveY + 'px'
  //       });
  //     }
  //     // console.log('clientX:->' + this.data.touchMoveX);
  //     // console.log('clientY:->' + this.data.touchMoveY);
  //     // console.log(event);
  //     console.log('移动了');
  //   }
  // },
  bgTouchEnd: function (event) {

    this.data.isTouch = false;
    
    var w = wx.getSystemInfoSync().windowWidth;
    var h = wx.getSystemInfoSync().windowHeight;
    console.log(h)
    if (this.data.touchMoveX > 0 || this.data.touchMoveX == 0) {
      this.data.touchMoveX = 0
    }
    if (this.data.touchMoveY > 0 || this.data.touchMoveY == 0) {
      this.data.touchMoveY = 0
    }
    if (Math.abs(this.data.touchMoveX) >= Math.abs(w - 664)) {
      this.data.touchMoveX = w - 664
    }
    if (Math.abs(this.data.touchMoveY) >= Math.abs(h - 938)) {
      this.data.touchMoveY = h - 938;
    }
    this.data.touchEndX = parseInt(this.data.touchMoveX);
    this.data.touchEndY = parseInt(this.data.touchMoveY);

    this.data.endx = event.changedTouches[0].clientX;
    this.data.endy = event.changedTouches[0].clientY;

    let direction = this.getDirection(this.data.startx, this.data.starty, this.data.endx, this.data.endy);

    switch (direction) {
      case 0:
        //console.log("未滑动！");
        break;
      case 1:
        //console.log("向上！");
        break;
      case 2:
        //console.log("向下！");
        this.homingFun(direction, this.data.touchEndY);
        break;
      case 3:
        //console.log("向左！")
        break;
      case 4:
        //console.log("向右！")
        break;
      default:
    }

    if (this.data.showModelHidden == true) {
      //按钮显示
      this.setData({
        showHidden: false
      });
    }
    console.log('松手了');
  },

  /**
   * 获得角度
  */
  getAngle: function (angx, angy) {
    return Math.atan2(angy, angx) * 180 / Math.PI;
  },

  /**
   * 根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
   **/
  getDirection: function (startx, starty, endx, endy) {
    this.data.angx = endx - startx;
    this.data.angy = endy - starty;
    this.data.result = 0;
    //如果滑动距离太短
    if (Math.abs(this.data.angx) < 2 && Math.abs(this.data.angy) < 2) {
      return this.data.result;
    }

    let angle = this.getAngle(this.data.angx, this.data.angy);
    if (angle >= -135 && angle <= -45) {
      this.data.result = 1;
    } else if (angle > 45 && angle < 135) {
      this.data.result = 2;
    } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
      this.data.result = 3;
    } else if (angle >= -45 && angle <= 45) {
      this.data.result = 4;
    }
    return this.data.result;


  },

  homingFun: function (direction, moveNums) {

    // if (direction == 2 && Math.abs(moveNums) > 0) {
    //   console.log('moveNums:===' + moveNums)
    //   this.setData({
    //     bgpsy:0
    //   })
    // }
  },

  /**
   * 播放音频&显示动图
   **/
  playVideImg: function () {

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

    wx.request({
      url: app.data.url + '/app/index.php?i=38&c=entry&j=2&a=wxapp&do=addViewHistory&m=wuyi_artrip',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        uid: this.data.uid,
        spid: this.data.spid
      },
      success: (res) => {
        //console.log(res)
      },
      fail: () => { }

    });

    //this.realTime(); 
  },

  //
  realTime: function () {
    wx.startLocationUpdateBackground({
      success(res) {
        console.log('开启后台定位', res)
      },
      fail(res) {
        console.log('开启后台定位失败', res)
      }
    })
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