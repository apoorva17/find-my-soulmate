<template>
  <div id="login">
    <div class="main">
      <h1 class="main-title">Find My Soul Mate!</h1>
      <p class="secondary-title">Revolutionizing Dating</p>

      <button class="login-btn" @click="login">
        <div class="button-icon">
          <div class="logo-img"></div>
        </div>
        <span>Login with Facebook</span>
      </button>
      <p class="description">On Find My Soulmate!, your personality counts. Get noticed for who you are, not what you look like.
Register now to build connections and find the one who really understands you!</p>
      
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  methods: {
    // facebook auth
    login() {
      window.location.href = "/auth/facebook";
    }
  },
  data: function() {
    return {};
  }
};
</script>

<style scoped>
#login {
  height: 100vh;
  background: #000 url('https://i.ibb.co/6DTvt5c/bg.jpg') no-repeat center / cover;
  background-attachment: fixed;
  margin: 0 auto;
  text-align: center;
  color: #ffffff;
  padding: 0 20px;
}
.main {
  /* line-height: 1.5; */
  padding-top: 12%;
}
.main-title {
  font-size: 56px;
  margin: 0;
  color: #ffffff;
}
.secondary-title {
  font-size: 25px;
  line-height: 1.5;
  color: #ffffff;
}
.login-btn {
  display: block;
  cursor: pointer;
  padding: 0;
  margin: 6% auto;
  background-color: #3b5998;
  border: 1px solid transparent;
  color: #fff;
  height: 100%;
  width: 300px;
  border-radius: 1px;
  box-sizing: border-box;
  background-image: none;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  text-align: center;
  white-space: nowrap;
}
.button-icon {
  background-color: #fff;
  float: left;
  padding: 13px 16px 12px 17px;
}
.button-icon .logo-img {
  width: 20px;
  height: 28px;
  background-image: url('https://i.ibb.co/BZTMVdC/facebook.jpg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.login-btn span {
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
  line-height: 53px;
}
.description {
  font-size: 18px;
  line-height: 1.5;
  margin: 0;
  width: 600px;
  margin: 0 auto;
}

@media screen and (max-width: 768px) {
  .main {
    padding-top: 20%;
  }
  .main-title {
    font-size: 36px;
  }
  .login-btn {
    width: 100%;
    margin: 20% auto;
  }
  .description {
    text-align: left;
    width: 325px;
  }
}
</style>
