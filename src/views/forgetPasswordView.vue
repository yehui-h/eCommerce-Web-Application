<template>
  <div class="forget">
    <div class="elForget">
      <div class="labelDiv">
        <label id="forgetLabel">Forget Password</label>
      </div>
      <el-container>
        <el-main>
          <el-form
            :model="forgetForm"
            :rules="rules"
            status-icon
            ref="forgetForm"
            label-width="auto"
            label-position="left"
            class="forgetForm"
          >
            <el-form-item label="Email" prop="email" required>
              <el-input
                v-model="forgetForm.email"
                style="width: 240px"
              ></el-input>
            </el-form-item>
            <el-form-item id="clickButton">
              <el-button type="primary" @click="submitForm('forgetForm')"
                >Confirm</el-button
              >
              <el-button @click="cancelForm('forgetForm')">Cancel</el-button>
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
      forgetForm: {
        email: "",
      },
      rules: {},
    };
  },
  methods: {
    // Submit the forgetForm
    submitForm(formName) {
      let self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post("/users/sendResetEmail", {
              email: this.forgetForm.email,
            })
            .then(function (response) {
              console.log(response);
              if (response.data.msg === "success") {
                alert("An email sent");
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
        this.$router.back();
      };
      switchPage();
    },
  },
};
</script>

<style scoped>
div .forget {
  text-align: center;
}

div .elForget {
  max-width: 450px;
  margin: auto;
  margin-top: 100px;
}

div .labelDiv {
  margin-bottom: 30px;
}

#forgetLabel {
  font-size: 30px;
}

#clickButton {
  margin-top: 50px;
  margin-right: 80px;
}
</style>
