import axios from 'axios'
import { useRouter } from 'vue-router'
import { layer } from '@layui/layer-vue'
import { useUserStore } from '../stores'

// 一、全局 axios 默认值
// axios.defaults.baseURL = 'https://api.example.com';
// axios.defaults.timeout = 10000;
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// if (process.env.NODE_ENV == 'development') {axios.defaults.baseURL = 'https://www.baidu.com';}
// else if (process.env.NODE_ENV == 'debug') {axios.defaults.baseURL = 'https://www.ceshi.com';}
// else if (process.env.NODE_ENV == 'production') {axios.defaults.baseURL = 'https://www.production.com';	}

// 二、请求拦截器
// 添加请求拦截,可以使用请求拦截器做一些自定义的数据处理、添加请求头等等。
// 用户登录之后才能访问,列化我们提交的数据
axios.interceptors.request.use(
  (config) => {
    // 获取验证token： 'Bearer ' + 'token'
    //JWT-TOKEN-cookies 令牌时，需要跨域传送进需要服务端添加跨域头“Authorization”
    //可以判断 TOKEN 过期号否决定是否添加 tokenT && (config.headers.Authorization = token);
    config.headers.Authorization = localStorage.getItem('token') || ''
    //浏览器告知服务器，我需要设置cookie，包括session-cookie\JWT-token-cookie等
    config.withCredentials = true

    return config
  },
  (error) => {
    console.log('全局错误拦截:', error)
    return Promise.reject(error)
  }
)

// 三、响应拦截器 validateStatus 中设置的返回置决定会触发该的函数
// 添加响应拦截器,可以使用响应拦截器做一些自定义的错误处理、数据处理等等。
// axios.interceptors.request.eject(myInterceptor); 取消拦截器
axios.interceptors.response.use(
  // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据 否则的话抛出错误
  (res) => {
    if (res.status === 200) {
      return Promise.resolve(res)
    } else {
      return Promise.reject(res)
    }
  },
  (err) => {
    // useUserStore()  useRouter() 不能放在最外面，因为外面会出现未初始化pinia\router无法调用情况
    const userStore = useUserStore()
    const router = useRouter()
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
      if (!window.navigator.onLine) {
        //断网情况下
        // alert('断网了')
        userStore.network = false
        // 跳转断网页面
        router.replace({
          path: '/network'
        })
      } else {
        // 其他错误，可以弹框提示下用户
        // alert('其他错误')
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
