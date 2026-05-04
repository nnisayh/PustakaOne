export const fetchUsers = async () => {
  const response = await fetch('/api/admin/users');
  if (!response.ok) throw new Error('Failed to fetch users');
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.users;
};

export const createUser = async (userData: any) => {
  const response = await fetch('/api/admin/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data;
};

export const updateUser = async (userData: any) => {
  const response = await fetch('/api/admin/users', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data;
};

export const deleteUser = async (id: number) => {
  const response = await fetch(`/api/admin/users?id=${id}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data;
};
