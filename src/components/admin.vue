<template>
  <el-container class="home-container">
    <el-header height="6vh">
      <!-- <div class="logo-con">
        <img src="../assets/index-logo.png" alt="" />
      </div>

      <el-button plain @click="logout()">退出登陆</el-button> -->
      <div class="returnbtn">东北师范大学(净月校区)</div>
      <div class="returnbtn" @click="logout">退出登录</div>
    </el-header>

    <el-container>
      <el-aside>
        <el-menu
          background-color="#606266"
          :default-active="activeIndex"
          text-color="#ffffff"
          :collapse-transition="false"
          active-text-color="#E6A23C"
          unique-opened
          router
        >
          <!-- 病害管理 -->
          <el-submenu index="1">
            <template #title>
              <i class="el-icon-menu"></i>
              <span style="font-size: 20px">人员管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="personal" @click="saveIndex('personal')">
                <template>
                  <i class="el-icon-files"></i>
                  <span style="font-size: 17px">人员列表</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template #title>
              <i class="el-icon-menu"></i>
              <span style="font-size: 20px">地点管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="position" @click="saveIndex('position')">
                <template>
                  <i class="el-icon-files"></i>
                  <span style="font-size: 17px">地点列表</span>
                </template>
              </el-menu-item>
              <el-menu-item
                index="add-position"
                @click="saveIndex('add-position')"
              >
                <template>
                  <i class="el-icon-plus"></i>
                  <span style="font-size: 17px">添加地点</span>
                </template>
              </el-menu-item>
              <el-menu-item
                index="map1"
                @click="saveIndex('map1')"
              >
                <template>
                  <i class="el-icon-plus"></i>
                  <span style="font-size: 17px">地图</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="mine">
            <i class="el-icon-menu"></i>
            <span slot="title" style="font-size: 20px">个人中心</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 主体部分 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  //生命周期函数
  created() {
    this.activeIndex = window.localStorage.getItem("activeIndex");
  },
  methods: {
    //保存链接的激活状态
    saveIndex(index) {
      window.localStorage.setItem("activeIndex", index);
      this.activeIndex = index;
    },
    logout(){
      localStorage.removeItem("user")
      this.$router.replace({path: '/login'});
    }
  },
};
</script>

<style lang="less" scoped>
.returnbtn {
  font-size: 20px;
  color: white;
}
.home-container {
  height: 100%;
  font-family: "微软雅黑";
}

.el-header {
  background-color: #303133;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgb(251, 251, 251);
  font-size: 16px;
  padding-right: 50px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.el-aside {
  background-color: #606266;
  .el-menu {
    border-right: 0;
  }
}
</style>
