import Cookies from "js-cookie";

const TokenKey = "token";

// For user signin token
export default {
  getToken: function () {
    return Cookies.get(TokenKey);
  },

  setToken: function (token) {
    return Cookies.set(TokenKey, token);
  },
  removeToken: function () {
    return Cookies.remove(TokenKey);
  },
};
