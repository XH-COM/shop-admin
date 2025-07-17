import axios from "~/axios"

// 获取图片
export function getImageClassList(page){
    return axios.get("/admin/image_class/"+page)
}


//  创建 新的图片
export function createImageClass(data){
    return axios.post("/admin/image_class",data)
}

//更新图片
export function updateImageClass(id,data){
    return axios.post("/admin/image_class/"+id,data)
}


//删除
export function deleteImageClass(id){
    return axios.post(`/admin/image_class/${id}/delete`)
}