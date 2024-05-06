import { defineStore } from 'pinia'

export const useUserStore = defineStore('store2024.32.3', {
  state: () => ({
    id: -1,
    name: '',
    nickName: '',
    network: true,
    userLoginInfo: { id: -1, loginName: '', nickName: '', userRole: 'user' },
    areaData: [{ id: -1, name: '区域根-ROOT', desc: '', lev: -1 }],
    unitData: [{ id: -1, areaId: -1, name: '单位根-ROOT', desc: '', lev: -1, city: '' }],
    leaderAreaData: [{ id: -1, name: '区域根-ROOT', desc: '', lev: -1 }],
    leaderUnitData: [{ id: -1, areaId: -1, name: '单位根-ROOT', desc: '', lev: -1, city: '' }]
  }),
  // 类似于 computed 可以帮我们去修饰我们的值
  getters: {},
  // 可以操作异步 和 同步提交 state
  actions: {},
  persist: true
})
