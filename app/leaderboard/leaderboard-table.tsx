'use client'

import { useState, useEffect } from 'react'
import { VT323 } from 'next/font/google'
import { TraderData } from '../lib/bybit-api'

const pixelFont = VT323({ weight: '400', subsets: ['latin'] })

export default function LeaderboardTable() {
  const [traders, setTraders] = useState<TraderData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/traders')
        const data = await response.json()
        setTraders(data.sort((a: TraderData, b: TraderData) => b.amount - a.amount))
        setLoading(false)
      } catch (error) {
        console.error('Error fetching trader data:', error)
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000) // Refresh every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`${pixelFont.className} bg-white bg-opacity-90 border-2 border-[#808080] shadow-inner`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#000080] text-white">
            <th className="py-1 px-4 text-left font-normal">RANK</th>
            <th className="py-1 px-4 text-left font-normal">TRADER</th>
            <th className="py-1 px-4 text-right font-normal">AMOUNT</th>
            <th className="py-1 px-4 text-right font-normal">PROFIT</th>
          </tr>
        </thead>
        <tbody>
          {traders.length === 0 && !loading ? (
            <tr>
              <td colSpan={4} className="py-4 text-center">No trader data available</td>
            </tr>
          ) : (
            traders.map((trader, index) => (
              <tr
                key={trader.name}
                className="border-b border-[#808080] hover:bg-[#000080] hover:text-white transition-all duration-300"
                style={{ animation: `fadeIn 0.5s ${index * 0.1}s both` }}
              >
                <td className="py-1 px-4 flex items-center gap-2">
                  {getRankDisplay(index + 1)}
                </td>
                <td className="py-1 px-4">{trader.name}</td>
                <td className="py-1 px-4 text-right">
                  ${trader.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-1 px-4 text-right">
                  {trader.percentage > 0 ? '+' : ''}{trader.percentage.toFixed(2)}%
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {loading && (
        <div className="py-4 text-center animate-pulse">
          LOADING TRADERS...
        </div>
      )}
    </div>
  )
}

function getRankDisplay(rank: number) {
  switch (rank) {
    case 1:
      return <span className="text-yellow-400 animate-pulse">★1ST★</span>
    case 2:
      return <span className="text-gray-400">☆2ND☆</span>
    case 3:
      return <span className="text-amber-600">☆3RD☆</span>
    default:
      return <span>{rank}TH</span>
  }
}
