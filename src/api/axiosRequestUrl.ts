/**
 * * 接口域名的管理
 */

const urlStr = 'http://localhost:3007' // 本地
// const urlStr = 'http://b8d00bd8e3e3.sn.mynetname.net/' // 线上

const urls = {
  sq: 'https://xxxx111111.com/api/v1',
  bd: 'http://xxxxx22222.com/api',
  areaDataBase: urlStr + '/my/area/getinfo', //http://localhost:3007/my/area/getinfo',
  userDataBase: urlStr + '/api/login', //'http://localhost:3007/api/login',
  unitDataBase: urlStr + '/my/unit/getinfo', //http://localhost:3007/my/unit/getinfo',
  UserInfoDataBase: urlStr + '/my/users/getinfo', //http://localhost:3007/my/users/getinfo',
  projectInfoDataBase: urlStr + '/my/projectCatch/getinfo', //http://localhost:3007/my/projectCatch/getinfo',
  monitorDataBase: urlStr + '/my/monitoring/getinfo', //http://localhost:3007/my/monitoring/getinfo',
  twoNameListDataBase: urlStr + '/my/twoNameList/getinfo', //http://localhost:3007/my/twoNameList/getinfo',
  mainBodyListDataBase: urlStr + '/my/mainBodyList/getinfo', //http://localhost:3007/my/mainBodyList/getinfo',
  assetsAdminDataBase: urlStr + '/my/assetsAdmin/getinfo', //http://localhost:3007/my/assetsAdmin/getinfo',
  storageAdminDataBase: urlStr + '/my/storageAdmin/getinfo' //http://localhost:3007/my/storageAdmin/getinfo'
}

export default urls
