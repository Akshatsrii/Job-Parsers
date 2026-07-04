import { useCallback, useState } from "react";
import axiosInstance from "../api/axios.js";

export default function useAxios() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const request = useCallback(async (config) => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance(config);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error };
}
