var app = getApp();
Page({
  data:{
    startMoney : 200, // 包邮最低价
    userAddress : true, //是否有用户地址
    freeShipping : false, //是否免运费
    orderArr: null, //订单数组
    unitExpress : 5, //快递单价
    allMoney : '', //总价格
    allWeight: '', //总总量
  },
  onLoad:function(){
      console.log(app.globalData.orderArr, 'user order')
      var orderArr = app.globalData.orderArr;
      var money=0,weight=0,flag = false;
      var startMoney = this.data.startMoney,unitExpress = this.data.unitExpress;
      orderArr.forEach(function (v, i) {
          money+= parseFloat(v.money);
          weight+= parseFloat(v.selectWeight);
      });
      if (money >= startMoney){ // 满200 包邮
          flag = true
      }else{
          money += parseFloat(unitExpress*weight);
      }
      this.setData({
          orderArr : orderArr,
          allMoney: money,
          allWeight: weight,
          freeShipping: flag
      });
  },
  editAddress : function(){  //编辑收货地址
    wx.navigateTo({
      url: '/pages/address/address'
    });
  }
});