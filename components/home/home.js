// components/home/home.js
const app = getApp();
const utils = require('../../utils/utils.js');

utils.userLogin();
utils.getJWdFun();

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
    bannerList: [], //轮播图
    navigatesList: [ //nav导航
      { title: '导览图', pic: '/style/images/dl.png', url: '/pages/guideMap/guideMap' },
      { title: '即时翻译', pic: '/style/images/fy.png', url: '' },
      { title: '货币兑换', pic: '/style/images/dh.png', url: '' },
      { title: '附近厕所', pic: '/style/images/cs.png', url: '/pages/commonToilet/commonToilet'}
    ],
    hotNowList: [ //当季热门
      { name: '合肥', tag: '创新高地', pic: '' },
      { name: '上海', tag: '夜色魔都', pic: '' },
      { name: '杭州', tag: '丝绸之路', pic: '' }
    ],
    weather:null,
    weatherDegrees:'--',
    weatherIcon:'/style/images/qint.png',
    bannerTitle: '测试1',
    searicon: "/style/images/search.png",
    jdejicon: "/style/images/ej.png", //景点耳机图标
    jdjl: "/style/images/jl.png", //景点距离图标
    zkicon: '/style/images/zk.png', //地区展开图标
    jdsize: [],
    longitude:null,
    latitude:null
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * @function requestFuns 公共请求方法
     * @params url 请求地址和参数
    */

    requestFuns(url='', number=0, start=0) {
      
      wx.request({
        url: app.data.url + '/app/index.php?i=38&c=entry&j=2&a=wxapp&do=getBannerList&m=wuyi_artrip',
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          number: number,
          start: start
        },
        success: (res) => {
          //console.log(res)
          
         
        },
        fail: (res) => {
          console.log(res);
        }
      })
    },


    /**
     * @function toScenicDetail 绑定事件,点击景点列表跳转景点详情页
     * @params 
     * {
     *  longitude 经度
     *  latitude  维度
     * }
     * 
    */
    toScenicDetail(event){
      
      console.log(event);
      let longitude = event.currentTarget.dataset.longitude; //经度
      let latitude = event.currentTarget.dataset.latitude; //维度
      let spid = event.currentTarget.dataset.spid; //景点id
      
      //跳转
      // wx.navigateTo({
      //   url: `/pages/scenicDetail/scenicDetail?longitud=${longitude}&latitude=${latitude}`
      // })
      wx.navigateTo({
        url: "/pages/scenicDetail/scenicDetail?longitud=" + longitude + "&latitude=" + latitude + "&spid=" + spid
      })

    },

    /**
     * 获取天气
    */
    getweather(){
      console.log('执行了请求天气')
      wx.request({
        url: `https://tianqiapi.com/api?version=v61&appid=25123385&appsecret=lT5FkQmG&cityid=101220101`,
        method: "GET",
        success: (res) => {

          wx.setStorage({
            key: 'weather',
            data: res.data
          })

          if (res.data.wea_img == 'qing') {
            this.setData({
              weatherIcon: '/style/images/qint.png',
              weatherDegrees: res.data.tem
            })
          }
      
        },
        fail: (res) => {
          console.log('获取天气失败')
          wx.showToast({
            title: '获取天气失败',
            icon:'none'
          })
        }
      })
    },

  },

  /**
   * 生命周期
  */
  lifetimes:{
    attached(){
      
      // 获取bannerList
      wx.request({
        url: app.data.url + '/app/index.php?i=38&c=entry&j=2&a=wxapp&do=getBannerList&m=wuyi_artrip',
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          number: 5,
          start: 0
        },
        success: (res) => {
          console.log(res)
          this.setData({
            bannerList:res.data.data
          })
        },
        fail: (res) => {
          console.log(res);
        }
      });

      // 获取景点列表
      wx.request({
        url: app.data.url + '/app/index.php?i=38&c=entry&j=2&a=wxapp&do=getScenicSpottList&m=wuyi_artrip',
        method:"POST",
        header:{
          'content-type': 'application/x-www-form-urlencoded'
        },
        data:{
          number:15,
          start:0
        },
        success : (res) => {
          console.log(res);
          let tempResult = Array.from(res.data.data);
          tempResult.filter(item => {
            item.distance = (item.distance / 1000).toFixed(2);
          });
          this.setData({
            jdsize: tempResult
          })
        },
        fail : (res) => {

        }
      });

      /**
       * 页面加载获取经纬度
      */

      
    },
    ready(){
     
      wx.getStorage({
        key: 'weather',
        success: (res) => {
          console.log(res);
          this.data.weather = res.data
          this.setData({
            weatherIcon: '/style/images/qint.png',
            weatherDegrees: res.data.tem
          })
          if (this.data.weather == null) {
            this.getweather();
          }
        }
      });

    }
    
  }

  
})
