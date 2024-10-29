<template>
  <div class="total">
    <div class="topnav" content="">
      <div @click="goBack">&lt; 返回</div>
      <div>东北师范大学(净月校区)</div>
    </div>
    <div class="maincontain">
      <div class="maincontainvideo">
        <video
          ref="videoRef"
          id="myVideo"
          class="video-js vjs-default-skin vjs-big-play-centered"
          style="height: 93vh; width: 80vw"
          muted
          autoplay
          preload="auto"
          controls
          @play="play"
          @pause="pause"
          @ended="end"
        >
          <source :src="src" type="video/mp4" />
        </video>
      </div>
      <div class="maincontaintxt">
        <div class="total-right">
          <div class="total-right-tit">人员密集情况</div>
          <div class="total-right-position">
            <div class="total-right-positionfont">经度：</div>
            <div class="total-right-positionnum">{{lng}}</div>
            <div class="total-right-positionfont">纬度：</div>
            <div class="total-right-positionnum">{{lat}}</div>
            <div class="total-right-positionfont">详细地址：</div>
            <div class="total-right-positionfont1">
              {{address}}
            </div>
            <div class="total-right-positionfont">当前人数：</div>
          </div>
          <div class="total-right-positionpersonnum">
            <div id="one"></div>
            <span style="color: #606266; font-size: 18px"> 人</span>
          </div>
          <div class="total-right-position">
            <div class="total-right-positionfont">提示:</div>
          </div>
          <div class="total-right-positionpersonnum">
            <span :style="color">{{status}}</span>
          </div>
          <div class="total-right-positionright">
            <div>CopyRight@copy2023</div>
            <div>基于YOLO的校园人员密集程度管理系统</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const mapdata=require("../assets/position.json")
export default {
  name: "player",
  data() {
    return {
      position:"",
      positiondetail:'',
      timenum: 0,
      timer: "",
      timedata: [],
      src:"",
      status:"",
      color:'',
      lng:"",
      lat:'',
      address:''
    };
  },
  methods: {
    pause() {
      this.$refs.videoRef.videoIsPlay = false;
      console.log("暂停");
      clearInterval(this.timer);
    },
    play() {
      this.$refs.videoRef.videoIsPlay = true;
      console.log("播放");
      this.timer = setInterval(() => {
        document.getElementById("one").innerHTML =
        this.timedata[this.timenum] + "&nbsp;";
        this.timenum++;
        if(this.timedata[this.timenum]>25){
          this.status="密集",
          this.color="color:#F56C6C;font-size:45px;"
        }else{
          this.status="安全"
          this.color="color:#67C23A;font-size:45px;"
        }
        // console.log(this.timenum)
      }, 33.33);
    },
    end() {
      this.$refs.videoRef.videoIsPlay = false;
      this.timenum = 0;
      console.log("结束");
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
      goBack() {
      console.log("go back");
      this.$router.back()
    },
  },
  beforeDestroy(){
     this.$refs.videoRef.videoIsPlay = false;
      this.timenum = 0;
      console.log("结束");
      if (this.timer) {
        clearInterval(this.timer);
      }
  },
  mounted() {
    this.position=localStorage.getItem('position')
    this.positiondetail=localStorage.getItem('positiondetail')
    this.src=require("../../2tanr/video/"+this.position+"/"+this.position+this.positiondetail+".mp4")
    console.log(this.src)
    const timedata = require("../../2tanr/video/"+this.position+"/"+this.position+this.positiondetail+".json");
    this.timedata = timedata;
    this.timenum = 0;
    this.status=""
    this.lng=mapdata[this.position-1][2][0]
    this.lat=mapdata[this.position-1][2][1]
    this.address=mapdata[this.position-1][1]
  },
};
</script>
<style scoped>
.total {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
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
.maincontain {
  height: 93vh;
  width: 100vw;
  display: flex;
  flex-direction: row;
}
.maincontainvideo {
  height: 93vh;
}
.total-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5vh 2vw;
  width: 16vw;
  height: 88vh;
  background-color: #f6f6f7;
  position: relative;
}
.total-right-tit {
  font-size: 30px;
  color: #303133;
  margin-bottom: 2vh;
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
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
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
#one{
  width: 4vw;
  text-align: center;
}
</style>
