"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Featured albums with Unsplash images
const featuredAlbums = [
  {
    id: 1,
    title: "After Hours",
    artist: "The Weeknd",
    cover: "/images/album1.png",
  },
  {
    id: 2,
    title: "Future Nostalgia",
    artist: "Dua Lipa",
    cover: "/images/album2.png",
  },
  {
    id: 3,
    title: "Awaken, My Love!",
    artist: "Childish Gambino",
    cover: "/images/album3.png",
  },
  {
    id: 4,
    title: "Hollywood's Bleeding",
    artist: "Post Malone",
    cover: "/images/album4.png",
  },
  {
    id: 5,
    title: "When We All Fall Asleep, Where Do We Go?",
    artist: "Billie Eilish",
    cover: "/images/album5.png",
  },
  {
    id: 6,
    title: "Fine Line",
    artist: "Harry Styles",
    cover: "/images/album6.png",
  },
]

interface AlbumCarouselProps {
  theme: "dark" | "light"
}

export default function AlbumCarousel({ theme }: AlbumCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [width, setWidth] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth)
    }

    const handleResize = () => {
      if (carouselRef.current) {
        setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === featuredAlbums.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredAlbums.length - 1 : prev - 1))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - carouselRef.current!.offsetLeft)
    setScrollLeft(carouselRef.current!.scrollLeft)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - carouselRef.current!.offsetLeft
    const walk = (x - startX) * 2 // Scroll speed
    carouselRef.current!.scrollLeft = scrollLeft - walk
  }

  return (
    <div className="relative">
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${
            theme === "dark"
              ? "bg-gray-800/70 text-white hover:bg-gray-700/70"
              : "bg-white/70 text-gray-900 hover:bg-gray-100/70"
          }`}
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${
            theme === "dark"
              ? "bg-gray-800/70 text-white hover:bg-gray-700/70"
              : "bg-white/70 text-gray-900 hover:bg-gray-100/70"
          }`}
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <motion.div
        ref={carouselRef}
        className="overflow-hidden cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <motion.div
          className="flex"
          animate={{ x: -currentIndex * (carouselRef.current?.offsetWidth || 0) }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          onDragEnd={(_, info) => {
            if (info.offset.x > 100) {
              prevSlide()
            } else if (info.offset.x < -100) {
              nextSlide()
            }
          }}
        >
          {featuredAlbums.map((album, index) => (
            <motion.div
              key={album.id}
              className={`min-w-full px-4 ${isDragging ? "pointer-events-none" : ""}`}
              style={{
                perspective: 1000,
              }}
            >
              <motion.div
                className="flex flex-col items-center"
                animate={{
                  rotateY: index === currentIndex ? 0 : index < currentIndex ? 45 : -45,
                  scale: index === currentIndex ? 1 : 0.8,
                  opacity: index === currentIndex ? 1 : 0.5,
                  z: index === currentIndex ? 0 : -100,
                }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className={`relative w-64 h-64 rounded-lg overflow-hidden shadow-xl ${
                    index === currentIndex ? "ring-4 ring-purple-500" : ""
                  }`}
                >
                  <img
                    src={album.cover || "/placeholder.svg"}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${
                      theme === "dark" ? "from-black/70 to-transparent" : "from-black/50 to-transparent"
                    }`}
                  ></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-lg font-bold">{album.title}</h3>
                    <p className="text-sm opacity-80">{album.artist}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <div className="flex justify-center mt-4 gap-2">
        {featuredAlbums.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex
                ? "bg-purple-500"
                : theme === "dark"
                  ? "bg-gray-600 hover:bg-gray-500"
                  : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
