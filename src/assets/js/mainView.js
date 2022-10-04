var uniqueBrands = [];
var user = 0;
var phone = 1;
var userList = {
    id: [],
    name: []
};
var cart = [];

var phoneList = {
    _id: [],
    title: [],
    brand: [],
    image: [],
    stock: [],
    seller: [],
    price: [],
    disabled: [],
    reviews: {
        comments: [],
        reviewers: [],
        ratings: []
    },
    averageRating: [],
    ratingNum: []
};


export function readImportedData(mode, list) {
    if (mode == user) {
        userList = {
            id: [],
            name: []
        };
    } else {
        phoneList = {
            _id: [],
            title: [],
            brand: [],
            image: [],
            stock: [],
            seller: [],
            price: [],
            disabled: [],
            reviews: {
                comments: [],
                reviewers: [],
                ratings: []
            },
            averageRating: [],
            ratingNum: []
        };
    }

    switch (mode) {
        case phone:
            for (var i = 0; i < list.length; i++) {
                cart.push(0);
                phoneList._id.push(list[i]._id);
                phoneList.title.push(list[i].title);
                phoneList.brand.push(list[i].brand);
                phoneList.stock.push(list[i].stock);
                var sellerIdx = userList.id.indexOf(list[i].seller);
                phoneList.seller.push(userList.name[sellerIdx]);
                phoneList.price.push(parseFloat(list[i].price));
                if ("disabled" in list[i]) {
                    phoneList.disabled.push(true);
                } else {
                    phoneList.disabled.push(false);
                }

                var ratingSum = 0;
                var ratingCnt = 0;
                var ratingAvg = 0;
                var comments = [];
                var reviewers = [];
                var ratings = [];

                if (list[i].reviews.length > 0) {
                    for (var j = 0; j < list[i].reviews.length; j++) {
                        var reviewerIdx = userList.id.indexOf(list[i].reviews[j].reviewer);
                        reviewers.push(userList.name[reviewerIdx]);
                        comments.push(list[i].reviews[j].comment);
                        ratings.push(list[i].reviews[j].rating);
                        ratingSum += parseInt(list[i].reviews[j].rating);
                        ratingCnt += 1;
                    }
                    ratingAvg = (parseFloat(ratingSum / ratingCnt)).toFixed(2);
                }

                phoneList.reviews.comments.push(comments);
                phoneList.reviews.reviewers.push(reviewers);
                phoneList.reviews.ratings.push(ratings);

                phoneList.ratingNum.push(ratingCnt);
                phoneList.averageRating.push(ratingAvg);
            }
            return phoneList;
        case user:
            for (var k = 0; k < list.length; k++) {
                userList.id.push(list[k]._id);
                userList.name.push(list[k].firstname.concat(" ", list[k].lastname));
            }
            break;
    }

}

function updateStock(index, qty) {
    phoneList.stock[index] -= qty;
    if (phoneList.stock[index] >= 0) {
        return true;
    }
    return false;
}

function updateCart(index, qty) {
    cart[index] += qty;
    return cart;
}

function readImportData(mode, list) {
    if (mode == user) {
        userList = {
            id: [],
            name: []
        };
    } else {
        phoneList = {
            _id: [],
            title: [],
            brand: [],
            image: [],
            stock: [],
            seller: [],
            price: [],
            disabled: [],
            reviews: {
                comments: [],
                reviewers: [],
                ratings: []
            },
            averageRating: [],
            ratingNum: []
        };
    }

    switch (mode) {
        case phone:
            for (var i = 0; i < list.length; i++) {
                cart.push(0);
                phoneList._id.push(list[i]._id);
                phoneList.title.push(list[i].title);
                phoneList.brand.push(list[i].brand);
                phoneList.stock.push(list[i].stock);
                var sellerIdx = userList.id.indexOf(list[i].seller);
                phoneList.seller.push(userList.name[sellerIdx]);
                phoneList.price.push(parseFloat(list[i].price));
                if ("disabled" in list[i]) {
                    phoneList.disabled.push(true);
                } else {
                    phoneList.disabled.push(false);
                }

                var ratingSum = 0;
                var ratingCnt = 0;
                var ratingAvg = 0;
                var comments = [];
                var reviewers = [];
                var ratings = [];

                if (list[i].reviews.length > 0) {
                    for (var j = 0; j < list[i].reviews.length; j++) {
                        var reviewerIdx = userList.id.indexOf(list[i].reviews[j].reviewer);
                        reviewers.push(userList.name[reviewerIdx]);
                        comments.push(list[i].reviews[j].comment);
                        ratings.push(list[i].reviews[j].rating);
                        ratingSum += parseInt(list[i].reviews[j].rating);
                        ratingCnt += 1;
                    }
                    ratingAvg = (parseFloat(ratingSum / ratingCnt)).toFixed(2);
                }

                phoneList.reviews.comments.push(comments);
                phoneList.reviews.reviewers.push(reviewers);
                phoneList.reviews.ratings.push(ratings);

                phoneList.ratingNum.push(ratingCnt);
                phoneList.averageRating.push(ratingAvg);
            }
            break;
        case user:
            for (var k = 0; k < list.length; k++) {
                userList.id.push(list[k]._id);
                userList.name.push(list[k].firstname.concat(" ", list[k].lastname));
            }
            break;
    }

}

/* initBrandFilter(): Function to init the brand filtering field 
 */
function initBrandFilter() {
    // get unique categories
    for (var i = 0; i < phoneList.brand.length; i++) {
        if (!uniqueBrands.includes(phoneList.brand[i])) {
            uniqueBrands.push(phoneList.brand[i]);
        }
    }
    // add extra category for testing (i.e. no matching record)
    uniqueBrands.push("TestingBrand");
    uniqueBrands.sort();
}

/* getSoldOutSoonList(list):
 * helper function to get the list to display in sold out soon section
 */
function getSoldOutSoon(data) {
    var candidateList = [];
    for (var i = 0; i < data.disabled.length; i++) {
        if (!data.disabled[i] && data.stock[i] > 0) {
            candidateList.push([i, data.stock[i]]);
        }
    }
    var sortedList = candidateList.sort(function(a, b) { return a[1] - b[1] }).slice(0, 5);
    var maxLength = Math.min(5, sortedList.length);
    var leastStockListResult = [];
    for (var j = 0; j < maxLength; j++) {
        var tmpIdx = sortedList[j][0];
        leastStockListResult.push(tmpIdx);
    }
    return leastStockListResult;
}

/* getBestSellerList(list):
 * helper function to get the list to display in best seller section
 */
function getBestSeller(data) {
    var candidateList = [];
    for (var i = 0; i < data.disabled.length; i++) {
        if (!data.disabled[i] && data.ratingNum[i] >= 2) {
            candidateList.push([i, data.averageRating[i]]);
        }
    }
    var sortedList = candidateList.sort(function(a, b) { return b[1] - a[1] }).slice(0, 5);
    var maxLength = Math.min(5, sortedList.length);
    var bestRatingListResult = [];
    for (var j = 0; j < maxLength; j++) {
        var tmpIdx = sortedList[j][0];
        bestRatingListResult.push(tmpIdx);
    }
    return bestRatingListResult;
}


function stringMatch(string, search) {
    var subs = search.split(' ');
    var result = true
    for (var i = 0; i < subs.length; i++) {
        if (!string.toLowerCase().includes(subs[i].toLowerCase())) {
            result = false;
            break;
        }
    }
    return result;
}

export function applySearch() {
    var searchText = document.getElementById("searchContent").value.toLowerCase();
    // if (!searchText.match("^[A-Za-z0-9]+$")) {
    //     alert("Please type in characters and digits only!")
    //     return false;
    // }
    var matchingPhoneId = [];
    for (var i = 0; i < phoneList.title.length; i++) {
        var title_lower = phoneList.title[i].toLowerCase();
        if (stringMatch(title_lower, searchText)) {
            matchingPhoneId.push(phoneList._id[i]);
        }
    }
    // TODO: no search result
    return matchingPhoneId;
}

export function updateHomeLists(data, type) {
    // var returnList = [];
    var idList = [];

    switch (type) {
        case 0:
            idList = getSoldOutSoon(data);
            break;
        case 1:
            idList = getBestSeller(data);
            break;
    }
    return idList;
}

export function getNewHomeList(data, type) {
    var returnList = [];
    var indexList = [];

    switch (type) {
        case 0:
            indexList = getSoldOutSoon(data);
            break;
        case 1:
            indexList = getBestSeller(data);
            break;
    }
    // console.log(indexList)
    for (var i = 0; i < indexList.length; i++) {
        var tmpIdx = indexList[i];
        var phoneItem = {
            _id: data._id[tmpIdx],
            title: data.title[tmpIdx],
            brand: data.brand[tmpIdx],
            price: data.price[tmpIdx],
            averageRating: data.averageRating[tmpIdx],
            ratingNum: data.ratingNum[tmpIdx],
        };
        returnList.push(phoneItem);
    }
    return returnList;
}

export function getIdxPhone(index) {
    var thisPhone = {
        _id: phoneList._id[index],
        index: index,
        title: phoneList.title[index],
        brand: phoneList.brand[index],
        stock: phoneList.stock[index],
        seller: phoneList.seller[index],
        price: phoneList.price[index],
        disabled: phoneList.disabled[index],
        comments: phoneList.reviews.comments[index],
        reviewers: phoneList.reviews.reviewers[index],
        ratings: phoneList.reviews.ratings[index],
        averageRating: phoneList.averageRating[index],
        ratingNum: phoneList.ratingNum[index],
    };
    return thisPhone;
}

export function cartUpdate(index, qty) {
    if (updateStock(index, qty)) {
        return updateCart(index, qty);
    }
    return false;
}

export function getCart() {
    return cart;
}

export function importData(importedData) {
    console.log(importedData)
    var phoneData = importedData.phone;
    var userData = importedData.user;

    if (phoneData.length < 1 || userData.length < 1) {
        console.log("cannot init page due to invalid json path");
    } else {
        readImportData(user, userData); // load user information
        readImportData(phone, phoneData); // load phone information
        initBrandFilter();
        var exportVars = {
            uniqueBrands,
            phoneList,
        }
    }
    //console.log(userList)
    return exportVars;
}

export function updateData(type, data) {
    switch (type) {
        case user:
            readImportData(user, data);
            return userList;
        case phone:
            readImportData(phone, data);
            return phoneList;
    }
}


// window.onpopstate = function() {
//     location.reload()
// };