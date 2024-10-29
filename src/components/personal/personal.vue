<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>人员管理</el-breadcrumb-item>
      <el-breadcrumb-item>人员列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.searchName"
            @change="search()"
            style="width: 40vw"
            class="input-with-select"
          >
            <el-select
              style="width: 7vw"
              v-model="select"
              @change="applicantTypes"
              placeholder="请选择"
              slot="prepend"
            >
              <el-option label="学号" value="0"></el-option>
              <el-option label="用户名" value="1"></el-option>
            </el-select>
            <el-button
              slot="append"
              @click="search()"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-button
          icon="el-icon-refresh-right"
          style="float: right; margin-right: 10px"
          @click="refresh()"
        ></el-button>
      </el-row>
      <!-- table表格区域 -->
      <el-table :data="placeList" border stripe>
        <el-table-column
          type="index"
          align="center"
          label="序号"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="学号"
          prop="username"
          align="center"
        ></el-table-column>
        <el-table-column
          label="用户名"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="电话"
          prop="phone"
          align="center"
        ></el-table-column>
        <el-table-column label="年级" prop="grade" align="center" width="150px">
        </el-table-column>
        <el-table-column
          :formatter="stateFormat"
          label="身份"
          prop="level"
          align="center"
        >
        </el-table-column>
        <el-table-column label="操作" align="center" width="250px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editClick(scope.row)">
              编辑
            </el-button>
            <el-button
              type="danger"
              size="mini"
              @click="deleteClick(scope.row.userId)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.whichPage"
        :page-sizes="[10, 15, 20]"
        :page-size="queryInfo.perPageItems"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 修改人员信息对话框 -->
    <el-dialog
      title="修改当前人员信息"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form ref="form" :model="editForm" label-width="70px">
       <div style="width:100%;text-align: center;margin:2vh 1vw">
          <el-avatar   :size="50" :src="editForm.image"></el-avatar>
        </div>
        <el-form-item label="用户名">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
         <el-form-item label="电话">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="年级" style="width: 100%">
          <el-select
            style="width: 100%"
            v-model="editForm.grade"
            placeholder="请选择年级"
          >
            <el-option label="2019" value="2019"></el-option>
            <el-option label="2020" value="2020"></el-option>
            <el-option label="2021" value="2021"></el-option>
            <el-option label="2022" value="2022"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份" style="width: 100%">
          <el-select
            style="width: 100%"
            v-model="editForm.level"
            placeholder="请选择身份"
          >
            <el-option label="管理员" :value="0"></el-option>
            <el-option label="普通用户" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editforms">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        searchName: "",
        whichPage: 1,
        perPageItems: 10,
        flag: 0,
      },
      placeList: [],
      total: 0,
      editDialogVisible: false,
      editForm: "",
      select: "",
      selectadmin: "",
    };
  },
  created() {
    this.getPersonalList();
  },
  methods: {
    stateFormat(row, column) {
      if (row.level === 0) {
        return "管理员";
      } else {
        return "普通用户";
      }
    },
    applicantTypes(value) {
      this.queryInfo.flag = value;
    },
    getPersonalList() {
      this.$http.post("/admin/page/user", this.queryInfo).then((res) => {
        console.log(res)
        this.placeList = res.data.data.userPage;
        this.total = res.data.data.totalUser;
      });
    },
    handleSizeChange(newSize) {
      this.queryInfo.perPageItems = newSize;
      this.getPersonalList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.whichPage = newPage;
      this.getPersonalList();
    },
    // 修改数据对话框
    async editClick(row) {
      this.editForm = row;
      this.editDialogVisible = true;
    },
    //页面刷新
    refresh() {
      this.$router.go(0);
    },
    //搜索
    search() {
      this.queryInfo.whichPage = 1;
      this.getPersonalList();
    },
    // 修改人员信息
    editforms() {
      this.$http
        .post('/admin/user/update', this.editForm)
        .then((res) => {
          this.$message.success("修改信息成功");
          this.getPersonalList();
          this.editDialogVisible = false;
        });
    },
    // 删除人员信息
    async deleteClick(userId) {
      const confirmresult = await this.$confirm("确认删除此人员?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      // 用户取消
      if (confirmresult !== "confirm") {
        return this.$message.info("已取消删除操作");
      }

      // 删除
      const { data: res } = await this.$http.post("/admin/user/delete",{
        userId:userId
      });
      // if (res.code !== 2000) {
      //   this.$message.error("删除失败！！");
      // }
      console.log(res)
      this.$message.success("删除人员信息成功！");
      this.getPersonalList();
    },
  },
};
</script>

<style lang="less" scoped>
.set-popper {
  width: 500px;
}
.set-content {
  cursor: default;
  width: 100%;
  overflow: hidden;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
