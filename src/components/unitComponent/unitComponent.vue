<template>
  <div>
    <!-- 内空列表右面部分 -->
    <div class="RightContent">
      <!-- 表头导航 -->
      <div class="rightLeader">
        <div class="leaderItem">
          <lay-breadcrumb separator-icon="layui-icon-right">
            <lay-breadcrumb-item
              v-for:="(data, key) in userStore.leaderUnitData"
              @click="NavUnitClick(key)"
              :key="nanoid()"
            >
              {{ data.name }}
            </lay-breadcrumb-item>
          </lay-breadcrumb>
        </div>
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

      <!-- 数据过滤部分 -->
      <div class="filterContainer">
        <lay-form :model="searchFilter" :pane="true" onsubmit="return false;">
          <lay-form-item label="条件过滤" prop="filterStr">
            <lay-input
              v-model="searchFilter.filterStr"
              @change="filterInputChange"
              placeholder="条件过滤输入"
            ></lay-input>
          </lay-form-item>
        </lay-form>
      </div>
      <div class="ContentList">
        <lay-table
          max-height="1000px"
          :auto-col-width="true"
          :page="pageTable"
          :columns="tableColumns"
          :data-source="tableData"
          even
          v-model:selected-keys="selectedKeys"
          @change="tablePageChange"
          @row-double="rowDouble"
        >
          <template #status="{ row }">
            <lay-switch :model-value="row.status"></lay-switch>
          </template>
          <template v-slot:toolbar>
            <lay-button size="sm" type="primary" @click="addData">新增</lay-button>
            <lay-button size="sm" @click="delSelectRows">删除</lay-button>
          </template>
          <template v-slot:operator="{ row }">
            <lay-button size="xs" type="primary" @click="editData(row)">编辑</lay-button>
            <lay-button size="xs" type="primary" @click="delRecorder(row)"
              >删除</lay-button
            >
          </template>
        </lay-table>
      </div>
    </div>
  </div>
  <!-- 弹出模态框部分 -->
  <lay-layer
    v-model="areaFormVisible"
    :shade="false"
    :area="['500px', '330px']"
    :btn="areaFormAction"
  >
    <div style="padding: 20px">
      <lay-form :model="areaInfo" ref="areaFROMrEF">
        <lay-form-item label="单位名称" prop="name" required>
          <lay-input v-model="areaInfo.name"></lay-input>
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
import { useUserStore } from "../../stores";
import unitInfo from "@/api/unitInfo";
import areaInfor from "@/api/areaInfor";

const userStore = useUserStore();
const Props = defineProps(["addTab"]);
// 定义网页表格数据数组变量【表格】
let unitData = ref<Array<tableDataType>>([]);
const tableData = ref<Array<tableDataType>>([]);
interface tableDataType {
  id: number;
  areaId: number;
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
const pageTable = reactive({ current: 1, limit: 10, total: 100 });
const pageArea = reactive({ current: 1, limit: 10, total: 100 });
//条件过滤框 条件字符串
const searchFilter = reactive({
  filterStr: "",
});

const loading = ref(false);
const selectedKeys = ref([]);

// 新建区域模态框娈量及函数部分
const areaFormVisible = ref(false);

// 新增和修改数据的数据定义部分
const areaInfo = reactive({
  id: -2,
  areaId: -2,
  name: "测试区域-1",
  desc: "这是我建的区域",
});

onMounted(() => {
  // 这里的代码会在组件被挂载到DOM后执行
  loadAreaDataSource();
  loadUnitDataSource();
});

// 区域导航数据监听
const leaderUnitState = computed(() => userStore.leaderUnitData);
watch(
  leaderUnitState,
  () => {
    pageTable.total = 1;
    loadUnitDataSource();
  },
  { deep: true }
);

// 区域导航数据监听
const leaderAreaState = computed(() => userStore.leaderAreaData);
watch(
  leaderAreaState,
  () => {
    pageTable.total = 1;
    loadUnitDataSource();
  },
  { deep: true }
);

// 新增和修改数据确认代码
const areaFormAction = ref([
  {
    text: "确认",
    callback: () => {
      //layer.confirm("确认操作", { shade: false });
      editRecorderData(areaInfo);
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
    tableData.value.forEach((item2: any) => {
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
const NavUnitClick = (sn: any) => {
  userStore.leaderUnitData = userStore.leaderUnitData.slice(0, sn + 1);
};

// 数据过滤输入框内容变化事件
const filterInputChange = function (e: string) {
  const el = typeof e == "string" ? e : "";
  layer.msg(`加载过滤数据【${el}】中...`);
};

// 左侧树形结构菜单点击事件
const unitDataClick = (item: any) => {
  userStore.leaderUnitData.push(item);
  loadUnitDataSource();
};

// 数据表数据行双击事件
const rowDouble = (item: any) => {
  Props.addTab({ item, action: item.name });
};

// 新增记录
const addData = () => {
  areaInfo.name = "";
  areaInfo.desc = "";
  areaInfo.id = -2;
  areaInfo.areaId = -2;
  areaVisibleChange();
  //layer.msg("新增", { area: "50%" });
};

// 数据修改
const editData = (e: any) => {
  //console.log(e);
  areaInfo.name = e.name;
  areaInfo.desc = e.desc;
  areaInfo.id = e.id;
  areaInfo.areaId = e.areaId;
  areaVisibleChange();
  //layer.msg(`编辑${e.id}`, { area: "50%" });
};

// 删除数据
const delRecorder = (row: any) => {
  //console.log(e);
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
const tablePageChange = () => {
  loading.value = true;
  loadUnitDataSource();
};

// 数据表工选项设置
const tableColumns = [
  { title: "选项", width: "55px", type: "checkbox", fixed: "left" },
  {
    title: "ID",
    width: "60px",
    key: "id",
  },
  {
    title: "单位 | 科站名称",
    key: "name",
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

// 获取区域数据
// params: {areaData,unitData,RecorderArrData,callBack: () => (msg:string),
const delRecorders = (RecorderArr: any) => {
  unitInfo.del({
    areaData: userStore.leaderAreaData,
    unitData: userStore.leaderUnitData,
    RecorderArrData: RecorderArr,
    callBack: (msg: string) => {
      loadUnitDataSource();
      pageTable.total = 0;
      layer.msg(msg, { area: "50%", time: 1500 });
    },
  });
};

// 修改新增区域数据
// params: {areaData,unitData,recorderData,callBack: () => (msg:string),
const editRecorderData = (RecorderObj: any) => {
  unitInfo.edit({
    areaData: userStore.leaderAreaData,
    unitData: userStore.leaderUnitData,
    recorderData: RecorderObj,
    callBack: (msg: string) => {
      loadUnitDataSource();
      layer.msg(msg, { area: "50%", time: 1500 });
    },
  });
};

//{data: resData, total: resPage}
// 从后台获取单位相关数据源【单位】
const loadUnitDataSource = () => {
  unitInfo.get({
    areaData: userStore.leaderAreaData,
    unitData: userStore.leaderUnitData,
    pageData: pageTable,
    callBack: (params: any) => {
      unitData.value = [...params.data];
      tableData.value = [...params.data];
      pageTable.total = params.total;
    },
  });
};

//areaInfor.get({ areaData: areaData, pageData: page });
// 从后台获取数据源【区域】
const loadAreaDataSource = () => {
  areaInfor.get({
    areaData: userStore.leaderAreaData,
    pageData: pageTable,
    callbackLoadArea: (res: { data: any; total: number }) => {
      areaData.value = res.data;
      pageArea.total = res.total;
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
