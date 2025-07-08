

//是否有权限
function hasPermission(value,el=false){
    if(!Array.isArray(value)){
        throw new Error("需要配置权限,例如v-permission");
    }
}

// 权限

export default {
    install(app){
        app.directive("permission",{
            mounted(el,binding){
                console.log("app permission")
                // console.log(el,binding)
                binding.value
            }
        })
    }
}