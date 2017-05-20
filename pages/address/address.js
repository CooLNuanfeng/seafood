// pages/address/address.js
Page({
  data:{
      hasAddress: true, //是否有地址
      addressArr : null,
  },
  onLoad:function(options){
      // 页面初始化 options为页面跳转所带来的参数
      var addressArr = getStorageAddress();
      var flag = addressArr.length>0 ? true: false;
      this.setData({
          addressArr: addressArr,
          hasAddress: flag
      });
  },
  
  edit : function(event){
    var newEdit = event.target.dataset.edit ? event.target.dataset.edit : '';
    wx.redirectTo({
      url: '/pages/editaddress/editaddress?edit='+newEdit,
    })
  }
});
function getStorageAddress(){
    try{
        return wx.getStorageSync('addressArr');
    }catch(e){
        console.log(e)
    }
}