// pages/createdPlan/createdPlan.js
Page({

  /**
   * 页面的初始数据
   */
  data: 
  {
    showMask:false,//是否展示遮盖
    showMention:false,//是否展示重新生成提示框
    showReason:false,//是否展示重新生成原因框架
    totalCost:"",
    animationReplace:'',//页面动画
    showToast:false,//是否展示删除成功
    showCollect:false,//是否展示收藏成功
    choosenCity:getApp().globalData.selectedCity,
    choosenDays:"",
    peopleNumber:"",
    daysNumber:"",
    costCalculate:"",
    eachDays:[],//所有的天数，以及每天的计划
    selectedDate:'',//当前选中的天数
    selcetedNumber:'',//选中的是第几天
    tourTime:'',//建议的旅游时间
    adviseText:'',//路线图概览
   
    //下拉切换时使用的数据
    animationClass:'',//动画
    scrollHeight:"50%" ,//信息展示框动态高度
    o_scrollHeight:"50%",//信息展示框原高度
    adviseHeight:330,//游玩建议概览位置
    o_adviseHeight:330,//游玩建议概览原高度
    showInfo:true,//是否展示信息
    dayPosition:"absolute",//日期栏固定
    o_dayPosition:"absolute",//日期栏原固定
    dayTop: 210,//日期栏位置
    o_dayTop:210,//日期栏原位置
    hasScroll:false,//是否发生了动画
    infoBorder:30,//边框弧度
    o_infoBorder:30,//原边框弧度
    //动态天数大小
    dayWidth:Math.max(16,Math.min(40,80/getApp().globalData.dayForTour))+"%",
    //拖动位置
    currentX:'',//记录当前拖动模块位置
    pullover:false,//是否拉动过位置
    reCreateReasons:["行程太紧凑","景点门票超出预算","想看别的景点","出行人数，天数变化","想换个风格","想换个城市"],
  
    //假数据3，用于测试替换
    replaceTest:{
      sight: {
        name: "天上人间",
        avarUrl: '/images/sight.png',
        describe:"5A",
        level: 5,
        score: 4.9,
        price: 70,
        time: "开放时间：07:30-17:30",
        address: "苏州市姑苏区东北街204号"
      },
      intr: "从天上人间步行至巨型构式，探索苏州的历史和文化。博物馆由著名建筑师贝聿铭设计，现代与传统的结合非常值得看", 
  }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let local =this.data;
    let msg =getApp().globalData;
    let plan =msg.tourPlan.dayDetails;//临时承装导入的每天计划
    let planAdvise ="";
    console.log(msg.tourPlan.dayDetails)
    for(let i =1;i<=msg.dayForTour;i++)
    {
      let select =false;
      if(i==1)
      {
        select =true;
      }     
      plan.selected =select
    }

//用于处理输入的数据，实现转化星级图片需要的数组和设置控制滑块需要的值
    for(let i = 0; i < plan.length; i++) {
      for(let j = 0; j < plan[i].sights.length; j++) {
          plan[i].sights[j].level = new Array(Math.floor(plan[i].sights[j].score));
          plan[i].sights[j].x=0;
          plan[i].sights[j].replacedX=0;
          plan[i].sights[j].delete =false;
          plan[i].sights[j].showReplace=false;
          plan[i].sights[j].animation = wx.createAnimation({
            duration: 200,  // 动画持续时间，单位 ms
            timingFunction: 'ease',  // 动画的缓动函数
          });
      }
    }
    

   //更新快捷路线图
    for(let j =0;j<plan[0].sights.length;j++)
    {
      let recentSight = plan[0].sights[j].sight.name;
      planAdvise +=recentSight+" ";
      if(j<plan[0].sights.length-1)
      {
        planAdvise +="→ "
      }
    }
    //完成界面需要的值设置，且初始界面为第一天
    this.setData({
      eachDays: msg.tourPlan.dayDetails,
      adviseText :planAdvise,
      totalCost:msg.sightFee,
      choosenCity:msg.selectedCity,
      choosenDays:msg.dayForTour+"日游",
      peopleNumber:"出行人数"+"     "+msg.peopleForTour+"人",
      daysNumber:"出行天数"+"     "+msg.dayForTour+"天",
    })
     this.setData({
      selectedDate:this.data.eachDays[0],
      selcetedNumber:0
     })
     this.setData({
       tourTime:this.data.selectedDate.planTime
     })
 
 
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
    console.log()
    let msg =getApp().globalData;
    let that =this.data
    if(msg.finalFee == that.totalCost)
    {
      this.setData({
        costCalculate:msg.finalFee+"(仅门票)"
      })
    }else
    {
      this.setData({
        costCalculate:msg.finalFee
      })
    }
  },
//天数选中
choosen(e)
{
   let msg =this.data;
   let recindex =e.currentTarget.dataset.index;
   let choosenDay =[];
   let choosenNumber =0;
   let planAdvise ="";//用于承装当前天数的路线概览
   //切换选中位置
   for(let i=0;i<msg.eachDays.length;i++)
   {
     let recent = msg.eachDays[i]
     if(recindex == i)
     {
       recent.selected = true;
       choosenNumber =i
       //生成当前天数的路线概览
       for(let j=0;j<recent.sights.length;j++)
       {
        let recentSight = recent.sights[j].sight.name;
        planAdvise +=recentSight+" ";
        if(j<recent.sights.length-1)
        {
          planAdvise +="→ "
        }
       }
       //将界面显示切换到当前界面
       this.setData({
         selectedDate : recent,
         tourTime:recent.planTime,
         adviseText:planAdvise

       })
     }else
     {
       recent.selected =false;
     }
     choosenDay.push(recent);
   }
   //更新图标显示
   this.setData({
     eachDays :choosenDay,
     selcetedNumber :choosenNumber
   })
},

scrolling(e)
{
  if(e.detail.scrollTop>130)
  {  if(this.data.hasScroll==false)
    {
      this.scrollToTop()
    }
     
  }else
  {
    if(this.data.hasScroll==true)
    this.scrollBack()
  }
},

onTouchStart(e)
{
  this.setData({
    pullover:false
  })
},


//记录拖动
onChange(e)
{
  let index =e.currentTarget.dataset.index;
  let currentNumber = this.data.selcetedNumber
  let currentDate =this.data.eachDays[currentNumber];
  //是否可以活动
  if(currentDate.sights[index])
  {
    
  if(this.data.pullover ==false)
  {
    currentDate.sights[index].x =e.detail.x
  }
  currentDate.sights[index].replacedX=e.detail.x
  if(currentDate.sights[index].replacedX<-50)
  {
    currentDate.sights[index].replacedX =-50
  }
  this.setData({
    currentX:e.detail.x,
    selectedDate:currentDate
  })
  }
    
  
},

//拖动结束
onTouchEnd(e) {
  let index =e.currentTarget.dataset.index;
  let x = this.data.currentX
  let currentNumber =this.data.selcetedNumber
  let currentDate =this.data.eachDays[currentNumber]
  /* 3. 选择当前滑动的movable-view组件 */
  
    if (x < -50) {    /* 5. 如果滑动距离超过75rpx，显示操作按钮 */
     currentDate.sights[index].x=-100
     this.setData({
       selectedDate:currentDate,
       pullover:true
     })
    } else {
      currentDate.sights[index].x=0
      this.setData({
        selectedDate:currentDate,
        pullover:true
      })
    }
},

//替换按钮
replace(e) {
  let that = this;
  let index = e.currentTarget.dataset.index; // 获取当前点击项的索引
  let nowDay = this.data.selcetedNumber; // 获取当前选中的日期索引
  let newPlan = this.data.eachDays; // 获取当前的每日计划
  let animation = newPlan[nowDay].sights[index].animation; // 获取动画实例
  let planAdvise = '';

  // 重置所有条目的位置
  newPlan[nowDay].sights.forEach(item => {
    item.x = 0;
    item.replacedX = 0;
  });

  // 设置动画淡出效果
  animation.opacity(0).step();
  newPlan[nowDay].sights[index].animationData = animation.export();
  // 更新数据以触发视图更新
  this.setData({
    selectedDate: newPlan[nowDay],
    eachDays: newPlan
  });

  // 延时处理，以确保动画有时间播放
  setTimeout(() => {
    newPlan[nowDay].sights[index].delete = true; // 标记为删除
    newPlan[nowDay].sights[index].showReplace = true; // 显示替换按钮
    this.setData({
      animationReplace: "fade-in", // 设置替换动画为淡入效果
      selectedDate: newPlan[nowDay],
      eachDays: newPlan
    });
    
    // 发送替换请求
    wx.request({
      url: '替换用的URL',
      method: 'POST',
      data: "替换用的序列号",
      header: {
        'Content-Type': 'application/json', // 告诉服务器实际发送的数据类型   
        'Authorization': "bearer " + wx.getStorageSync('token')
      },
      success(res) {
        // 成功处理
      },
      fail(e) {
        // 失败处理
        setTimeout(() => {
          // 替换为新的数据
          
          newPlan[nowDay].sights[index] = that.data.replaceTest;
          newPlan[nowDay].sights[index].level = new Array(Math.floor(newPlan[nowDay].sights[index].score));
          newPlan[nowDay].sights[index].animation = wx.createAnimation({
            duration: 200,  // 动画持续时间，单位 ms
            timingFunction: 'ease',  // 动画的缓动函数
          });
          newPlan[nowDay].sights[index].showReplace = false;
          that.setData({
            animationReplace: "fade-out", // 设置替换动画为淡出效果
          });
        

          // 延时处理，以确保动画有时间播放
          setTimeout(() => {
            
            newPlan[nowDay].sights[index].delete = false; // 取消删除标记
            newPlan[nowDay].sights.forEach(item => {
              item.x = 0;
              item.replacedX = 0;
            });

            // 设置动画淡入效果
            
            animation.opacity(1).step();
            newPlan[nowDay].sights[index].animationData = animation.export();
           
            // 更新路线概览
            for (let j = 0; j < newPlan[nowDay].sights.length; j++) {
              let recentSight = newPlan[nowDay].sights[j].sight.name;
              planAdvise += recentSight + " ";
              if (j < newPlan[nowDay].sights.length - 1) {
                planAdvise += "→ ";
              }
            }

            that.setData({
              selectedDate: newPlan[nowDay],
              eachDays: newPlan,
              adviseText:planAdvise,
              animationReplace: '', // 清空替换动画
            });
          }, 500); // 延迟500毫秒
        }, 500); // 延迟500毫秒
      }
    });
  }, 500); // 延迟500毫秒
},






//删除
deleted(e)
{
  let that =this
  let index = e.currentTarget.dataset.index;
  let nowDay = this.data.selcetedNumber;
  let newPlan = this.data.eachDays;
  let animation = newPlan[nowDay].sights[index].animation;//动画
  let planAdvise=''

  // 重置当前景点的位置信息
  newPlan[nowDay].sights.forEach(item => {
    item.x = 0;
    item.replacedX = 0;
  });

  // 设置动画
  animation.opacity(0).step();
  newPlan[nowDay].sights[index].animationData = animation.export();
  this.setData({
    selectedDate: newPlan[nowDay],
    eachDays: newPlan
  });
  wx.request({
    url: '删除用的Url',
    method: 'POST',
    data: "要更改的intr的序列号",
    // if(index-1>=){ index-1} 和index
    header: 
    {
     'Content-Type': 'application/json', // 告诉服务器实际发送的数据类型   
     'Authorization':"bearer"+wx.getStorageSync('token')
    },
    success(res){
      setTimeout(() => {
        // 重设动画对象
          newPlan[nowDay].sights.splice(index,1)
          if(index-1>=0)
          {
           newPlan[nowDay].sights[index-1].intr=res.data.data[0]
           newPlan[nowDay].sights[index].intr=res.data.data[1]
          }else
          {
            newPlan[nowDay].sights[index].intr=res.data.data[0]
          }
          
          if(index<newPlan[nowDay].sights.length-1)
          {
          animation.opacity(1).step()
          newPlan[nowDay].sights[index].animationData = animation.export()
        }
          //更新路线概览
          for(let j =0;j<newPlan[nowDay].sights.length;j++)
          {
           let recentSight = newPlan[nowDay].sights[j].sight.name;
           console.log(recentSight)
           planAdvise += recentSight+" ";
           console.log(planAdvise)
           if(j<newPlan[nowDay].sights.length-1)
           {
            planAdvise +="→ "
           }
          } 
          that.setData({
            eachDays:newPlan,
            selectedDate:newPlan[nowDay],
            adviseText:planAdvise,
            showToast:true
          })
          setTimeout(()=>{
            that.setData({
              showToast :false
            })
          },1000)
          },500);

    },
  fail(e){
    setTimeout(() => {
      // 重设动画对象
        newPlan[nowDay].sights.splice(index,1)
        if(index<newPlan[nowDay].sights.length-1)
        {
        animation.opacity(1).step()
        newPlan[nowDay].sights[index].animationData = animation.export()
      }
        //更新路线概览
        for(let j =0;j<newPlan[nowDay].sights.length;j++)
        {
         let recentSight = newPlan[nowDay].sights[j].sight.name;
         console.log(recentSight)
         planAdvise += recentSight+" ";
         console.log(planAdvise)
         if(j<newPlan[nowDay].sights.length-1)
         {
          planAdvise +="→ "
         }
        } 
        that.setData({
          eachDays:newPlan,
          selectedDate:newPlan[nowDay],
          adviseText:planAdvise,
          showToast:true
        })
        setTimeout(()=>{
          that.setData({
            showToast :false
          })
        },1000)
        },500);

  }  
  })
  //更新路线概览
    },

//跳转到信息页面
onInfo(e)
{
  let index = e.currentTarget.dataset.index;
  let nowDay = this.data.selcetedNumber;
  let newPlan = this.data.eachDays;
  let sightInfo = JSON.stringify(newPlan[nowDay].sights[index].sightInfo)
  wx.navigateTo({
    url: `/pages/sight/sight?data=${sightInfo}`,
  })
},



//上拉动画
scrollToTop() {
  this.setData({

    animationClass: 'fade-out',
    infoBorder:0,
  });
  // 在动画结束后隐藏视图,调整位置
  setTimeout(() => {
      this.setData({

       showInfo:false,
       dayPosition:"fixed",
       dayTop:40,
        adviseHeight:150,
        scrollHeight:"65%",
        animationClass:'',
        hasScroll:true
      });
  }, 100); // 动画时长 0.5 秒
},

scrollBack() {
  this.setData({
    infoBorder:this.data.o_infoBorder,
    dayPosition:this.data.o_dayPosition,
    dayTop:this.data.o_dayTop,
    adviseHeight:this.data.o_adviseHeight,
    scrollHeight:this.data.o_scrollHeight,
    showInfo:true,
    animationClass: 'fade-in',
  });
  // 在动画结束后隐藏视图,调整位置
  setTimeout(() => {
      this.setData({
        animationClass:'',
        hasScroll :false
      });
  }, 100); // 动画时长 0.5 秒
},

//收藏用的逻辑
collect()
{
  let that =this
  //通知后端收藏
  wx.request({
    url: '决定收藏的URl',
    method: 'POST',
    data: true,//或者别的什么东西
    header: 
    {
     'Content-Type': 'application/json', // 告诉服务器实际发送的数据类型   
     'Authorization':"bearer"+wx.getStorageSync('token')
    },
    success(res){
      //已收藏弹窗
      that.setData({
        showCollect:true
      })
      setTimeout(()=>{
        that.setData({
          showCollect:false
        })
      })
    },
    fail(e)
    {
      let msg =getApp().globalData
      let wholePlan ={}
      wholePlan.dayForTour=msg.dayForTour
      wholePlan.peopleForTour =msg.peopleForTour
      wholePlan.city =msg.selectedCity
      wholePlan.tourPlan =msg.tourPlan
      wholePlan.sightFee =msg.sightFee
      wholePlan.finalFee =msg.finalFee
      console.log(wholePlan)
       wx.setStorageSync('wholePlan', wholePlan)
      that.setData({
        showCollect:true
      })
      setTimeout(()=>{
        that.setData({
          showCollect:false
        })
      },1000)
    }
  })
},

//点击重新生成
create(e)
{
  this.setData({
    showMask:true,
    showMention:true
  })
},

//过渡到重新生成的原因界面
reason(e){
  this.setData({
    showMention:false,
    showReason:true
  })
},

setReason(e)
{
  let index = e.currentTarget.dataset.index;
  getApp().globalData.reCreateReason = this.data.reCreateReasons[index]
  console.log( getApp().globalData.reCreateReason)
  wx.redirectTo({
    url: '/pages/loading/loading',
  })
}

})




