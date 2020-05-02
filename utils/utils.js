// utils 文件公共文件
/**
 * @function getUserInfoMsg 获取用户信息
 * 
*/
const getUserInfoMsg = function ()
{
  // 获取用户信息
  wx.getSetting({
    success: result => {
      if (result.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            
            // 可以将 res 发送给后台解码出 unionId
            this.globalData.userInfo = res.userInfo
            
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res)
            }
            //console.log(res)
            return res;
          }
        })
      }
    }
  })
}

/**
 * @function userLogin 用户登录
 * 
*/

const userLogin = function () {
  const apps = getApp();
  console.log(apps);
  wx.login({
    success(result){
      console.log(result);
      // wx.login 获取code
      if (result.code) {
        apps.data.code = result.code
        wx.request({
          url: apps.data.url + '/app/index.php?i=38&c=entry&j=2&a=wxapp&do=openid&m=wuyi_artrip',
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            code: result.code
          },
          success: (res) => {
            console.log(res);
            // 通过code 换取openid
            apps.data.openid = res.data.openid
            wx.setStorage({
              key: 'openid',
              data: res.data.openid,
            })
          },
          fail: () => {
            wx.showToast({
              title: '获取失败',
            });
          }

        })
      }else{
        wx.showToast({
          title: '获取失败',
        });
      }

     
    }
  })
}

/**
 * @function getJWdFun 获取经纬度
*/
const getJWdFun = function(){
  console.log('getJWdFuna函数执行了');
  //可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.userLocation" 这个 scope，也可直接调用wx.authorize请求授权；
  wx.getSetting({
    success: (result) => {
      let status = result.authSetting['scope.userLocation']// 查看位置权限的状态，此处为初次请求，所以值为undefined
      if (!status) {// 如果是首次授权(undefined)或者之前拒绝授权(false)
        wx.authorize({ // 发起请求用户授权
          scope: 'scope.userLocation',
          success: () => { // 用户允许了授权
            wx.getLocation({ // 请求位置信息
              type: 'gcj02',
              success: (res) => {

                console.log(res); // 得到位置信息（经度longitude,维度latitude等等）
                let jwdArr = [{ longitude: res.longitude, latitude: res.latitude}];
                
                console.log(jwdArr)
                wx.setStorage({
                  key: 'jwdData',
                  data: jwdArr
                });

              }
            })
          },
          fail(res) {
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
            console.log(res);// 得到位置信息（经纬度，速度等等）
            let jwdArr = [{ 'longitude': res.longitude, 'latitude': res.latitude }];
            console.log(jwdArr)
            wx.setStorage({
              key: 'jwdData',
              data: jwdArr
            })
            
          }
        })
      }

    }


  })




}

/**
 * @tips 接口来源 阿凡达数据,使用次数只有20
 * @funciton getWeather 请求天气信息
 * @params {
 *  城市代码: 合肥 101220101
 *  key String:应用APPKEY
 *  cityname String: 要查询的城市，如：温州、上海、北京
 *  dtype String	返回结果格式：可选JSON/XML，默认为JSON
 *  format  Boolean 当返回结果格式为JSON时，是否对其进行格式化，为了节省流量默认为false，测试时您可以传入true来熟悉返回内容
 * }
 * @return 返回城市天气信息
 * 
*/
const getWeather = function() {
  //const key = '3d325c07ce8548728520ee17ade96f29'; //定义的key
  const cityname = '合肥';
  wx.request({
    url: `http://www.weather.com.cn/data/sk/101220101.html`,
    method:"GET",
    success:(res) => {
      console.log(res)
      let jsons = res.data.weatherinfo;
      return jsons;
    },
    fail:(res) => {
      console.log('获取天气失败')
    }
  })
}




module.exports = {
  getUserInfoMsg: getUserInfoMsg,
  userLogin: userLogin,
  getJWdFun: getJWdFun,
  getWeather: getWeather
}

