<template>
  <div class="reset">
    <div class="elReset">
      <div class="labelDiv">
        <label id="resetLabel">Reset Password</label>
      </div>
      <el-container>
        <el-main>
          <el-form
            :model="resetForm"
            :rules="rules"
            status-icon
            ref="resetForm"
            label-width="auto"
            label-position="left"
            class="resetForm"
          >
            <el-form-item label="Password" prop="password" required>
              <el-input
                type="password"
                v-model="resetForm.password"
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
                v-model="resetForm.passwordConfirm"
                style="width: 240px"
              ></el-input>
            </el-form-item>
            <el-form-item id="clickButton">
              <el-button type="primary" @click="submitForm('resetForm')"
                >Confirm</el-button
              >
              <el-button @click="cancelForm('resetForm')">Cancel</el-button>
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
    return {
      resetForm: {
        password: "",
        passwordConfirm: "",
        resetCode: "",
        id: "",
      },
      rules: {},
    };
  },
  created() {
    this.loadQuery();
  },

  methods: {
    // Load user information from url
    loadQuery() {
      (this.resetForm.resetCode = this.$route.query.code),
        (this.resetForm.id = this.$route.query.id);
    },

    // Submit reset form
    submitForm(formName) {
      let self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post("/users/resetPassword", {
              password1: this.resetForm.password,
              password2: this.resetForm.passwordConfirm,
              resetCode: this.resetForm.resetCode,
              id: this.resetForm.id,
            })
            .then(function (response) {
              console.log(response);
              if (response.data.msg === "success") {
                alert("Reset success!");
                self.$router.push({ name: "signin" });
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
  },
};
</script>

<style scoped>
div .reset {
  text-align: center;
}

div .elReset {
  max-width: 500px;
  margin: auto;
  margin-top: 100px;
}

div .labelDiv {
  margin-bottom: 30px;
}

#resetLabel {
  font-size: 30px;
}

#clickButton {
  margin-top: 50px;
  margin-right: 130px;
}
</style>
