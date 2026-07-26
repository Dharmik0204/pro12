import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Users, Search, Shield, Ban, CheckCircle, Trash2, Filter } from 'lucide-react';

const AdminUsers = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users?search=${encodeURIComponent(search)}`);
      if (res.data.success) {
        setUsers(res.data.data.users);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleToggleBlock = async (id, isBlocked) => {
    try {
      const res = await api.patch(`/users/${id}/block`);
      if (res.data.success) {
        showToast(res.data.message, 'success');
        setUsers(users.map(u => u._id === id ? { ...u, isBlocked: !isBlocked } : u));
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to toggle block status', 'error');
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      const res = await api.patch(`/users/${id}/role`, { role });
      if (res.data.success) {
        showToast(res.data.message, 'success');
        setUsers(users.map(u => u._id === id ? { ...u, role } : u));
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to update role', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await api.delete(`/users/${deleteId}`);
      if (res.data.success) {
        showToast('User account deleted successfully', 'success');
        setUsers(users.filter(u => u._id !== deleteId));
        setDeleteId(null);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to delete user', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center">
            <Users className="mr-2 text-orange-accent" size={22} /> User Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage customer accounts, roles, and security access.</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs rounded-xl pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-light dark:text-white"
          />
          <Search className="absolute left-3 top-3 text-slate-400" size={15} />
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        {loading ? (
          <div className="text-center py-10 text-xs text-slate-400">Loading registered users...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">No users found matching your search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-navy-dark text-orange-accent flex items-center justify-center font-black text-xs shrink-0">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-100">{u.name}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{u.phone}</td>
                    <td className="py-3 px-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] px-2 py-1 font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-3">
                      {u.isBlocked ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/10 text-rose-500 flex items-center w-max">
                          <Ban size={12} className="mr-1" /> Blocked
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 flex items-center w-max">
                          <CheckCircle size={12} className="mr-1" /> Active
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleBlock(u._id, u.isBlocked)}
                          className={`p-1.5 rounded-xl border text-xs font-bold transition ${
                            u.isBlocked
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20'
                          }`}
                          title={u.isBlocked ? 'Unblock User' : 'Block User'}
                        >
                          <Ban size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(u._id)}
                          className="p-1.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 transition"
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Delete User Account?</h3>
            <p className="text-xs text-slate-400">Are you sure you want to permanently delete this user account? This action cannot be undone.</p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-700 shadow-md"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;
