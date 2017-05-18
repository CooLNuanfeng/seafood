// pages/shopcar/shopcar.js
Page({
  data:{
    items: [],
    startX: 0, //开始坐标
    startY: 0,
    allSelected : true, // 全选
    allMoney : 0, //总金额
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      items : [
        {'imgsrc':'/images/listImg/001.jpg','title':'hello world','price':'100.00','weight':'2','money':'200.00','isTouchMove':false,'isSelected':true},
        { 'imgsrc': '/images/listImg/002.jpg', 'title': 'hello world22', 'price': '100.00', 'weight': '4', 'money': '400.00','isTouchMove':false,'isSelected':true}
      ],
      allSelected: true,
      allMoney: this.computerMoney()
    })
  },
  allSelect: function(){
      this.data.items.forEach(function (v, i) {
        v.isSelected = true;
      });
      this.setData({
        items: this.data.items,
        allSelected: true,
        allMoney: this.computerMoney()
      });
  },
  allnoSelect: function(){
      this.data.items.forEach(function (v, i) {
        v.isSelected = false;
      });
      this.setData({
        items: this.data.items,
        allSelected: false,
        allMoney: '0.00'
      });
  },
  // 点击选择
  singSelect:function(e){
    var index = e.currentTarget.dataset.index;//当前索引
    this.data.items.forEach(function (v, i) {
      if(i == index){
        v.isSelected = !v.isSelected;
      }
    });
    this.setData({
      items: this.data.items,
      allSelected: this.checkAllSelect(),
      allMoney : this.computerMoney()
    });
  },
  //全选
  checkAllSelect: function(){
    var flag = true;
    this.data.items.forEach(function (v, i) {
      if(!v.isSelected){
        flag = false;
        return flag;
      }
    });
    return flag;
  },
  //结算金额
  computerMoney: function(){
    var money = 0;
    this.data.items.forEach(function (v, i) {
      if (v.isSelected) {
        money += parseFloat(v.price) * parseFloat(v.weight);
      }
    });
    return money.toFixed(2)
  },
  //手指触摸动作开始 记录起点X坐标
  touchStart: function (e) {
    //开始触摸时 重置所有删除
    this.data.items.forEach(function (v, i) {
      if (v.isTouchMove){//只操作为true的
        v.isTouchMove = false;
      }
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
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
    that.data.items.forEach(function (v, i) {
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
      items: that.data.items
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
    this.data.items.splice(e.currentTarget.dataset.index, 1);
    console.log(this.data.items)
    this.setData({
      items: this.data.items
    });
  }
})