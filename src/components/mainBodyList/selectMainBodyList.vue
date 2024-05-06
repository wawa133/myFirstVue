<template>
  <!-- 表头导航 -->
  <lay-panel class="leaderAreaSelect">
    <div class="rightLeader">
      <!-- 面包屑导航条 -->
      <div class="leaderItem">
        <lay-breadcrumb separator-icon="layui-icon-right">
          <lay-breadcrumb-item
            v-for:="(data, key) in userStore.leaderAreaData"
            @click="key > userStore.areaData.length - 2 ? NavClick(key) : null"
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
            v-for:="(data, key) in areaNavData"
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
      :data-source="monitorData"
      even
      v-model:selected-keys="selectedKeys"
      @change="tableChange"
      @row-double="rowDouble"
    >
      <template #status="{ row }">
        <lay-switch :model-value="row.status"></lay-switch>
      </template>
      <template v-slot:operator="{ row }">
        <lay-button size="xs" type="primary" @click="setMainBody(row)"
          >选择主体</lay-button
        >
      </template>
    </lay-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, computed } from "vue";
import { useUserStore } from "@/stores/index";
import { nanoid } from "nanoid";
import areaInfor from "@/api/areaInfor";
import mainBodyList from "@/api/mainBodyList";

const Props = defineProps(["setMainBody"]);
const userStore = useUserStore();

// 数据表页导航条变量
const pageTable = reactive({ current: 1, limit: 50, total: 100 });
const pageArea = reactive({ current: 1, limit: 50, total: 100 });
const pageNavArea = reactive({ current: 1, limit: 50, total: 100 });
const selectedKeys = ref([]);
const labelPosition3 = ref("left");

const tableFielter = reactive<{
  unitType?: string;
  produceType?: string;
  matchStrict?: boolean;
}>({});

// 弹出模态框部分区域导航及选项
const areaNavData = ref<Array<areaDataType>>([]);
const areaData = ref<Array<areaDataType>>([]);
interface areaDataType {
  id?: number;
  name?: string;
  desc?: string;
  lev?: number;
}

const mainBodyRow = ref({
  id: 0,
  unitName: "",
  unitAddress: "",
  unitAreaAddress: "",
  unitArea: [] as areaDataType[],
  corporationName: "",
  corporationPhone: "",
  contact: "",
  contactPhone: "",
  unitType: "",
  produceType: "",
  desc: "",
});

const monitorData = ref([
  {
    id: 1,
    unitName: "泸州市董允坝农业发展有限公司",
    unitAddress: "泸州市江阳区分水岭镇董允坝园区",
    corporationName: "王黔",
    twoNameList: "重点监控名单",
    approvalUnit: "四川省农业农村厅",
    approvalDate: "2024年4月12日",
    illegalActivities: "...",
  },
]);

onMounted(() => {
  // 初始化数据
  userStore.leaderAreaData = [...userStore.areaData];
  mainBodyRow.value.unitArea = [...userStore.areaData];
  getList();
  loadAreaDataSource();
  loadNavAreaDataSource();
});

watch(
  tableFielter,
  () => {
    getList();
  },
  { deep: true }
);

const userAreaState = computed(() => mainBodyRow.value.unitArea);
watch(
  userAreaState,
  () => {
    loadAreaDataSource();
    mainBodyRow.value.unitAreaAddress = "";
  },
  { deep: true }
);

const leaderAreaDataState = computed(() => userStore.leaderAreaData);
watch(
  leaderAreaDataState,
  () => {
    loadNavAreaDataSource();
    getList();
  },
  { deep: true }
);

// 左侧树形结构菜单点击事件
const areaNavDataClick = (item: any) => {
  userStore.leaderAreaData.push(item);
};

const NavClick = (sn: any) => {
  userStore.leaderAreaData = userStore.leaderAreaData.slice(0, sn + 1);
};

const tableChange = () => {
  getList();
};

//************************************************************* */
// 选择数据
const rowDouble = (row: any) => {
  Props.setMainBody(row);
};

// 选择数据
const setMainBody = (row: any) => {
  Props.setMainBody(row);
};
//---------------------------------------------------------------

//************************************************************* */
//areaInfor.get({ areaData: areaData, pageData: page });
const loadNavAreaDataSource = () => {
  areaInfor.get({
    areaData: userStore.leaderAreaData,
    pageData: pageNavArea,
    callbackLoadArea: (res: { data: any; total: number }) => {
      areaNavData.value = res.data;
      pageNavArea.total = res.total;
    },
  });
};

//areaInfor.get({ areaData: areaData, pageData: page });
const loadAreaDataSource = () => {
  areaInfor.get({
    areaData: mainBodyRow.value.unitArea,
    pageData: pageArea,
    callbackLoadArea: (res: { data: any; total: number }) => {
      areaData.value = res.data;
      pageArea.total = res.total;
    },
  });
};

const getList = () => {
  mainBodyList.get({
    areaData: userStore.leaderAreaData,
    pageData: pageTable,
    fielter: tableFielter,
    callBack: (params: any) => {
      monitorData.value = [...params.data];
      pageTable.total = params.total;
    },
  });
};

const tableColumns = [
  // { title: "选项", width: "35px", type: "checkbox", fixed: "left" },
  {
    title: "序号",
    width: "33px",
    key: "id",
    // key: "sampleId",
  },
  {
    title: "单位名称",
    width: "160px",
    key: "unitName",
  },
  {
    title: "单位法人",
    width: "80px",
    key: "corporationName",
  },
  {
    title: "法人电话",
    width: "110px",
    key: "corporationPhone",
  },
  {
    title: "联系人",
    width: "80px",
    key: "contact",
  },
  {
    title: "联系电话",
    width: "110px",
    key: "contactPhone",
  },
  {
    title: "单位地址",
    width: "240px",
    key: "FullAddress",
  },
  {
    title: "单位类型",
    width: "80px",
    key: "unitType",
  },
  {
    title: "生产类型",
    width: "80px",
    key: "produceType",
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
