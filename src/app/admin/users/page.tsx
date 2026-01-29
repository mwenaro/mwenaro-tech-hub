import { getAllUsers } from '@/lib/admin'
import { Card } from '@/components/ui/card'
import { RoleBadge } from '@/components/role-badge' // We'll make this small component or inline it
import { UserActions } from '@/components/user-actions'

export default async function UsersPage() {
    const users = await getAllUsers()

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto p-8">
                <h1 className="text-3xl font-black mb-8">User Management</h1>

                <Card className="overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-muted">
                            <tr>
                                <th className="text-left p-4">Email</th>
                                <th className="text-left p-4">Current Role</th>
                                <th className="text-left p-4">Joined</th>
                                <th className="text-right p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase
                                            ${user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                user.role === 'instructor' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-gray-100 text-gray-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-muted-foreground">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <UserActions userId={user.id} currentRole={user.role} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
        </div>
    )
}
