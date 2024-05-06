import axios from 'axios'
import { useRouter } from 'vue-router'
import { layer } from '@layui/layer-vue'
// import { useUserStore } from "../stores";

// 设置请求超时时间动画 ***********************************
// ***8888888888888888888888888888888888888888888888888888
let loadFlash: string | null = null

// 一、自定义实例默认值
// axios.create([config]) 创建实例时进行配置
// 创建一个axios的实例,可以同时创建多个axios实例。
const Axios = axios.create({
  baseURL: '',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json;charset=UTF-8' }
})
// 创建实例后进行配置
// 配置的优先级：在 lib/defaults.js 中找到的库默认值，然后是实例的 defaults 属性，
// 最后是请求的 config 参数。后面的优先级要高于前面的。
// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;

// 二、请求拦截器
// 添加请求拦截,可以使用请求拦截器做一些自定义的数据处理、添加请求头等等。
// 用户登录之后才能访问,列化我们提交的数据
Axios.interceptors.request.use(
  (config) => {
    if (!loadFlash) {
      loadFlash = layer.load(0)
    }
    // 获取验证token： 'Bearer ' + 'token'
    //JWT-TOKEN-cookies 令牌时，需要跨域传送进需要服务端添加跨域头“Authorization”
    //可以判断 TOKEN 过期号否决定是否添加 tokenT && (config.headers.Authorization = token);
    config.headers.Authorization = localStorage.getItem('token') || ''
    //浏览器告知服务器，我需要设置cookie，包括session-cookie\JWT-token-cookie等
    config.withCredentials = true

    return config
  },
  (err) => {
    console.log('全局错误拦截:', err)
    return Promise.reject(err)
  }
)

// 三、响应拦截器 validateStatus 中设置的返回置决定会触发该的函数
// 添加响应拦截器,可以使用响应拦截器做一些自定义的错误处理、数据处理等等。
// axios.interceptors.request.eject(myInterceptor); 取消拦截器
Axios.interceptors.response.use(
  // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据 否则的话抛出错误
  (res) => {
    //console.log('中产件1', res.data)
    layer.close(loadFlash)
    loadFlash = null

    if (res.status === 200) {
      //console.log('Axios对象返回拦截:', res.data)
      // （1）当后台无 data 数据时 抛出错误
      if (!res.data) {
        return Promise.reject(res)
      }
      //（2）当身份证证失败时 自动进行跳转
      if (res.data.status == 1 && res.data.msg == '身份认证失败') {
        toLogin()
        return
      }
      //（3）未查寻到数据 对数据表和区域可选数据进行清空
      //(!res.data.data || !Array.isArray(res.data.data) || res.data.data.length < 1)
      if (!res.data.data) {
        res.data.data = []
        res.data.count = 0
      }

      return Promise.resolve(res)
    } else {
      //console.log(res.data)
      return Promise.reject(res)
    }
  },
  (err) => {
    //console.log('中产件2', err)
    layer.close(loadFlash)
    loadFlash = null
    // let userStore = useUserStore();
    const { response } = err
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message)
      return Promise.reject(response)
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      if (err.message == 'Network Error') {
        return Promise.reject('网格连接错误 - ' + err)
      } else {
        // 其他错误，可以弹框提示下用户
        // alert('其他错误')
        console.log(err)
        return Promise.reject(err)
      }
    }
  }
)

/**
 * * 提示函数
 * * 禁止点击蒙层、显示一秒后关闭
 * */
const tip = (msg: string) => {
  layer.msg(`message:${msg}`, { area: '50%', time: 3000 })
}

/**
 * * 跳转登录页
 * * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 * */
const toLogin = () => {
  const router = useRouter()
  router.replace({
    path: '/login',
    query: {
      redirect: router.currentRoute.value.fullPath
    }
  })
}

/**
 * * 请求失败后的错误统一处理
 * * @param {Number} status 请求失败的状态码
 * */
const errorHandle = (status: number, other: any) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      toLogin()
      break
    // 403: token过期
    // 清除token并跳转登录页
    case 403:
      tip('登录过期，请重新登录')
      localStorage.removeItem('token')
      setTimeout(() => {
        toLogin()
      }, 1000)
      break
    // 404请求不存在
    case 404:
      tip('请求的资源不存在')
      break
    default:
      console.log(other)
      break
  }
}

export default Axios
