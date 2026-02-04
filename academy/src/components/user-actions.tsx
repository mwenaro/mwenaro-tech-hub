'use client'

import { useState } from 'react'
import { updateUserRole } from '@/lib/admin'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserActions({ userId, currentRole }: { userId: string, currentRole: string }) {
    const [isLoading, setIsLoading] = useState(false)

    const handleRoleChange = async (newRole: 'student' | 'instructor' | 'admin') => {
        setIsLoading(true)
        try {
            await updateUserRole(userId, newRole)
        } catch (error) {
            alert('Failed to update role')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isLoading}>
                    {isLoading ? '...' : 'Manage Role'}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleRoleChange('student')} disabled={currentRole === 'student'}>
                    Demote to Student
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleChange('instructor')} disabled={currentRole === 'instructor'}>
                    Promote to Instructor
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleChange('admin')} className="text-red-600 focus:text-red-600" disabled={currentRole === 'admin'}>
                    Promote to Admin
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
