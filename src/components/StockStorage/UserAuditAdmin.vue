<template>
  <div>
    <!-- 表头导航 -->
    <div class="rightLeader">
      <!-- 授权管理项目信息显示 -->
      <div class="authorizeItem" v-if="projectData.tableData[0]">
        <span style="color: #d4d4d4; padding: 0 10px 10px 5px; font-size: 1.4rem">
          项目名称：{{ projectData.tableData[0].projectName }}
        </span>
      </div>

      <lay-panel class="leaderAreaSelect">
        <!-- 区域选择导航条 -->
        <div class="leaderItem">
          <lay-breadcrumb separator-icon="layui-icon-right">
            <lay-breadcrumb-item
              v-for:="(data, key) in userStore.leaderAreaData"
              @click="key > userStore.areaData.length - 2 ? areaNavClick(key) : null"
              :key="nanoid()"
            >
              {{ data.name }}
            </lay-breadcrumb-item>
          </lay-breadcrumb>
        </div>
        <!-- 可选择导航子项图标 -->
        <div class="leaderContent">
          <lay-space size="md">
            <lay-tag
              v-for:="(data, key) in areaData"
              :key="nanoid()"
              @click="areaDataClick(data)"
            >
              <template #icon>
                <lay-icon type="layui-icon-vercode" />
              </template>
              {{ data.name }}
            </lay-tag>
          </lay-space>
        </div>
      </lay-panel>

      <lay-panel class="leaderUnitSelect">
        <!-- 单位选择导航条 -->
        <div class="leaderItem">
          <lay-breadcrumb separator-icon="layui-icon-right">
            <lay-breadcrumb-item
              v-for:="(data, key) in userStore.leaderUnitData"
              @click="key > 0 ? unitNavClick(key) : null"
              :key="nanoid()"
            >
              {{ data.name }}
            </lay-breadcrumb-item>
          </lay-breadcrumb>
        </div>
        <!-- 可选择导航子项图标 -->
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
      </lay-panel>
    </div>
    <!-- 列表部分 单位授权-->
    <div class="ContentList">
      <lay-table
        :max-height="unitTableHeight"
        :auto-col-width="true"
        :page="pageUnit"
        :columns="unitTableColumns"
        :data-source="projectData.authUnit"
        even
        v-model:selected-keys="unitSelectedKeys"
        @change="unitChange"
        @row-double="rowDouble"
      >
        <!-- <template #status="{ row }">
          <lay-switch :model-value="row.status"></lay-switch>
        </template> -->
        <template v-slot:toolbar>
          <lay-button
            v-if="unitTableHeight !== '50px'"
            size="sm"
            type="primary"
            @click="addUnitsAudit(projectData.authUnit)"
            >确认授权</lay-button
          >
          <lay-button
            v-if="unitTableHeight !== '50px'"
            size="sm"
            type="primary"
            @click="showUnitsAudit()"
            >查看授权</lay-button
          >
          <lay-button
            v-if="unitTableHeight === '50px'"
            size="sm"
            type="primary"
            @click="setunitTableHeight('1000px')"
            >查看修改单位授权</lay-button
          >
          <!-- <lay-button size="sm" @click="delSelectRows">删除</lay-button> -->
        </template>

        <!-- <template #unitAuthorizeSwitch="{ row }">
          <lay-switch v-model="row.unitAuthorizeT"></lay-switch>
        </template> -->

        <template #unitRoleSelector="{ row }">
          <lay-select v-model="row.authLevel">
            <lay-select-option :value="0" :label="''"></lay-select-option>
            <lay-select-option
              v-for="(data, key) in Props.prompt.row.auditLevelTotal"
              :key="'unitRoleSelector' + key"
              :value="data"
              :label="getAuditLevelName(data, Props.prompt.row.auditLevelTotal)"
            ></lay-select-option>
          </lay-select>
        </template>

        <!-- <template v-slot:operator="{ row }">
          <lay-button size="xs" type="primary" @click="editData(row)">编辑</lay-button>
          <lay-button size="xs" type="primary" @click="removeData(row)">删除</lay-button>
        </template> -->
      </lay-table>
    </div>

    <!-- 列表部分 人员授权  projectData.authUser -->
    <!-- loadUserDataSource(); -->
    <div class="ContentList">
      <lay-table
        :max-height="userTableHeight"
        :auto-col-width="true"
        :page="pageUser"
        :columns="userAuditColumns"
        :data-source="projectData.authUser"
        even
        v-model:selected-keys="userSelectedKeys"
        @change="userChange"
        @row-double="userRowDouble"
      >
        <template #status="{ row }">
          <lay-switch :model-value="row.status"></lay-switch>
        </template>
        <template v-slot:toolbar>
          <lay-button
            v-if="userTableHeight !== '50px'"
            size="sm"
            type="primary"
            @click="addUsersAudit(projectData.authUser)"
            >确认授权</lay-button
          >
          <lay-button
            v-if="userTableHeight !== '50px'"
            size="sm"
            type="primary"
            @click="showUsersAudit()"
            >查看授权</lay-button
          >
          <lay-button
            v-if="userTableHeight === '50px'"
            size="sm"
            type="primary"
            @click="setUserTableHeight('1000px')"
            >查看修改人员授权</lay-button
          >
          <!-- <lay-button size="sm" @click="delSelectRows">删除</lay-button> -->
        </template>

        <template #userRoleSelector="{ row }">
          <lay-select v-model="row.authLevel">
            <lay-select-option :value="0" :label="''"></lay-select-option>
            <lay-select-option
              v-for="(data, key) in Props.prompt.row.auditLevelTotal"
              :key="'userRoleSelector' + key"
              :value="data"
              :label="getAuditLevelName(data, Props.prompt.row.auditLevelTotal)"
            ></lay-select-option>
          </lay-select>
        </template>
      </lay-table>
    </div>

    <!-- 列表部分 管理项目列表-->
    <div class="ContentList">
      <lay-table
        max-height="1000px"
        :auto-col-width="true"
        :page111="pageTable"
        :columns="tableColumns"
        :data-source="projectData.tableData"
        even
        v-model:selected-keys="selectedKeys"
        @change="change"
        @row-double="rowDouble"
      >
        <template #status="{ row }">
          <lay-switch :model-value="row.status"></lay-switch>
        </template>
      </lay-table>
    </div>
  </div>

  <!-- 弹出模态框部分 -->
  <lay-layer v-model="userLayerVisible" :shade="false" :area="['900px', '800px']">
    <div style="padding: 20px">
      <UserAudtiEdit
        :prompt="{ row: Props.prompt.row, callBack: refresh }"
      ></UserAudtiEdit>
    </div>
  </lay-layer>
  <!-- 弹出模态框部分 unitAudtiEdit -->
  <lay-layer v-model="unitLayerVisible" :shade="false" :area="['900px', '800px']">
    <div style="padding: 20px">
      <UnitAudtiEdit
        :prompt="{ row: Props.prompt.row, callBack: refresh }"
      ></UnitAudtiEdit>
    </div>
  </lay-layer>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, computed } from "vue";
import { layer } from "@layui/layer-vue";
import { nanoid } from "nanoid";
import { useUserStore } from "@/stores/index";
import type { projectCacheDateType } from "@/interface/index";
import unitInfo from "@/api/unitInfo";
import areaInfor from "@/api/areaInfor";
//import userInfo from "@/api/userInfo";
import projectInfor from "@/api/projectInfo";
//import userAuditEdit from "@/components/projectCache/userAudtiEdit.vue";
//import unitAudtiEdit from "@/components/projectCache/unitAudtiEdit.vue";

import UserAudtiEdit from "@/components/StockStorage/UserAudtiEdit.vue";
import UnitAudtiEdit from "@/components/StockStorage/UnitAudtiEdit.vue";

const Props = defineProps(["prompt"]);
const userStore = useUserStore();
// 数据表页导航条变量
const pageTable = reactive({ current: 1, limit: 10, total: 100 });
const pageArea = reactive({ current: 1, limit: 10, total: 100 });
const pageUnit = reactive({ current: 1, limit: 10, total: 100 });
const pageUser = reactive({ current: 1, limit: 10, total: 100 });
const loading = ref(false);
const selectedKeys = ref([]);
const userSelectedKeys = ref([]);
const unitSelectedKeys = ref([]);
// 新建区域模态框娈量及函数部分
let unitTableHeight = ref("50px");
let userTableHeight = ref("1000px");

let userLayerVisible = ref(false);
let unitLayerVisible = ref(false);
let showUsersAudit = () => (userLayerVisible.value = !userLayerVisible.value);
let showUnitsAudit = () => (unitLayerVisible.value = !unitLayerVisible.value);
const unitSelected = ref([]);
let unitSource = ref<unitSourceType[]>([]);
interface unitSourceType {
  id: number;
  title: string;
}

function setunitTableHeight(height: string) {
  unitTableHeight.value = height;
  if (unitTableHeight.value == "1000px") {
    userTableHeight.value = "50px";
  }
}
function setUserTableHeight(height: string) {
  userTableHeight.value = height;
  if (userTableHeight.value == "1000px") {
    unitTableHeight.value = "50px";
  }
}

// 项目数据
// id: number
// nickName: string 项目简称
// projectName: string 项目名称
// thisTotalRmb: number 项目总资金
// itemTotalRmb: number 子项目资金
// thisHaveCashedRmb: number 本级已支付
// itemHaveCashedRmb: number 子项目已支付
// auditLevel: number 支付审核等级
// projectUnit: string 项目所属单位
// authorizedUnits: string 授权单位
// authorizedUsers: string 援权人
// createUserName: string
// createUserID: number
// createDate: string
// modifyUserName: string
// modifyUserID: number
// modifyDate: string
// delUserName: string
// delUserId: number
// delDate: string
// isDeleted: number
// desc: string
// level: number
// level1: number
// level2: number
// level3: number
// level4: number
// level5: number
// level6: number
// level7: number projectData.authUser
const projectData = reactive({
  tableData: [] as projectCacheDateType[],
  authUnit: [] as {
    id: number | undefined | null;
    userID: number | undefined | null;
    userName: string | undefined | null;
    projectID: number | undefined | null;
    projectName: string | undefined | null;
    authLevel: number | undefined | null;
    desc: string | undefined | null;
  }[],
  authUser: [] as {
    id: number | undefined | null;
    unitID: number | undefined | null;
    unitName: string | undefined | null;
    projectID: number | undefined | null;
    projectName: string | undefined | null;
    authLevel: number | undefined | null;
    desc: string | undefined | null;
  }[],
});

// 定义区域导航选单数据变量【导航栏】
const areaData = ref<Array<areaDataType>>([]);
interface areaDataType {
  id: number;
  name: string;
  desc: string;
  lev: number;
}

// 表头导航响应式工作变量
let unitData = ref<Array<unitDataType>>([]);
interface unitDataType {
  id: number;
  areaId: number;
  name: string;
  desc: string;
  city: string;
  lev: number;
}

onMounted(() => {
  // 这里的代码会在组件被挂载到DOM后执行
  //console.log(Props.prompt);
  loadAreaDataSource();
  loadUnitDataSource();
  //loadTableDataSource();
  //loadUserDataSource();
  //loadUserAuditSource();
  //loadUnitAuditSource();
});

const refresh = () => {
  //loadUserAuditSource();
  //loadUnitAuditSource();
  //loadTableDataSource();
};

// 使用计算属性来获取 store 中的状态
const leaderUnitState = computed(() => userStore.leaderUnitData);
watch(
  leaderUnitState,
  () => {
    loadUnitDataSource();
    //loadUserDataSource();
    //loadUserAuditSource();
    //loadUnitAuditSource();
  },
  { deep: true }
);

const leaderAreaState = computed(() => userStore.leaderAreaData);
watch(leaderAreaState, () => loadAreaDataSource(), { deep: true });

const unitDataSource = computed(() => unitData.value);
watch(
  unitDataSource,
  () => {
    unitSource.value = unitSource.value.filter((item) =>
      (unitSelected.value as Array<number>).includes(item.id)
    );
    unitData.value.forEach((item1) => {
      if (!unitSource.value.find((item) => item.id === item1.id)) {
        unitSource.value.push({
          id: item1.id,
          title: item1.name,
        });
      }
    });
  },
  { deep: true }
);

const getAuditLevelName = (lev: number, totalLev: number) => {
  if (lev == 1) {
    return "数据录入";
  } else if (lev == totalLev) {
    return "数据审定";
  } else {
    return `审核-${lev - 1}`;
  }
};

// 左侧树形结构导航点击事件
const areaNavClick = (sn: any) => {
  userStore.leaderAreaData = userStore.leaderAreaData.slice(0, sn + 1);
};

// 左侧树形结构菜单点击事件
const areaDataClick = (item: any) => {
  userStore.leaderAreaData.push(item);
};

// 左侧树形结构导航点击事件
const unitNavClick = (sn: any) => {
  userStore.leaderUnitData = userStore.leaderUnitData.slice(0, sn + 1);
};

// 左侧树形结构菜单点击事件
const unitDataClick = (item: any) => {
  userStore.leaderUnitData.push(item);
};

// 数据表改变事件
const change = () => {
  loading.value = true;
  //loadTableDataSource();
};

// 数据表改变事件
const userChange = () => {
  loading.value = true;
  //loadUserDataSource();
  //loadUserAuditSource();
};

// 数据表改变事件
const unitChange = () => {
  loading.value = true;
  //loadUnitAuditSource();
};

// 数据表数据行双击事件
const rowDouble = (item: any) => {
  layer.msg(item, { area: "50%" });
};

// 数据表数据行双击事件
const userRowDouble = (item: any) => {
  layer.msg(item, { area: "50%" });
};

// 新增记录userStore.areaData
// params: { areaData,unitData,projectRowData,pageData,callBack: () => ({data:any,total:number}) }
const addUnitsAudit = (e: any) => {
  if (e.length < 1) {
    return;
  }
  projectInfor.editAuditUnitData({
    areaData: userStore.leaderAreaData,
    unitData: userStore.leaderUnitData,
    projectRowData: Props.prompt.row,
    pageData: pageUnit,
    unitAuditData: e,
    callBack: (msg: string) => {
      layer.msg(msg);
      //loadUnitAuditSource();
      //loadTableDataSource();
    },
  });
};

// 获取区域数据
// params: { areaData,unitData,projectRowData,pageData,callBack: () => ({data:any,total:number})
const loadUnitAuditSource = () => {
  projectInfor.getAuditUnitData({
    areaData: userStore.leaderAreaData,
    unitData: userStore.leaderUnitData,
    projectRowData: Props.prompt.row,
    pageData: pageUnit,
    callBack: (data: any) => {
      //console.log(data, total);
      projectData.authUnit = [...data.data];
      pageUnit.total = data.total;
    },
  });
};

// 获取区域数据
// params: { areaData,unitData,projectRowData,userAuditData,pageData,callBack: () => ({data:any,total:number})
const addUsersAudit = (e: any) => {
  if (e.length < 1) {
    return;
  }
  projectInfor.editAuditUserData({
    areaData: userStore.leaderAreaData,
    unitData: userStore.leaderUnitData,
    projectRowData: Props.prompt.row,
    pageData: pageUser,
    userAuditData: e,
    callBack: (msg: string) => {
      layer.msg(msg);
      //loadUserAuditSource();
      //loadTableDataSource();
    },
  });
};

// 获取区域数据
// params: { areaData,unitData,projectRowData,pageData,callBack: () => ({data:any,total:number})
const loadUserAuditSource = () => {
  projectInfor.getAuditUserData({
    areaData: userStore.leaderAreaData,
    unitData: userStore.leaderUnitData,
    projectRowData: Props.prompt.row,
    pageData: pageUser,
    callBack: (data: any) => {
      //console.log(data, total);
      projectData.authUser = [...data.data];
      pageUser.total = data.total;
    },
  });
};

// 从后台数据库获取表格相关数据
const loadTableDataSource = () => {
  projectInfor.reloadRowInfo({
    areaNavData: userStore.leaderAreaData,
    unitNavData: userStore.leaderUnitData,
    storeAreaData: userStore.areaData,
    storeUnitData: userStore.unitData,
    authorizeRowData: Props.prompt.row,
    callBack: (params: any) => {
      projectData.tableData = [...params.data];
      pageTable.total = 1;
    },
  });
};

//{data: resData, total: resPage}
// 从后台获取单位相关数据源【单位】
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
// 从后台获取数据源【区域】
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

const userAuditColumns = [
  { title: "ID", width: "30px", key: "id" },
  { title: "用户名称", width: "100px", key: "userName" },
  { title: "联系电话", width: "100px", key: "userTel" },
  { title: "项目名称", width: "300px", key: "projectName" },
  {
    title: "权限",
    width: "165px",
    customSlot: "userRoleSelector",
    key: "userRoleSelector",
    fixed: "right",
    ignoreExport: true,
  },
];

const unitTableColumns = [
  // { title: "选项", width: "35px", type: "checkbox", fixed: "left" },
  { title: "ID", width: "30px", key: "id" },
  { title: "单位ID", width: "100px", key: "unitID" },
  { title: "单位名称", width: "100px", key: "unitName" },
  { title: "项目名称", width: "100px", key: "projectName" },
  // {
  //   title: "允许权限",
  //   width: "115px",
  //   customSlot: "unitAuthorizeSwitch",
  //   key: "unitAuthorizeSwitch",
  //   fixed: "right",
  //   ignoreExport: true,
  // },
  {
    title: "权限",
    width: "115px",
    customSlot: "unitRoleSelector",
    key: "unitRoleSelector",
    fixed: "right",
    ignoreExport: true,
  },
  // {
  //   title: "操作",
  //   width: "115px",
  //   customSlot: "operator",
  //   key: "operator",
  //   fixed: "right",
  //   ignoreExport: true,
  // },
];

const tableColumns = [
  // { title: "选项", width: "35px", type: "checkbox", fixed: "left" },
  {
    title: "项目简称",
    width: "100px",
    key: "nickName",
  },
  {
    title: "项目全称",
    width: "160px",
    key: "projectName",
  },
  {
    title: "授权单位",
    width: "180px",
    key: "authorizedUnits",
  },
  {
    title: "援权人员",
    width: "160px",
    key: "authorizedUsers",
  },
  {
    title: "项目单位",
    width: "100px",
    key: "projectUnit",
  },
  // {
  //   title: "操作",
  //   width: "115px",
  //   customSlot: "operator",
  //   key: "operator",
  //   fixed: "right",
  //   ignoreExport: true,
  // },
];
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

.authorizeItem:deep(.layui-breadcrumb) a {
  color: rgba(221, 224, 228, 0.9);
  cursor: pointer;
}

.leaderItem:deep(.layui-form-label) {
  color: rgba(35, 35, 37, 0.521);
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

.authorizeItem {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  line-height: 40px;
  padding-left: 0.5rem;
  border-bottom: 3px solid rgba(206, 206, 206, 0.5);
}

.leaderContent {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  line-height: 30px;
  /* min-height: 60px; */
  /* height: 60px; */
  /* padding: 1rem 1rem; */
  /* height: 0px;
  padding: 0rem 0rem; */
  border-bottom: 1px solid #e6e6e6;
  transition: 0.5s;
  /* overflow: hidden; */
}

.unitSelectContainer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-evenly;
  gap: 1rem;
  /* line-height: 30px;
  padding-left: 0.5rem; */
  margin-bottom: 15px;
  /* cursor: pointer; */
}

.selecterContainer {
  border: 1px solid rgba(206, 206, 206, 0.5);
}

.selectorTitle {
  text-align: left;
  width: 400px;
  padding-left: 0.5rem;
  line-height: 3.5rem;
  font-size: 1rem;
}

.leaderAreaSelect .leaderContent,
.leaderUnitSelect .leaderContent {
  /* display: none; */
  height: 0px;
  overflow: hidden;
  transition: 0.5s;
}

.leaderAreaSelect:hover .leaderContent,
.leaderUnitSelect:hover .leaderContent {
  /* display: block; */
  height: auto;
  /* min-height: 60px; */
  padding: 1rem 1rem;
}

.ContentList {
  margin-bottom: 5px;
}

/* ============================================================ */
</style>
