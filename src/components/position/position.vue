<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>地点管理</el-breadcrumb-item>
      <el-breadcrumb-item>地点列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入地名"
            v-model="queryInfo.searchName"
            clearable
            @change="search()"
            @clear="clearinput()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search()"
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
          prop="placeId"
          align="center"
          label="地点序号"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="地点名称"
          prop="placeName"
          align="center"
           width="800px"
        ></el-table-column>
        
        <el-table-column
          label="人员阈值"
          prop="placeThreshold"
          align="center"
          width="200px"
        >
        </el-table-column>
        <el-table-column label="经度" prop="latitudeAndLongitude[0]" align="center">
        </el-table-column>
       <el-table-column label="纬度" prop="latitudeAndLongitude[1]" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" width="250px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editClick(scope.row)">
              编辑
            </el-button>
            <el-button
              type="danger"
              size="mini"
              @click="deleteClick(scope.row.placeId)"
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
      title="修改当前地点信息"
      :visible.sync="editDialogVisible"
      width="750px" 
    >
      <el-form ref="form" style="margin-top: 20px; width: 700px" label-width="50px">
        <el-form-item label="地名">
          <el-input style="margin-bottom:5px" v-model="placeName"></el-input>
           <el-button @click="chooseplace" type="primary">选择地址</el-button>
        </el-form-item>
         <el-form-item label="阈值" prop="placeThreshold">
          <el-input-number
            v-model="placeThreshold"
            placeholder="请输入阈值"
            :min="1"
            :max="1000"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="经度">
          <el-input  v-model="lng"></el-input>
        </el-form-item>
        <el-form-item label="纬度">
          <el-input v-model="lat"></el-input>
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
      },
      placeList: [], 
      total: 0,
      editDialogVisible: false,
      editForm: "",
      lng:0,
      lat:0,
      placeName:'',
      placeId:null,
      placeThreshold:0
    };
  },
  created() {
    this.getPersonalList();
  },
  mounted(){
   if(localStorage.getItem("addaddress")){
     console.log(1111)
      this.placeName=localStorage.getItem("addaddress")
      this.lat=localStorage.getItem("addaddresslat")
      this.lng=localStorage.getItem("addaddresslng")
      this.placeId=localStorage.getItem("placeId")
      this.placeThreshold=localStorage.getItem("placeThreshold")
      localStorage.removeItem("addaddress");
      localStorage.removeItem("addaddresslat");
      localStorage.removeItem("addaddresslng");
      localStorage.removeItem("placeId");
      localStorage.removeItem("placeThreshold");

      this.editDialogVisible = true;
    }
  },
  methods: {
     chooseplace(){
      localStorage.setItem("placeId",this.placeId)
      localStorage.setItem("placeThreshold",this.placeThreshold)
      this.$router.push("/map");
    },
    getPersonalList() {
      this.$http
        .post("/admin/page/place", this.queryInfo)
        .then((res) => {
          console.log(res);
          this.placeList = res.data.data.placePage;
          this.total = res.data.data.totalPlace; 
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
      console.log(this.editForm);
      this.editDialogVisible = true;
      this.lng=this.editForm.latitudeAndLongitude[0]
      this.lat=this.editForm.latitudeAndLongitude[1]
      this.placeName=this.editForm.placeName
      this.placeId=this.editForm.placeId
      this.placeThreshold=this.editForm.placeThreshold
    },
    //页面刷新
    refresh() {
      this.$router.go(0);
    },
    //清除搜索内容
    clearinput(){
      this.queryInfo.searchName= "";
      this.queryInfo.whichPage = 1;
      this.getPersonalList();
    },
    //搜索
    search() {
      this.queryInfo.whichPage = 1;
      this.getPersonalList();
    },
    // 修改人员信息
    editforms() {
      var lng=this.lng
           var lat=this.lat
          lng=Number(lng)
          lat=Number(lat)
          console.log(lng)
           var latitudeAndLongitude=[]
           latitudeAndLongitude.push(lng)
           latitudeAndLongitude.push(lat)
      this.$http.post('/admin/place/update', {
        placeId:this.placeId,
        placeName:this.placeName,
        placeThreshold:this.placeThreshold,
        latitudeAndLongitude:latitudeAndLongitude
      })
        .then((res) => {
         console.log(res)
          this.$message.success("修改信息成功");
          this.getPersonalList();
          this.editDialogVisible = false;
        });
    },
    // 删除人员信息
    async deleteClick(placeId) {
      const confirmresult = await this.$confirm("确认删除此地点?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      // 用户取消
      if (confirmresult !== "confirm") {
        return this.$message.info("已取消删除操作");
      }
      // 删除
      const { data: res } = await this.$http.post('/admin/place/delete',{placeId:placeId});
      console.log(res)
      this.$message.success("删除地点信息成功！");
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
