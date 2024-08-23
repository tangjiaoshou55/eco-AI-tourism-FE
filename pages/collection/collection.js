Page({
  data: {
    planList: [],
    sightList: [],
    currentTab: 'route',
    userName: '',
    avatarUrl: "/images/head.png",
    pullover: false,
    currentX: 0,
    maxSlideDistance: -60,  // 最大滑动距离
    deleteAnimation: {},
    showToast:false,
    wholePlan: {},
  },

  /**
   * 路书数据获取
   */
  requestCollection: function() {
    const TTL = 300 * 1000; // 将TTL设置为5分钟，单位为毫秒

    // 检查globalData中是否有过期时间戳，以及当前时间是否超过了过期时间
    let currentTime = Date.now();
    if (getApp().globalData.msg && getApp().globalData.msgTTL > currentTime) {
      // 数据未过期，直接使用缓存数据
      
    } else if (currentTime == 0){
      // 数据已过期或不存在，发起请求获取新数据
        wx.request({
          url: 'http://47.101.220.93:7876/UserFavorites/favorites',
          method: 'GET',
          data: {
            userId: wx.getStorageSync('token')
          },
          header: {
            'Content-Type': 'application/json', // 告诉服务器实际发送的数据类型   
          },

          success: (res) => {
            let msg = JSON.parse(JSON.stringify(res.data.data));
            
            // 路书Tab
            let planList = [];
            // 遍历每个路书
            if (msg != null){
            msg.forEach(plan => {
              let planObject = {
                id: plan.selectedId,
                chosenCity: plan.selectedCity,
                chosenDays:plan.dayForTour,
                cityImage: "",
                numPeople: plan.peopleForTour,
                chosenTag: plan.selectedTag,
                numScenery: plan.selectedSceneries,
                sceneryAdmissionFee: plan.sightFee,
                finalFee: plan.finalFee,
                x: 0,
              };

              planList.push(planObject);
            });
          }
            // 景点Tab
            // 初始化一个数组来存储所有不重复的景点名
            let uniqueSights = [];
            // 遍历每个路书
            if (msg != null){
            msg.forEach((itinerary) => {
              // 遍历每个天的行程
              itinerary[eachDays].forEach((day) => {
                // 遍历每一天中的所有景点
                day.forEach((sight) => {
                  // 检查景点名是否已经存在于数组中
                  if (!uniqueSights.includes(sight[chosenSight])) {
                    let adultPrice = sight[prices].find(price => price.title === '成人票')?.price;
                    // 如果不存在，添加到数组中
                    uniqueSights.push({
                      chosenSight: sight[chosenSight],
                      sightTag: sight[sightTag],
                      level: sight[level],
                      score: sight[score],
                      avarUrl: sight[avarUrl],
                      openTime: sight[openTime],
                      price: adultPrice,
                      chosenCity: itinerary[chosenCity][cityName]
                    });
                  }
                });
              });
            });
          }
            // 设置新的数据和过期时间
            getApp().globalData = {
              ...getApp().globalData,
              msg: msg,
              msgTTL: currentTime + TTL // 设置过期时间为当前时间加TTL
            };

            // 更新页面数据
            this.setData({
              planList: planList,
              sightList: uniqueSights,
            });
          },
          
          fail: (error) => {
            /*let planList = [
              {
                id: 1,
                chosenCity: getApp().globalData.selectedCity,
                chosenDays:getApp().globalData.dayForTour,
                cityImage: "",
                numPeople: getApp().globalData.peopleForTour,
                chosenTag: getApp().globalData.selectedTag,
                numScenery: 8,
                sceneryAdmissionFee: getApp().globalData.sightFee,
                finalFee: getApp().globalData.finalFee,
                x: 0
              },
              {
                id: 2,
                chosenCity: "南京",
                chosenDays: 1,
                numPeople: 2,
                chosenTag: "六朝古都",
                numScenery: 8,
                sceneryAdmissionFee: 300,
                finalFee: 1500,
                x: 0
              }
            ];
            */
          let wholePlan = wx.getStorageSync('wholePlan');
         
          if(wholePlan)
          {
            this.setData ({
              wholePlan: wholePlan
            });
            let planList = [
              {
               id: 1,
               chosenCity: wholePlan.city,
               chosenDays: wholePlan.dayForTour,
               numPeople: wholePlan.peopleForTour,
               chosenTag: "六朝古都",
               numScenery: 8,
               sceneryAdmissionFee: wholePlan.sightFee,
               finalFee: 0,
               x: 0
              }
            ]
 
             getApp().globalData = {
               ...getApp().globalData,
               msg: planList,
               msgTTL: currentTime + TTL
             };
 
             this.setData ({
               planList: planList
             })
 
             that.setData ({
               msg: planList
             });
          }
          
        }
      });
    } else {
      wx.request({
        url: 'http://47.101.220.93:7876/user/favorite/sight',
        method: 'GET',
        data: {
          userId: 1
        },
        header: {
          'Content-Type': 'application/json', // 告诉服务器实际发送的数据类型   
        },

        success: (res) => {
          let msg = JSON.parse(JSON.stringify(res.data));
          console.log(msg)
        },
      })
    }
  },


    /**
   * 路书 费用计算
   */
  updateDisplayFee: function() {
    let newPlanList = JSON.parse(JSON.stringify(this.data.planList)); // 深拷贝当前的 planList
    for (let key in newPlanList) {
      let plan = newPlanList[key];
      plan.finalFee = (plan.finalFee > plan.sceneryAdmissionFee) 
                    ? plan.finalFee 
                    : plan.sceneryAdmissionFee + "（仅门票）";
    }

    this.setData({
      planList: newPlanList
    });
  },

  onLoad(options) {
    this.requestCollection();
    this.updateDisplayFee();
    
    let planList = this.data.planList.map(plan => {
      return { ...plan, x: 0 };
    });
    this.setData({ planList });
  },

  switchTab: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.tab
    });
  },

  onTouchStart(e) {
    this.setData({
      pullover: false
    });
  },

  onChange(e) {
    let index = e.currentTarget.dataset.index;
    let planList = this.data.planList;
    let x = e.detail.x || 0;
    if (x < this.data.maxSlideDistance) {
      x = this.data.maxSlideDistance;
    }
    planList[index].x = x;
    this.setData({
      planList: planList,
      currentX: x
    });
  },

  onTouchMove(e) {
    let index = e.currentTarget.dataset.index;
    let x = e.detail.x;
    if (x === undefined) {
      x = this.data.currentX;  // 保持上一个有效的值
    } else if (x < this.data.maxSlideDistance) {
      x = this.data.maxSlideDistance;
    }
    this.setData({
      currentX: x
    });
  },

  onTouchEnd(e) {
    let index = e.currentTarget.dataset.index;
    let x = this.data.currentX;
    let animation = wx.createAnimation({
      duration: 300, // 设置动画持续时间，单位为 ms
      timingFunction: 'ease', // 动画的过渡效果
    });

    if (x < -50) {
      // 设置回弹动画
      animation.translateX(this.data.maxSlideDistance).step();
      this.setData({
        animation: animation.export()
      });
      this.data.planList[index].x = this.data.maxSlideDistance;
      this.setData({
        planList: this.data.planList,
        pullover: true
      });
    } else {
      animation.translateX(0).step();
      this.setData({
        animation: animation.export()
      });
      this.data.planList[index].x = 0;
      this.setData({
        planList: this.data.planList,
        pullover: true
      });
    }
  },
  
  deleted(e) {
    let index = e.currentTarget.dataset.index;
    let planList = this.data.planList;
  
    // 将当前项设为空白
    planList[index].deleted = true;
    this.setData({
      planList: planList,
      showToast:true
    });
  
    // 3 秒后删除当前项，并将下面的项上移
    setTimeout(() => {
      planList.splice(index, 1);
      this.setData({
        showToast:false,
        planList: planList
      });
    }, 3000); // 3 秒后执行删除和上移
  },

  /**
   * 点击后 调用数据并跳转路书详情页面
   */
  fetchAndNavigate: function(e) {
    
      getApp().globalData.selectedCity = this.data.wholePlan.city;
      getApp().globalData.dayfortour = this.data.wholePlan.dayForTour;
      getApp().globalData.peopleForTour = this.data.wholePlan.peopleForTour;
      getApp().globalData.tourPlan = this.data.wholePlan.tourPlan;
      getApp().globalData.sightFee = this.data.wholePlan.sightFee;

    console.log(this.data.wholePlan.tourPlan);
    console.log(getApp().globalData.tourPlan)
    wx.navigateTo({
      url: '/pages/createdPlan/createdPlan',
    })
  },

    /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let msg =getApp().globalData
    this.setData
    ({
      city:msg.selectedCity,
      tag :msg.selectedTag
    })
     const recentPage = this;
     //是否授权，能否直接获取用户头像
     if(msg.hasValid){
      // 已经授权，可以直接调用 getUserInfo 获取头像昵称
      recentPage.setData
      ({
        userName :msg.userName,
        avatarUrl :msg.headUrl
      });
     };

     if (typeof this.getTabBar === 'function' &&
     this.getTabBar()) {
     this.getTabBar().setData({
       selected: 1
     })
   }
 },
});
