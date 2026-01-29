
export function RoleBadge({ role }: { role: string }) {
    const styles = {
        admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        instructor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
        student: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }

    const className = styles[role as keyof typeof styles] || styles.student

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${className}`}>
            {role}
        </span>
    )
}
