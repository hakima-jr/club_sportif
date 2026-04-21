import axios from "axios";


const API = axios.create({
  baseURL: "http://localhost:5000/api"
});


export default API;
export const getMemberById = (id) => API.get(`/membres/${id}`);