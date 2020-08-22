import axios from 'axios'
export const api = (data, apiUrl, method, headerData) => {
    return axios(apiUrl, {
        method: method,
        data: data,
      })
}