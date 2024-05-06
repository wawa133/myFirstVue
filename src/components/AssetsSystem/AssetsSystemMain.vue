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
          <lay-form-item label="单位类型" prop="list">
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
          <lay-form-item label="生产类型" prop="area">
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
          <lay-form-item label="起始时间" prop="time">
            <lay-date-picker
              v-model="tableFielter.time"
              simple
              type="date"
              :format="'YYYY年MM月DD日'"
              placeholder="点击选择日期"
            ></lay-date-picker>
          </lay-form-item>
          <lay-form-item label="严格模式" prop="matchStrict" mode="inline">
            <lay-switch v-model="tableFielter.matchStrict"></lay-switch>
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
    </lay-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, computed } from "vue";
import { nanoid } from "nanoid";
import assetsAdmin from "@/api/assetsAdmin";

const Props = defineProps(["addTab"]);
const pageTable = reactive({ current: 1, limit: 50, total: 100 });
const selectedKeys = ref([]);
const labelPosition3 = ref("left");
const tableFielter = reactive<tableFielterType>({});
interface tableFielterType {
  unitType?: string;
  produceType?: string;
  matchStrict?: boolean;
  time?: string;
}
// 定义区域导航选单数据变量【导航栏】
const pathData = ref<Array<pathDataType>>([]);
const pathNavData = ref<Array<pathDataType>>([{ id: -2, name: "物资分类", level: -2 }]);
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
interface pathDataType {
  id?: number;
  name?: string;
  level?: number;
  desc?: string;
}

onMounted(() => {
  // 初始化数据
  getClassify();
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

//================================================================
// 左侧树形结构导航点击事件
const NavClick = (sn: any) => {
  pathNavData.value = pathNavData.value.slice(0, sn + 1);
};

// 左侧树形结构菜单点击事件userStore.leaderAreaData
const areaNavDataClick = (item: any) => {
  pathNavData.value.push(item);
};

const tableChange = () => {
  getAssetsData();
};

const rowDouble = (row: any) => {
  Props.addTab({ row: row, action: "物资详情" + row.id });
};

//================================================================
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
/* ============================================================ */
</style>
