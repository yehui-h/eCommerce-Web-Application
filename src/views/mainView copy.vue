<template>
  <el-container>
    <div id="header">
      <div class="headerBlock" id="logo" @click="switchHomeState">
        <h2>SellPhone</h2>
      </div>

      <div class="headerBlock" id="searchBar">
        <input
          type="text"
          placeholder="Search Phone Title..."
          name="search"
          id="searchContent"
        />
        <button id="submitSearch" @click="switchSearchState">Search</button>
      </div>

      <div class="headerBlock" id="pageBtnsWrap">
        <div
          v-for="item in page"
          :key="item"
          :id="item"
          class="pageSwitchingBtn"
          @click="switchPage(item)"
        >
          <img
            class="pageBtnIcon"
            :src="require('../../public/icons/' + item + '.png')"
          />
          <p class="pageBtnText" v-if="item == 'checkout'">{{ item }}({{ totalCartQuantity }})</p>
          <p class="pageBtnText" v-else>{{ item }}</p>
        </div>
      </div>
    </div>
    <el-main>
      <homeState
        ref="home"
        id="home"
        v-bind:class="{ active: isHomeActive }"
        v-show="isHomeActive"
        @callItem="switchItemState"
      />

      <searchState
        ref="search"
        id="search"
        v-bind:class="{ active: isSearchActive }"
        v-show="isSearchActive"
        @backHome="switchHomeState"
        @callItem="switchItemState"
      />

      <itemState
        ref="item"
        id="item"
        @backHome="switchHomeState"
        @cartUpdate="updateCartValue"
        v-show="isItemActive"
        v-bind:class="{ active: isItemActive }"
      />
    </el-main>
  </el-container>
</template>

<script>
import "../assets/css/mainView.css";
import { searchPhoneTitle } from "../assets/js/mainView.js";
import { cartUpdate } from "../assets/js/mainView.js";
import { getCart } from "../assets/js/mainView.js";
import { importData } from "../assets/js/mainView.js";
//import cookie from "../utils/cookie";

export default {
  data() {
    return {
      page:['checkout','signin','profile','signout'],
      title:['Check Out','Sign In','Profile','Sign Out'],
      searchResult: [],
      isSearchActive: false,
      isItemActive: false,
      isHomeActive: true,
      cart :[],
      totalCartQuantity: 0,
      importedData:{
        phone:null,
        user:null,
      },
      phoneData: null,
      phoneList: null,
    };
  },
  mounted(){
    let self = this;
    this.$axios
      .post("/servers/userPage/loadAllComment", {})
      .then(function (response) {
        console.log(response);
        if (response.data.msg === "success") {
          console.log("load success");
          self.importedData.phone = response.data.data;
        } else if (response.data.msg === "fail") {
          alert(response.data.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    this.$axios
      .post("/servers/userPage/loadAllUser", {})
      .then(function (response) {
        console.log(response);
        if (response.data.msg === "success") {
          console.log("load success");
          self.importedData.user = response.data.data;
          self.phoneData = importData(self.importedData);
          self.$refs.home.initData(self.phoneData.phoneList);
          self.phoneList = self.phoneData.phoneList;
        } else if (response.data.msg === "fail") {
          alert(response.data.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });  
  },

  methods: {

    switchPage(msg) {
      var path = "/" + msg;
      if(msg == "checkout"){
        var cartList = [];
        for(var i = 0; i < this.cart.length; i++){
            if(this.cart[i] != 0){
              var cartItem = {
                _id: this.phoneList._id[i],
                title: this.phoneList.title[i],
                price: this.phoneList.price[i],
                num: this.cart[i],
              }
              cartList.push(cartItem)
            }
        }
        console.log(cartList)
        this.$router.push({
          name: "checkout",
          params: {cart: cartList},
        });
      }else{
        this.$router.push(path);
      }
      
    },

    toSearchState(msg) {
      this.$refs.search.constComponents(msg);
    },
    toItemState(params) {
      this.$refs.item.passData(params);
    },
    switchSearchState() {
      this.isSearchActive = true;
      this.isHomeActive = false;
      this.isItemActive = false;
      this.searchResult = searchPhoneTitle();
      this.$refs.search.constComponents(this.phoneData, this.searchResult);
    },

    switchItemState(idx) {
      this.isSearchActive = false;
      this.isHomeActive = false;
      this.isItemActive = true;
      this.$refs.item.passData({data: this.phoneData,
                                index: idx});
    },

    switchHomeState(update) {
      this.isSearchActive = false;
      this.isHomeActive = true;
      this.isItemActive = false;

      var searchInput = document.getElementById("searchContent");
      searchInput.value = "";
      this.$refs.home.updateLists(update); 
    },
    updateCartValue(index, qty){
      var updateResult = cartUpdate(index, qty);
      if(!updateResult){
        alert("update cart failed!");
      }else{
        // update cart quantity
        this.totalCartQuantity += qty;
        this.switchHomeState(false);// should be changed to true only upon checkout; currently set to true gor debugging

        this.cart = getCart();
      }
      
    },
    
  },
};
</script>
