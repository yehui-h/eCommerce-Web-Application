<template>
  <div class="signin">
    <div class="elSign">
      <div class="labelDiv">
        <label id="signinLabel">Sign in</label>
      </div>
      <div id="signupButton">
        <el-button @click="goSignup()">Sign up?</el-button>
      </div>
      <el-container>
        <el-main>
          <el-form
            :model="signinForm"
            :rules="rules"
            status-icon
            ref="signinForm"
            label-width="auto"
            label-position="right"
            class="signinForm"
          >
            <el-form-item label="Email" prop="email" required>
              <el-input
                v-model="signinForm.email"
                style="width: 240px"
              ></el-input>
            </el-form-item>
            <el-form-item label="Password" prop="password" required>
              <el-input
                type="password"
                v-model="signinForm.password"
                style="width: 240px"
              ></el-input>
            </el-form-item>
            <el-form-item id="forgetButton">
              <el-button @click="goReset()" size="small"
                >Forget password?</el-button
              >
            </el-form-item>
            <el-form-item id="clickButton">
              <el-button type="primary" @click="submitForm('signinForm')"
                >Confirm</el-button
              >
              <el-button @click="cancelForm('signinForm')">Cancel</el-button>
            </el-form-item>
            <el-form-item id="signupButton"> </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import cookie from "../utils/cookie";

export default {
  data() {
    return {
      signinForm: {
        email: "",
        password: "",
      },
      rules: {},
    };
  },
  methods: {
    // Submit signinForm
    submitForm(formName) {
      let self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post("/users/login", {
              email: this.signinForm.email,
              password: this.signinForm.password,
            })
            .then(function (response) {
              console.log(response);
              if (response.data.msg === "success") {
                alert("Login success!");
                cookie.setToken(response.data.id);
                self.$router.push({ name: "main" });
              } else if (response.data.msg === "fail") {
                alert(response.data.data);
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // Cancel submission
    cancelForm() {
      var switchPage = () => {
        this.$router.push("/main");
      };
      switchPage();
    },

    // Go signup page
    goSignup() {
      this.$router.push("/signup");
    },

    // Go forgetpassword page
    goReset() {
      this.$router.push("/forgetpassword");
    },
  },
};
</script>

<style scoped>
div .signin {
  text-align: center;
}

div .elSign {
  max-width: 500px;
  margin: auto;
  margin-top: 100px;
}

div .labelDiv {
  margin-bottom: 30px;
}

#signinLabel {
  font-size: 30px;
}

#forgetButton {
  margin-right: 80px;
}

#clickButton {
  margin-top: 50px;
  margin-right: 80px;
}

#signupButton {
  margin-top: 30px;
}
</style>
