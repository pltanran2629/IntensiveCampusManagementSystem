<template>
  <div class="total">
    <div class="topnav" content="" @back="goBack">
      <div @click="goBack">&lt; 返回</div>
      <div>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <el-avatar :size="50" :src="user.image"></el-avatar>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="showinfor">查看个人资料</el-dropdown-item>
            <el-dropdown-item command="changeinfor">修改个人资料</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="main-context">
      <div class="total-left">
        <div id="container" class="container"></div>
      </div>
    </div>
    <el-dialog
      title="查看个人资料"
      :visible.sync="dialogVisible"
      width="30%">
      <div class="showinfor">
       <el-avatar class="minedetailcon" :size="100" :src="user.image"></el-avatar>
       <div class="minedetailcon"><span style="color:#909399">昵称：</span>{{user.name}}</div>
        <div class="minedetailcon"><span style="color:#909399;">学号：</span>{{user.username}}</div>
        <div class="minedetailcon"><span style="color:#909399">电话：</span>{{user.phone}}</div>
        <div class="minedetailcon"><span style="color:#909399">年级：</span>{{user.grade}}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改当前人员信息"
      :visible.sync="dialogVisible1"
      width="30%"
    >
      <el-form ref="form" :model="editForm" label-width="70px">
       <div style="width:100%;text-align: center;margin:2vh 1vw">
          <el-avatar   :size="50" :src="editForm.image"></el-avatar>
        </div>
        <el-form-item label="用户名">
          <el-input v-model="editForm.name"></el-input>
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
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="editforms">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// const mapdata = require("../assets/position.json");
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
      infoWindow:'',
      // 地图实例
      map: null,
      // 标记点
      // 位置信息
     totalpeople:[],
     timer:'',
     timenum:null,
     markers:[],
     showindex:"",
     mapdata:[],
     user:"",
     dialogVisible: false,
     dialogVisible1: false,
     editForm:{}
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
       this.infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -70),isCustom:true,anchor:'bottom-center',});
        // 第一次立即执行 
       if(this.timenum==22){
          this.timenum=2
        }else{
          this.timenum++
        }
       if (this.markers) {
        this.map.remove(this.markers);
        }
        for (var i = 0; i < this.mapdata.length; i++) {
        this.totalpeople[i]=0
        for(var j=0;j<people.length;j++){
         if(people[j][0]==this.mapdata[i].placeId.toString()){
          this.totalpeople[i]+=parseInt(people[j][this.timenum])
          }
          }
        var contenttext;
        if(this.totalpeople[i]>this.mapdata[i].placeThreshold){
          contenttext=`<div class="rednotice">警告！！共有${this.totalpeople[i]}人通过!</div>`
        }else{
          contenttext=`<div class="maptag">共有${this.totalpeople[i]}人通过</div>`
        }
         var marker = new AMap.Marker({
          position: this.mapdata[i].latitudeAndLongitude,//不同标记点的经纬度
          map: this.map,
          offset: new AMap.Pixel(0, -20),
          cursor:'pointer',
          anchor:'bottom-center',
          content:contenttext
        });
        marker.name=this.mapdata[i].placeName,
        marker.index=this.mapdata[i].placeId.toString()
        marker.totalpeople=this.totalpeople[i]
        marker.placeThreshold=this.mapdata[i].placeThreshold
        if(this.infoWindow.getIsOpen()&&(parseInt(this.showindex)-1)==i){
        this.infoWindow.setContent(this.createInfoWindow(this.mapdata[i].placeName, this.mapdata[i].placeId.toString(),this.totalpeople[i],this.mapdata[i].placeThreshold));}
        this.markers.push(marker)
        marker.on('click', (e)=>{
        // console.log(e)
        this.showindex=e.target.index
        this.infoWindow.setContent(this.createInfoWindow(e.target.name, e.target.index,e.target.totalpeople,e.target.placeThreshold));
        this.infoWindow.open(this.map,e.target.getPosition())
        setTimeout(()=>{
          this.bindWindowClick()
        },500)
        });
        // marker.emit('click', {target: marker});//默认初始化不出现信息窗体,打开初始化就出现信息窗体
      }
      
      //定时器执行多次
      this.timer=setInterval(() => {
        if(this.timenum==22){
          this.timenum=2
        }else{
          this.timenum++
        }
       if (this.markers) {
        this.map.remove(this.markers);
        }
        for (var i = 0; i < this.mapdata.length; i++) {
        this.totalpeople[i]=0
        for(var j=0;j<people.length;j++){
         if(people[j][0]==this.mapdata[i].placeId.toString()){
          this.totalpeople[i]+=parseInt(people[j][this.timenum])}
          }
        var contenttext;
        if(this.totalpeople[i]>this.mapdata[i].placeThreshold){
          contenttext=`<div class="rednotice">警告！！共有${this.totalpeople[i]}人通过!</div>`
        }else{
          contenttext=`<div class="maptag">共有${this.totalpeople[i]}人通过</div>`
        }
         var marker = new AMap.Marker({
          position: this.mapdata[i].latitudeAndLongitude,//不同标记点的经纬度
          map: this.map,
          offset: new AMap.Pixel(0, -20),
          cursor:'pointer',
          anchor:'bottom-center',
          content:contenttext
        });
        marker.name=this.mapdata[i].placeName,
        marker.index=this.mapdata[i].placeId.toString()
        marker.totalpeople=this.totalpeople[i]
        marker.placeThreshold=this.mapdata[i].placeThreshold
        if(this.infoWindow.getIsOpen()&&(parseInt(this.showindex)-1)==i){
        this.infoWindow.setContent(this.createInfoWindow(this.mapdata[i].placeName, this.mapdata[i].placeId.toString(),this.totalpeople[i],this.mapdata[i].placeThreshold));}
        this.markers.push(marker)
        marker.on('click', (e)=>{
        // console.log(e)
        this.showindex=e.target.index
        this.infoWindow.setContent(this.createInfoWindow(e.target.name, e.target.index,e.target.totalpeople,e.target.placeThreshold));
        this.infoWindow.open(this.map,e.target.getPosition())
        setTimeout(_=>{
          this.bindWindowClick()
        },500)
        });
        // marker.emit('click', {target: marker});//默认初始化不出现信息窗体,打开初始化就出现信息窗体
      }
      }, 10000);
      this.map.setFitView();  
       
        })
        .catch((err) => {
          // 错误
          console.log(err);
        });
    },
    createInfoWindow(name,index,totalpeople,placeThreshold) {
      console.log(totalpeople,placeThreshold)
      if(totalpeople>placeThreshold){
        var color="topagered"
      }else{
        var color="topagegreen"
      }
      let info = '<div class="infowin" data-index="' + index + '"><div class="close">×</div><div class="infowindetailtotal">共有 <span style="font-size:30px;color:#303133">'+totalpeople+'</span> 人</div><hr/><div class="infowinname">'+name+'</div><div class="infowindetail"><div class="positiondetail"><div>地点一：门口</div><div data-positiondetail="1" data-position="'+index+'" class="topage '+color+'">查看详情</div></div><div class="positiondetail"><div>地点二：石板路</div><div data-positiondetail="2" class="topage '+color+'" data-position="'+index+'">查看详情</div></div></div></div>'
        return info;
    },
    bindWindowClick(){
      const windowDomList = document.querySelectorAll('.topage')
      windowDomList.forEach(i=>{
        i.onclick = (e)=>{
          console.log(e.target.dataset.position)
          console.log(e.target.dataset.positiondetail)
          localStorage.setItem("position",e.target.dataset.position);
          localStorage.setItem("positiondetail",e.target.dataset.positiondetail);
          if(this.timenum<21){
            localStorage.setItem("timenum",this.timenum)
          }
          clearInterval(this.timer)
          this.$router.push("/video");
          //在这里做点击的操作
        }
        })
        const windowDomListclose = document.querySelectorAll('.close')
        windowDomListclose.forEach(i=>{
        i.onclick = (e)=>{
          this.infoWindow.close()
        }
        })
    },
    handleCommand(command){
      if(command=="showinfor"){
     this.dialogVisible=true
     }
     if(command=="changeinfor"){
     this.dialogVisible1=true
    }
    if(command=="logout"){    
      localStorage.removeItem("user")
      this.$router.replace({path: '/login'});
    
    }
    },
    goBack() {
      console.log("go back");
      this.$router.go(-1);
    },
    editforms(){
      this.$http
        .post('/admin/user/update', this.editForm)
        .then((res) => {
          console.log(res)
          this.$message.success("修改信息成功");
          this.dialogVisible1 = false;
          localStorage.setItem("user",JSON.stringify(res.data.data.userNewInfo))
          this.user=res.data.data.userNewInfo
       });
    }
  },
  beforeDestroy(){
    this.infoWindow='',
     this.totalpeople=[]
     if(this.timenum<23){
      localStorage.setItem("timenum",this.timenum)
     }
     this.markers=[]
     console.log("结束");
      if (this.timer) {
        clearInterval(this.timer);
      }
  },
  mounted() {
    console.log(this.$root.user)
    this.user=JSON.parse(localStorage.getItem("user"))
    this.editForm=this.user
    if(localStorage.getItem("timenum")<23){
      this.timenum=localStorage.getItem("timenum")
     }
     if(localStorage.getItem("timenum")==null){
      this.timenum=1
      console.log(this.timenum)
     }
     this.$http.post("/admin/place/query/all").then((res)=>{
      console.log(res)
      this.mapdata=res.data.data.list
      this.initMap();
     })
  },
};
</script>

<style>
.total {
  width: 100vw;
  height: 100vh;
}
.container {
  width: 100vw;
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
.maptag{
  border:3px #67C23A solid;
  text-align:center;
  border-radius:10px;
  min-width:5vw;
  padding:0.5vh 1vw;
  font-size:18px;
  background-color:rgba(240, 245, 249, 0.6);
}
.rednotice{
  color: #F56C6C;
  text-align:center;
  border-radius:10px;
  min-width:9vw;
  padding:0.5vh 1vw;
  font-size:20px;
  background-color:rgba(240, 245, 249, 0.6);
  border:4px #F56C6C solid;
}
.rednotice:hover{
  color: #F56C6C;
  box-shadow: 0 2px 6px 0 rgba(245, 108, 108, 0.84);
}
.maptag:hover{
box-shadow: 0 2px 6px 0 rgba(103, 194, 58, 0.61);
}
.infowin{
  max-width:13vw ;
  padding:1vh 1vw;
  background-color:rgba(242, 246, 252, 0.89) ;
  border-radius: 5px;
  position: relative;
}
.infowinname{
  font-size: 16px;
  color: #909399;
  margin-bottom: 0.5vh;
}
.infowindetail{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  font-size: 18px;
color:#606266 ;
}
.infowindetailtotal{
  font-size: 15px;
  color: #909399;
}
.positiondetail{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.topage{
  cursor:'pointer'
}
.topagegreen:hover{
  color:rgba(103, 194, 58,1) ;
}
.topagered:hover{
  color:#F56C6C ;
}
.close{
  position: absolute;
  top: 2px;
  right: 9px;
  font-size: 30px;
  color: #606266;
  padding: 0.3vw;
}
.showinfor{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.minedetailcon{
  margin-bottom: 5px;
}
</style>
