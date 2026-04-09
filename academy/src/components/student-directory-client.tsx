'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { 
    Search,
    Users,
    BookOpen,
    GraduationCap,
    Filter,
    ArrowUpDown,
    CheckCircle2,
    Clock,
    LayoutGrid,
    List
} from 'lucide-react'
import { EnrolledStudent, CohortAnalytics } from '@/lib/instructor'
import { CohortPulseGrid } from './cohort-pulse-grid'
import { StudentMasterySlideover } from './student-mastery-slideover'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface StudentDirectoryClientProps {
    initialStudents: EnrolledStudent[]
    initialAnalytics: CohortAnalytics[]
}

type SortField = 'name' | 'progress' | 'grade' | 'enrolled_at'
type SortOrder = 'asc' | 'desc'

export function StudentDirectoryClient({ initialStudents, initialAnalytics }: StudentDirectoryClientProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [cohortFilter, setCohortFilter] = useState('all')
    const [courseFilter, setCourseFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [sortField, setSortField] = useState<SortField>('enrolled_at')
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
    const [viewMode, setViewMode] = useState<'list' | 'pulse'>('list')
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null)

    // Get unique courses and cohorts for filtering
    const courses = useMemo(() => Array.from(new Set(initialStudents.map(s => s.course_title))), [initialStudents])
    const cohorts = useMemo(() => Array.from(new Set(initialStudents.map(s => s.cohort_name))), [initialStudents])

    const filteredAndSortedStudents = useMemo(() => {
        let result = initialStudents.filter(student => {
            const matchesSearch =
                student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.email.toLowerCase().includes(searchQuery.toLowerCase())
            
            const matchesCohort = cohortFilter === 'all' || student.cohort_name === cohortFilter
            const matchesCourse = courseFilter === 'all' || student.course_title === courseFilter
            const matchesStatus = statusFilter === 'all' || 
                (statusFilter === 'completed' && student.is_completed) || 
                (statusFilter === 'in-progress' && !student.is_completed)

            return matchesSearch && matchesCohort && matchesCourse && matchesStatus
        })

        // Sorting
        result.sort((a, b) => {
            let comparison = 0
            if (sortField === 'name') {
                const nameA = a.full_name || ''
                const nameB = b.full_name || ''
                comparison = nameA.localeCompare(nameB)
            } else if (sortField === 'progress') {
                comparison = a.progress - b.progress
            } else if (sortField === 'grade') {
                comparison = a.average_grade - b.average_grade
            } else if (sortField === 'enrolled_at') {
                comparison = new Date(a.enrolled_at).getTime() - new Date(b.enrolled_at).getTime()
            }

            return sortOrder === 'asc' ? comparison : -comparison
        })

        return result
    }, [initialStudents, searchQuery, cohortFilter, courseFilter, statusFilter, sortField, sortOrder])

    const completionRate = initialStudents.length > 0
        ? Math.round((initialStudents.filter(s => s.is_completed).length / initialStudents.length) * 100)
        : 0

    const getInitials = (name: string | null, email: string) => {
        if (name) {
            return name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)
        }
        return email.substring(0, 2).toUpperCase()
    }

    const toggleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortOrder('desc')
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)} className="w-full sm:w-auto">
                    <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                        <TabsTrigger value="list" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-lg font-black text-[10px] uppercase tracking-widest gap-2">
                            <List className="w-4 h-4" />
                            Directory
                        </TabsTrigger>
                        <TabsTrigger value="pulse" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-lg font-black text-[10px] uppercase tracking-widest gap-2">
                            <LayoutGrid className="w-4 h-4" />
                            Pulse View
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
                
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-2xl border border-primary/10">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-primary tracking-widest">Real-time Mastery Tracking Active</span>
                </div>
            </div>

            {viewMode === 'pulse' ? (
                <CohortPulseGrid cohorts={initialAnalytics} />
            ) : (
                <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-1">Total Students</p>
                            <p className="text-xl font-black">{initialStudents.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary/10 rounded-xl">
                            <BookOpen className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-1">Courses</p>
                            <p className="text-xl font-black">{courses.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/10 rounded-xl">
                            <Filter className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-1">Cohorts</p>
                            <p className="text-xl font-black">{cohorts.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-xl">
                            <GraduationCap className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-1">Avg Completion</p>
                            <p className="text-xl font-black">{completionRate}%</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters Dashboard */}
            <Card className="p-6 border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm space-y-4">
                <div className="flex flex-col lg:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            placeholder="Find student by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 h-12 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl font-medium shadow-sm"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                        <Select value={courseFilter} onValueChange={setCourseFilter}>
                            <SelectTrigger className="flex-1 lg:w-[180px] h-12 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl font-bold">
                                <SelectValue placeholder="All Courses" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">All Courses</SelectItem>
                                {courses.map(course => (
                                    <SelectItem key={course} value={course}>{course}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={cohortFilter} onValueChange={setCohortFilter}>
                            <SelectTrigger className="flex-1 lg:w-[150px] h-12 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl font-bold">
                                <SelectValue placeholder="All Cohorts" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">All Cohorts</SelectItem>
                                {cohorts.map(cohort => (
                                    <SelectItem key={cohort} value={cohort}>{cohort}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="flex-1 lg:w-[150px] h-12 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-xl font-bold">
                                <SelectValue placeholder="Any Status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">Any Status</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>

            {/* Student Table */}
            <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl">
                <div className="max-h-[700px] overflow-y-auto">
                    <Table>
                        <TableHeader className="bg-zinc-50 dark:bg-zinc-900/90 sticky top-0 z-10">
                            <TableRow className="border-zinc-200 dark:border-zinc-800">
                                <TableHead onClick={() => toggleSort('name')} className="cursor-pointer hover:text-primary transition-colors font-bold text-zinc-900 dark:text-zinc-100 h-14 w-[30%]">
                                    <div className="flex items-center gap-2">
                                        Student
                                        {sortField === 'name' && <ArrowUpDown className="w-3 h-3" />}
                                    </div>
                                </TableHead>
                                <TableHead className="font-bold text-zinc-900 dark:text-zinc-100">Course & Cohort</TableHead>
                                <TableHead onClick={() => toggleSort('progress')} className="cursor-pointer hover:text-primary transition-colors font-bold text-zinc-900 dark:text-zinc-100 w-[15%]">
                                    <div className="flex items-center gap-2">
                                        Progress
                                        {sortField === 'progress' && <ArrowUpDown className="w-3 h-3" />}
                                    </div>
                                </TableHead>
                                <TableHead onClick={() => toggleSort('grade')} className="cursor-pointer hover:text-primary transition-colors font-bold text-zinc-900 dark:text-zinc-100 w-[12%]">
                                    <div className="flex items-center gap-2">
                                        Grade
                                        {sortField === 'grade' && <ArrowUpDown className="w-3 h-3" />}
                                    </div>
                                </TableHead>
                                <TableHead className="font-bold text-zinc-900 dark:text-zinc-100 w-[15%] text-right pr-8">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAndSortedStudents.length > 0 ? (
                                filteredAndSortedStudents.map((student) => (
                                    <TableRow 
                                        key={student.id} 
                                        className="border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer"
                                        onClick={() => setSelectedStudent({
                                            user_id: student.id,
                                            full_name: student.full_name,
                                            email: student.email,
                                            cohort_name: student.cohort_name,
                                            course_id: student.course_id
                                        })}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                                    {getInitials(student.full_name, student.email)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-zinc-900 dark:text-white leading-none mb-1">
                                                        {student.full_name || 'Student'}
                                                    </p>
                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium font-mono">
                                                        {student.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-zinc-900 dark:text-white truncate max-w-[200px]">{student.course_title}</p>
                                                <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-[9px] uppercase tracking-wider flex items-center w-fit gap-1 h-5 px-1.5">
                                                    <Users className="w-2.5 h-2.5" />
                                                    {student.cohort_name}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 min-w-[60px]">
                                                    <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-700 ease-out ${
                                                                student.progress === 100 ? 'bg-green-500' : 'bg-primary'
                                                            }`}
                                                            style={{ width: `${student.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="text-xs font-black font-mono w-8">{student.progress}%</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {student.average_grade > 0 ? (
                                                <span className={`text-sm font-black ${
                                                    student.average_grade >= 80 ? 'text-green-500' : 
                                                    student.average_grade >= 60 ? 'text-blue-500' : 'text-zinc-500'
                                                }`}>
                                                    {student.average_grade}%
                                                </span>
                                            ) : (
                                                <span className="text-zinc-400 text-xs italic">Pending</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            {student.is_completed ? (
                                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 font-bold text-[10px] uppercase gap-1">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Completed
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 font-bold text-[10px] uppercase gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    Active
                                                </Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-96 text-center">
                                        <div className="flex flex-col items-center justify-center text-zinc-400">
                                            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4">
                                                <Users className="w-8 h-8 opacity-20" />
                                            </div>
                                            <p className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Zero Results Found</p>
                                            <p className="text-sm font-medium">Refine your search or adjust the filters applied.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
            </>
            )}

            {selectedStudent && (
                <StudentMasterySlideover 
                    isOpen={!!selectedStudent}
                    onOpenChange={(open) => !open && setSelectedStudent(null)}
                    student={selectedStudent}
                />
            )}
        </div>
    )
}
