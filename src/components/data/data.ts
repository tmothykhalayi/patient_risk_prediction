import {
  CarIcon,
  MapPinIcon,
  DollarSignIcon,
  ShieldIcon,
  UsersIcon,
} from 'lucide-react'

export const resources = [
    {
      category: 'Economy Cars',
      icon: CarIcon,
      image:
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      items: [
        {
          title: 'Compact Sedans',
          description:
            'Perfect for city driving and daily commutes. Fuel-efficient and easy to park.',
          type: 'Fleet',
          readTime: '$35/day',
          image:
            'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400&q=80',
        },
        {
          title: 'Hatchback Models',
          description:
            'Versatile and practical with great fuel economy. Ideal for 2-4 passengers.',
          type: 'Fleet',
          readTime: '$40/day',
          image:
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&q=80',
        },
        {
          title: 'Hybrid Options',
          description:
            'Eco-friendly vehicles with excellent mileage and low emissions.',
          type: 'Fleet',
          readTime: '$45/day',
          image:
            'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&q=80',
        },
      ],
    },
    {
      category: 'SUVs & Trucks',
      icon: CarIcon,
      image:
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
      items: [
        {
          title: 'Midsize SUVs',
          description:
            'Spacious interior with room for 5-7 passengers. Perfect for family trips.',
          type: 'Fleet',
          readTime: '$75/day',
          image:
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80',
        },
        {
          title: 'Full-Size SUVs',
          description:
            'Maximum space and comfort for large groups or cargo needs.',
          type: 'Fleet',
          readTime: '$95/day',
          image:
            'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&q=80',
        },
        {
          title: 'Pickup Trucks',
          description:
            'Heavy-duty capability for hauling and towing. Work or adventure ready.',
          type: 'Fleet',
          readTime: '$85/day',
          image:
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80',
        },
      ],
    },
    {
      category: 'Luxury Vehicles',
      icon: DollarSignIcon,
      image:
        'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&q=80',
      items: [
        {
          title: 'Premium Sedans',
          description:
            'High-end comfort and performance for business travel or special occasions.',
          type: 'Fleet',
          readTime: '$120/day',
          image:
            'https://images.unsplash.com/photo-1617531653520-bd466c664f9d?w=400&q=80',
        },
        {
          title: 'Luxury SUVs',
          description:
            'Top-tier amenities with spacious interiors and advanced features.',
          type: 'Fleet',
          readTime: '$150/day',
          image:
            'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80',
        },
        {
          title: 'Sports Cars',
          description:
            'Thrilling performance and style for an unforgettable driving experience.',
          type: 'Fleet',
          readTime: '$200/day',
          image:
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80',
        },
      ],
    },
    {
      category: 'Rental Locations',
      icon: MapPinIcon,
      image:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
      items: [
        {
          title: 'Airport Locations',
          description:
            'Convenient pickup and drop-off at major airports with free shuttle service.',
          type: 'Location',
          readTime: '24/7 Open',
          image:
            'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=400&q=80',
        },
        {
          title: 'Downtown Offices',
          description:
            'Easy access in city centers with extended business hours and validated parking.',
          type: 'Location',
          readTime: '6AM-10PM',
          image:
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80',
        },
        {
          title: 'Delivery Service',
          description:
            'We bring the car to you. Available for rentals of 3+ days at select locations.',
          type: 'Service',
          readTime: 'By Appt',
          image:
            'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80',
        },
      ],
    },
    {
      category: 'Insurance & Protection',
      icon: ShieldIcon,
      image:
        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
      items: [
        {
          title: 'Basic Coverage',
          description:
            'Included with all rentals: liability, collision damage waiver, and theft protection.',
          type: 'Insurance',
          readTime: 'Included',
          image:
            'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80',
        },
        {
          title: 'Premium Protection',
          description:
            'Zero deductible coverage with roadside assistance and personal accident insurance.',
          type: 'Insurance',
          readTime: '+$15/day',
          image:
            'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80',
        },
        {
          title: 'Young Driver Coverage',
          description:
            'Special insurance options for drivers aged 21-24 with flexible terms.',
          type: 'Insurance',
          readTime: '+$25/day',
          image:
            'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80',
        },
      ],
    },
    {
      category: 'Rental Guides',
      icon: UsersIcon,
      image:
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80',
      items: [
        {
          title: 'How to Book',
          description:
            'Step-by-step guide to reserving your vehicle online or via our mobile app.',
          type: 'Guide',
          readTime: '5 min',
          image:
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
        },
        {
          title: 'Pickup & Return Process',
          description:
            'What to expect when collecting and returning your rental vehicle.',
          type: 'Guide',
          readTime: '6 min',
          image:
            'https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=400&q=80',
        },
        {
          title: 'Long-Term Rentals',
          description:
            'Save with weekly and monthly rates. Includes free vehicle swaps and priority service.',
          type: 'Guide',
          readTime: '8 min',
          image:
            'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&q=80',
        },
      ],
    },
  ]