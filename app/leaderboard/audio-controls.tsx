'use client'

import { useState, useEffect, useRef } from 'react'

export default function AudioControls() {
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 1 // Set initial volume to 100%
    }
  }, [])

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted
      setIsMuted(!isMuted)
    }
  }

  return (
    <>
      <audio ref={audioRef} autoPlay loop>
        <source src="/bye-bye-bye.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <button 
        className="fixed bottom-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 z-20"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </>
  )
}