<template>
  <div class="minecontent">
    <div class="box-card">
      <div class="avatarcontent">
        <el-avatar
          :size="150"
          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
        ></el-avatar>
      </div>
      <div class="minedetail">
        <div class="minedetailcon"><span style="color:#909399;">学号：</span>{{form.username}}</div>
        <div class="minedetailcon"><span style="color:#909399">昵称：</span>{{form.name}}</div>
        <div class="minedetailcon"><span style="color:#909399">电话：</span>{{form.phone}}</div>
        <div class="minedetailcon"><span style="color:#909399">年级：</span>{{form.grade}}</div>
         <div class="minedetailbtn">
            <div><el-button type="primary" @click="changeinformation">修改个人信息</el-button></el-button></div>
         </div>
      </div>
    </div>
     <el-dialog title="修改个人信息" width="30%" :visible.sync="dialogFormVisible">
  <el-form :model="form" label-width="70px">
    <div style="width:100%;text-align: center;margin:2vh 1vw">
          <el-avatar   :size="100" :src="form.image"></el-avatar>
        </div>
    <el-form-item label="昵称" >
      <el-input v-model="form.name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" >
      <el-input v-model="form.password" autocomplete="off"></el-input>
    </el-form-item>
     <el-form-item label="电话" >
      <el-input v-model="form.phone" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item style="width: 100%" label="年级">
            <el-select
              style="width: 100%"
              v-model="form.grade"
              placeholder="请选择年级"
            >
              <el-option label="2019" value="2019"></el-option>
              <el-option label="2020" value="2020"></el-option>
              <el-option label="2021" value="2021"></el-option>
              <el-option label="2022" value="2022"></el-option>
            </el-select>
          </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="surechange">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>
<script>
export default {
data(){
    return{
        dialogFormVisible:false,
        form: [],
    }
},
methods: {
    changeinformation(){
        this.dialogFormVisible=true
    },
    surechange(){
      this.$http.post("/admin/user/update",this.form).then((res)=>{
        console.log(res)
        this.$message.success("修改成功");
         this.dialogFormVisible=false,
          localStorage.setItem("user",JSON.stringify(res.data.data.userNewInfo))
          this.form=res.data.data.userNewInfo
      })
    }
},
mounted(){
  this.form=JSON.parse(localStorage.getItem("user"))
}
};
</script>
<style>
.minecontent {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  /* padding-top: 3vh; */
}
.box-card {
  width: 70vw;
  height: 80vh;
  padding: 3vh 4vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatarcontent{
    width: 100px;
}
.minedetail{
   display: flex;
   flex-direction: column;
   width: 20vw;
   justify-content: center;
   margin-top: 5vh;
   font-size: 20px;
align-items: center;
}
.minedetailcon{
    margin-bottom: 2vh;
}
.minedetailbtn{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 15vw;
    
}
</style>
