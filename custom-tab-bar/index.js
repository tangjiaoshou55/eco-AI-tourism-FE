Component({
  data: {
    
    selected: 0,
    list: [
      {
        "pagePath": "pages/entre/entre",
        
        "text": "首页"
      },
      {
        "pagePath":  "pages/collection/collection",
        "text": "收藏"
      },
      {
        "pagePath": "pages/message/message",
        "text": "消息"
      },
      {
        "pagePath": "pages/personalCenter/personalCenter",
        "text": "个人中心"
      }
    ]
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = "/"+data.path;
      if(this.data.selected==data.index)
      {
        return;
      }else
      {
        this.setData({selected: data.index});
        wx.switchTab({ url });
        console.log(url)
      }
     
    }
  }
});
