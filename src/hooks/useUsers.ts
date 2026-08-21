import { useCallback, useEffect, useState } from "react";
import { isCancel } from "axios";
import { userService, type User } from "../services/UserService";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    userService
      .getAll(controller.signal)
      .then(setUsers)
      .catch((err) => {
        if (isCancel(err)) return;
        setError(err.message || "Failed to fetch users");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const addUser = useCallback(async (data: Omit<User, "id">) => {
    try {
      const created = await userService.create(data);
      // jsonplaceholder returns id 11; use server data when available
      setUsers((prev) => [created, ...prev]);
      return created;
    } catch {
      // ponytail: offline/mock fallback — local id
      let fallback: User | null = null;
      setUsers((prev) => {
        fallback = { id: Math.min(0, ...prev.map((u) => u.id), 0) - 1, ...data } as User;
        return [fallback, ...prev];
      });
      return fallback!;
    }
  }, []);

  const updateUser = useCallback(async (id: number, data: Partial<User>) => {
    try {
      const updated = await userService.update(id, data);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
      return updated;
    } catch {
      // ponytail: mock API / offline — optimistic local update
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } as User : u)));
      throw new Error("Failed to update user");
    }
  }, []);

  const deleteUser = useCallback(async (id: number) => {
    try {
      await userService.delete(id);
    } catch {
      // ponytail: mock API / offline — keep local delete
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  return { users, loading, error, setUsers, addUser, updateUser, deleteUser };
}
