import React, { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'

import { MailIcon, MessageSquareIcon, ClockIcon, PhoneIcon, MapPinIcon, HeadphonesIcon } from 'lucide-react'
import { Header } from '../components/layout/Header'
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

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Contact form submitted:', formData)
    setSubmitted(true)
  }
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  return (
    <>
    <div className="w-full">
      <Header />
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[800px] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&q=80"
            alt="Customer service"
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
            Get in Touch
          </h1>
          <p className="text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto">
            Have questions about our vehicles or rentals? Our dedicated team is here to help you 24/7.
          </p>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white to-transparent z-10"></div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Contact Methods Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card hover className="h-full text-center group cursor-pointer">
                <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                  <PhoneIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Call Us</h3>
                <p className="text-slate-600 mb-2">0795978606</p>
                <p className="text-sm text-slate-500">Available 24/7</p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full text-center group cursor-pointer">
                <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                  <MailIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Email Us</h3>
                <p className="text-slate-600 mb-2">support@autohub.com</p>
                <p className="text-sm text-slate-500">Response within 2 hours</p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full text-center group cursor-pointer">
                <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                  <MessageSquareIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Live Chat</h3>
                <p className="text-slate-600 mb-2">Instant Support</p>
                <p className="text-sm text-slate-500">Available 24/7</p>
              </Card>
            </motion.div>
          </motion.div>

          {/* Main Contact Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Send us a message</h2>
              <Card className="shadow-lg">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MailIcon className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                      Message sent successfully!
                    </h3>
                    <p className="text-slate-600 mb-8">
                      Thank you for contacting us. Our team will respond within 24 hours.
                    </p>
                    <Button variant="primary" onClick={() => setSubmitted(false)}>
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                      />

                      <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    <Input
                      label="Subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      required
                    />

                    <Input
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your question or feedback..."
                      multiline
                      rows={6}
                      required
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                    >
                      Send Message
                    </Button>
                  </form>
                )}
              </Card>
            </motion.div>

            {/* Additional Info & Business Hours */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Visit our office</h2>
                <Card className="shadow-lg">
                  <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <MapPinIcon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Main Office</h3>
                  <p className="text-slate-600 mb-4">
                    123 Uthiru Avenue ooposite shujaa mall<br />
                     Nairobi<br />
                    Kenya
                  </p>
                  <a href="#" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                    Get directions
                    <span className="ml-2">→</span>
                  </a>
                </Card>
              </div>

              <Card className="shadow-lg">
                <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <ClockIcon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Business Hours</h3>
                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium">8:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium">9:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium">10:00 AM - 8:00 PM</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600 flex items-center">
                    <HeadphonesIcon className="w-4 h-4 mr-2 text-blue-600" />
                    24/7 Emergency Support Available
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Quick answers to common questions about AutoHub
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card hover className="h-full bg-linear-to-br from-blue-50 to-white border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  What documents do I need to rent a car?
                </h3>
                <p className="text-slate-700">
                  You'll need a valid driver's license, a credit card in your name,
                  and proof of insurance. International renters may need an
                  International Driving Permit.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full bg-linear-to-br from-purple-50 to-white border-l-4 border-purple-500">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">
                  Can I modify or cancel my reservation?
                </h3>
                <p className="text-slate-700">
                  Yes! You can modify or cancel your reservation up to 24 hours
                  before your pickup time for a full refund. Changes made within
                  24 hours may incur fees.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full bg-linear-to-br from-green-50 to-white border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-green-900 mb-3">
                  What's included in the rental price?
                </h3>
                <p className="text-slate-700">
                  Our rental prices include basic insurance, unlimited mileage,
                  24/7 roadside assistance, and free cancellation up to 24 hours
                  before pickup. Additional coverage is available.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full bg-linear-to-br from-orange-50 to-white border-l-4 border-orange-500">
                <h3 className="text-lg font-semibold text-orange-900 mb-3">
                  Do you offer long-term rentals?
                </h3>
                <p className="text-slate-700">
                  Yes! We offer special rates for weekly and monthly rentals.
                  Long-term rentals include free vehicle swaps, priority maintenance,
                  and dedicated customer support.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full bg-linear-to-br from-teal-50 to-white border-l-4 border-teal-500">
                <h3 className="text-lg font-semibold text-teal-900 mb-3">
                  What is your fuel policy?
                </h3>
                <p className="text-slate-700">
                  We provide vehicles with a full tank. You can return it full or choose
                  our prepaid fuel option. Partial returns are charged at a premium rate.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full bg-linear-to-br from-pink-50 to-white border-l-4 border-pink-500">
                <h3 className="text-lg font-semibold text-pink-900 mb-3">
                  Can I add additional drivers?
                </h3>
                <p className="text-slate-700">
                  Yes, additional drivers can be added for a small daily fee. All drivers
                  must meet our age and license requirements and be present at pickup.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&q=80"
            alt="Car rental"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-blue-900/95 to-slate-900/90"></div>
        </div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to hit the road?
          </h2>
          <p className="text-xl text-slate-200 mb-10 leading-relaxed">
            Browse our fleet and book your perfect vehicle today. Great rates and exceptional service await.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/vehicles">
              <button className="bg-orange-500 text-white px-8 py-4 rounded-lg font-medium hover:bg-orange-600 transition-all duration-200 text-lg">
                View Our Fleet
              </button>
            </a>
            <a href="/locations">
              <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-medium hover:bg-white/20 transition-all duration-200 text-lg border border-white/20">
                Find Locations
              </button>
            </a>
          </div>
        </motion.div>
      </section>

    </div>
    </>
  )
}
