<template lang="pug">
.main-box
   .tool-bar
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
         @keyup.enter.native="Translate"
      )
      .input-tool
         i.iconfont-laba
         i.iconfont-copy(@click="copyText")
         .identifyText.bd.br(v-show="lang")
            | 识别为
            .lang
               |  {{ lang }}

   .row.plugins.mt(v-for="(plugin, pluginName) in plugins")
      .header
         .left
            el-image.image.bd.br(
               :src="require(`@/plugins/${plugin.name}/assets/icon.svg`)"
            )
            .ml
               | {{ plugin.cn_name }}

         i.loading.iconfont-loading(v-if="plugin.loading")
         i.iconfont-arrow(
            :class="{'arrow-down': plugin.fold === false,'arrow-left': plugin.fold === true}"
            @click="toogleFold(plugin)"
         )
      .info(v-if="plugin.res" v-show="!plugin.fold && plugin.res")
         .ori
            | {{ plugin.res.ori }}
         .web(v-if="plugin.res.web && plugin.res.web.length > 0")
            | 网络释义:
            .web-content
               .content.mt(v-for="web in plugin.res.web")
                  | {{ web }}



   .row.text-from-to
      //- el-select()
      //- el-select()


</template>

<script >
import _ from "lodash";

export default {
  data(){
    return {
      tudingIsFix: false,
      translateText: "",
      lang: null,
      minRows: 3,
      plugins: {},
    }
  },
  mounted(){
      window.API.getSelectedText().then((text)=>{
            if(text){
            this.translateText = text
            this.Translate()
         }
      })
      let plugins_ = {}
      window.API.getTranslatePlugins().then((plugins) => {
         if(!plugins){
            return
         }
         plugins.map((plugin) => {
            plugin.fold = true
            plugin.res = null
            plugin.loading = false
            plugins_[plugin.name] = plugin
         })

         this.plugins = plugins_

      })
      this.tudingToogle()
  },
  watch: {
   translateText(newVal, oldVal){
      if(!newVal){
         this.lang = null
         this.resetPlugins()
      }

      if(newVal.trim() !== oldVal.trim())
         this.identifyText()
   }
  },
  methods: {
      tudingToogle(){
         this.tudingIsFix = !this.tudingIsFix
         window.API.fixTranslateWindowToogle(this.tudingIsFix)
      },
      onBlur(){
         if(this.translateText === ""){
            this.$refs.input.focus()
         }
      },
      inputFocus(){
         this.$refs.input.focus()
      },
      copyText(){
         if(!this.translateText){
            this.$message({"message": "没有要复制的文本", "duration": 0})
            return
         }
         window.API.copyText(this.translateText)
         this.$message({
            message: "复制成功",
            type: "success"
         })
      },
      identifyText: _.debounce(async function() {
         const text = this.translateText.trim()
         if(!text)return
         window.API.TranslateIdentify(text).then((res) => {
            this.lang = res.stdout
         })
      }, 1000),
      Translate(){
         for( let pluginName in this.plugins){
            let plugin = this.plugins[pluginName]
            plugin.loading = true
            window.API.exec(`${pluginName} ${this.translateText}`).then((res)=> {
               if(res){
                  plugin.res = res
                  plugin.loading = false
                  plugin.fold =  false
               }

            })
         }

      },
      toogleFold(plugin){
         plugin.fold = plugin.fold !== undefined ? !plugin.fold : false
      },
      resetPlugins(){
         console.log("resetPlugins == ")
         // let plugins = this.plugins.map((plugin) => {
         //    plugin.fold = true
         //    plugin.res = null
         //    return plugin
         // })
         let plugins = {}
         for( let pluginName in this.plugins){
            let plugin = this.plugins[pluginName]
            plugin.fold = true
            plugin.res = null
            plugins[pluginName] = plugin
         }
         this.plugins = plugins
      }
  }
}
</script>

<style lang="scss" scoped>
.main-box{
   text-align: left;
   padding: 10px;
   i {
      font-size: 20px;
   }
   .row{
      background-color: #f1f1f1;
      border-radius: 8px;
   }
   .iconfont-tuding-fix{
      color: #409EFF
   }
   .tool-bar{
      -webkit-app-region: drag;
      display: flex;
      .left {
         width: 50%;

      }
      .right {
         margin-right: 0;
         text-align: right;
      }
   }
   .text-box{
      padding: 10px 5px;
      position: relative;
      .input{
         margin-bottom: 30px;
      }
      .input-tool{
         position: absolute;
         bottom: 10px;
         left: 10px;
         display: flex;
         flex-wrap: nowrap;
         align-items: center;
         i {
            margin-right: 10px;
            font-size: 16px;
            top: 50%;
         }
         .iconfont-laba{
            font-size: 18px;
         }
         .identifyText{
            padding: 3px 8px;
            font-size: 10px;
            display: flex;
            flex-wrap: nowrap;
            .lang {
               color: $--color-primary;
            }
         }
      }
   }

   .plugins {
      text-align: left;
      .header {
         padding: 5px 10px;
         display: flex;
         justify-content: space-between;
         align-content: center;
         align-items: center;

         .left{
            display: flex;
            align-content: center;
            align-items: center;
            .image{
               widows: 12px;
               height: 12px;
            }
         }
         .loading{
            transform: rotate(0deg);
            animation: rotation 3s linear infinite;
            height: 20px;
         }
         .iconfont-arrow{
            font-size: 14px;
         }
         .arrow-down{
            @include changeDirection(-90deg, .3s)
         }
         .arrow-left{
            @include changeDirection(0deg, .3s)
         }
      }
      .el-divider--horizontal{
         margin: 0;
      }
      .info {
         padding: 10px;
         background-color: #f6f6f6;
         .ori {
            font-size: 18px
         }
         .web {
            display: flex;
            align-items: baseline;
            .web-content {
               margin: 0 10px;
            }
         }
      }

   }


}
</style>

<style scoped>
   .main-box >>> .el-textarea > textarea {
      background-color: #f1f1f1;
      border: none;
      width: 100%
   }
   .main-box >>> .el-textarea :focus-within {
      outline: none;
   }
</style>