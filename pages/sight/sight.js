// pages/sight/sight.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choosenCity: "",
    choosenSight: "",
    sightAddr: "",
    sightDesc: "",
    sightScore: '',
    sightRate: '',
    openTime: '',
    price:'',
    tourInfo:'',
    sightPicture1:'',
    sightPicture2:'',
    sightPicture3:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let msg =JSON.parse(options.data)
    console.log(msg)
    this.setData({
      choosenCity: msg.choosenCity,
      choosenSight: msg.choosenSight,
      sightAddr: msg.sightAddr,
      sightDesc: msg.sightDesc,
      sightScore:msg.sightScore,
      sightRate: msg.sightRate,
      openTime: msg.openTime,
      price: msg.price,
      tourInfo:msg.tourInfo,
      sightPicture1:msg.sightPicture1,
      sightPicture2:msg.sightPicture2,
      sightPicture3:msg.sightPicture3
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

  scrolling(e) {
    if(e.detail.scrollTop>130){
      if(this.data.hasScroll==false) {
        this.scrollToTop()
      }
    } else {
      if(this.data.hasScroll==true)
      this.scrollBack()
    }
  },
})