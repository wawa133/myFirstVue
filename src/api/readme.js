import Axios from './baseConfig'
 


//只有 url 是必需的。
//如果没有指定 method，请求将默认使用 GET 方法

// config 参数
// url: '/user',   // 路径url
// method: 'get', // 请求方法，默认get
// baseURL: 'https://some-domain.com/api/', //基础url，
// headers: {'X-Requested-With': 'XMLHttpRequest'}, //设置请求头
// params: {ID: 12345,name:"Jack"}//设置请求url的query参数，
// data: {firstName: 'Fred'}, // 设置请求体
// data: 'Country=Brasil&City=Belo Horizonte',//设置请求的另外一种字符串格式，
// /timeout: 1000,/请求超时，单位毫秒，
// responseType: 'json',  //响应数据类型，默认json
// responseEncoding: 'utf8', //响应数据的编码规则，默认utf-8
// maxContentLength: 2000, // 响应数据的最大长度，单位字节，
// maxBodyLength: 2000, // 请求体的最大长度，单位字节，

// validateStatus: function (status) {  // 验证响应状态码，默认默认是大于等于200，小于300
//     return status >= 200 && status < 300; // 返回true调用resolve，否则调用reject失败
// }


// axios(config)



// axios.request(config)
// axios#request(config)




// axios#get(url[, config])
// get(url[, config])
// url：请求的url，可以使用相对路径或者绝对路径。
// config：请求的配置，包含params、headers等等。
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    Axios.get(url, {
        params: params
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}



// axios#post(url[, data[, config]])
// post(url[, data[, config]])
// url：请求的url，可以使用相对路径或者绝对路径。
// data：请求的数据。
// config：请求的配置，包含headers等等。




// axios#put(url[, data[, config]])
// put(url[, data[, config]])
// url：请求的url，可以使用相对路径或者绝对路径。
// data：请求的数据。
// config：请求的配置，包含headers等等。






// axios#delete(url[, config])
// delete(url[, config])
// url：请求的url，可以使用相对路径或者绝对路径。
// config：请求的配置，包含headers等等。




// axios#patch(url[, data[, config]])
// axios.patch(url [,data [,config]])





// axios#head(url[, config])
// axios.head(url [,config])




// axios#options(url[, config])



// axios#getUri([config])