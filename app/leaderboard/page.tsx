import LeaderboardTable from './leaderboard-table'
import { VT323 } from 'next/font/google'
import WarpSpeedBackground from './starfield-background'

const pixelFont = VT323({ weight: '400', subsets: ['latin'] })

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen p-4 overflow-hidden flex items-center justify-center">
      <WarpSpeedBackground />
      <div className="max-w-4xl w-full h-[80vh] mx-auto relative z-10 flex flex-col">
        <div className="bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] shadow-md">
          <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm">🏆</span>
              <h1 className={`${pixelFont.className} text-white text-lg`}>Leaderboard.exe</h1>
            </div>
            <div className="flex gap-1">
              <button className="bg-[#c0c0c0] border-t border-l border-white border-b border-r border-[#808080] px-2 text-sm hover:active:bg-[#c0c0c0]">_</button>
              <button className="bg-[#c0c0c0] border-t border-l border-white border-b border-r border-[#808080] px-2 text-sm hover:active:bg-[#c0c0c0]">□</button>
              <button className="bg-[#c0c0c0] border-t border-l border-white border-b border-r border-[#808080] px-2 text-sm hover:active:bg-[#c0c0c0]">×</button>
            </div>
          </div>
          
          <div className="p-4 flex-1 overflow-auto">
            <LeaderboardTable />
          </div>
        </div>
      </div>
    </div>
  )
}