var app = getApp();
Page({
  data:{
    shopcarArr: [],
    hasShop : false, //是否有商品
    startX: 0, //开始坐标
    startY: 0,
    allSelected : true, // 全选
    allMoney : 0, //总金额
    hiddenToast : true,
  },
  onShow:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var nowShopcarArr,money=0;
    nowShopcarArr = getStorageData('shopcar');
    if (nowShopcarArr.length>0){
        // for (var i = 0; i < nowShopcarArr.length; i++) {
        //     nowShopcarArr[i]['isTouchMove'] = false;
        //     if (nowShopcarArr[i]['isSelected']===undefined){
        //         nowShopcarArr[i]['isSelected'] = true
        //     }
        // }
        //console.log(this.checkAllSelect(),'nowShopcarArr')
        this.setData({
            hasShop: true,
            shopcarArr: nowShopcarArr,
            allSelected: this.checkAllSelect(),
            allMoney: this.computerMoney()
        });
    }else{
        this.setData({
            hasShop: false,
        });
    }
  },
  toggleSelect: function(){
    if(this.data.allSelected){
        this.allnoSelect()
    }else{
        this.allSelect()
    }
  },
  allSelect: function(){
      var nowShopcarArr = this.data.shopcarArr;
      nowShopcarArr.forEach(function (v, i) {
        v.isSelected = true;
      });
      setStorageData('shopcar', nowShopcarArr);
      this.setData({
          shopcarArr: nowShopcarArr,
          allSelected: true,
          allMoney: this.computerMoney()
      });
  },
  allnoSelect: function(){
      var nowShopcarArr = this.data.shopcarArr;
      nowShopcarArr.forEach(function (v, i) {
        v.isSelected = false;
      });
      setStorageData('shopcar', nowShopcarArr);
      this.setData({
        shopcarArr: nowShopcarArr,
        allSelected: false,
        allMoney: '0.00'
      });
  },
  // 点击选择
  singSelect:function(e){
    var index = e.currentTarget.dataset.index;//当前索引
    var nowShopcarArr = this.data.shopcarArr;
    nowShopcarArr.forEach(function (v, i) {
      if(i == index){
        v.isSelected = !v.isSelected;
      }
    });
    setStorageData('shopcar', nowShopcarArr);
    //console.log(nowShopcarArr,'nowShopcarArr')
    this.setData({
      shopcarArr: nowShopcarArr,
      allSelected: this.checkAllSelect(),
      allMoney : this.computerMoney()
    });
  },
  //全选
  checkAllSelect: function(){
    var flag = true;
    var nowShopcarArr =  getStorageData('shopcar');
    nowShopcarArr.forEach(function (v, i) {
        //console.log(v.isSelected,'selected')
        if(v.isSelected===false){
            flag = false;
            return flag;
        }
    });
    return flag;
  },
  //结算金额
  computerMoney: function(){
    var money = 0;
    var nowShopcarArr = getStorageData('shopcar');
    nowShopcarArr.forEach(function (v, i) {
        //if (v.isSelected || v.isSelected === undefined) {
        if (v.isSelected) {
            money += parseFloat(v.price) * parseFloat(v.selectWeight);
        }
    });
    return money.toFixed(2);
  },
  //手指触摸动作开始 记录起点X坐标
  touchStart: function (e) {
    //开始触摸时 重置所有删除
    this.data.shopcarArr.forEach(function (v, i) {
      if (v.isTouchMove){//只操作为true的
        v.isTouchMove = false;
      }
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      shopcarArr: this.data.shopcarArr
    })
  },
  //滑动事件处理
  touchMove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.shopcarArr.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
        shopcarArr: that.data.shopcarArr
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
      var nowShopcarArr = this.data.shopcarArr;
      nowShopcarArr.splice(e.currentTarget.dataset.index, 1);
      //console.log(nowShopcarArr)
      setStorageData('shopcar', nowShopcarArr);
      if (nowShopcarArr.length>0){
          this.setData({
              shopcarArr: nowShopcarArr,
              allSelected: this.checkAllSelect(),
              allMoney: this.computerMoney()
          });
      }else{
          this.setData({
              hasShop: false
          });
      }
      
  },
  showToast: function (str) {
      var _this = this;
      var timer;
      if (this.data.hiddenToast) {
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
  goIndex: function(){
      wx.switchTab({
          url: '/pages/index/index'
      });
  },
  goOrder: function(){
      if(this.data.allMoney!=0){
          app.globalData.orderArr.length = 0; //重置
          var nowShopcarArr = getStorageData('shopcar');
          nowShopcarArr.forEach(function (v, i) {
              if (v.isSelected) {
                  var json = {
                      keyId: v.keyId,
                      title: v.title,
                      price: v.price,
                      imgsrc: v.imgsrc,
                      limitArea: v.limitArea,
                      selectWeight: v.selectWeight,
                      money: v.money
                  };
                  app.globalData.orderArr.push(json);
              }
          });
          wx.navigateTo({
              url: '/pages/order/order',
          });
      }
  }
});

function setStorageData(key,arr){
    try {
        wx.setStorageSync(key, arr);
    } catch (e) {
        this.showToast('操作失败，请重试');
        console.log(e);
    }
}
function getStorageData(key){
    var obj;
    try {
        obj = wx.getStorageSync(key);
    } catch (e) {
        console.log(e);
    }
    return obj;
}