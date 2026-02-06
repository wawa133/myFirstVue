<template>
  <!-- 表头导航 -->
  <lay-panel class="leaderAreaSelect">
    <div class="rightLeader">
      <!-- 面包屑导航条 -->
      <div class="leaderItem">
        <lay-breadcrumb separator-icon="layui-icon-right">
          <lay-breadcrumb-item
            v-for:="(data, key) in pathNavData"
            @click="NavClick(key)"
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
            v-for:="(data, key) in pathData"
            :key="nanoid()"
            @click="areaNavDataClick(data)"
          >
            <template #icon>
              <lay-icon type="layui-icon-vercode" />
            </template>
            {{ data.name }}
          </lay-tag>
        </lay-space>
      </div>
    </div>
  </lay-panel>

  <lay-panel class="leaderAreaSelect">
    <div class="leaderItem">
      <lay-form
        :model="tableFielter"
        :label-position="labelPosition3"
        mode="inline"
        :pane="true"
      >
        <div class="filter">
          <lay-form-item label="单位类型" prop="unitType">
            <lay-select v-model="tableFielter.unitType">
              <lay-select-option :value="''" label="全部类型"></lay-select-option>
              <lay-select-option :value="'企业'" label="企业"></lay-select-option>
              <lay-select-option :value="'合作社'" label="合作社"></lay-select-option>
              <lay-select-option :value="'家庭农场'" label="家庭农场"></lay-select-option>
              <lay-select-option :value="'规模场户'" label="规模场户"></lay-select-option>
              <lay-select-option :value="'散户'" label="散户"></lay-select-option>
              <lay-select-option :value="'其它'" label="其它"></lay-select-option>
            </lay-select>
          </lay-form-item>
          <lay-form-item label="生产类型" prop="produceType">
            <lay-select v-model="tableFielter.produceType">
              <lay-select-option :value="''" label="全部类型"></lay-select-option>
              <lay-select-option :value="'畜牧养殖'" label="畜牧养殖"></lay-select-option>
              <lay-select-option :value="'水产养殖'" label="水产养殖"></lay-select-option>
              <lay-select-option :value="'农业种植'" label="农业种植"></lay-select-option>
              <lay-select-option :value="'生产加工'" label="生产加工"></lay-select-option>
              <lay-select-option :value="'农资销售'" label="农资销售"></lay-select-option>
              <lay-select-option :value="'其它'" label="其它"></lay-select-option>
            </lay-select>
          </lay-form-item>
          <lay-form-item label="严格模式" prop="matchStrict" mode="inline">
            <lay-switch v-model="tableFielter.matchStrict"></lay-switch>
          </lay-form-item>
          <lay-form-item label="显示删除" prop="displayDelete" mode="inline">
            <lay-switch v-model="tableFielter.displayDelete"></lay-switch>
          </lay-form-item>
        </div>
      </lay-form>
    </div>
  </lay-panel>

  <!-- 列表部分 -->
  <div class="ContentList">
    <lay-table
      max-height="1000px"
      :auto-col-width="true"
      :page="pageTable"
      :columns="tableColumns"
      :data-source="assetsData"
      even
      v-model:selected-keys="selectedKeys"
      @change="tableChange"
      @row-double="rowDouble"
    >
      <template #status="{ row }">
        <lay-switch :model-value="row.status"></lay-switch>
      </template>
      <template v-slot:toolbar>
        <lay-button size="sm" type="primary" @click="addData(AssetsDataRow)"
          >新增</lay-button
        >
        <lay-button size="sm" @click="delSelectRows">删除</lay-button>
      </template>
      <template v-slot:operator="{ row }">
        <lay-button size="xs" type="primary" @click="editData(row)">编辑</lay-button>
        <lay-button
          v-if="row.isDelete == 0 || row.isDelete == null"
          size="xs"
          type="primary"
          @click="removeData(row)"
          >删除</lay-button
        >
        <lay-button v-else size="xs" type="primary" @click="recoverData(row)"
          >恢复</lay-button
        >
      </template>
    </lay-table>
  </div>

  <!-- 弹出模态框部分 'auto' 't' 'l' 'b' 'r' 'rb' ['100px','50px'] '100px' 'auto'-->
  <lay-layer
    v-model="AssetsClassifyFormT"
    :shade="false"
    :area="['560px', '940px']"
    :btn="mainBodyAction"
    title="添加/修分类信息"
    :offset="'rb'"
  >
    <div style="padding: 20px">
      <lay-form :model="AssetsDataRow" ref="AssetsClassifyFromRef" labelWidth="150px">
        <lay-form-item label="物资类别" prop="pathEditNav">
          <lay-breadcrumb separator-icon="layui-icon-right">
            <lay-breadcrumb-item
              v-for:="(data, key) in AssetsDataRow.pathEditNav"
              @click="pathEditNavClick(key)"
              :key="nanoid()"
            >
              {{ data.name }}
            </lay-breadcrumb-item>
          </lay-breadcrumb>
          <lay-select
            v-model="AssetsDataRow.assteClass"
            @change="pathEditDataClick($event)"
            placeholder="选择修改区域"
          >
            <lay-select-option
              v-for="(data, key) in pathEditData"
              :key="nanoid() + key"
              :value="data.name + ''"
              :label="data.name"
            ></lay-select-option>
          </lay-select>
        </lay-form-item>
        <lay-form-item label="资产编号" prop="codeNumber" required>
          <lay-input v-model="AssetsDataRow.codeNumber"></lay-input>
        </lay-form-item>
        <lay-form-item label="产品名称" prop="name" required>
          <lay-input v-model="AssetsDataRow.name"></lay-input>
        </lay-form-item>
        <lay-form-item label="产品型号" prop="model">
          <lay-input v-model="AssetsDataRow.model"></lay-input>
        </lay-form-item>
        <lay-form-item label="产品数量" prop="number">
          <lay-input v-model="AssetsDataRow.number"></lay-input>
        </lay-form-item>
        <lay-form-item label="数量单位" prop="unit">
          <lay-input v-model="AssetsDataRow.unit"></lay-input>
        </lay-form-item>
        <lay-form-item label="产品原值" prop="initialValue">
          <lay-input v-model="AssetsDataRow.initialValue"></lay-input>
        </lay-form-item>
        <lay-form-item label="RMB单位" prop="initialUnit">
          <lay-select v-model="AssetsDataRow.initialUnit" placeholder="请选择">
            <lay-select-option :value="'元'" label="元"></lay-select-option>
            <lay-select-option :value="'万元'" label="万元"></lay-select-option>
            <lay-select-option :value="'亿元'" label="亿元"></lay-select-option>
          </lay-select>
        </lay-form-item>
        <lay-form-item label="供应商名" prop="supplier">
          <lay-input v-model="AssetsDataRow.supplier"></lay-input>
        </lay-form-item>
        <lay-form-item label="供货时间" prop="supplyData">
          <lay-date-picker
            v-model="AssetsDataRow.supplyData"
            simple
            type="date"
            :format="'YYYY/MM/DD'"
            placeholder="点击选择日期"
          ></lay-date-picker>
        </lay-form-item>
        <lay-form-item label="售后服务" prop="serviceInfo">
          <lay-input v-model="AssetsDataRow.serviceInfo"></lay-input>
        </lay-form-item>
        <lay-form-item label="保管科站" prop="keeperUnitName">
          <lay-input v-model="AssetsDataRow.keeperUnitName">
            <template #append>
              <lay-icon type="layui-icon-set-fill" @click="openUnit"></lay-icon>
            </template>
          </lay-input>
        </lay-form-item>
        <lay-form-item label="保管人" prop="keeperName">
          <lay-input v-model="AssetsDataRow.keeperName">
            <template #append>
              <lay-icon type="layui-icon-set-fill" @click="openUser"></lay-icon>
            </template>
          </lay-input>
        </lay-form-item>
        <lay-form-item label="存放地址" prop="model">
          <lay-input v-model="AssetsDataRow.storeLocation"></lay-input>
        </lay-form-item>
        <lay-form-item label="描述" prop="desc">
          <lay-textarea
            placeholder="请输入关键字描述"
            v-model="AssetsDataRow.desc"
          ></lay-textarea>
        </lay-form-item>
      </lay-form>
    </div>
  </lay-layer>
  <!-- 单位组件的模板 -->
  <lay-layer v-model="unitFormT" :shade="true" :area="['650px', '820px']">
    <div>
      <UnitSelect :setMainBody="setFormUnit"></UnitSelect>
    </div>
  </lay-layer>
  <!-- 用户组件的模板 -->
  <lay-layer v-model="userFormT" :shade="true" :area="['650px', '820px']">
    <div>
      <UserSelect :setMainBody="setFormUser"></UserSelect>
    </div>
  </lay-layer>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, computed } from "vue";
import { layer } from "@layui/layer-vue";
import { nanoid } from "nanoid";
import assetsAdmin from "@/api/assetsAdmin";
import UserSelect from "@/components/userInformation/userSelectLayer.vue";
import UnitSelect from "@/components/unitComponent/UnitSelectLayer.vue";

const Props = defineProps(["addTab"]);
const AssetsClassifyFormT = ref(false);
const unitFormT = ref(false);
const userFormT = ref(false);

// 数据表页导航条变量
const pageTable = reactive({ current: 1, limit: 50, total: 100 });
const pagePathEdit = reactive({ current: 1, limit: 50, total: 100 });
const selectedKeys = ref([]);
const labelPosition3 = ref("left");

const tableFielter = reactive<{
  unitType?: string;
  produceType?: string;
  matchStrict?: boolean;
  displayDelete?: boolean;
}>({});

// 弹出模态框部分区域导航及选项
const pathEditData = ref<Array<pathDataType>>([{ id: -2, name: "物资分类", level: -2 }]);
const pathNavData = ref<Array<pathDataType>>([{ id: -2, name: "物资分类", level: -2 }]);
const pathData = ref<Array<pathDataType>>([]);
interface pathDataType {
  id?: number;
  name?: string;
  level?: number;
  desc?: string;
}

const assetsData = ref<Array<assetsDataType>>([]);
interface assetsDataType {
  id?: number;
  codeNumber?: string;
  name?: string;
  model?: string;
  number?: number;
  unit?: string;
  initialValue?: number;
  initialUnit?: string;
  supplier?: string;
  supplyData?: string;
  serviceInfo?: string;
  keeperUnitName?: string;
  keeperUnitID?: number;
  keeperName?: string;
  keeperID?: number;
  storeLocation?: string;
  desc?: string;
  pathEditNav?: Array<pathDataType>;
  assteClass?: string;
}

const AssetsDataRow = ref({
  id: -2,
  codeNumber: "",
  name: "",
  model: "",
  number: 0,
  unit: "",
  initialValue: 0,
  initialUnit: "",
  supplier: "",
  supplyData: "",
  serviceInfo: "",
  keeperUnitName: "",
  keeperUnitID: null,
  keeperName: "",
  keeperID: null,
  storeLocation: "",
  desc: "",
  pathEditNav: [] as Array<pathDataType>,
  assteClass: "",
});

onMounted(() => {
  // 初始化数据
  getClassify();
  getPathEditData();
  getAssetsData();
});

watch(
  tableFielter,
  () => {
    getAssetsData();
  },
  { deep: true }
);

const pathNavDataState = computed(() => pathNavData.value);
watch(
  pathNavDataState,
  () => {
    getClassify();
    getAssetsData();
  },
  { deep: true }
);

const pathEditNavState = computed(() => AssetsDataRow.value.pathEditNav);
watch(
  pathEditNavState,
  () => {
    getPathEditData();
  },
  { deep: true }
);

// 左侧树形结构菜单点击事件
const pathEditDataClick = (e: any) => {
  let item = pathEditData.value.find((item) => item.name === e);
  if (item !== undefined) {
    AssetsDataRow.value.pathEditNav.push(item);
  }
};

const pathEditNavClick = (index: number) => {
  AssetsDataRow.value.pathEditNav = AssetsDataRow.value.pathEditNav.slice(0, index + 1);
  //console.log(index);
};

const setFormUnit = (row: any) => {
  console.log(row);
  AssetsDataRow.value.keeperUnitName = row.unitRow.name;
  AssetsDataRow.value.keeperUnitID = row.unitRow.id;
  unitFormT.value = false;
};

const setFormUser = (row: any) => {
  console.log(row);
  AssetsDataRow.value.keeperName = row.userRecorder.userName;
  AssetsDataRow.value.keeperID = row.userRecorder.id;
  userFormT.value = false;
};

const openUnit = () => {
  unitFormT.value = !unitFormT.value;
};

const openUser = () => {
  userFormT.value = !userFormT.value;
};

// 弹出模态框部分
const mainBodyVisibleChange = () => {
  AssetsClassifyFormT.value = !AssetsClassifyFormT.value;
};

// 左侧树形结构菜单点击事件userStore.leaderAreaData
const areaNavDataClick = (item: any) => {
  pathNavData.value.push(item);
};

const NavClick = (sn: any) => {
  pathNavData.value = pathNavData.value.slice(0, sn + 1);
};

const tableChange = () => {
  getAssetsData();
};

const rowDouble = (row: any) => {
  //console.log(row);
  Props.addTab({ row: row, action: "物资详情" + row.id });
  //pathNavData.value.push(row);
};

//************************************************************* */
// 新增数据
const addData = (rowData: any) => {
  rowData.id = -2;
  AssetsDataRow.value.pathEditNav = [...pathNavData.value];
  getPathEditData();
  mainBodyVisibleChange();
};

// 修改数据
const editData = (rowData: any) => {
  AssetsDataRow.value = { ...AssetsDataRow.value, ...rowData };
  mainBodyVisibleChange();
};

const recoverData = (rowData: any) => {
  recoverAssetsData(rowData);
  //layer.msg("恢复操作");
  //console.log(rowData);
};

// 新增和修改数据确认代码addClassify
const mainBodyAction = ref([
  {
    text: "确认",
    callback: () => {
      if (AssetsDataRow.value.id > 0) editAssetsData(AssetsDataRow.value);
      else addAssetsData(AssetsDataRow.value);
      mainBodyVisibleChange();
    },
  },
  {
    text: "取消",
    callback: () => {
      mainBodyVisibleChange();
    },
  },
]);
//---------------------------------------------------------------

//************************************************************* */
const delSelectRows = () => {
  let selectedItemArr: any = [];
  selectedKeys.value.forEach((item: any) => {
    assetsData.value.forEach((item2: any) => {
      if (item == item2.id) {
        selectedItemArr.push(item2);
      }
    });
  });

  if (selectedItemArr.length == 0) {
    layer.msg("请选择要删除的数据", { area: "50%" });
    return;
  }
  delSelectRowsConfirm(selectedItemArr);
};

const removeData = (row: any) => {
  delSelectRowsConfirm([row]);
};

const delSelectRowsConfirm = (rows: any) => {
  layer.confirm("确认删除数据！！", {
    btn: [
      {
        text: "确认删除",
        callback: (id: any) => {
          delAssetsData(rows);
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
//--------------------------------------------------------------

//************************************************************* */assetsData
//areaInfor.get({ pathNavData: pageData, pageData: page, callBack });
const getAssetsData = () => {
  assetsAdmin.getAssetsData({
    pathNavData: pathNavData.value,
    pageData: pageTable,
    fielter: tableFielter,
    callBack: (res: { data: any; total: number }) => {
      assetsData.value = [...res.data];
      pageTable.total = res.total;
      //console.log(pathData.value);
    },
  });
};

//areaInfor.get({ recorderData: ..., callBack });
const addAssetsData = (row: any) => {
  assetsAdmin.addAssetsData({
    recorderData: row,
    callBack: (msg: string) => {
      layer.msg(msg);
      getAssetsData();
    },
  });
};

//areaInfor.get({ recorderData: ..., callBack });
const editAssetsData = (row: any) => {
  assetsAdmin.editAssetsData({
    recorderData: row,
    callBack: (msg: string) => {
      layer.msg(msg);
      getAssetsData();
    },
  });
};

//areaInfor.get({ recorderData: ..., callBack });
const recoverAssetsData = (row: any) => {
  assetsAdmin.recoverAssetsData({
    recorderData: row,
    callBack: (msg: string) => {
      layer.msg(msg);
      getAssetsData();
    },
  });
};

//areaInfor.get({ recordersData: ..., callBack });
const delAssetsData = (Recorders: any) => {
  assetsAdmin.delAssetsData({
    recordersData: Recorders,
    callBack: (msg: string) => {
      layer.msg(msg, { area: "50%", time: 3000 });
      getAssetsData();
    },
  });
};

//============================================================================
//areaInfor.get({ pathListData: pageData, pageData: page, callBack });
const getClassify = () => {
  assetsAdmin.getClassify({
    pathListData: pathNavData.value,
    pageData: pageTable,
    fielter: tableFielter,
    callBack: (res: { data: any; total: number }) => {
      pathData.value = [...res.data];
      pageTable.total = res.total;
    },
  });
};

//areaInfor.get({ pathListData: pageData, pageData: page, callBack }); pathEditData
const getPathEditData = () => {
  assetsAdmin.getClassify({
    pathListData: AssetsDataRow.value.pathEditNav,
    pageData: pagePathEdit,
    fielter: tableFielter,
    callBack: (res: { data: any; total: number }) => {
      pathEditData.value = [...res.data];
      pagePathEdit.total = res.total;
    },
  });
};

const tableColumns = [
  { title: "选项", width: "35px", type: "checkbox", fixed: "left" },
  {
    title: "序号",
    width: "33px",
    key: "id",
  },
  {
    title: "物资编号",
    width: "90px",
    key: "codeNumber",
  },
  {
    title: "产品名称",
    width: "80px",
    key: "name",
  },
  {
    title: "产品型号",
    width: "80px",
    key: "model",
  },
  {
    title: "数量",
    width: "80px",
    key: "number",
  },
  {
    title: "单位",
    width: "80px",
    key: "unit",
  },
  {
    title: "产品原值",
    width: "80px",
    key: "initialValue",
  },
  {
    title: "单位",
    width: "80px",
    key: "initialUnit",
  },
  {
    title: "供应单位",
    width: "80px",
    key: "supplier",
  },
  {
    title: "收货日期",
    width: "80px",
    key: "supplyData",
  },
  {
    title: "售后服务",
    width: "80px",
    key: "serviceInfo",
  },
  {
    title: "保管科站",
    width: "80px",
    key: "keeperUnitName",
  },
  {
    title: "保管人",
    width: "80px",
    key: "keeperName",
  },
  {
    title: "存放地址",
    width: "80px",
    key: "storeLocation",
  },
  {
    title: "备注说明",
    width: "80px",
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
</script>

<style scoped>
.leaderAreaSelect .leaderContent,
.leaderUnitSelect .leaderContent {
  /* display: none; */
  /* height: 0px; */
  height: auto;
  padding: 1rem 1rem;
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
  height: auto;
  border-bottom: 1px solid #c3c3c9;
  transition: 0.5s;
  /* overflow: hidden; */
}
/* ============================================================ */
</style>
