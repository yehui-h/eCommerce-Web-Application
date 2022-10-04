<template id="main_description">
    <div id="phoneDetails">
        <div class="phoneDetails_verticalBlock">
            <div class="phoneDetails_horizontalBlock">
                <img id="phoneDetails_phoneImg" :src="require('../../public/images/'+phoneDetail.brand+'.jpeg')">
            </div>

            <div class="phoneDetails_horizontalBlock" id="phoneDetails_description">
                <p class="phoneDetails_phoneTitle" id="phoneDetails_descriptionTitle">{{phoneDetail.title}}</p>
                <p class="phoneDetails_phoneBrandStyler" id="phoneDetails_brand">{{phoneDetail.brand}}</p>
                <p id="phoneDetails_seller">Seller: {{seller}}</p>
                <p id="phoneDetails_stock">Stock: {{phoneDetail.stock}}</p>
                <p id="phoneDetails_price">Price: ${{phoneDetail.price}}</p>
                <button 
                    class="phoneDetails_btn" 
                    v-if="disable"
                    >Unavailable Now
                </button>
                <button 
                    class="phoneDetails_btn" 
                    id="phoneDetails_add"
                    v-else
                    @click="switchCart">Add To Chart
                </button>
            </div>
        </div>

        <div class="phoneDetails_verticalBlock">
            <div id="phoneDetails_reviewWrapping">
                <p class="pageTitles" id="description_review_title">Reviews ({{phoneDetail.reviews.length}})</p>                    
                <div style="margin-bottom:20px">
                    <button
                        class="showComments blankbgc"                     
                        @click="showCommentEditor">Add New Comment
                    </button>
                </div>
                <div id="addCommentWrapping" v-if="ableToEdit">
                    <label for="newRatingLabel">Your Rating (1-5)</label>
                    <el-input-number v-model="newRating" :min="1" :max="5" label="newRatingLabel" style="margin-top: 10px ;margin-bottom:20px; margin-left:10px;"></el-input-number>
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="Please input your comment"
                        v-model="commentTextarea">
                    </el-input>
                    <el-button                     
                        style="margin-top: 20px ;margin-bottom:30px; float: right"
                        @click="cancelComment">Cancel
                    </el-button>
                    <el-button                     
                        style="margin-top: 20px ;margin-bottom:30px"
                        @click="submitComment">Submit
                    </el-button>
                </div>
                 <div class="commentWrapping"
                    v-for="(item,index) in comments"
                    :key="index"
                    v-show="showComment[index]"
                >   <div class="reviewerInnerWrap">
                        <p class="reviewer">{{ reviewers[index] }}</p>
                        <p class="rating">Rating: {{ ratings[index] }}</p>
                    </div>
                    <div class="commentInnerWrap">
                        <p v-if="foldComment[index]">{{ comments[index].slice(0,200) }} ...</p>
                        <p v-else>{{ comments[index] }}</p>
                        <p v-if="longComment[index] && foldComment[index]" class="fullCommentBtn" @click="showFullComment(index)">( Show Full Text )</p>
                        <p v-if="longComment[index] && !foldComment[index]" class="fullCommentBtn" @click="showFullComment(index)">( Hide Long Text )</p>
                    </div>
                </div>
                <button 
                    class="showComments" 
                    v-bind:class="{active: isBtnActive}"
                    v-show="isBtnActive"
                    @click="processReviews">Show More</button>
            </div>
        </div>
    </div>

</template>


<script>
import cookie from "../utils/cookie";
    export default {
        data(){
            return{
                phoneDetail:null,
                seller: "",

                ratingNum: 0,
                remainingComments: 0,
                iteratingSize:3,
                iteratingEnd: 0,
                
                isBtnActive: true,
                comments: [],
                ratings: [],
                reviewers: [],
                longComment: [],
                foldComment: [],
                showComment: [],

                ableToEdit: false,
                commentTextarea: '',
                newRating: 3,
                tempPhoneDataStore: null,
                tempUser: "",
                disable: false
            }
        },
        methods: {
            clearData(){
                this.phoneDetail = null;
                this.seller = "",
                this.disable = false

                this.ratingNum = 0,
                this.remainingComments = 0;
                this.iteratingSize = 3;
                this.iteratingEnd = 0;

                this.isBtnActive = true;
                this.comments = []
                this.ratings = []
                this.reviewers = []
                this.foldComment = []
                this.longComment = []
                this.showComment = []

                this.ableToEdit = false
                this.commentTextarea = ''
                this.newRating = 3
                this.tempPhoneDataStore = null,
                this.tempUser = ""
            },
            init(_id){
                // get specific phone details
                this.clearData()
                this.getPhoneById(_id)
            },
            constComponents(data){
                this.clearData();
                console.log(data)
                this.phoneDetail = data;
                console.log(this.phoneDetail)
                this.iteratingSize = Math.min(this.phoneDetail.ratingNum, this.iteratingSize);
                this.iteratingEnd = this.iteratingIndex + this.iteratingSize;
                this.reviewCount = this.phoneDetail.ratingNum;
                this.comments = this.phoneDetail.comments;
                for(var i = 0; i < this.reviewCount; i++){
                    if(this.comments[i].length > 200){
                        this.longComment.push(true);
                        this.foldComment.push(true);
                        
                    }else{
                        this.longComment.push(false);
                        this.foldComment.push(false);
                    }
                }
                this.ratings = this.phoneDetail.ratings;
                this.reviewers = this.phoneDetail.reviewers;
                
                if(this.reviewCount <= 3){
                    this.isBtnActive = false;
                }else{
                    this.isBtnActive = true;
                }
            },
            switchCart(){
                if (typeof cookie.getToken() === "undefined") {
                    this.$router.push('/signin');
                }else{
                    this.$emit('callCart');
                }
            },
            showFullComment(index){
                this.foldComment[index] = !this.foldComment[index];
                this.$forceUpdate();
            },
            showCommentEditor(){
                if (typeof cookie.getToken() != "undefined"){
                    this.ableToEdit = true;
                }else{
                    this.ableToEdit = false;
                    alert("Please signin first!");
                    this.$router.push('/signin');
                }
            },

            submitComment(){
                let self = this;
                if((this.commentTextarea.length != 0) && (this.commentTextarea.split(" ").join("").length != 0)){
                    this.$axios
                    .post("/servers/addComment", {
                        reviewer: cookie.getToken(),
                        rating: self.newRating,
                        comment: self.commentTextarea,
                        id: self.phoneDetail._id,
                    })
                    .then(function (response) {
                        console.log(response.data.msg);
                        if (response.data.msg === "success") {
                            console.log("submit success");
                            alert("submit!");
                            self.newRating = 3;
                            self.commentTextarea = '';
                            self.ableToEdit = false;
                            var id = self.phoneDetail._id
                            self.init(id)
                        } else if (response.data.msg === "fail") {
                            alert(response.data.data);
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                }
                else{
                    alert('The comment cannot be empty!');
                    this.commentTextarea = '';
                }
            },
            cancelComment(){
                this.newRating = 3;
                this.commentTextarea = '';
                this.ableToEdit = false;
            },
            
            preprocessReviews(reviews){
                for (var i = 0; i < reviews.length; i++){
                    this.comments.push(reviews[i].comment);
                    var userId = reviews[i].reviewer;
                    this.getUserById(userId, false);
                    this.ratings.push(reviews[i].rating);
                    if(reviews[i].comment.length > 200){
                        this.longComment.push(true);
                        this.foldComment.push(true);
                    }else{
                        this.longComment.push(false);
                        this.foldComment.push(false);
                    }
                    this.showComment.push(false);
                }
                this.ratingNum = reviews.length;
                this.remainingComments = reviews.length;
                console.log(this.reviewers);
            },
            processReviews(){
                console.log("current end: "+this.iteratingEnd)
                this.iteratingSize = Math.min(this.remainingComments, this.iteratingSize);
                for(var i = 0; i< this.iteratingSize; i++){
                    this.showComment[this.iteratingEnd+i] = true;
                }
                this.remainingComments -= this.iteratingSize;
                this.iteratingEnd += this.iteratingSize;
                if(this.remainingComments < 1){
                    this.isBtnActive = false;
                }else{
                    this.isBtnActive = true;
                }
                this.$forceUpdate()
            },
            getUserById(_id, isSeller){
                // console.log(_id)
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
                        if(isSeller){
                            self.seller = userName
                        }else{
                            self.reviewers.push(userName)
                        }
                        
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
                    self.phoneDetail = response.data.data;
                    self.getUserById(self.phoneDetail.seller, true)
                    console.log(response.data.data)
                    if("disabled" in response.data.data){
                        self.disable = true
                    }
                    // process reviews
                    self.preprocessReviews(self.phoneDetail.reviews);
                    self.processReviews();
                    } else if (response.data.msg === "fail") {
                        alert(response.data.msg);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            },
        }
    }
</script>