/**
 * * areaInfo 模块接口列表
 */

// import base from './baseUrl'; // 导入接口域名列表
// import qs from 'qs'; // 根据需求是否导入qs模块
import Axios from './axiosInstance' // 导入http中创建的axios实例
import urls from '@/api/axiosRequestUrl'

const storageAdmin = {
  // 获取数据
  // params: {
  //     pathListData: ,
  //     pageData: page,
  //     callBack: () => ({data:any,total:number}),
  // }
  getClassify(params: any) {
    const url = urls.storageAdminDataBase
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
    const url = urls.storageAdminDataBase
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
    const url = urls.storageAdminDataBase
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
    const url = urls.storageAdminDataBase
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
    const url = urls.storageAdminDataBase
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
  getStorageData(params: any) {
    const url = urls.storageAdminDataBase
    params.method = 'getStorageData'
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
  editStorageData(params: any) {
    const url = urls.storageAdminDataBase
    params.method = 'editStorageData'
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
  recoverStorageData(params: any) {
    const url = urls.storageAdminDataBase
    params.method = 'recoverStorageData'
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
  addStorageData(params: any) {
    const url = urls.storageAdminDataBase
    params.method = 'addStorageData'
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
  delStorageData(params: any) {
    const url = urls.storageAdminDataBase
    params.method = 'delStorageData'
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
  //     storageRecorder: ,
  //     pageData: page,
  //     callBack: () => ({data:any,total:number}),
  // }
  getStoreInOutData(params: any) {
    const url = urls.storageAdminDataBase
    params.method = 'getStoreInOutData'
    Axios.post(url, params)
      .then((res: any) => {
        //console.log(res.data)
        params.callBack({
          data: res.data.data,
          total: res.data.count,
          inTotal: res.data.inTotal,
          outTotal: res.data.outTotal
        })
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  //修改数据
  // params: {
  //     storageRecorder: ,
  //     recorderData: ,
  //     callBack: () => ({data:any,total:number}),
  // }
  editStoreInOutData(params: any) {
    const url = urls.storageAdminDataBase
    params.method = 'editStoreInOutData'
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
  //     storageRecorder: ,
  //     recorderData: ,
  //     callBack: () => ({data:any,total:number}),
  // }
  submitAudit(params: any) {
    const url = urls.storageAdminDataBase
    params.method = 'submitAudit'
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
  //     storageRecorder:,
  //     recorderData:,
  //     callBack: () => ({data:any,total:number}),
  // }
  addStoreInOutData(params: any) {
    const url = urls.storageAdminDataBase
    params.method = 'addStoreInOutData'
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
  // storageRecorder: ,
  // recorderData: ,
  // callBack: () => (msg:string),
  // }
  delStoreInOutData(params: any) {
    const url = urls.storageAdminDataBase
    params.method = 'delStoreInOutData'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack(`${res.data.msg},共删除${res.data.data.affectedRows}条记录`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }
}

export default storageAdmin
