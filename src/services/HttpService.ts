import { apiClient } from "./apiClient";

class HttpService<T> {
  private endpoint: string;
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }
  // ponytail: generic holds endpoint, per-entity subclass only if custom methods needed
  getAll(signal?: AbortSignal) {
    return apiClient.get<T[]>(this.endpoint, { signal }).then((r) => r.data);
  }
  get(id: number) {
    return apiClient.get<T>(`${this.endpoint}/${id}`).then((r) => r.data);
  }
  create(data: Omit<T, "id">) {
    return apiClient.post<T>(this.endpoint, data).then((r) => r.data);
  }
  update(id: number, data: Partial<T>) {
    return apiClient.put<T>(`${this.endpoint}/${id}`, data).then((r) => r.data);
  }
  delete(id: number) {
    return apiClient.delete(`${this.endpoint}/${id}`);
  }
}

export default HttpService;
