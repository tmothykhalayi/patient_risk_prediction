import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

import { motion } from 'framer-motion'
import {
  MessageSquareIcon,
  CalendarIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  StarIcon,
  QuoteIcon,
} from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
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
    duration: 0.6,
  },
}
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}
export function Landing() {
  return (
    <div className="w-full">
      <Header />
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[900px] flex items-center justify-center px-4 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&q=80"
            alt="Luxury car collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-br from-slate-900/90 via-slate-900/80 to-blue-900/70"></div>
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 max-w-7xl mx-auto py-20"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
              variants={fadeInUp}
            >
              Your perfect ride is just a{' '}
              <span className="text-blue-400">click away</span>
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-slate-200 mb-10 leading-relaxed"
              variants={fadeInUp}
            >
              Discover premium vehicles for every journey. From compact cars to
              luxury SUVs, find the perfect vehicle for your next adventure with
              flexible rental options and 24/7 support.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <Link to="/register">
                <Button
                  variant="secondary"
                  size="lg"
                  className="text-lg px-8 py-4"
                >
                  Browse Vehicles
                </Button>
              </Link>
              <Link to="/vehicles">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-lg px-8 py-4 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  View Vehicles
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white to-transparent z-10"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-linear-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
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
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Why choose <span className="text-blue-600">AutoHub</span>?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              We make car rental easy, affordable, and convenient with a wide
              selection of vehicles and exceptional customer service.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card hover className="h-full transition-all duration-300 hover:shadow-2xl bg-white border-t-4 border-blue-600">
                <div className="bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <MessageSquareIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">
                  Easy Booking
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Book your vehicle online in minutes with our <span className="font-semibold text-blue-700">user-friendly
                  platform</span>. Real-time availability and instant confirmation.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full transition-all duration-300 hover:shadow-2xl bg-white border-t-4 border-purple-600">
                <div className="bg-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <CalendarIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-purple-900 mb-3">
                  Flexible Rentals
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Daily, weekly, or monthly rentals available. <span className="font-semibold text-purple-700">Free cancellation
                  up to 24 hours</span> before pickup with no hidden fees.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full transition-all duration-300 hover:shadow-2xl bg-white border-t-4 border-green-600">
                <div className="bg-green-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <BookOpenIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-900 mb-3">
                  Premium Fleet
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Choose from our diverse fleet of well-maintained vehicles,
                  from economy cars to luxury SUVs, <span className="font-semibold text-green-700">all less than 2 years old</span>.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Devspace Section with Background */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80"
            alt="Car on road"
            className="w-full h-full object-cover opacity-10"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
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
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Benefits you'll love
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
            variants={staggerContainer}
          >
            <motion.div
              className="flex items-start space-x-4 bg-white/80 backdrop-blur-sm p-6 rounded-xl"
              variants={fadeInUp}
            >
              <div className="bg-blue-50 p-3 rounded-lg shrink-0">
                <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                  Fully Insured
                </h3>
                <p className="text-slate-600">
                  All vehicles come with comprehensive insurance coverage and
                  24/7 roadside assistance for complete peace of mind.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start space-x-4 bg-white/80 backdrop-blur-sm p-6 rounded-xl"
              variants={fadeInUp}
            >
              <div className="bg-blue-50 p-3 rounded-lg shrink-0">
                <ClockIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                  24/7 Pickup & Return
                </h3>
                <p className="text-slate-600">
                  Flexible pickup and return times to fit your schedule. Airport
                  locations available with free shuttle service.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start space-x-4 bg-white/80 backdrop-blur-sm p-6 rounded-xl"
              variants={fadeInUp}
            >
              <div className="bg-blue-50 p-3 rounded-lg shrink-0">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                  Customer Rewards
                </h3>
                <p className="text-slate-600">
                  Earn points with every rental and enjoy exclusive discounts,
                  free upgrades, and priority booking.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start space-x-4 bg-white/80 backdrop-blur-sm p-6 rounded-xl"
              variants={fadeInUp}
            >
              <div className="bg-blue-50 p-3 rounded-lg shrink-0">
                <BookOpenIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                  No Hidden Fees
                </h3>
                <p className="text-slate-600">
                  Transparent pricing with no surprise charges. What you see is
                  what you pay, including taxes and fees.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-linear-to-br from-white via-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
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
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              What our <span className="text-blue-600">customers</span> say
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it - hear from thousands of satisfied customers
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card hover className="h-full bg-white border-l-4 border-blue-600 relative">
                <QuoteIcon className="absolute top-4 right-4 w-12 h-12 text-blue-100" />
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed italic">
                  "Absolutely fantastic service! The booking process was seamless, and the car was in perfect condition. I'll definitely be using AutoHub for all my future rentals."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">JD</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">John Mutiso</h4>
                    <p className="text-sm text-slate-500">Business Traveler</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full bg-white border-l-4 border-purple-600 relative">
                <QuoteIcon className="absolute top-4 right-4 w-12 h-12 text-purple-100" />
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed italic">
                  "Great selection of vehicles and very competitive prices. The customer support team was incredibly helpful when I needed to extend my rental. Highly recommend!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-lg">SM</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Kimani Michael</h4>
                    <p className="text-sm text-slate-500">Holiday Traveler</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full bg-white border-l-4 border-green-600 relative">
                <QuoteIcon className="absolute top-4 right-4 w-12 h-12 text-green-100" />
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed italic">
                  "I've used several rental services, but AutoHub stands out. The vehicles are always clean, well-maintained, and the pickup/return process is incredibly efficient."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-bold text-lg">MT</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Isaac Wesonga </h4>
                    <p className="text-sm text-slate-500">Frequent Renter</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section with Background */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=1600&q=80"
            alt="Road trip"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-blue-900/95 to-slate-900/95"></div>
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
            Ready to hit the road?
          </h2>
          <p className="text-xl text-slate-200 mb-10 leading-relaxed">
            Join thousands of satisfied customers and experience hassle-free car
            rental today. Book your perfect vehicle now!
          </p>
          <Link to="/register">
            <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
              Start Booking
            </Button>
          </Link>
        </motion.div>
      </section>
      <Footer />
    </div>
  )
}
