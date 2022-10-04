<template id="main_addToCart">
  <div id="disablingLayer">
    <div id="addPhoneToChart">
      <p class="pageTitles lessMargin">Adding item to shopping cart</p>
      <p class="phoneDetails_phoneBrandStyler" id="phoneDetails_cartPhoneBrand">
        {{ phoneDetail.brand }}
      </p>
      <p class="phoneDetails_phoneTitle narrow">{{ phoneDetail.title }}</p>
      <div class="verticalBlock" id="addingItemWrapping">
        <div class="horizontalBlockAddToCart" id="shoppingCartPhoneImg">
          <img
            id="phoneDetails_addingPhoneThumbnail"
            :src="require('../../public/images/' + phoneDetail.brand + '.jpeg')"
          />
        </div>
        <div class="horizontalBlockAddToCart" id="shoppingCartPhoneInfo">
          <p id="phoneDetails_cartPrice">
            Single Price: ${{ phoneDetail.price }}
          </p>
          <p>
            Qty:
            <input
              type="number"
              id="addingPhoneCount"
              :min="minNum"
              :max="maxNum"
              required
              @change="updateSubtotal"
              @keyup="updateSubtotal"
              value="0"
            />
            ({{ phoneDetail.stock }} available)
          </p>
          <b
            ><p id="phoneDetails_addingPhoneSubtotal">{{ subtotal }}</p></b
          >
        </div>
      </div>

      <div class="verticalBlock" id="addingShoppingCartBtnWrap">
        <button
          type="button"
          class="addingShoppingCartBtn"
          id="confirmAdding"
          @click="passItemToCheckout"
        >
          Add To Cart
        </button>
        <button type="button" 
                class="addingShoppingCartBtn" 
                id="cancelAdding"
                @click="toDescription">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      phoneDetail: null,
      minNum: 0,
      maxNum: -1,
      subtotal: "Subtotal: $0",
    };
  },
  methods: {
    init(_id){
        // get specific phone details
        this.getPhoneById(_id)
        var quantity = document.getElementById("addingPhoneCount");
        quantity.value = 0;
    },
    getPhoneById(_id){
      let self = this
      console.log(_id)
      this.$axios
      .post("/servers/userPage/getPhoneListById", {
          id: _id
      })
      .then(function (response) {
          if (response.data.msg === "success") {
          console.log("load success");
          // console.log(response.data.data)
          self.phoneDetail = response.data.data;
          self.maxNum = self.phoneDetail.stock; // set a new value;
          } else if (response.data.msg === "fail") {
              alert(response.data.msg);
          }
      })
      .catch(function (error) {
          console.log(error);
      });
  },
    updateSubtotal() {
      var countInput = document.getElementById("addingPhoneCount");
      if (countInput.value < 0 || !/^\d+$/.test(countInput.value) || countInput.value > this.maxNum) {
        if (!countInput.classList.contains("invalidNumberAlert")) {
          countInput.classList.toggle("invalidNumberAlert");
        }
        this.subtotal = "Please enter integer quantity that is larger than 0";
      } else {
        if (countInput.classList.contains("invalidNumberAlert")) {
          countInput.classList.toggle("invalidNumberAlert");
        }
        this.subtotal =
          "Subtotal: $" +
          this.phoneDetail.price * parseInt(countInput.value).toFixed(2);
      }
    },
    passItemToCheckout() {
      //let self = this;
      var quantity = document.getElementById("addingPhoneCount").value;
      if (
        quantity < 0 ||
        !/^\d+$/.test(quantity) ||
        quantity > this.phoneDetail.stock
      ) {
        // alert user and prevent from proceeding
      } else {
        // proceed to checkout
        quantity = parseInt(quantity);
        this.$emit("cartUpdate", this.phoneDetail._id, quantity)
      }
    },
    toDescription(){
      this.$emit("toDescription")
    }
  },
};
</script>
