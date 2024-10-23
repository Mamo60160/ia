import React from "react";
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, FlatList } from "react-native";

const flightsData = [
  {
    id: '1',
    from: 'ENG',
    to: 'SFO',
    duration: '2h 35m',
    departure: 'Feb 25, 11:30pm',
    flightNumber: 'AB8689',
    price: '$500',
  },
  {
    id: '2',
    from: 'CDG',
    to: 'JFK',
    duration: '7h 50m',
    departure: 'Feb 26, 2:00pm',
    flightNumber: 'AF102',
    price: '$750',
  },
];

const popularPlacesData = [
  {
    id: '1',
    image: 'https://www.dubai.it/fr/wp-content/uploads/sites/143/dubai-marina.jpg',
    name: 'Dubai',
  },
  {
    id: '2',
    image: 'https://lp-cms-production.imgix.net/2024-05/shutterstockRF704449474-color.jpg?w=1440&h=810&fit=crop&auto=format&q=75',
    name: 'Switzerland',
  },
];

export default function App() {
  const renderFlight = ({ item }) => (
    <View
      style={{
        backgroundColor: '#fff',
        marginVertical: 10,
        padding:14,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.from}</Text>
        {/* Remplacer l'icône par un texte */}
        <Text style={{ marginHorizontal: 10 }}>✈️</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.to}</Text>
      </View>
      <View>
        <Text>{item.duration}</Text>
        <Text>{item.departure}</Text>
      </View>
      <View>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.price}</Text>
      </View>
    </View>
  );

  const renderPopularPlace = ({ item }) => (
    <TouchableOpacity style={{ marginRight: 10 }}>
      <Image
        source={{ uri: item.image }}
        style={{ width: 150, height: 150, borderRadius: 10 }}
      />
      <Text style={{ textAlign: 'center', marginTop: 5, fontWeight: 'bold' }}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F8F8" }}>
      {}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 36, alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: '#cc2a4b', fontWeight: 'bold' }}>TUI</Text>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5556/5556468.png' }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
      </View>

      {}
      <ScrollView style={{ flex: 1 }}>
        {}
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>Ou allons-nous ?</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#E8E8E8',
              borderRadius: 10,
              paddingHorizontal: 10,
              marginTop: 10,
              height: 50,
            }}
          >
            {}
            <Text>🔍</Text>
            <TextInput
              placeholder="Search a flight"
              style={{ flex: 1, paddingHorizontal: 10 }}
            />
          </View>
        </View>

        {}
        <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Vols disponibles</Text>
          <FlatList
            data={flightsData}
            renderItem={renderFlight}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            style={{ marginVertical: 10 }}
          />
        </View>

        {}
        <View style={{ paddingHorizontal: 40, marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Places populaires</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            <FlatList
              horizontal
              data={popularPlacesData}
              renderItem={renderPopularPlace}
              keyExtractor={(item) => item.id}
            />
          </ScrollView>
        </View>
        <View style={{ paddingHorizontal: 40, marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}></Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            <FlatList
              horizontal
              data={popularPlacesData}
              renderItem={renderPopularPlace}
              keyExtractor={(item) => item.id}
            />
          </ScrollView>
        </View>
      </ScrollView>

      {}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          height: 60,
          backgroundColor: "#FFF",
          borderTopWidth: 1,
          borderColor: "#E8E8E8",
        }}
      >
        <TouchableOpacity>
          {}
          <Text>🏠</Text>
          <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>✈️</Text>
          <Text>Flights</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>👤</Text>
          <Text>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
