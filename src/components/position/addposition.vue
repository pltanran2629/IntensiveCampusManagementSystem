<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>地点管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加地点</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-form
        :model="addpersonalform"
        status-icon
        :rules="addPensonalRules"
        ref="addPensonalRef"
        label-width="100px"
        style="margin-top: 20px; width: 700px"
      >
        <el-form-item label="地点" prop="placeName">
          <el-input
            v-model="addpersonalform.placeName"
            placeholder="请输入地点"
            style=" width: 500px"
          ></el-input>
           <el-button @click="chooseplace" type="primary">选择地址</el-button>
        </el-form-item>
        <el-form-item label="阈值" prop="placeThreshold">
          <el-input-number
            v-model="addpersonalform.placeThreshold"
            placeholder="请输入阈值"
            :min="1"
            :max="1000"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="经度" prop="Longitude">
          <el-input 
          v-model="addpersonalform.Longitude"
          placeholder="请输入经度"
           ></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="Latitude">
          <el-input 
          v-model="addpersonalform.Latitude"
          placeholder="请输入纬度"
           ></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 20px">
          <el-button type="primary" @click="add()" style="width: 80px">添加</el-button>
          <el-button @click="resetForm()" style="width: 80px">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addpersonalform: {
      placeName:'',
      placeThreshold:100,
      Longitude:"",
      Latitude:''
      },
      addPensonalRules: {
        placeName: [
          {
            required: true,
            message: "请输入地点名称",
            trigger: "blur",
          },
        ],
        placeThreshold: [
          {
            required: true,
            message: "请输入阈值",
            trigger: "blur",
          },
        ],
       Longitude: [
          {
            required: true,
            message: "请输入经度",
            trigger: "blur",
          },
        ],
         Latitude: [
          {
            required: true,
            message: "请输入纬度",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted(){
    if(localStorage.getItem("addaddress")){
      this.addpersonalform.placeName=localStorage.getItem("addaddress")
      this.addpersonalform.Latitude=localStorage.getItem("addaddresslat")
      this.addpersonalform.Longitude=localStorage.getItem("addaddresslng")
      localStorage.removeItem("addaddress");
      localStorage.removeItem("addaddresslat");
      localStorage.removeItem("addaddresslng");
    }
  },
  methods: {
    chooseplace(){
      this.$router.push("/map");
    },
    resetForm() {
      //通过this.$refs可以直接获取引用对象
      this.$refs.addPensonalRef.resetFields();
    },
    // 上传人员信息
    
    add() {
      this.$refs.addPensonalRef.validate(async (valid) => {
        if (valid) {
           // 发起请求
           var lng=this.addpersonalform.Longitude
           var lat=this.addpersonalform.Latitude
          lng=Number(lng)
          lat=Number(lat)
          console.log(lng)
           var latitudeAndLongitude=[]
           latitudeAndLongitude.push(lng)
           latitudeAndLongitude.push(lat)
          const { data: res } = await this.$http.post(
            "/admin/place/insert",
           {
            placeName:this.addpersonalform.placeName,
            placeThreshold:this.addpersonalform.placeThreshold,
            latitudeAndLongitude:latitudeAndLongitude
           }
          );
          if (res) {
          this.$message.success("成功添加地址信息");
          this.$refs.addPensonalRef.resetFields()
        }
        }
        else{
          this.$message.error("请完善人员信息")
        }
      });
    },
  },
};
</script>
  
<style lang="less" scoped>
</style>