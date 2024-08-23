Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingBackground: "",
    chosenCity: getApp().globalData.selectedCity,
    chosenVerse: "",
    writer: "",
  
      
        // 假数据结束
    
        //假数据2
        planForOneDay2:[{
          sight: {
            name: "苏州博物馆judy",
            avarUrl:  '/images/sight.png',
            describe:"国家一级博物馆",
            level: 4,
            score: 4.9,
            price: 70,
            time: "开放时间：07:30-17:30",
            address: "苏州市姑苏区东北街204号"
          },
          intr: "从拙政园步行至苏州博物馆，探索苏州的历史和文化。博物馆由著名建筑师贝聿铭设计，现代与传统的结合非常值得看",
          sightInfo:{
            choosenCity: "苏州",
            choosenSight: "拙政园",
            sightAddr: "江苏省苏州市姑苏区东北街178号",
            sightDesc: "拙政园是苏州四大名园之一，著名的园林建筑，以其精美的布局和丰富的历史文化深受游客喜爱。",
            sightScore: 4.9,
            sightRate: "高",
            openTime: "07:30-17:30",
        
            price: [
              { title: "成人票", price: 70 },
              { title: "学生/儿童票", price: 35 }
            ],
        
            tourInfo: [
              { title: "推荐游玩时长", content: "2小时" },
              { title: "推荐理由", content: "风景优美，文化丰富" },
              { title: "地点概览", content: "历史悠久的古城" },
              { title: "当地游玩特色", content: "独特的民俗活动" }
            ],
            sightPicture1:'url1',
            sightPicture2:'url2',
            sightPicture3:'url3'
          }
        },
      
     ],
    //假数据2结束
  },

  /**
   * 请求诗歌词信息
   */
  onLoad: function() {
    let that = this;

    // 请求诗歌词信息
    wx.request({
      url: '查询城市通用诗歌词url',
      method: 'POST',
      data: this.data.chosenCity,
      header: {
        'Content-Type': 'application/json', // 告诉服务器实际发送的数据类型   
      },
      success(e) {
        let temp = e.data.data;
        /**
         * 假设传入字典格式
         * {'诗人名《诗词名》': '诗句'}
         */
        let verse = temp[0];
        let wr = temp[1];
        that.setData({
          chosenVerse: verse,
          writer: wr
        }, () => {
          // 在成功设置数据后再请求旅游计划
          that.requestTourPlan();
        });
      },
      fail(error) {
        that.setData({
          chosenVerse: "千里莺啼绿映红,水村山郭酒旗风。",
          writer: "杜牧《江南春》"
        }, () => {
          // 在设置默认数据后再请求旅游计划
          that.requestTourPlan();
        });
      }
    });
  },
//每次执行完诗词查询/执行失败之后再执行查询旅游计划
  requestTourPlan: function() 
  {
    let msg = getApp().globalData;
    let that =this.data
    let userSelected = {
      selectedCity: msg.selectedCity,
      selectedStyle: msg.selectedStyle,
      dayForTour: msg.dayForTour,
      peopleForTour: msg.peopleForTour,
      reCreateReason:msg.reCreateReason
    };
   
    wx.request({
      url: 'http://47.101.220.93:7876/api/getRouteReportData',
      method:'GET',
      data: userSelected,
      header: {
        'Content-Type': 'application/json', // 告诉服务器实际发送的数据类型   
      },
      success(res){
        msg.tourPlan = res.data;
        //算出初始费用
        for(let i=0;i<msg.tourPlan.length;i++)
        {
          for(let j=0;j<msg.tourPlan[i].length;j++)
          {
            msg.sightFee += msg.tourPlan[i].sights[j].price
            msg.finalFee += msg.tourPlan[i].sights[j].price
          }
        }
        
        wx.redirectTo({
          url: '/pages/createdPlan/createdPlan',
        });
      },
      fail(error){
       
      }
    });
  },
  
})