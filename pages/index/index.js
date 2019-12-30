import util from "../../tools/util.js";
import {getVoteList, deleteVote} from '../../tools/api.js'
Page({
  ...util,
  data: {
    voteList:[],
    pageIndex: 0,
    pageSize: 10,
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
  //获取投票列表  
  getVoteList: function(){
    let data = {
        "owner_id": getApp().openid,
        "page_index": this.data.pageIndex,
        "page_size": this.data.pageSize
    }
    getVoteList(data, res => {
      if(res.data.code === 0){
        let voteList = res.data.data.list.map(item => {
          item.end_time_text = this.endTimeToText(item.end_time)
          return item
        })
        this.setData({voteList, isLoading: false})
      } else {
        this.toast({title: res.data.message, icon: 'error'})
      }
    })
  },
  editVote: function(ev){
    let index = ev.currentTarget.dataset.index 
    let item = this.data.voteList[index]
    if (item.end_time_text === '投票已截止') {
      this.toast({title: '投票已截止', icon: 'none'})
    } else {
      this.pathTo(ev)
    }
  },
  deleteVote: function(ev){
    let opt = {
      title: "删除确认",
      content: "请确认是否删除该投票",
    }
    this.confirm(opt, result => {
      console.log(result)
      if(result.cancel) return
      let topic_id = ev.currentTarget.dataset.id
      deleteVote({topic_id}, res => {
        if(res.data.code === 0) {
          this.toast({title:'删除成功'})
          this.getVoteList()
        } else {
          this.toast({title: res.data.message, icon: 'error'})
        }
      })
    })
  }
})
