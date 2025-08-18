import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { router, Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { 
  FadeInUp, 
  FadeInDown, 
  SlideInUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const { width } = Dimensions.get("window");

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
}

export default function LocationScreen() {
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [manualAddress, setManualAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [useManualEntry, setUseManualEntry] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [currentMapLocation, setCurrentMapLocation] = useState({
    latitude: 28.6139, // Default to Delhi
    longitude: 77.2090,
  });

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === "granted");
      
      if (status === "granted") {
        getCurrentLocation();
      } else {
        Alert.alert(
          "Location Permission",
          "Location access is needed to help you find your store location easily. You can also enter your address manually.",
          [
            { text: "Manual Entry", onPress: () => setUseManualEntry(true) },
            { text: "Grant Permission", onPress: requestLocationPermission },
          ]
        );
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
      setUseManualEntry(true);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      // Reverse geocode to get address
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      if (address[0]) {
        const locationData: LocationData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: `${address[0].street || ""} ${address[0].streetNumber || ""}`.trim(),
          city: address[0].city || address[0].subregion || "",
          country: address[0].country || "",
        };
        setSelectedLocation(locationData);
        setSearchQuery(locationData.address);
        setCurrentMapLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        updateMapLocation(location.coords.latitude, location.coords.longitude);
      }
    } catch (error) {
      console.error("Error getting current location:", error);
      Alert.alert("Error", "Unable to get current location. Please search manually.");
      setUseManualEntry(true);
    } finally {
      setIsLoading(false);
    }
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsLoading(true);
      const geocoded = await Location.geocodeAsync(searchQuery);
      
      if (geocoded.length > 0) {
        const location = geocoded[0];
        const locationData: LocationData = {
          latitude: location.latitude,
          longitude: location.longitude,
          address: searchQuery,
          city: "",
          country: "",
        };
        setSelectedLocation(locationData);
        setCurrentMapLocation({
          latitude: location.latitude,
          longitude: location.longitude,
        });
        updateMapLocation(location.latitude, location.longitude);
        Alert.alert("Location Found", "Location has been set successfully!");
      } else {
        Alert.alert("Not Found", "Location not found. Please try a different search term or enter manually.");
      }
    } catch (error) {
      console.error("Error searching location:", error);
      Alert.alert("Error", "Unable to search location. Please try manual entry.");
      setUseManualEntry(true);
    } finally {
      setIsLoading(false);
    }
  };

  const setManualLocation = () => {
    if (!manualAddress.trim()) {
      Alert.alert("Error", "Please enter a valid address.");
      return;
    }

    const locationData: LocationData = {
      latitude: 0, // Will be geocoded later if needed
      longitude: 0,
      address: manualAddress,
      city: "",
      country: "",
    };
    setSelectedLocation(locationData);
    Alert.alert("Address Set", "Your store address has been set!");
  };

  const updateMapLocation = (lat: number, lng: number) => {
    if (webViewRef.current) {
      const script = `
        if (window.map && window.marker) {
          window.map.setView([${lat}, ${lng}], 16);
          window.marker.setLatLng([${lat}, ${lng}]);
        }
      `;
      webViewRef.current.postMessage(script);
    }
  };

  const handleMapMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'mapClick') {
        const { lat, lng } = data;
        setCurrentMapLocation({ latitude: lat, longitude: lng });
        
        // Reverse geocode the clicked location
        try {
          setIsLoading(true);
          const address = await Location.reverseGeocodeAsync({
            latitude: lat,
            longitude: lng,
          });
          
          if (address[0]) {
            const locationData: LocationData = {
              latitude: lat,
              longitude: lng,
              address: `${address[0].street || ""} ${address[0].streetNumber || ""}`.trim(),
              city: address[0].city || address[0].subregion || "",
              country: address[0].country || "",
            };
            setSelectedLocation(locationData);
            setSearchQuery(locationData.address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          } else {
            const locationData: LocationData = {
              latitude: lat,
              longitude: lng,
              address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
              city: "",
              country: "",
            };
            setSelectedLocation(locationData);
            setSearchQuery(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          }
        } catch (error) {
          console.error("Error reverse geocoding:", error);
          const locationData: LocationData = {
            latitude: lat,
            longitude: lng,
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            city: "",
            country: "",
          };
          setSelectedLocation(locationData);
          setSearchQuery(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Error handling map message:", error);
    }
  };

  const confirmLocation = () => {
    if (selectedLocation) {
      // Navigate to store info with location data
      router.push({
        pathname: "/(auth)/storeInfo",
        params: {
          latitude: selectedLocation.latitude.toString(),
          longitude: selectedLocation.longitude.toString(),
          address: selectedLocation.address,
          city: selectedLocation.city,
        },
      });
    }
  };

  const getMapHTML = () => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Store Location Selector</title>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        body { margin: 0; padding: 0; }
        #map { 
          height: 100vh; 
          width: 100vw; 
        }
        .custom-marker {
          background: #f97316;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>
        // Initialize map
        const map = L.map('map').setView([${currentMapLocation.latitude}, ${currentMapLocation.longitude}], 14);
        window.map = map;
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);
        
        // Custom marker icon
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: '🏪',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });
        
        // Add marker
        const marker = L.marker([${currentMapLocation.latitude}, ${currentMapLocation.longitude}], {
          icon: customIcon,
          draggable: true
        }).addTo(map);
        window.marker = marker;
        
        marker.bindPopup('<b>Store Location</b><br>Tap anywhere to move marker').openPopup();
        
        // Handle map clicks
        map.on('click', function(e) {
          const lat = e.latlng.lat;
          const lng = e.latlng.lng;
          marker.setLatLng([lat, lng]);
          marker.bindPopup('<b>Store Location</b><br>Latitude: ' + lat.toFixed(6) + '<br>Longitude: ' + lng.toFixed(6)).openPopup();
          
          // Send location to React Native
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'mapClick',
            lat: lat,
            lng: lng
          }));
        });
        
        // Handle marker drag
        marker.on('dragend', function(e) {
          const lat = e.target.getLatLng().lat;
          const lng = e.target.getLatLng().lng;
          marker.bindPopup('<b>Store Location</b><br>Latitude: ' + lat.toFixed(6) + '<br>Longitude: ' + lng.toFixed(6)).openPopup();
          
          // Send location to React Native
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'mapClick',
            lat: lat,
            lng: lng
          }));
        });
        
        // Disable zoom on double click to prevent conflicts
        map.doubleClickZoom.disable();
      </script>
    </body>
    </html>
    `;
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      
      <LinearGradient
        colors={["#fff7ed", "#ffffff", "#fff7ed"]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView className="flex-1">
          {/* Header */}
          <View
            style={{
              paddingTop: insets.top + 10,
              paddingBottom: 15,
              paddingHorizontal: 20,
            }}
          >
            <Animated.View 
              entering={FadeInDown.delay(200)}
              className="flex-row items-center justify-between"
            >
              <TouchableOpacity
                onPress={() => router.back()}
                className="p-2 bg-white rounded-full shadow-sm"
              >
                <Ionicons name="arrow-back" size={24} color="#f97316" />
              </TouchableOpacity>
              
              <View className="flex-1 items-center">
                <Text className="text-xl font-bold text-gray-900">
                  Store Location
                </Text>
                <Text className="text-sm text-gray-600">
                  Set your store address
                </Text>
              </View>
              
              {hasLocationPermission && (
                <TouchableOpacity
                  onPress={getCurrentLocation}
                  className="p-2 bg-orange-100 rounded-full"
                  disabled={isLoading}
                >
                  <Ionicons 
                    name="locate" 
                    size={24} 
                    color="#f97316" 
                  />
                </TouchableOpacity>
              )}
            </Animated.View>
          </View>

          {/* Content */}
          <View className="px-6">
            {/* Location Methods */}
            <Animated.View entering={FadeInUp.delay(300)} className="mb-6">
              <View className="flex-row mb-4">
                <TouchableOpacity
                  onPress={() => {setUseManualEntry(false); setShowMap(false);}}
                  className={`flex-1 p-3 rounded-l-xl border-2 ${
                    !useManualEntry && !showMap ? 'bg-orange-50 border-orange-400' : 'bg-white border-gray-200'
                  }`}
                >
                  <View className="flex-row items-center justify-center">
                    <Ionicons 
                      name="search" 
                      size={20} 
                      color={!useManualEntry && !showMap ? "#f97316" : "#9CA3AF"} 
                    />
                    <Text className={`ml-1 font-medium text-xs ${
                      !useManualEntry && !showMap ? 'text-orange-600' : 'text-gray-600'
                    }`}>
                      Search
                    </Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => {setShowMap(true); setUseManualEntry(false);}}
                  className={`flex-1 p-3 border-2 ${
                    showMap ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200'
                  }`}
                >
                  <View className="flex-row items-center justify-center">
                    <Ionicons 
                      name="map" 
                      size={20} 
                      color={showMap ? "#3b82f6" : "#9CA3AF"} 
                    />
                    <Text className={`ml-1 font-medium text-xs ${
                      showMap ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      Map
                    </Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => {setUseManualEntry(true); setShowMap(false);}}
                  className={`flex-1 p-3 rounded-r-xl border-2 ${
                    useManualEntry ? 'bg-green-50 border-green-400' : 'bg-white border-gray-200'
                  }`}
                >
                  <View className="flex-row items-center justify-center">
                    <Ionicons 
                      name="create" 
                      size={20} 
                      color={useManualEntry ? "#10b981" : "#9CA3AF"} 
                    />
                    <Text className={`ml-1 font-medium text-xs ${
                      useManualEntry ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      Manual
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {showMap ? (
              /* Map Section */
              <Animated.View entering={FadeInUp.delay(400)} className="mb-6">
                <Text className="text-lg font-bold text-gray-900 mb-4">
                  Select Location on Map
                </Text>
                
                <View className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: 300 }}>
                  <WebView
                    ref={webViewRef}
                    source={{ html: getMapHTML() }}
                    style={{ flex: 1 }}
                    onMessage={handleMapMessage}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={false}
                  />
                </View>
                
                <View className="bg-blue-50 p-4 rounded-xl mt-4">
                  <View className="flex-row items-start">
                    <Ionicons name="information-circle" size={20} color="#3b82f6" />
                    <Text className="text-blue-700 text-sm ml-3">
                      • Tap anywhere on the map to place your store marker{"\n"}
                      • Drag the marker to fine-tune the location{"\n"}
                      • Zoom in for better precision
                    </Text>
                  </View>
                </View>
              </Animated.View>
            ) : !useManualEntry ? (
              /* Search Section */
              <Animated.View entering={FadeInUp.delay(400)} className="mb-6">
                <Text className="text-lg font-bold text-gray-900 mb-4">
                  Search for Your Location
                </Text>
                
                <View className="flex-row items-center px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl shadow-sm mb-4">
                  <Ionicons name="search" size={20} color="#9CA3AF" />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={searchLocation}
                    placeholder="Enter address, landmark, or area..."
                    className="flex-1 ml-3 text-base text-gray-900"
                    placeholderTextColor="#9CA3AF"
                    returnKeyType="search"
                  />
                </View>

                <TouchableOpacity
                  onPress={searchLocation}
                  disabled={isLoading || !searchQuery.trim()}
                  className={`p-4 rounded-xl ${
                    searchQuery.trim() && !isLoading ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                >
                  <Text className={`text-center font-bold ${
                    searchQuery.trim() && !isLoading ? 'text-white' : 'text-gray-500'
                  }`}>
                    {isLoading ? "Searching..." : "Search Location"}
                  </Text>
                </TouchableOpacity>

                {hasLocationPermission && (
                  <TouchableOpacity
                    onPress={getCurrentLocation}
                    disabled={isLoading}
                    className="mt-3 p-4 bg-blue-500 rounded-xl"
                  >
                    <View className="flex-row items-center justify-center">
                      <Ionicons name="locate" size={20} color="white" />
                      <Text className="text-white font-bold ml-2">
                        {isLoading ? "Getting Location..." : "Use Current Location"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </Animated.View>
            ) : (
              /* Manual Entry Section */
              <Animated.View entering={FadeInUp.delay(400)} className="mb-6">
                <Text className="text-lg font-bold text-gray-900 mb-4">
                  Enter Address Manually
                </Text>
                
                <View className="px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl shadow-sm mb-4">
                  <TextInput
                    value={manualAddress}
                    onChangeText={setManualAddress}
                    placeholder="Enter your complete store address..."
                    className="text-base text-gray-900"
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                <TouchableOpacity
                  onPress={setManualLocation}
                  disabled={!manualAddress.trim()}
                  className={`p-4 rounded-xl ${
                    manualAddress.trim() ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <Text className={`text-center font-bold ${
                    manualAddress.trim() ? 'text-white' : 'text-gray-500'
                  }`}>
                    Set Address
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Selected Location Display */}
            {selectedLocation && (
              <Animated.View 
                entering={SlideInUp.delay(500)}
                className="bg-white p-6 rounded-2xl shadow-lg mb-6"
              >
                <View className="flex-row items-start mb-4">
                  <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
                    <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900 mb-2">
                      Location Set Successfully!
                    </Text>
                    <Text className="text-gray-600 text-base">
                      {selectedLocation.address || "Custom Address"}
                    </Text>
                    {selectedLocation.city && (
                      <Text className="text-gray-500 text-sm mt-1">
                        {selectedLocation.city}, {selectedLocation.country}
                      </Text>
                    )}
                  </View>
                </View>
                
                {selectedLocation.latitude !== 0 && (
                  <View className="bg-gray-50 p-3 rounded-xl mb-4">
                    <Text className="text-gray-600 text-sm">
                      📍 Coordinates: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  onPress={confirmLocation}
                  className="bg-orange-500 p-4 rounded-xl"
                >
                  <View className="flex-row items-center justify-center">
                    <Text className="text-white text-lg font-bold mr-2">
                      Continue with This Location
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Help Text */}
            <Animated.View entering={FadeInUp.delay(600)} className="mb-8">
              <View className="bg-gray-50 p-4 rounded-xl">
                <View className="flex-row items-start">
                  <Ionicons name="help-circle" size={20} color="#6b7280" />
                  <View className="flex-1 ml-3">
                    <Text className="text-gray-800 font-medium mb-1">
                      How to Set Your Location
                    </Text>
                    <Text className="text-gray-700 text-sm">
                      • <Text className="font-medium">Search:</Text> Find location by typing address{"\n"}
                      • <Text className="font-medium">Map:</Text> Tap on interactive map to select precise location{"\n"}
                      • <Text className="font-medium">Manual:</Text> Type your complete address directly{"\n"}
                      • Use "Current Location" button if you're at your store{"\n"}
                      • You can change this later in store settings
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
}