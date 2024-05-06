/**
 * * areaInfo 模块接口列表
 */

// import base from './baseUrl'; // 导入接口域名列表
// import qs from 'qs'; // 根据需求是否导入qs模块
import Axios from './axiosInstance' // 导入http中创建的axios实例
import urls from '@/api/axiosRequestUrl'

const unitInfor = {
  // 获取区域数据
  // params: {
  //     areaData: userStore.leaderAreaData,
  //     unitData: userStore.leaderUnitData,
  //     projectRowData: Props.prompt.row,
  //     pageData: page,
  //     callBack: () => ({data:any,total:number}),
  // }
  get(params: any) {
    const resData: any = []
    let resPage: number = 0
    const url = urls.unitDataBase
    params.method = 'getUnitData'
    Axios.post(url, params)
      .then((res: any) => {
        if (!!res || res.data.data.length > 0) {
          res.data.data.forEach((item: any) => {
            resData.push({
              id: item.ID,
              name: item.Name,
              lev: item.Level,
              areaId: item.AreaID,
              desc: item.desc
            })
          })
          resPage = res.data.count
        }
        params.callBack({ data: resData, total: resPage })
      })
      .catch((err: any) => {
        console.log(err)
      })
  },
  // 修改新增区域数据
  // params: {
  //     method: "setArea | addArea",
  //     areaData: areaNavData,
  //     unitData: unitNavData,
  //     recorderData: RecorderObj,
  //     callBack: () => (msg:string),
  // }
  edit(params: any) {
    const url = urls.unitDataBase
    params.method = params.recorderData.id > 0 ? 'setUnitData' : 'addUnitData'
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
  //     method: "delAreaData",
  //     areaData: areaNavData,
  //     unitData: unitNavData,
  //     recorderData[]: delRecorders,
  // }
  del(params: any) {
    const url = urls.unitDataBase
    params.method = 'delUnitData'
    Axios.post(url, params)
      .then((res: any) => {
        let total = 0
        res.data.data.affectedRows.forEach((item: any) => {
          total += item
        })
        params.callBack(`删除数据${res.data.msg}，共删除${total}条`)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }
}

export default unitInfor
