<template lang="pug">
    el-container.main
        el-aside.aside(width="200px")
            .settings.text-mid(v-for="setting in settings")
                .group {{ setting.group_label }}
                .item.br(
                    v-for="item in setting.items"
                    :class="{selected: item.selected === true}"
                    @click="switchSettings(item)"
                )
                    template(v-if="item.icon")
                        i(:class="item.icon")
                    | {{ item.label }}
        el-main
            <router-view/>
    </el-container>
</template>



<script>
// @ is an alias to /src
export default {
  name: 'SettingsView',
  data(){
    return {
        settings: [
            {
                group_label: "翻译",
                items: [
                    {
                        icon: "xx",
                        label: "翻译服务",
                        path: "/settings/translate",
                        selected: false
                    }
                ]
            },
            {
                group_label: "通用",
                items: [
                    {
                        icon: "el-icon-setting",
                        label: "通用设置",
                        selected: false
                    }
                ]
            }
        ]
    }
  },
  created(){
    const path = this.$route.path
    this.settings.map((setting) => {
        setting.items.map((item) => {
            if(path === item.path){
                item.selected = true
                return
            }
        })
    })
  },
  methods: {
    switchSettings(item){
        const path = item.path
        if (!path){
            return
        }
        if(this.$route.path !== path){
            this.$router.push(path)
        }

    }
  }
}
</script>

<style lang="scss" scoped>
.main {
    width: 100%;
    height: 100%;
    background: #f0f1f1;

    .aside {
        background: #e6e2e7;
        .menu {
            padding: 20px 10px;
        }
        .settings{
            padding: 5px 20px;
            text-align: left;
            .group{
                color: #bdb9be
            }
            .item{
                margin: 5px 0;
                padding: 2px 20px;
                i {
                    margin-right: 5px;
                }

            }
            .selected{
                background: #619ff9;
                color: #fff;
                cursor: pointer;
            }
        }

    }
}
</style>