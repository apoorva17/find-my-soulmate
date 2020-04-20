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
      <div v-if="!heartBeat">
        <div class="match-title">Your matches today</div>
        <div class="match-time">Expire on {{date}}</div>
        <div class="match-result">
          <div class="match-item" v-for="(item, index) in r" :key="index" v-if="r.length > 0">
            <img class="avatar" :src="item.profilepic" alt />
            <div class="name">{{item.name}}</div>
            <!-- mock match score-->
            <div class="percent">Top {{index+1}} match</div>
            <button class="chat-btn">
              <i class="iconfont icon-chat"></i>
              <span>Chat</span>
            </button>
          </div>
          <div class v-if="r.length == 0">
            <h2> You currently don't have any matches! Try again later! </h2>
          </div>
        </div>
      </div>
      <div v-if="heartBeat" class="loading">
        <!-- show heartbeat-->
        <div class="chest">
          <div class="heart left side top"></div>
          <div class="heart center">&hearts;</div>
          <div class="heart right side"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "home",
  data() {
    return {
    };
  },
  computed: {
    date() {
      // return tomorrow
      let date = new Date();
      date.setTime(date.getTime()+24*60*60*1000);
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let s = `${year}-${month < 10 ? '0'+ month : month}-${day < 10 ? '0'+ day : day}`
      return s
    }
  },
  methods: {
    logout() {
      window.location.href = "/";
    }
  },
  created: function() {
    setTimeout(() => {
      this.heartBeat = false;
      }, 2000);
  },
  mounted() {
  }
};
</script>

<style scoped lang="scss">
.home-container {
  height: 100%;
  display: flex;
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
    font-size: 18px;
    color: #eeeeee;
    margin-top: 30px;
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
  .match-result {
    margin-top: 5%;
    display: flex;
    flex-wrap: wrap;
    text-align: center;
    .match-item {
      padding-right: 20px;
      flex: 1;
      &:last-child {
        padding-right: 0;
      }
      .avatar {
        width: 80%;
        height: auto;
        background-color: #f5f5f5;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
      }
      .name {
        font-size: 24px;
        color: #333;
        font-weight: bold;
        line-height: 1.5;
      }
      .percent {
        font-size: 20px;
        color: #ee59b0;
      }
      .chat-btn {
        color: #fff;
        background-color: #4ef192;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        width: 88px;
        padding: 5px 0;
        margin-top: 8px;
        cursor: pointer;
        outline: none;
        text-align: center;
        &:hover {
          background-color: #48e489;
        }
        &:active {
          background-color: #23d66e;
        }
        span {
          padding: 0 6px;
        }
      }
    }
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
    color: #333;
  }
  .form-tips {
    font-size: 32px;
    color: #666;
  }
  .form-control {
    font-size: 24px;
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
      min-width: 220px;
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
    .to {
      margin: 0 10px;
    }
    .commit-btn {
      display: block;
      cursor: pointer;
      padding: 0;
      background-color: #3b5998;
      border: 1px solid transparent;
      color: #fff;
      height: 88px;
      width: 100%;
      border-radius: 1px;
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

</style>
