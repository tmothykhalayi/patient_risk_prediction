
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { CheckCircleIcon, ClockIcon, AwardIcon } from 'lucide-react'
export interface LocationProfile {
  id: string
  name: string
  image: string
  licenseNumber: string
  specializations: string[]
  yearsExperience: number
  bio: string
  sessionRate: number
  isAcceptingClients: boolean
  availableSlots?: string[]
}
interface LocationCardProps {
  location: LocationProfile
  onBookSession: (location: LocationProfile) => void
}
export function LocationCard({
  location,
  onBookSession,
}: LocationCardProps) {
  return (
    <Card className="h-full overflow-hidden group">
      {/* Location Image */}
      <div className="relative h-64 -mx-6 -mt-6 mb-4 overflow-hidden">
        <img
          src={location.image}
          alt={location.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent"></div>

        {/* Availability Badge */}
        <div className="absolute top-4 right-4">
          {location.isAcceptingClients ? (
            <span className="flex items-center space-x-1 bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              <CheckCircleIcon className="w-3 h-3" />
              <span>Open Now</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 bg-slate-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              <ClockIcon className="w-3 h-3" />
              <span>Closed</span>
            </span>
          )}
        </div>

        {/* Name Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white mb-1">
            {location.name}
          </h3>
          <p className="text-sm text-slate-200 flex items-center space-x-2">
            <AwardIcon className="w-4 h-4" />
            <span>Rental Location • {location.licenseNumber}</span>
          </p>
        </div>
      </div>

      {/* Experience & Rate */}
      {location.yearsExperience > 0 && (
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
        <div>
          <p className="text-sm text-slate-600">Experience</p>
          <p className="text-lg font-semibold text-slate-900">
            {location.yearsExperience} years
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-600">Session Rate</p>
          <p className="text-lg font-semibold text-blue-600">
            ${location.sessionRate}/hr
          </p>
        </div>
      </div>
      )}

      {/* Specializations */}
      <div className="mb-4">
        <p className="text-sm font-medium text-slate-700 mb-2">
          Services & Features
        </p>
        <div className="flex flex-wrap gap-2">
          {location.specializations.slice(0, 3).map((spec, idx) => (
            <span
              key={idx}
              className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
            >
              {spec}
            </span>
          ))}
          {location.specializations.length > 3 && (
            <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
              +{location.specializations.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
        {location.bio}
      </p>

      {/* CTA Button */}
      <Button
        variant={location.isAcceptingClients ? 'primary' : 'ghost'}
        size="md"
        className="w-full"
        onClick={() => onBookSession(location)}
        disabled={!location.isAcceptingClients}
      >
        {location.isAcceptingClients ? 'View Location' : 'Currently Closed'}
      </Button>
    </Card>
  )
}
