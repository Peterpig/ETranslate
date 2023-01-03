<template lang="pug">
    .xxx
        | xxx
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
                        label: "翻译服务"
                    }
                ]
            },
            {
                group_label: "通用",
                items: [
                    {
                        icon: "el-icon-setting",
                        label: "通用设置"
                    }
                ]
            }
        ]
    }
  },
  methods: {
    switch(){
        // this.$route.push({
        //     name:
        // })
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
                .selected{
                    background: #619ff9;
                    color: #fff;
                    cursor: pointer;
                }
            }
        }

    }
}
</style>