var app = getApp();
Page({
  data: {
    nowPage : 'user',
    avatarUrl : '',
    nickName : ''
  },
  onLoad: function () {
    //调用应用实例的方法获取全局数据
    var userInfo = app.globalData.userInfo;
    this.setData({
      avatarUrl : userInfo.avatarUrl,
      nickName : userInfo.nickName,
    });
  },
  orderdetail : function(ev){
    var orderId = ev.target.dataset.orderdetail;
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?orderid='+orderId
    });
  },
  gofeedback : function(){
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    });
  },
  goAboutus: function(){
      wx.navigateTo({
          url: '/pages/about/about'
      });
  }
})