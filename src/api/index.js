//首页模块
import axios from '~/axios'

export function getStatistics1(){
    return axios.get("/admin/statistics1")
}