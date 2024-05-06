<template>
  <div class="thisBox">
    <div class="navContainer">
      <div class="navContent">
        <!-- 头部区域显示部分 -->
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
        <!-- 内容列表中间整体部分 -->
        <div class="MessageContent">
          <!-- 内容列表左面部分 -->
          <div class="LeftMenu">
            <div class="menuItem">
              <div class="btn">
                <div
                  class="btnItem"
                  :class="{ btnItem1: AreaLeaderT, btnItem2: !AreaLeaderT }"
                  @click="ChangeAreaLeaderClass"
                ></div>
                <div
                  class="btnItem"
                  :class="{ btnItem1: !AreaLeaderT, btnItem2: AreaLeaderT }"
                  @click="ChangeAreaLeaderClass"
                ></div>
              </div>
              <div class="con coon">点击切换区域|单位</div>
            </div>
            <div class="line"></div>
            <!-- 区域下面子选单 -->
            <div v-if="AreaLeaderT">
              <!-- 区域选择列表 -->
              <div class="title">
                <p>区域选择</p>
              </div>
              <div class="menu">
                <div
                  class="menuItem"
                  v-for:="(data, key) in areaNavData"
                  :key="data.id"
                  @click="NavClick(key)"
                >
                  <div class="light"></div>
                  <div class="lIcon">
                    <span class="iconFont" :class="NavIcon[key]"></span>
                  </div>
                  <div class="con">{{ data.name }}</div>
                  <div class="ricon">
                    <span class="iconFont" :class="NavIcon[key]"></span>
                  </div>
                </div>
              </div>
              <!-- 可选区域列表 -->
              <div class="line"></div>
              <div class="title">
                <p>区域可选</p>
              </div>
              <div class="server">
                <div
                  class="menuItem"
                  v-for:="(data, key) in areaData"
                  :key="data.id"
                  @click="areaDataClick(data)"
                >
                  <div class="light"></div>
                  <div class="lIcon">
                    <span class="iconFont icon-wpforms"></span>
                  </div>
                  <div class="con">{{ key }}:{{ data.name }}</div>
                  <div class="ricon"></div>
                </div>
              </div>
            </div>
            <!-- 单位下面子选单 -->
            <div v-if="!AreaLeaderT">
              <!-- 选中单位列表部分 -->
              <div class="title">
                <p>单位选择</p>
              </div>

              <div class="menu">
                <div
                  class="menuItem"
                  v-for:="(data, key) in unitNavData"
                  :key="data.id"
                  @click="NavUnitClick(key)"
                >
                  <div class="light"></div>
                  <div class="lIcon">
                    <span class="iconFont" :class="NavIcon[key]"></span>
                  </div>
                  <div class="con">{{ data.name }}</div>
                  <div class="ricon">
                    <span class="iconFont" :class="NavIcon[key]"></span>
                  </div>
                </div>
              </div>
              <!-- 单位可选列表部分 -->
              <div class="line"></div>
              <div class="title">
                <p>单位可选</p>
              </div>
              <div class="server">
                <div
                  class="menuItem"
                  v-for:="(data, key) in unitData"
                  :key="data.id"
                  @click="unitDataClick(data)"
                >
                  <div class="light"></div>
                  <div class="lIcon">
                    <span class="iconFont icon-plus-squared-alt"></span>
                  </div>
                  <div class="con">{{ data.name }}</div>
                  <div class="ricon"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- 内空列表右面部分 -->
          <div class="RightContent">



            <!-- 表头导航 -->
            <div class="rightLeader">
              <div class="leaderItem">
                <lay-breadcrumb separator-icon="layui-icon-right">
                  <lay-breadcrumb-item
                    v-for:="(data, key) in leaderNavData"
                    @click="NavUnitClick(key)"
                    :key="nanoid()"
                  >
                    {{ data.name }}
                  </lay-breadcrumb-item>
                </lay-breadcrumb>
              </div>
              <div class="leaderContent">
                <lay-space size="md">
                  <lay-tag
                    v-for:="(data, key) in unitData"
                    :key="nanoid()"
                    @click="unitDataClick(data)"
                  >
                    <template #icon>
                      <lay-icon type="layui-icon-vercode" />
                    </template>
                    {{ data.name }}
                  </lay-tag>
                </lay-space>
              </div>
            </div>
            <!-- 条件过滤表单 -->
            <div class="filterContainer">
              <lay-form :model="searchFilter" :pane="true" onsubmit="return false;">
                <lay-form-item label="条件过滤" prop="filterStr">
                  <lay-input
                    v-model="searchFilter.filterStr"
                    @change="submitFilterStr"
                    placeholder="条件过滤输入"
                  ></lay-input>
                </lay-form-item>
              </lay-form>
            </div>
            <!-- 列表部分 -->
            <div class="ContentList">
              <lay-table
                max-height="1000px"
                :auto-col-width="true"
                :page="page"
                :columns="columns8"
                :data-source="tableData"
                even
                v-model:selected-keys="selectedKeys"
                @change="change"
                @row-double="rowDouble"
              >
                <template #status="{ row }">
                  <lay-switch :model-value="row.status"></lay-switch>
                </template>
                <template v-slot:toolbar>
                  <lay-button size="sm" type="primary" @click="addData">新增</lay-button>
                  <lay-button size="sm" @click="delSelectRows">删除</lay-button>
                </template>
                <template v-slot:operator="{ row }">
                  <lay-button size="xs" type="primary" @click="editData(row)"
                    >编辑</lay-button
                  >
                  <lay-button size="xs" type="primary" @click="removeData(row)"
                    >删除</lay-button
                  >
                </template>
              </lay-table>
            </div>


            
          </div>
        </div>
        <!-- 网页底部部分 -->
        <div class="footer">版权所有：@copyright 江阳驴子</div>
      </div>
    </div>
  </div>

  <!-- 弹出模态框部分 -->
  <lay-layer
    v-model="areaFormVisible"
    :shade="false"
    :area="['400px', '380px']"
    :btn="areaFormAction"
  >
    <div style="padding: 20px">
      <lay-form :model="userInfoWidthForm" ref="userFROMrEF">
        <lay-form-item label="帐号" prop="loginName" required>
          <lay-input v-model="userInfoWidthForm.loginName"></lay-input>
        </lay-form-item>
        <lay-form-item label="姓名" prop="userName">
          <lay-input v-model="userInfoWidthForm.userName"></lay-input>
        </lay-form-item>
        <lay-form-item label="联系电话" prop="telNum">
          <lay-input v-model="userInfoWidthForm.telNum"></lay-input>
        </lay-form-item>
        <lay-form-item label="电子邮箱" prop="email">
          <lay-input v-model="userInfoWidthForm.email"></lay-input>
        </lay-form-item>
        <!-- <lay-form-item label="描述" prop="desc">
          <lay-textarea
            placeholder="请输入描述"
            v-model="userInfoWidthForm.desc"
          ></lay-textarea>
        </lay-form-item> -->
      </lay-form>
    </div>
  </lay-layer>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, reactive, ref } from "vue";
import { layer } from "@layui/layer-vue";
import { nanoid } from "nanoid";
import { useUserStore } from "../stores";
import axios from "axios";
const userStore = useUserStore();

// 导航图标
const NavIcon = reactive([
  "icon-th",
  "icon-th-list",
  "icon-th-large",
  "icon-folder-empty",
  "icon-wpforms",
  "icon-wpforms",
  "icon-wpforms",
  "icon-wpforms",
  "icon-wpforms",
  "icon-wpforms",
  "icon-wpforms",
  "icon-wpforms",
  "icon-wpforms",
]);

// 定义网页表格数据数组变量【表格】
const tableData = ref<Array<tableDataType>>([]);
interface tableDataType {
  id: number;
  telNum: string;
  userName: string;
  loginName: string;
  email: string;
  lev: number;
}

// 表头导航响应式工作变量
let leaderNavData = ref<Array<unitDataType>>([]);
// 定义网页表格数据数组变量【表格】
let unitNavData = reactive<Array<unitDataType>>([]);
let unitData = ref<Array<unitDataType>>([]);
interface unitDataType {
  id: number;
  areaId: number;
  name: string;
  desc: string;
  city: string;
  lev: number;
}

// 定义区域导航选单数据变量【导航栏】
let areaNavData = reactive<Array<areaDataType>>([]);
const areaData = ref<Array<areaDataType>>([]);
interface areaDataType {
  id: number;
  name: string;
  desc: string;
  lev: number;
}

// 数据表页导航条变量
const page = reactive({ current: 1, limit: 10, total: 100 });
const pageArea = reactive({ current: 1, limit: 10, total: 100 });
const pageUnit = reactive({ current: 1, limit: 10, total: 100 });

const router = useRouter();
const AreaLeaderT = ref(true);
//条件过滤框 条件字符串
const searchFilter = reactive({
  filterStr: "",
});

const loading = ref(false);
const selectedKeys = ref([]);

// 新建区域模态框娈量及函数部分
const areaFormVisible = ref(false);

// 新增和修改数据的数据定义部分
const userInfoWidthForm = reactive({
  id: -2,
  areaId: -2,
  userName: "",
  loginName: "",
  telNum: null,
  email: "",
});

onMounted(() => {
  // 这里的代码会在组件被挂载到DOM后执行
  areaNavData = [...userStore.areaData];
  unitNavData = [...userStore.unitData];
  leaderNavData.value = [...userStore.unitData];
  loadAreaDataSource();
  loadUnitDataSource();
});

// 新增和修改数据确认代码
const areaFormAction = ref([
  {
    text: "确认",
    callback: () => {
      //layer.confirm("确认操作", { shade: false });
      editRecorderData(userInfoWidthForm);
      areaVisibleChange();
    },
  },
  {
    text: "取消",
    callback: () => {
      areaVisibleChange();
    },
  },
]);

// 左侧导航显隐控制切换函数
const areaVisibleChange = () => {
  areaFormVisible.value = !areaFormVisible.value;
};

// 删除所有选中的数据
const delSelectRows = () => {
  let selectedKeysArr: any = [];
  selectedKeys.value.forEach((item: any) => {
    tableData.value.forEach((item2: any) => {
      if (item == item2.id) {
        selectedKeysArr.push(item2);
      }
    });
  });

  if (selectedKeysArr.length == 0) {
    layer.msg("请选择要删除的数据", { area: "50%" });
    return;
  }

  delSelectRowsConfirm(selectedKeysArr);
};
const delSelectRowsConfirm = (rows: any) => {
  layer.confirm("是否确认删除--确认将删除该项及其下所有子域数据", {
    btn: [
      {
        text: "确认删除",
        callback: (id: any) => {
          delRecorders(rows);
          layer.close(id);
        },
      },
      {
        text: "取消",
        callback: (id: any) => {
          layer.close(id);
        },
      },
    ],
  });
};

// 左侧树形结构导航点击事件
const NavClick = (sn: any) => {
  areaNavData = areaNavData.slice(0, sn + 1);
  loadAreaDataSource();
};

// 左侧树形结构导航点击事件
const NavUnitClick = (sn: any) => {
  unitNavData = unitNavData.slice(0, sn + 1);
  leaderNavData.value = [...unitNavData];
  loadUnitDataSource();
};

// 左侧树形结构菜单点击事件
const areaDataClick = (item: any) => {
  areaNavData.push(item);
  loadAreaDataSource();
};

// 左侧树形结构菜单点击事件
const unitDataClick = (item: any) => {
  unitNavData.push(item);
  leaderNavData.value.push(item);
  loadUnitDataSource();
};

// 数据表数据行双击事件
const rowDouble = (row: any) => {
  layer.msg(row, { area: "50%" });
};

// 新增记录
const addData = () => {
  userInfoWidthForm.userName = "";
  userInfoWidthForm.loginName = "";
  userInfoWidthForm.email = "";
  userInfoWidthForm.id = -2;
  userInfoWidthForm.telNum = null;
  areaVisibleChange();
};

// 数据修改
const editData = (e: any) => {
  console.log(e);
  userInfoWidthForm.userName = e.userName;
  userInfoWidthForm.loginName = e.loginName;
  userInfoWidthForm.email = e.email;
  userInfoWidthForm.id = e.id;
  userInfoWidthForm.telNum = e.telNum;
  areaVisibleChange();
};

// 删除数据
const removeData = (row: any) => {
  delRecorderConfirm(row);
};
const delRecorderConfirm = (row: any) => {
  layer.confirm("是否确认删除该用户数据（确认删除数据将无法恢复）", {
    btn: [
      {
        text: "确认删除",
        callback: (id: any) => {
          delRecorders([row]);
          layer.close(id);
        },
      },
      {
        text: "取消",
        callback: (id: any) => {
          layer.close(id);
        },
      },
    ],
  });
};

// 数据表改变事件
const change = () => {
  //page: any
  loading.value = true;
  loadUnitDataSource();
};

//条件过滤筛选执行函数
const submitFilterStr = function (e: string) {
  const el = typeof e == "string" ? e : "";
  layer.msg(`加载过滤数据【${el}】中...`);
};

// 区域|单位显示切换函数
const ChangeAreaLeaderClass = function (e: any) {
  if (e === null) return;
  if (!e.target.classList.contains("btnItem1")) {
    AreaLeaderT.value = !AreaLeaderT.value;
  }
};

// 数据表工选项设置
const columns8 = [
  { title: "选项", width: "55px", type: "checkbox", fixed: "left" },
  {
    title: "ID",
    width: "60px",
    key: "id",
  },
  {
    title: "帐号",
    width: "80px",
    key: "loginName",
  },
  {
    title: "用户名",
    width: "80px",
    key: "userName",
  },
  {
    title: "联系电话",
    width: "110px",
    key: "telNum",
  },
  {
    title: "email",
    key: "email",
  },
  {
    title: "操作",
    width: "105px",
    customSlot: "operator",
    key: "operator",
    fixed: "right",
    ignoreExport: true,
  },
];

// 从后台获取数据源【区域】
const delRecorders = (RecorderObj: any) => {
  // 数据处理及初始化 userName
  let RecorderID: any = [];
  let RecorderName: any = [];
  RecorderObj.forEach((item: any) => {
    RecorderID.push(item.id);
    RecorderName.push(item.loginName);
  });

  let arrayunitID: any = [];
  let arrayunitName: any = [];
  unitNavData.forEach((item: any) => {
    arrayunitID.push(item.id);
    arrayunitName.push(item.name);
  });

  // axios 与服务器端数据交互 及 返回数据处理
  axios({
    method: "post",
    url: "http://localhost:3007/my/users/getinfo",
    //当需要跨域传送 JWT-TOKEN-cookies 令牌时，需要这个参数，并在服务器端设置对应的头部信息
    headers: { Authorization: localStorage.getItem("token") || "" },
    //浏览器告知服务器，我需要设置cookie，包括session-cookie\JWT-token-cookie等
    withCredentials: true,
    data: {
      //传送服务器 自定义数据部分
      methord: "deluser",
      ids: RecorderID,
      names: RecorderName,
      unit: {
        ids: arrayunitID,
        names: arrayunitName,
      },
    },
  })
    .then((res) => {
      // 成功 服务器返回数据处理
      if (res.data.status !== 1) {
        loadUserDataSource();
        return layer.msg(`${res.data.msg}`, { area: "50%", time: 5000 });
      }
      //console.log(res.data.data.affectedRows);
      let total = 0;
      res.data.data.affectedRows.forEach((item: any) => {
        total += item;
      });
      layer.msg(`删除数据${res.data.msg}，共删除${total}条`, { area: "50%", time: 3000 });
      loadUserDataSource();
    })
    .catch((err) => {
      console.log(err);
    });
  //return response;
};

// 从后台获取数据源【区域】
const editRecorderData = (RecorderObj: any) => {
  // 数据处理及初始化
  let ids: any = [];
  let names: any = [];
  unitNavData.forEach((item: any) => {
    ids.push(item.id);
    names.push(item.name);
  });

  //console.log(ids, names);
  // axios 与服务器端数据交互 及 返回数据处理
  axios({
    method: "post",
    url: "http://localhost:3007/my/users/getinfo",
    //当需要跨域传送 JWT-TOKEN-cookies 令牌时，需要这个参数，并在服务器端设置对应的头部信息
    headers: { Authorization: localStorage.getItem("token") || "" },
    //浏览器告知服务器，我需要设置cookie，包括session-cookie\JWT-token-cookie等
    withCredentials: true,
    data: {
      //传送服务器 自定义数据部分 RecorderObj = userInfoWidthForm
      // userInfoWidthForm.userName = "";
      // userInfoWidthForm.loginName = "";
      // userInfoWidthForm.email = "";
      // userInfoWidthForm.id = -2;
      // userInfoWidthForm.telNum = null;
      methord: RecorderObj.id > 0 ? "setuser" : "adduser",
      unit: {
        ids: ids,
        names: names,
      },
      userInfo: {
        userName: RecorderObj.userName,
        loginName: RecorderObj.loginName,
        email: RecorderObj.email,
        id: RecorderObj.id,
        telNum: RecorderObj.telNum,
      },
    },
  })
    .then((res) => {
      // 成功 服务器返回数据处理
      //console.log(res.data);
      loadUserDataSource();
      layer.msg(`修改数据${res.data.msg}`, { area: "50%", time: 5000 });
    })
    .catch((err) => {
      console.log(err);
    });
  //return response;
};

// 从后台获取数据源【区域】
const loadUserDataSource = () => {
  // 数据处理及初始化
  loading.value = true;
  let response: any = [];
  // let arrayAreaID: any = [];
  // let arrayAreaName: any = [];
  // areaNavData.forEach((item: any) => {
  //   arrayAreaID.push(item.id);
  //   arrayAreaName.push(item.name);
  // });
  let arrayUnitID: any = [];
  let arrayUnitName: any = [];
  unitNavData.forEach((item: any) => {
    arrayUnitID.push(item.id);
    arrayUnitName.push(item.name);
  });

  //console.log("进入查寻", arrayUnitID);
  // axios 与服务器端数据交互 及 返回数据处理
  axios({
    method: "post",
    url: "http://localhost:3007/my/users/getinfo",
    //当需要跨域传送 JWT-TOKEN-cookies 令牌时，需要这个参数，并在服务器端设置对应的头部信息
    headers: { Authorization: localStorage.getItem("token") || "" },
    //浏览器告知服务器，我需要设置cookie，包括session-cookie\JWT-token-cookie等
    withCredentials: true,
    data: {
      //传送服务器 自定义数据部分
      methord: "getusers",
      unit: {
        ids: arrayUnitID,
        names: arrayUnitName,
      },
      page: {
        num: page.current,
        limit: page.limit, //pag.pageSize
      },
    },
  })
    .then((res) => {
      //console.log("返回数据", res.data);
      // 成功 服务器返回数据处理

      // 失败 跳转登录页面
      if (res.data.status == 1 && res.data.msg == "身份认证失败") {
        setTimeout(() => {
          router.push({
            path: "/Login",
          });
        }, 1000);
        return;
      }

      // 服务器未查寻到数据时 对数据表进行清空
      if (!res.data.data) {
        tableData.value = [...response];
        page.total = 0;
        return;
      }

      // 服务器查寻到数据时 对数据表进行更新
      res.data.data.forEach((item: any) => {
        response.push({
          id: item.id,
          userName: item.nickname,
          loginName: item.username,
          email: item.email,
          telNum: item.telNum,
        });
      });
      tableData.value = [...response];
      page.total = res.data.count;
    })
    .catch((err) => {
      tableData.value = [...response];
      page.total = 0;
      console.log(err);
    });
};

// 从后台获取数据源【区域】
const loadUnitDataSource = () => {
  // 数据处理及初始化
  loading.value = true;
  let response: any = [];
  let arrayAreaID: any = [];
  let arrayAreaName: any = [];
  areaNavData.forEach((item: any) => {
    arrayAreaID.push(item.id);
    arrayAreaName.push(item.name);
  });
  let arrayUnitID: any = [];
  let arrayUnitName: any = [];
  unitNavData.forEach((item: any) => {
    arrayUnitID.push(item.id);
    arrayUnitName.push(item.name);
  });

  // axios 与服务器端数据交互 及 返回数据处理
  axios({
    method: "post",
    url: "http://localhost:3007/my/company/getinfo",
    //当需要跨域传送 JWT-TOKEN-cookies 令牌时，需要这个参数，并在服务器端设置对应的头部信息
    headers: { Authorization: localStorage.getItem("token") || "" },
    //浏览器告知服务器，我需要设置cookie，包括session-cookie\JWT-token-cookie等
    withCredentials: true,
    data: {
      //传送服务器 自定义数据部分
      methord: "getUnit",
      area: {
        level: arrayAreaID.length - 1,
        name: arrayAreaName[arrayAreaID.length - 1],
        id: arrayAreaID[arrayAreaID.length - 1],
        ids: arrayAreaID,
        names: arrayAreaName,
      },
      unit: {
        level: arrayUnitID.length - 1,
        name: arrayUnitName[arrayUnitID.length - 1],
        id: arrayUnitID[arrayUnitID.length - 1],
        ids: arrayUnitID,
        names: arrayUnitName,
      },
      page: {
        num: pageUnit.current,
        limit: pageUnit.limit,
      },
    },
  })
    .then((res) => {
      //console.log(res.data);
      // 成功 服务器返回数据处理

      // 返回数据为空时，对单位数据进行处理
      if (!res.data.data) {
        unitData.value = [...response];
        loadUserDataSource();
        pageUnit.total = 0;
        return;
      }

      // 返回数据不为空时，对单位数据进行处理
      res.data.data.forEach((item: any) => {
        response.push({
          id: item.ID,
          areaId: item.AreaID,
          name: item.Name,
          lev: item.Level,
          desc: "",
        });
      });
      unitData.value = [...response];
      loadUserDataSource();
      pageUnit.total = res.data.count;
    })
    .catch((err) => {
      pageUnit.total = 0;
      console.log(err);
    });
};

// 从后台获取数据源【区域】
const loadAreaDataSource = () => {
  // 数据处理及初始化
  loading.value = true;
  let response: any = [];
  let arrayAreaID: any = [];
  let arrayAreaName: any = [];
  areaNavData.forEach((item: any) => {
    arrayAreaID.push(item.id);
    arrayAreaName.push(item.name);
  });

  // axios 与服务器端数据交互 及 返回数据处理
  axios({
    method: "post",
    url: "http://localhost:3007/my/area/getinfo",
    //当需要跨域传送 JWT-TOKEN-cookies 令牌时，需要这个参数，并在服务器端设置对应的头部信息
    headers: { Authorization: localStorage.getItem("token") || "" },
    //浏览器告知服务器，我需要设置cookie，包括session-cookie\JWT-token-cookie等
    withCredentials: true,
    data: {
      //传送服务器 自定义数据部分
      methord: "get",
      area: {
        Level: arrayAreaID.length - 1,
        areaName: arrayAreaName[arrayAreaID.length - 1],
        areaID: arrayAreaID[arrayAreaID.length - 1],
        rootAreaID: arrayAreaID,
        rootAreaName: arrayAreaName,
      },
      page: pageArea.current, //pageArea.current
      limit: pageArea.limit, //pageSize
    },
  })
    // 服务器成功 服务器返回数据处理
    .then((res) => {
      // 当单位区域为根目录时，对单位区的数据进行刷新
      if (unitNavData.length == 1) {
        loadUnitDataSource();
      }

      // 未获取到有效数据时，对区域区的数据清空
      if (!res.data.data) {
        areaData.value = [...response];
        pageArea.total = 0;
        return;
      }

      // 获取到有效数据时，对区域区的数据进行更新
      res.data.data.forEach((item: any) => {
        response.push({
          id: item.ID,
          name: item.Name,
          lev: item.AreaLevel,
          desc: "",
        });
      });
      areaData.value = [...response];
      pageArea.total = res.data.count;
    })
    .catch((err) => {
      pageArea.total = 0;
      console.log(err);
    });
};
</script>

<style scoped>
/* 表头导航式样部分 */
.rightLeader {
  font-size: 1.3rem;
  overflow: hidden;
  min-height: 100px;
  /* height: 100px; */
  /* height: 40px; */
  transition: 0.5s;
}

.rightLeader:deep(.layui-breadcrumb) a {
  color: rgba(206, 206, 206, 0.9);
  cursor: pointer;
}

/* .rightLeader:hover {
  min-height: 100px;
  height: 100px;
} */

.leaderItem {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  line-height: 30px;
  padding-left: 0.5rem;
  border-bottom: 1px solid #e6e6e6;
  cursor: pointer;
}

.leaderContent {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  line-height: 30px;
  min-height: 60px;
  /* height: 60px; */
  padding: 1rem 1rem;
  /* height: 0px;
  padding: 0rem 0rem; */
  border-bottom: 1px solid #e6e6e6;
  transition: 0.5s;
  /* overflow: hidden; */
}

.leaderContent:deep(.layui-space-item) {
  cursor: pointer;
}

.leaderContent:deep(.layui-space) {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

/* .rightLeader:hover .leaderContent {
  height: 60px;
  padding: 1rem 1rem;
} */
/* 表头导航式样结束 */

/* 外层容器 */
.thisBox {
  padding: 0px 0px;
  background: url(../assets/images/login_bg.jpg) no-repeat center;
  background-size: cover;
  min-width: 100vw;
  min-height: 100vh;
}

/* 外层容器 */
.navContainer {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 外层容器 */
.navContent {
  width: 70%;
  min-width: 360px;
  max-width: 1500px;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  border-radius: 0px;
  overflow: hidden;
  transition: 0.5s;
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

/* 聊天内容容器窗口 */
.MessageContent {
  width: 100%;
  height: calc(100% - 120px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 0px;
  margin: 10px 0 5px 0;
}

/* 左侧菜单栏样式 */
.MessageContent .LeftMenu {
  width: 120px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  border-right: 1px solid rgba(44, 44, 44, 0.5);
  box-shadow: 13px 18px 20px 1px rgb(0 0 0 / 32%); /* 添加阴影效果 */
  transition: 0.5s;
  color: rgba(255, 255, 255, 0.6);
  overflow: hidden;
}

.MessageContent .LeftMenu:hover {
  width: 500px;
}

/* .filterContainer:deep(.layui-form-label) {
  color: rgba(0, 0, 0, 0.7);
} */

/* .layui-table-view {
  color: rgba(0, 0, 0, 0.7);
} */

/* .box {
  width: 100%;
  height: 100%;
  position: relative;
}

.box .left {
  width: 50%;
  height: 100%;
  float: left;
  position: relative;
} */

/* 左侧切换图形按钮 */
.btn {
  width: 60px;
  height: 15px;
  display: flex;
  justify-content: space-around;
  margin-left: 25px;
  margin-top: 25px;
}

.btnItem {
  width: 15px;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #fff;
}

.btnItem1 {
  background: #62cb44;
}

.btnItem2 {
  background: rgba(0, 0, 0, 0.7);
}

.coon {
  left: 0px !important;
  top: 10px;
}

/* 左侧分隔线式样 */
.line {
  width: 60px;
  height: 1px;
  background: rgba(245, 253, 255, 0.5);
  margin: 20px 25px;
  transition: 0.5s;
}

.MessageContent .LeftMenu:hover .line {
  width: 230px;
}

/* 左侧标题栏式样 */
.title {
  width: 60px;
  margin-left: 25px;
  margin-bottom: 20px;
}

.title p {
  font-size: 14px;
}

/* 左侧菜单式样 */
.menu {
  width: 230px;
  margin-left: 25px;
}

/* 左侧菜单项式样 */
.menuItem {
  display: flex;
  position: relative;
  transition: 0.5s;
  border-radius: 6px;
}

.menuItem:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 左侧菜单项-菜单项左鼠标选中图示 */
.menuItem:hover .light {
  opacity: 1;
}

.light {
  width: 6px;
  height: 50px;
  background: #eb5a56;
  position: absolute;
  left: -25px;
  transition: 0;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  opacity: 0;
}

/* 左侧菜单项-左图标 */
.lIcon {
  width: 60px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 左侧菜单项-中间文本 */
.con {
  width: 0;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.5s;
  overflow: hidden;
  position: relative;
  left: 0px;
  opacity: 0;
}

.MessageContent .LeftMenu:hover .con {
  width: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
}

/* 左侧菜单项-右图标 */
.ricon {
  width: 0;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.5s;
  overflow: hidden;
  position: relative;
  opacity: 0;
}

.MessageContent .LeftMenu:hover .ricon {
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
}

/* 左侧菜单项-图标字体式样 */
.iconFont {
  font-size: 20px;
}

.ricon .iconFont {
  font-size: 20px;
  color: #62cb44;
}

/* 左菜单 server 样式 */
.server {
  width: 60px;
  max-height: 700px;
  background: rgba(0, 0, 0, 0.5);
  margin-left: 25px;
  border-radius: 10px;
  overflow: hidden;
  transition: 0.5s;
  overflow-y: auto;
}

.server::-webkit-scrollbar-thumb {
  color: #00000052;
  background-color: rgba(129, 181, 248, 0.1);
}

.server::-webkit-scrollbar {
  color: #00000052;
  background-color: rgba(0, 0, 0, 0.2);
}

.MessageContent .LeftMenu:hover .server {
  width: 230px;
}

/* 右侧内容栏式样 */
.MessageContent .RightContent {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  padding-right: 15px;
  overflow: hidden;
}

/* 右侧内容栏式样 */
.ContentList {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0px 0rem;
  margin-top: 10px;
}

/* 面脚式样 */
.footer {
  height: 40px;
  width: 100%;
  bottom: 0px;
  line-height: 40px;
  text-align: center;
  font-size: 0.75rem;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
