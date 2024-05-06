import axios from 'axios'
//import router from '../router'
//import { layer } from '@layui/layer-vue'
import qs from 'qs'

/**
 * * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */

// new Promise 动态创建实例
export function post(url: string, params: any) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, qs.stringify(params))
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}
