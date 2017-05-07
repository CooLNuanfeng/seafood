Page({
  data:{
    userAddress : true, //是否有用户地址
    freeShipping : false, //是否免运费
    unitPrice : 100, //商品单价
    unitExpress : 5, //快递单价
    weight : '2',  // 购买重量
    allPrice : '', //总价格
    //weightArr: ['0.5kg','1kg','1.5kg','2kg','2.5kg','3kg','3.5kg','4kg','4.5kg','5kg','5.5kg','6kg','6.5kg','7kg','7.5kg','8kg','8.5kg','9kg','9.5kg','10kg'],
    weightArr: ['0.5','1','1.5','2','2.5','3','3.5','4','4.5','5','5.5','6','6.5','7','7.5','8','8.5','9','9.5','10'],
    expressArr : ['顺丰快递'],
    express : '顺丰快递',
    today : GetDateStr(),
    endTime : GetDateStr(5),
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
    var shopWeight = this.data.weight,
        unitExpress = this.data.unitExpress,
        unitPrice = this.data.unitPrice;
    if(shopWeight > 2 ){
       this.setData({
         allPrice : unitPrice * shopWeight
       });
    }else{
      this.setData({
         allPrice : (unitPrice * shopWeight + shopWeight * unitExpress)
      });
    }

  },
  bindSendChange : function(e){  // 修改快递方式
    this.setData({
      express: this.data.expressArr[e.detail.value]
    })
  },
  bindDateChange : function(e){ // 修改日期
    this.setData({
      today : e.detail.value
    })
  },
  editAddress : function(){  //编辑收货地址
    wx.navigateTo({
      url: '/pages/address/address'
    });
  },
  bindWeightChange : function(e){ //修改重量
    var shopWeight = this.data.weightArr[e.detail.value];
    var freeShippingFlag = shopWeight > 2 ? true : false;
    var unitPrice = this.data.unitPrice,
        unitExpress = this.data.unitExpress;

    var sumPrice = freeShippingFlag ? (unitPrice * shopWeight) : (unitPrice * shopWeight + shopWeight*unitExpress);
    this.setData({
      weight : shopWeight,
      freeShipping : freeShippingFlag,
      allPrice : sumPrice
    })
  }
});


function GetDateStr(AddDayCount){
    var dd = new Date();
    if(AddDayCount){
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
    }
    var y = dd.getFullYear();
    var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0
    var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate(); //获取当前几号，不足10补0
    return y+"-"+m+"-"+d;
}
