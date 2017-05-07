var app = getApp();

Page({
  data:{
    bannerImgUrls : [],
    context : '',
    contextImg : []
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    var _this = this;
    var pageId = options.pageId
    var wilddog = app.getDataRef();
    var query = wilddog.sync().ref('detailData');
    query.on('value',function(snapshot,prev){
        
        var result = snapshot.val();
        console.log(result,'result  result  result');
        _this.setData({
          bannerImgUrls : result[pageId].bannerImg,
          context : result[pageId].context,
          contextImg : result[pageId].contextImg
        });
    });
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
   
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