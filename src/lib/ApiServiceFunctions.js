import { toast } from "sonner";
import axios from "axios";

const authModeDev = false;

let storedToken = "";
let refreshToken = "";

const handleError = (error) => {
  const errMsg =
    typeof error.response?.data?.detail === "string"
      ? error.response?.data?.detail
      : error.message;
  const message = errMsg || "An error occurred";

  if (
    error?.response?.status === 404 ||
    errMsg.includes(
      "An unexpected error occurred while searching the hierarchy"
    )
  ) {
    throw error;
  } else {
    toast.error(message)
  }

  throw error;
};

const ApiService = {
  setToken: (token) => {
    storedToken = token;
  },
  getAcessToken: () => {
    return authModeDev
      ? storedToken || localStorage.getItem("token")
      : storedToken;
  },
  setRefreshToken: (token) => {
    refreshToken = token;
  },
  getRefreshToken: () => {
    return authModeDev
      ? refreshToken || localStorage.getItem("refresh_token")
      : refreshToken;
  },
  get: async (url, { params = {}, headers = {} } = {}) => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${ApiService?.getAcessToken()}`,
          ...headers,
        },
        params, // Pass params directly to axiosP
      });
      return response;
    } catch (error) {
      console.error("Errrorrrrrr", error);
      return handleError(error);
    }
  },
  post: async (url, data, headers) => {
    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${ApiService?.getAcessToken()}`,
          ...headers,
        },
      });
      return response;
    } catch (error) {
      return handleError(error);
    }
  },
  put: async (url, data, headers) => {
    try {
      const response = await axios.put(url, data, {
        headers: {
          Authorization: `Bearer ${ApiService?.getAcessToken()}`,
          ...headers,
        },
      });
      return response;
    } catch (error) {
      return handleError(error);
    }
  },
  delete: async (url) => {
    try {
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${ApiService?.getAcessToken()}`,
          // Adjust the headers based on your API requirements
        },
      });
      return response;
    } catch (error) {
      return handleError(error);
    }
  },
};

export default ApiService;
