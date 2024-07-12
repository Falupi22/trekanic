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
  logout: function () {
    return axiosApi.post("logout")
  },
  getAppointments: function () {
    return axiosApi.get("appointment")
  },
  getAppointmentsOfAllUsers: function (month: number, year: number) {
    return axiosApi.get(`appointment/${month}/${year}`)
  },
  cancelAppointment: function (id: string) {
    return axiosApi.delete(`appointment/delete/${id}`)
  },
  getIssues: function () {
    return axiosApi.get("appointment/issue")
  },
  createAppointment: function (appointment) {
    return axiosApi.post("appointment/create", appointment)
  },
  editAppointment: function (appointmentId, appointmentPatch) {
    return axiosApi.patch("appointment/edit", {
      appointmentId,
      appointmentPatch,
    })
  },
  getTakenDates: function () {
    return axiosApi.get("appointment/taken-time")
  },
  getMechanics: function () {
    return axiosApi.get("appointment/mechanic")
  },
}

export default api
