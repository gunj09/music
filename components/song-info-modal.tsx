"use client"

import { motion } from "framer-motion"
import { X, Calendar, Tag, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SongInfoModalProps {
  song: any
  onClose: () => void
  theme: "dark" | "light"
}

export default function SongInfoModal({ song, onClose, theme }: SongInfoModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className={`relative w-full max-w-md rounded-xl overflow-hidden shadow-2xl ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video">
          <img src={song.cover || "/placeholder.svg"} alt={song.album} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h2 className="text-2xl font-bold">{song.title}</h2>
            <p className="text-lg opacity-90">{song.artist}</p>
            <p className="text-sm opacity-80">{song.album}</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
            <div>
              <h3 className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                Release Date
              </h3>
              <p className={theme === "dark" ? "text-white" : "text-gray-900"}>{song.releaseDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Tag className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
            <div>
              <h3 className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Genre</h3>
              <p className={theme === "dark" ? "text-white" : "text-gray-900"}>{song.genre}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Award className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
            <div>
              <h3 className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Label</h3>
              <p className={theme === "dark" ? "text-white" : "text-gray-900"}>{song.label}</p>
            </div>
          </div>

          <div className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
            <h3 className="text-sm font-medium mb-1">Producers</h3>
            <div className="flex flex-wrap gap-2">
              {song.producers?.map((producer: string, index: number) => (
                <span
                  key={index}
                  className={`text-sm px-2 py-1 rounded-full ${
                    theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {producer}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
