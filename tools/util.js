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


export default{
  toast,
  confirm,
  changeTitle,
  pathTo,
  pathReplace,
  ...createDate(new Date()),
}


