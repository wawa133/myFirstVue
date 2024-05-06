<template>
  <!-- 表头导航 -->
  <lay-panel class="leaderAreaSelect">
    <div class="rightLeader">
      <!-- 面包屑导航条 -->
      <div class="leaderItem">
        <lay-breadcrumb separator-icon="layui-icon-right">
          <lay-breadcrumb-item
            v-for="(data, key) in storeRowData.pathEditNav"
            :key="nanoid() + key"
          >
            {{ data.name }}
          </lay-breadcrumb-item>
        </lay-breadcrumb>
      </div>
      <div class="leaderTitle">
        <div>物资名称：{{ storeRowData.name }}(序号：{{ storeRowData.codeNumber }})</div>
        <div>
          库存数量：({{ totalInOut.inTotal - totalInOut.outTotal
          }}{{ storeRowData.priceUnit }})
        </div>
      </div>
    </div>
  </lay-panel>

  <!-- 列表部分 -->
  <div class="ContentList">
    <lay-table
      max-height="1000px"
      :auto-col-width="true"
      :page="pageTable"
      :columns="tableColumns"
      :data-source="requestData"
      :default-toolbar="true"
      even
      v-model:selected-keys="selectedKeys"
      @change="tableChange"
      @row-double="rowDouble"
    >
      <template v-slot:toolbar>
        <lay-button size="sm" @click="outStoreClick">出库领用申请</lay-button>
        <lay-button size="sm" @click="inStoreClick">入库数据填报 </lay-button>
        <lay-button size="sm" @click="refreshTable">刷新 </lay-button>
      </template>
      <template v-slot:operator="{ row }">
        <div v-if="row.auditState > 0">
          <lay-button size="xs" type="primary" @click="requestAudit(row)"
            >数据审核</lay-button
          >
        </div>
        <div v-else-if="row.auditState === 0">
          <lay-button size="xs" type="primary" @click="editRow(row)">修改</lay-button>
          <lay-button size="xs" type="primary" @click="deleteRow(row)">删除</lay-button>
          <lay-button size="xs" type="primary" @click="submitRequest(row)"
            >提交</lay-button
          >
        </div>
      </template>
      <template #status="{ row }">
        <lay-switch :model-value="row.status"></lay-switch>
      </template>
    </lay-table>
  </div>
  <!-- 弹出模态框部分 'auto' 't' 'l' 'b' 'r' 'rb' ['100px','50px'] '100px' 'auto'-->
  <lay-layer
    v-model="storeOutFormT"
    :shade="false"
    :area="['560px', '340px']"
    :btn="storeOutFormAction"
    title="出库领用申请"
  >
    <div style="padding: 20px">
      <lay-form :model="storeOutFormData" ref="AssetsClassifyFromRef" labelWidth="150px">
        <lay-form-item label="申请数量" prop="storeOutNumber" required>
          <lay-input v-model="storeOutFormData.storeOutNum">
            <template #append> 单位:{{ storeRowData.priceUnit }}</template>
          </lay-input>
        </lay-form-item>
        <lay-form-item label="申请领用说明" prop="desc">
          <lay-textarea
            placeholder="请输入申请领用原因"
            v-model="storeOutFormData.desc"
          ></lay-textarea>
        </lay-form-item>
      </lay-form>
    </div>
  </lay-layer>
  <!-- 弹出模态框部分 'auto' 't' 'l' 'b' 'r' 'rb' ['100px','50px'] '100px' 'auto'-->
  <lay-layer
    v-model="storeInFormT"
    :shade="false"
    :area="['560px', '340px']"
    :btn="storeInFormAction"
    title="入库数据填报"
  >
    <div style="padding: 20px">
      <lay-form :model="storeInFormData" ref="AssetsClassifyFromRef" labelWidth="150px">
        <lay-form-item label="入库数量" prop="storeInNumber" required>
          <lay-input v-model="storeInFormData.storeInNum">
            <template #append> 单位:{{ storeRowData.priceUnit }}</template>
          </lay-input>
        </lay-form-item>
        <lay-form-item label="入库说明" prop="desc">
          <lay-textarea
            placeholder="请输产品的入库说明"
            v-model="storeInFormData.desc"
          ></lay-textarea>
        </lay-form-item>
      </lay-form>
    </div>
  </lay-layer>
  <!-- 用户组件的模板 -->
  <lay-layer
    v-model="requestAuditFormT"
    title="数据审核"
    :shade="true"
    :area="['650px', '820px']"
  >
    <div>
      <!-- <UserSelect :requestRow="requestRow"></UserSelect> -->
      <lay-panel></lay-panel>
      <div style="padding: 20px">
        <lay-form :model="requestRow" ref="AssetsClassifyFromRef" labelWidth="150px">
          <lay-form-item label="审核操作" prop="storeInNumber" required>
            <lay-button size="sm" type="primary" @click="allowAudit(requestRow)"
              >审核通过</lay-button
            >
            <lay-button size="sm" type="primary" @click="refuseAudit(requestRow)"
              >退回修改</lay-button
            >
          </lay-form-item>
          <lay-form-item label="审核意见" prop="desc">
            <lay-textarea
              placeholder="通过或不通过说明"
              v-model="requestRow.desc"
            ></lay-textarea>
          </lay-form-item>
        </lay-form>
      </div>

      <lay-table
        max-height="1000px"
        :auto-col-width="true"
        :page="pageAudtiTable"
        :columns="audtiTabletableColumns"
        :data-source="auditTableData"
        :default-toolbar="true"
        even
        v-model:selected-keys="selectedKeys"
        @change="tableChange"
        @row-double="rowDouble"
      >
        <template v-slot:toolbar>
          <!-- <lay-button size="sm" @click="refreshTable">刷新 </lay-button> -->
        </template>
        <template #status="{ row }">
          <lay-switch :model-value="row.status"></lay-switch>
        </template>
      </lay-table>
    </div>
  </lay-layer>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { layer } from "@layui/layer-vue";
import { nanoid } from "nanoid";
import storageAdmin from "@/api/storageAdmin";

const Props = defineProps(["option"]);
const pageTable = reactive({ current: 1, limit: 15, total: 100 });
const pageAudtiTable = reactive({ current: 1, limit: 15, total: 100 });
const selectedKeys = ref([]);
const storeInFormT = ref(false);
const storeOutFormT = ref(false);
const requestAuditFormT = ref(false);
const totalInOut = ref({ inTotal: 0, outTotal: 0 });

const deleteRow = (row: any) => {
  if (row.auditState !== 0) return layer.msg("已审核，无法删除");
  delSelectRowsConfirm(row);
};
const delSelectRowsConfirm = (row: any) => {
  layer.confirm("确认删除，数据不可恢复！！", {
    btn: [
      {
        text: "确认删除",
        callback: (id: any) => {
          delStoreInOutData(row);
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

//======================================================================
const editRow = (row: any) => {
  if (row.auditState !== 0) return layer.msg("已审核，无法修改");
  if (row.storeInNum > 0) {
    storeInFormData.value = row;
    storeInFormT.value = true;
  } else {
    storeOutFormData.value = row;
    storeOutFormT.value = true;
  }
};

const inStoreClick = () => {
  storeInFormData.value.id = -2;
  storeInFormT.value = true;
};

const outStoreClick = () => {
  storeOutFormData.value.id = -2;
  storeOutFormT.value = true;
};

const storeInFormAction = ref([
  {
    text: "确定",
    callback: () => {
      if (storeInFormData.value.id === undefined) return;
      if (storeInFormData.value.id > 0) {
        editStoreInOutData(storeInFormData.value);
      } else {
        addStoreInOutData(storeInFormData.value);
      }
      storeInFormT.value = false;
    },
  },
  {
    text: "取消",
    callback: () => {
      storeInFormT.value = false;
    },
  },
]);

const storeOutFormAction = ref([
  {
    text: "确定",
    callback: () => {
      if (storeOutFormData.value.id === undefined) return;
      if (storeOutFormData.value.id > 0) {
        editStoreInOutData(storeOutFormData.value);
      } else {
        addStoreInOutData(storeOutFormData.value);
      }
      storeOutFormT.value = false;
    },
  },
]);
//-------------------------------------------------

const auditTableData = ref<Array<auditTableDataType>>([]);
interface auditTableDataType {
  id?: number;
  date?: string;
  userID?: number;
  userName?: string;
  beforeLevel?: number;
  action?: string;
  desc?: string;
}
// 定义区域导航选单数据变量【导航栏】
let storeRowData = ref<storageDataType>({});
interface pathDataType {
  id?: number;
  name?: string;
  level?: number;
  desc?: string;
}
interface storageDataType {
  id?: number;
  name?: string;
  codeNumber?: string;
  specification?: string;
  supplier?: string;
  supplierPhone?: string;
  unitPrice?: number;
  priceUnit?: string;
  stockNumber?: number;
  alertNumber?: number;
  numberUnit?: string;
  drugChemicals?: boolean;
  explosionChemicals?: boolean;
  keeperName?: string;
  keeperID?: number;
  keeperUnitName?: string;
  keeperUnitID?: number;
  storeLocation?: string;
  desc?: string;
  pathEditNav?: Array<pathDataType>;
  pathEditSelect?: string;
}

const storeOutFormData = ref<requestRowType>({
  storeOutNum: 0,
  desc: "",
});
const storeInFormData = ref<requestRowType>({
  storeInNum: 0,
  desc: "",
});
let requestData = ref<Array<requestRowType>>([]);
let requestRow = ref<requestRowType>({});
interface requestRowType {
  id?: number;
  storeInNum?: number;
  storeOutNum?: number;
  unitBaseID?: number;
  unitBaseName?: string;
  storageDataID?: number;
  storageDataName?: string;
  isDelete?: number;
  applyUserID?: number;
  applyUserName?: string;
  applyDate?: string;
  operations?: string;
  desc?: string;
  auditState?: number;
}

const requestAudit = (row: requestRowType) => {
  requestRow.value = row;
  //console.log(requestRow.value);
  if (row.operations === null) (row as any).operations = [];
  auditTableData.value = [...(row as any).operations];
  pageAudtiTable.total = auditTableData.value.length;
  pageAudtiTable.limit = auditTableData.value.length;
  requestAuditFormT.value = true;
};

onMounted(() => {
  // 初始化数据
  storeRowData.value = Props.option;
  getStoreInOutData();
});

const tableChange = () => {
  getStoreInOutData();
};

const rowDouble = () => {
  // Props.addTab({ row: row, title: row.name + row.id, action: "物资详情" });
};

const refreshTable = () => {
  getStoreInOutData();
};

const allowAudit = (row: any) => {
  requestAuditFormT.value = false;
  row.allowAudit = true;
  submitAudit(row);
};

const refuseAudit = (row: any) => {
  requestAuditFormT.value = false;
  row.allowAudit = false;
  submitAudit(row);
};

const submitRequest = (row: any) => {
  row.allowAudit = true;
  submitAudit(row);
};

//areaInfor.get({ pathListData: pageData, pageData: page, callBack });
const getStoreInOutData = () => {
  storageAdmin.getStoreInOutData({
    storageRecorder: Props.option,
    pageData: pageTable,
    callBack: (res: { data: any; total: number; inTotal: number; outTotal: number }) => {
      requestData.value = [...res.data];
      pageTable.total = res.total;
      totalInOut.value.inTotal = res.inTotal;
      totalInOut.value.outTotal = res.outTotal;
    },
  });
};

const addStoreInOutData = (row: any) => {
  storageAdmin.addStoreInOutData({
    storageRecorder: Props.option,
    recorderData: row,
    callBack: (msg: string) => {
      layer.msg(msg);
      getStoreInOutData();
    },
  });
};

const editStoreInOutData = (row: any) => {
  storageAdmin.editStoreInOutData({
    storageRecorder: Props.option,
    recorderData: row,
    callBack: (msg: string) => {
      layer.msg(msg);
      getStoreInOutData();
    },
  });
};

const submitAudit = (row: any) => {
  console.log(row);
  storageAdmin.submitAudit({
    storageRecorder: Props.option,
    recorderData: row,
    callBack: (msg: string) => {
      layer.msg(msg);
      getStoreInOutData();
    },
  });
};

const delStoreInOutData = (Recorder: any) => {
  storageAdmin.delStoreInOutData({
    storageRecorder: Props.option,
    recorderData: Recorder,
    callBack: (msg: string) => {
      layer.msg(msg, { area: "50%", time: 3000 });
      getStoreInOutData();
    },
  });
};
const tableColumns = [
  {
    title: "序号",
    width: "33px",
    key: "id",
  },
  {
    title: "申请操作人",
    width: "80px",
    key: "applyUserName",
  },
  {
    title: "申请时间",
    width: "80px",
    key: "applyDate",
  },
  {
    title: "入库数量",
    width: "50px",
    key: "storeInNum",
  },
  {
    title: "出库数量",
    width: "50px",
    key: "storeOutNum",
  },
  {
    title: "出入库事由",
    width: "160px",
    key: "desc",
  },
  {
    title: "操作",
    width: "105px",
    customSlot: "operator",
    key: "operator",
    fixed: "right",
    ignoreExport: true,
    align: "center",
  },
];
const audtiTabletableColumns = [
  {
    title: "序号",
    width: "33px",
    key: "id",
  },
  {
    title: "处理时间",
    width: "80px",
    key: "date",
  },
  {
    title: "处理人",
    width: "50px",
    key: "userName",
  },
  {
    title: "处理事件",
    width: "50px",
    key: "action",
  },
  {
    title: "处理意见",
    width: "160px",
    key: "desc",
  },
];
</script>

<style scoped>
.leaderAreaSelect .leaderContent,
.leaderUnitSelect .leaderContent {
  /* display: none; */
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

.filter {
  display: flex;
  flex-wrap: wrap;
}

.filter .layui-form-item {
  padding: 7px;
  margin-bottom: 1px;
}

/* .filter .layui-form-item .layui-form-label {
  width: 100px;
} */

.filter .layui-form-item .layui-input-block {
  margin-bottom: 1px;
}

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
  color: rgba(26, 26, 27, 0.9);
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
  /* min-height: 100px; */
  transition: 0.5s;
}

.leaderItem {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  line-height: 30px;
  padding-left: 0.5rem;
  border-bottom: 1px solid rgba(146, 142, 142, 0.342);
  cursor: pointer;
}

.leaderContent {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  line-height: 30px;
  /* min-height: 60px; */
  /* height: 60px; */
  padding: 1rem 1rem;
  height: 0px;
  padding: 0rem 0rem;
  border-bottom: 1px solid #c3c3c9;
  transition: 0.5s;
  /* overflow: hidden; */
}

.leaderTitle {
  font-size: 1.3rem;
  font-weight: bold;
  margin-top: 10px;
}
/* ============================================================ */
</style>
