<template>
  <div>
    <lay-table
      :max-height="userTableHeight"
      :auto-col-width="true"
      :page="pageUser"
      :columns="userAuditTableColumns"
      :data-source="projectData.authUser"
      even
      v-model:selected-keys="userSelectedKeys"
      @change="userChange"
      @row-double="userRowDouble"
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

      <template #userRoleSelector="{ row }">
        <lay-select v-model="row.authLevel" @change="changeUserAudit(row)">
          <!-- <lay-select-option :value="0" :label="''"></lay-select-option> -->
          <lay-select-option
            v-for="(data, key) in Props.prompt.row.auditLevelTotal"
            :key="'userRoleSelector' + key"
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
let userTableHeight = ref("1000px");
let userSelectedKeys = ref([]);

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

const pageUser = reactive({ current: 1, limit: 10, total: 100 });

const userChange = (page: any) => {
  getProjectAuthUser(page);
};

const userRowDouble = (row: any) => {
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
  userSelectedKeys.value.forEach((item: any) => {
    projectData.authUser.forEach((item2: any) => {
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

const delReConfirm = (arrayRow: any) => {
  layer.confirm("确定要删除吗？", {
    btn: [
      {
        text: "确定",
        callback: (id: any) => {
          deleteRecords(arrayRow);
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
  projectInfor.delAuditUsers({
    projectRowData: Props.prompt.row,
    delAuditUsers: Records,
    callBack: (msg: string) => {
      layer.msg(msg, { area: "50%" });
      getProjectAuthUser(pageUser.current);
      Props.prompt.callBack();
    },
  });
};

const changeUserAudit = (row: any) => {
  projectInfor.editProjectAuthUser({
    projectRowData: Props.prompt.row,
    editAuditData: row,
    callBack: (msg: string) => {
      layer.msg(msg, { area: "50%" });
      getProjectAuthUser(pageUser.current);
      Props.prompt.callBack();
    },
  });
};

const userAuditTableColumns = [
  { title: "选项", width: "55px", type: "checkbox", fixed: "left" },
  { title: "ID", width: "30px", key: "id" },
  { title: "用户名称", width: "100px", key: "userName" },
  { title: "项目名称", width: "300px", key: "projectName" },
  {
    title: "权限",
    width: "165px",
    customSlot: "userRoleSelector",
    key: "userRoleSelector",
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

const getProjectAuthUser = (page: number) => {
  pageUser.current = page;
  projectInfor.getProjectAuthUser({
    projectRowData: Props.prompt.row,
    pageData: pageUser,
    callBack: (promp: any) => {
      projectData.authUser = promp.data;
      pageUser.total = promp.total;
    },
  });
};

onMounted(() => {
  getProjectAuthUser(1);
});
</script>

<style scoped></style>
