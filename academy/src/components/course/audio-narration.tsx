'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, FastForward, Rewind, Settings2 } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface AudioNarrationProps {
    url: string
    title?: string
}

export function AudioNarration({ url, title }: AudioNarrationProps) {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [playbackRate, setPlaybackRate] = useState(1)
    const [isMuted, setIsMuted] = useState(false)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const updateTime = () => setCurrentTime(audio.currentTime)
        const updateDuration = () => setDuration(audio.duration)
        const onEnd = () => setIsPlaying(false)

        audio.addEventListener('timeupdate', updateTime)
        audio.addEventListener('loadedmetadata', updateDuration)
        audio.addEventListener('ended', onEnd)

        return () => {
            audio.removeEventListener('timeupdate', updateTime)
            audio.removeEventListener('loadedmetadata', updateDuration)
            audio.removeEventListener('ended', onEnd)
        }
    }, [])

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause()
            } else {
                audioRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const handleSeek = (value: number[]) => {
        if (audioRef.current) {
            audioRef.current.currentTime = value[0]
            setCurrentTime(value[0])
        }
    }

    const skip = (amount: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime += amount
        }
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const speeds = [0.75, 1, 1.25, 1.5, 2]

    return (
        <div className="group relative mb-8 overflow-hidden rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40 p-1 backdrop-blur-sm transition-all duration-300 hover:bg-white/60 dark:hover:bg-zinc-900/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.1)]">
            <audio ref={audioRef} src={url} />
            
            <div className="flex flex-col gap-3 p-4 md:p-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">
                            AI Voice Narration
                        </span>
                        <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[200px] md:max-w-md">
                            {title || 'Lesson Overview'}
                        </h4>
                    </div>

                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 text-zinc-500">
                                    <Settings2 className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50 rounded-xl">
                                <div className="p-2 px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Playback Speed</div>
                                {speeds.map((speed) => (
                                    <DropdownMenuItem
                                        key={speed}
                                        onClick={() => {
                                            if (audioRef.current) {
                                                audioRef.current.playbackRate = speed
                                                setPlaybackRate(speed)
                                            }
                                        }}
                                        className={cn(
                                            "rounded-lg font-bold text-sm cursor-pointer",
                                            playbackRate === speed ? "text-primary bg-primary/10" : "text-zinc-600 dark:text-zinc-400"
                                        )}
                                    >
                                        {speed}x
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Slider
                        value={[currentTime]}
                        max={duration || 100}
                        step={0.1}
                        onValueChange={handleSeek}
                        className="py-2"
                    />
                    <div className="flex justify-between text-[11px] font-bold tabular-nums text-zinc-400">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-4 md:gap-8 mt-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => skip(-10)}
                        className="h-9 w-9 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    >
                        <Rewind className="h-4 w-4 fill-current" />
                    </Button>

                    <Button
                        onClick={togglePlay}
                        className={cn(
                            "h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95",
                            isPlaying 
                                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" 
                                : "bg-primary text-white shadow-primary/20"
                        )}
                        size="icon"
                    >
                        {isPlaying ? (
                            <Pause className="h-6 w-6 fill-current" />
                        ) : (
                            <Play className="h-6 w-6 fill-current ml-1" />
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => skip(10)}
                        className="h-9 w-9 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    >
                        <FastForward className="h-4 w-4 fill-current" />
                    </Button>
                </div>
            </div>

            {/* Subtle background glow */}
            <div className="absolute -right-4 -top-4 h-24 w-24 bg-primary/10 blur-[60px] pointer-events-none group-hover:bg-primary/20 transition-all duration-500" />
        </div>
    )
}
