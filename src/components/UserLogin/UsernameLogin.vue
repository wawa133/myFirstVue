<!--
 * @Description: 
 * @Author: liutq
 * @Date: 2024-03-08 23:22:50
 * @LastEditTime: 2024-04-14 17:26:10
 * @LastEditors: liutq
 * @Reference: 
-->
<template>
  <div class="username-login">
    <lay-form :model="loginData" ref="usernameForm" :rules="rules" required>
      <lay-form-item label="账号：" prop="account" size="lg">
        <lay-input
          v-model="loginData.account"
          placeholder="请输入账号"
          suffix-icon="layui-icon-username"
        ></lay-input>
      </lay-form-item>
      <lay-form-item label="密码：" prop="password" size="lg">
        <lay-input
          v-model="loginData.password"
          type="password"
          placeholder="请输入密码"
          suffix-icon="layui-icon-password"
          autocomplete="off"
        ></lay-input>
      </lay-form-item>
      <lay-form-item label="验证码：" prop="captcha">
        <div class="flex">
          <div class="flex-item">
            <lay-input v-model="loginData.captcha" placeholder="请输入验证码"></lay-input>
          </div>
          <div class="captcha">
            <img :src="captchaSrc" @click="refreshCaptcha" alt="图片" />
          </div>
        </div>
      </lay-form-item>
      <lay-form-item label="">
        <div class="flex">
          <div class="flex-item">
            <lay-checkbox
              name="like"
              skin="primary"
              v-model="rememberMe"
              value="1"
              label="记住账号"
              @change="rememberMeChange"
            ></lay-checkbox>
          </div>
          <div class="flex-item resetpwd">
            <router-link to="/WellCom" style="color: #ff5722">返回首页</router-link>
            <router-link to="/UserRegistration" style="margin-left: 10px; color: #16baaa"
              >注册账号</router-link
            >
          </div>
        </div>
      </lay-form-item>
      <lay-form-item style="text-align: center">
        <lay-button class="submit-btn" @click="submit" type="normal">提交</lay-button>
      </lay-form-item>
    </lay-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { useRouter } from "vue-router";
import { layer } from "@layui/layer-vue";
import userInfo from "@/api/userInfo";
//import { validate } from "async-validator";

import { useUserStore } from "../../stores";
const userStore = useUserStore();

const router = useRouter();

//获取验证码
const captchaSrc = ref("http://localhost:3007/api/captcha?width=120&height=36");

//登录表单绑定的数据
const loginData = reactive({
  account: "",
  password: "",
  captcha: "",
});
//表单示例
const usernameForm = ref();
//记住密码
const rememberMe = ref(true);
//表单检验规则
import type { RuleItem } from "../../../node_modules/.pnpm/async-validator@4.2.5/node_modules/async-validator/dist-types/interface";
//RuleItem[]
interface RuleItem1 extends RuleItem {
  trigger?: string;
}
const rules: Record<string, RuleItem1[]> = {
  account: [
    {
      required: true,
      type: "string",
      message: "请输入用户名",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      type: "string",
      message: "请输入密码",
      trigger: "blur",
    },
    {
      min: 6,
      max: 20,
      message: "密码长度为6-20个字符",
      trigger: "blur",
    },
  ],
  captcha: [
    {
      required: true,
      type: "string",
      message: "请输入验证码",
      trigger: "blur",
    },
  ],
};
/**
 * 提交表单
 */
const submit = () => {
  //表单验证
  usernameForm.value.validate((valid: any, model: any, errors: any) => {
    // console.log(valid, model, errors);
    //validate

    if (!valid) {
      layer.msg(errors[0].message, { icon: 2, time: 1000 });
      return;
    }
  });

  //解决跨域访问时后台 SESSION 丢失问题 + 需要与服务器端的 cors 设置一起使用
  // 要注意，当设置了 Access-Control-Allow-Credentials 为 true 时，Access-Control-Allow-Origin 不能为 *
  // 也是出于一种安全策略，比如：在cookie中存取的是用户的登录信息，又不限制客户端的请求来源，他人获取到
  // cookie以后则可随意发起请求，登录该用户账号，损害用户权益
  // withCredentials 应与 服务端响应Access-Control-Allow-Credentials（可选） 属性应保持一致
  //axios.defaults.withCredentials = true;  浏览器告知服务器，我需要设置cookie。
  userInfo.login({
    username: loginData.account,
    password: loginData.password,
    captcha: loginData.captcha,
    callbackLogin: (res: {
      user: any;
      area: any;
      token: string;
      unit: any;
      msg: any;
    }) => {
      // 登录成功提示
      layer.msg(res.msg ? res.msg : "登录成功", {
        icon: 1,
        time: 1000,
      });
      // 数据 pinia 仓库保存
      userStore.$patch({
        id: res.user.id,
        name: res.user.name,
        nickName: res.user.nickName,
        areaData: res.area,
        unitData: res.unit,
        leaderAreaData: res.area,
        leaderUnitData: res.unit,
        userLoginInfo: res.user.userLoginInfo,
      });
      // 数据的本地保存
      localStorage.setItem("token", res.token);
      if (rememberMe.value) {
        localStorage.setItem("account", loginData.account);
        localStorage.setItem("password", loginData.password);
      }
      // 登录成功跳转到首页
      router.push({
        path: "/",
      });
    },
    callbackLoginErr: () => {
      refreshCaptcha();
    },
  });
};

//const rememberMe = ref(localStorage.getItem("rememberMe") ? localStorage.getItem("rememberMe") == '1' : false);
const rememberMeChange = (e: any) => {
  rememberMe.value = e;
  localStorage.setItem("rememberMe", rememberMe.value.toString());
};

//刷新验证码
const refreshCaptcha = () => {
  captchaSrc.value =
    "http://localhost:3007/api/captcha?width=120&height=36&t_=" + new Date().getTime();
};

// 加载初始化数据
onMounted(() => {
  //读取本地存储的账号信息
  let rememberMe_ = localStorage.getItem("rememberMe");
  rememberMe.value = rememberMe_ == "true" ? true : false;
  //记住账号密码了，则读取账号密码
  if (rememberMe.value) {
    let account_ = localStorage.getItem("account");
    let password_ = localStorage.getItem("password");
    loginData.account = account_ || "";
    loginData.password = password_ || "";
  }
  refreshCaptcha();
});
</script>

<style scoped>
.username-login {
  width: 90%;
  margin: 0 auto;
  padding-top: 40px;
}

.username-login:deep(.layui-form-label),
.username-login:deep(input) {
  font-size: 0.875rem;
}

.submit-btn {
  width: 78%;
  margin-left: 0 auto;
  --button-border-radius: 35px;
}

.captcha {
  width: 120px;
}

.captcha img {
  width: 100%;
  cursor: pointer;
}

.resetpwd {
  text-align: right;
  font-size: 0.875rem;
  line-height: 36px;
}
</style>
