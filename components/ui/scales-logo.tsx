'use client'

import { motion } from 'framer-motion'
import { Scale } from 'lucide-react'

export function ScalesLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ rotate: -5, scale: 0.9 }}
      animate={{ rotate: 0, scale: 1 }}
      transition={{ 
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
        repeatDelay: 3
      }}
    >
      <Scale className="w-full h-full text-amber-500" />
    </motion.div>
  )
}