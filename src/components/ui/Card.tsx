import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}
export function Card({ children, className = '', hover = false }: CardProps) {
  const hoverStyles = hover
    ? 'hover:shadow-lg transition-shadow duration-200'
    : ''
  return (
    <div
      className={`bg-white rounded-xl shadow-md p-6 ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  )
}
export default Card;