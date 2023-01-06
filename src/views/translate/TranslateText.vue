<template lang="pug">
   .main-box
      .tool-bar
         .left
            i.iconfont-tuding(v-show="tudingIsFix !== true" @click="tudingToogle")
            i.iconfont-tuding-fix(v-show="tudingIsFix === true" @click="tudingToogle")
         .right
            //- i.iconfont-copy

      .text-box
         el-input(
            ref="input"
            type="textarea"
            v-model="translateText"
            rows="3"
            resize="none"
            autofocus=true
            @blur="onBlur"
         )
         .input-tool
            i.iconfont-laba
            i.iconfont-copy


</template>

<script >
export default {
  name: 'SettingsView',
  data(){
    return {
      tudingIsFix: false,
      translateText: "",
    }
  },
  mounted(){
      window.ipcRenderer.send("translateWin:selected")
      window.ipcRenderer.receive('translateWin:selectedReply', (text) => {
         if(text){
            this.translateText = text
         }
      })
  },
  watch: {
  },
  methods: {
      tudingToogle(){
         this.tudingIsFix = !this.tudingIsFix
         window.ipcRenderer.send("translateWin:fix", this.tudingIsFix)
      },
      onBlur(){
         if(this.translateText === ""){
            this.$refs.input.focus()
         }
      }
  }
}
</script>

<style lang="scss" scoped>
.main-box{
   padding: 10px 20px;
   -webkit-app-region: drag;
   i {
      font-size: 20px;
   }
   .iconfont-tuding-fix{
      color: #409EFF
   }
   .tool-bar{
      -webkit-app-region: drag;
      .left {
         float: left;
         width: 50%;
         text-align: left;
      }
      .right {
         margin-right: 0;
         text-align: right;
      }
   }
   .text-box{
      margin-top: 30px;
      position: relative;
      .input-tool{
         position: absolute;
         top: 45px;
         left: 10px;
         i {
            margin-right: 10px;
            font-size: 16px;
         }
         .iconfont-laba{
            font-size: 18px;
         }
      }
   }

}

</style>