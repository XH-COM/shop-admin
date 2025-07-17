import { ref } from 'vue'
import { useRoute, onBeforeRouteUpdate ,useRouter } from 'vue-router';
import { useCookies } from '@vueuse/integrations/useCookies'
// import { router } from '~/router';

export function useTabList() {
    const route = useRoute()
    const cookie = useCookies()
    //我加的
    const  router= useRouter()

    const activeTab = ref(route.path)
    const tabList = ref([
        {
            title: '后台首页',
            path: "/"
        },
    ])

    // 添加标签导航
    function addTab(tab) {
        let noTab = tabList.value.findIndex(t => t.path == tab.path) == -1
        if (noTab) {
            tabList.value.push(tab)
        }

        cookie.set("tabList", tabList.value)
    }

    // 初始化标签导航列表
    function initTabList() {
        let tbs = cookie.get("tabList")
        if (tbs) {
            tabList.value = tbs
        }
    }

    initTabList()

    onBeforeRouteUpdate((to, from) => {
        activeTab.value = to.path
        addTab({
            title: to.meta.title,
            path: to.path
        })
    })

    const changeTab = (t) => {
        console.log(route.path);
        activeTab.value = t
        router.push(t)
    }

    const removeTab = (t) => {
        // 1. 获取当前的标签列表
        let tabs = tabList.value
        // 2. 获取当前激活标签的路径
        let a = activeTab.value
        // 3. 检查当前激活的标签路径是否与要移除的标签路径相同
        if (a == t) {
            tabs.forEach((tab, index) => {
                // 找到要移除的标签
                if (tab.path == t) {
                    // 尝试获取下一个标签，如果下一个标签不存在，则获取上一个标签
                    const nextTab = tabs[index + 1] || tabs[index - 1]
                    // 将新的激活标签路径更新为下一个或上一个标签的路径
                    if (nextTab) {
                        a = nextTab.path
                    }
                }
            })
        }
        // 4. 更新激活标签的路径

        activeTab.value = a
        // 5. 过滤掉要移除的标签，更新标签列表
        tabList.value = tabList.value.filter(tab => tab.path != t)
        // 6. 将更新后的标签列表存储到 cookie 中
        cookie.set("tabList", tabList.value)

        console.log("手动更新路由")
        // 手动更新路由
        router.push(a)

    }

    const handleClose = (c) => {
        if (c == "clearAll") {
            // 切换回首页
            activeTab.value = "/"
            // 过滤只剩下首页
            tabList.value = [{
                title: '后台首页',
                path: "/"
            }]
        } else if (c == "clearOther") {
            // 过滤只剩下首页和当前激活
            tabList.value = tabList.value.filter(tab => tab.path == "/" || tab.path == activeTab.value)
        }
        cookie.set("tabList", tabList.value)
        // 手动更新路由  全部关闭的
        router.push(activeTab.value)
    }

    return {
        activeTab,
        tabList,
        changeTab,
        removeTab,
        handleClose
    }
}