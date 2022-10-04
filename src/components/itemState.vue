<template id="main_itemState">
    <div id="singlePhoneBlock">
        <div class="searchPhoneBlockHeader itemstate">
            <p class="searchStateText backBtn" id="backPrev" @click="backHome"> &lt; Back Home</p>
        </div>

        <div class="phoneDetails_main">
            <itemDescription
                ref="description"
                id="description"
                v-bind:class="{active: isDescriptionActive}"
                v-show="isDescriptionActive"
                @callCart="switchCart" />

            <itemCart
                ref="cart"
                id="cart"
                @cartUpdate="passCartToHome"
                @toDescription="switchDescription"
                v-bind:class="{active: isCartActive}"
                v-show="isCartActive" />
        </div>
    </div>
    
</template>

<script>
    // import {getIdxPhone} from "../assets/js/mainView.js";
    export default {
        data() {
            return {
                id: null,
                isDescriptionActive: true,
                isCartActive: false
            };
        },
        mounted() {

        },
        methods:{
            passData(_id){
                this.id = _id;
                this.$refs.description.init(_id);
                this.isCartActive = false;
                this.isDescriptionActive = true;
            },
            switchCart(){
                this.isCartActive = true;
                this.isDescriptionActive = false;
                this.$refs.cart.init(this.id);
            },
            switchDescription(){
                this.isCartActive = false;
                this.isDescriptionActive = true;
            },
            backHome(){
                this.$emit("backHome");
            },
            passCartToHome(_id, quantity){
                this.$emit("cartUpdate", _id, quantity);
            }
        }
  }
</script>