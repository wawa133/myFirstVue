/**
 * * userInfor 模块接口列表
 */

import Axios from './axiosInstance'
import urls from '@/api/axiosRequestUrl'
import { layer } from '@layui/layer-vue'

const userInfor = {
  // 用户登录
  // params: {
  //     username: loginData.account,
  //     password: loginData.password,
  //     captcha:  loginData.captcha,
  //     callBack: () => ({data:any,total:number}),
  // }
  login(params: any) {
    //const loadFlash = layer.load(0)
    // ********注意这是登录的接口，不通过验证信任******
    const url = urls.userDataBase
    params.method = 'login'
    Axios.post(url, params)
      .then((res: any) => {
        //layer.close(loadFlash)
        // 登录验证
        if (!res || !res.data || res.data.status != 0) {
          layer.msg(res.data.msg ? res.data.msg : '登录失败', {
            time: 1000
          })
          return
        }
        if (!res.data.token) {
          layer.msg('登录失败', { time: 1000 })
          return
        }
        // 可进行变量转换 回调使用
        //console.log(res.data)
        const token = res.data.token
        const user = res.data.user
        const area = res.data.area
        const unit = res.data.company
        const msg = res.data.message
        // 回调
        params.callbackLogin({ user: user, area: area, token: token, unit: unit, msg: msg })
      })
      .catch((err: any) => {
        //layer.close(loadFlash)
        params.callbackLoginErr()
        layer.msg(err.message, { icon: 2, time: 1000 })
      })
  },
  // 用户登录
  // params: {
  //     unitData: unitNavData,
  //     pageData: page,
  //     callBack: () => ({data:any,total:number}),
  // }
  get(params: any) {
    const resData: any = []
    let resPage: number = 0
    // ********注意这是获取数据的接口，需通过验证信任******
    const url = urls.UserInfoDataBase
    params.method = 'getUsers'
    Axios.post(url, params)
      .then((res: any) => {
        // 可进行变量转换 回调使用
        res.data.data.forEach((item: any) => {
          resData.push({
            id: item.id,
            userName: item.nickname,
            loginName: item.username,
            email: item.email,
            telNum: item.telNum,
            desc: item.desc,
            userRole: item.userRole
          })
        })
        resPage = res.data.count
        params.callBack({ data: resData, total: resPage })
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 修改新增区域数据
  // params: {
  //     method: "setArea | addArea",
  //     unitData: unitNavData,
  //     recorderData: RecorderObj,
  //     callBack: () => (msg:string),
  // }
  edit(params: any) {
    const url = urls.UserInfoDataBase
    params.method = params.recorderData.id > 0 ? 'setUser' : 'addUser'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack(`数据${res.data.msg}`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // del数据
  // params: {
  //     method: "delAreaData",
  //     unitData: unitNavData,
  //     recorderArryData[]: delRecorders,
  //     callBack: () => (msg:string),
  // }
  del(params: any) {
    const url = urls.UserInfoDataBase
    params.method = 'delUsers'
    Axios.post(url, params)
      .then((res: any) => {
        let total = 0
        //console.log(res.data)
        res.data.data.affectedRows.forEach((item: any) => {
          total += item
        })
        params.callBack(`删除数据${res.data.msg}，共删除${total}条`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 修改新增区域数据
  // params: {
  //     method: "authUser",
  //     unitData: unitNavData,
  //     recorderData: RecorderObj,
  //     callBack: () => (msg:string),
  // }
  auth(params: any) {
    const url = urls.UserInfoDataBase
    params.method = 'authUser'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack(`数据${res.data.msg}`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }
}

export default userInfor
