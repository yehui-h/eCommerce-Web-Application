<template>
  <div class="userPage">
    <div class="elUser">
      <el-container>
        <el-main>
          <div class="mainContent">
            <div class="userlabelDiv">
              <label id="userLabel">User profile</label>
            </div>
            <div class="btnDiv">
              <div align="left" style="float: left">
                <el-button id="returnBtn" size="small" @click="returntoMain()"
                  >Return</el-button
                >
              </div>
              <div align="right">
                <el-button id="signoutBtn" size="small" @click="signout()"
                  >Sign-out</el-button
                >
              </div>
            </div>

            <el-tabs :tab-position="tabPosition" style="">
              <el-tab-pane label="Edit profile">
                <div><label>Edit profile</label></div>
                <el-form
                  :model="editProfileForm"
                  :rules="rules"
                  status-icon
                  ref="editProfileForm"
                  label-width="auto"
                  label-position="right"
                  class="editProfileForm"
                  style="margin-top: 20px"
                >
                  <el-form-item label="Firstname" prop="firstname" required>
                    <el-input
                      v-model="editProfileForm.firstname"
                      style="width: 240px"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="Lastname" prop="lastname" required>
                    <el-input
                      v-model="editProfileForm.lastname"
                      style="width: 240px"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="Email" prop="email" required>
                    <el-input
                      v-model="editProfileForm.email"
                      style="width: 240px"
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      type="primary"
                      @click="submitProfileForm('editProfileForm')"
                      >Update profile</el-button
                    >
                  </el-form-item>
                </el-form>
              </el-tab-pane>

              <el-tab-pane label="Change password">
                <div><label>Change password</label></div>
                <el-form
                  :model="changePasswordForm"
                  :rules="rules"
                  status-icon
                  ref="changePasswordForm"
                  label-width="140px"
                  label-position="left"
                  class="changePasswordForm"
                  style="margin-top: 20px"
                >
                  <el-form-item
                    label="Current password"
                    prop="currentPassword"
                    required
                  >
                    <el-input
                      type="password"
                      v-model="changePasswordForm.currentPassword"
                      style="width: 240px"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="New password"
                    prop="newPassword"
                    required
                  >
                    <el-input
                      type="password"
                      v-model="changePasswordForm.newPassword"
                      style="width: 240px"
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      type="primary"
                      @click="submitPasswordForm('changePasswordForm')"
                      >Confirm</el-button
                    >
                  </el-form-item>
                </el-form>
              </el-tab-pane>

              <el-tab-pane label="Manage listings">
                <div><label>Manage listings</label></div>
                <div id="addListBtnDiv">
                  <el-button @click="addList" size="small">Add</el-button>
                </div>

                <el-form
                  v-if="showaddForm === true"
                  :model="addListForm"
                  :rules="rules"
                  status-icon
                  ref="addListForm"
                  label-width="auto"
                  label-position="right"
                  class="addListForm"
                  size="medium"
                >
                  <el-form-item label="Title" prop="title" required>
                    <el-input
                      v-model="addListForm.title"
                      style="width: 240px"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="Brand" prop="brand" required>
                    <el-input
                      v-model="addListForm.brand"
                      style="width: 240px"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="Image" prop="image" required>
                    <el-input
                      v-model="addListForm.image"
                      style="width: 240px"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="Stock" prop="stock" required>
                    <el-input
                      v-model="addListForm.stock"
                      style="width: 240px"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="Price" prop="price" required>
                    <el-input
                      v-model="addListForm.price"
                      style="width: 240px"
                    ></el-input>
                  </el-form-item>
                  <el-form-item id="clickButton">
                    <el-button
                      type="primary"
                      @click="submitAddForm('addListForm')"
                      >Save</el-button
                    >
                    <el-button @click="cancelAddForm('addListForm')"
                      >Cancel</el-button
                    >
                  </el-form-item>
                  <el-form-item id="signupButton"> </el-form-item>
                </el-form>

                <el-table
                  :data="manageListingsData"
                  style="width: 100%; margin-top: 20px"
                  row-key="_id"
                >
                  <template slot="empty">
                    <div>
                      <span>There is no phone to list</span>
                    </div>
                  </template>
                  <el-table-column prop="title" label="Title" min-width="250px">
                    <template slot-scope="scope">
                      <template v-if="scope.row.editing">
                        <el-input
                          class="edit-input"
                          v-model="scope.row.title"
                          placeholder="Title"
                        ></el-input>
                      </template>
                      <span v-else>{{ scope.row.title }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column prop="brand" label="Brand">
                    <template slot-scope="scope">
                      <template v-if="scope.row.editing">
                        <el-input
                          class="edit-input"
                          v-model="scope.row.brand"
                          placeholder="Brand"
                        ></el-input>
                      </template>
                      <span v-else>{{ scope.row.brand }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column prop="image" label="Image">
                    <template slot-scope="scope">
                      <template v-if="scope.row.editing">
                        <el-input
                          class="edit-input"
                          v-model="scope.row.image"
                          placeholder="Image"
                        ></el-input>
                      </template>
                      <span v-else>{{ scope.row.image }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column prop="stock" label="Stock">
                    <template slot-scope="scope">
                      <template v-if="scope.row.editing">
                        <el-input
                          class="edit-input"
                          v-model="scope.row.stock"
                          placeholder="Stock"
                        ></el-input>
                      </template>
                      <span v-else>{{ scope.row.stock }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column prop="price" label="Price">
                    <template slot-scope="scope">
                      <template v-if="scope.row.editing">
                        <el-input
                          class="edit-input"
                          v-model="scope.row.price"
                          placeholder="Price"
                        ></el-input>
                      </template>
                      <span v-else>{{ scope.row.price }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="disabled"
                    label="Control"
                    min-width="150px"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-button
                        v-if="scope.row.disabled == ''"
                        v-model="scope.$index"
                        type="info"
                        size="small"
                        @click="handleEnable(scope.$index, scope.row)"
                        >Disabled
                      </el-button>
                      <el-button
                        v-else
                        v-model="scope.$index"
                        type="success"
                        size="small"
                        @click="handleDisable(scope.$index, scope.row)"
                        >Enabled
                      </el-button>
                      <el-button
                        type="danger"
                        icon="el-icon-delete"
                        v-model="scope.$index"
                        size="small"
                        @click="handleRemove(scope.$index, scope.row)"
                        >Remove
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>

              <el-tab-pane label="View comments"
                >View comments
                <el-table
                  :data="commentData"
                  style="width: 100%; margin-top: 20px"
                  :span-method="arraySpanMethod"
                  row-key="_id"
                  border
                >
                  <template slot="empty">
                    <div>
                      <span>This phone listing has no comment</span>
                    </div>
                  </template>
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <el-table
                        class="table-in-table"
                        :data="props.row.reviews"
                        style="width: 92%; margin: auto"
                        row-key="_id"
                        border
                      >
                        <template slot="empty">
                          <div>
                            <span>This phone listing has no comment</span>
                          </div>
                        </template>
                        <el-table-column
                          prop="comment"
                          label="Comment"
                        ></el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="title"
                    label="Phone Listing"
                  ></el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import cookie from "../utils/cookie";
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

    // To check validation of input stock
    var checkStock = (rule, value, callback) => {
      var intRegExp = /^\+?[1-9][0-9]*$/;
      var isInt = intRegExp.test(value);
      if (!value) {
        callback(new Error("stock is required"));
      } else if (!isInt) {
        callback(new Error("stock must be a positive integer"));
      } else {
        callback();
      }
    };

    // To check validation of input price
    var checkPrice = (rule, value, callback) => {
      var numRegExp = /^[0-9]+(.[0-9]{2})?$/;
      var isNum = numRegExp.test(value);
      if (!value) {
        callback(new Error("price is required"));
      } else if (!isNum) {
        callback(
          new Error("price must be a positive number with two decimal places")
        );
      } else {
        callback();
      }
    };

    return {
      oldEmail: "",
      tabPosition: "top",
      rules: {
        email: [{ validator: checkEmail, trigger: "blur" }],
        stock: [{ validator: checkStock, trigger: "blur" }],
        price: [{ validator: checkPrice, trigger: "blur" }],
      },

      editProfileForm: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
      },
      changePasswordForm: {
        currentPassword: "",
        newPassword: "",
      },
      showaddForm: false,
      addListForm: {
        title: "",
        brand: "",
        image: "",
        stock: "",
        seller: "",
        price: "",
        disabled: "",
      },

      manageListingsData: [],

      commentData: [],
    };
  },
  created() {
    this.loadProfile();
    this.loadPhones();
    this.loadComments();
  },
  methods: {
    // Load profile panel
    loadProfile() {
      let self = this;
      this.$axios
        .post("/servers/userPage/getUserInfo", {
          id: cookie.getToken(),
        })
        .then(function (response) {
          console.log(response);
          if (response.data.msg === "success") {
            self.editProfileForm.firstname = response.data.data[0].firstname;
            self.editProfileForm.lastname = response.data.data[0].lastname;
            self.editProfileForm.email = response.data.data[0].email;
            self.oldEmail = response.data.data[0].email;
            console.log("load profile success");
          } else if (response.data.msg === "fail") {
            alert(response.data.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // Load manageList panel
    loadPhones() {
      let self = this;
      this.$axios
        .post("/servers/userPage/loadManageList", {
          seller: cookie.getToken(),
        })
        .then(function (response) {
          console.log(response);
          if (response.data.msg === "success") {
            self.manageListingsData = response.data.data;
            console.log("load phone success");
          } else if (response.data.msg === "fail") {
            alert(response.data.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // Load comments panel
    loadComments() {
      let self = this;
      this.$axios
        .post("/servers/userPage/loadAllComment", {})
        .then(function (response) {
          console.log(response);
          if (response.data.msg === "success") {
            self.commentData = response.data.data;
            console.log("load commentData success");
          } else if (response.data.msg === "fail") {
            alert(response.data.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // Submit profileForm
    submitProfileForm(formName) {
      let self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var password = prompt("Please enter your password");
          if (password != null) {
            this.$axios
              .post("/servers/userPage/updateUserInfo", {
                id: cookie.getToken(),
                firstname: this.editProfileForm.firstname,
                lastname: this.editProfileForm.lastname,
                email: this.editProfileForm.email,
                password: password,
              })
              .then(function (response) {
                console.log(response);
                if (response.data.msg === "success") {
                  console.log("submit success");
                  if (self.editProfileForm.email != self.oldEmail) {
                    alert("An email has sent to your new email address.");
                    cookie.removeToken();
                    self.$router.push({ name: "signin" });
                  } else {
                    alert("Submit success!");
                  }
                } else if (response.data.msg === "fail") {
                  alert(response.data.data);
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // Submit passwordForm
    submitPasswordForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var confirmChange = confirm("Are you sure to change the password?");
          if (confirmChange) {
            this.$axios
              .post("/servers/userPage/changePassword", {
                id: cookie.getToken(),
                oldPassword: this.changePasswordForm.currentPassword,
                newPassword: this.changePasswordForm.newPassword,
              })
              .then(function (response) {
                console.log(response);
                if (response.data.msg === "success") {
                  console.log("submit success");
                  alert("Submit!");
                } else if (response.data.msg === "fail") {
                  alert(response.data.data);
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // Show add comment form
    addList() {
      this.showaddForm = true;
    },

    // Submit add comment form
    submitAddForm(formName) {
      let self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post("/servers/userPage/addManageList", {
              title: this.addListForm.title,
              brand: this.addListForm.brand,
              image: this.addListForm.image,
              stock: this.addListForm.stock,
              seller: cookie.getToken(),
              price: this.addListForm.price,
            })
            .then(function (response) {
              console.log(response);
              if (response.data.msg === "success") {
                console.log("submit success");
                alert("submit!");
                self.$refs[formName].resetFields();
                self.showaddForm = false;
                self.loadPhones();
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
      this.loadPhones();
    },

    // Cancel add comment submission
    cancelAddForm(formName) {
      this.$refs[formName].resetFields();
      this.showaddForm = false;
      this.loadPhones();
    },

    // Disable items
    handleDisable(index, row) {
      var obj = (index, row);
      this.$axios
        .post("/servers/userPage/disableManageList", {
          id: obj._id,
        })
        .then(function (response) {
          console.log(response);
          if (response.data.msg === "success") {
            console.log("disable success");
          } else if (response.data.msg === "fail") {
            alert(response.data.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      this.loadPhones();
    },

    // Enable items
    handleEnable(index, row) {
      var obj = (index, row);
      this.$axios
        .post("/servers/userPage/enableManageList", {
          id: obj._id,
        })
        .then(function (response) {
          console.log(response);
          if (response.data.msg === "success") {
            console.log("disable success");
          } else if (response.data.msg === "fail") {
            alert(response.data.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      this.loadPhones();
    },

    // Remove items
    handleRemove(index, row) {
      const answer = window.confirm("Confirm to remove?");
      if (answer) {
        var obj = (index, row);
        this.$axios
          .post("/servers/userPage/removeManageList", {
            id: obj._id,
          })
          .then(function (response) {
            console.log(response);
            if (response.data.msg === "success") {
              console.log("disable success");
            } else if (response.data.msg === "fail") {
              alert(response.data.data);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
        this.loadPhones();
      }
    },

    // Expand array
    arraySpanMethod({ row, columnIndex }) {
      if (!row.reviews) {
        if (columnIndex === 0) {
          return [0, 0];
        } else if (columnIndex === 1) {
          return [1, 2];
        }
      }
    },

    // Go to mainpage
    returntoMain() {
      // this.$router.push("/main");
      this.$router.back();
    },

    // User signout and go to mainpage
    signout() {
      var switchPage = () => {
        this.$router.back();
      };

      var beforeRouteLeave = (to, from, next) => {
        const answer = window.confirm("Do you really want to sign out?");
        if (answer) {
          cookie.removeToken();
          switchPage();
          next();
        } else {
          next(false);
        }
      };
      beforeRouteLeave();
    },
  },
};
</script>

<style scoped>
div .userPage {
  text-align: center;
  margin: auto;
  margin-bottom: 50px;
}

div .elUser {
  max-width: 1200px;
  margin: auto;
}

div .userlabelDiv {
  text-align: center;
}

label#userLabel {
  font-size: 30px;
}

div .btnDiv {
  margin-top: 10px;
  margin-right: 30px;
  margin-bottom: 30px;
}

#addListBtnDiv {
  text-align: left;
  margin-top: 10px;
}
</style>
