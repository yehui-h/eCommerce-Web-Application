<template>
  <div class="signup">
    <div class="elSign">
      <div class="labelDiv">
        <label id="signupLabel">Sign up</label>
      </div>
      <el-container>
        <el-main>
          <el-form
            :model="signupForm"
            :rules="rules"
            status-icon
            ref="signupForm"
            label-width="auto"
            label-position="right"
            class="signupForm"
          >
            <el-form-item label="Firstname" prop="firstname" required>
              <el-input
                v-model="signupForm.firstname"
                style="width: 240px"
              ></el-input>
            </el-form-item>
            <el-form-item label="Lastname" prop="lastname" required>
              <el-input
                v-model="signupForm.lastname"
                style="width: 240px"
              ></el-input>
            </el-form-item>
            <el-form-item label="Email" prop="email" required>
              <el-input
                v-model="signupForm.email"
                style="width: 240px"
              ></el-input>
            </el-form-item>
            <el-form-item label="Password" prop="password" required>
              <el-input
                type="password"
                v-model="signupForm.password"
                style="width: 240px"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="Password Confirm"
              prop="passwordConfirm"
              required
            >
              <el-input
                type="password"
                v-model="signupForm.passwordConfirm"
                style="width: 240px"
              ></el-input>
            </el-form-item>
            <el-form-item id="clickButton">
              <el-button type="primary" @click="submitForm('signupForm')"
                >Confirm</el-button
              >
              <el-button @click="cancelForm('signupForm')">Cancel</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    // To check validation of input email
    var checkEmail = (rule, value, callback) => {
      var emailRegExp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      var isEmail = emailRegExp.test(value);
      if (!value) {
        callback(new Error("email is required"));
      } else if (!isEmail) {
        callback(new Error("email is not valid"));
      } else {
        callback();
      }
    };

    return {
      signupForm: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        passwordConfirm: "",
      },
      rules: {
        email: [{ validator: checkEmail, trigger: "blur" }],
      },
    };
  },
  methods: {
    // Submit signupForm
    submitForm(formName) {
      let self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post("/users/signup", {
              firstname: this.signupForm.firstname,
              lastname: this.signupForm.lastname,
              email: this.signupForm.email,
              password: this.signupForm.password,
              checkpassword: this.signupForm.passwordConfirm,
            })
            .then(function (response) {
              console.log(response);
              if (response.data.msg === "success") {
                alert("Submitted!");
                self.$router.push({ name: "signin" });
              } else if (response.data.msg === "fail") {
                alert(response.data.data);
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        } else {
          console.log("error submit!");
          return false;
        }
      });
    },

    // Cancel submission
    cancelForm() {
      var switchPage = () => {
        this.$router.back();
      };
      switchPage();
    },
  },
};
</script>

<style scoped>
div .signup {
  text-align: center;
}

div .elSign {
  max-width: 500px;
  margin: auto;
  margin-top: 100px;
}

#signupLabel {
  font-size: 30px;
}

#clickButton {
  margin-top: 50px;
  margin-right: 130px;
}
</style>
