/**
 * * areaInfo 模块接口列表
 */

// import base from './baseUrl'; // 导入接口域名列表
// import qs from 'qs'; // 根据需求是否导入qs模块
import Axios from './axiosInstance' // 导入http中创建的axios实例
import urls from '@/api/axiosRequestUrl'

const projectInfor = {
  // 获取区域数据
  // params: {
  //     areaData: userStore.leaderAreaData,
  //     unitData: userStore.leaderUnitData,
  //     projectRowData: Props.prompt.row,
  //     pageData: page,
  //     callBack: () => ({data:any,total:number}),
  // }
  getAuditUserData(params: any) {
    const url = urls.projectInfoDataBase
    params.method = 'getAuditUserData'
    Axios.post(url, params)
      .then((res: any) => {
        //console.log(res.data)
        params.callBack({ data: res.data.data, total: res.data.count })
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 获取区域数据
  // params: {
  //     areaData: userStore.leaderAreaData,
  //     unitData: userStore.leaderUnitData,
  //     projectRowData: Props.prompt.row,
  //     userAuditData: page,
  //     pageData: page,
  //     callBack: () => ({data:any,total:number}),
  // }
  editAuditUserData(params: any) {
    const url = urls.projectInfoDataBase
    params.method = 'editAuditUserData'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack(`修改数据${res.data.msg}`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 获取区域数据
  // params: {
  //     areaData: userStore.leaderAreaData,
  //     unitData: userStore.leaderUnitData,
  //     projectRowData: Props.prompt.row,
  //     pageData: page,
  //     callBack: () => ({data:any,total:number}),
  // }
  getAuditUnitData(params: any) {
    const url = urls.projectInfoDataBase
    params.method = 'getAuditUnitData'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack({ data: res.data.data, total: res.data.count })
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 获取区域数据
  // params: {
  //     areaData: userStore.leaderAreaData,
  //     unitData: userStore.leaderUnitData,
  //     projectRowData: Props.prompt.row,
  //     unitAuditData: unitAuditData,
  //     pageData: page,
  //     callBack: () => ({data:any,total:number}),
  // }
  editAuditUnitData(params: any) {
    const url = urls.projectInfoDataBase
    params.method = 'editAuditUnitData'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack(`修改数据${res.data.msg}`)
        //params.callBack({ data: res.data.data, total: res.data.count })
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 获取区域数据
  // params: {
  // areaNavData: userStore.leaderAreaData,
  // unitNavData: userStore.leaderUnitData,
  // storeAreaData: userStore.areaData,
  // storeUnitData: userStore.unitData,
  // authorizeRowData: Props.prompt.row, //id,nickName,projectName,projectUnit,projectUnitId
  // callBack: () => ({data:any,total:number}),
  // }
  reloadRowInfo(params: any) {
    const url = urls.projectInfoDataBase
    params.method = 'getAuthorizeData'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack({ data: res.data.data, total: res.data.count })
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 获取区域数据
  // params: {
  // projectRowData: Props.prompt.row,
  // pageData: page,
  // callBack: () => ({data:any,total:number}),
  // }
  getProjectAuthUser(params: any) {
    const url = urls.projectInfoDataBase
    params.method = 'getAuditUsers'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack({ data: res.data.data, total: res.data.count })
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 获取区域数据
  // 获取区域数据
  // params: {
  // projectRowData: Props.prompt.row,
  // editAuditData: row,
  // callBack: () => ({data:any,total:number}),
  // }
  editProjectAuthUser(params: any) {
    const url = urls.projectInfoDataBase
    params.method = 'editAuditUser'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack(`修改数据${res.data.msg}`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 获取区域数据
  // 获取区域数据
  // params: {
  // projectRowData: Props.prompt.row,
  // pageData: page,
  // callBack: () => ({data:any,total:number}),
  // }
  getProjectAuthUnit(params: any) {
    const url = urls.projectInfoDataBase
    params.method = 'getAuditUnits'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack({ data: res.data.data, total: res.data.count })
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 获取区域数据
  // 获取区域数据
  // params: {
  // projectRowData: Props.prompt.row,
  // editAuditData: row,
  // callBack: () => ({data:any,total:number}),
  // }
  editProjectAuthUnit(params: any) {
    const url = urls.projectInfoDataBase
    params.method = 'editAuditUnit'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack(`修改数据${res.data.msg}`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 获取区域数据
  // params: {
  // projectRowData: Props.prompt.row,
  // delAuditUsers: row,
  // callBack: () => (msg:string),
  // }
  delAuditUsers(params: any) {
    const url = urls.projectInfoDataBase
    params.method = 'delAuditUsers'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack(`${res.data.msg},共删除${res.data.data.affectedRows}`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 获取区域数据
  // params: {
  // projectRowData: Props.prompt.row,
  // delAuditUnits: row,
  // callBack: () => (msg:string),
  // }
  delAuditUnits(params: any) {
    const url = urls.projectInfoDataBase
    params.method = 'delAuditUnits'
    Axios.post(url, params)
      .then((res: any) => {
        //console.log('999', res)
        params.callBack(`${res.data.msg},共删除${res.data.data.affectedRows}`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 获取区域数据
  // params: {
  // projectRowData: Props.prompt.row,
  // pageData: page,
  // callBack: () => (msg:string),
  // }
  getCacheDetail(params: any) {
    const url = urls.projectInfoDataBase
    params.method = 'getCacheDetail'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack({ data: res.data.data, total: res.data.count })
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 修改明细数据记录 {projectRowData，editItemData，callBack: () => (msg:string)}
  editCacheDetail(params: any) {
    const url = urls.projectInfoDataBase
    params.method = 'editCacheDetail'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack(`status:${res.data.msg}`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 新增明细数据记录 {projectRowData，editItemData，callBack: () => (msg:string)}
  addCacheDetail(params: any) {
    const url = urls.projectInfoDataBase
    params.method = 'addCacheDetail'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack(`status:${res.data.msg}`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 审核 {projectRowData，editItemData，callBack: () => (msg:string)}
  unAuditItemData(params: any) {
    const url = urls.projectInfoDataBase
    params.method = 'unAuditItemData'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack(`status:${res.data.msg}`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 退回 {projectRowData，editItemData，callBack: () => (msg:string)}
  auditItemData(params: any) {
    const url = urls.projectInfoDataBase
    params.method = 'auditItemData'
    console.log(params)
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack(`status:${res.data.msg}`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 获取区域数据
  // params: {
  // areaNavData: userStore.leaderAreaData,
  // unitNavData: userStore.leaderUnitData,
  // storeAreaData: userStore.areaData,
  // storeUnitData: userStore.unitData,
  // pageData:
  // callBack: () => ({data:any,total:number}),
  // }
  getProjectData(params: any) {
    const url = urls.projectInfoDataBase
    params.method = 'getProjectData'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack({ data: res.data.data, total: res.data.count })
      })
      .catch((err: any) => {
        console.log(err)
      })
  }
}

export default projectInfor
