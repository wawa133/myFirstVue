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
      :data-source="storageData"
      even
      v-model:selected-keys="selectedKeys"
      @change="tableChange"
      @row-double="rowDouble"
    >
      <template #status="{ row }">
        <lay-switch :model-value="row.status"></lay-switch>
      </template>
      <template v-slot:toolbar>
        <lay-button size="sm" type="primary" @click="addData(storageDataRow)"
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
    v-model="storageDataFormT"
    :shade="false"
    :area="['560px', '940px']"
    :btn="mainBodyAction"
    title="添加/修分类信息"
    :offset="'rb'"
  >
    <div style="padding: 20px">
      <lay-form :model="storageDataRow" ref="storageDataFromRef" labelWidth="150px">
        <lay-form-item label="库存归类" prop="pathEditNav">
          <lay-breadcrumb separator-icon="layui-icon-right">
            <lay-breadcrumb-item
              v-for:="(data, key) in storageDataRow.pathEditNav"
              @click="pathEditNavClick(key)"
              :key="nanoid()"
            >
              {{ data.name }}
            </lay-breadcrumb-item>
          </lay-breadcrumb>
          <lay-select
            v-model="storageDataRow.pathEditSelect"
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
        <lay-form-item label="产品名称" prop="name" required>
          <lay-input v-model="storageDataRow.name"></lay-input>
        </lay-form-item>
        <lay-form-item label="产品编号" prop="codeNumber">
          <lay-input v-model="storageDataRow.codeNumber"></lay-input>
        </lay-form-item>
        <lay-form-item label="产品规格" prop="specification">
          <lay-input v-model="storageDataRow.specification"></lay-input>
        </lay-form-item>
        <lay-form-item label="供应商名" prop="supplier">
          <lay-input v-model="storageDataRow.supplier"></lay-input>
        </lay-form-item>
        <lay-form-item label="联系方式" prop="supplierPhone">
          <lay-input v-model="storageDataRow.supplierPhone"></lay-input>
        </lay-form-item>

        <div class="layLayer layui-input-inline">
          <lay-form-item label="进购单价" prop="unitPrice" mode="inline">
            <lay-input v-model="storageDataRow.unitPrice"></lay-input>
          </lay-form-item>
          <lay-form-item label="价格单位" prop="priceUnit" mode="inline">
            <lay-input v-model="storageDataRow.priceUnit">
              <template #append>
                <lay-icon type="layui-icon-set-fill"></lay-icon>
              </template>
            </lay-input>
          </lay-form-item>
        </div>

        <div class="layLayer layui-input-inline">
          <lay-form-item label="库存数量" prop="stockNumber" mode="inline">
            <lay-input v-model="storageDataRow.stockNumber"></lay-input>
          </lay-form-item>

          <lay-form-item label="预警数量" prop="alertNumber" mode="inline">
            <lay-input v-model="storageDataRow.alertNumber"></lay-input>
          </lay-form-item>
        </div>

        <lay-form-item label="数量单位" prop="numberUnit">
          <lay-input v-model="storageDataRow.numberUnit">
            <template #append>
              <lay-icon type="layui-icon-set-fill"></lay-icon>
            </template>
          </lay-input>
        </lay-form-item>

        <div class="layLayer layui-input-inline">
          <lay-form-item label="属易制毒" prop="drugChemicals" mode="inline">
            <lay-switch v-model="storageDataRow.drugChemicals"></lay-switch>
          </lay-form-item>
          <lay-form-item label="属易制爆" prop="explosionChemicals" mode="inline">
            <lay-switch v-model="storageDataRow.explosionChemicals"></lay-switch>
          </lay-form-item>
        </div>

        <lay-form-item label="保管人员" prop="keeperName">
          <lay-input v-model="storageDataRow.keeperName">
            <template #append>
              <lay-icon type="layui-icon-set-fill" @click="openUser"></lay-icon>
            </template>
          </lay-input>
        </lay-form-item>
        <lay-form-item label="存放位置" prop="storeLocation">
          <lay-input v-model="storageDataRow.storeLocation"></lay-input>
        </lay-form-item>
        <lay-form-item label="其它说明" prop="desc">
          <lay-textarea
            placeholder="产品其它相关说明"
            v-model="storageDataRow.desc"
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
import storageAdmin from "@/api/storageAdmin";
import UserSelect from "@/components/userInformation/userSelectLayer.vue";
import UnitSelect from "@/components/unitComponent/UnitSelectLayer.vue";

const Props = defineProps(["addTab"]);
const storageDataFormT = ref(false);
const unitFormT = ref(false);
const userFormT = ref(false);

// 数据表页导航条变量
const pageTable = reactive({ current: 1, limit: 50, total: 100 });
const pagePathEdit = reactive({ current: 1, limit: 50, total: 100 });
const selectedKeys = ref([]);
const labelPosition3 = ref<"left" | "right" | "top" | undefined>("left");

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

//pathEditNav: [{ id: -2, name: "物资分类", level: -2 }],
const storageData = ref<Array<storageDataType>>([]);
const storageDataRow = ref<storageDataType>({
  id: -2,
  pathEditNav: [{ id: -2, name: "物资分类", level: -2 }],
});
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

onMounted(() => {
  // 初始化数据
  getClassify();
  getPathEditData();
  getStorageData();
});

watch(
  tableFielter,
  () => {
    getStorageData();
  },
  { deep: true }
);

const pathNavDataState = computed(() => pathNavData.value);
watch(
  pathNavDataState,
  () => {
    getClassify();
    getStorageData();
  },
  { deep: true }
);

const pathEditNavState = computed(() => storageDataRow.value.pathEditNav);
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
  if (item !== undefined && storageDataRow.value.pathEditNav !== undefined) {
    storageDataRow.value.pathEditNav.push(item);
  }
};

const pathEditNavClick = (index: number) => {
  if (storageDataRow.value.pathEditNav !== undefined) {
    storageDataRow.value.pathEditNav = storageDataRow.value.pathEditNav.slice(
      0,
      index + 1
    );
  }
};

const setFormUnit = (row: any) => {
  console.log(row);
  storageDataRow.value.keeperUnitName = row.unitRow.name;
  storageDataRow.value.keeperUnitID = row.unitRow.id;
  unitFormT.value = false;
};

const setFormUser = (row: any) => {
  //console.log(row);
  storageDataRow.value.keeperName = row.userRecorder.userName;
  storageDataRow.value.keeperID = row.userRecorder.id;
  userFormT.value = false;
};

// const openUnit = () => {
//   unitFormT.value = !unitFormT.value;
// };

const openUser = () => {
  userFormT.value = !userFormT.value;
};

// 弹出模态框部分
const mainBodyVisibleChange = () => {
  storageDataFormT.value = !storageDataFormT.value;
};

// 左侧树形结构菜单点击事件userStore.leaderAreaData
const areaNavDataClick = (item: any) => {
  pathNavData.value.push(item);
};

const NavClick = (sn: any) => {
  pathNavData.value = pathNavData.value.slice(0, sn + 1);
};

const tableChange = () => {
  getStorageData();
};

const rowDouble = (row: any) => {
  //console.log(row);
  Props.addTab({ row: row, title: row.name + "-出入库记录", action: "物资详情" });
  //pathNavData.value.push(row);
};

//************************************************************* */
// 新增数据
const addData = (rowData: any) => {
  rowData.id = -2;
  storageDataRow.value.pathEditNav = [...pathNavData.value];
  getPathEditData();
  mainBodyVisibleChange();
};

// 修改数据
const editData = (rowData: any) => {
  storageDataRow.value = { ...storageDataRow.value, ...rowData };
  mainBodyVisibleChange();
};

const recoverData = (rowData: any) => {
  recoverStorageData(rowData);
  //layer.msg("恢复操作");
  //console.log(rowData);
};

// 新增和修改数据确认代码addClassify
const mainBodyAction = ref([
  {
    text: "确认",
    callback: () => {
      if (storageDataRow.value.id !== undefined && storageDataRow.value.id > 0)
        editStorageData(storageDataRow.value);
      else addStorageData(storageDataRow.value);
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
    storageData.value.forEach((item2: any) => {
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
          delStorageData(rows);
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
const getStorageData = () => {
  storageAdmin.getStorageData({
    pathNavData: pathNavData.value,
    pageData: pageTable,
    fielter: tableFielter,
    callBack: (res: { data: any; total: number }) => {
      storageData.value = [...res.data];
      pageTable.total = res.total;
      //console.log(pathData.value);
    },
  });
};

//areaInfor.get({ recorderData: ..., callBack });
const addStorageData = (row: any) => {
  storageAdmin.addStorageData({
    recorderData: row,
    callBack: (msg: string) => {
      layer.msg(msg);
      getStorageData();
    },
  });
};

//areaInfor.get({ recorderData: ..., callBack });
const editStorageData = (row: any) => {
  storageAdmin.editStorageData({
    recorderData: row,
    callBack: (msg: string) => {
      layer.msg(msg);
      getStorageData();
    },
  });
};

//areaInfor.get({ recorderData: ..., callBack });1111
const recoverStorageData = (row: any) => {
  storageAdmin.recoverStorageData({
    recorderData: row,
    callBack: (msg: string) => {
      layer.msg(msg);
      getStorageData();
    },
  });
};

//areaInfor.get({ recordersData: ..., callBack });
const delStorageData = (Recorders: any) => {
  storageAdmin.delStorageData({
    recordersData: Recorders,
    callBack: (msg: string) => {
      layer.msg(msg, { area: "50%", time: 3000 });
      getStorageData();
    },
  });
};

//************************************************************* */assetsData
//============================================================================
//areaInfor.get({ pathListData: pageData, pageData: page, callBack });
const getClassify = () => {
  storageAdmin.getClassify({
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
  storageAdmin.getClassify({
    pathListData: storageDataRow.value.pathEditNav,
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
    title: "物品名称",
    width: "90px",
    key: "name",
  },
  {
    title: "物品编号",
    width: "80px",
    key: "codeNumber",
  },
  {
    title: "规格型号",
    width: "80px",
    key: "specification",
  },
  {
    title: "供应单位",
    width: "80px",
    key: "supplier",
  },
  {
    title: "联系方式",
    width: "80px",
    key: "supplierPhone",
  },
  {
    title: "产品单价",
    width: "80px",
    key: "unitPrice",
  },
  {
    title: "计价单位",
    width: "80px",
    key: "priceUnit",
  },
  {
    title: "库存数量",
    width: "80px",
    key: "stockNumber",
  },
  {
    title: "预警数量",
    width: "80px",
    key: "alertNumber",
  },
  {
    title: "数量单位",
    width: "80px",
    key: "numberUnit",
  },
  {
    title: "数量单位",
    width: "80px",
    key: "numberUnit",
  },
  {
    title: "保管人",
    width: "80px",
    key: "keeperName",
  },
  {
    title: "存放位置",
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

.layLayer:deep(.layui-form-label) {
  width: 100px;
}
.layLayer:deep(.layui-input-inline) {
  width: 140px;
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
/* ============================================================ */
</style>
