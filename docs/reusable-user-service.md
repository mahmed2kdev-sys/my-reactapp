# Reusable UserService — Class-based Implementation

## Overview
Reusable service pattern wrapping `axios` via a generic `HttpService<T>` class. One class handles all CRUD; per-entity services are single instances.

- `src/services/apiClient.ts:1` — axios instance (baseURL via `VITE_API_BASE_URL`)
- `src/services/HttpService.ts` — generic reusable class
- `src/services/UserService.ts` — `users` instance
- `src/components/UserList.tsx` — consumer

## Implementation

### 1. `src/services/HttpService.ts`
```ts
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
```

Why a class?
- Endpoint injected via constructor — reusable for any resource (`posts`, `todos`, etc.)
- Keeps `apiClient` centralized (headers, baseURL, interceptors)
- `signal` support for `AbortController` cancellation

### 2. `src/services/UserService.ts`
```ts
import HttpService from "./HttpService";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export const userService = new HttpService<User>("users");

// ponytail: instance covers 95% cases. Need custom User logic? Use:
// export class UserService extends HttpService<User> {
//   constructor() { super("users"); }
//   getByUsername(username: string) {
//     return apiClient.get<User[]>(`users?username=${username}`).then(r => r.data[0]);
//   }
// }
// export default new UserService();
```

Usage choice:
- **Instance (current):** `new HttpService<User>("users")` — shortest, no subclass needed.
- **Subclass:** `class UserService extends HttpService<User>` — add only when User needs custom methods.

Add more services in one line:
```ts
export const postService = new HttpService<Post>("posts");
```

### 3. Consumer — `src/components/UserList.tsx`
```ts
import { userService, type User } from "../services/UserService";
import { isCancel } from "axios";

// Fetch
useEffect(() => {
  const controller = new AbortController();
  userService.getAll(controller.signal)
    .then(setUsers)
    .catch(err => {
      if (isCancel(err)) return;
      setError(err.message);
    })
    .finally(() => setLoading(false));
  return () => controller.abort();
}, []);

// Update
const updated = await userService.update(editingId, data);

// Delete
await userService.delete(id);
```

Keeps existing local fallback (`try/catch` → optimistic update) for mock API / offline.

## When to Extend
Skipped: `IHttpService` interface, factory, DI container. Add when:
- 2+ entities diverge (custom endpoints, transforms, caching)
- Then promote to `class UserService extends HttpService<User>` with overrides

### 4. Custom Hook — `src/hooks/useUsers.ts` (with `userService.create`)
```ts
import { useCallback, useEffect, useState } from "react";
import { isCancel } from "axios";
import { userService, type User } from "../services/UserService";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const c = new AbortController();
    userService.getAll(c.signal).then(setUsers).catch(e=>{
      if(isCancel(e)) return; setError(e.message);
    }).finally(()=>setLoading(false));
    return ()=>c.abort();
  }, []);

  const addUser = useCallback(async (data: Omit<User,"id">)=>{
    try {
      const created = await userService.create(data);
      setUsers(p=>[created,...p]); return created;
    } catch {
      // ponytail: offline fallback — local id
      let fallback: User | null = null;
      setUsers(prev => {
        fallback = { id: Math.min(0, ...prev.map(u=>u.id),0)-1, ...data } as User;
        return [fallback, ...prev];
      });
      return fallback!;
    }
  }, []);

  const updateUser = useCallback(async (id:number, data:Partial<User>)=>{
    try { const u=await userService.update(id,data); setUsers(p=>p.map(x=>x.id===id?{...x,...u}:x)); return u; }
    catch { setUsers(p=>p.map(x=>x.id===id?{...x,...data} as User:x)); throw new Error(); }
  }, []);
  const deleteUser = useCallback(async (id:number)=>{
    try { await userService.delete(id); } catch {}
    setUsers(p=>p.filter(x=>x.id!==id));
  }, []);
  return { users, loading, error, setUsers, addUser, updateUser, deleteUser };
}
```

**Refactored `src/components/UserList.tsx`**
```ts
import { useUsers } from "../hooks/useUsers";
const { users, loading, error, addUser: addUserToStore, updateUser, deleteUser } = useUsers();
// Component keeps only form/UI state (react-hook-form, adding/editingId)
// Data fetching + CRUD delegated to hook — reusable across any component
```

Why this split:
- Hook = data + side effects (fetch, AbortController, optimistic fallback)
- Component = UI + validation (zod). No `useEffect`/`apiClient` in component.
- `addUser` now uses `userService.create(data)` (`src/services/HttpService.ts:15`); fallback to local id if offline.
- No `react-query`/`swr` — add when caching/retry needed.

## Verification
```bash
npm run build  # tsc -b && vite build
```
Manual: UserList fetch/edit/delete against `jsonplaceholder.typicode.com` + offline fallback still works.
