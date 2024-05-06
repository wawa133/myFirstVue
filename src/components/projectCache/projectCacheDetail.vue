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
    </div>
    <!-- 列表部分 单位授权-->
    <div class="ContentList">
      <lay-table
        :max-height="unitTableHeight"
        :auto-col-width="true"
        :page="cacheTable"
        :columns="cacheTableColumns"
        :data-source="cacheItems"
        even
        v-model:selected-keys="cacheSelectedKeys"
        @change="cachePageChange"
        @row-double="rowDouble"
      >
        <template v-slot:toolbar>
          <lay-button size="sm" type="primary" @click="newPayItem()">新增支付</lay-button>
          <!-- <lay-button size="sm" @click="delSelectRows">删除</lay-button> -->
        </template>
        <template v-slot:operator="{ row }">
          <lay-button
            size="xs"
            type="primary"
            @click="editData(row)"
            v-if="auditLevel(row) == 1"
            >编辑</lay-button
          >
          <lay-button
            size="xs"
            type="primary"
            @click="confirmAudit(row)"
            v-if="auditLevel(row) == 1"
            >提交</lay-button
          >
          <lay-button
            size="xs"
            type="primary"
            @click="confirmAudit(row)"
            v-if="auditLevel(row) == 2"
            >审核</lay-button
          >
          <lay-button
            size="xs"
            type="primary"
            @click="confirmAudit(row)"
            v-if="auditLevel(row) == 3"
            >审定</lay-button
          >
          <lay-button
            size="xs"
            type="primary"
            @click="confirmUnAudit(row)"
            v-if="unAuditButton(row)"
            >退回</lay-button
          >
        </template>
      </lay-table>
    </div>
  </div>

  <!-- 弹出模态框部分 -->
  <lay-layer
    v-model="areaFormVisible"
    :shade="false"
    :area="['500px', '450px']"
    :btn="areaFormAction"
  >
    <div style="padding: 20px">
      <lay-form :model="editPayItem" ref="payFromRef">
        <lay-form-item label="项目名称" prop="projectName" required>
          <lay-input v-model="editPayItem.projectName" disabled></lay-input>
        </lay-form-item>
        <lay-form-item label="支付项目" prop="cacheName" required>
          <lay-input v-model="editPayItem.cacheName"></lay-input>
        </lay-form-item>
        <lay-form-item label="支付金额" prop="cacheNum" required>
          <lay-input v-model="editPayItem.cacheNum"></lay-input>
        </lay-form-item>
        <lay-form-item label="描述" prop="desc">
          <lay-textarea
            placeholder="请输入描述"
            v-model="editPayItem.desc"
          ></lay-textarea>
        </lay-form-item>
      </lay-form>
    </div>
  </lay-layer>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { layer } from "@layui/layer-vue";
import { useUserStore } from "@/stores/index";
import type { projectCacheDateType } from "@/interface/index";
import projectInfor from "@/api/projectInfo";

const Props = defineProps(["prompt"]);
const userStore = useUserStore();
// 新建区域模态框娈量及函数部分
const areaFormVisible = ref(false);
// 数据表页导航条变量
const cacheTable = reactive({ current: 1, limit: 10, total: 100 });
const pageTable = reactive({ current: 1, limit: 10, total: 100 });
const loading = ref(false);
const cacheSelectedKeys = ref([]);
// 新建区域模态框娈量及函数部分
let unitTableHeight = ref("1000px");

let editPayItem = ref<cacheItemType>({
  id: -2,
  projectID: -2,
  projectName: "",
  cacheName: "",
  cacheNum: null,
  CreateDate: "",
  desc: "",
});

let cacheItems = ref<cacheItemType[]>([]);
interface cacheItemType {
  id: number | null | undefined;
  projectID: number | null | undefined;
  cacheName: string | null | undefined;
  projectName: string | null | undefined;
  cacheNum?: number | null | undefined;
  CreateDate?: string | null | undefined;
  desc?: string | undefined;
}

const confirmAudit = (auditItemData: any) => {
  layer.confirm("是否确认--提交后数据将被锁定", {
    btn: [
      {
        text: "确认提交",
        callback: (id: any) => {
          auditItemDataf(auditItemData);
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
// params: { projectRowData,pageData,callBack: () => ({data:any,total:number})
const auditItemDataf = (auditItemData: any) => {
  projectInfor.auditItemData({
    projectRowData: Props.prompt.row,
    auditItemData: auditItemData,
    callBack: (msg: string) => {
      layer.msg(msg, { area: "50%", time: 1500 });
      getCacheDetail();
    },
  });
};

const confirmUnAudit = (auditItemData: any) => {
  layer.confirm("是否确认退回数据", {
    btn: [
      {
        text: "确认退回",
        callback: (id: any) => {
          unAuditItemData(auditItemData);
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
// params: { projectRowData,pageData,callBack: () => ({data:any,total:number})
const unAuditItemData = (auditItemData: any) => {
  projectInfor.unAuditItemData({
    projectRowData: Props.prompt.row,
    auditItemData: auditItemData,
    callBack: (msg: string) => {
      layer.msg(msg, { area: "50%", time: 1500 });
      getCacheDetail();
    },
  });
};

// params: { projectRowData,pageData,callBack: () => ({data:any,total:number})
const getCacheDetail = () => {
  projectInfor.getCacheDetail({
    projectRowData: Props.prompt.row,
    pageData: cacheTable,
    callBack: (data: any) => {
      //console.log(data.data, data.total);
      cacheItems.value = [...data.data];
      cacheTable.total = data.total;
    },
  });
};

// 修改明细数据记录 {projectRowData，editItemData，callBack: () => (msg:string)}
const editCacheDetail = (editItemData: any) => {
  projectInfor.editCacheDetail({
    projectRowData: Props.prompt.row,
    editItemData: editItemData,
    callBack: (msg: string) => {
      layer.msg(msg, { area: "50%", time: 1500 });
      getCacheDetail();
    },
  });
};

// 新增明细数据记录 {projectRowData，editItemData，callBack: () => (msg:string)}
const addCacheDetail = (editItemData: any) => {
  projectInfor.addCacheDetail({
    projectRowData: Props.prompt.row,
    editItemData: editItemData,
    callBack: (msg: string) => {
      layer.msg(msg, { area: "50%", time: 1500 });
      getCacheDetail();
    },
  });
};

const editData = (row: any) => {
  editPayItem.value.id = row.id;
  editPayItem.value.projectID = row.projectID;
  editPayItem.value.projectName = row.projectName;
  editPayItem.value.cacheName = row.cacheName;
  editPayItem.value.cacheNum = row.cacheNum;
  editPayItem.value.desc = row.desc;
  areaVisibleChange();
};

const newPayItem = () => {
  editPayItem.value.id = -2;
  editPayItem.value.projectID = Props.prompt.row.id;
  editPayItem.value.projectName = Props.prompt.row.nickName;
  areaVisibleChange();
};

// 左侧导航显隐控制切换函数
const areaVisibleChange = () => {
  areaFormVisible.value = !areaFormVisible.value;
};

// 新增和修改数据确认代码
const areaFormAction = ref([
  {
    text: "确认",
    callback: () => {
      //layer.confirm("确认操作", { shade: false });
      if (editPayItem.value.id == -2) {
        addCacheDetail(editPayItem.value);
      } else {
        editCacheDetail(editPayItem.value);
      }
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

const auditLevel = (row: any) => {
  if (
    !row.auditLevel ||
    !projectData.tableData[0].auditLevelTotal ||
    row.auditLevel < 2
  ) {
    return 1;
  } else if (
    row.auditLevel > 1 &&
    row.auditLevel < projectData.tableData[0].auditLevelTotal
  ) {
    return 2;
  } else if (row.auditLevel == projectData.tableData[0].auditLevelTotal) {
    return 3;
  } else {
    return 4;
  }
};

const unAuditButton = (row: any) => {
  if (
    !row.auditLevel ||
    !projectData.tableData[0].auditLevelTotal ||
    row.auditLevel < 2 ||
    row.auditLevel > projectData.tableData[0].auditLevelTotal
  ) {
    return false;
  } else {
    return true;
  }
};

// !projectData.tableData[0].auditLevel ||
// projectData.tableData[0].auditLevel < 1

const cacheTableColumns = [
  // { title: "选项", width: "35px", type: "checkbox", fixed: "left" },
  {
    title: "ID",
    width: "60px",
    key: "id",
  },
  {
    title: "项目名称",
    width: "160px",
    key: "projectName",
  },
  {
    title: "支付项目",
    width: "180px",
    key: "cacheName",
  },
  {
    title: "支付金额",
    width: "100px",
    key: "cacheNum",
  },
  {
    title: "创建日期",
    width: "130px",
    key: "CreateDate",
  },
  {
    title: "支付说明",
    width: "300px",
    key: "desc",
  },
  {
    title: "操作",
    align: "center",
    width: "135px",
    customSlot: "operator",
    key: "operator",
    fixed: "right",
    ignoreExport: true,
  },
];

const projectData = reactive({
  tableData: [] as projectCacheDateType[],
});
onMounted(() => {
  // 这里的代码会在组件被挂载到DOM后执行
  loadTableDataSource();
  getCacheDetail();
});

// 数据表改变事件
const cachePageChange = () => {
  loading.value = true;
  loadTableDataSource();
  getCacheDetail();
};

// 数据表数据行双击事件
const rowDouble = (item: any) => {
  layer.msg(item, { area: "50%" });
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
  min-height: 70px;
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
  border-bottom: 1px solid #e6e6e6;
  transition: 0.5s;
}

.unitSelectContainer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-evenly;
  gap: 1rem;
  margin-bottom: 15px;
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
  height: 0px;
  overflow: hidden;
  transition: 0.5s;
}

.leaderAreaSelect:hover .leaderContent,
.leaderUnitSelect:hover .leaderContent {
  height: auto;
  padding: 1rem 1rem;
}

.ContentList {
  margin-bottom: 5px;
}

/* ============================================================ */
</style>
