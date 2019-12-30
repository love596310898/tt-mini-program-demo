import util from "../../tools/util.js";
import {createVote, getDetail} from '../../tools/api.js'
import filterWords from '../../tools/filterWords.js'
let timer = null, formKey = null, id = null, type = 'create'
Page({
  ...util,
  data: {
    form:{
      title: '',
      memo: '',
      type: 0,
      end_time:'',
      end_hours: '00:00:00',
      options:[{
        text: ''
      },{
        text: ''
      }]
    },
    typeArr: ["单选", "多选"],
  },
  onLoad: function (options) {
    //设置默认投票截至时间
    let y = this.year, m = this.month + 2, d = this.day
    if(m > 12) {y++; m-=12}
    this.setData({
      ['form.end_time']: `${y}-${this.formatNumber(m)}-${this.formatNumber(d)}`
    })
    //变更编辑类型
    if(options.type) type = options.type
    //获取id
    id = options.id
    //获取投票详情
    if(id) this.getVoteDetail()
  },
  onShow: function(options){
   this.changeTitle(type === 'create' ? '创建投票': '编辑投票')
  },
  //修改投票类型
  typeChange: function(ev){
    let value = ev.detail.value
    this.setData({['form.type']: Number(value)})
  },
  //修改投票截止日期
  dateChange: function(ev){
    let value = ev.detail.value
    this.setData({['form.end_time']: value})
  },
  //修改投票截止时间
  timeChange: function(ev){
    console.log(ev.detail)
    let value = ev.detail.value + ':00'
    this.setData({['form.end_hours']: value})
  },
  timeChangeTest: function(ev){
    console.log(ev, '时间切换')
  },
  //提交创建投票
  submit: function(ev){
    let f = this.data.form
    //验证字段
    if(!f.title) return this.toast({title:'投票标题不能为空', icon: 'none'})
    for(let i = 0; i < f.options.length; i++){
      if(!f.options[i].text) {
        this.toast({title:'选项值不能为空', icon: 'none'})
        return
      }
    }
    //创建参数
    let data = {
      ...f,
      owner_id: getApp().openid, 
      end_time: f.end_time + ' ' + f.end_hours
    }
    //发送请求
    createVote(data, res => {
        if(res.data.code === 0) {
          let title = type === 'create' ? '创建成功' : '修改成功' 
          this.toast({title})
          ev.currentTarget.dataset.path += `?id=${res.data.data}&type=${type}`
          this.pathReplace(ev)
        } else {
          this.toast({title: res.data.message, icon: 'fail'})
        }
    })
  },
  //编辑投票选项
  editOption: function(ev){
    let index = ev.currentTarget.dataset.index
    let opt = this.data.form.options
    if(!this.isUndefined(index)){
      if(opt.length === 1) return
      opt.splice(index, 1)
    } else {
      opt.push({text:''})
    }
    this.setData({['form.options']: this.data.form.options})
  },
  //input或者textarea输入时 记录输入结果
  enterText: function(ev){
    let key = ev.currentTarget.dataset.key
    let value = filterWords(ev.detail.value)
    if(formKey && key === formKey) {clearTimeout(timer)}
    timer = setTimeout( () => {
      this.setData({[key]: value})
    }, 500)
    formKey = key
    return value
  },
  getVoteDetail(){
    let data = {
      "topic_id": id,
      "current_user_id":"gavin"
    }
    getDetail(data, res=> {
      if(res.data.code === 0) {
        let form = res.data.data
        let timeArr = form.end_time.split(' ')
        form.end_time = timeArr[0]
        form.end_hours = timeArr[1]
        this.setData({form})
      } else {
        this.toast({title: res.data.message, icon: 'fail'})
      }
    })
  }
})