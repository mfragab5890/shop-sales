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

export const addNewProduct = (newProduct) => {
  return fetch(`${api}/products/new`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...newProduct,
      created_by: 1
    }),
  }).then(res => res.json())
}

export const getAllProducts = (page=1) =>
  fetch(`${api}/products/all/${page}`, { headers })
    .then(res => res.json())

export const getProductById = (id) =>
  fetch(`${api}/products/search/${id}`, { headers })
    .then(res => res.json())

export const addNewOrder = (newOrder) => {
  return fetch(`${api}/orders/new`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...newOrder,
      created_by: 1
    }),
  }).then(res => res.json())
}

export const getTodayOrders = () =>
  fetch(`${api}/sales/today`, { headers })
    .then(res => res.json())

export const getMonthOrders = () =>
  fetch(`${api}/sales/month`, { headers })
    .then(res => res.json())
