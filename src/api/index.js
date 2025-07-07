//首页模块
import axios from '~/axios'

export function getStatistics1(){
    return axios.get("/admin/statistics1")
}

// 近 一周 月 24小时
export  function getStatistics3(type){
    return axios.get("/admin/statistics3?type="+type)
}

// 近 一周 月 24小时
export  function getStatistics2(type){
    return axios.get("/admin/statistics3")
}