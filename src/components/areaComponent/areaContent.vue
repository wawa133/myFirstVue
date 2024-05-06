<template>
  <div>
    <!-- 内空列表右面部分 -->
    <div class="RightContent">
      <!-- 表头导航 -->
      <div class="rightLeader">
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
        <div class="leaderContent">
          <lay-space size="md">
            <lay-tag
              v-for:="(data, key) in tableData"
              :key="nanoid()"
              @click="menuClick(data)"
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
        <lay-form-item label="区划代码" prop="areaID">
          <lay-input v-model="areaInfo.areaID" placeholder="新建区域区域代码"></lay-input>
        </lay-form-item>
        <lay-form-item label="区域名称" prop="name" required>
          <lay-input v-model="areaInfo.name" placeholder="新建区域名称"></lay-input>
        </lay-form-item>
        <lay-form-item label="描述" prop="desc">
          <lay-textarea placeholder="新建区域描述" v-model="areaInfo.desc"></lay-textarea>
        </lay-form-item>
      </lay-form>
    </div>
  </lay-layer>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, computed } from "vue";
import { layer } from "@layui/layer-vue";
import { nanoid } from "nanoid";
import { useUserStore } from "@/stores/index";
import areaInfor from "@/api/areaInfor";

const Props = defineProps(["addTab"]);
const userStore = useUserStore();
// 数据表页导航条变量
const pageTable = reactive({ current: 1, limit: 10, total: 100 });
// 数据表选中行变量
const selectedKeys = ref([]);
// 新建区域模态框娈量及函数部分
const areaFormVisible = ref(false);
// 数据条件过滤 条件字符串变量
const searchFilter = reactive({
  filterStr: "",
});

// 新建、修改模态框表单数据存储变量
const areaInfo = reactive({
  id: -2,
  areaID: null, //区域ID
  name: "测试区域-1",
  desc: "这是我建的区域",
});

// 定义网页表格数组变量【表格】
const tableData = ref<Array<tableDataType>>([]);
interface tableDataType {
  id: number;
  name: string;
  desc: string;
  lev: number;
}

// 初始加载
onMounted(() => {
  loadAreaDataSource();
});

// 区域导航数据监听
const leaderAreaState = computed(() => userStore.leaderAreaData);
watch(
  leaderAreaState,
  () => {
    pageTable.total = 1;
    loadAreaDataSource();
  },
  { deep: true }
);

//模态框表单提交函数
const areaFormAction = ref([
  {
    text: "确认",
    callback: () => {
      editRecorderData(areaInfo);
      formVisibleChange();
    },
  },
  {
    text: "取消",
    callback: () => {
      formVisibleChange();
    },
  },
]);

// 新建、修改模态框显示隐藏控制函数
const formVisibleChange = () => {
  areaFormVisible.value = !areaFormVisible.value;
};

// 区域树形结构导航点击事件
const NavClick = async (sn: any) => {
  userStore.leaderAreaData = userStore.leaderAreaData.slice(0, sn + 1);
};

// 区域树形结构菜单项点击事件
const menuClick = (item: any) => {
  userStore.leaderAreaData.push(item);
};

// 数据过滤输入框内容变化事件
const filterInputChange = function (e: string) {
  const el = typeof e == "string" ? e : "";
  layer.msg(`加载过滤数据【${el}】中...`);
};

// 数据表切换页面
const tablePageChange = () => {
  loadAreaDataSource();
};

// 数据表数据行双击事件
const rowDouble = (item: any) => {
  Props.addTab({ item, action: item.name });
};

// 新增记录
const addData = () => {
  areaInfo.id = -2;
  areaInfo.areaID = null;
  areaInfo.name = "";
  areaInfo.desc = "";
  formVisibleChange();
};

// 数据修改
const editData = (e: any) => {
  areaInfo.id = e.id;
  areaInfo.areaID = e.areaID;
  areaInfo.name = e.name;
  areaInfo.desc = e.desc;
  formVisibleChange();
};

//删除所有选中的数据
const delSelectRows = () => {
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

// 删除数据
const delRecorder = (row: any) => {
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

//areaInfor.get({ areaData: areaData, pageData: page });
// 从后台获取数据源【区域】
const loadAreaDataSource = () => {
  areaInfor.get({
    areaData: userStore.leaderAreaData,
    pageData: pageTable,
    callbackLoadArea,
  });
};
function callbackLoadArea(res: { data: any; total: number }) {
  tableData.value = res.data;
  pageTable.total = res.total;
}

// edit({areaData: areaData, recorderData: RecorderObj})
// 通过后台对数据进行修改
const editRecorderData = (RecorderObj: any) => {
  areaInfor.edit({
    areaData: userStore.leaderAreaData,
    recorderData: RecorderObj,
    callbackEditArea: (msg: string) => {
      tablePageChange();
      layer.msg(msg, { area: "50%", time: 1500 });
    },
  });
};

// del({recorderData: delRecorders,areaData: areaData})
// 通过后台对数据进行删除
const delRecorders = (delRecorders: any) => {
  areaInfor.del({
    recorderData: delRecorders,
    areaData: userStore.leaderAreaData,
    callbackDelArea: (msg: string) => {
      tablePageChange();
      layer.msg(msg, { area: "50%", time: 1500 });
    },
  });
};

const tableColumns = [
  { title: "选项", width: "55px", type: "checkbox", fixed: "left" },
  {
    title: "ID",
    width: "60px",
    key: "id",
  },
  {
    title: "区划代码",
    width: "120px",
    key: "areaID",
  },
  {
    title: "区域名称",
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
