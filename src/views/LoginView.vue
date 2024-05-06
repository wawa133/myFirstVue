<template>
  <div class="thisBox">
    <lay-container class="container">
      <div class="login-header">
        <!-- <div class="header-logo">
          <img src="../assets/images/leader.jpg" alt="图片" />
        </div> -->
        <!-- <div class="header-btns">
          <lay-button type="danger" @click="() => router.push('/')">返回首页</lay-button>
          <lay-button type="danger" @click="() => router.push('/UserRegistration')"
            >注册账号</lay-button
          >
        </div> -->
      </div>
      <div class="login-panel">
        <div class="content-panel">
          <div class="login-logo">
            <img src="../assets/images/leader.jpg" alt="图片" />
          </div>
          <div class="split-line"></div>
          <div class="login-content">
            <div class="tab-items">
              <div
                @click="(e) => (currentSelectTab = 0)"
                class="tab-item"
                :class="currentSelectTab === 0 ? 'tab-item-selected' : ''"
              >
                账号密码登录
              </div>
              <div
                @click="(e) => (currentSelectTab = 1)"
                class="tab-item"
                :class="currentSelectTab === 1 ? 'tab-item-selected' : ''"
              >
                短信验证登录
              </div>
            </div>
            <div>
              <UsernameLoginVue v-if="currentSelectTab === 0"></UsernameLoginVue>
              <PhoneCodeLogin v-else></PhoneCodeLogin>
            </div>
          </div>
        </div>
      </div>
      <div class="login-footer">版权所有：@copyright 江阳驴子</div>
    </lay-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
//import { RouterLink } from "vue-router";
//import { useRouter } from "vue-router";
//import { layer } from '@layui/layer-vue'
import UsernameLoginVue from "../components/UserLogin/UsernameLogin.vue";
import PhoneCodeLogin from "../components/UserLogin/PhoneCodeLogin.vue";
// import { useUserStore } from "../stores";
// const userStore = useUserStore();

const currentSelectTab = ref(0);

//----
</script>

<style scoped>
.thisBox {
  background: url(../assets/images/login_bg.jpg) no-repeat center;
  background-size: cover;
  height: 100%;
  width: 100%;
}

.container {
  width: 100% !important;
  height: 100% !important;
}

/* vvv */

.layui-container {
  padding: 0;
}

.login-panel {
  width: 100%;
  height: 100%;
  /* background: linear-gradient(159deg, #1f6fc7, #2196f3, #1177c9); */
  display: flex;
  justify-items: center;
  align-items: center;
}

.content-panel {
  background: #fff;
  border-radius: 10px;
  margin: 0 auto;
  width: 50vw;
  height: 50vh;
  box-shadow: 0 0 13px 2px #7c7c7c9e;
  display: flex;
  min-width: 545px !important;
}

.login-logo {
  width: 40%;
  text-align: center;
  display: flex;
  justify-items: center;
  align-items: center;
  /* @media screen and (max-width: 600px) {
    display: none !important;
  } */
}

@media screen and (max-width: 600px) {
  .login-logo {
    display: none !important;
  }
}

.login-logo img {
  margin: 0 auto;
  width: 200px;
}

.split-line {
  width: 1px;
  height: 100%;
  background: linear-gradient(182deg, #02835300, #03a9f4, #02835300);
}

.login-content {
  flex: 1;
  padding: 20px;
  padding-top: 40px;
  height: 100%;
}

.tab-items {
  width: 300px;
  height: 35px;
  line-height: 35px;
  display: flex;
  text-align: center;
  margin: 0 auto;
  font-size: 1rem;
}

.tab-items .tab-item {
  flex: 1;
  cursor: pointer;
}

.tab-items .tab-item-selected {
  color: #e91e63;
}

.login-header {
  position: fixed;
  height: 60px;
  padding: 10px;
  display: flex;
  width: calc(100% - 20px);
}

.login-header .header-logo {
  flex: 1;
}

.login-header .header-logo img {
  height: 60px;
}

.login-footer {
  position: fixed;
  height: 40px;
  width: 100%;
  bottom: 0px;
  line-height: 40px;
  text-align: center;
  font-size: 0.75rem;
  color: #fff;
}

.header-btns:deep(.layui-btn-danger) {
  background: #00000052;
  border: none;
}
</style>
