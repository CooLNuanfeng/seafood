//index.js
//获取应用实例
var app = getApp();
var wilddog = app.getDataRef();
Page({
  data: {
    nowPage : 'fish',
    nowName : '鱼类',
    classify : [
      {'src' : '../../images/icon/fish.png','name':'鱼类','srcActive': '../../images/icon/fish_active.png','page' :'fish'},
      {'src' : '../../images/icon/shrimpcrabs.png','name':'虾蟹','srcActive': '../../images/icon/shrimpcrabs_active.png','page' :'shrimpcrabs'},
      {'src' : '../../images/icon/shellfish.png','name':'参贝','srcActive': '../../images/icon/shellfish_active.png','page' :'shellfish'},
      {'src' : '../../images/icon/dry.png','name':'干货','srcActive': '../../images/icon/dry_active.png','page' :'dry'},
      {'src' : '../../images/icon/other.png','name':'其他','srcActive': '../../images/icon/other_active.png','page' :'other'}
    ],
    listData : [],
    // listData : [
    //   {
    //     id : '1',
    //     title : 'hello world',
    //     price : '50',
    //     description : 'lerom sheo doahod lis peo kaola kalie laons kdshi ds.',
    //     tag : '热卖',
    //     imgsrc : '../../images/listImg/001.jpg',
    //     likeCount: '200',
    //     shopCount : '120'
    //   },
    //   {
    //     id : '2',
    //     title : 'hello node',
    //     price : '40',
    //     description : 'lerom sheo doahod lis peo kaola kalie laons kdshi ds.',
    //     tag : '推荐',
    //     imgsrc : '../../images/listImg/001.jpg',
    //     likeCount: '200',
    //     shopCount : '120'
    //   },
    //   {
    //     id : '3',
    //     title : 'hello samll tool',
    //     price : '20',
    //     description : 'lerom sheo doahod lis peo kaola kalie laons kdshi ds.',
    //     imgsrc : '../../images/listImg/001.jpg',
    //     likeCount: '200',
    //     shopCount : '120'
    //   }
    // ]
  },
  onLoad: function () {
    var _this = this;
   
    var query = wilddog.sync().ref('indexData/fish');
    query.on('value',function(snapshot,prev){
        //console.log(snapshot.val());
        var data = snapshot.val();
        console.log(data,'data');
        _this.setData({
          listData : data
        })
    });
   
  },
  goPage : function(event){
    var nowPage = event.currentTarget.dataset.page;
    var nameJson = {
      'fish' : '鱼类',
      'shrimpcrabs' : '虾蟹',
      'shellfish' : '参贝',
      'dry' : '干货',
      'other' : '其他'
    };
    var _this = this;

    var query = wilddog.sync().ref('indexData/'+nowPage);
    query.on('value',function(snapshot,prev){
        //console.log(snapshot.val());
        var data = snapshot.val();
        console.log(data,'data');
        _this.setData({
          nowPage : nowPage,
          nowName : nameJson[nowPage],
          listData : data
        })
    });
  },
  listTap : function(event){
      console.log(event);
      var pageId = event.currentTarget.dataset.keyid;
      var pageType = event.currentTarget.dataset.type;
      wx.navigateTo({
        url: '/pages/detail/detail?pageId='+pageId+'&pageType='+pageType
      });
  }
})
