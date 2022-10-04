<template>
  <div class="checkout">
    <div class="checkoutlabelDiv">
      <label id="checkoutLabel">Checkout Page</label>
    </div>
    <el-button id="checkoutBack" @click="getback()">Back</el-button>
    <el-table
      show-summary
      class="table"
      ref="checkoutTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      :summary-method="getSummaries"
      @selection-change="handleSelectionChange"
    >
      <template slot="empty">
        <div>
          <span>Nothing in the shopping cart</span>
        </div>
      </template>
      <el-table-column type="selection" width="70px"> </el-table-column>
      <el-table-column
        prop="title"
        label="Title"
        min-width="27%"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column prop="price" label="Unit price" min-width="12%">
        <template slot-scope="scope">
          {{ scope.row.price.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="num" label="Quantity" min-width="12%">
        <template slot-scope="scope">
          <el-input-number
            size="mini"
            v-model="scope.row.num"
            :min="1"
            :max="scope.row.stock"
            label="Description"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="Price" min-width="12%">
        <template slot-scope="scope">
          {{ (scope.row.price * scope.row.num).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="Operation" min-width="12%">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            class="deleteBtn"
            icon="el-icon-delete"
            @click="removefollowupForm(scope.$index, tableData)"
            >Remove</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div id="btn">
      <button
        @click="checkoutBtn()"
        type="button"
        class="el-button el-button--default el-button--mini cart-btn"
        style="
          color: #fff;
          background: #f56c6c;
          width: 120px;
          height: 50px;
          font-size: 20px;
          margin-right: 0px;
        "
      >
        <span>Checkout !</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selNum: 0,
      totalPrice: 0,
      tableData: [],
      buyList: [],
    };
  },
  created() {
    this.tableData = this.$route.params.cart;
    this.loadStockLimit();
  },

  methods: {
    // Load stock, price, title
    loadStockLimit() {
      this.tableData.forEach((element) => {
        this.$axios
          .post("/servers/userPage/getPhoneListById", {
            id: element._id,
          })
          .then(function (response) {
            console.log(response);
            if (response.data.msg === "success") {
              element.stock = response.data.data.stock;
              element.price = response.data.data.price;
              element.title = response.data.data.title;
              console.log("load stock success");
            } else if (response.data.msg === "fail") {
              alert(response.data.data);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      });
    },

    // Remove rows
    removefollowupForm(index, rows) {
      rows.splice(index, 1);
    },

    // Checkout function
    checkoutBtn() {
      this.buyList = "";
      this.buyList = this.tableData.filter((item) => item.selected === 1);
      if (this.buyList.length === 0) {
        alert("Please select items to checkout !");
      } else {
        this.buyList.forEach((element) => {
          this.tableData.splice(
            this.tableData.findIndex((item) => item._id === element._id),
            1
          );
        });
        this.$axios
          .post("/servers/checkOut", {
            data: JSON.stringify(this.buyList),
          })
          .then(function (response) {
            console.log(response);
            if (response.data.msg === "success") {
              console.log("checkout success");
              alert("Checkout Success !");
            } else if (response.data.msg === "fail") {
              alert(response.data.data);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },

    // Selection change method
    handleSelectionChange(val) {
      var ids = [];
      this.selNum = val.length;
      for (var index in val) {
        ids.push(val[index]._id);
      }
      for (var i in this.tableData) {
        if (ids.indexOf(this.tableData[i]._id) != -1) {
          this.tableData[i].selected = 1;
        } else {
          this.tableData[i].selected = 0;
        }
      }
    },

    // Get total price
    getSummaries(param) {
      const { columns } = param;
      const sums = [];
      if (columns.length > 0) {
        this.totalPrice = this.tableData
          .filter((item) => item.selected === 1)
          .map((row) => row.num * row.price)
          .reduce((total, num) => total + num, 0)
          .toFixed(2);
      } else {
        this.totalPrice = 0;
      }
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "Total";
          return;
        }
        if (index === 3) {
          sums[index] = this.selNum + " items selected";
        }
        if (index === 4) {
          sums[index] = "$ " + this.totalPrice;
          return;
        }
      });
      return sums;
    },

    // Back to mainpage
    getback() {
      var switchPage = () => {
        this.$router.push({
          name: "main",
          params: { newCart: this.tableData },
        });
      };
      switchPage();
    },
  },

  // Set mainpage alive
  // beforeRouteLeave(to, from, next) {
  //   if (to.path == "/main") {
  //     to.meta.keepAlive = true;
  //   } else {
  //     to.meta.keepAlive = false;
  //   }
  //   next();
  // },
};
</script>

<style scoped>
div .checkout {
  text-align: left;
}

div .checkoutlabelDiv {
  margin-top: 3em;
  margin-bottom: 1em;
  text-align: center;
}

label#checkoutLabel {
  font-size: 30px;
}

button#checkoutBack {
  margin-left: 1em;
  margin-bottom: 1em;
}

div#btn {
  margin-top: 30px;
  text-align: center;
}
</style>
