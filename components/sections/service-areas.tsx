"use client"

import { motion } from "framer-motion"
import { MapPin, Building2 } from "lucide-react"

const cities = ["Phagwara", "Jalandhar", "Ludhiana", "Amritsar", "Moga"]

export function ServiceAreas() {
  return (
    <section className="w-full bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-16 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Building2 className="size-8 text-blue-600" />
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold text-slate-800 md:text-4xl"
            >
              Cities We Serve
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-slate-600"
          >
            Providing quality home tutoring services in major cities of Punjab
          </motion.p>
        </div>

        <motion.div 
          className="relative py-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[2px] w-[90%] bg-gradient-to-r from-transparent via-blue-200 to-emerald-200" />
          </div>
          
          {/* Cities list */}
          <div className="relative flex flex-wrap justify-center gap-8 md:gap-16 lg:gap-24">
            {cities.map((city, index) => (
              <motion.div
                key={city}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                {/* Decorative elements */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="size-4 rounded-full bg-gradient-to-r from-blue-100 to-emerald-100 transition-transform duration-500 group-hover:scale-[2]" />
                  <div className="absolute left-1/2 top-1/2 size-2 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 transition-transform duration-300 group-hover:scale-150" />
                </div>
                
                {/* City name and icon container */}
                <div className="relative flex flex-col items-center px-6 pb-4 pt-12">
                  <div className="absolute -top-2 left-1/2 flex size-12 rounded-full border border-white/50 bg-gradient-to-br from-blue-50 to-emerald-50 shadow-lg transition-transform duration-300 group-hover:scale-100">
                    <MapPin className="size-8 text-blue-600" />
                  </div>
                  <motion.span 
                    className="text-xl font-medium text-slate-800 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-emerald-600 group-hover:bg-clip-text group-hover:text-transparent"
                    whileHover={{ scale: 1.05 }}
                  >
                    {city}
                  </motion.span>
                </div>

                {/* Hover effects */}
                <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-emerald-600 transition-all duration-500 ease-out group-hover:w-full" />
                
                {/* Background glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-100/0 to-emerald-100/0 transition-colors duration-300 group-hover:from-blue-100/10 group-hover:to-emerald-100/10" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
