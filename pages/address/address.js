// pages/address/address.js
Page({
  data:{
      hasAddress: true, //是否有地址
      addressArr : null,
  },
  onShow:function(options){
      // 页面初始化 options为页面跳转所带来的参数
      var addressArr = getStorageAddress();
      var flag = addressArr.length>0 ? true: false;
      this.setData({
          addressArr: addressArr,
          hasAddress: flag
      });
  },
  
  edit : function(e){
        var editId = e.target.dataset.edit ? e.target.dataset.edit : '';
        wx.navigateTo({
            url: '/pages/editaddress/editaddress?edit=' + editId,
        });
  },
  selectAddress: function(e){
      var addressArr = getStorageAddress();
      var editId = e.currentTarget.dataset.edit;
      addressArr.forEach(function(v,i){
          if (v.id == editId){
              v.isDefault = true
          }else{
              v.isDefault = false
          }
      });
      
      setStorageAddress(addressArr);
      wx.navigateBack({
          url: '/pages/order/order',
      });
  }
});
function getStorageAddress(){
    try{
        return wx.getStorageSync('addressArr');
    }catch(e){
        console.log(e)
    }
}
function setStorageAddress(addressArr) {
    try {
        wx.setStorageSync('addressArr', addressArr);
    } catch (e) {
        console.log(e);
    }
}