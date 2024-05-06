/*
 * @Description:
 * @Author: liutq
 * @Date: 2024-02-23 19:35:06
 * @LastEditTime: 2024-05-02 22:35:48
 * @LastEditors: liutq
 * @Reference:
 */
/// <reference types="vite/client" />

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare interface ImpoertMetaEnv {
  readonly MODE: string
  // readonly VITE_BASE_URL: string
  // readonly VITE_TIME_OUT: number
}
 
declare interface ImpoertMeta {
  readonly env: ImpoertMetaEnv
}

// 加上这个 '*' 表所有  'XXX'只针对指定名称
// 解决TS模块 引入文件中使用 js 语言报错问题
declare module '*'
