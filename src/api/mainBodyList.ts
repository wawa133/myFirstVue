/**
 * * areaInfo 模块接口列表
 */

// import base from './baseUrl'; // 导入接口域名列表
// import qs from 'qs'; // 根据需求是否导入qs模块
import Axios from './axiosInstance' // 导入http中创建的axios实例
import urls from '@/api/axiosRequestUrl'

const mainBodyList = {
  // 获取数据
  // params: {
  //     areaData: userStore.leaderAreaData,
  //     pageData: page,
  //     fielter: tableFielter,
  //     callBack: () => ({data:any,total:number}),
  // }
  get(params: any) {
    const url = urls.mainBodyListDataBase
    params.method = 'get'
    Axios.post(url, params)
      .then((res: any) => {
        //console.log(res.data)
        res.data.data.forEach((item: any) => {
          const unitArea = JSON.parse(item.unitAreaAddress)
          let add = ''
          for (let i = 1; i < unitArea.length; i++) {
            add += unitArea[i].name
          }
          item.FullAddress = add + item.unitAddress
        })

        params.callBack({ data: res.data.data, total: res.data.count })
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  //修改数据
  // params: {
  //     recorderData: Props.prompt.row,
  //     callBack: () => ({data:any,total:number}),
  // }
  edit(params: any) {
    const url = urls.mainBodyListDataBase
    params.method = 'edit'
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
  //     recorderData: Props.prompt.row,
  //     callBack: () => ({data:any,total:number}),
  // }
  add(params: any) {
    const url = urls.mainBodyListDataBase
    params.method = 'add'
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
  // recordersData: Props.prompt.row,
  // callBack: () => (msg:string),
  // }
  del(params: any) {
    const url = urls.mainBodyListDataBase
    params.method = 'del'
    Axios.post(url, params)
      .then((res: any) => {
        params.callBack(`${res.data.msg},共删除${res.data.data.affectedRows}条记录`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }
}

export default mainBodyList
