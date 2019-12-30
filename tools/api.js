const baseUrl = 'http://171.221.206.16:3060/'
const request = opt => {
    opt.url = baseUrl + opt.url
    tt.request({
        ...opt,
        method: 'POST',
        header: {'content-type': 'application/json'},
        fail: err => {
            console.error('错误', err)
            console.error(`接口:${opt.url}   请求失败`)
            console.error('请求参数', opt.data)
        }
    })
};
//获取投票列表
const getVoteList = (data, success) =>{
    request({
        url: 'api/topic/list',
        data,
        success,
    })
}
//创建投票
const createVote = (data, success) =>{
    request({
        url: 'api/topic/save',
        data,
        success,
    })
}
//查询详情
const getDetail = (data, success) =>{
    request({
        url: 'api/topic/load',
        data,
        success,
    })
}
//保存投票结果
const saveResult = (data, success) =>{
    request({
        url: 'api/vote/save',
        data,
        success,
    })
}
//删除投票
const deleteVote = (data, success) =>{
    request({
        url: 'api/topic/delete',
        data,
        success,
    })
}
export {
    getVoteList,
    createVote,
    getDetail,
    saveResult,
    deleteVote
}