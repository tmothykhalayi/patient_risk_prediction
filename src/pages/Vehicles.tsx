import { resources } from '../components/data/data'
import { Header } from '../components/layout/Header'
import { Card } from '../components/ui/Card'
import { motion } from 'framer-motion'

const fadeInUp = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  transition: {
    duration: 0.5,
  },
}
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}
export function Vehicles() {

  return (
    <div className="w-full">
      <Header />
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[900px] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1600&q=80"
            alt="Car showroom"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-br from-slate-900/90 via-slate-900/80 to-blue-900/70"></div>
        </div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center py-20"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Our Vehicle Fleet & Locations
          </h1>
          <p className="text-xl text-slate-200 leading-relaxed">
            Browse our diverse fleet of vehicles and find rental locations near you.
            Everything you need for a smooth rental experience.
          </p>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white to-transparent z-10"></div>
      </section>

      {/* Resources Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto space-y-24">
          {resources.map((category, idx) => {
            const IconComponent = category.icon
            return (
              <motion.div
                key={idx}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  margin: '-100px',
                }}
                transition={{
                  duration: 0.6,
                }}
              >
                {/* Category Header with Image */}
                <div className="relative mb-12 rounded-2xl overflow-hidden h-48">
                  <img
                    src={category.image}
                    alt={category.category}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 to-slate-900/70 flex items-center">
                    <div className="px-8 flex items-center space-x-4">
                      <div className="bg-blue-500 p-4 rounded-xl">
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-4xl md:text-5xl font-bold text-white">
                        {category.category}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Resource Cards */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                  initial="initial"
                  whileInView="animate"
                  viewport={{
                    once: true,
                  }}
                  variants={staggerContainer}
                >
                  {category.items.map((item, itemIdx) => (
                    <motion.div key={itemIdx} variants={fadeInUp}>
                      <Card
                        hover
                        className="h-full overflow-hidden group cursor-pointer"
                      >
                        {/* Card Image */}
                        <div className="relative h-48 mb-4 -mx-6 -mt-6 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent"></div>
                          <div className="absolute top-4 left-4 flex items-center gap-2">
                            <span className="text-xs font-semibold text-white bg-blue-600 px-3 py-1 rounded-full">
                              {item.type}
                            </span>
                            <span className="text-xs font-medium text-white bg-slate-900/60 backdrop-blur-sm px-3 py-1 rounded-full">
                              {item.readTime}
                            </span>
                          </div>
                        </div>

                        {/* Card Content */}
                        <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                          {item.description}
                        </p>
                        <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                          Read more
                          <span className="ml-2 transition-transform group-hover:translate-x-1">
                            →
                          </span>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=1600&q=80"
            alt="Car keys"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-blue-900/95 to-slate-900/90"></div>
        </div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to book your vehicle?
          </h2>
          <p className="text-xl text-slate-200 mb-10 leading-relaxed">
            Browse our complete fleet and reserve your perfect vehicle today.
            Great rates and flexible rental options available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register">
              <button className="bg-orange-500 text-white px-8 py-4 rounded-lg font-medium hover:bg-orange-600 transition-all duration-200 text-lg">
                Book a Vehicle
              </button>
            </a>
            <a href="/contact">
              <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-medium hover:bg-white/20 transition-all duration-200 text-lg">
                Contact Us
              </button>
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
