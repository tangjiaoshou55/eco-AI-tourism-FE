// pages/calculator/calculator.js

const citySelector = requirePlugin('citySelector');

Page({
  data: {
    sections: {
      transport: true,  // 默认显示复杂界面
      dining: true,
      accommodation: true,
    },
    chosenCity: getApp().globalData.selectedCity,
    chosenDays:getApp().globalData.dayForTour,

    sceneryAdmissionFee: getApp().globalData.sightFee,
    transportFee: 0,
    transportFeeInCity: 0,
    foodFee: 0,
    hotelFee: 0,
    finalFee: getApp().globalData.sightFee,
    
    toggleClass: "toggle-button-down",
    
    showSelectorFlag: false,
    selectedCity: '',
    cities: ['上海', '北京', '深圳', '广州'],

    showTransportSelectorFlag: false,
    selectedTransport: '',
    transports: ['飞机', '高铁', '驾车'],

    showCityTransportSelectorFlag: false,
    selectedCityTransport: '',
    cityTransports: ['公共交通', '驾车'],

    showFoodSelectorFlag: false,
    selectedFood: '',
    Foods: ['高档餐厅', '中档餐厅', "快餐小吃"],

    showHotelSelectorFlag: false,
    selectedHotel: '',
    Hotels: ['豪华型', '舒适型', "经济型"],

    selectedCity: '',
  },
  
  toggleSection: function(event) {
    const section = event.currentTarget.dataset.section;
    if (this.data.sections.transport == false) {
      this.setData({
        toggleClass: "toggle-button-down",
      });
    } else {
      this.setData({
        toggleClass:"toggle-button-up",
      });
    }

    this.setData({
      [`sections.${section}`]: !this.data.sections[section]
    });
  },

  showSelector: function () {
    this.setData({
      showSelectorFlag: true
    });
  },

  hideSelector: function () {
    this.setData({
      showSelectorFlag: false
    });
  },

  preventHide: function () {
    // 防止点击选择器内容区域关闭选择器
  },

  selectCity: function (event) {
    this.setData({
      selectedCity: event.currentTarget.dataset.item,
      showSelectorFlag: false
    });

    this.checkAndUpdate();
  },

  showTransportSelector: function () {
    this.setData({
      showTransportSelectorFlag: true
    });
  },

  hideTransportSelector: function () {
    this.setData({
      showTransportSelectorFlag: false
    });
  },

  selectTransport: function (event) {
    var option = event.currentTarget.dataset.option;
    if (option == "飞机") {
      option = "../../images/calculator/plane.png";
    } else if (option == "高铁"){
      option = "../../images/calculator/train.png";
    } else if (option == "驾车") {
      option = "../../images/calculator/car.png";
    }
    this.setData ({
      selectedTransport: option,
      showTransportSelectorFlag: false
    });

    this.checkAndUpdate();
  },

  showCityTransportSelector: function () {
    this.setData({
      showCityTransportSelectorFlag: true
    });
  },

  hideCityTransportSelector: function () {
    this.setData({
      showCityTransportSelectorFlag: false
    });
  },

  selectCityTransport: function (event) {
    var option = event.currentTarget.dataset.option;
    this.setData ({
      selectedCityTransport: option,
      showCityTransportSelectorFlag: false
    });

    this.checkAndUpdate();
  },

showFoodSelector: function () {
  this.setData({
    showFoodSelectorFlag: true
  });
},

hideFoodSelector: function () {
  this.setData({
    showFoodSelectorFlag: false
  });
},

selectFood: function (event) {
  var option = event.currentTarget.dataset.option;
  this.setData ({
    selectedFood: option,
    showFoodSelectorFlag: false
  });

  this.checkAndUpdate();
},

showHotelSelector: function () {
  this.setData({
    showHotelSelectorFlag: true
  });
},

hideHotelSelector: function () {
  this.setData({
    showHotelSelectorFlag: false
  });
},

selectHotel: function (event) {
  var option = event.currentTarget.dataset.option;
  this.setData ({
    selectedHotel: option,
    showHotelSelectorFlag: false
  });

  this.checkAndUpdate();
},

// 保存至攻略
onTap: function(event) {
  const app = getApp();
  app.globalData.finalFee = this.data.finalFee;
  console.log("Global data updated to:", app.globalData.finalFee);
  this.showToast("已保存");
},

showToast: function(message) {
  const that = this;
  this.setData({
    showToast: true,
    toastMessage: message
  });

  // 3秒后隐藏提示框
  setTimeout(function() {
    that.setData({
      showToast: false,
      toastMessage: ""
    });
  }, 3000);
},

// 检查并更新费用的方法
checkAndUpdate: function() {
  // 判定 selectedCity 和 selectedTransport 是否为空，并获取价格
  if (this.data.selectedCity && this.data.selectedTransport) {
    let transport = 0;
    wx.request({
      url: '查询费用通用url',
      method: 'POST',
      data:[this.data.selectedCity, this.data.selectedTransport],
      header: {
        'Content-Type': 'application/json', // 告诉服务器实际发送的数据类型   
      },
      success(e) {
        transport = e.data.data;
      },
      fail(error) {
        transport = 200;
      }
    })

    this.setData({
      transportFee: transport
    });

    this.calculateFinalFee();
  }

  // 判定 selectedCityTransport 是否为空，并获取价格
  if (this.data.selectedCityTransport) {
    let transportCity = 0;
    wx.request({
      url: '查询费用通用url',
      method: 'POST',
      data:[this.data.chosenCity, this.data.selectedCityTransport],
      header: {
        'Content-Type': 'application/json', // 告诉服务器实际发送的数据类型   
      },
      success(e) {
        transportCity = e.data.data;
      },
      fail(error) {
        transportCity = 100;
      }
    })

    this.setData({
      transportFeeInCity: transportCity
    });

    this.calculateFinalFee();
  }

  // 判断 selectedFood 是否为空
  if (this.data.selectedFood) {
    let food = 0;
    wx.request({
      url: '查询费用通用url',
      method: 'POST',
      data:[this.data.chosenCity, this.data.selectedFood],
      header: {
        'Content-Type': 'application/json', // 告诉服务器实际发送的数据类型   
      },
      success(e) {
        food = e.data.data;
      },
      fail(error) {
        food = 400;
      }
    })

    this.setData({
      foodFee: food
    });

    this.calculateFinalFee();
  }

  // 判断 selectedHotel 是否为空
  if (this.data.selectedHotel) {
    let hotel = 0;
    wx.request({
      url: '查询费用通用url',
      method: 'POST',
      data:[this.data.chosenCity, this.data.selectedHotel],
      header: {
        'Content-Type': 'application/json', // 告诉服务器实际发送的数据类型   
      },
      success(e) {
        hotel = e.data.data;
      },
      fail(error) {
        hotel = 500;
      }
    })

    this.setData({
      hotelFee: hotel
    });

    this.calculateFinalFee();
  }
},

// 计算最终费用
calculateFinalFee: function() {
  let FinalFee = this.data.transportFee +
                 this.data.transportFeeInCity +
                 this.data.foodFee +
                 this.data.hotelFee +
                 this.data.sceneryAdmissionFee;
  this.setData({
    finalFee: FinalFee
  });
},

// 显示组件
onShow() {
  const SelectedCity = citySelector.getCity();
  console.log("selectedCity===",SelectedCity);
  if(SelectedCity!=null){
      this.setData({
        selectedCity:SelectedCity.name
      })
  }
},

goChooseCity() {
  const key = 'DNJBZ-KSNLI-PYPGP-UUWVM-LUM7Z-J2BK6'; // 使用在腾讯位置服务申请的key
  const referer = 'eco-tourism-mp'; // 调用插件的app的名称
  const hotCitys = '北京,成都,重庆,广州,杭州,南京,上海,深圳,天津,青岛,香港,苏州'; // 用户自定义的的热门城市
  wx.navigateTo({
      url: `plugin://citySelector/index?key=${key}&referer=${referer}&hotCitys=${hotCitys}`,
  })
},

onUnload () {
  // 页面卸载时清空插件数据，防止再次进入页面，getCity返回的是上次的结果
  citySelector.clearCity();
}

});