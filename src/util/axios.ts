import axios from "axios";

const customAxios = () =>
  axios.create({
    baseURL:"https://personaltrainerkmm.com/api/admin",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Origin": "https://admin.personaltrainerkmm.com"
    },
    withCredentials: true
  });

export default customAxios;
