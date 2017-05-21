var app = getApp();
Page({
  data:{
      username: '',
      userPhone:'',
      regionName: '',
      userAddress: '',
      startMoney : 200, // 包邮最低价
      hasAddress : false, //是否有用户地址
      freeShipping : false, //是否免运费
      orderArr: null, //订单数组
      unitExpress : 5, //快递单价
      allMoney : '', //总价格
      allWeight: '', //总总量
  },
  onShow:function(){
      var userAddress = '', regionName = '', username = '', userPhone = '',hasAddress=false;
      var addressArr = getStorageAddress();
      if(addressArr.length > 0){
          hasAddress = true;
          addressArr.forEach(function(v,i){
             if(v.isDefault){
                 userAddress = v.userAddress;
                 regionName = v.regionName;
                 username = v.username;
                 userPhone = v.userPhone;
             }
          });
      }else{
          hasAddress = false;
      }


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
          username: username,
          userPhone: userPhone,
          regionName: regionName,
          userAddress: userAddress,
          orderArr : orderArr,
          allMoney: money,
          allWeight: weight,
          freeShipping: flag,
          hasAddress: hasAddress
      });
  },
  editAddress : function(){  //编辑收货地址
    wx.navigateTo({
      url: '/pages/address/address'
    });
  }
});

function getStorageAddress() {
    try {
        return wx.getStorageSync('addressArr');
    } catch (e) {
        console.log(e)
    }
}