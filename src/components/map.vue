<template>
  <div class="total">
    <div class="topnav" content="" @back="goBack">
      <div @click="goBack">&lt; 返回</div>
      <div>东北师范大学(净月校区)</div>
    </div>
    <div class="main-context">
      <div class="total-left">
        <div id="container" class="containermap"></div>
      </div>
      <div class="total-right">
        <div class="total-right-tit">人员密集情况</div>
        <div class="total-right-sear">
          <div class="total-right-sear-key">请输入关键词：</div>
          <el-select
            v-model="keywords"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
            :clearable="true"
            size="medium"
            @change="currentSelect"
            style="width: 15vw"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item"
              class="one-text"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.district
              }}</span>
            </el-option>
          </el-select>
        </div>
        <div class="total-right-position">
          <div class="total-right-positionfont">纬度：</div>
          <div class="total-right-positionnum">{{ form.lat }}</div>
          <div class="total-right-positionfont">经度：</div>
          <div class="total-right-positionnum">{{ form.lng }}</div>
          <div class="total-right-positionfont">详细地址：</div>
          <div class="total-right-positionfont1">{{ form.address }}</div>
          <!-- <div class="total-right-positionfont">当前人数：</div> -->
        </div>
        <div class="checkbtn">
          <el-button @click="sureposition" type="primary">确定该地点</el-button>
          <el-button @click="goBack">返回添加地点页</el-button>
        </div>

        <!-- <div class="notice">
          <div class="noticeitem">
          <el-alert
            title="一食堂门口密集"
            type="error"
            description="一食堂门口共有180人，过于密集"
            show-icon
            center
          >
          </el-alert>
          </div>
          <div class="noticeitem">
           <el-alert
            title="二食堂门口警告"
            type="warning"
            description="二食堂门口共有140人，相对密集"
            show-icon
            center
          >
          </el-alert>
          </div>
        </div> -->
        <div class="total-right-positionright">
          <div>CopyRight@copy2023</div>
          <div>基于YOLO的校园人员密集程度管理系统</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const mapdata = require("../assets/position.json");
const people = require("../../2tanr/list_ave_p.json");
import AMapLoader from "@amap/amap-jsapi-loader";
window._AMapSecurityConfig = {
  // 安全密钥
  securityJsCode: "09018e586dca8e0c4fea6daed363c956",
};
export default {
  name: "TestIndex",
  data() {
    return {
      // 地图实例
      map: null,
      // 标记点
      marker: "",
      // 地址逆解析
      geoCoder: null,
      // 搜索提示
      AutoComplete: null,
      // 搜索关键字
      keywords: "",
      // 位置信息
      form: {
        lng: "125.42382",
        lat: "43.825989",
        address:
          "吉林省长春市南关区博硕街道东北师范大学净月校区图书馆东北师范大学(净月校区)",
        adcode: "", //地区编码
      },
      // 搜索节流阀
      loading: false,
      // 搜索提示信息
      options: [],
    };
  },
  methods: {
    initMap() {
      AMapLoader.load({
        // 你申请的Key
        key: "92c2b3a88b400d1e5a5bc2155c5b14f7",
        version: "2.0",
        // 需要用到的插件
        plugins: ["AMap.Geocoder", "AMap.AutoComplete"],
      })
        .then((AMap) => {
          this.map = new AMap.Map("container", {
            viewMode: "3D", //是否为3D地图模式
            zoom: 18, //初始化地图级别
            center: [125.424002, 43.825976], //初始化地图中心点位置
          });
          //地址逆解析插件
          this.geoCoder = new AMap.Geocoder({
            city: "0431", //城市设为北京，默认：“全国”
            radius: 500, //范围，默认：500
          });
          // 搜索提示插件
          this.AutoComplete = new AMap.AutoComplete({ city: "长春" });
          //点击获取经纬度;
          this.map.on("click", (e) => {
            // 获取经纬度
            this.form.lng = e.lnglat.lng;
            this.form.lat = e.lnglat.lat;
            // 清除点
            this.removeMarker();
            // 标记点
            this.setMapMarker();
          });
        })
        .catch((err) => {
          // 错误
          console.log(err);
        });
    },
    // 标记点
    setMapMarker() {
      // 自动适应显示想显示的范围区域
      this.map.setFitView();
      this.marker = new AMap.Marker({
        map: this.map,
        position: [this.form.lng, this.form.lat],
      });
      // 逆解析地址
      this.toGeoCoder();
      this.map.setFitView();
      this.map.add(this.marker);
    },
    // 清除点
    removeMarker() {
      if (this.marker) {
        this.map.remove(this.marker);
      }
    },
    // 逆解析地址
    toGeoCoder() {
      let lnglat = [this.form.lng, this.form.lat];
      this.geoCoder.getAddress(lnglat, (status, result) => {
        if (status === "complete" && result.regeocode) {
          this.form.address = result.regeocode.formattedAddress;
        }
      });
    },
    // 搜索
    remoteMethod(query) {
      console.log(query);
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.AutoComplete.search(query, (status, result) => {
            this.options = result.tips;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
    // 选中提示
    currentSelect(val) {
      // 清空时不执行后面代码
      if (!val) {
        return;
      }
      this.form = {
        lng: val.location.lng,
        lat: val.location.lat,
        address: val.district + val.address,
        adcode: val.adcode,
      };
      // 清除点
      this.removeMarker();
      // 标记点
      this.setMapMarker();
    },
    goBack() {
      console.log("go back");
      this.$router.go(-1);
    },
    sureposition() {
      this.$confirm('确认选址', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '选址成功!'
          });
          localStorage.setItem("addaddress", this.form.address);
          localStorage.setItem("addaddresslng", this.form.lng);
          localStorage.setItem("addaddresslat", this.form.lat);
          this.$router.go(-1);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },
  },
  mounted() {
    this.initMap();
  },
};
</script>

<style>
.total {
  width: 100vw;
  height: 100vh;
}
.containermap {
  width: 80vw;
  height: 93vh;
}
.total-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2vw;
  width: 20vw;
  background-color: #f6f6f7;
  position: relative;
}
.main-context {
  display: flex;
  flex-direction: row;
  height: 93vh;
}
.topnav {
  height: 7vh;
  display: flex;
  direction: row;
  align-items: center;
  padding: 0 1vw;
  background-color: #606266;
  color: white;
  font-size: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.total-right-tit {
  font-size: 30px;
  color: #303133;
  margin-bottom: 2vh;
}
.total-right-sear {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 2vh;
  width: 90%;
}
.total-right-sear-key,
.total-right-positionfont {
  color: #909399;
  padding: 1vh 0;
  font-size: 15px;
}
.total-right-position {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 90%;
}
.total-right-positionnum {
  font-size: 25px;
  color: #303133;
}
.total-right-positionfont1 {
  color: #606266;
  font-size: 17px;
  min-height: 4vh;
}
.total-right-positionpersonnum {
  font-size: 60px;
}
.total-right-positionright {
  color: #c0c4cc;
  font-size: 14px;
  position: absolute;
  bottom: 5vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.notice {
  margin-top: 2vh;
  width: 90%;
}
.noticeitem {
  margin-bottom: 1vh;
}
.checkbtn {
  margin-top: 3vh;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
</style>
