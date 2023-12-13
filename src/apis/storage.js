import service from '@/utils/request.js'
export const GetToken =()=>{
    return localStorage.getItem('token')
}
export const SetToken =(data)=>{
    return localStorage.setItem('token',data)
}
export const RemoveToken = (data)=>{
    return localStorage.removeItem('token')
}