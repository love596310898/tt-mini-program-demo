Page({
  data: {
    voteLis:[],
    isLoading: false,
  },
  onLoad: function(){
    this.setData({isLoading: true})
  },
  onShow: function () {
    this.getUserInfo()
  },
  //获取用户信息
  getUserInfo: function(){
    tt.login({
      success: res=> {
        tt.request({
          url: 'https://developer.toutiao.com/api/apps/jscode2session',
          method: 'GET',
          data: {
            appid: 'tt06af70129985384f',
            secret: '108c2a063580e70d99089db9f8d0128b1f4fc461',
            code: res.code
          },
          success: res => {
            let app = getApp() 
            app.session_key = res.data.session_key
            app.openid = res.data.openid
            this.getVoteList()
          }
        });
      },
      fail: res=> {
        console.log(`login调用失败`);
      }
    })
  },
})
