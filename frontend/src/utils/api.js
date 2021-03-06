import { getToken, setToken, removeToken } from './token'
const api = process.env.REACT_APP_SHOPSALES_API_URL || 'http://localhost:5000'
let token = getToken()
let headers = {
  'Accept': 'application/json',
  'Authorization': 'Bearer ' + token
}

// check if server is running
export const checkServer = () =>
fetch(`${api}/check`, { headers })
  .then(res => res.json()).catch(err => {
    console.warn(err);
    return {
      success: false,
      message: 'Server is not running'
    };
  })

export const getInitialData = () =>{
  const token = getToken()
  headers.Authorization = 'Bearer ' + token
  return fetch(`${api}/`, { headers })
    .then(res => res.json())
}


//user APIs
export const login = (username, password, remember) =>
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
  }).then(async (res) =>{
    const data = await res.json()
    if (data.success === true) {
      setToken(data.token)
      token = data.token
      return data;
    }
    else {
      removeToken()
      return data;
    }

   })

export const logout = () =>
fetch(`${api}/logout`, { headers })
  .then(res => res.json())


export const addNewUser = (user) =>
  fetch(`${api}/users/new`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...user,
    }),
  }).then(res => res.json())

export const getAllUsers = () =>
fetch(`${api}/users/all`, { headers })
  .then(res => res.json())

export const removeUser = (userId) =>
fetch(`${api}/users/delete/${userId}`, {
    method: 'DELETE',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      },
    }).then(res => res.json())

export const editUser = (user) => {
  return fetch(`${api}/users/edit`, {
    method: 'PATCH',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...user,
    }),
  }).then(res => res.json())
}

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
    }),
  }).then(res => res.json())
}
export const editOldProduct = (product, created_by) => {
  return fetch(`${api}/products/edit`, {
    method: 'PATCH',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...product,
      created_by: created_by
    }),
  }).then(res => res.json())
}

export const getPageProducts = (page=1) =>
  fetch(`${api}/products/all/${page}`, { headers })
    .then(res => res.json())

export const getProductById = (id) =>
  fetch(`${api}/products/search/id/${id}`, { headers })
    .then(res => res.json())

export const searchProducts = (searchTerm) =>
  fetch(`${api}/products/search/${searchTerm}`, { headers })
    .then(res => res.json())

export const removeProduct = (productId) =>
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
    }),
  }).then(res => res.json())
}

export const deleteOrder = (orderId) =>
  fetch(`${api}/orders/delete/${orderId}`, {
    method: 'DELETE',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json())

export const getTodayOrders = () =>
  fetch(`${api}/sales/today`, { headers })
    .then(res => res.json())

export const getUserTodayOrders = () =>
  fetch(`${api}/user/sales/today`, { headers })
    .then(res => res.json())

export const getMonthOrders = () =>
  fetch(`${api}/sales/month`, { headers })
    .then(res => res.json())

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
