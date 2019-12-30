import util from "../../tools/util.js";
import {getDetail, saveResult} from '../../tools/api.js'
Page({
  ...util,
  data: {
    isLoading: false,
    description: 1,
    isExtended: false,
    isView: true,
    vote: null,
    five: 0,
    isFive: false,
    fiveTimer: null,
    thirty: 0,
    isThirty: false,
    thirtyTimer: null
  },
  onLoad: function (options) {
    this.changeTitle('详情')
    if(options.type === 'create')  this.setData({isView: false})
    this.getVoteDetail(options.id)
  },
  onShow: function(){
    this.setData({isLoading: true})
  },
  //转发
  onShareAppMessage (opt) {
    console.log(`/pages/detail/detail?id=${this.data.vote.id}&type=view`)
    return {
      path: `/pages/detail/detail?id=${this.data.vote.id}&type=view`,
      templateId: '1ee74c0e6e9b545a2h',
      success () {
        console.log('转发发布器已调起成功');
      },
      fail () {
        console.log('转发发布器调起失败');
      }
    }
  },
  //描述展开收起
  changeExtend: function(){
    this.setData({isExtended: !this.data.isExtended})
  },
  //限制点击频率
  limitCliceOnThirty: function(){
    this.data.thirty++
    let thirty = this.data.thirty, isThirty = this.data.isThirty
    if(!isThirty){
      this.data.thirtyTimer = setTimeout(()=>{
         this.data.isThirty = false
         this.data.thirty = 0
      }, 30000)
      this.data.isThirty = true
      return true
    } else if(thirty <= 30) {
      return true
    } else if(thirty === 31){
      clearTimeout(this.data.thirtyTimer)
      console.log(Date.now())
      setTimeout( ()=>{
        this.data.isThirty = false
        this.data.thirty = 0
        console.log(Date.now())
      }, 10000)
      this.toast({title: '请稍后操作', icon: 'none'})
      return false
    } else {
      this.toast({title: '请稍后操作', icon: 'none'})
      return false
    }
  },
  //限制点击频率
  limitClickOnFive: function(){
    this.data.five++
    let five = this.data.five,  isFive = this.data.isFive
    if(!isFive){
      this.data.fiveTimer = setTimeout(()=>{
         this.data.isFive = false
         this.data.five = 0
      }, 2000)
       this.data.isFive = true
      return true
    } else if(five <= 5) {
      return true
    } else if(five === 6){
      clearTimeout(this.data.fiveTimer)
      setTimeout( ()=>{
        this.data.isFive = false
        this.data.five = 0
      }, 5000)
      this.toast({title: '请稍后操作', icon: 'none'})
      return false
    } else {
      this.toast({title: '请稍后操作', icon: 'none'})
      return false
    }
  },
  //点击选项时
  clickVote: function(ev){
    if(!this.limitClickOnFive() || !this.limitCliceOnThirty()) return
    let index=ev.currentTarget.dataset.index
    let vote = this.data.vote
     vote.options[index].is_vote = !vote.options[index].is_vote
    //判断是否多选
    if( vote.type === 0) {
      if(vote.options[index].is_vote){
        vote.options.forEach( (item, i) => {
           if(i !== index) item.is_vote = false
        })
      }
    }
    this.commitVote()
  },
  //获取投票详情
  getVoteDetail: function(id){
    let data = {
      "topic_id": id,
      "current_user_id": getApp().openid
    }
    getDetail(data, res => {
      if(res.data.code === 0) {
        let vote = res.data.data
        vote.end_time_text = this.endTimeToText(vote.end_time)
        vote.options = vote.options.map( i => {
            i.scale = vote.total_number > 0 ? (i.total_number / vote.total_number * 100).toFixed(2) : 0
            return i
        })
        this.setData({vote, isLoading: false}, () => {
          this.rowCount()
        })
      } else {
        this.toast({title: res.data.message, icon: 'error'})
      }
    })
  },
  //提交投票
  commitVote: function(){
    //加工选中参数
    let slectedOptIds = []
    this.data.vote.options.forEach(i => {
      if(i.is_vote) slectedOptIds.push(i.id)
    })
    let voteId = this.data.vote.id
    let data = {
      "topic_id": voteId,
      "option_ids": slectedOptIds,
      "current_user_id": getApp().openid
    }
    saveResult(data, res => {
        if(res.data.code === 0) {
          this.getVoteDetail(voteId)
          if(!this.data.isViev) this.setData({isView: true})
        } else {
          this.toast({title: res.data.message, icon: 'none'})
        }
    })
  },
  //判断是否显示展开按钮
  rowCount: function(){
    let query = tt.createSelectorQuery();
    let dom = query.select('.description').boundingClientRect( rect =>{
       let lineHeight = 21  ,height = Math.ceil(rect.height)
       this.setData({description: Math.ceil(height/lineHeight) >= 3})
    }).exec()
  }
})