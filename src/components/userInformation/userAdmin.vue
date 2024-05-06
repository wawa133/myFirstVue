<template>
  <div>
    <!-- 内空列表右面部分 -->
    <div class="RightContent">
      <!-- 表头导航 -->
      <div class="rightLeader">
        <div class="leaderItem">
          <lay-breadcrumb separator-icon="layui-icon-right">
            <lay-breadcrumb-item
              v-for:="(data, key) in userStore.leaderUnitData"
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
          :page="pageTable"
          :columns="userTablecolumns"
          :data-source="tableData"
          even
          v-model:selected-keys="selectedKeys"
          @change="pageTableChange"
          @row-double="rowDouble"
        >
          <template #status="{ row }">
            <lay-switch :model-value="row.status"></lay-switch>
          </template>
          <template v-slot:toolbar v-if="userEditButtonT">
            <lay-button size="sm" type="primary" @click="addData">新增</lay-button>
            <lay-button size="sm" @click="delSelectRows">删除</lay-button>
          </template>
          <template v-slot:operator="{ row }" v-if="userEditButtonT">
            <lay-button size="xs" type="primary" @click="editData(row)">编辑</lay-button>
            <lay-button size="xs" type="primary" @click="removeData(row)"
              >删除</lay-button
            >
            <lay-button
              size="xs"
              v-if="userAuthButtonT"
              type="primary"
              @click="editUserAuth(row)"
              >授权
            </lay-button>
          </template>
        </lay-table>
      </div>
    </div>
  </div>
  <!-- 弹出模态框部分 -->
  <lay-layer
    v-model="areaFormVisible"
    :shade="false"
    :area="['450px', '500px']"
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
        <lay-form-item label="描述" prop="desc">
          <lay-textarea
            placeholder="请输入描述"
            v-model="userInfoWidthForm.desc"
          ></lay-textarea>
        </lay-form-item>
      </lay-form>
    </div>
  </lay-layer>
  <!-- 弹出模态框授权 -->
  <lay-layer
    v-model="areaFormAuthVisible"
    :shade="false"
    :area="['500px', '450px']"
    :btn="areaFormAuthAction"
  >
    <div style="padding: 20px">
      <lay-form :model="userAuthFormVar" ref="userFROMrEF">
        <lay-form-item label="帐号" prop="loginName">
          <lay-input v-model="userAuthFormVar.loginName" disabled></lay-input>
        </lay-form-item>
        <lay-form-item label="姓名" prop="userName">
          <lay-input v-model="userAuthFormVar.userName" disabled></lay-input>
        </lay-form-item>
        <lay-form-item label="权限" prop="userRole">
          <lay-select v-model="userAuthFormVar.userRole" @change="handleChange">
            <lay-select-option value="superSuperAdmin">
              {{ "系统超级管理员" }}
            </lay-select-option>
            <lay-select-option value="superAdmin">
              {{ "系统理员" }}
            </lay-select-option>
            <lay-select-option value="admin">
              {{ "管理员" }}
            </lay-select-option>
            <lay-select-option value="unitSuperAdmin">
              {{ "单位系统理员" }}
            </lay-select-option>
            <lay-select-option value="unitAdmin">
              {{ "单位管理员" }}
            </lay-select-option>
            <lay-select-option value="user">
              {{ "用户" }}
            </lay-select-option>
          </lay-select>
        </lay-form-item>
        <lay-form-item label="描述" prop="desc">
          <lay-textarea
            placeholder="请输入描述"
            v-model="userAuthFormVar.desc"
          ></lay-textarea>
        </lay-form-item>
      </lay-form>
    </div>
  </lay-layer>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, computed } from "vue";
import { layer } from "@layui/layer-vue";
import { nanoid } from "nanoid";
import { useUserStore } from "../../stores";
import unitInfo from "@/api/unitInfo";
import areaInfor from "@/api/areaInfor";
import userInfo from "@/api/userInfo";

const Props = defineProps(["addTab"]);
const userStore = useUserStore();
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

// 定义网页表格数据数组变量【表格】
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
const areaData = ref<Array<areaDataType>>([]);
interface areaDataType {
  id: number;
  name: string;
  desc: string;
  lev: number;
}

// 数据表页导航条变量
const pageTable = reactive({ current: 1, limit: 10, total: 100 });
const pageArea = reactive({ current: 1, limit: 10, total: 100 });
const pageUnit = reactive({ current: 1, limit: 10, total: 100 });

//条件过滤框 条件字符串
const searchFilter = reactive({
  filterStr: "",
});

const loading = ref(false);
const selectedKeys = ref([]);
const userEditButtonT = ref(false);
const userAuthButtonT = ref(false);

// 新增和修改数据的数据定义部分
const userInfoWidthForm = reactive({
  id: -2,
  areaId: -2,
  userName: "",
  loginName: "",
  telNum: null,
  email: "",
  desc: "",
});

// 新增和修改数据的数据定义部分
const userAuthFormVar = reactive({
  id: -2,
  areaId: -2,
  userName: "",
  loginName: "",
  telNum: null,
  email: "",
  desc: "",
  userRole: "user",
});

onMounted(() => {
  // 这里的代码会在组件被挂载到DOM后执行 Tablecolumns
  rebuildTable();
  loadAreaDataSource();
  loadUnitDataSource();
  loadUserDataSource();
});

const rebuildTable = () => {
  if (userAuthButtonT.value) {
    userTablecolumns.value = [...Tablecolumns];
    userTablecolumns.value.push({
      title: "权限",
      width: "130px",
      key: "userRole",
    });
    userTablecolumns.value.push({
      title: "操作",
      width: "165px",
      customSlot: "operator",
      key: "operator",
      fixed: "right",
      ignoreExport: true,
    });
  } else if (userEditButtonT.value) {
    userTablecolumns.value = [...Tablecolumns];
    userTablecolumns.value.push({
      title: "操作",
      width: "165px",
      customSlot: "operator",
      key: "operator",
      fixed: "right",
      ignoreExport: true,
    });
  }
  isUserAuthT();
  isUserAdminT();
};

const isUserAdminT = () => {
  if (userStore.leaderUnitData.length < 2) return;
  if (
    userStore.userLoginInfo.userRole === "superSuperAdmin" ||
    ((userStore.userLoginInfo.userRole === "superAdmin" ||
      userStore.userLoginInfo.userRole === "unitSuperAdmin") &&
      userStore.leaderUnitData[1].id === userStore.unitData[1].id) ||
    ((userStore.userLoginInfo.userRole === "admin" ||
      userStore.userLoginInfo.userRole === "unitAdmin") &&
      userStore.leaderUnitData[userStore.leaderUnitData.length - 1].id ===
        userStore.unitData[userStore.unitData.length - 1].id)
  ) {
    userEditButtonT.value = true;
  } else {
    userEditButtonT.value = false;
  }
};

const isUnitAdmin = () => {
  if (
    (userStore.userLoginInfo.userRole === "superAdmin" ||
      userStore.userLoginInfo.userRole === "unitSuperAdmin") &&
    userStore.leaderUnitData[userStore.leaderUnitData.length - 1].id ===
      userStore.unitData[userStore.unitData.length - 1].id
  ) {
    //console.log("userStore.userLoginInfo.userRole");
    return true;
  } else {
    //console.log("false");
    return false;
  }
};

const isUserAuthT = () => {
  if (userStore.userLoginInfo.userRole === "superSuperAdmin" || isUnitAdmin()) {
    userAuthButtonT.value = true;
  } else {
    userAuthButtonT.value = false;
  }
};

// 区域导航数据监听
const leaderUnitState = computed(() => userStore.leaderUnitData);
watch(
  leaderUnitState,
  () => {
    rebuildTable();
    isUserAdminT();
    pageTable.current = 1;
    loadUnitDataSource();
    loadUserDataSource();
  },
  { deep: true }
);

// 新建区域模态框娈量及函数部分
const areaFormVisible = ref(false);
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

// 新建区域模态框娈量及函数部分
const areaFormAuthVisible = ref(false);
// 新增和修改数据确认代码
const areaFormAuthAction = ref([
  {
    text: "确认",
    callback: () => {
      //layer.confirm("确认操作", { shade: false });
      editUserRole(userAuthFormVar);
      userAuthVisibleChange();
    },
  },
  {
    text: "取消",
    callback: () => {
      userAuthVisibleChange();
    },
  },
]);

// 数据修改
const editUserAuth = (e: any) => {
  console.log(e);
  userAuthFormVar.userName = e.userName;
  userAuthFormVar.loginName = e.loginName;
  userAuthFormVar.userRole = e.userRole;
  userAuthFormVar.email = e.email;
  userAuthFormVar.id = e.id;
  userAuthFormVar.telNum = e.telNum;
  userAuthFormVar.userRole = e.userRole;
  userAuthVisibleChange();
};

// 左侧导航显隐控制切换函数
const userAuthVisibleChange = () => {
  areaFormAuthVisible.value = !areaFormAuthVisible.value;
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

const handleChange = (value: any) => {
  console.log(value);
};

// 左侧树形结构导航点击事件
const NavUnitClick = (sn: any) => {
  userStore.leaderUnitData = userStore.leaderUnitData.slice(0, sn + 1);
};

// 左侧树形结构菜单点击事件
const unitDataClick = (item: any) => {
  userStore.leaderUnitData.push(item);
};

// 数据表数据行双击事件
const rowDouble = (row: any) => {
  Props.addTab({ row, action: row.userName });
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
const pageTableChange = () => {
  loadUserDataSource();
};

//条件过滤筛选执行函数
const submitFilterStr = function (e: string) {
  const el = typeof e == "string" ? e : "";
  layer.msg(`加载过滤数据【${el}】中...`);
};

// 数据表工选项设置
const userTablecolumns = ref([
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
]);

const Tablecolumns = [
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
];

// userInfor.del({unitData,recorderArryData,callBack})
const delRecorders = (RecorderObj: any) => {
  userInfo.del({
    unitData: userStore.leaderUnitData,
    recorderArryData: RecorderObj,
    callBack: (msg: string) => {
      loadUserDataSource();
      layer.msg(msg, { area: "50%", time: 3000 });
    },
  });
};

// userInfor.edit({unitData,recorderData,callBack})
const editUserRole = (userAuthFormVar: any) => {
  userInfo.auth({
    unitData: userStore.leaderUnitData,
    recorderData: userAuthFormVar,
    callBack: (msg: string) => {
      loadUserDataSource();
      layer.msg(msg, { area: "50%", time: 3000 });
    },
  });
};

// userInfor.edit({unitData,recorderData,callBack})
const editRecorderData = (RecorderObj: any) => {
  userInfo.edit({
    unitData: userStore.leaderUnitData,
    recorderData: RecorderObj,
    callBack: (msg: string) => {
      loadUserDataSource();
      layer.msg(msg, { area: "50%", time: 3000 });
    },
  });
};

// get({unitData,pageData,callBack})
const loadUserDataSource = () => {
  userInfo.get({
    unitData: userStore.leaderUnitData,
    pageData: pageTable,
    callBack: (params: any) => {
      tableData.value = [...params.data];
      pageTable.total = params.total;
    },
  });
};

//{data: resData, total: resPage}
const loadUnitDataSource = () => {
  unitInfo.get({
    areaData: userStore.leaderAreaData,
    unitData: userStore.leaderUnitData,
    pageData: pageUnit,
    callBack: (params: any) => {
      unitData.value = [...params.data];
      pageUnit.total = params.total;
    },
  });
};

//areaInfor.get({ areaData: areaData, pageData: page });
const loadAreaDataSource = () => {
  areaInfor.get({
    areaData: userStore.leaderAreaData,
    pageData: pageArea,
    callbackLoadArea: (res: { data: any; total: number }) => {
      areaData.value = res.data;
      pageArea.total = res.total;
    },
  });
};
</script>

<style scoped>
/* ============================================================ */
/* 内容面版中引入的layUi样式 手动进行更改*/
.filterContainer:deep(.layui-form-label) {
  /* color: rgba(0, 0, 0, 0.7); */
  width: 100px;
}

:deep(.layui-form-label) {
  width: 105px;
}

.rightLeader:deep(.layui-breadcrumb) a {
  color: rgba(206, 206, 206, 0.9);
  cursor: pointer;
}

.leaderContent:deep(.layui-space-item) {
  cursor: pointer;
}

.leaderContent:deep(.layui-space) {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
/* ============================================================ */

/* ======================内容面版部分临时式样=================== */
/* 表头导航式样部分 */
.rightLeader {
  font-size: 1.3rem;
  overflow: hidden;
  min-height: 100px;
  transition: 0.5s;
}

.leaderItem {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  line-height: 30px;
  padding-left: 0.5rem;
  border-bottom: 1px solid rgba(206, 206, 206, 0.5);
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
/* ============================================================ */
</style>
