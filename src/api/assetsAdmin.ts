/**
 * * areaInfo 模块接口列表
 */

// import base from './baseUrl'; // 导入接口域名列表
// import qs from 'qs'; // 根据需求是否导入qs模块
import Axios from './axiosInstance' // 导入http中创建的axios实例
import urls from '@/api/axiosRequestUrl'

const assetsAdmin = {
  // 获取数据
  // params: {
  //     pathListData: ,
  //     pageData: page,
  //     callBack: () => ({data:any,total:number}),
  // }
  getClassify(params: any) {
    const url = urls.assetsAdminDataBase
    params.method = 'getClassify'
    Axios.post(url, params)
      .then((res: any) => {
        //console.log(res.data)
        params.callBack({ data: res.data.data, total: res.data.count })
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  //修改数据
  // params: {
  //     pathListData: ,
  //     recorderData: ,
  //     callBack: () => ({data:any,total:number}),
  // }
  editClassify(params: any) {
    const url = urls.assetsAdminDataBase
    params.method = 'editClassify'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack(`msg:${res.data.msg}`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  //修改数据
  // params: {
  //     pathListData: ,
  //     recorderData: ,
  //     callBack: () => ({data:any,total:number}),
  // }
  recoverClassify(params: any) {
    const url = urls.assetsAdminDataBase
    params.method = 'recoverClassify'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack(`msg:${res.data.msg}`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  //添加数据
  // params: {
  //     pathListData:,
  //     recorderData:,
  //     callBack: () => ({data:any,total:number}),
  // }
  addClassify(params: any) {
    const url = urls.assetsAdminDataBase
    params.method = 'addClassify'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack(`msg:${res.data.msg}`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 删除数据
  // params: {
  // pathListData: ,
  // recordersData: ,
  // callBack: () => (msg:string),
  // }
  delClassify(params: any) {
    const url = urls.assetsAdminDataBase
    params.method = 'delClassify'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack(`${res.data.msg},共删除${res.data.data.affectedRows}条记录`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 获取数据
  // params: {
  //     pathNavData: ,
  //     pageData: page,
  //     callBack: () => ({data:any,total:number}),
  // }
  getAssetsData(params: any) {
    const url = urls.assetsAdminDataBase
    params.method = 'getAssetsData'
    Axios.post(url, params)
      .then((res: any) => {
        //console.log(res.data)
        params.callBack({ data: res.data.data, total: res.data.count })
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  //修改数据
  // params: {
  //     recorderData: ,
  //     callBack: () => ({data:any,total:number}),
  // }
  editAssetsData(params: any) {
    const url = urls.assetsAdminDataBase
    params.method = 'editAssetsData'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack(`msg:${res.data.msg}`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  //修改数据
  // params: {
  //     recorderData: ,
  //     callBack: () => ({data:any,total:number}),
  // }
  recoverAssetsData(params: any) {
    const url = urls.assetsAdminDataBase
    params.method = 'recoverAssetsData'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack(`msg:${res.data.msg}`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  //添加数据
  // params: {
  //     recorderData:,
  //     callBack: () => ({data:any,total:number}),
  // }
  addAssetsData(params: any) {
    const url = urls.assetsAdminDataBase
    params.method = 'addAssetsData'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack(`msg:${res.data.msg}`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 删除数据
  // params: {
  // recordersData: ,
  // callBack: () => (msg:string),
  // }
  delAssetsData(params: any) {
    const url = urls.assetsAdminDataBase
    params.method = 'delAssetsData'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack(`${res.data.msg},共删除${res.data.data.affectedRows}条记录`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }
}

export default assetsAdmin
