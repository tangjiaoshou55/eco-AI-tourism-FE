// pages/makePlan1/makePlan1.js
Page({

  /**
   * 页面的初始数据
   */
  data: 
  {

    hasInput:false,
    userName: "请登陆",
    avatarUrl: "/images/head.png",
    city:"未能找寻到您需要的城市!",
    numberOftours:"请输入人数",
    numberOfDays:"请输入天数",
    tours:0,
    days :0,
    tag: " ",
 
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) 
  {
      //设定Bar栏位需要的部分
      if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })}
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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
     if(msg.hasValid)
     {
       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
       recentPage.setData
       ({
         userName :msg.userName,
         avatarUrl :msg.headUrl
       });
     }
   

  },

  startInput1(e)
  {
    this.setData
    ({
      numberOftours:''
    })
  },

  finishedInput1(e)
  {
  
    if(e.detail.value>0)
    {
      
      this.setData
      ({
        tours:e.detail.value
      })
    }else
    {
      this.setData
      ({
        tours:0,
        numberOftours:"请输入人数",
      })
    }
    // 检测是否输入完成
    if(this.isNumeric(this.data.tours)&&this.isNumeric(this.data.days))
    {
      this.setData
      ({
        hasInput: true
      })
    }else
    {
      this.setData
      ({
        hasInput: false
      })
    }
  },

  startInput2(e)
  {
    this.setData
    ({
      numberOfDays:''
    })
  },

  finishedInput2(e)
  {
    if(e.detail.value>0)
    {
      this.setData
      ({
        days:e.detail.value
      })
    }else
    {
      this.setData
      ({
        days:0,
        numberOfDays:"请输入天数",
      })
    }
    // 检测是否输入完成
    if(this.isNumeric(this.data.tours)&&this.isNumeric(this.data.days))
    {
      this.setData
      ({
        hasInput: true
      })
    }else
    {
      this.setData
      ({
        hasInput: false
      })
    }
  },

  onButtonClickForSearch(e)
  {
    // 动画设置
      getApp().globalData.dayForTour =this.data.days;
      getApp().globalData.peopleForTour =this.data.tours;
      console.log(getApp().globalData.dayForTour)
      wx.navigateTo({
        url: '/pages/makePlan2/makePlan2'
      })

  },

  isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value)&&value>0;
  },
})