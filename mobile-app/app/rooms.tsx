import { SafeAreaView, View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'

const rooms = [
  { 
    id: 'deluxe-king', 
    name: 'Deluxe King Room', 
    price: 199, 
    capacity: 2,
    description: 'Spacious room with city view and modern amenities',
    amenities: ['King Size Bed', 'City View', 'Free WiFi', 'Mini Bar']
  },
  { 
    id: 'executive-suite', 
    name: 'Executive Suite', 
    price: 399, 
    capacity: 4,
    description: 'Luxurious suite with separate living area',
    amenities: ['King Size Bed', 'Living Room', 'City View', 'Kitchenette']
  },
  { 
    id: 'family-room', 
    name: 'Family Room', 
    price: 249, 
    capacity: 4,
    description: 'Perfect for families with extra space',
    amenities: ['Two Double Beds', 'Family Friendly', 'Free WiFi', 'Mini Fridge']
  },
]

export default function RoomsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        <View style={{ marginBottom: 20 }}>
          <Link asChild href="/">
            <TouchableOpacity style={{ marginBottom: 12 }}>
              <Text style={{ color: '#2563eb', fontSize: 16 }}>← Back to Home</Text>
            </TouchableOpacity>
          </Link>
          <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 8 }}>
            🛏️ Rooms & Suites
          </Text>
          <Text style={{ fontSize: 16, color: '#6b7280' }}>
            Discover our luxury accommodations
          </Text>
        </View>

        {/* Rooms List */}
        {rooms.map((room) => (
          <View key={room.id} style={{ 
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', flex: 1 }}>{room.name}</Text>
              <View style={{ backgroundColor: '#2563eb', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 }}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>${room.price}/night</Text>
              </View>
            </View>
            
            <Text style={{ color: '#6b7280', marginBottom: 8, fontSize: 14 }}>
              Up to {room.capacity} guests
            </Text>
            
            <Text style={{ color: '#374151', marginBottom: 12, lineHeight: 20 }}>
              {room.description}
            </Text>
            
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontWeight: '600', marginBottom: 6, color: '#374151' }}>Amenities:</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {room.amenities.map((amenity, index) => (
                  <View key={index} style={{ 
                    backgroundColor: '#f3f4f6', 
                    paddingHorizontal: 8, 
                    paddingVertical: 4, 
                    borderRadius: 6 
                  }}>
                    <Text style={{ fontSize: 12, color: '#6b7280' }}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <TouchableOpacity style={{ 
              backgroundColor: '#059669', 
              paddingVertical: 12, 
              paddingHorizontal: 16, 
              borderRadius: 8,
              alignItems: 'center'
            }}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Book Now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
