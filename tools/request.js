const baseUrl = ''
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