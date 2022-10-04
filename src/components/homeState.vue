<template>
  <div id="phoneLists">

        <div class="homeStateBlock" id="soldOutSoon">
            <p class="pageTitles">Sold Out Soon</p>
          <div v-for="item in soldOutSoon"
                    :key="item._id"
                    class="homeSinglePhone"
                    @click="toItemState(item._id)">
                    <img class="homePhoneThumbnail" :src="require('../../public/images/'+item.brand+'.jpeg')">
                    <div class="rightWrap">
                        <p class="homePhoneTitle">{{ item.title }}</p>
                        <p class="homePhoneRating">Price: ${{ item.price }}</p>
                    </div>

            </div>
        </div>

        <div class="homeStateBlock" id="bestSellers">
            <p class="pageTitles">Best Sellers</p>
                <div v-for="item in bestSellers"
                    :key="item._id"
                    class="homeSinglePhone"
                    @click="toItemState(item._id)">
                    <img class="homePhoneThumbnail" :src="require('../../public/images/'+item.brand+'.jpeg')">
                    <div class="rightWrap">
                        <p class="homePhoneTitle">{{ item.title }}</p>
                        <p class="homePhoneRating">Rating: {{ item.averageRating }} ({{ item.ratingNum }})</p>
                    </div>

                </div>
        </div>
    </div>
  
</template>

<script>
import "../assets/css/mainView.css";
import { getNewHomeList } from "../assets/js/mainView.js";
import { readImportedData } from "../assets/js/mainView.js";

export default {
  data() {
    return {
        bestSellers: null,
        soldOutSoon: null,
        phoneDataRaw: null,
        userDataRaw: null,
        phoneList: null,
    };
  },
  mounted(){
    this.updateData()
  },
  methods: {
    updateData(){
      let self = this;
      // import phone list
      this.$axios
        .post("/servers/userPage/loadAllComment", {})
        .then(function (response) {
          console.log(response);
          if (response.data.msg === "success") {
            console.log("load success");
            self.phoneDataRaw = response.data.data;
          } else if (response.data.msg === "fail") {
            alert(response.data.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });

      // import user list
      this.$axios
        .post("/servers/userPage/loadAllUser", {})
        .then(function (response) {
          console.log(response);
          if (response.data.msg === "success") {
            console.log("load success");
            self.userDataRaw = response.data.data;
            readImportedData(0, self.userDataRaw);
            self.phoneList = readImportedData(1, self.phoneDataRaw);
            console.log(self.phoneList)

            // update the displaying soldoutsoon and bestsellers lists
            self.updateLists(self.phoneList)
          } else if (response.data.msg === "fail") {
            alert(response.data.data);
          }
        })
        .catch(function (error) {
          console.log(error);
      });
    },

        initData(data){
          this.phoneList = data.phoneList;
          this.updateLists(data);
        },
        toItemState(_id) {
          this.$emit('callItem', _id);
        },
        updateLists(data){
          // update the displaying lists
          this.bestSellers= getNewHomeList(data, 1);
          this.soldOutSoon= getNewHomeList(data, 0);
        }
  },
};
</script>