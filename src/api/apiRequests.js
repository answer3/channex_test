import axios from 'axios'

export const signup = (params) => {
    return axios.post('/api/v1/sign_up', {user: params})
        .then(res => {
            return res
        })
        .catch (error => {
            console.log('error',error)
            return error.response
        })
}