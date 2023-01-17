<template lang="pug">
   .main-box
      .row.tool-bar
         .left
            i.iconfont-tuding(v-show="tudingIsFix !== true" @click="tudingToogle")
            i.iconfont-tuding-fix(v-show="tudingIsFix === true" @click="tudingToogle")
         .right
            //- i.iconfont-copy

      .row.text-box(@click="inputFocus")
         el-input.input(
            ref="input"
            type="textarea"
            v-model="translateText"
            resize="none"
            :rows=3
            :autosize="{ minRows: minRows}"
            @blur="onBlur"
            @keyup.enter.native="identifyText"
         )
         .input-tool
            i.iconfont-laba
            i.iconfont-copy(@click="copyText")
            .identifyText.bd.br(v-if="lang")
               | 识别为
               .lang
                  |  {{ lang }}


      .row.text-from-to
         //- el-select()
         //- el-select()


</template>

<script >
// import _ from "lodash";

export default {
  name: 'SettingsView',
  data(){
    return {
      tudingIsFix: false,
      translateText: "",
      lang: null,
      minRows: 3,
    }
  },
  mounted(){
   const text = window.API.getSelectedText()
   if(text){
      this.translateText = text
   }
  },
  watch: {
   translateText(newVal){
      if(!newVal)
         this.lang = null
   }
  },
  methods: {
      tudingToogle(){
         this.tudingIsFix = !this.tudingIsFix
         window.API.fixWindow(this.tudingIsFix)
      },
      onBlur(){
         if(this.translateText === ""){
            this.$refs.input.focus()
         }
      },
      inputFocus(){
         console.log("inputFocus ==")
         this.$refs.input.focus()
      },
      copyText(){
         if(!this.translateText){
            this.$message("没有要复制的文本")
            return
         }
         window.API.copyText(this.translateText)
         this.$message({
            message: "复制成功",
            type: "success"
         })
      },
      // identifyText: _.debounce(function() {
      //    console.log("啊啊啊啊啊啊啊")
      //    let res = window.API.TranslateIdentify(this.translateText.trim())
      //    this.lang = res.stdout
      // }, 1000)
      identifyText(){
         let res = window.API.TranslateIdentify(this.translateText.trim())
         this.lang = res.stdout
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
   .row{
      background-color: #f6f6f6;
      border-radius: 8px;
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
      padding: 10px 5px;
      margin-top: 30px;
      position: relative;
      .input{
         margin-bottom: 30px;
      }
      .input-tool{
         position: absolute;
         bottom: 10px;
         left: 20px;
         i {
            margin-right: 10px;
            font-size: 16px;
            top: 50%;
         }
         .iconfont-laba{
            font-size: 18px;
         }
         .identifyText{
            display: inline-block;
            padding: 4px 8px;
            font-size: 10px;
            .lang {
               display: inline-block;
               // color: $--color-primary;
            }
         }
      }
   }


}
</style>

<style scoped>
   .main-box >>> .el-textarea > textarea {
      background-color: #f6f6f6;
      border: none;
      width: 100%
   }
   .main-box >>> .el-textarea :focus-within {
      outline: none;
   }
</style>