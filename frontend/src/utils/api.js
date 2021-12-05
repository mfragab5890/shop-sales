const api = process.env.REACT_APP_SHOP_SALES_API_URL || 'http://localhost:5000'

let token = localStorage.token

if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

export const getHomeData = () =>
  fetch(`${api}/`, { headers })
    .then(res => res.json())
