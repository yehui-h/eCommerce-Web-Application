import Vue from "vue";
import VueRouter from "vue-router";

import cookie from "@/utils/cookie";

import MainView from "../views/mainView.vue";
import CheckoutView from "../views/checkoutView.vue";
import SigninView from "../views/signinView.vue";
import SignupView from "../views/signupView.vue";
import UserView from "../views/userView.vue";
import MailActiveView from "../views/mailActiveView.vue";
import ForgetPasswordView from "../views/forgetPasswordView.vue";
import ResetPasswordView from "../views/resetPasswordView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/main",
  },
  {
    path: "/main",
    name: "main",
    component: MainView,
    meta: { keepAlive: true },
  },
  {
    path: "/checkout",
    name: "checkout",
    component: CheckoutView,
  },
  {
    path: "/signin",
    name: "signin",
    component: SigninView,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignupView,
  },
  {
    path: "/profile",
    name: "profile",
    component: UserView,
  },
  {
    path: "/mailactive",
    name: "mailactive",
    component: MailActiveView,
  },
  {
    path: "/forgetpassword",
    name: "forgetpassword",
    component: ForgetPasswordView,
  },
  {
    path: "/resetpassword",
    name: "resetpassword",
    component: ResetPasswordView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// For user signin check
router.beforeEach((to, from, next) => {
  if (from.path === "/") {
    next();
  } else {
    if (typeof cookie.getToken() != "undefined") {
      if (to.path === "/signin" || to.path === "signup") {
        next(false);
      } else {
        next();
      }
    } else {
      if (from.path === "/main") {
        if (to.path === "/signin") {
          from.meta.keepAlive = false;
          next();
        } else {
          next("/signin");
        }
      } else {
        next();
      }
    }
  }
});

export default router;
