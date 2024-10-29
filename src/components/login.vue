<template>
  <div class="login-container">
    <div class="innercon">
      <div class="avater_box">
        <img src="../assets/login-logo.png" alt="" />
      </div>
      <div class="login-box">
        <div class="login-text">校园密集人群情况系统</div>
        <el-form
          ref="loginformRef"
          class="login-form"
          :model="loginform"
          :rules="loginrules"
          v-if="loginstatus"
          key="login"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginform.username"
              prefix-icon="el-icon-user-solid"
              placeholder="请输入学号"
            ></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginform.password"
              type="password"
              prefix-icon="el-icon-s-goods"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>

          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="register">注册</el-button>
          </el-form-item>
        </el-form>
        <el-form
          ref="registerformRef"
          class="login-form"
          :model="registerform"
          :rules="registerrules"
          v-if="!loginstatus"
          key="register"
        >
          <el-form-item prop="usernameres">
            <el-input
              v-model="registerform.usernameres"
              prefix-icon="el-icon-user-solid"
              placeholder="请输入学号"
            ></el-input>
          </el-form-item>

          <el-form-item prop="passwordres">
            <el-input
              v-model="registerform.passwordres"
              type="password"
              prefix-icon="el-icon-s-goods"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>

          <el-form-item prop="passwordrepeteres">
            <el-input
              v-model="registerform.passwordrepeteres"
              placeholder="请重复输入密码"
              type="password"
              prefix-icon="el-icon-s-goods"
            ></el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <el-input
              v-model="registerform.phone"
              placeholder="请输入电话号"
              prefix-icon="el-icon-s-goods"
            ></el-input>
          </el-form-item>
          <el-form-item style="width: 100%">
            <el-select
              style="width: 100%"
              v-model="registerform.grade"
              placeholder="请选择年级"
            >
              <el-option label="2019" value="2019"></el-option>
              <el-option label="2020" value="2020"></el-option>
              <el-option label="2021" value="2021"></el-option>
              <el-option label="2022" value="2022"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="btns">
            <el-button
              type="primary"
              @click="submitresgister('registerformRef')"
              >提交</el-button
            >
            <el-button type="info" @click="register">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    let checkPwd2 = (rule, value, callback) => {
      if (value.trim().length == 0) {
        callback(new Error("请确认密码不能为空"));
      } else if (value != this.registerform.passwordres) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      loginform: {
        username: "",
        password: "",
      },
      loginrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
        ],
      },
      registerform: {
        usernameres: "",
        passwordres: "",
        passwordrepeteres: "",
        phone: "",
        grade: "",
      },
      registerrules: {
        usernameres: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        // 验证密码是否合法
        passwordres: [
          {
            required: true,
            message: "请拟定登录密码",
            trigger: "blur",
          },
        ],
        passwordrepeteres: [
          {
            validator: checkPwd2,
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入电话",
            trigger: "blur",
          },
          {
            pattern: /^1[3|5|7|8|9]\d{9}$/,
            message: "请输入正确的号码格式",
            trigger: "blur",
          },
        ],
      },
      loginstatus: true,
      // 0为登录 1为注册
    };
  },
  methods: {
    register() {
      this.$data.loginstatus = !this.$data.loginstatus;
    },
    login() {
      this.$refs.loginformRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post(
            "/user/login",
            this.loginform
          );
          if (res.status == 0) {
            if (res.data.user.level == 0) {
              console.log(res.data.user)
               localStorage.setItem("user",JSON.stringify(res.data.user))
              this.$root.user =res.data.user;
              this.$message.success("管理员登陆成功");
              this.$router.push("/personal");
            }
            if (res.data.user.level == 1) {
               localStorage.setItem("user",JSON.stringify(res.data.user))
              this.$message.success("普通用户登陆成功");
              this.$router.push("/map1");
            }
          } else {
            console.log(res);
            this.$message.error("！！用户名或密码错误");
          }
        }
      });
    },
    submitresgister(formname) {
      // console.log(this.registerform)
      this.$refs[formname].validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post("/user/register", {
            username: this.registerform.usernameres,
            password: this.registerform.passwordres,
            phone: this.registerform.phone,
            grade: this.registerform.grade,
          });
          console.log(res);
          if (res.status == 0) {
            this.$message.success("注册成功");
            this.$data.loginstatus = !this.$data.loginstatus;
          } else if (res.status == 10) {
            this.$notify({
              title: "提示",
              message: this.$createElement('i', { style: 'color: teal'}, '注册失败，学号已经存在'),
              duration: 3000,
            });
          } else {
            console.log(res);
            this.$message.error("！！注册失败");
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  width: 100%;
  background-image: url("../assets/bg01.jpg");
  background-size: cover;
  overflow: hidden;
}
.innercon {
  text-align: center;
  margin: auto;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  margin-top: 8%;
}
.avater_box {
  width: 100%;
  text-align: center;
  margin: auto;
  margin-bottom: 12px;
  img {
    width: 340px;
    height: 70px;
  }
}
.login-box {
  width: 400px;
  // height: 260px;
  padding: 20px 40px;
  border: 0;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  // box-shadow: 5px 5px 30px #1b1b1ba6;
}
.login-text {
  width: 100%;
  text-align: center;
  line-height: 85px;
  font-size: 26px;
  color: #ffff;
  font-weight: 600;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.btns {
  // 弹性布局并设置对齐方式
  display: flex;
  justify-content: center;
  margin-top: 25px;
}

.el-button + .el-button {
  margin-left: 60px;
}
</style>
