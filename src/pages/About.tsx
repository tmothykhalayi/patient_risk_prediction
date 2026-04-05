
import { Header } from '../components/layout/Header'
import { Card } from '../components/ui/Card'
import { HeartIcon, TargetIcon, UsersIcon, ShieldCheckIcon, ClockIcon, TrophyIcon, SparklesIcon } from 'lucide-react'
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
      staggerChildren: 0.1,
    },
  },
}

export function About() {
  return (
    <div className="w-full">
      <Header />
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[800px] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80"
            alt="Luxury cars"
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
            Your Trusted AutoHub Partner
          </h1>
          <p className="text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto">
            We're committed to providing exceptional vehicle rental experiences
            with quality cars, transparent pricing, and outstanding service.
          </p>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white to-transparent z-10"></div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card hover className="h-full text-center bg-linear-to-br from-blue-50 to-white border-t-4 border-blue-600">
                <div className="bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <HeartIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">
                  Our Mission
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  To provide convenient, affordable, and reliable car rental
                  services that make every journey comfortable and stress-free.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full text-center bg-linear-to-br from-purple-50 to-white border-t-4 border-purple-600">
                <div className="bg-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <TargetIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-purple-900 mb-3">
                  Our Fleet
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  A diverse selection of well-maintained, modern vehicles ranging
                  from compact cars to luxury SUVs, all regularly serviced and
                  sanitized.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full text-center bg-linear-to-br from-green-50 to-white border-t-4 border-green-600">
                <div className="bg-green-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <UsersIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-900 mb-3">
                  Our Promise
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Transparent pricing, exceptional customer service, and flexible
                  rental options that adapt to your needs, whether business or
                  leisure.
                </p>
              </Card>
            </motion.div>
          </motion.div>

          {/* Story Section */}
          <motion.div
            className="max-w-3xl mx-auto bg-linear-to-br from-blue-50 via-white to-slate-50 rounded-2xl p-8 md:p-12 shadow-lg border border-blue-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="w-1 h-12 bg-blue-600 mr-4 rounded-full"></span>
              Our Story
            </h2>
            <div className="space-y-5 text-slate-700 leading-relaxed text-lg">
              <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-blue-600 first-letter:float-left first-letter:mr-2 first-letter:leading-none">
                Founded in 2020, AutoHub was born from a simple
                idea: make vehicle rental as easy and stress-free as possible.
                We saw how complicated and expensive traditional car rental
                could be, and we knew there was a better way.
              </p>
              <p>
                Starting with just a handful of vehicles, we've grown into a
                trusted service with a <span className="font-semibold text-blue-700">diverse fleet of over 500 cars</span> across
                multiple locations. But growth hasn't changed our core values—we
                still believe in transparent pricing, quality vehicles, and
                treating every customer like family.
              </p>
              <p>
                Our team is passionate about cars and even more passionate about
                service. We carefully maintain every vehicle in our fleet,
                ensuring you get a reliable, clean car every time. From routine
                maintenance to thorough cleaning between rentals, we take pride
                in the quality we deliver.
              </p>
              <p className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg italic">
                Whether you need a car for a business trip, family vacation, or
                just a weekend getaway, we're here to make your rental
                experience smooth, affordable, and enjoyable. Thank you for
                choosing us as your travel companion.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-linear-to-br from-slate-100 to-slate-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
              What Sets Us Apart
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover the AutoHub difference with our commitment to excellence
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card hover className="h-full shadow-lg bg-white border-l-4 border-blue-500">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center shrink-0">
                    <SparklesIcon className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-3">
                      Quality Fleet
                    </h3>
                    <p className="text-slate-700 leading-relaxed">
                      Every vehicle in our fleet is <span className="font-semibold text-blue-700">less than 3 years old</span>, regularly
                      serviced, and thoroughly inspected before each rental. We
                      maintain the highest standards of quality and cleanliness.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full shadow-lg bg-white border-l-4 border-green-500">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center shrink-0">
                    <ShieldCheckIcon className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-900 mb-3">
                      Transparent Pricing
                    </h3>
                    <p className="text-slate-700 leading-relaxed">
                      <span className="font-semibold text-green-700">No hidden fees, no surprises.</span> Our pricing includes all taxes,
                      insurance, and unlimited mileage. What you see when booking is
                      exactly what you'll pay.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full shadow-lg bg-white border-l-4 border-purple-500">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center shrink-0">
                    <ClockIcon className="w-7 h-7 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-900 mb-3">
                      24/7 Support
                    </h3>
                    <p className="text-slate-700 leading-relaxed">
                      Our customer service team and roadside assistance are <span className="font-semibold text-purple-700">available
                      around the clock</span>. Whether you need help with your booking or
                      emergency support on the road, we're always here.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full shadow-lg bg-white border-l-4 border-orange-500">
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center shrink-0">
                    <TrophyIcon className="w-7 h-7 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-orange-900 mb-3">
                      Flexible Options
                    </h3>
                    <p className="text-slate-700 leading-relaxed">
                      From hourly to monthly rentals, one-way trips to airport
                      pickups, we offer flexible rental options to suit every need.
                      <span className="font-semibold text-orange-700"> Free cancellation</span> up to 24 hours before pickup.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
