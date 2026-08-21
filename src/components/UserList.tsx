import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isCancel } from "axios";
import { apiClient } from "../services/apiClient";
import Button from "./Button";
import { FaEdit, FaTrash } from "react-icons/fa";

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Enter a valid email"),
});

type UserFormData = z.infer<typeof userSchema>;

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({ resolver: zodResolver(userSchema) });

  const addUser = handleSubmit((data) => {
    const newUser: User = {
      id: Math.min(0, ...users.map((u) => u.id)) - 1,
      name: data.name,
      username: data.username,
      email: data.email,
    };
    setUsers((prev) => [newUser, ...prev]);
    reset();
    setAdding(false);
  });

  const startEdit = (user: User) => {
    setEditingId(user.id);
    reset({ name: user.name, username: user.username, email: user.email });
  };

  const saveEdit = handleSubmit(async (data) => {
    if (editingId === null) return;
    try {
      const res = await apiClient.put<User>(`users/${editingId}`, { ...data });
      setUsers((prev) =>
        prev.map((u) => (u.id === editingId ? { ...u, ...res.data } : u))
      );
    } catch {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingId
            ? { ...u, name: data.name, username: data.username, email: data.email }
            : u
        )
      );
    }
    setEditingId(null);
    reset();
  });

  const deleteUser = async (id: number) => {
    try {
      await apiClient.delete(`users/${id}`);
    } catch {
      // ponytail: mock API / offline — keep local delete
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (editingId === id) {
      setEditingId(null);
      reset();
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    apiClient
      .get<User[]>("users", { signal: controller.signal })
      .then((res) => setUsers(res.data))
      .catch((err) => {
        if (isCancel(err)) return;
        setError(err.message || "Failed to fetch users");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  if (loading) return <p className="mx-8">Loading users…</p>;
  if (error) return <p className="mx-8 text-red-500">{error}</p>;

  const userFields = (
    <>
      <input
        className="border border-gray-300 rounded px-3 py-2"
        placeholder="Name"
        {...register("name")}
      />
      {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
      <input
        className="border border-gray-300 rounded px-3 py-2"
        placeholder="Username"
        {...register("username")}
      />
      {errors.username && <span className="text-red-500 text-xs">{errors.username.message}</span>}
      <input
        className="border border-gray-300 rounded px-3 py-2"
        placeholder="Email"
        {...register("email")}
      />
      {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
    </>
  );

  return (
    <>
      <div className="mx-8 flex items-center justify-between">
        <h1>Users</h1>
        <Button color="green" onClick={() => setAdding((v) => !v)}>
          {adding ? "Cancel" : "Add User"}
        </Button>
      </div>
      {adding && (
        <form onSubmit={addUser} className="mx-8 my-2 flex flex-col gap-2 w-80">
          {userFields}
          <Button color="blue" type="submit">Save</Button>
        </form>
      )}
      <ul className="w-80 mx-8 text-sm font-medium bg-neutral-primary-soft border border-default rounded-base">
        {users.map((user) => (
          <li
            key={user.id}
            className="px-4 py-2 border-b border-default"
          >
            {editingId === user.id ? (
              <form onSubmit={saveEdit} className="flex flex-col gap-2">
                {userFields}
                <div className="flex gap-2">
                  <Button color="blue" type="submit">Save</Button>
                  <Button color="red" type="button" onClick={() => { setEditingId(null); reset(); }}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-semibold">{user.name}</span>
                  <span className="block text-gray-500">@{user.username} · {user.email}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => startEdit(user)} aria-label={`Edit ${user.name}`}>
                    <FaEdit className="text-blue-500 hover:text-blue-700" />
                  </button>
                  <button onClick={() => deleteUser(user.id)} aria-label={`Delete ${user.name}`}>
                    <FaTrash className="text-red-500 hover:text-red-700" />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

export default UserList;
