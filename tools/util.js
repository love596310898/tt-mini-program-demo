const isUndefined = (v) => { //判断是否为undifined
   return v === void(0) 
}
const createDate  = date => { //获取当前时间
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return {year, month, day, hour, minute, second}
}
const formatNumber = n => { //格式化为两位数
  n = n.toString()
  return n[1] ? n : '0' + n
}
const formatTime = date => { //格式化时间
  if(isUndefined(date)) {
    date = new Date()
  } else if(date && !Date.isPrototypeOf(date)){
    date = new Date(date)
  }
  let {year, month, day, hour, minute, second}  = createDate(date)
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const pathTo = function(ev){ // 换页
  let path = ev.currentTarget.dataset.path
  tt.navigateTo({
    url: path
  });
}
const pathReplace = function(ev){ //重定向
  let path = ev.currentTarget.dataset.path
  tt.redirectTo({url: path})
}
const changeTitle = function(title){ //更换导航栏title
  tt.setNavigationBarTitle({title});
}
const toast = function(opt){ // 提示modal
  tt.showToast({
    ...opt,
    fail: function(){
       console.log('showModal调用失败');
    }
  });
}
const confirm = function(opt, success){//确认modal
  tt.showModal({
    ...opt,
    success,
    fail: function(){
       console.log('showModal调用失败');
    }
  })
}
const endTimeToText = data => { //格式化结束时间
  data = data.replace(/-/g, '/')
  let endtime = new Date(data).getTime(), nowTime = new Date().getTime()
  let keepTime = endtime - nowTime
  if(keepTime <= 0)  return "投票已截止"
  let day = (keepTime / 1000 / 3600 / 24).toFixed(0)
  let hours = (keepTime / 1000 / 3600).toFixed(0) % 24
  let min = (keepTime / 1000 % 3600 / 60).toFixed(0)
  if(day>0) {
    return `${day}天后截止`
  } else {
    return `${hours}小时${min}分后截止`
  }
}

export default{
  formatNumber,
  endTimeToText,
  toast,
  confirm,
  changeTitle,
  pathTo,
  pathReplace,
  formatTime,
  isUndefined,
  ...createDate(new Date()),
}


