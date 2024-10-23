
import React, { useState } from 'react';
import { ScrollView, View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import askGPT from './server'; 
const App = () => {
  const [gptResponse, setGptResponse] = useState('');

  // Fonction pour gérer l'appel à GPT lors du clic
  const handleGPTClick = async () => {
    const response = await askGPT('Quels sont les meilleurs endroits pour voyager ?');  // Exemple de question
    setGptResponse(response);
    Alert.alert('Réponse GPT', response);  // Affiche la réponse dans une alerte
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>TUI</Text>
        <TouchableOpacity>
          <Text style={styles.bell}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Chercher des vacances en avion"
          placeholderTextColor="#777"
        />
      </View>

      {/* Last minute dates */}
      <Text style={styles.sectionTitle}>Last minutes en...</Text>
      <View style={styles.datesContainer}>
        {['10/24', '11/24', '12/24'].map((date, index) => (
          <TouchableOpacity key={index} style={styles.dateCard}>
            <Text style={styles.dateIcon}>✈️</Text>
            <Text style={styles.dateText}>{date}</Text>
            <Text style={styles.monthText}>{['Octobre', 'Novembre', 'Décembre'][index]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Cities by country */}
      <View>
        {/* Italy */}
        <Text style={styles.countryTitle}>Italie</Text>
        <View style={styles.citiesRow}>
          {['Venise', 'Florence', 'Rome'].map((city, index) => (
            <CityCard key={index} city={city} />
          ))}
        </View>

        {/* Spain */}
        <Text style={styles.countryTitle}>Espagne</Text>
        <View style={styles.citiesRow}>
          {['Madrid', 'Tenerif', 'Andalousie'].map((city, index) => (
            <CityCard4 key={index} city={city} />
          ))}
        </View>

        {/* Greece */}
        <Text style={styles.countryTitle}>Grèce</Text>
        <View style={styles.citiesRow}>
          {['Athènes', 'Mykonos', 'Crète'].map((city, index) => (
            <CityCard3 key={index} city={city} />
          ))}
        </View>

        {/* Portugal */}
        <Text style={styles.countryTitle}>Portugal</Text>
        <View style={styles.citiesRow}>
          {['Lisbonne', 'Porto', 'Algarve'].map((city, index) => (
            <CityCard2 key={index} city={city} />
          ))}
        </View>
      </View>

      {/* Footer Image - Clic déclenche l'appel à GPT */}
      <View style={styles.footerImageContainer}>
        <TouchableOpacity onPress={handleGPTClick}>
          <Image
            source={require('../assets/footerImage.png')}
            style={styles.footerImage}
          />
        </TouchableOpacity>
      </View>

      {/* Affichage de la réponse GPT */}
      {gptResponse ? (
        <View style={styles.responseContainer}>
          <Text style={styles.responseText}>{gptResponse}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
};


const CityCard = ({ city }) => {
  return (
    <View style={styles.cityCard}>
      <Image
        style={styles.cityImage}
        source={{ uri: 'https://www.okvoyage.com/wp-content/uploads/2022/09/le-village-de-vernazza-dans-les-plus-beaux-paysages-ditalie-du-nord-1024x683.jpg' }}
      />
      <Text style={styles.cityText}>{city}</Text>
    </View>
  );
};

const CityCard2 = ({ city }) => {
  return (
    <View style={styles.cityCard}>
      {}
      <Image
        style={styles.cityImage}
        source={{ uri: 'https://static3.depositphotos.com/1000970/121/i/450/depositphotos_1216797-stock-photo-beach-scene.jpg' }}
      />
      <Text style={styles.cityText}>{city}</Text>
    </View>
  );
};

const CityCard3 = ({ city }) => {
  return (
    <View style={styles.cityCard}>
      {}
      <Image
        style={styles.cityImage}
        source={{ uri: 'https://figuredart.com/cdn/shop/products/FA10051_f231e85f-deae-499a-ac90-5e0d359ab865_530x@2x.jpg?v=1639072560' }}
      />
      <Text style={styles.cityText}>{city}</Text>
    </View>
  );
};

const CityCard4= ({ city }) => {
  return (
    <View style={styles.cityCard}>
      {}
      <Image
        style={styles.cityImage}
        source={{ uri: 'https://www.civitatis.com/blog/wp-content/uploads/2021/04/medulas-parque-nacional-espana.jpg' }}
      />
      <Text style={styles.cityText}>{city}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: '#DFF2E1',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f00',
  },
  bell: {
    fontSize: 24,
  },
  searchContainer: {
    padding: 20,
    marginTop: 10,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 15,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  dateCard: {
    alignItems: 'center',
    backgroundColor: '#EBF8F2',
    padding: 10,
    borderRadius: 10,
    width: 80,
  },
  dateIcon: {
    fontSize: 24,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  monthText: {
    fontSize: 14,
    color: '#777',
  },
  countryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  citiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  cityCard: {
    alignItems: 'center',
  },
  cityImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  cityText: {
    marginTop: 5,
    fontSize: 14,
  },
  footerImageContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  footerImage: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  responseContainer: {
    padding: 20,
    alignItems: 'center',
  },
  responseText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
