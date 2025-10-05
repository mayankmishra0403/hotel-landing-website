import { Room, Hotel, Review } from '@/types/hotel'

export const hotelData: Hotel = {
  name: "Hotel Ritam",
  description: "Experience luxury and comfort at Hotel Ritam, where modern elegance meets traditional hospitality. Located in the heart of the city, our hotel offers world-class amenities and exceptional service.",
  address: "123 Luxury Avenue, Downtown City, State 12345",
  phone: "+1 (555) 123-4567",
  email: "info@hotelritam.com",
  amenities: [
    "Free WiFi",
    "Swimming Pool",
    "Fitness Center", 
    "Spa & Wellness",
    "Restaurant & Bar",
    "24/7 Room Service",
    "Concierge Service",
    "Valet Parking",
    "Business Center",
    "Airport Shuttle"
  ],
  images: [
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1600",
    "https://images.unsplash.com/photo-1551776235-dde6d4829808?q=80&w=1600",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1600",
    "https://images.unsplash.com/photo-1551040823-8ea9b2d57a12?q=80&w=1600"
  ],
  rating: 4.8,
  reviews: [
    {
      id: "1",
      guestName: "Sarah Johnson",
      rating: 5,
      comment: "Absolutely wonderful stay! The staff was incredibly friendly and the room was spotless.",
      date: new Date("2024-09-15")
    },
    {
      id: "2", 
      guestName: "Michael Chen",
      rating: 4,
      comment: "Great location and excellent amenities. The breakfast was delicious!",
      date: new Date("2024-09-10")
    },
    {
      id: "3",
      guestName: "Emma Davis", 
      rating: 5,
      comment: "Perfect for a business trip. The business center and WiFi were excellent.",
      date: new Date("2024-09-08")
    }
  ]
}

export const roomsData: Room[] = [
  {
    id: "deluxe-king",
    name: "Deluxe King Room",
    description: "Spacious room with king-size bed, city view, and modern amenities perfect for couples or business travelers.",
    price: 199,
    capacity: 2,
    amenities: [
      "King Size Bed",
      "City View", 
      "Free WiFi",
      "Mini Bar",
      "Air Conditioning",
      "Flat Screen TV",
      "Coffee Machine",
      "Safe",
      "Desk & Chair"
    ],
    images: [
      "https://images.unsplash.com/photo-1505692750524-80ed2b3e0e1e?q=80&w=1600",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600", 
      "https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1600"
    ],
    available: true,
    size: 35,
    bedType: "King"
  },
  {
    id: "executive-suite",
    name: "Executive Suite",
    description: "Luxurious suite with separate living area, panoramic city views, and premium amenities for the discerning traveler.",
    price: 399,
    capacity: 4,
    amenities: [
      "King Size Bed",
      "Separate Living Room",
      "Panoramic City View",
      "Premium WiFi",
      "Kitchenette",
      "Dining Area", 
      "Jacuzzi",
      "Premium Toiletries",
      "Concierge Service",
      "Complimentary Breakfast"
    ],
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1600",
      "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d19?q=80&w=1600",
      "https://images.unsplash.com/photo-1560067174-894d3daf9d76?q=80&w=1600"
    ],
    available: true,
    size: 65,
    bedType: "King"
  },
  {
    id: "family-room",
    name: "Family Room",
    description: "Perfect for families with children, featuring two double beds and extra space for a comfortable stay.",
    price: 249,
    capacity: 4,
    amenities: [
      "Two Double Beds",
      "Family Friendly",
      "Free WiFi",
      "Mini Fridge",
      "Air Conditioning",
      "Cable TV",
      "Coffee Machine",
      "Safe",
      "Extra Towels & Linens"
    ],
    images: [
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600",
      "https://images.unsplash.com/photo-1521783593319-7e0524b5dfb0?q=80&w=1600"
    ],
    available: true,
    size: 45,
    bedType: "Double"
  },
  {
    id: "standard-queen",
    name: "Standard Queen Room", 
    description: "Comfortable and affordable accommodation with queen bed and essential amenities for a pleasant stay.",
    price: 149,
    capacity: 2,
    amenities: [
      "Queen Size Bed",
      "Free WiFi",
      "Air Conditioning", 
      "Flat Screen TV",
      "Coffee Machine",
      "Private Bathroom",
      "Daily Housekeeping"
    ],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600"
    ],
    available: true,
    size: 25,
    bedType: "Queen"
  },
  {
    id: "presidential-suite",
    name: "Presidential Suite",
    description: "The ultimate luxury experience with spacious rooms, butler service, and exclusive amenities.",
    price: 799,
    capacity: 6,
    amenities: [
      "King Size Bed",
      "Multiple Rooms",
      "Butler Service",
      "Private Terrace",
      "Full Kitchen",
      "Dining Room",
      "Living Room",
      "Jacuzzi & Steam Room",
      "Premium Everything",
      "Complimentary Services"
    ],
    images: [
      "https://images.unsplash.com/photo-1528908929486-dfaa209c6985?q=80&w=1600",
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1600",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1600",
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1600"
    ],
    available: true,
    size: 120,
    bedType: "King"
  },
  {
    id: "business-room",
    name: "Business Room",
    description: "Designed for business travelers with dedicated workspace, high-speed internet, and business amenities.",
    price: 179,
    capacity: 2,
    amenities: [
      "Queen Size Bed",
      "Large Work Desk",
      "Ergonomic Chair", 
      "High-Speed WiFi",
      "Multi-port Charging",
      "Business Phone",
      "Iron & Ironing Board",
      "Coffee Machine",
      "Safe"
    ],
    images: [
      "https://images.unsplash.com/photo-1541123356219-284ace7d3fa9?q=80&w=1600",
      "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d19?q=80&w=1600"
    ],
    available: true,
    size: 30,
    bedType: "Queen"
  }
]
