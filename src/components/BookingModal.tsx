import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  XIcon,
  CalendarIcon,
  ClockIcon,
  VideoIcon,
  CheckIcon,
} from 'lucide-react'
import { Button } from './ui/Button'
import type { LocationProfile } from './LocationCard'
interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  location: LocationProfile | null
}
const availableDates = [
  {
    date: '2024-01-15',
    day: 'Mon',
    slots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
  },
  {
    date: '2024-01-16',
    day: 'Tue',
    slots: ['10:00 AM', '1:00 PM', '3:00 PM'],
  },
  {
    date: '2024-01-17',
    day: 'Wed',
    slots: ['9:00 AM', '11:00 AM', '2:00 PM', '5:00 PM'],
  },
  {
    date: '2024-01-18',
    day: 'Thu',
    slots: ['10:00 AM', '12:00 PM', '3:00 PM'],
  },
  {
    date: '2024-01-19',
    day: 'Fri',
    slots: ['9:00 AM', '1:00 PM', '4:00 PM'],
  },
]
export function BookingModal({
  isOpen,
  onClose,
  location,
}: BookingModalProps) {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [bookingConfirmed] = useState(false)
  if (!location) return null
  const handleConfirmBooking = () => {
    // Redirect to login page
    navigate('/login')
  }
  const selectedDateObj = availableDates.find((d) => d.date === selectedDate)
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {bookingConfirmed /* Confirmation View */ ? (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  className="flex flex-col items-center justify-center p-12 text-center"
                >
                  <motion.div
                    initial={{
                      scale: 0,
                    }}
                    animate={{
                      scale: 1,
                    }}
                    transition={{
                      delay: 0.2,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckIcon className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">
                    Session Booked!
                  </h3>
                  <p className="text-lg text-slate-600 mb-4">
                    Your appointment with {location.name} has been confirmed.
                  </p>
                  <div className="bg-slate-50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-slate-600 mb-1">Scheduled for</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {selectedDateObj?.day}, {selectedDate} at {selectedTime}
                    </p>
                  </div>
                  <p className="text-sm text-slate-500">
                    A confirmation email has been sent to your inbox.
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-start justify-between p-6 border-b border-slate-200">
                    <div className="flex items-start space-x-4">
                      <img
                        src={location.image}
                        alt={location.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">
                          Book Session with {location.name}
                        </h2>
                        <p className="text-slate-600">
                          ${location.sessionRate}/hr • 50 min session
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <XIcon className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-6">
                    {/* Session Type */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">
                        Session Type
                      </h3>
                      <div className="flex items-center space-x-3 p-4 bg-teal-50 border-2 border-teal-200 rounded-xl">
                        <VideoIcon className="w-5 h-5 text-teal-600" />
                        <div>
                          <p className="font-medium text-slate-900">
                            Video Call
                          </p>
                          <p className="text-sm text-slate-600">
                            Secure, confidential video session
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Date Selection */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                        <CalendarIcon className="w-5 h-5 mr-2 text-teal-600" />
                        Select Date
                      </h3>
                      <div className="grid grid-cols-5 gap-3">
                        {availableDates.map((dateObj) => (
                          <button
                            key={dateObj.date}
                            onClick={() => {
                              setSelectedDate(dateObj.date)
                              setSelectedTime(null)
                            }}
                            className={`p-3 rounded-xl border-2 transition-all ${selectedDate === dateObj.date ? 'border-teal-600 bg-teal-50' : 'border-slate-200 hover:border-slate-300'}`}
                          >
                            <p className="text-xs text-slate-600 mb-1">
                              {dateObj.day}
                            </p>
                            <p className="text-sm font-semibold text-slate-900">
                              {new Date(dateObj.date).getDate()}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Selection */}
                    {selectedDate && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className="mb-6"
                      >
                        <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                          <ClockIcon className="w-5 h-5 mr-2 text-teal-600" />
                          Select Time
                        </h3>
                        <div className="grid grid-cols-4 gap-3">
                          {selectedDateObj?.slots.map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`p-3 rounded-xl border-2 transition-all ${selectedTime === time ? 'border-teal-600 bg-teal-50' : 'border-slate-200 hover:border-slate-300'}`}
                            >
                              <p className="text-sm font-medium text-slate-900">
                                {time}
                              </p>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Important Notes */}
                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="font-semibold text-slate-900 mb-2">
                        Before your session:
                      </h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• Find a quiet, private space</li>
                        <li>• Test your camera and microphone</li>
                        <li>• Have a stable internet connection</li>
                        <li>• You'll receive a video link 15 minutes before</li>
                      </ul>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-600">Total</span>
                      <span className="text-2xl font-bold text-slate-900">
                        ${location.sessionRate}
                      </span>
                    </div>
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      disabled={!selectedDate || !selectedTime}
                      onClick={handleConfirmBooking}
                    >
                      Confirm Booking
                    </Button>
                    <p className="text-xs text-slate-500 text-center mt-3">
                      Free cancellation up to 24 hours before your session
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
