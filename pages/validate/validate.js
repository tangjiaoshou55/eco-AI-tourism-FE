// pages/validate/validate.js
Page({
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  onCheckboxChange(e)
  {

    if(e.detail.value.length>0)
    {
      this.setData
      ({
        hasChecked :false
      })
    }else
    {
      this.setData({
        hasChecked :true
      })
    }
  },

  getPhoneNumber(e)
  {
    console.log(e)  // 动态令牌
    wx.request({
      url: '请求手机号用的url',
      method: 'POST',
      data:e.detail.code,
      header: {
        'Content-Type': 'application/json', // 告诉服务器实际发送的数据类型   
        'Authorization': "bearer " + wx.getStorageSync('token')
      },
      success(res) {
        let userInfo1 ={}
        userInfo1.userName =res.data
        userInfo1.phoneCode=res.data
        userInfo1.headUrl =getApp().globalData.headUrl
        getApp().globalData.userName=userInfo1.userName 
        getApp().globalData.hasValid=true
        wx.setStorageSync('usrInfo', userInfo1)
      },
      fail(err)
      {
        // 将来要加上获取码的方法
        //下面是测试用的假数据
        let userInfo1 ={}
        userInfo1.userName = getApp().globalData.userName
        userInfo1.headUrl =getApp().globalData.headUrl
        getApp().globalData.hasValid=true
        wx.setStorageSync('userInfo', userInfo1)
        let wxx =wx.getStorageSync('userInfo')
        console.log(wxx)
        //假数据结束
        wx.navigateBack({
          delta: 1// 返回上一个页面，如果想返回更远的页面，可以调整这个值
        });
      }
    })
  },

  // 请求GPS授权
  requestGPSPermission() {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userFuzzyLocation']) {
          // 在请求授权之前显示提示信息
          wx.showModal({
            title: '获取你的位置',
            content: '将获取你的模糊位置信息，用于为你提供出行导航等',
            success(modalRes) {
              if (modalRes.confirm) {
                // 用户同意进行授权请求
                wx.authorize({
                  scope: 'scope.userFuzzyLocation',
                  success() {
                    // 用户同意授权
                    wx.getFuzzyLocation({
                      type: 'wgs84',
                      success(getFuzres) {
                        const latitude = getFuzres.latitude;
                        const longitude = getFuzres.longitude;
                        console.log('用户位置:', latitude, longitude);
                      }
                    });
                  },
                  fail() {
                    // 用户拒绝授权
                    wx.showModal({
                      title: '授权提示',
                      content: '需要获取您的地理位置，请前往设置授权',
                      showCancel: false,
                      success(res) {
                        if (res.confirm) {
                          wx.openSetting();
                        }
                      }
                    });
                  }
                });
              }
            }
          });
        } else {
          // 已经授权
          wx.getLocation({
            type: 'wgs84',
            success(res) {
              const latitude = res.latitude;
              const longitude = res.longitude;
              console.log('用户位置:', latitude, longitude);
            }
          });
        }
      }
    });
  },

  onLoad() {
    // 请求GPS授权
    this.requestGPSPermission();
  }
})