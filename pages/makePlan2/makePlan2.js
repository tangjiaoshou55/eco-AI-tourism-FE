// pages/makePlan/makePlan.js
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
    tag: " ",
    selectedStyle:"",
    styles: [
            ]
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
     wx.request({
      url: 'http://47.101.220.93:7876/tourStyle/list',
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
      },
      success(res)
      {
        
      }
     })
  },

  choosen(e)
  {
    let recentIdx =e.currentTarget.dataset.index;
    let newSate =[];
    for(let i=0;i<this.data.styles.length;i++)
    {
      let items =this.data.styles[i];
      if(recentIdx == i)
      {
        items.selected =true;
        this.setData
        ({
           selectedStyle :items.name
        })
        
      }else
      {
        items.selected =false;
      }
      newSate.push(items)
    }
    this.setData
    ({
      styles :newSate,
      hasInput: true
    })
  },
    


  

 
  onButtonClickForSearch(e)
  {
    if(getApp().globalData.hasValid==true)
    {

      let msg =getApp().globalData
      msg.selectedStyle =this.data.selectedStyle;
  
      wx.redirectTo({
        url: '/pages/loading/loading',
      })
    }else
    {
      wx.navigateTo({
        url: '/pages/validate/validate',
      })
    }
  },

})