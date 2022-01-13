export const setToken = (token) => {
  localStorage.setItem('token', token);
}

export const getToken = () => {
  const userToken = localStorage.getItem('token');
  return (userToken && userToken)
}

export const removeToken = () => {
  localStorage.removeItem("token");
}
