// app.js
App({
  globalData: {
  
    hasValid: false,
    selectedCity:"",
    selectedStyle:"",
    selectedTag:"",
     userName:"傻逼",
     headUrl:"/images/plane1.png",
     dayForTour:5,
     peopleForTour:7,
     tourPLan:'',//用于临时存储加载的信息
     sightFee: 300,//景点费用
     finalFee: 300 ,//总费用
     token:'',
     msg: ['hello'],
     msgTTL: 1721805093654,
     reCreateReason:''

  },

  // 每次登陆先行检查是否完成注册
  onLaunch()
  {
    console.log("傻逼")
    let that =this
    let userInfo = wx.getStorageSync('userInfo');
    
    //let token =wx.getStorageSync('token')
    //
    let token=111
    if(userInfo && token)
    {
  
      wx.request({
        url: '随便一个接口',
        method: 'GET',
        header: 
        {
         'Authorization':"bearer"+wx.getStorageSync('token'),
         'Content-Type': 'application/json', // 告诉服务器实际发送的数据类型   
        },
        success(res)
        {
          if(res.code==200)
          {
            that.globalData.userName= userInfo.userName;
            that.globalData.headUrl =userInfo.headUrl;
            that.globalData.token =token;
            that.globalData.hasValid =true;
          }
        },fail(e){
          //测试用的以后要删除
            console.log(11)
            that.globalData.userName= userInfo.userName;
            that.globalData.headUrl =userInfo.headUrl;
            that.globalData.token =token;
            that.globalData.hasValid =true;
         
        }
      })
    }
   if(this.globalData.hasValid == false)
   {
     wx.login({
       success: (res1) => 
       {
         wx.request({
           url: '检查用的url',
           method: 'POST',
           data: 
           {
            code: res1.code
           },
           header: 
           {
            'Content-Type': 'application/json', // 告诉服务器实际发送的数据类型   
           },
           success(res)
           {
             if(res.data.bool==true)
             {
               wx.setStorageSync('token', res.data.token)
               wx.setStorageSync('userInfo',res.data.userInfo);
               this.globalData.userName= res.data.userinfo.userName;
               this.globalData.headUrl = res.data.userinfo.headUrl;
               this.globalData.token =res.data.token
               this.globalData.hasValid =true;
             }else
             {
               wx.setStorageSync('token', res.data.token)
             }
           },fail(e)
           {
             console.log(e.data);
           }
         })
       },fail(e)
       {
         console.log(e.data);
       }
     })
   }
  },

getToken()
{
  wx.request({
    url: '检查用的url',
    method: 'POST',
    data: 
    {
     code: res1.code
    },
    header: 
    {
     'Content-Type': 'application/json', // 告诉服务器实际发送的数据类型   
    },
    success(res)
    {
     
        wx.setStorageSync('token', res.data.token)
        this.globalData.token =res.data.token
        this.globalData.hasValid =true;
    },fail(e)
    {
      console.log(e.data);
    }
  })
}
})

