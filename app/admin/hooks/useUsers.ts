import { useState, useEffect, useCallback } from 'react';
import { fetchUsers, createUser, updateUser, deleteUser } from '../lib/api';

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data pengguna');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const addUser = async (userData: any) => {
    try {
      // API expects a password for new users. Normally this might be sent via email or generated.
      // We will generate a default one here or expect it in userData.
      const payload = {
        password: "password123", // default password
        ...userData
      };
      await createUser(payload);
      await loadUsers(); // Refresh the list
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const editUser = async (userData: any) => {
    try {
      await updateUser(userData);
      await loadUsers();
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const removeUser = async (id: number) => {
    try {
      await deleteUser(id);
      await loadUsers();
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  return {
    users,
    setUsers, // allow manual optimistic updates if needed
    isLoading,
    error,
    addUser,
    editUser,
    removeUser,
    refresh: loadUsers
  };
}
