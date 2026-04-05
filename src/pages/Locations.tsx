import { useState } from 'react'
import { motion } from 'framer-motion'
import { LocationCard } from '../components/LocationCard'
import type { LocationProfile } from '../components/LocationCard'
import { BookingModal } from '../components/BookingModal'
import { FilterIcon } from 'lucide-react'
import { Header } from '../components/layout/Header'
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
// Mock location data
const locations: LocationProfile[] = [
  {
    id: '1',
    name: 'Airport Terminal 1',
    image:
      'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=600&q=80',
    licenseNumber: 'Open 24/7',
    specializations: [
      'Airport',
      '24/7 Service',
      'Free Shuttle',
      'Quick Pickup',
    ],
    yearsExperience: 0,
    bio: 'Located inside Terminal 1 arrivals hall. Free shuttle service to parking lot. Fast check-in with priority counter. Perfect for business travelers and tourists.',
    sessionRate: 0,
    isAcceptingClients: true,
  },
  {
    id: '2',
    name: 'Airport Terminal 3',
    image:
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
    licenseNumber: 'Open 24/7',
    specializations: [
      'Airport',
      '24/7 Service',
      'Free Shuttle',
      'International',
    ],
    yearsExperience: 0,
    bio: 'International terminal location with multilingual staff. Open around the clock for late arrivals and early departures. Complimentary shuttle to vehicle lot.',
    sessionRate: 0,
    isAcceptingClients: true,
  },
  {
    id: '3',
    name: 'Downtown Main Street',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
    licenseNumber: '8AM - 8PM',
    specializations: [
      'Downtown',
      'Business District',
      'Validated Parking',
      'Express Service',
    ],
    yearsExperience: 0,
    bio: 'Prime location in the heart of downtown. Easy access from major hotels and business centers. Validated parking for quick pickup. Extended hours for your convenience.',
    sessionRate: 0,
    isAcceptingClients: true,
  },
  {
    id: '4',
    name: 'City Center Plaza',
    image:
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80',
    licenseNumber: '7AM - 10PM',
    specializations: [
      'Downtown',
      'Shopping District',
      'Weekend Service',
      'Corporate Rentals',
    ],
    yearsExperience: 0,
    bio: 'Central location near shopping and entertainment. Specialized corporate rental programs. Weekend and holiday hours available. Premium fleet selection.',
    sessionRate: 0,
    isAcceptingClients: true,
  },
  {
    id: '5',
    name: 'Suburban North Branch',
    image:
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600&q=80',
    licenseNumber: '9AM - 6PM',
    specializations: [
      'Suburban',
      'Family Friendly',
      'Free Parking',
      'Long-term Rentals',
    ],
    yearsExperience: 0,
    bio: 'Convenient suburban location with free parking. Specializing in family vehicles and long-term rentals. Friendly staff and personalized service.',
    sessionRate: 0,
    isAcceptingClients: true,
  },
  {
    id: '6',
    name: 'Hotel District Office',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    licenseNumber: '6AM - 11PM',
    specializations: [
      'Hotel Pickup',
      'Extended Hours',
      'Delivery Service',
      'Luxury Fleet',
    ],
    yearsExperience: 0,
    bio: 'Located in the hotel district with delivery service to your hotel. Extended hours to accommodate early checkouts and late arrivals. Premium and luxury vehicles available.',
    sessionRate: 0,
    isAcceptingClients: true,
  },
]
const allSpecializations = Array.from(
  new Set(locations.flatMap((t) => t.specializations)),
).sort()
export function Locations() {
  const [selectedSpecialization, setSelectedSpecialization] = useState<
    string | null
  >(null)
  const [selectedLocation, setSelectedLocation] =
    useState<LocationProfile | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const filteredLocations = selectedSpecialization
    ? locations.filter((t) =>
        t.specializations.includes(selectedSpecialization),
      )
    : locations
  const handleBookSession = (location: LocationProfile) => {
    setSelectedLocation(location)
    setIsBookingModalOpen(true)
  }
  return (
    <div className="w-full">
      <Header />
      {/* Hero Section */}
      <section className="relative min-h-[800px] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80"
            alt="City skyline"
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
            Our Rental Locations
          </h1>
          <p className="text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto">
            Find a convenient location near you. We have offices at major airports,
            downtown areas, and popular destinations.
          </p>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white to-transparent z-10"></div>
      </section>

      {/* Filters Section */}
      <section className="py-8 px-4 bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <FilterIcon className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-slate-900">
              Filter by Location Type
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSpecialization(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedSpecialization === null ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              All Locations
            </button>
            {allSpecializations.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialization(spec)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedSpecialization === spec ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {filteredLocations.map((location) => (
              <motion.div key={location.id} variants={fadeInUp}>
                <LocationCard
                  location={location}
                  onBookSession={handleBookSession}
                />
              </motion.div>
            ))}
          </motion.div>

          {filteredLocations.length === 0 && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="text-center py-20"
            >
              <p className="text-xl text-slate-600 mb-4">
                No locations found with this filter.
              </p>
              <button
                onClick={() => setSelectedSpecialization(null)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View all locations
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            How to Rent
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Choose Your Location
              </h3>
              <p className="text-sm text-slate-600">
                Select a pickup location convenient to you - airport, downtown, or delivery.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Select Your Vehicle
              </h3>
              <p className="text-sm text-slate-600">
                Browse available vehicles and choose the perfect car for your needs.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Pick Up & Drive
              </h3>
              <p className="text-sm text-slate-600">
                Complete your booking online and pick up your vehicle at your chosen time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        location={selectedLocation}
      />
    </div>
  )
}
