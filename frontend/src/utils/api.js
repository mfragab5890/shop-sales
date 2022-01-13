import { getToken } from './token'
const api = process.env.REACT_APP_SHOP_SALES_API_URL || 'http://localhost:5000'

let token = getToken()
console.log(token);
const headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer ' + token
}

export const getHomeData = () =>
  fetch(`${api}/`, { headers })
    .then(res => res.json())

//user APIs
export const login = (username, password, remember=false) =>
  fetch(`${api}/login`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
      remember,
    }),
  }).then(res => res.json())

export const logout = (username) =>
  fetch(`${api}/logout`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
    }),
  }).then(res => res.json())

export const saveNewUser = (user) =>
  fetch(`${api}/user/new`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...user,
    }),
  }).then(res => res.json())

//products APIs
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
  fetch(`${api}/products/search/id/${id}`, { headers })
    .then(res => res.json())

export const searchProducts = (searchTerm) =>
  fetch(`${api}/products/search/${searchTerm}`, { headers })
    .then(res => res.json())

export const deleteProduct = (productId) =>
fetch(`${api}/products/delete/${productId}`, {
    method: 'DELETE',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      },
    }).then(res => res.json())

//orders APIs
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

export const deleteOrder = (orderId) =>
  fetch(`${api}/orders/delete/${orderId}`, {
    method: 'DELETE',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json())

export const getPeriodOrders = (periodFrom, periodTo) =>
  fetch(`${api}/sales/period`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      periodFrom,
      periodTo,
    }),
  }).then(res => res.json())
