<template>
  <lay-panel class="leaderAreaSelect">
    <!-- 区域选择导航条 -->
    <div class="leaderItem">
      <lay-breadcrumb separator-icon="layui-icon-right">
        <lay-breadcrumb-item
          v-for:="(data, key) in userInfo.area"
          @click="areaNavClick(key)"
          :key="nanoid()"
        >
          {{ data.name }}
        </lay-breadcrumb-item>

        <lay-breadcrumb-item
          v-for:="(data, key) in userInfo.unit"
          @click="areaNavClick(key)"
          :key="nanoid()"
        >
          {{ data.name }}
        </lay-breadcrumb-item>
      </lay-breadcrumb>
    </div>
    <!-- 可选择导航子项图标 -->
    <div class="leaderContent">
      <lay-space size="md"> </lay-space>
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
          <lay-form-item label="显示名单" prop="list">
            <lay-select v-model="tableFielter.list">
              <lay-select-option value="0" label="不限制"></lay-select-option>
              <lay-select-option value="1" label="重点监控名单"></lay-select-option>
              <lay-select-option value="2" label="黑名单"></lay-select-option>
            </lay-select>
          </lay-form-item>
          <lay-form-item label="显示级别" prop="area">
            <lay-select v-model="tableFielter.area">
              <lay-select-option value="0" label="不限制"></lay-select-option>
              <lay-select-option value="1" label="省级"></lay-select-option>
              <lay-select-option value="2" label="市级"></lay-select-option>
              <lay-select-option value="3" label="区级"></lay-select-option>
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
    </lay-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { useUserStore } from "@/stores/index";
import { nanoid } from "nanoid";
import twoNameList from "@/api/twoNameList";

const Props = defineProps(["addTab", "refreshMain"]);
const userStore = useUserStore();

const userInfo = reactive({
  area: [] as { name: string; id: number }[],
  unit: [] as { name: string; id: number }[],
  info: {},
});

// 数据表页导航条变量
const pageTable = reactive({ current: 1, limit: 50, total: 100 });

const tableFielter = reactive<{ list?: number; area?: number; time?: string }>({});
const labelPosition3 = ref("left");

onMounted(() => {
  // 初始化数据
  userInfo.info = { ...userStore.userLoginInfo };
  userInfo.area = [...userStore.areaData];
  userInfo.area.shift();
  userInfo.unit = [...userStore.unitData];
  userInfo.unit.shift();
  loadData();
  Props.refreshMain({ loadData: loadData });
});

watch(
  tableFielter,
  () => {
    loadData();
  },
  { deep: true }
);

// 监听数据变化
// watch(
//   () => userStore.areaData,
//   (newVal, oldVal) => {
//     console.log(newVal);
//   },
//   { deep: true }
// );

const areaNavClick = (index: number) => {
  console.log(index);
};

//monitorInfor.getMonitorData
const loadData = () => {
  //console.log("index");
  twoNameList.get({
    areaData: userStore.areaData,
    pageData: pageTable,
    fielter: tableFielter,
    callBack: (params: any) => {
      //console.log(params);
      monitorData.value = [...params.data];
      pageTable.total = params.total;
    },
  });
};

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
  {
    id: 2,
    unitName: "",
    unitAddress: "泸州市江阳区泰安街道龙江村5社",
    corporationName: "张三",
    twoNameList: "重点监控名单",
    approvalUnit: "泸州市农业农村局",
    approvalDate: "2024年4月12日",
    illegalActivities: "违法使用禁用农药",
  },
]);

const selectedKeys = ref([]);

const tableChange = (row: any) => {
  console.log(row);
};

const rowDouble = (row: any) => {
  Props.addTab({
    title: "主体详情",
    action: "主体详情" + row.id,
    option: { row, loadData },
  });
};

const tableColumns = [
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
    title: "单位地址",
    width: "210px",
    key: "FullAddress",
  },
  {
    title: "法人姓名",
    width: "60px",
    key: "corporationName",
  },
  {
    title: "加入名单",
    width: "120px",
    key: "twoNameList",
  },
  {
    title: "批准单位",
    width: "120px",
    key: "approvalUnit",
  },
  {
    title: "批准日期",
    width: "120px",
    key: "approvalDate",
  },
  {
    title: "违法行为",
    width: "120px",
    key: "illegalActivities",
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

/* .leaderAreaSelect:hover .leaderContent,
.leaderUnitSelect:hover .leaderContent {
  height: auto;
  padding: 1rem 1rem;
} */

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
</style>
