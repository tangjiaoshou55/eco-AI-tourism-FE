// entre.js，小程序入口逻辑
Page(
  {
    data:
    {   

        inputName:'',//从输入栏输入的内容
        cityname:"点击输入",
        showPlane:true,
        showArrow:false,
        showText :true,
        loadcities:[],
        scrollLeft1: 0,
       // 标题属性
    titleHeight: 58.79, 
    titleTop: 254.79,
    fontSize: 45.93,
    //备份标题属性
    o_titleHeight: 58.79, 
    o_titleTop: 254.79,
    o_fontSize: 45.93,
    // 输入框属性
    inputTop: 330.6,
    //备份输入框属性
    o_inputTop: 330.6,
    // 小飞机属性
    planeWidth: 119.42,
    planeTop: 186.84,
    planeHeight: 59.71,
    planeLeft : 101.26, 
    // 可拉伸部分属性
    contentTop: 420, // 初始顶部位置
    contentHeight: 201, // 初始高度
    scrollTop1: 0,//滚动条初始位置
    //备份可拉伸数据
    o_contentTop: 410, 
    o_contentHeight: 221,
    
    // 所有调整属性
    minPlaneWidth: 50, // 最小飞机宽度
    minPlaneHeight: 25, // 最小飞机高度
    minPlaneLeft: 170,
    minPlaneTop: 30, // 最小飞机顶部位置
    minTitleHeight: 40, // 最小高度
    minInputTop: 100, // 最小输入框顶部位置
    minFontSize: 20, // 最小字体大小
    minContentTop: 180, // 最小顶部位置
    maxContentHeight: 420.2, // 最大高度
    //选定的城市部分
    notSelected: true,//是否显示scroll
    selectedCity:'',
    selectedTag:'',
    allSelected:false,//是不是全部选定了
    animationClass1: '',//可拖动部分动画效果
    animationClass2: '',//普通视图动画效果
    //展示城市列表
    categoriesArry:
    [],
    // 这是关联搜索名，不要删
    searchCollect:[],
     //用于确定是否达到最大高度，开启滑动
     highestYet:false,
     //用于确定当前关联搜索的高度highest
     relationHeight:'',
     //决定是否展示关联搜索
     searching:false,
    },


    onLoad: function() {
   
      
    },

 
    onShow() {
      let that = this;
    
      //设定Bar栏位需要的部分
      if (typeof that.getTabBar === 'function' && that.getTabBar()) {
        that.getTabBar().setData({
          selected: 0
        });
      }
    
      //每次切换页面切回来要还原
      that.setData({
        showText: true,
        showPlane: true,
        scrollTop1: 0,
        scrollLeft1: 0,
        titleHeight: this.data.o_titleHeight,
        titleTop: this.data.o_titleTop,
        fontSize: this.data.o_fontSize,
        inputTop: this.data.o_inputTop,
        planeWidth: 119.42,
        planeTop: 186.84,
        planeHeight: 59.71,
        planeLeft: 101.26,
        contentHeight: this.data.o_contentHeight,
        contentTop: this.data.o_contentTop,
      });
    
      //读取categor用表格
      wx.request({
        url: 'http://47.101.220.93:7876/tag',
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
        },
        success(res) {
          let aligeCity = res.data.data;   
          console.log(aligeCity)
    
          // 使用 Promise.all 处理所有的异步请求
          let promises = aligeCity.map((category) => {
            return new Promise((resolve, reject) => {
              wx.request({
                url: 'http://47.101.220.93:7876/city',
                method: 'GET',
                data: {
                  tagId: category.tagId
                },
                header: {
                  'Content-Type': 'application/json',
                },
                success(res) {
                  category.cities = res.data.data;
                  resolve();
                },
                fail(err) {
                  reject(err);
                }
              });
            });
          });
    
          // 所有请求完成后更新数据
          Promise.all(promises).then(() => {
            that.setData({
              categoriesArry: aligeCity
            });
          }).catch((err) => {
            console.error(err);
          });
        },
        fail(error) {
          console.error(error);
        }
      });
    },
    


  
 
//开始输入时还原信息
    startInput(e)
    {
        // 恢复原状动画
        this.setData({
          showPlane:true,
          scrollTop1: 0,
          scrollLeft1:0,
          titleHeight: this.data.o_titleHeight, 
          titleTop: this.data.o_titleTop,
          fontSize: this.data.o_fontSize,
          inputTop: this.data.o_inputTop,
          planeWidth: 119.42,
          planeTop: 186.84,
          planeHeight: 59.71,
          planeLeft : 101.26, 
          contentHeight:this.data.o_contentHeight,
          contentTop:this.data.o_contentTop,
          cityname :'',
        });
        //允许上次搜索的参与参加
        let input = e.detail.value
        let that =this
        //防止-1等异常情况出现
        if(input.length>=1)
        {
          wx.request({
            url: 'http://47.101.220.93:7876/city',
            method:'GET',
            data:{cityName:input},
            header: 
            {
               'Content-Type': 'application/json', // 告诉服务器实际发送的数据类型   
            },
            success(res)
            {
              //处理空值现象
              if(res.data.data.length>=1)
              {
                  //得到关联信息
              that.setData({
                searchCollect :res.data.data
              })
              //根据信息长度设定框体大小
              if(that.data.searchCollect.length>6)
              {
                that.setData({
                  relationHeight:636,
                  highestYet:true,
                  searching:true
                })
              }else{
                that.setData({
                  relationHeight:that.data.searchCollect.length*106,
                  searching:true,
                })
              }
  
              }
            
            },
            fail(error)
            {
            }
          })
        }else
        {
          that.setData({
            searching:false
          })
        }
    },

  //输入中进行联想式生成
    makingInput(e)
    {
      let input = e.detail.value
      let that =this
      //防止-1等异常情况出现
      if(input.length>=1)
      {
        wx.request({
          url: 'http://47.101.220.93:7876/city',
          method:'GET',
          data:{cityName:input},
          header: 
          {
             'Content-Type': 'application/json', // 告诉服务器实际发送的数据类型   
          },
          success(res)
          {
            //处理空值现象
            if(res.data.data.length>=1)
            {
                //得到关联信息
            that.setData({
              searchCollect :res.data.data
            })
            //根据信息长度设定框体大小
            if(that.data.searchCollect.length>6)
            {
              that.setData({
                relationHeight:636,
                highestYet:true,
                searching:true
              })
            }else{
              that.setData({
                relationHeight:that.data.searchCollect.length*106,
                searching:true,
              })
            }

            }
          
          },
          fail(error)
          {
          }
        })
      }else
      {
        that.setData({
          searching:false
        })
      }
    },
//点击联想式搜索结果后
    choosen(e)
    {

      let info =e.currentTarget.dataset.text
      this.setData({
        inputName:info
      })
      this.finishedInput({detail: {value: info}});
    },

    //完成输入时的动作
    finishedInput(event)
    {
      // 恢复原状动画
     
      this.setData({
        searching:false,
       });
      const that =this;
      const inputValue = event.detail.value;
      console.log(inputValue)
      //检测是否输入有效内容，若输入内容有效则将其传入后端
      if(inputValue.length>0)
      {
       wx.request({
        url: 'http://47.101.220.93:7876/city',
        method:'GET',
        data:{cityName:inputValue},
        header: 
        {
           'Content-Type': 'application/json', // 告诉服务器实际发送的数据类型   
        },
        //后端查询成功，返回结果
        success(res)
        {
          if(res.data.data.length>0)
          {
            //先切换动画
            if(that.data.allSelected)
            {
              that.transViewFromView();
            }else
            {
              that.hideViewForScroll();
            }
            setTimeout(()=>{
              //将获得的信息返回globadata和页面设置
             getApp().globalData.selectedCity = res.data.data[0].cityName
             getApp().globalData.selectedTag = res.data.data[0].tags[0].tagName
             that.setData
           ({
             inputName:getApp().globalData.selectedCity,
             selectedCity:getApp().globalData.selectedCity,
             selectedTag: getApp().globalData.selectedTag,
             showArrow : true
           });

            },500)//优化的动画
             
           //查询失败，未发现对应城市
          }else
          {
            if(that.data.allSelected)
            {
              that.transViewFromView();
            }else
            {
              that.hideViewForScroll();
            }
            //同上方部分一样的动画优化
            setTimeout(()=>{
              that.setData
              ({
                cityname :"您输入的城市未能查询到，请重新输入",
                showArrow : false,
                selectedCity: "未知",
                selectedTag:"查询失败",
              })
            },500)
            
          }
          
        },
        //服务器链接失败
        fail(error)
        {
          if(that.data.allSelected)
          {
            that.transViewFromView();
          }else
          {
            that.hideViewForScroll();
          }

          setTimeout(()=>{
            that.setData({
              showArrow : false,
              cityname :"服务器失效，请稍后再试",
              selectedCity: "未知",
              selectedTag:"查询失败",
            });
          },500)
           
         
        }
       })
      
      }else
      {
        this.setData
        ({
          cityname :"点击输入",
          showArrow : false
        });
        // 如果切换过成城市概览的话就切回来
        if(that.data.allSelected)
        {
          this.hideViewForView();
        }
      }
      
    },

    //中途突然关闭键盘
    loseFocus(e)
    {
      let input = e.detail.value
     
      this.setData({
        searching:false
      })
       // 如果切换过成城市概览的话就切回来
       if(this.data.allSelected&&input.length<=0)
       {
         this.hideViewForView();
       }
    },

    //处理随机城市生成
    onButtonClickForRandom(event)
    {
      //恢复原状
      this.setData({
        showPlane:true,
        scrollTop1: 0,
        scrollLeft1:0,
        titleHeight: this.data.o_titleHeight, 
        titleTop: this.data.o_titleTop,
        fontSize: this.data.o_fontSize,
        inputTop: this.data.o_inputTop,
        planeWidth: 119.42,
        planeTop: 186.84,
        planeHeight: 59.71,
        planeLeft : 101.26, 
        contentHeight:this.data.o_contentHeight,
        contentTop:this.data.o_contentTop,
       });
    
    //处理具体信息
     let that =this;
      wx.request({
        url:  "http://47.101.220.93:7876/city/random",
        method:'GET',
        header: 
        {
           'Content-Type': 'application/json', // 告诉服务器实际发送的数据类型   
        },
        success(res)
        {
          //如果访问成功
          if(res.data.code==200)
          {
            let cities = res.data.data;
            that.setData({
              inputName:cities.cityName,
            })
            wx.request({
                url: 'http://47.101.220.93:7876/city',
                method:'GET',
                data:{cityName:cities.cityName},
                header: 
                {
                   'Content-Type': 'application/json', // 告诉服务器实际发送的数据类型   
                },
                //后端查询成功，返回结果
                success(res)
                {
                  if(that.data.allSelected)
                  {
                    that.transViewFromView();
                  }else
                  {
                    that.hideViewForScroll();
                  }
                  setTimeout(()=>{
                     getApp().globalData.selectedCity = res.data.data[0].cityName
                     getApp().globalData.selectedTag = res.data.data[0].tags[0].tagName
                     console.log(getApp().globalData.selectedTag )
                     that.setData
                   ({
                     inputName:res.data.data[0].cityName,
                     selectedCity:getApp().globalData.selectedCity,
                     selectedTag: getApp().globalData.selectedTag,
                     showArrow : true
                   });
                  
                  },500)
                 
                },
                //服务器链接失败
                fail(error)
                {
                  if(that.data.allSelected)
                  {
                    that.transViewFromView();
                  }else
                  {
                    that.hideViewForScroll();
                  }
                  setTimeout(()=>{
                    that.setData({
                      showArrow : false,
                      cityname :"服务器失效，请稍后再试",
                      selectedCity: "未知",
                      selectedTag:"查询失败",
                    })
                  },500)               
                }
            })
          }else
          {
            if(that.data.allSelected)
            {
              that.transViewFromView();
            }else
            {
             that.hideViewForScroll();
            }              
            setTimeout(()=>{
              that.setData({
                showArrow : false,
                cityname :"服务器失效，请稍后再试",
                selectedCity: "未知",
                selectedTag:"查询失败",
              });
            },500)
           
          }      
        },
        fail(error)
        {
          that.hideViewForScroll();
          setTimeout(()=>{
            that.setData({
              cityname:"城市获取失败，请稍后再试",
              showArrow :false,
              selectedCity: "未知",
              selectedTag:"查询失败",
            })
          },500)
        }
      });   
    },
   
    scrolling(e) {
      const scrollTop = e.detail.scrollTop;
      const maxScroll = 200; // 调整滚动距离阈值
  
      // 计算新的高度、宽度、顶部位置和字体大小
      //标题部分
      const newTitleTop = Math.max(this.data.minTitleHeight, this.data.titleTop - (scrollTop / maxScroll) * (this.data.titleTop - this.data.minTitleHeight));
      const newFontSize = Math.max(this.data.minFontSize, this.data.fontSize - (scrollTop / maxScroll) * (this.data.fontSize - this.data.minFontSize));
      //飞机部分
      const newPlaneWidth = Math.max(this.data.minPlaneWidth, this.data.planeWidth - (scrollTop / maxScroll) * (this.data.planeWidth - this.data.minPlaneWidth));
      const newPlaneLeft =Math.max(this.data.minPlaneLeft, this.data.planeLeft - (scrollTop / maxScroll) *(this.data.planeLeft - this.minPlaneLeft));
      const newPlaneHeight = Math.max(this.data.minPlaneHeight, this.data.planeHeight - (scrollTop / maxScroll) * (this.data.planeHeight - this.data.minPlaneHeight));
      const newPlaneTop = Math.max(this.data.minPlaneTop, this.data.planeTop - (scrollTop / maxScroll) * (this.data.planeTop - this.data.minPlaneTop));
      //输入框部分
      const newInputTop = Math.max(this.data.minInputTop, this.data.inputTop - (scrollTop / maxScroll) * (this.data.inputTop - this.data.minInputTop));
      //内容栏部分
      const newContentTop = Math.max(this.data.minContentTop, this.data.contentTop - (scrollTop / maxScroll) * (this.data.contentTop  - this.data.minContentTop));
      const newContentHeight = Math.min(this.data.maxContentHeight,this.data.contentHeight+(scrollTop / maxScroll)*(this.data.maxContentHeight-this.data.contentHeight));
    
      // 更新数据 
      this.setData({
       
        titleTop: newTitleTop,
        planeWidth: newPlaneWidth,
        planeHeight: newPlaneHeight,
        planeTop: newPlaneTop,
        inputTop: newInputTop,
        fontSize: newFontSize,
        contentTop: newContentTop,
        contentHeight:newContentHeight,
      });
 
     if(scrollTop>1)
     {
       this.setData
       ({
         showPlane:false,
         showText: false,

       });
     }
    },
  


   
    onButtonClickForSearch(event)
    {
      wx.navigateTo({
        url: '/pages/makePlan1/makePlan1',
      })
    },

     // 调用这个方法来隐藏视图
  hideViewForScroll() {
    this.setData({
      animationClass1: 'fade-out',
    });

    // 在动画结束后隐藏视图
    setTimeout(() => {
        this.setData({
          notSelected: false,
          allSelected:true,
          animationClass1: '',
          animationClass2:'fade-in',
          showText:false
        });
        setTimeout(() => {
          this.setData({
            animationClass2: '',
          });
      }, 500);
    }, 500); // 动画时长 0.5 秒
  },
  
  // 用于隐藏view
  hideViewForView() {
    this.setData({
      animationClass2: 'fade-out',
    });
    // 在动画结束后隐藏视图
    setTimeout(() => {
        this.setData({
          notSelected: true,
          allSelected:false,
          animationClass2: '',
          animationClass1:'fade-in',
          showText:true
        });
        setTimeout(() => {
          this.setData({
            animationClass1: '',
          });
      }, 500);
    }, 500); // 动画时长 0.5 秒
  },
 
  // 由快捷路书转到快捷路书的动画
  transViewFromView() {
    this.setData({
      animationClass2: 'fade-out',
    });

    // 在动画结束后隐藏视图
    setTimeout(() => {
        this.setData({
          animationClass2:'fade-in',
          showText:false
        })
        setTimeout(() => {
          this.setData({
            animationClass2: '',
          });
      }, 500);
    }, 500); // 动画时长 0.5 秒
  },
  
  
  })

