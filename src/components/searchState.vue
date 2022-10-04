<template>
    <div id="searchPhoneBlock">
        <div class="searchPhoneBlockHeader">
            <p class="searchStateText backBtn" @click="backHome"> &lt; Back Home</p>
            <p class="pageTitles" id="searchResultTitle">Search Result for: "{{searchText}}"</p>
            <p class="searchStateText">{{itemCount}} items</p>
            
            <div id="filterWrap">
                <p class="searchStateText filterText">filters</p>
                <el-dropdown id="brandDropdown">
                    <button class="brandDpn">{{brandName}}
                        <el-icon class="el-icon--right"><arrow-down/></el-icon>
                    </button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item
                                v-for="(item, index) in brandList"
                                :key="index"
                                @click.native="changeBrand(item)"
                            >{{ item }}</el-dropdown-item>
                            <el-dropdown-item @click.native="changeBrand('blank')">{{brandDefault}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>

                <div class="block" id="priceRangeSlider">
                    <label for="volume" class="searchStateText filterText">Less than ${{priceFilterValue}}</label>
                    <input 
                        type="range" 
                        id="sliderMaxPrice" 
                        :min="priceMin"
                        :max="priceMax"
                        :value="priceFilterValue"
                        name="maxPrice"
                        @change="updatePrice"
                        @keyup="updatePrice">
                </div>

                <button id="submitPriceFilter"
                        @click="applyFilters">
                        Apply Filter</button>
            </div>
        </div>

        <div id="searchWrap">
            <div
                v-for="(item, index) in searchResult"
                :key="index"
                class="singleItemBlock"
                @click="toItemState(item._id)"
            >
                <img class="searchThumbnail" :src="require('../../public/images/'+item.brand+'.jpeg')" >
                <b><p class="searchPhoneTitle">{{ item.title }}</p></b>
                <div class="bottomWrap">
                    <p class="searchDetailText">Brand: {{ item.brand }}</p>
                    <p class="searchDetailText">Seller: {{ sellers[index] }}</p>
                    <p class="searchDetailText">Rating: {{ ratings[index] }} ({{ ratingNum[index] }})</p>
                    <p class="searchDetailText searchDetailPrice">Price: ${{ item.price }}</p>
                </div>
            </div>
        </div>
    </div> 
</template>

<script>
    export default {
        data(){
            return{
                brandDefault: "All Phone Brands",
                brandName: "All Phone Brands",
                priceMin: -1,
                priceMax: -1,
                priceThis: -1,
                update: true,
                processedFullPhonelist: [],
                sellersBackup: [],

                searchText:"",
                priceFilterValue: -1,
                
                searchResult: [],
                itemCount:-1,
                brandList: [],
                sellers: [],
                ratings: [],
                ratingNum: [],
                count: 0
            }
        },
        mounted(){
        },
        watch:{
            update: {
                handler: function() {
                    if(this.priceMin == -1){
                        this.priceMin = this.priceThis
                        this.priceMax = this.priceThis
                    }else{
                        if(this.priceMin > this.priceThis){
                            this.priceMin = this.priceThis
                        }
                        if(this.priceMax < this.priceThis){
                            this.priceMax = this.priceThis
                        }
                    }
                    // alert(this.priceMax)
                    this.priceFilterValue = this.priceMax
                    this.$forceUpdate()
                },
                deep: true,
                immediate: true
            }
        },
        methods:{
            init(searchResult){
                this.itemCount = searchResult.length;
                for (var i = 0; i < searchResult.length; i++){
                    this.getPhoneById(searchResult[i])
                }
                var search = document.getElementById("searchContent").value;
                this.searchText = search
            },
            getUserById(_id){
                let self = this;
                this.$axios
                .post("/servers/userPage/getUserInfo", {
                    id: _id
                })
                .then(function (response) {
                    if (response.data.msg === "success") {
                        console.log("load success");
                        var userName = "";
                        var names = [];
                        names.push(response.data.data[0].firstname);
                        names.push(response.data.data[0].lastname);
                        userName = names.join(" ")
                        self.sellers.push(userName)
                        self.sellersBackup.push(userName)
                        
                    } else if (response.data.msg === "fail") {
                        alert(response.data.data[0]);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            },
            getPhoneById(_id){
                let self = this
                this.$axios
                .post("/servers/userPage/getPhoneListById", {
                    id: _id
                })
                .then(function (response) {
                    if (response.data.msg === "success") {
                    console.log("load success");
                    self.searchResult.push(response.data.data)
                    self.processedFullPhonelist.push(response.data.data)
                    self.priceThis = parseFloat(response.data.data.price)
                    if(self.brandList.indexOf(response.data.data.brand) < 0){
                        self.brandList.push(response.data.data.brand)
                    }
                    self.getUserById(response.data.data.seller);
                    var rating = 0;
                    for(var j = 0; j < response.data.data.reviews.length; j++){
                        rating += response.data.data.reviews[j].rating
                    }
                    if(response.data.data.reviews.length > 0){
                        rating = (rating/response.data.data.reviews.length).toFixed(2)
                    }
                    self.ratings.push(rating);
                    self.ratingNum.push(response.data.data.reviews.length);
                    self.update = !self.update
                    } else if (response.data.msg === "fail") {
                        alert(response.data.msg);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            },
            toItemState(key) {
                this.$emit('callItem',key);
            },
            changeBrand(name){
                if(name == "blank"){
                    this.brandName = this.brandDefault;
                }else{
                    this.brandName = name;
                }
            },
            updatePrice(){
                this.priceFilterValue = document.getElementById("sliderMaxPrice").value;
            },
            backHome(){
                this.$emit("backHome");
            },
            applyFilters(){
                var filterBrand = true;
                if(this.brandName == this.brandDefault){
                    filterBrand = false;
                }
                this.searchResult = []
                this.sellers = []
                for(var i = 0; i < this.processedFullPhonelist.length; i++){
                    console.log(this.processedFullPhonelist[i].price)
                    if(parseFloat(this.processedFullPhonelist[i].price) <= this.priceFilterValue){
                        if(!filterBrand || this.brandName == this.processedFullPhonelist[i].brand){
                            console.log(i)
                            this.searchResult.push(this.processedFullPhonelist[i]);
                            this.sellers.push(this.sellersBackup[i])
                        }
                    }
                }
                this.$forceUpdate
            }
        }
  }
</script>