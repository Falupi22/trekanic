import axios from "axios"

const axiosApi = axios.create({
  baseURL: "http://localhost:8765/",
  withCredentials: true,
})

const api = {
  login: function (email, password) {
    return axiosApi.post(
      "login",
      {
        email: email,
        password: password,
      },
      {
        headers: {
          "Content-type": "application/json",
        },
      },
    )
  },
  authenticate: function () {
    return axiosApi.get("authenticate")
  },
}

export default api
