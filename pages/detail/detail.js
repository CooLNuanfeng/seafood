var app = getApp();
Page({
  data:{
    keyId: '',
    imgsrc : '',
    title: '',
    bannerImgUrls : [],
    context : '',
    contextImg : [],
    price : '0.00', //单价
    money : '0.00', //总价
    selectWeight: '', //选择购买重量
    limitArea: 0, // 是否限制省内 0省内 1全国
    isBuy: true,  //添加购物车or直接购买
    weightArr: [], //可选的重量数组
    popshow: false, //pop 层
    animate: true,  //样式控制只init 时添加
    toast : '', //toast 文本
    hiddenToast: true, //toast 控制
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    var _this = this;
    var keyId = options.pageId;
    var classify = options.pageType;
    
    wx.showLoading({
      title: '加载中...'
    });

    var weightArr = app.globalData.weightArr;
    var newWeightArr = [];
    var weightArrLen = weightArr.length;
    for(var i=0;i<weightArrLen;i++){
      var json ={};
      json.val = weightArr[i];
      json.selected = false;
      newWeightArr.push(json);
    }
    

    var wilddog = app.getDataRef();
    var query = wilddog.sync().ref('indexData/'+classify);
    query.on('value',function(snapshot,prev){
        
        var result = snapshot.val()[keyId];
        console.log(result,'result  result  result');
        _this.setData({
            keyId : keyId,
            title: result.title,
            price: result.price,
            imgsrc : result.imgsrc,
            bannerImgUrls : result.bannerImgsrc,
            context : result.content,
            contextImg : result.contentImgsrc,
            limitArea : result.limitArea,
            weightArr: newWeightArr
        });
        wx.hideLoading();
    });
  },
  openPop: function(){
    this.setData({
      popshow: true,
      animate: false,      
    });
  },
  closePop: function(){
    this.setData({
      popshow: false
    });
  },
  //添加购物车
  addshop: function(){
    this.openPop();
    this.setData({
        isBuy: false,
    });
  },
  // 确定加入购物车
  sureAddshop: function(){
      if (!this.data.selectWeight){
          this.showToast('请选择购买重量');
          return;
      }
      
      this.addStorage();
      wx.showToast({
          title: '已加入购物车',
      });
      this.closePop();
  },
  selectWeight: function(e){
      var selectWeight = e.currentTarget.dataset.weight;
      var weightArr = this.data.weightArr;
      var money = this.data.money;
      var price = parseFloat(this.data.price);
      
      for(var i=0; i<weightArr.length;i++){
        if(selectWeight == weightArr[i].val){
            if(!weightArr[i].selected){
                weightArr[i].selected = true;
                money = price * selectWeight;
            }else{
                weightArr[i].selected = false;
                selectWeight = '';
                money = '0.00';
                
            }
        }else{
            weightArr[i].selected = false;
        }
      }
      this.setData({
          weightArr : weightArr,
          selectWeight : selectWeight,
          money : money
      });
  },
  //立即购买
  goshop: function () {
      if (!this.data.selectWeight) {
          this.openPop();
          this.setData({
              isBuy: true,
          });
      } else {
          app.globalData.orderArr.length = 0; //重置
          var json = {
              keyId: this.data.keyId,
              title: this.data.title,
              price: this.data.price,
              imgsrc: this.data.imgsrc,
              limitArea: this.data.limitArea,
              selectWeight: this.data.selectWeight,
              money : this.data.money
          };
          app.globalData.orderArr.push(json);
          wx.navigateTo({
              url: '/pages/order/order'
          });
      }
  },
  //去首页
  goIndex: function(){
      wx.switchTab({
          url: '/pages/index/index'
      });
  },
  goShopcar: function(){
      wx.switchTab({
          url: '/pages/shopcar/shopcar'
      });
  },
  showToast: function(str){
    var _this = this;
    var timer;
    if(this.data.hiddenToast){
        this.setData({
            hiddenToast: false,
            toast: str
        });
        clearTimeout(timer);
        timer = setTimeout(function () {
            clearTimeout(timer);
            _this.setData({
                hiddenToast: true,
                toast: ''
            });
        }, 3000);
    }
    
  },
  //添加数据到本地存储
  addStorage: function(){
      var shopcarArr = wx.getStorageSync('shopcar') ? wx.getStorageSync('shopcar') : [];
      var json = {
          keyId : this.data.keyId,
          title: this.data.title,
          price: this.data.price,
          imgsrc: this.data.imgsrc,
          limitArea: this.data.limitArea,
          money: this.data.money,
          selectWeight: this.data.selectWeight,
          isTouchMove : false,
          isSelected : true
      };
      shopcarArr.push(json);
      try {
          wx.setStorageSync('shopcar', shopcarArr);
      } catch (e) {
          this.showToast('添加购物车失败，请重试');
          console.log(e);
      }
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  },
})