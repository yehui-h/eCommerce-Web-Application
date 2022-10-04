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

          <div class="pageSwitchingBtn"
              @click="logout()"
              v-if="isLogin === true">
            <img
                class="pageBtnIcon"
                :src="require('../../public/icons/signout.png')"
              />
              <p class="pageBtnText">signout</p>
          </div> 

          <div class="pageSwitchingBtn"
              @click="switchPage('signin')"
              v-if="isLogin === false">
            <img
              class="pageBtnIcon"
              :src="require('../../public/icons/signin.png')"
            />          
            <p class="pageBtnText">signin</p>
          </div>

          <div class="pageSwitchingBtn"
              @click="switchPage('profile')"
              v-if="isLogin === true">
            <img
              class="pageBtnIcon"
              :src="require('../../public/icons/profile.png')"
            />
            <p class="pageBtnText">profile</p>
          </div>

          <div id="pageSwitchingBtn_checkout" class="pageSwitchingBtn"
              @click="switchPage('checkout')">
            <img
              class="pageBtnIcon"
              :src="require('../../public/icons/checkout.png')"
            />
            <p class="pageBtnText">checkout ( {{ totalCartQuantity }} ) </p>
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
import { applySearch } from "../assets/js/mainView.js";
import cookie from "../utils/cookie";


export default {
  data() {
    return {
      page:['checkout','signin','profile','signout'],
      title:['Check Out','Sign In','Profile','Sign Out'],
      searchResult: [],
      isSearchActive: false,
      isItemActive: false,
      isHomeActive: true,
      cart:[],
      totalCartQuantity: 0,

      isLogin: false,
      datastorage: null
    };
  },created(){
    this.checkLogin();
  },

   watch: { 
       '$route.params.newCart': {
          handler: function(newCart) {
            console.log(newCart)
            this.datastorage = newCart
            this.updateSavedCart(this.datastorage);
          },
          deep: true,
          immediate: true
        }
  },

  methods: {
    checkLogin(){
      if (typeof cookie.getToken() != "undefined"){
        this.isLogin = true;
      }
    },
    
    logout(){
      cookie.removeToken();
      this.$router.go(0);
      this.isLogin = false;
    },

    updateSavedCart(data){
       console.log("updateSavedCart");
      this.cart = [];
      this.totalCartQuantity = 0;
      for(var i = 0; i < data.length; i++){
        this.cart.push(data[i])
        this.totalCartQuantity += data[i].num
      }
      console.log(this.cart)
    },

    // function to switch to specific page
    switchPage(msg) {
      var path = "/" + msg;
      if(msg == "checkout"){
        localStorage.setItem("savedCart", JSON.stringify(this.cart))
        this.$router.push({
          name: "checkout",
          params: {cart: this.cart},
        });
      }else{
        this.$router.push(path);
      }
      
    },

    switchSearchState() {
      this.searchResult = applySearch();
      if(this.searchResult != false){
        this.$refs.search.init(this.searchResult);
        this.isSearchActive = true;
        this.isHomeActive = false;
        this.isItemActive = false;
      }
    },

    switchItemState(_id) {
      this.isSearchActive = false;
      this.isHomeActive = false;
      this.isItemActive = true;
      this.$refs.item.passData(_id);
    },

    switchHomeState() {
      this.isSearchActive = false;
      this.isHomeActive = true;
      this.isItemActive = false;

      var searchInput = document.getElementById("searchContent");
      searchInput.value = "";
      this.$refs.home.updateData(); 
    },

    updateCartValue(_id, qty){
        this.totalCartQuantity += qty;
        var added = false;
        for(var i = 0; i < this.cart.length; i++){
          if(this.cart[i]._id == _id){
            this.cart[i].num += qty
            added = true
            break
          }
        }
        if(!added){
            this.cart.push({
              _id: _id,
              num: parseInt(qty),
              stock: null,
              price: null,
              title: null,
            })
          }
        console.log(this.cart)
        this.switchHomeState();

    },
    
  },
};
</script>
