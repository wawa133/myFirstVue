<template>
  <div>
    <lay-table
      :max-height="unitTableHeight"
      :auto-col-width="true"
      :page="pageUnit"
      :columns="unitAuditTableColumns"
      :data-source="projectData.authUnit"
      even
      v-model:selected-keys="unitSelectedKeys"
      @change="unitChange"
      @row-double="unitRowDouble"
    >
      <template #status="{ row }">
        <lay-switch :model-value="row.status"></lay-switch>
      </template>
      <template v-slot:toolbar>
        <!-- <lay-button
          v-if="userTableHeight !== '50px'"
          size="sm"
          type="primary"
          @click="addUsersAudit(projectData.authUser)"
          >确认授权</lay-button
        >
        <lay-button
          v-if="userTableHeight !== '50px'"
          size="sm"
          type="primary"
          @click="showUsersAudit()"
          >查看授权</lay-button
        >
        <lay-button
          v-if="userTableHeight === '50px'"
          size="sm"
          type="primary"
          @click="setUserTableHeight('1000px')"
          >查看修改人员授权</lay-button
        > -->
        <lay-button size="sm" @click="delSelectRows">删除</lay-button>
      </template>

      <template v-slot:operator="{ row }">
        <lay-button size="xs" type="primary" @click="delRow(row)">删除</lay-button>
      </template>

      <template #unitRoleSelector="{ row }">
        <lay-select v-model="row.authLevel" @change="changeUnitAudit(row)">
          <!-- <lay-select-option :value="0" :label="''"></lay-select-option> -->
          <lay-select-option
            v-for="(data, key) in Props.prompt.row.auditLevelTotal"
            :key="'unitRoleSelector' + key"
            :value="data"
            :label="getAuditLevelName(data, Props.prompt.row.auditLevelTotal)"
          ></lay-select-option>
        </lay-select>
      </template>
    </lay-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { layer } from "@layui/layer-vue";
import projectInfor from "@/api/projectInfo";

const Props = defineProps(["prompt"]);

// 新建区域模态框娈量及函数部分
// let unitTableHeight = ref("50px");
let unitTableHeight = ref("1000px");
let unitSelectedKeys = ref([]);

const projectData = reactive({
  authUnit: [] as {
    id: number | undefined | null;
    userID: number | undefined | null;
    userName: string | undefined | null;
    projectID: number | undefined | null;
    projectName: string | undefined | null;
    authLevel: number | undefined | null;
    desc: string | undefined | null;
  }[],
  authUser: [] as {
    id: number | undefined | null;
    unitID: number | undefined | null;
    unitName: string | undefined | null;
    projectID: number | undefined | null;
    projectName: string | undefined | null;
    authLevel: number | undefined | null;
    desc: string | undefined | null;
  }[],
});

const pageUnit = reactive({ current: 1, limit: 10, total: 100 });

const unitChange = (page: any) => {
  getProjectAuthUnit(page);
};

const unitRowDouble = (row: any) => {
  console.log(row);
};

const getAuditLevelName = (lev: number, totalLev: number) => {
  if (lev == 1) {
    return "数据录入";
  } else if (lev == totalLev) {
    return "数据审定";
  } else {
    return `审核-${lev - 1}`;
  }
};

const delSelectRows = () => {
  let selectedKeysArr: any = [];
  unitSelectedKeys.value.forEach((item: any) => {
    projectData.authUnit.forEach((item2: any) => {
      if (item == item2.id) {
        selectedKeysArr.push(item2);
      }
    });
  });

  if (selectedKeysArr.length == 0) {
    layer.msg("请选择要删除的数据", { area: "50%" });
    return;
  }
  delReConfirm(selectedKeysArr);
};

const delRow = (row: any) => {
  delReConfirm([row]);
};

const delReConfirm = (row: any) => {
  layer.confirm("确定要删除吗？", {
    btn: [
      {
        text: "确定",
        callback: (id: any) => {
          deleteRecords([row]);
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

const deleteRecords = (Records: any) => {
  projectInfor.delAuditUnits({
    projectRowData: Props.prompt.row,
    delAuditUnits: Records,
    callBack: (msg: string) => {
      layer.msg(msg, { area: "50%" });
      getProjectAuthUnit(pageUnit.current);
      Props.prompt.callBack();
    },
  });
};

const changeUnitAudit = (row: any) => {
  projectInfor.editProjectAuthUnit({
    projectRowData: Props.prompt.row,
    editAuditData: row,
    callBack: (msg: string) => {
      layer.msg(msg, { area: "50%" });
      getProjectAuthUnit(pageUnit.current);
      Props.prompt.callBack();
    },
  });
};

const unitAuditTableColumns = [
  { title: "选项", width: "55px", type: "checkbox", fixed: "left" },
  { title: "ID", width: "30px", key: "id" },
  { title: "单位名称", width: "100px", key: "unitName" },
  { title: "项目名称", width: "300px", key: "projectName" },
  {
    title: "权限",
    width: "165px",
    customSlot: "unitRoleSelector",
    key: "unitRoleSelector",
    fixed: "right",
    ignoreExport: true,
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

const getProjectAuthUnit = (page: number) => {
  pageUnit.current = page;
  projectInfor.getProjectAuthUnit({
    projectRowData: Props.prompt.row,
    pageData: pageUnit,
    callBack: (promp: any) => {
      projectData.authUnit = promp.data;
      pageUnit.total = promp.total;
    },
  });
};

onMounted(() => {
  getProjectAuthUnit(1);
});
</script>

<style scoped></style>
