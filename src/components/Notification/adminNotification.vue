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
              :format="'YYYY/MM/DD'"
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
      <template v-slot:toolbar>
        <lay-button size="sm" type="primary" @click="addData(twoNameRow)"
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

  <!-- 弹出模态框部分 'auto' 't' 'l' 'b' 'r' 'rb' ['100px','50px'] '100px' 'auto'-->
  <lay-layer
    v-model="twoNameFormT"
    :shade="false"
    :area="['560px', '720px']"
    :btn="twoNameAction"
    :offset="'rb'"
  >
    <div style="padding: 20px">
      <lay-form :model="twoNameRow" ref="twoNameFromRef" labelWidth="150px">
        <lay-form-item label="单位名称" prop="unitName" required>
          <lay-input v-model="twoNameRow.unitName">
            <template #append>
              <!-- <lay-button>选择主体</lay-button> -->
              <lay-icon type="layui-icon-set-fill" @click="openComponent"></lay-icon>
            </template>
          </lay-input>
        </lay-form-item>
        <lay-form-item label="单位区域" prop="unitArea" required>
          <lay-breadcrumb separator-icon="layui-icon-right">
            <lay-breadcrumb-item
              v-for:="(data, key) in twoNameRow.unitArea"
              @click="key > userStore.areaData.length - 2 ? areaNavClick(key) : null"
              :key="nanoid()"
            >
              {{ data.name }}
            </lay-breadcrumb-item>
          </lay-breadcrumb>
          <lay-select
            v-model="twoNameRow.unitAreaAddress"
            @change="areaDataClick($event)"
            placeholder="选择修改区域"
          >
            <lay-select-option
              v-for="(data, key) in areaData"
              :key="nanoid() + key"
              :value="data.name + ''"
              :label="data.name"
            ></lay-select-option>
          </lay-select>
        </lay-form-item>
        <lay-form-item label="单位地址" prop="unitAddress" required>
          <lay-input v-model="twoNameRow.unitAddress"></lay-input>
        </lay-form-item>
        <lay-form-item label="单位法人" prop="corporationName" required>
          <lay-input v-model="twoNameRow.corporationName"></lay-input>
        </lay-form-item>
        <lay-form-item label="加入名单" prop="twoNameList" required>
          <lay-select v-model="twoNameRow.twoNameList" placeholder="请选择">
            <lay-select-option
              :value="'重点监控名单'"
              label="重点监控名单"
            ></lay-select-option>
            <lay-select-option :value="'黑名单'" label="黑名单"></lay-select-option>
          </lay-select>
        </lay-form-item>
        <lay-form-item label="批准单位" prop="approvalUnit" required>
          <lay-input v-model="twoNameRow.approvalUnit"></lay-input>
        </lay-form-item>
        <lay-form-item label="批准日期" prop="approvalDate" required>
          <lay-date-picker
            v-model="twoNameRow.approvalDate"
            simple
            type="date"
            :format="'YYYY/MM/DD'"
            placeholder="点击选择日期"
          ></lay-date-picker>
          <!-- <lay-input v-model="twoNameRow.approvalDate"></lay-input> -->
        </lay-form-item>
        <lay-form-item label="违法行为" prop="illegalActivities" required>
          <lay-input v-model="twoNameRow.illegalActivities"></lay-input>
        </lay-form-item>
        <lay-form-item label="描述" prop="desc">
          <lay-textarea placeholder="请输入描述" v-model="twoNameRow.desc"></lay-textarea>
        </lay-form-item>
      </lay-form>
    </div>
  </lay-layer>
  <!-- 父组件的模板 -->
  <lay-layer v-model="mainBodyFormT" :shade="true" :area="['650px', '1020px']">
    <div>
      <SelectMainBodyList :setMainBody="setMainBody"></SelectMainBodyList>
      <!-- 其他内容 -->
    </div>
  </lay-layer>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, computed } from "vue";
import { layer } from "@layui/layer-vue";
import { useUserStore } from "@/stores/index";
import { nanoid } from "nanoid";

import areaInfor from "@/api/areaInfor";
import twoNameList from "@/api/twoNameList";
import SelectMainBodyList from "@/components/mainBodyList/selectMainBodyList.vue";

const Props = defineProps(["addTab", "option"]);
const userStore = useUserStore();
// 数据表页导航条变量
const pageTable = reactive({ current: 1, limit: 50, total: 100 });
const pageArea = reactive({ current: 1, limit: 50, total: 100 });

const tableFielter = reactive<{ list?: number; area?: number; time?: string }>({});
const labelPosition3 = ref("left");

const twoNameFormT = ref(false);
const mainBodyFormT = ref(false);
const twoNameFromRef = ref();

const selectedKeys = ref([]);

const userInfo = reactive({
  area: [] as { name: string; id: number }[],
  unit: [] as { name: string; id: number }[],
  info: {},
});

const twoNameRow = ref({
  id: -2,
  unitID: "",
  unitName: "",
  unitAddress: "",
  unitAreaAddress: "",
  unitArea: [] as areaDataType[],
  corporationName: "",
  twoNameList: "",
  approvalUnit: "",
  approvalDate: "",
  illegalActivities: "",
  desc: "",
});

const areaData = ref<Array<areaDataType>>([]);
interface areaDataType {
  id?: number;
  name?: string;
  desc?: string;
  lev?: number;
}

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
  userInfo.info = { ...userStore.userLoginInfo };
  userInfo.area = [...userStore.areaData];
  userInfo.area.shift();
  userInfo.unit = [...userStore.unitData];
  userInfo.unit.shift();
  twoNameRow.value.unitArea = [...userStore.areaData];
  loadData();
});

// const filrerState = computed(() => tableFielter);
watch(
  tableFielter,
  () => {
    loadData();
  },
  { deep: true }
);

const userAreaState = computed(() => twoNameRow.value.unitArea);
watch(
  userAreaState,
  () => {
    loadAreaDataSource();
    twoNameRow.value.unitAreaAddress = "";
  },
  { deep: true }
);

const openComponent = () => {
  mainBodyFormT.value = !mainBodyFormT.value;
};

const setMainBody = (row: any) => {
  //console.log(row);
  twoNameRow.value.unitID = row.id;
  twoNameRow.value.unitName = row.unitName;
  twoNameRow.value.unitAddress = row.unitAddress;
  twoNameRow.value.corporationName = row.corporationName;
  twoNameRow.value.unitArea = JSON.parse(row.unitAreaAddress);
};

const areaDataClick = (e: any) => {
  console.log(e);
  let item = areaData.value.find((item) => item.name === e);
  if (item !== undefined) {
    twoNameRow.value.unitArea.push(item);
  }
};

// 监听数据变化
// watch(
//   () => userStore.areaData,
//   (newVal, oldVal) => {
//     console.log(newVal);
//   },
//   { deep: true }
// );

const areaNavClick = (index: number) => {
  twoNameRow.value.unitArea = twoNameRow.value.unitArea.slice(0, index + 1);
};

const tableChange = (row: any) => {
  console.log(row);
};

const rowDouble = (row: any) => {
  //console.log(row);
  Props.addTab({ title: "主体详情", action: "主体详情" + row.id, row });
};

// ==============================================================
// 新增和修改数据确认代码
const twoNameAction = ref([
  {
    text: "确认",
    callback: () => {
      if (twoNameRow.value.id > 0) editTwoList(twoNameRow.value);
      else addTwoList(twoNameRow.value);
      twoNameVisibleChange();
    },
  },
  {
    text: "取消",
    callback: () => {
      twoNameVisibleChange();
    },
  },
]);

const addTwoList = (row: any) => {
  twoNameList.add({
    areaData: userStore.areaData,
    recorderData: row,
    callBack: (msg: string) => {
      layer.msg(msg);
      loadData();
    },
  });
};

const editTwoList = (row: any) => {
  twoNameList.edit({
    areaData: userStore.areaData,
    recorderData: row,
    callBack: (msg: string) => {
      layer.msg(msg);
      loadData();
    },
  });
};

const twoNameVisibleChange = () => {
  twoNameFormT.value = !twoNameFormT.value;
};

const addData = (row: any) => {
  // 打开模态框
  row.id = -2;
  twoNameFormT.value = true;
};

const editData = (row: any) => {
  // 打开模态框
  twoNameRow.value = { ...twoNameRow.value, ...row };
  if (
    twoNameRow.value.unitAreaAddress !== null &&
    twoNameRow.value.unitAreaAddress !== undefined
  ) {
    twoNameRow.value.unitArea = JSON.parse(twoNameRow.value.unitAreaAddress);
  }
  twoNameFormT.value = true;
};
//----------------------------------------------------------

// ==============================================================
// 删除数据确认代码
const delRowsConfirm = (rows: any) => {
  layer.confirm("确认删除，数据不可恢复！！", {
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

const removeData = (row: any) => {
  row.unitArea = JSON.parse(row.unitAreaAddress);
  delRowsConfirm([row]);
};

const delSelectRows = () => {
  let selectedItemArr: any = [];
  selectedKeys.value.forEach((item: any) => {
    monitorData.value.forEach((item2: any) => {
      if (item == item2.id) {
        item2.unitArea = JSON.parse(item2.unitAreaAddress);
        selectedItemArr.push(item2);
      }
    });
  });

  if (selectedItemArr.length == 0) {
    layer.msg("请选择要删除的数据", { area: "50%" });
    return;
  }
  delRowsConfirm(selectedItemArr);
};

// 从后台获取数据源【区域】
const delRecorders = (Recorders: any) => {
  twoNameList.del({
    recordersData: Recorders,
    callBack: (msg: string) => {
      layer.msg(msg, { area: "50%", time: 3000 });
      loadData();
    },
  });
};
//----------------------------------------------------------

//获取两个名单数据
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
      //console.log(Props);
      Props.option.callBack();
    },
  });
};

//获取区域数据
const loadAreaDataSource = () => {
  areaInfor.get({
    areaData: twoNameRow.value.unitArea,
    pageData: pageArea,
    callbackLoadArea: (res: { data: any; total: number }) => {
      areaData.value = res.data;
      pageArea.total = res.total;
    },
  });
};

const tableColumns = [
  { title: "选项", width: "35px", type: "checkbox", fixed: "left" },
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
