"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  ChevronUp,
  ChevronDown,
  Volume2,
  Heart,
  ListMusic,
  GripVertical,
  Info,
  Mic,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import SongInfoModal from "./song-info-modal"
import LyricsDisplay from "./lyrics-display"

// Sample music data with Unsplash images
const allSongs = [
  {
    id: "1",
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    duration: 242,
    cover: "/images/album1.png",
    releaseDate: "October 18, 2011",
    genre: "Electronic, Synthpop",
    label: "Mute Records",
    producers: ["M83", "Justin Meldal-Johnsen"],
    mood: "energetic",
    lyrics: [
      { time: 0, text: "[Instrumental Intro]" },
      { time: 15, text: "Waiting in a car" },
      { time: 20, text: "Waiting for a ride in the dark" },
      { time: 25, text: "The night city grows" },
      { time: 30, text: "Look and see her eyes, they glow" },
      { time: 35, text: "Waiting in a car" },
      { time: 40, text: "Waiting for a ride in the dark" },
      { time: 45, text: "Drinking in the lounge" },
      { time: 50, text: "Following the neon signs" },
      { time: 55, text: "Waiting for a roar" },
      { time: 60, text: "Looking at the mutating skyline" },
      { time: 65, text: "The city is my church" },
      { time: 70, text: "It wraps me in the sparkling twilight" },
      { time: 75, text: "[Instrumental]" },
      { time: 120, text: "Waiting in a car" },
      { time: 125, text: "Waiting for the right time" },
      { time: 130, text: "Waiting in a car" },
      { time: 135, text: "Waiting for the right time" },
      { time: 140, text: "[Instrumental Outro]" },
    ],
  },
  {
    id: "2",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: 200,
    cover: "/images/album2.png",
    releaseDate: "November 29, 2019",
    genre: "Synth-pop, New Wave",
    label: "XO, Republic Records",
    producers: ["The Weeknd", "Max Martin", "Oscar Holter"],
    mood: "energetic",
    lyrics: [
      { time: 0, text: "[Instrumental Intro]" },
      { time: 10, text: "I've been tryna call" },
      { time: 15, text: "I've been on my own for long enough" },
      { time: 20, text: "Maybe you can show me how to love, maybe" },
      { time: 25, text: "I'm going through withdrawals" },
      { time: 30, text: "You don't even have to do too much" },
      { time: 35, text: "You can turn me on with just a touch, baby" },
      { time: 40, text: "I look around and" },
      { time: 45, text: "Sin City's cold and empty (Oh)" },
      { time: 50, text: "No one's around to judge me (Oh)" },
      { time: 55, text: "I can't see clearly when you're gone" },
      { time: 60, text: "I said, ooh, I'm blinded by the lights" },
      { time: 65, text: "No, I can't sleep until I feel your touch" },
      { time: 70, text: "I said, ooh, I'm drowning in the night" },
      { time: 75, text: "Oh, when I'm like this, you're the one I trust" },
    ],
  },
  {
    id: "3",
    title: "Redbone",
    artist: "Childish Gambino",
    album: "Awaken, My Love!",
    duration: 326,
    cover: "/images/album3.png",
    releaseDate: "November 17, 2016",
    genre: "Funk, R&B, Soul",
    label: "Glassnote Records",
    producers: ["Ludwig Göransson", "Donald Glover"],
    mood: "chill",
    lyrics: [
      { time: 0, text: "[Instrumental Intro]" },
      { time: 20, text: "Daylight" },
      { time: 25, text: "I wake up feeling like you won't play right" },
      { time: 30, text: "I used to know, but now that shit don't feel right" },
      { time: 35, text: "It made me put away my pride" },
      { time: 40, text: "So long" },
      { time: 45, text: "You made a nigga wait for some, so long" },
      { time: 50, text: "You make it hard for boy like that to go on" },
      { time: 55, text: "I'm wishing I could make this mine, oh" },
      { time: 60, text: "If you want it, yeah" },
      { time: 65, text: "You can have it, oh, oh, oh" },
      { time: 70, text: "If you need it, ooh" },
      { time: 75, text: "You can have it" },
    ],
  },
  {
    id: "4",
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: 203,
    cover: "/images/album4.png",
    releaseDate: "March 27, 2020",
    genre: "Dance-pop, Disco",
    label: "Warner Records",
    producers: ["Koz", "Stuart Price"],
    mood: "happy",
    lyrics: [
      { time: 0, text: "[Intro]" },
      { time: 5, text: "If you wanna run away with me, I know a galaxy" },
      { time: 10, text: "And I can take you for a ride" },
      { time: 15, text: "I had a premonition that we fell into a rhythm" },
      { time: 20, text: "Where the music don't stop for life" },
      { time: 25, text: "Glitter in the sky, glitter in my eyes" },
      { time: 30, text: "Shining just the way I like" },
      { time: 35, text: "If you're feeling like you need a little bit of company" },
      { time: 40, text: "You met me at the perfect time" },
      { time: 45, text: "You want me, I want you, baby" },
      { time: 50, text: "My sugarboo, I'm levitating" },
      { time: 55, text: "The Milky Way, we're renegading" },
      { time: 60, text: "Yeah, yeah, yeah, yeah, yeah" },
    ],
  },
  {
    id: "5",
    title: "Circles",
    artist: "Post Malone",
    album: "Hollywood's Bleeding",
    duration: 215,
    cover: "/images/album5.png",
    releaseDate: "August 30, 2019",
    genre: "Pop, Alternative",
    label: "Republic Records",
    producers: ["Post Malone", "Louis Bell", "Frank Dukes"],
    mood: "sad",
    lyrics: [
      { time: 0, text: "[Instrumental Intro]" },
      { time: 10, text: "We couldn't turn around 'til we were upside down" },
      { time: 15, text: "I'll be the bad guy now, but know I ain't too proud" },
      { time: 20, text: "I couldn't be there even when I tried" },
      { time: 25, text: "You don't believe it, we do this every time" },
      { time: 30, text: "Seasons change and our love went cold" },
      { time: 35, text: "Feed the flame 'cause we can't let go" },
      { time: 40, text: "Run away, but we're running in circles" },
      { time: 45, text: "Run away, run away" },
      { time: 50, text: "I dare you to do something" },
      { time: 55, text: "I'm waiting on you again, so I don't take the blame" },
      { time: 60, text: "Run away, but we're running in circles" },
      { time: 65, text: "Run away, run away, run away" },
    ],
  },
]

interface MusicPlayerProps {
  theme: "dark" | "light"
  isDrawerOpen: boolean
  setIsDrawerOpen: (open: boolean) => void
}

export default function MusicPlayer({ theme, isDrawerOpen, setIsDrawerOpen }: MusicPlayerProps) {
  const [currentSong, setCurrentSong] = useState(allSongs[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [showQueue, setShowQueue] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [volume, setVolume] = useState(80)
  const [isDragging, setIsDragging] = useState(false)
  const [queue, setQueue] = useState(allSongs.slice(0, 5))
  const [showSongInfo, setShowSongInfo] = useState(false)
  const [showLyrics, setShowLyrics] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Handle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause()
    } else {
      audioRef.current?.play()
    }
    setIsPlaying(!isPlaying)
  }

  // Handle next song
  const nextSong = () => {
    const currentIndex = queue.findIndex((song) => song.id === currentSong.id)
    const nextIndex = (currentIndex + 1) % queue.length
    setCurrentSong(queue[nextIndex])
    setCurrentTime(0)
    if (isPlaying) {
      setTimeout(() => {
        audioRef.current?.play()
      }, 100)
    }
  }

  // Handle previous song
  const prevSong = () => {
    const currentIndex = queue.findIndex((song) => song.id === currentSong.id)
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length
    setCurrentSong(queue[prevIndex])
    setCurrentTime(0)
    if (isPlaying) {
      setTimeout(() => {
        audioRef.current?.play()
      }, 100)
    }
  }

  // Handle progress bar change
  const handleProgressChange = (value: number[]) => {
    const newTime = value[0]
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  // Handle DnD end
  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setQueue((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const newItems = [...items]
        const [removed] = newItems.splice(oldIndex, 1)
        newItems.splice(newIndex, 0, removed)

        return newItems
      })
    }
  }

  // Update progress bar
  useEffect(() => {
    if (isPlaying && !isDragging) {
      progressInterval.current = setInterval(() => {
        setCurrentTime((prev) => {
          // Simulate time passing for the demo
          const newTime = prev + 1
          if (newTime >= currentSong.duration) {
            nextSong()
            return 0
          }
          return newTime
        })
      }, 1000)
    } else if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [isPlaying, isDragging, currentSong.duration])

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.volume = volume / 100

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  return (
    <div className={`w-full max-w-md mx-auto transition-all duration-300 ${isDrawerOpen ? "mr-[350px]" : ""}`}>
      <div
        className={`relative overflow-hidden rounded-xl shadow-xl border transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gray-800/40 backdrop-blur-lg border-gray-700/50"
            : "bg-white/80 backdrop-blur-lg border-gray-200"
        }`}
      >
        {/* Main player */}
        <div className="p-6">
          {/* Playlist button */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
              onClick={() => setShowLyrics(!showLyrics)}
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            >
              <ListMusic className="h-5 w-5" />
            </Button>
          </div>

          {/* Album cover */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSong.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: isPlaying ? [0, 1, 0, -1, 0] : 0,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.4,
                rotate: {
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 5,
                  ease: "linear",
                },
              }}
              className="relative mx-auto mb-6 rounded-lg overflow-hidden shadow-2xl cursor-pointer"
              onClick={() => setShowSongInfo(true)}
            >
              <div className="aspect-square w-full max-w-[280px] mx-auto relative">
                <img
                  src={currentSong.cover || "/placeholder.svg"}
                  alt={`${currentSong.album} cover`}
                  className="w-full h-full object-cover"
                />
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br transition-opacity duration-500",
                    isPlaying ? "opacity-100" : "opacity-0",
                    theme === "dark" ? "from-purple-500/20 to-blue-500/20" : "from-purple-500/10 to-blue-500/10",
                  )}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/30 transition-opacity">
                  <Info className="h-8 w-8 text-white" />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsFavorite(!isFavorite)
                }}
              >
                <Heart
                  className={cn("h-5 w-5 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "text-white")}
                />
              </Button>
            </motion.div>
          </AnimatePresence>

          {/* Song info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSong.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-6"
            >
              <h2 className={`text-xl font-bold mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {currentSong.title}
              </h2>
              <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>{currentSong.artist}</p>
            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          <div className="mb-6">
            <Slider
              value={[currentTime]}
              min={0}
              max={currentSong.duration}
              step={1}
              onValueChange={handleProgressChange}
              onValueCommitStart={() => setIsDragging(true)}
              onValueCommitEnd={() => setIsDragging(false)}
              className="mb-2"
            />
            <div className={`flex justify-between text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentSong.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`transition-colors ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
            >
              <Shuffle className="h-5 w-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`transition-colors ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
              onClick={prevSong}
            >
              <SkipBack className="h-6 w-6" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full p-3 shadow-lg"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`transition-colors ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
              onClick={nextSong}
            >
              <SkipForward className="h-6 w-6" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`transition-colors ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
            >
              <Repeat className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-2">
            <Volume2 className={`h-4 w-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`} />
            <Slider value={[volume]} min={0} max={100} step={1} onValueChange={handleVolumeChange} className="w-full" />
          </div>
        </div>

        {/* Queue toggle button */}
        <button
          onClick={() => setShowQueue(!showQueue)}
          className={`w-full py-2 px-4 flex items-center justify-center gap-2 text-sm transition-colors border-t ${
            theme === "dark"
              ? "text-gray-400 hover:text-white bg-gray-800/80 border-gray-700/50"
              : "text-gray-600 hover:text-gray-900 bg-gray-100/80 border-gray-200"
          }`}
        >
          {showQueue ? (
            <>
              <ChevronDown className="h-4 w-4" />
              <span>Hide Up Next</span>
            </>
          ) : (
            <>
              <ChevronUp className="h-4 w-4" />
              <span>Show Up Next</span>
            </>
          )}
        </button>

        {/* Up Next Queue with drag and drop */}
        <motion.div
          initial={false}
          animate={{
            height: showQueue ? "auto" : 0,
            opacity: showQueue ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className={`p-4 ${theme === "dark" ? "bg-gray-800/60" : "bg-gray-100/60"}`}>
            <h3 className={`font-medium mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Up Next - Drag to Reorder
            </h3>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext items={queue.map((song) => song.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {queue.map((song) => (
                    <SortableQueueItem
                      key={song.id}
                      song={song}
                      isCurrentSong={currentSong.id === song.id}
                      onClick={() => {
                        setCurrentSong(song)
                        setCurrentTime(0)
                        if (isPlaying) {
                          setTimeout(() => {
                            audioRef.current?.play()
                          }, 100)
                        }
                      }}
                      theme={theme}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </motion.div>
      </div>

      {/* Lyrics Display */}
      <AnimatePresence>
        {showLyrics && (
          <LyricsDisplay
            lyrics={currentSong.lyrics}
            currentTime={currentTime}
            onClose={() => setShowLyrics(false)}
            theme={theme}
          />
        )}
      </AnimatePresence>

      {/* Song Info Modal */}
      <AnimatePresence>
        {showSongInfo && <SongInfoModal song={currentSong} onClose={() => setShowSongInfo(false)} theme={theme} />}
      </AnimatePresence>
    </div>
  )
}

interface SortableQueueItemProps {
  song: (typeof allSongs)[0]
  isCurrentSong: boolean
  onClick: () => void
  theme: "dark" | "light"
}

function SortableQueueItem({ song, isCurrentSong, onClick, theme }: SortableQueueItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: song.id })

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
        isCurrentSong
          ? theme === "dark"
            ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30"
            : "bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200"
          : theme === "dark"
            ? "hover:bg-gray-700/30"
            : "hover:bg-gray-200/50",
      )}
      onClick={onClick}
    >
      <div className="cursor-grab" {...attributes} {...listeners}>
        <GripVertical className={`h-5 w-5 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`} />
      </div>
      <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
        <img src={song.cover || "/placeholder.svg"} alt={song.album} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium truncate",
            isCurrentSong
              ? theme === "dark"
                ? "text-white"
                : "text-gray-900"
              : theme === "dark"
                ? "text-gray-300"
                : "text-gray-700",
          )}
        >
          {song.title}
        </p>
        <p className={theme === "dark" ? "text-xs text-gray-500 truncate" : "text-xs text-gray-600 truncate"}>
          {song.artist}
        </p>
      </div>
      <div className={theme === "dark" ? "text-xs text-gray-500" : "text-xs text-gray-600"}>
        {formatTime(song.duration)}
      </div>
    </div>
  )
}
