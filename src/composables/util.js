import { ElNotification,ElMessageBox } from 'element-plus'
import nprogress from 'nprogress'
// 消息提示
export function toast(message,type = "success",dangerouslyUseHTMLString = true){ // true 渲染
    ElNotification({
        message,
        type,
        dangerouslyUseHTMLString,
        duration:3000
    })
}

// 显示全屏loading
export function showFullLoading(){
  nprogress.start()
}

// 隐藏全屏loading
export function hideFullLoading(){
  nprogress.done()
}

export function showModal(content = "提示内容",type = "warning",title = ""){
    return ElMessageBox.confirm(
        content,
        title,
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type,
        }
      )
}

// 弹出输入框
export function showPrompt(tip,value = ""){
    return ElMessageBox.prompt(tip, '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputValue:value
    })
}