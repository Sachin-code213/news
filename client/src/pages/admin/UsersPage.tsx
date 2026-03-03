import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API, useAuth } from '../../context/AuthContext';
import {
    Users,
    UserPlus,
    ShieldCheck,
    Mail,
    UserCog,
    Trash2,
    UserCircle
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../../components/ui/table';

const UsersPage: React.FC = () => {
    const queryClient = useQueryClient();
    const { token, user: currentUser } = useAuth();

    // 1. Fetch All Users (Existing)
    const { data: users, isLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const { data } = await API.get('/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data.data;
        }
    });

    // 2. Change Role Mutation (Existing)
    const updateRoleMutation = useMutation({
        mutationFn: async ({ id, role }: { id: string; role: string }) => {
            return await API.put(`/api/users/${id}/role`, { role }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            alert("User role updated successfully.");
        }
    });

    // 🚀 NEW: 3. Delete User Mutation (Added safely)
    const deleteUserMutation = useMutation({
        mutationFn: async (id: string) => {
            return await API.delete(`/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            alert("User removed from KhabarPoint successfully.");
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "Failed to delete user. Check server connection.");
        }
    });

    if (isLoading) return <div className="p-10 text-center font-bold animate-pulse text-slate-400">Loading KhabarPoint Team...</div>;

    // ... (Stats and Header remain unchanged)

    return (
        <div className="p-8 space-y-6">
            {/* ... Header and Stats sections remain exactly as you had them ... */}

            <div className="bg-white rounded-xl shadow-lg border-2 border-slate-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-black uppercase text-[10px]">User Details</TableHead>
                            <TableHead className="font-black uppercase text-[10px]">Role</TableHead>
                            <TableHead className="font-black uppercase text-[10px]">Joined Date</TableHead>
                            <TableHead className="text-right font-black uppercase text-[10px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users?.map((u: any) => {
                            // Helper to check if this is the logged-in user
                            const isMe = u._id === currentUser?._id || u._id === currentUser?.id;

                            return (
                                <TableRow key={u._id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                                <UserCircle size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 flex items-center gap-2">
                                                    {u.name} {isMe && <Badge className="bg-blue-500 text-[8px]">YOU</Badge>}
                                                </p>
                                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                                    <Mail size={10} /> {u.email}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={
                                            u.role === 'admin' ? 'bg-red-600' :
                                                u.role === 'staff' ? 'bg-orange-500' : 'bg-slate-400'
                                        }>
                                            <ShieldCheck className="h-3 w-3 mr-1" /> {u.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs font-medium text-slate-500 italic">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {!isMe && ( // Hide actions if it's the current user
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-blue-600"
                                                        onClick={() => {
                                                            const newRole = u.role === 'admin' ? 'staff' : 'admin';
                                                            if (window.confirm(`Change ${u.name}'s role to ${newRole}?`)) {
                                                                updateRoleMutation.mutate({ id: u._id, role: newRole });
                                                            }
                                                        }}
                                                        disabled={updateRoleMutation.isPending}
                                                    >
                                                        <UserCog size={16} />
                                                    </Button>

                                                    {/* 🚀 FIXED DELETE BUTTON */}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-red-600"
                                                        onClick={() => {
                                                            if (window.confirm(`PERMANENTLY remove ${u.name} from KhabarPoint?`)) {
                                                                deleteUserMutation.mutate(u._id);
                                                            }
                                                        }}
                                                        disabled={deleteUserMutation.isPending}
                                                    >
                                                        <Trash2 size={16} className={deleteUserMutation.isPending ? "animate-pulse" : ""} />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default UsersPage;
