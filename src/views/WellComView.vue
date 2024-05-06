<!--
 * @Description: 
 * @Author: liutq
 * @Date: 2024-03-08 18:50:00
 * @LastEditTime: 2024-05-02 23:40:58
 * @LastEditors: liutq
 * @Reference: 
-->
<!--
 * @Description: 
 * @Author: liutq
 * @Date: 2024-03-08 18:50:00
 * @LastEditTime: 2024-03-08 20:12:50
 * @LastEditors: liutq
 * @Reference: 
-->

<script setup lang="ts">
import { RouterView, RouterLink, useRouter } from "vue-router";
import { useUserStore } from "../stores";

const userStore = useUserStore();
const router = useRouter();
</script>

<style scoped></style>

<template>
  <div class="thisBox">
    <div class="MainContainer">
      <!-- 头部区域显示部分 -->
      <div class="welcome-header">
        <div class="MessageLeader">
          <div class="icon">
            <div class="iconImg"><img src="../assets/images/leader.jpg" alt="" /></div>
            <div class="icoCon">
              <p>
                {{ !!userStore.unitData[1] ? userStore.unitData[1].name : "未注册用户" }}
              </p>
              <h2>{{ userStore.nickName }}</h2>
            </div>
          </div>
          <div class="header-btns">
            <lay-button type="danger" @click="() => router.push('/')">
              返回首页
            </lay-button>
            <lay-button type="danger" @click="() => router.push('/UserRegistration')">
              注册账号
            </lay-button>
          </div>
        </div>
      </div>

      <div class="container">
        <router-link to="./UMessage"><div class="containerItem">通迅录</div></router-link>

        <router-link to="./Notification"><div class="containerItem">农产品质量安全两个名单</div></router-link>

        <router-link to="./mainBodyList"><div class="containerItem">生产经营主体名录</div></router-link>

        <router-link to="./UnitAssets"
          ><div class="containerItem">单位固定资产管理</div></router-link
        >

        <router-link to="./stockStorage"
          ><div class="containerItem">物资出入库库管理</div></router-link
        >

        <router-link to="./AgriculturalMonitoring"
          ><div class="containerItem">农安监测检测统计</div></router-link
        >

        <router-link to="./ProjectFunds"
          ><div class="containerItem">项目资金使用统计</div></router-link
        >

        <router-link to="./RegionManagement"
          ><div class="containerItem">区域管理</div></router-link
        >

        <router-link to="./UnitRegistration">
          <div class="containerItem">单位管理</div>
        </router-link>
        <router-link to="./UserRegistration">
          <div class="containerItem">用户管理</div>
        </router-link>
        <router-link to="./Login"><div class="containerItem">用户登录</div></router-link>
      </div>

      <div class="login-footer">版权所有：@copyright 江阳驴子</div>
    </div>

    <RouterView />
  </div>
</template>

<style scoped>
.welcome-header {
  display: flex;
  height: 100px;
  padding: 10px;
  width: 70%;
  margin: 0px auto 0px auto;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

/* 头部容器窗口 */
.MessageLeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
}

/* 头部导航按钮式样 */
.header-btns {
  height: 38px;
  display: flex;
  justify-content: space-around;
  margin-right: 25px;
  margin-top: 22px;
}

.header-btns:deep(.layui-btn-danger) {
  background: rgba(255, 255, 255, 0.1);
  border: none;
}

/* 头部导航图标文字式样 */
.icon {
  width: 250px;
  height: 60px;
  margin-left: 25px;
  margin-top: 20px;
  display: flex;
}

.iconImg {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 6px rgba(255, 255, 255, 0.3);
  /* overflow: hidden; */
}

.iconImg img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.icoCon {
  width: 200px;
  height: 60px;
  margin-left: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
}

.icoCon p {
  padding-top: 5;
}

.icoCon h2 {
  font-weight: 400;
}

.welcome-logo,
.welcome-header {
  flex: 1;
}

.welcome-header .welcome-logo img {
  height: 40px;
  margin-top: 0px;
}

.welcome-nav:deep(.layui-btn-danger) {
  background: #00000052;
  border: none;
}

.login-footer {
  height: 60px;
  width: 70%;
  margin: 0px auto;
  line-height: 60px;
  text-align: center;
  font-size: 0.75rem;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
}

.welcome-nav {
  margin: 0;
  padding: 0;
}

.thisBox {
  background: url(../assets/images/login_bg.jpg) no-repeat center;
  background-attachment: fixed; /* 背景固定，内容可滑动 */
  background-size: cover;
  height: 100%;
  width: 100%;
}

.MainContainer {
  position: relative;
  width: 100%;
  height: 100%;
  padding-bottom: 0rem;
  overflow: hidden; /* 隐藏滚动，子容器会滚动，但父容器不会 */
}

.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  align-content: space-evenly;
  width: 70%;
  height: calc(100% - 160px);
  margin: 0 auto;
  gap: 3px;
  overflow-y: auto; /* 仅当需要时滚动子容器 */

  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}

.container::-webkit-scrollbar-thumb {
  color: #00000052;
  background-color: rgba(129, 181, 248, 0.3);
}

.container::-webkit-scrollbar {
  color: #00000052;
  background-color: rgba(0, 0, 0, 0.2);
}

.containerItem {
  display: flex;
  flex: 0 0 16rem; /*****放大 缩小 宽度基数 */
  align-items: center;
  justify-content: center;

  width: 16rem;
  height: 12rem;
  padding: 0 10px;
  border-radius: 5px;

  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: aliceblue;

  background-color: rgba(129, 181, 248, 0.5);
  box-shadow: 9px 6px 9px rgba(0, 0, 0, 0.5);
}
</style>
