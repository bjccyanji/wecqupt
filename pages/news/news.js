//news.js
//获取应用实例
var app = getApp();
Page({
  data: {
    page: 0,
    list: [
      { id: 0, 'type': 'all', name: '头条', url: 'get_newslist.php' },
      { id: 1, 'type': 'jw', name: '教务公告', url: 'news/jw_list.php' },
      { id: 2, 'type': 'oa', name: 'OA公告', url: 'news/oa_list.php' },
      { id: 3, 'type': 'hy', name: '会议通知', url: 'news/hy_list.php' },
      { id: 4, 'type': 'jz', name: '学术讲座', url: 'news/jz_list.php' },
      { id: 5, 'type': 'new', name: '综合新闻', url: 'news/new_list.php' },
    ],
    'active': {
      id: 0,
      'type': 'all',
      data: [],
      showMore: true,
      remind: '下拉加载更多'
    }
  },
  onLoad: function(){
    app.showLoadToast();
    this.getNewsList(0);
  },
  onReachBottom: function(){
    var _this = this;
    _this.setData({
      'active.remind': '正在加载中'
    });
    if(_this.data.active.showMore){
      app.showLoadToast();
      _this.getNewsList(_this.data.active.id);
    }
  },
  getNewsList: function(tpyeId){
    var _this = this;
    if(_this.data.page >= 5){
      _this.setData({
        'active.showMore': false,
        'active.remind': '没有更多啦'
      });
      wx.hideToast();
    }else{
      //获取资讯列表
      wx.request({
        url: app._server + '/api/' + _this.data.list[tpyeId].url,
        data: {
          page: _this.data.page + 1
        },
        success: function(res){
          if(res.data.status === 200){
            if(res.data.data){
              _this.setData({
                'page': _this.data.page + 1,
                'active.data': _this.data.active.data.concat(res.data.data)
              });
            }else{
              _this.setData({
                'active.showMore': false,
                'active.remind': '没有更多啦'
              });
            }
            wx.hideToast();
          }
        }
      });
    }
  },
  changeFilter: function(e){
    this.setData({
      'active.id': e.target.dataset.id,
      'active.type': e.target.id,
      'active.data': [],
      'active.showMore': true,
      'active.remind': '下拉加载更多',
      'page': 0
    });
    app.showLoadToast();
    this.getNewsList(e.target.dataset.id);
  }
});