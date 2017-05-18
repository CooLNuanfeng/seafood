//app.js
var wilddog = require('/utils/wilddog-weapp-all');

var config = {
    syncURL: 'https://wxappnf.wilddogio.com',
    authDomain: 'wxappnf.wilddog.com'
};

App({
  onLaunch: function () {
    var self = this;
    wilddog.initializeApp(config);


    //这个地方使用野狗登录微信小程序的方法,可以获得微信返回的openId,用户名称等等信息,这些信息会存在野狗的控制台的身份人认证部分。
    wilddog.auth().signInWeapp().then(function(user){
      console.log(user);
      self.globalData.userInfo = {
        nickName : user.displayName,
        avatarUrl : user.photoURL
      }
    }).catch(function(err){
      console.log(err,'认证异常');
    });

  },
  getDataRef:function(){
    return wilddog;
  },
  globalData : {
    userInfo : null,
    weightArr: ['0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10']
  }
});