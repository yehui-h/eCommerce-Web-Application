<template>
  <div class="mail">
    <div class="elMail">
      <div class="labelDiv">
        <label id="mailLabel">Active Email</label>
      </div>
      <el-container>
        <el-main>
          <el-button id="returnBtn" size="large" @click="activeMail()"
            >Active!</el-button
          >
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  methods: {
    // To active user's mail account
    activeMail() {
      var nowURL = "/users" + window.location.pathname + window.location.search;
      console.log(nowURL);
      axios
        .get(nowURL)
        .then(function (response) {
          console.log(response);
          window.location.href = "http://localhost:8080/signin";
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
div .mail {
  text-align: center;
}

div .elMail {
  max-width: 350px;
  margin: auto;
  margin-top: 100px;
}

#mailLabel {
  font-size: 30px;
}
</style>
