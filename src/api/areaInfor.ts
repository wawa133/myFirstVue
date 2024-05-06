/**
 * * areaInfo 模块接口列表
 */

// import base from './baseUrl'; // 导入接口域名列表
// import qs from 'qs'; // 根据需求是否导入qs模块
import Axios from './axiosInstance' // 导入http中创建的axios实例
import urls from '@/api/axiosRequestUrl'

const areaInfor = {
  // 获取区域数据
  // params: {
  //     areaData: areaNavData,
  //     pageData: page,
  //     callBack: () => ({data:any,total:number}),
  // }
  get(params: any) {
    const resData: any = []
    let resPage: number = 0
    const url = urls.areaDataBase
    params.method = 'getArea'
    Axios.post(url, params)
      .then((res: any) => {
        if (!!res || res.data.data.length > 0) {
          res.data.data.forEach((item: any) => {
            resData.push({
              id: item.ID,
              name: item.Name,
              level: item.AreaLevel,
              areaID: item.areaID,
              desc: item.desc
            })
          })
          resPage = res.data.count
        }
        params.callbackLoadArea({ data: resData, total: resPage })
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 修改新增区域数据
  // params: {
  //     method: "setArea | addArea",
  //     areaData: areaNavData,
  //     recorderData: RecorderObj,
  // }
  edit(params: any) {
    const url = urls.areaDataBase
    params.method = params.recorderData.id > 0 ? 'setArea' : 'addArea'
    Axios.post(url, params)
      .then((res: any) => {
        params.callbackEditArea(`修改数据${res.data.msg}`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 获取区域数据
  // params: {
  //     method: "delArea",
  //     recorderData: delRecorders,
  //     areaData: areaNavData,
  // }
  del(params: any) {
    const url = urls.areaDataBase
    params.method = 'delArea'
    Axios.post(url, params)
      .then((res: any) => {
        let total = 0
        res.data.data.affectedRows.forEach((item: any) => {
          total += item
        })
        params.callbackDelArea(`删除数据${res.data.msg}，共删除${total}条`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }
}

export default areaInfor
