<template>
  <div>
    <!-- 表头导航 -->
    <div class="rightLeader">
      <!-- 面包屑导航条 -->
      <div class="leaderItem">
        <lay-breadcrumb separator-icon="layui-icon-right">
          <lay-breadcrumb-item
            v-for:="(data, key) in userStore.leaderAreaData"
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
        :page="pageMonitor"
        :columns="columns8"
        :data-source="monitorData"
        even
        v-model:selected-keys="selectedKeys"
        @change="change"
        @row-double="rowDouble"
      >
        <template #status="{ row }">
          <lay-switch :model-value="row.status"></lay-switch>
        </template>
        <template v-slot:toolbar>
          <lay-button size="sm" type="primary" @click="addData(areaInfo)"
            >新增</lay-button
          >
          <lay-button size="sm" @click="delSelectRows">删除</lay-button>
        </template>
        <template v-slot:operator="{ row }">
          <lay-button size="xs" type="primary" @click="editData(row)">编辑</lay-button>
          <lay-button size="xs" type="primary" @click="removeData(row)">删除</lay-button>
        </template>
      </lay-table>
    </div>
  </div>

  <!-- 弹出模态框部分 'auto' 't' 'l' 'b' 'r' 'rb' ['100px','50px'] '100px' 'auto'-->
  <lay-layer
    v-model="areaFormVisible"
    :shade="false"
    :area="['560px', '940px']"
    :btn="areaFormAction"
    :offset="'rb'"
  >
    <div style="padding: 20px">
      <lay-form :model="areaInfo" ref="areaFROMrEF" labelWidth="150px">
        <lay-form-item label="样品编号" prop="sampleId" required>
          <lay-input v-model="areaInfo.sampleId"></lay-input>
        </lay-form-item>
        <lay-form-item label="样品名称" prop="sampleName" required>
          <lay-input v-model="areaInfo.sampleName"></lay-input>
        </lay-form-item>
        <lay-form-item label="抽样数量" prop="sampleNum" required>
          <lay-input v-model="areaInfo.sampleNum"></lay-input>
        </lay-form-item>
        <lay-form-item label="抽样基数" prop="sampleBaseNum" required>
          <lay-input v-model="areaInfo.sampleBaseNum"></lay-input>
        </lay-form-item>
        <lay-form-item label="样品状态" prop="sampleName" required>
          <lay-select v-model="areaInfo.sampleState" placeholder="请选择">
            <lay-select-option :value="1" label="鲜样"></lay-select-option>
            <lay-select-option :value="2" label="干样"></lay-select-option>
          </lay-select>
        </lay-form-item>
        <lay-form-item label="样品种类" prop="sampleKindId" required>
          <lay-select v-model="areaInfo.sampleKindId" placeholder="请选择">
            <lay-select-option :value="1" label="蔬菜"></lay-select-option>
            <lay-select-option :value="2" label="水果"></lay-select-option>
            <lay-select-option :value="3" label="食用菌"></lay-select-option>
            <lay-select-option :value="4" label="禽肉"></lay-select-option>
            <lay-select-option :value="5" label="禽蛋"></lay-select-option>
            <lay-select-option :value="6" label="猪肉"></lay-select-option>
            <lay-select-option :value="7" label="牛肉"></lay-select-option>
            <lay-select-option :value="8" label="羊肉"></lay-select-option>
            <lay-select-option :value="9" label="稻谷"></lay-select-option>
            <lay-select-option :value="10" label="高粱"></lay-select-option>
            <lay-select-option :value="11" label="其它"></lay-select-option>
          </lay-select>
        </lay-form-item>
        <lay-form-item label="抽样类型" prop="taskRiskSupervision" required>
          <lay-select v-model="areaInfo.taskRiskSupervision" placeholder="请选择">
            <lay-select-option :value="1" label="风险"></lay-select-option>
            <lay-select-option :value="2" label="监督"></lay-select-option>
          </lay-select>
        </lay-form-item>
        <lay-form-item label="任务来源" prop="taskAdminArea" required>
          <lay-select v-model="areaInfo.taskAdminArea" placeholder="请选择">
            <lay-select-option :value="1" label="部级"></lay-select-option>
            <lay-select-option :value="2" label="省级"></lay-select-option>
            <lay-select-option :value="3" label="市级"></lay-select-option>
            <lay-select-option :value="4" label="区级"></lay-select-option>
          </lay-select>
        </lay-form-item>
        <lay-form-item label="被检单位" prop="sampledUnit" required>
          <span>被抽样单位选择</span>
          <lay-input v-model="areaInfo.sampledUnit"></lay-input>
        </lay-form-item>
        <lay-form-item label="抽样地址" prop="address">
          <span v-for:="(data, key) in userStore.leaderAreaData" :key="nanoid()"
            >{{ data.name }}>
          </span>
          <lay-input v-model="areaInfo.address"></lay-input>
        </lay-form-item>
        <lay-form-item label="抽样人" prop="sampleCollector">
          <lay-input v-model="areaInfo.sampleCollector"></lay-input>
        </lay-form-item>
        <lay-form-item label="描述" prop="desc">
          <lay-textarea placeholder="请输入描述" v-model="areaInfo.desc"></lay-textarea>
        </lay-form-item>
      </lay-form>
    </div>
  </lay-layer>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, computed } from "vue";
import { layer } from "@layui/layer-vue";
import { nanoid } from "nanoid";
import { useUserStore } from "@/stores/";
import areaInfor from "@/api/areaInfor";
import monitorInfor from "@/api/monitoring";

const userStore = useUserStore();
const Props = defineProps(["addTab"]);

// 定义网页表格数据数组变量【表格】
const monitorData = ref<Array<tableDataType>>([]);
interface tableDataType {
  id: number;
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
const pageArea = reactive({ current: 1, limit: 50, total: 100 });
const pageMonitor = reactive({ current: 1, limit: 50, total: 100 });

//条件过滤框 条件字符串
const searchFilter = reactive({
  filterStr: "",
});

const selectedKeys = ref([]);

// 新建区域模态框娈量及函数部分
const areaFormVisible = ref(false);

// 新增和修改数据的数据定义部分
const areaInfo: areaInfoType = reactive({
  id: -2,
  sampleNum: 3,
  sampleKindId: 1,
  sampleState: 1,
  taskRiskSupervision: 1,
  taskAdminArea: 4,
  desc: "这是我建的区域",
});

interface areaInfoType {
  id: number | null;
  sampleId?: number;
  sampleName?: string | null;
  sampleNum?: number | null;
  sampleBaseNum?: number | null;
  sampleState?: number | null;
  sampleKindId?: number | null;
  taskRiskSupervision?: number | null;
  taskAdminArea?: number | null;
  sampledUnit?: string | null;
  address?: string | null;
  sampleCollector?: string | null;
  desc?: string | undefined;
  collectUnitId?: number | null;
  collectUnitName?: string | null;
}

onMounted(() => {
  // 这里的代码会在组件被挂载到DOM后执行
  userStore.leaderAreaData = [...userStore.areaData];
  userStore.leaderUnitData = [...userStore.unitData];
  loadAreaDataSource(1);
  loadMonitorDataSource();
});

const leaderAreaState = computed(() => userStore.leaderAreaData);
watch(
  leaderAreaState,
  () => {
    loadAreaDataSource(1);
    loadMonitorDataSource();
  },
  { deep: true }
);

// 新增和修改数据确认代码
const areaFormAction = ref([
  {
    text: "确认",
    callback: () => {
      if (areaInfo.id !== null) {
        areaInfo.id > 0 ? editRecorderData(areaInfo) : addRecorderData(areaInfo);
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

// 左侧导航显隐控制切换函数
const areaVisibleChange = () => {
  areaFormVisible.value = !areaFormVisible.value;
};

//删除所有选中的数据
const delSelectRows = () => {
  //layer.msg(selectedKeys.value, { area: "50%" });
  let selectedKeysArr: any = [];
  selectedKeys.value.forEach((item: any) => {
    monitorData.value.forEach((item2: any) => {
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

// 左侧树形结构导航点击事件
const NavClick = (sn: any) => {
  userStore.leaderAreaData = userStore.leaderAreaData.slice(0, sn + 1);
};

// 左侧树形结构菜单点击事件
const areaDataClick = (item: any) => {
  userStore.leaderAreaData.push(item);
};

// 数据表数据行双击事件
const rowDouble = (item: any) => {
  layer.msg(item, { area: "50%" });
};

// 新增记录userStore.areaData
const addData = (e: any) => {
  areaInfo.id = -2;
  areaInfo.sampleId = e.sampleId;
  areaInfo.sampleName = null;
  areaInfo.sampleNum = e.sampleNum ? e.sampleNum : 3;
  areaInfo.sampleBaseNum = e.sampleBaseNum;
  areaInfo.sampleState = e.sampleState ? e.sampleState : 1;
  areaInfo.sampleKindId = e.sampleKindId ? e.sampleKindId : 1;
  areaInfo.taskRiskSupervision = e.taskRiskSupervision ? e.taskRiskSupervision : 1;
  areaInfo.taskAdminArea = e.taskAdminArea ? e.taskAdminArea : 4;
  areaInfo.taskAdminArea = e.taskAdminArea ? e.taskAdminArea : 4;
  areaInfo.sampledUnit = e.sampledUnit ? e.sampledUnit : null;
  areaInfo.address = e.address ? e.address : null;
  areaInfo.sampleCollector = e.sampleCollector ? e.sampleCollector : null;
  areaInfo.desc = e.desc;
  areaInfo.collectUnitId = userStore.unitData[1].id;
  areaInfo.collectUnitName = userStore.unitData[1].name;
  areaVisibleChange();
};

// 数据修改
const editData = (e: any) => {
  //console.log(e);
  areaInfo.id = e.id;
  areaInfo.sampleId = e.sampleId;
  areaInfo.sampleName = e.sampleName;
  areaInfo.sampleNum = e.sampleNum ? e.sampleNum : 3;
  areaInfo.sampleBaseNum = e.sampleBaseNum;
  areaInfo.sampleState = e.sampleState ? e.sampleState : 1;
  areaInfo.sampleKindId = e.sampleKindId ? e.sampleKindId : 1;
  areaInfo.taskRiskSupervision = e.taskRiskSupervision ? e.taskRiskSupervision : 1;
  areaInfo.taskAdminArea = e.taskAdminArea ? e.taskAdminArea : 4;
  areaInfo.sampledUnit = e.sampledUnit;
  areaInfo.address = e.address;
  areaInfo.sampleCollector = e.sampleCollector;
  areaInfo.desc = e.desc;
  areaInfo.collectUnitId = userStore.unitData[1].id;
  areaInfo.collectUnitName = userStore.unitData[1].name;
  areaVisibleChange();
};

// 删除数据
const removeData = (row: any) => {
  //console.log(row);
  //layer.msg(`删除${row}`, { area: "50%" });
  delRecorderConfirm(row);
};
const delRecorderConfirm = (row: any) => {
  layer.confirm("是否确认删除--确认将删除该项及其下所有子域数据", {
    btn: [
      {
        text: "确认删除",
        callback: (id: any) => {
          //delRecorders([row]);
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
const change = () => {
  loadMonitorDataSource();
};

//条件过滤筛选执行函数
const submitFilterStr = function (e: string) {
  const el = typeof e == "string" ? e : "";
  layer.msg(`加载过滤数据【${el}】中...`);
};

// 从后台获取数据源【区域】
const delRecorders = (RecordersData: any) => {
  monitorInfor.delMonitorData({
    areaData: userStore.leaderAreaData,
    recordersData: RecordersData,
    callBack: (msg: string) => {
      layer.msg(msg, { area: "50%", time: 3000 });
      loadMonitorDataSource();
    },
  });
};

/*
// 从后台获取数据源【区域】
const delRecorders = (RecorderObj: any) => {
  // 数据处理及初始化
  let recorderId: any = [];
  let recorderSampleId: any = [];
  RecorderObj.forEach((item: any) => {
    recorderId.push(item.id);
    recorderSampleId.push(item.sampleId);
  });

  //console.log(recorderSampleId);

  let arrayAreaId: any = [];
  let arrayAreaName: any = [];
  areaNavData.forEach((item: any) => {
    arrayAreaId.push(item.id);
    arrayAreaName.push(item.name);
  });

  // axios 与服务器端数据交互 及 返回数据处理
  axios({
    method: "post",
    url: "http://localhost:3007/my/monitoring/getinfo",
    //当需要跨域传送 JWT-TOKEN-cookies 令牌时，需要这个参数，并在服务器端设置对应的头部信息
    headers: { Authorization: localStorage.getItem("token") || "" },
    //浏览器告知服务器，我需要设置cookie，包括session-cookie\JWT-token-cookie等
    withCredentials: true,
    data: {
      //传送服务器 自定义数据部分
      methord: "del",
      ids: recorderId,
      sampleIds: recorderSampleId,
      area: {
        ids: arrayAreaId,
        names: arrayAreaName,
      },
    },
  })
    .then((res) => {
      // 成功 服务器返回数据处理
      //console.log(res.data);
      //console.log(res.data.data.affectedRows);
      // if (!res.data.data.affectedRows) {
      //   layer.msg(`删除数据失败` + res.data.msg, { area: "50%", time: 3000 });
      //   return;
      // }

      //console.log(res.data);
      if (!res.data.data || !res.data.data.affectedRows) {
        layer.msg(`程序发生错误` + res.data.msg, { area: "50%", time: 3000 });
        return;
      }

      layer.msg(`删除数据${res.data.msg}，共删除${res.data.data.affectedRows}条`, {
        area: "50%",
        time: 3000,
      });
      //loadTableDataSource();
    })
    .catch((err) => {
      console.log(err);
    });
};
*/

// 从后台获取数据源【区域】
const addRecorderData = (RecorderObj: any) => {
  monitorInfor.addMonitorData({
    areaData: userStore.leaderAreaData,
    recorderData: RecorderObj,
    callBack: (msg: string) => {
      layer.msg(msg, { area: "50%", time: 3000 });
      loadMonitorDataSource();
      areaInfo.sampleId = (areaInfo.sampleId as number) * 1 + 1;
    },
  });
};

// 从后台获取数据源【区域】
const editRecorderData = (RecorderObj: any) => {
  monitorInfor.editMonitorData({
    areaData: userStore.leaderAreaData,
    recorderData: RecorderObj,
    callBack: (msg: string) => {
      layer.msg(msg, { area: "50%", time: 3000 });
      loadMonitorDataSource();
    },
  });
};

//monitorInfor.getMonitorData
const loadMonitorDataSource = () => {
  monitorInfor.getMonitorData({
    areaData: userStore.leaderAreaData,
    pageData: pageMonitor,
    callBack: (params: any) => {
      //console.log(params);
      monitorData.value = [...params.data];
      pageMonitor.total = params.total;
    },
  });
};

//{data: resData, total: resPage}
// 从后台获取单位相关数据源【单位】
// const loadUnitDataSource = () => {
//   unitInfo.get({
//     areaData: userStore.leaderAreaData,
//     unitData: userStore.leaderUnitData,
//     pageData: pageUnit,
//     callBack: (params: any) => {
//       unitData.value = [...params.data];
//       pageUnit.total = params.total;
//     },
//   });
// };

// areaInfor.get({ areaData: areaData, pageData: page });
// 从后台获取数据源【区域】
const loadAreaDataSource = (pageNum: number) => {
  pageArea.current = pageNum;
  areaInfor.get({
    areaData: userStore.leaderAreaData,
    pageData: pageArea,
    callbackLoadArea: (res: { data: any; total: number }) => {
      areaData.value = res.data;
      pageArea.total = res.total;
    },
  });
};

const columns8 = [
  { title: "选项", width: "35px", type: "checkbox", fixed: "left" },
  // {
  //   title: "id",
  //   width: "60px",
  //   key: "id",
  // },
  {
    title: "样品编号",
    width: "53px",
    key: "sampleId",
  },
  {
    title: "样品名称",
    width: "60px",
    key: "sampleName",
  },
  {
    title: "数据录入",
    width: "80px",
    key: "collectUnitName",
  },
  {
    title: "被抽检单位",
    width: "60px",
    key: "sampledUnit",
  },
  {
    title: "抽样地址",
    width: "120px",
    key: "fullAddress",
  },
  {
    title: "抽样人",
    width: "60px",
    key: "sampleCollector",
  },
  {
    title: "操作",
    width: "105px",
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
