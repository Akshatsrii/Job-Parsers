import axiosInstance from "./axios.js";

export async function parseJobUrl(url, pages = 1) {
  const { data } = await axiosInstance.post("/parser/parse", { url, pages });
  return data;
}

export async function getHistory() {
  const { data } = await axiosInstance.get("/parser/history");
  return data;
}

export async function deleteHistoryItem(id) {
  const { data } = await axiosInstance.delete(`/parser/history/${id}`);
  return data;
}
