<template>
  <div>
    <!-- 表头导航 -->
    <div class="rightLeader">
      <!-- 面包屑导航条 -->
      <div class="leaderItem">
        <lay-breadcrumb separator-icon="layui-icon-right">
          <lay-breadcrumb-item
            v-for:="(data, key) in userStore.leaderUnitData"
            @click="unitNavClick(key)"
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
    </div>
    <!-- 条件过滤表单 -->
    <div class="filterContainer">
      <!-- 表头导航 -->
      <lay-form :model="searchFilter" :pane="true" onsubmit="return false;">
        <!-- label-width="200px" 需要配合式样中.filterContainer:deep(
                  .layui-form-label) 宽度才能生效-->
        <lay-form-item label="条件过滤" prop="filterStr" label-width="100px">
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
        :page="pageProject"
        :columns="tableColumns"
        :data-source="projectData.projectData"
        even
        v-model:selected-keys="selectedKeys"
        @change="change"
        @row-double="rowDouble"
      >
        <template #status="{ row }">
          <lay-switch :model-value="row.status"></lay-switch>
        </template>
        <template v-slot:toolbar>
          <lay-button size="sm" type="primary" @click="addData(projectData.addData)"
            >新增</lay-button
          >
          <lay-button size="sm" @click="delSelectRows">删除</lay-button>
        </template>
        <template v-slot:operator="{ row }">
          <lay-button size="xs" type="primary" @click="editData(row)" v-if="editDisT(row)"
            >编辑</lay-button
          >
          <lay-button
            size="xs"
            type="primary"
            @click="removeData(row)"
            v-if="editDisT(row)"
            >删除</lay-button
          >
          <lay-button
            size="xs"
            type="primary"
            @click="Props.addTab({ row, action: '授权管理' })"
            v-if="auditLevel(row)"
            >授权</lay-button
          >
          <lay-button
            size="xs"
            type="primary"
            @click="Props.addTab({ row, action: '支付管理' })"
            v-if="payDisT(row)"
            >支付</lay-button
          >
        </template>
      </lay-table>
    </div>
  </div>

  <!-- 弹出模态框部分 'auto' 't' 'l' 'b' 'r' 'rb' ['100px','50px'] '100px' 'auto'-->
  <lay-layer
    v-model="areaFormVisible"
    :shade="false"
    :area="['560px', '540px']"
    :btn="areaFormAction"
    :offset="'auto'"
  >
    <div style="padding: 20px">
      <lay-form :model="projectData.addData" ref="areaFROMrEF" labelWidth="105px">
        <lay-form-item label="项目简称" prop="nickName" required>
          <lay-input v-model="projectData.addData.nickName"></lay-input>
        </lay-form-item>
        <lay-form-item label="项目名称" prop="projectName" required>
          <lay-input v-model="projectData.addData.projectName"></lay-input>
        </lay-form-item>
        <lay-form-item label="项目总资金" prop="thisTotalRmb" required>
          <lay-input v-model="projectData.addData.thisTotalRmb"></lay-input>
        </lay-form-item>
        <lay-form-item label="审核等级" prop="auditLevelTotal" required>
          <lay-input v-model="projectData.addData.auditLevelTotal"></lay-input>
        </lay-form-item>
        <lay-form-item label="项目单位" prop="projectUnit" required>
          <lay-input v-model="projectData.addData.projectUnit" disabled></lay-input>
        </lay-form-item>
        <lay-form-item label="项目说明" prop="desc">
          <lay-textarea
            placeholder="请输入描述"
            v-model="projectData.addData.desc"
          ></lay-textarea>
        </lay-form-item>
      </lay-form>
    </div>
  </lay-layer>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, reactive, ref, watch, computed } from "vue";
import { layer } from "@layui/layer-vue";
import { nanoid } from "nanoid";
import { useUserStore } from "@/stores/index";
import axios from "axios";
import type { projectCacheDateType } from "@/interface/index";
import areaInfor from "@/api/areaInfor";
import unitInfo from "@/api/unitInfo";
import projectInfor from "@/api/projectInfo";

const Props = defineProps(["addTab"]);
const userStore = useUserStore();
// 数据表页导航条变量
const pageProject = reactive({ current: 1, limit: 10, total: 100 });
const pageArea = reactive({ current: 1, limit: 10, total: 100 });
const pageUnit = reactive({ current: 1, limit: 10, total: 100 });
const router = useRouter();
const loading = ref(false);
const selectedKeys = ref([]);
// 新建区域模态框娈量及函数部分
const areaFormVisible = ref(false);

// 项目数据
// id: number
// nickName: string 项目简称
// projectName: string 项目名称
// thisTotalRmb: number 项目总资金
// itemTotalRmb: number 子项目资金
// thisHaveCashedRmb: number 本级已支付
// itemHaveCashedRmb: number 子项目已支付
// auditLevelTotal: number 支付审核等级
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
// level7: number projectData.addData
const projectData = reactive({
  projectData: [] as projectCacheDateType[],
  addData: {
    id: -1,
    nickName: "",
    projectName: "",
    thisTotalRmb: null,
    auditLevelTotal: null,
    projectUnit: null,
    projectUnitId: null,
    desc: "", //TS lay-textarea v-model 不支技 null
  } as projectCacheDateType,
  authData: {
    id: -1, //可用于索引和后台的校验
    nickName: "", //可用于索引和后台的校验
    projectName: "", //可用于索引和后台的校验
    auditLevel: null, //审核Level
    authorizedUnits: null,
    authorizedUsers: null,
  } as projectCacheDateType,
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
  userStore.leaderUnitData = [...userStore.unitData];
  loadAreaDataSource();
  loadProjectDataSource();
});

// 使用计算属性来获取 store 中的状态
// const someState = computed(() => userStore.leaderUnitData);
// watch(
//   //() => unitNavData.map((item) => item.id),
//   someState, //userStore.leaderUnitData
//   (newValue, oldValue) => {
//     console.log("Names changed:", newValue);
//     if (newValue.length > 1) {
//       leaderNavData.value = [...newValue];
//     }
//   },
//   { deep: true }
// );

// 使用计算属性来获取 store 中的状态
const leaderUnitState = computed(() => userStore.leaderUnitData);
watch(
  leaderUnitState,
  () => {
    loadUnitDataSource();
    if (userStore.leaderUnitData.length > 1) {
      projectData.addData.projectUnit =
        userStore.leaderUnitData[userStore.leaderUnitData.length - 1].name;
      projectData.addData.projectUnitId =
        userStore.leaderUnitData[userStore.leaderUnitData.length - 1].id;
    }
    loadProjectDataSource();
  },
  { deep: true }
);

const leaderAreaState = computed(() => userStore.leaderAreaData);
watch(
  leaderAreaState,
  () => {
    loadUnitDataSource();
    loadProjectDataSource();
  },
  { deep: true }
);

const auditLevel = (row: any) => {
  //let roles = ["superSuperAdmin", "superAdmin", "admin", "unitSuperAdmin", "unitAdmin"];
  if (
    userStore.userLoginInfo.userRole == "superSuperAdmin" ||
    ((userStore.userLoginInfo.userRole == "superAdmin" ||
      userStore.userLoginInfo.userRole == "admin" ||
      userStore.userLoginInfo.userRole == "unitSuperAdmin" ||
      userStore.userLoginInfo.userRole == "unitAdmin") &&
      row.projectUnitId == userStore.unitData[userStore.unitData.length - 1].id)
  ) {
    return true;
  } else return false;
};

const payDisT = (row: any) => {
  //let roles = ["superSuperAdmin", "superAdmin", "admin", "unitSuperAdmin", "unitAdmin"];
  if (
    userStore.userLoginInfo.userRole == "superSuperAdmin" ||
    ((userStore.userLoginInfo.userRole == "superAdmin" ||
      userStore.userLoginInfo.userRole == "admin" ||
      userStore.userLoginInfo.userRole == "unitSuperAdmin" ||
      userStore.userLoginInfo.userRole == "unitAdmin") &&
      row.projectUnitId == userStore.unitData[1].id) ||
    row.projectUnitId == userStore.unitData[userStore.unitData.length - 1].id
  ) {
    return true;
  } else return false;
};

const editDisT = (row: any) => {
  //let roles = ["superSuperAdmin", "superAdmin", "admin", "unitSuperAdmin", "unitAdmin"];
  if (
    userStore.userLoginInfo.userRole == "superSuperAdmin" ||
    ((userStore.userLoginInfo.userRole == "unitSuperAdmin" ||
      userStore.userLoginInfo.userRole == "unitAdmin") &&
      row.projectUnitId == userStore.unitData[userStore.unitData.length - 1].id)
  ) {
    return true;
  } else return false;
};

// 左侧树形结构导航点击事件
const unitNavClick = (sn: any) => {
  userStore.leaderUnitData = userStore.leaderUnitData.slice(0, sn + 1);
};

// watch(
//   leaderUnitState,
//   (newValue) => {
//     console.log("Names changed:", newValue);
//     if (newValue.length > 1) {
//       projectData.addData.projectUnit = userStore.leaderUnitData[1].name;
//       projectData.addData.projectUnitId = userStore.leaderUnitData[1].id;
//     }
//   },
//   { deep: true }
// );

// 左侧树形结构菜单点击事件
const unitDataClick = (item: any) => {
  userStore.leaderUnitData.push(item);
};

//条件过滤框 条件字符串
const searchFilter = reactive({
  filterStr: "",
});

//条件过滤筛选执行函数
const submitFilterStr = function (e: string) {
  const el = typeof e == "string" ? e : "";
  layer.msg(`加载过滤数据【${el}】中...`);
};

// 数据表改变事件
const change = () => {
  loading.value = true;
  loadProjectDataSource();
};

// 数据表数据行双击事件
const rowDouble = (item: any) => {
  layer.msg(item, { area: "50%" });
};

// 左侧导航显隐控制切换函数
const areaVisibleChange = () => {
  areaFormVisible.value = !areaFormVisible.value;
};

// 新增记录userStore.areaData
const addData = (e: any) => {
  projectData.addData.id = -1;
  projectData.addData.nickName = e.nickName;
  projectData.addData.projectName = e.projectName;
  projectData.addData.thisTotalRmb = e.thisTotalRmb;
  projectData.addData.auditLevelTotal = e.auditLevelTotal;
  projectData.addData.desc = e.desc;
  areaVisibleChange();
};

// 数据修改
const editData = (e: any) => {
  projectData.addData.id = e.id;
  projectData.addData.nickName = e.nickName;
  projectData.addData.projectName = e.projectName;
  projectData.addData.thisTotalRmb = e.thisTotalRmb;
  projectData.addData.auditLevelTotal = e.auditLevelTotal;
  projectData.addData.desc = e.desc;
  areaVisibleChange();
};

// 新增和修改数据确认代码
const areaFormAction = ref([
  {
    text: "确认",
    callback: () => {
      editRecorderData(projectData.addData);
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

// 删除数据
const removeData = (row: any) => {
  delRecorderConfirm(row);
};
const delRecorderConfirm = (row: any) => {
  layer.confirm("是否确认删除--确认将删除该项及其下所有子域数据", {
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

//删除所有选中的数据
const delSelectRows = () => {
  let selectedKeysArr: any = [];
  selectedKeys.value.forEach((item: any) => {
    projectData.projectData.forEach((item2: any) => {
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

// 从后台获取数据源【区域】
const delRecorders = (RecorderObj: any) => {
  axios({
    method: "post",
    //当需要跨域传送 JWT-TOKEN-cookies 令牌时，需要这个参数，并在服务器端设置对应的头部信息
    headers: { Authorization: localStorage.getItem("token") || "" },
    //浏览器告知服务器，我需要设置cookie，包括session-cookie\JWT-token-cookie等
    withCredentials: true,
    //======================================================================
    url: "http://localhost:3007/my/projectCatch/getinfo",
    data: {
      //传送服务器 自定义数据部分
      method: "del",
      unitNavData: userStore.unitData,
      areaNavData: userStore.leaderAreaData,
      storeAreaData: userStore.areaData,
      storeUnitData: userStore.unitData,
      RecorderObj: RecorderObj,
    },
    //======================================================================
  })
    .then((res) => {
      //console.log(res.data);
      if (!res.data.data || !res.data.data.affectedRows) {
        layer.msg(`程序发生错误` + res.data.msg, { area: "50%", time: 3000 });
        return;
      }

      layer.msg(`删除数据${res.data.msg}，共删除${res.data.data.affectedRows}条`, {
        area: "50%",
        time: 3000,
      });
      loadProjectDataSource();
    })
    .catch((err) => {
      console.log(err);
    });
};

// 向服务器提交 新增或修改数据 并刷新
const editRecorderData = (RecorderObj: any) => {
  axios({
    method: "post",
    //当需要跨域传送 JWT-TOKEN-cookies 令牌时，需要这个参数，并在服务器端设置对应的头部信息
    headers: { Authorization: localStorage.getItem("token") || "" },
    //浏览器告知服务器，我需要设置cookie，包括session-cookie\JWT-token-cookie等
    withCredentials: true,
    //==========================================================================
    url: "http://localhost:3007/my/projectCatch/getinfo",
    data: {
      //传送服务器 自定义数据部分
      method: RecorderObj.id > 0 ? "set" : "add",
      unitNavData: userStore.unitData,
      areaNavData: userStore.leaderAreaData,
      //leaderAreaData,
      storeAreaData: userStore.areaData,
      storeUnitData: userStore.unitData,
      RecorderObj: RecorderObj,
    },
    //==========================================================================
  })
    .then((res) => {
      // 成功 服务器返回数据处理
      //console.log(res.data);
      loadProjectDataSource();
      layer.msg(`message:${res.data.msg}`, { area: "50%", time: 3000 });
    })
    .catch((err) => {
      console.log(err);
    });
};

const loadProjectDataSource = () => {
  projectInfor.getProjectData({
    areaNavData: userStore.leaderAreaData,
    unitNavData: userStore.leaderUnitData,
    storeAreaData: userStore.areaData,
    storeUnitData: userStore.unitData,
    pageData: pageProject,
    callBack: (data: any) => {
      projectData.projectData = data.data;
      pageProject.total = data.total;
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

// areaInfor.get({ areaData: areaData, pageData: page });
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

// 数据表结构
const tableColumns = [
  { title: "选项", width: "35px", type: "checkbox", fixed: "left" },
  {
    title: "ID",
    align: "center",
    width: "30px",
    key: "id",
  },
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
    title: "项目总资金",
    align: "center",
    width: "80px",
    key: "thisTotalRmb",
  },
  {
    title: "子项目总资金",
    align: "center",
    width: "80px",
    key: "itemTotalRmb",
  },
  {
    title: "本级已支付",
    align: "center",
    width: "80px",
    key: "thisHaveCashedRmb",
  },
  {
    title: "子项目已支付",
    align: "center",
    width: "80px",
    key: "itemHaveCashedRmb",
  },
  {
    title: "项目单位",
    width: "160px",
    key: "projectUnit",
  },
  {
    title: "操作",
    align: "center",
    width: "190px",
    customSlot: "operator",
    key: "operator",
    fixed: "right",
    ignoreExport: true,
  },
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
