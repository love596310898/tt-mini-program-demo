const filter_module = [
    /腾\s*讯/g, 
    /共\s*产\s*党/g, 
    /[操|草]\s*你.?/g, 
    /傻\s*[逼|b]/ig, 
    /[s|傻]\s*逼/, 
    /s\s*b/ig, 
    /l\s*j/ig, 
    /习\s*近\s*平/, 
    /李\s*克\s*强/, 
    /垃\s*圾/, 
    /妈\s*的/, 
    /[m|妈|马]\s*[b|比|逼]/ig
]

export default str => {
    filter_module.forEach(r => {
        str = str.replace(r, '')
    })
    return str
}

