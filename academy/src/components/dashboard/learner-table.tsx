"use client"

import * as React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Filter, AlertCircle, TrendingUp, GraduationCap } from "lucide-react"
import { EnrolledStudent } from "@/lib/instructor"

interface LearnerTableProps {
    students: EnrolledStudent[]
}

export function LearnerTable({ students }: LearnerTableProps) {
    const [search, setSearch] = React.useState("")
    const [cohortFilter, setCohortFilter] = React.useState("all")

    const cohorts = React.useMemo(() => {
        const unique = new Set(students.map((s) => s.cohort_name))
        return Array.from(unique)
    }, [students])

    const filteredStudents = React.useMemo(() => {
        return students.filter((s) => {
            const matchesSearch = 
                s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
                s.email.toLowerCase().includes(search.toLowerCase())
            const matchesCohort = cohortFilter === "all" || s.cohort_name === cohortFilter
            return matchesSearch && matchesCohort
        })
    }, [students, search, cohortFilter])

    const getStatusBadge = (progress: number, grade: number) => {
        if (progress === 100) return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>
        if (progress < 10 || grade < 40) return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">At Risk</Badge>
        if (progress > 50) return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">On Track</Badge>
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Early Stage</Badge>
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 p-6 rounded-2xl bg-white/50 dark:bg-card/50 backdrop-blur-sm border border-white/20 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-10 h-11 bg-background/50 border-white/20 focus-visible:ring-primary rounded-xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <Select value={cohortFilter} onValueChange={setCohortFilter}>
                        <SelectTrigger className="w-[200px] h-11 bg-background/50 border-white/20 rounded-xl">
                            <SelectValue placeholder="All Cohorts" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Cohorts</SelectItem>
                            {cohorts.map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-card/30 backdrop-blur-md overflow-hidden shadow-2xl">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow className="border-b border-white/5">
                            <TableHead className="w-[300px] font-bold text-xs uppercase tracking-wider py-4">Learner</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider py-4">Cohort</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider py-4">Mastery Progress</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-center">Avg. Grade</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider py-4">Health Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <TableRow key={student.id} className="hover:bg-white/5 transition-colors group cursor-default border-b border-white/5 last:border-0">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/20">
                                                <AvatarFallback className="font-bold text-xs">
                                                    {student.full_name?.charAt(0).toUpperCase() || student.email.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm group-hover:text-primary transition-colors">{student.full_name || "Anonymous"}</span>
                                                <span className="text-xs text-muted-foreground">{student.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold">{student.cohort_name}</span>
                                            <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">{student.course_title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="space-y-2 w-[200px]">
                                            <div className="flex justify-between text-[10px] font-bold">
                                                <span>Level Progress</span>
                                                <span>{student.progress}%</span>
                                            </div>
                                            <Progress value={student.progress} className="h-1.5 bg-muted/30" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 text-center">
                                        <div className="inline-flex items-center justify-center p-2 rounded-xl bg-primary/5 border border-primary/10 min-w-[50px]">
                                            <span className={`text-sm font-black ${student.average_grade >= 80 ? 'text-green-500' : student.average_grade >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                                                {student.average_grade}%
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        {getStatusBadge(student.progress, student.average_grade)}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                                    No learners found matching your search criteria.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
