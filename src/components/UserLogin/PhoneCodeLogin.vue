<!--
 * @Description: 
 * @Author: liutq
 * @Date: 2024-03-08 23:23:39
 * @LastEditTime: 2024-03-31 22:23:02
 * @LastEditors: liutq
 * @Reference: 
-->
<template>
  <div class="phonecode-login">
    <lay-form :model="loginData" ref="phonecodeForm" :rules="rules" required>
      <lay-form-item label="账号：" prop="account" size="lg">
        <lay-input
          v-model="loginData.account"
          placeholder="请输入账号"
          suffix-icon="layui-icon-username"
        ></lay-input>
      </lay-form-item>
      <lay-form-item label="短信码：" prop="smscode" size="lg">
        <div class="flex">
          <div class="flex-item">
            <lay-input
              v-model="loginData.smscode"
              type="smscode"
              placeholder="请输入短信验证码"
              suffix-icon="layui-icon-password"
            ></lay-input>
          </div>
          <div class="smscode">
            <lay-button
              class="smscode-btn"
              @click="getSmsCode"
              type="normal"
              :disabled="smsCodeTime > 0"
              >{{ smsCodeTime > 0 ? smsCodeTime + "秒后再试" : "获取验证码" }}
            </lay-button>
          </div>
        </div>
      </lay-form-item>
      <lay-form-item label="图形码：" prop="captcha">
        <div class="flex">
          <div class="flex-item">
            <lay-input
              v-model="loginData.captcha"
              placeholder="请输入图形验证码"
            ></lay-input>
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
            <router-link to="/GetBackPassWord" style="color: #ff5722"
              >找回密码</router-link
            >
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
import { reactive, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { layer } from "@layui/layer-vue";
import axios from "axios";

//登录表单绑定的数据
const loginData = reactive({
  account: "",
  smscode: "",
  captcha: "",
});
//表单示例
const phonecodeForm = ref();
//表单检验规则
const rules = ref({
  account: {
    type: "string",
  },
  smscode: {
    type: "string",
  },
  captcha: {
    type: "string",
  },
});
//获取验证码的到期时间
const smsCodeTime = ref(0);
/**
 * 验证码获取倒计时
 */
let smsCodeTimer: any = null;

//记住密码
const rememberMe = ref(true);
/**
 *
 */
//const rememberMe = ref(localStorage.getItem("rememberMe") ? localStorage.getItem("rememberMe") == '1' : false);
const rememberMeChange = (e: any) => {
  rememberMe.value = e;
  localStorage.setItem("rememberMe", rememberMe.value.toString());
};

const captchaSrc = ref("http://127.0.0.1:3007/api/captcha?width=120&height=36");
/**
 * 刷新验证码
 */
const refreshCaptcha = () => {
  captchaSrc.value =
    "http://127.0.0.1:3007/api/captcha?width=120&height=36&t_=" + new Date().getTime();
};

const api = {
  getSmsCode: () => {
    // 接口
    // 创建axios实例
    const service = axios.create({
      baseURL: "http://localhost:3007", //process.env.VUE_APP_BASE_API, // api的base_url
      timeout: 5000, // 请求超时时间
      method: "post",
      url: "/my/area/getinfo",
      headers: { Authorization: localStorage.getItem("token") || "" },
      withCredentials: true,
      data: {
        //传送服务器 自定义数据部分
        methord: "get",
        area: {
          Level: 1,
          areaName: "四川省",
          areaID: 1,
          rootAreaID: [-1, 1],
          rootAreaName: ["区域根-ROOT", "四川省"],
        },
        page: 1,
        limit: 10,
      },
    });

    service.interceptors.request.use(
      (config) => {
        // 可以在这里添加请求头等信息
        // if (store.getters.token) {
        //   config.headers['X-Token'] = getToken();
        // }
        return config;
      },
      (error) => {
        // 请求错误处理
        console.log(error); // for debug
        Promise.reject(error);
      }
    );

    // 响应拦截器
    service.interceptors.response.use(
      (response) => {
        // 对响应数据做处理，例如只返回data部分
        const res = response.data;
        // if (res.code !== 20000) {
        //   Message({
        //     message: res.message,
        //     type: 'error',
        //     duration: 5 * 1000
        //   });
        //   // 50001: 非法的token; 50002: 其他客户端错误; 50003: 认证失败; 50004: 授权失败; 50005: 未找到用户
        //   if (res.code === 50001 || res.code === 50002 || res.code === 50003 || res.code === 50004 || res.code === 50005) {
        //     // 移除token
        //     resetToken();
        //     // 跳转到登录页面
        //     location.reload();
        //   }
        //   return Promise.reject('error');
        // } else {
        //   return res;
        // }
        return response;
      },
      (error) => {
        console.log("err" + error); // for debug
        // Message({
        //   message: error.message,
        //   type: 'error',
        //   duration: 5 * 1000
        // });
        return Promise.reject(error);
      }
    );
    return service.post("/my/area/getinfo");
  },
  loginBySmsCode: (a: any, b: any, c: any) => {
    // 接口
    // 创建axios实例
    const service = axios.create({
      baseURL: "http://localhost:3007", //process.env.VUE_APP_BASE_API, // api的base_url
      timeout: 5000, // 请求超时时间
      method: "post",
      url: "/my/area/getinfo",
      headers: { Authorization: localStorage.getItem("token") || "" },
      withCredentials: true,
      data: {
        //传送服务器 自定义数据部分
        methord: "get",
        area: {
          Level: 1,
          areaName: "四川省",
          areaID: 1,
          rootAreaID: [-1, 1],
          rootAreaName: ["区域根-ROOT", "四川省"],
        },
        page: 1,
        limit: 10,
        params: { a, b, c },
      },
    });

    service.interceptors.request.use(
      (config) => {
        // 可以在这里添加请求头等信息
        // if (store.getters.token) {
        //   config.headers['X-Token'] = getToken();
        // }
        return config;
      },
      (error) => {
        // 请求错误处理
        console.log(error); // for debug
        Promise.reject(error);
      }
    );

    // 响应拦截器
    service.interceptors.response.use(
      (response) => {
        // 对响应数据做处理，例如只返回data部分
        const res = response.data;
        // if (res.code !== 20000) {
        //   Message({
        //     message: res.message,
        //     type: 'error',
        //     duration: 5 * 1000
        //   });
        //   // 50001: 非法的token; 50002: 其他客户端错误; 50003: 认证失败; 50004: 授权失败; 50005: 未找到用户
        //   if (res.code === 50001 || res.code === 50002 || res.code === 50003 || res.code === 50004 || res.code === 50005) {
        //     // 移除token
        //     resetToken();
        //     // 跳转到登录页面
        //     location.reload();
        //   }
        //   return Promise.reject('error');
        // } else {
        //   return res;
        // }
        return response;
      },
      (error) => {
        console.log("err" + error); // for debug
        // Message({
        //   message: error.message,
        //   type: 'error',
        //   duration: 5 * 1000
        // });
        return Promise.reject(error);
      }
    );
    return service.post("/my/area/getinfo");
  },
};

/**
 * 获取短信验证码// 接口
 */

const getSmsCode = () => {
  let account = loginData.account;
  if (!account) {
    layer.msg("账号不能为空");
    return;
  }
  if (smsCodeTime.value > 0) {
    layer.msg(smsCodeTime.value + "秒之后再试");
    return;
  }
  let loadding = layer.load(0);
  api
    .getSmsCode() //getSmsCode(account)
    .then((res) => {
      console.log(res);
      layer.close(loadding);
      // if (!res || res.status != 200 || !res.data || res.data.code != 200) {
      //   layer.msg(res.data.msg ? res.data.msg : "验证码获取异常", {
      //     icon: 2,
      //     time: 1000,
      //   });
      //   return;
      // }
      //启动验证码获取倒计时
      smsCodeTime.value = 60;
      smsCodeTimer = setInterval(() => {
        smsCodeTime.value--;
        if (smsCodeTime.value <= 0) {
          clearInterval(smsCodeTimer);
          smsCodeTime.value = 0;
          smsCodeTimer = null;
        }
      }, 1000);

      layer.notify({
        title: "提示",
        content: res.data.msg,
        icon: 1,
      });
    })
    .catch((error) => {
      layer.close(loadding);
      layer.msg(error.message, { icon: 2, time: 1000 });
    });
};
/**
 * 提交表单，完成登录
 */
const submit = () => {
  let loadding = layer.load(0);
  phonecodeForm.value.validate((isValidate: boolean, model: any, errors: any) => {
    console.log(isValidate, model, errors);
    if (!isValidate) {
      layer.close(loadding);
      layer.msg(errors[0].message, { icon: 2, time: 1000 });
      return;
    }
    layer.close(loadding);
    layer.msg(`验证登录成功${isValidate}`, { time: 2000 });

    // 调用接口完成登录,登录成功后如果是选中了记住账号，则自动保存账号密码到本地
    api
      .loginBySmsCode(loginData.account, loginData.smscode, loginData.captcha)
      .then((res) => {
        console.log(res);
        refreshCaptcha();
        layer.close(loadding);
        // if (
        //   !res ||
        //   res.status != 200 ||
        //   !res.data ||
        //   !res.data.data ||
        //   res.data.code != 200
        // ) {
        //   layer.msg(res.data.msg ? res.data.msg : "登录失败", { icon: 2, time: 1000 });
        //   return;
        // }
        // let userInfo = res.data.data;
        // let token = res.headers["token"];
        // if (!userInfo || !token) {
        //   layer.msg("登录失败", { icon: 2, time: 1000 });
        //   return;
        // }
        //检测是否记录账号，如果需要记录，则记录到本地
        localStorage.setItem("rememberMe", rememberMe.value ? "1" : "0");
        if (rememberMe.value) {
          localStorage.setItem("account", loginData.account);
        }
        // console.log("登录成功", userInfo, token);
        // 存储登录状态
        // userStore.login(userInfo, token);
        //并转到首页
        // router.push({
        //   path: "/",
        // });
      })
      .catch((error) => {
        refreshCaptcha();
        layer.close(loadding);
        layer.msg(error.message, { icon: 2, time: 1000 });
      });
  });
};
onMounted(() => {
  //读取本地存储的账号信息
  let rememberMe_ = localStorage.getItem("rememberMe");
  rememberMe.value = rememberMe_ == "true" ? true : false;
  if (rememberMe.value) {
    //记住账号密码了，则读取账号密码
    let account_ = localStorage.getItem("account");
    loginData.account = account_ || "";
  }
});
onUnmounted(() => {
  //停止定时器
  smsCodeTimer && clearInterval(smsCodeTimer);
});
</script>

<style scoped>
.phonecode-login {
  width: 100%;
  margin: 0 auto;
  padding-top: 40px;
}

/* .phonecode-login:deep(.layui-form-label), */
.phonecode-login:deep(.layui-form-label),
.phonecode-login:deep(input) {
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

.smscode {
  width: 120px;
}

.smscode-btn {
  margin-left: 5px;
  width: 115px;
}

.resetpwd {
  text-align: right;
  font-size: 0.875rem;
  line-height: 36px;
}
</style>
