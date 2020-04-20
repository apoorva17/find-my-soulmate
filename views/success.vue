<template>
  <div class="home-container">
    <div class="side-bar">
      <div class="personal-info">
        <div class="avatar" :style="{backgroundImage: `url(${user.photos[0].value})`}">
          <div class="sex">
            <i class="iconfont icon-male"></i>
            <!-- <i class="iconfont icon-female"></i> -->
          </div>
        </div>
        <div class="tips">Welcome</div>
        <div class="nickname">{{user.displayName}}</div>
      </div>
      <div class="exit">
        <button class="exit-btn" @click="logout">
          <i class="iconfont icon-exit"></i>
          <span>Exit</span>
        </button>
      </div>
    </div>
    <div class="main">
      <div v-if="isLoading" class="loading">
        <div class="chest">
          <div class="heart left side top"></div>
          <div class="heart center">&hearts;</div>
          <div class="heart right side"></div>
        </div>
      </div>
      <div v-else class="form">
        <div class="form-title">Hello, {{user.displayName}}!</div>
        <div class="form-tips">Please complete following details to find your soulmate :)</div>
        <div>
          <cool-select
              v-model="selectedGender"
              :items="genders"
              placeholder="Your gender preference"
              disable-search
            />
        </div>
        <form action="/api/profile/facebook" method="POST" id="pref_form">
          <div class="form-control">
            <label for="selfgender">Your Gender</label>
            <select class = "gender-select" id="selfgender" name="gender">
              <option value="f">Female</option>
              <option value="m">Male</option>
            </select>
          </div>
          <div class="form-control">
            <label for="selfage">Your Age</label>
            <input type="number" min="18" max="100" 
             value="18" class="age-select" id="selfage" name="age">
          </div>
          <div class="form-control">
            <label class="pref" for="gender">Gender Preference</label>
            <select class = "gender-select" id="gender" name="genderpref">
              <option value="m">Male</option>
              <option value="f">Female</option>
            </select>
          </div>
          <div class="form-control">
            <label class="pref" for="ageprefmin">Age Preference</label>
            <input type="number" min="18" max="100" 
             value="18" class="age-select" name="ageprefmin" id="ageprefmin"
             onchange="document.getElementById('ageprefmax').min=this.value;">
            <span class="to"> to </span>
            <input type="number" min="document.getElementById('ageprefmin').value" max="100" 
             value="18"
             class="age-select" name="ageprefmax" id="ageprefmax">
          </div>
          <div class="form-control describe">
            <div class="self-describe">How would you describe yourself to someone you just met?</div>
            <textarea rows="3" maxlength="2000" name='selfintro' form='pref_form' ref="selfintro"></textarea>
          </div>
          <div class="form-control">
            <button class="commit-btn" type="submit" @click="matches">Analyze My Profile & Match!</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  //components: { CoolSelect },
  data() {
    return {
    };
  },
  methods: {
    logout() {
      window.location.href = "/";
    },
    matches(event) {
      const post_len = this.posts_len
      const intro_len = this.$refs.selfintro.value.split(" ").length
      const total_len = post_len+intro_len
      if (total_len <= 105) {
        alert("Your Facebook posts plus your self introduction should reach at least 100 words! Post more contents or provide more introduction and try again :)")
        event.preventDefault();
        return false;
      } else {
        return true;
      }
    }
  },
  computed: {
    genders() {
      return ["Man", "Woman"]
    },
    selectedGender() {
      return ""
    }
  },
  mounted() {
  }
};
</script>

<style scoped lang="scss">
.home-container {
  height: 100%;
  display: flex;
  font-family: Optima, Times New Roman, Arial;
}
.side-bar {
  width: 230px;
  background-color: #3b5998;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  .exit-btn {
    display: block;
    width: 100%;
    background: none;
    border: none;
    font-size: 20px;
    color: #eee;
    padding: 30px 0;
    cursor: pointer;
    transition: all 0.3s;
    span {
      margin: 0 5px;
    }
    &:hover {
      color: #fff;
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}
.main {
  flex: 1;
  overflow: auto;
  height: 100%;
}
.personal-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  .avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background-size: cover;
    background-position: center center;
    background-color: #f5f5f5;
    margin-top: 30px;
    position: relative;
    .sex {
      position: absolute;
      width: 30px;
      height: 30px;
      right: 10px;
      bottom: 0;
      background-color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .iconfont {
      font-weight: bold;
    }
    .icon-male {
      color: #007fcc;
    }
    .icon-female {
      color: #ee59b0;
    }
  }
  .tips {
    font-size: 20px;
    color: #eeeeee;
    margin-top: 30px;
    font-weight: 400;
  }
  .nickname {
    font-size: 26px;
    color: #fff;
    margin-top: 30px;
  }
}
.main {
  padding: 5% 5% 0;
  .match-title {
    font-size: 48px;
    color: #3b5998;
  }
  .match-time {
    font-size: 32px;
    color: #666;
  }
}
.loading {
  .chest {
    width: 250px;
    height: 250px;
    margin: 0 auto;
    position: relative;
  }
  .heart {
    position: absolute;
    z-index: 2;
    background: linear-gradient(-90deg, #f50a45 0%, #d5093c 40%);
    animation: beat 0.7s ease 0s infinite normal;
  }
  .heart.center {
    background: linear-gradient(-45deg, #b80734 0%, #d5093c 40%);
    transform: scale(1) rotate(225deg);
  }
  .heart.top {
    z-index: 3;
  }
  .side {
    top: 50px;
    width: 110px;
    height: 110px;
    border-radius: 110px;
  }
  .center {
    width: 106px;
    height: 106px;
    bottom: 51px;
    left: 72px;
    font-size: 0;
    text-indent: -9999px;
  }
  .left {
    left: 31px;
  }
  .right {
    right: 31px;
  }
  @keyframes beat {
    0% {
      transform: scale(1) rotate(225deg);
      box-shadow: 0 0 40px #d5093c;
    }
    50% {
      transform: scale(1.1) rotate(225deg);
      box-shadow: 0 0 70px #d5093c;
    }
    100% {
      transform: scale(1) rotate(225deg);
      box-shadow: 0 0 40px #d5093c;
    }
  }
}
.form {
  padding: 20px 0;
  .form-title {
    font-size: 56px;
    color: #007fcc;
  }
  .form-tips {
    font-size: 32px;
    color: #666;
  }
  .form-control {
    font-size: 24px;
    display: flex;
    align-items: center;
    margin-top: 32px;
    &.first {
      margin-top: 40px;
    }
    &.describe {
      display: block;
    }
    label {
      min-width: 220px;
      &.pref {
        color: #007fcc;
      }
    }
    textarea {
      margin-top: 15px;
      display: block;
      resize: vertical;
      padding: 5px 15px;
      line-height: 1.5;
      box-sizing: border-box;
      width: 100%;
      font-size: inherit;
      color: #333333;
      background-color: #fff;
      background-image: none;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      &:hover {
        border-color: #c0c4cc;
      }
      &:focus {
        outline: none;
        border-color: #409eff;
      }
    }
    .gender-select {
      padding: 5px;
      position: relative;
      height: 30px;
      font-size: 20px;
    }
    .age-select {
      width: 78px;
      height: 25px;
      font-size: 20px;
      text-align: center;
    }
    .to {
      margin: 2px 10px;
    }
    .commit-btn {
      display: block;
      cursor: pointer;
      padding: 0;
      background-color: #12a34ada;
      border: 1px solid transparent;
      color: #fff;
      height: 80px;
      width: 30%;
      margin-left: 35%;
      margin-left: 35%;
      border-radius: 60px;
      font-size: 20px;
      box-sizing: border-box;
      background-image: none;
      cursor: pointer;
      overflow: hidden;
      position: relative;
      text-align: center;
      white-space: nowrap;
      outline: none;
      transition: all 0.3s;
      &:focus {
        background-color: #4262a8;
        border-color: #80bdff;
        outline: 0;
        box-shadow: 0 0 0 0.2rem rgba(128,189,255,.5);
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .home-container {
    height: 100%;
    flex-direction: column;
  }
  .side-bar {
    min-height: 88px;
    height: 88px;
    width: 100%;
    flex-direction: row;
    padding: 10px 15px;
    box-sizing: border-box;
    align-items: center;
    .exit-btn {
      font-size: 20px;
      padding: 0;
      .iconfont {
        font-size: 18px;
      }
    }
    .tips {
      display: none;
    }
  }
  .main {
    overflow: visible;
    .match-title {
      font-size: 36px;
    }
    .match-time {
      font-size: 20px;
    }
  }
  .personal-info {
    display: flex;
    align-items: center;
    flex-direction: row;
    .avatar {
      width: 66px;
      height: 66px;
      position: relative;
      margin-top: 0;
      .sex {
        position: absolute;
        width: 25px;
        height: 25px;
        right: -3px;
        bottom: -3px;
      }
      .iconfont {
        font-weight: bold;
        font-size: 14px;
      }
      .icon-male {
        color: #007fcc;
      }
      .icon-female {
        color: #ee59b0;
      }
    }
    .nickname {
      font-size: 24px;
      color: #fff;
      margin-top: 0;
      margin-left: 20px;
    }
  }
  .form {
    padding: 20px 0;
    .form-title {
      font-size: 36px;
      color: #007fcc;
    }
    .form-tips {
      font-size: 18px;
      color: #666;
    }
    .form-control {
      font-size: 16px;
      display: flex;
      align-items: center;
      margin-top: 20px;
      &.first {
        margin-top: 40px;
      }
      &.describe {
        display: block;
      }
      label {
        min-width: 150px;
      }
      .to {
        margin: 0 10px;
      }
      .commit-btn {
        height: 48px;
      }
      
    }
    .age-select {
      width: 78px;
      height: 25px;
    }
    
  }
}
</style>