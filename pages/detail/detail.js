var app = getApp();

Page({
  data:{
    bannerImgUrls : [],
    context : '',
    contextImg : [],
    popshow : false, //pop 层
    weightArr: app.globalData.weightArr,
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    var _this = this;
    var keyId = options.pageId;
    var classify = options.pageType;
    
    wx.showLoading({
      title: '加载中...'
    });
    var wilddog = app.getDataRef();
    var query = wilddog.sync().ref('indexData/'+classify);
    query.on('value',function(snapshot,prev){
        
        var result = snapshot.val()[keyId];
        console.log(result,'result  result  result');
        _this.setData({
          bannerImgUrls : result.bannerImgsrc,
          context : result.content,
          contextImg : result.contentImgsrc
        });
        wx.hideLoading();
    });
  },
  openPop: function(){
    this.setData({
      popshow: true
    });
  },
  closePop: function(){
    this.setData({
      popshow: false
    });
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  },
  goshop : function(){
    wx.navigateTo({
      url: '/pages/order/order'
    });
  }
})