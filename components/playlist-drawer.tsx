"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Sample playlist data with Unsplash images
const allSongs = [
  {
    id: "1",
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    duration: 242,
    cover: "/images/album1.png",
  },
  {
    id: "2",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: 200,
    cover: "/images/album2.png",
  },
  {
    id: "3",
    title: "Redbone",
    artist: "Childish Gambino",
    album: "Awaken, My Love!",
    duration: 326,
    cover: "/images/album3.png",
  },
  {
    id: "4",
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: 203,
    cover: "/images/album4.png",
  },
  {
    id: "5",
    title: "Circles",
    artist: "Post Malone",
    album: "Hollywood's Bleeding",
    duration: 215,
    cover: "/images/album5.png",
  },
  {
    id: "6",
    title: "Bad Guy",
    artist: "Billie Eilish",
    album: "When We All Fall Asleep, Where Do We Go?",
    duration: 194,
    cover: "/images/album6.png",
  },
  {
    id: "7",
    title: "Don't Start Now",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: 183,
    cover: "/images/album7.png",
  },
  {
    id: "8",
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    album: "Fine Line",
    duration: 174,
    cover: "/images/album8.png",
  },
  {
    id: "9",
    title: "Savage Love",
    artist: "Jason Derulo",
    album: "Savage Love",
    duration: 171,
    cover: "/images/album9.png",
  },
  {
    id: "10",
    title: "Dynamite",
    artist: "BTS",
    album: "BE",
    duration: 199,
    cover: "/images/album10.png",
  },
  {
    id: "11",
    title: "Mood",
    artist: "24kGoldn ft. Iann Dior",
    album: "El Dorado",
    duration: 140,
    cover: "/images/album11.png",
  },
  {
    id: "12",
    title: "positions",
    artist: "Ariana Grande",
    album: "Positions",
    duration: 172,
    cover: "/images/album12.png",
  },
]

interface PlaylistDrawerProps {
  isOpen: boolean
  onClose: () => void
  theme: "dark" | "light"
}

export default function PlaylistDrawer({ isOpen, onClose, theme }: PlaylistDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const filteredSongs = allSongs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed right-0 top-0 h-full w-full max-w-[350px] z-50 shadow-xl ${
              theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div
                className={`p-4 flex items-center justify-between border-b ${
                  theme === "dark" ? "border-gray-800" : "border-gray-200"
                }`}
              >
                <h2 className="text-lg font-semibold">My Playlist</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Search */}
              <div className="p-4">
                <div className="relative">
                  <Search
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                      theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <Input
                    placeholder="Search songs or artists..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-9 ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        : "bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-400"
                    }`}
                  />
                </div>
              </div>

              {/* Song list */}
              <ScrollArea className="flex-1">
                <div className="p-4">
                  {filteredSongs.length > 0 ? (
                    <div className="space-y-2">
                      {filteredSongs.map((song) => (
                        <div
                          key={song.id}
                          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                            theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
                          }`}
                        >
                          <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={song.cover || "/placeholder.svg"}
                              alt={song.album}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium truncate ${
                                theme === "dark" ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {song.title}
                            </p>
                            <p className={`text-xs truncate ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                              {song.artist}
                            </p>
                          </div>
                          <div className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>
                            {formatTime(song.duration)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`text-center py-8 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                      No songs found
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
