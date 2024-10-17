import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { encode } from 'base-64';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';

const EShopScreen = () => {
  const [sortBy, setSortBy] = useState("menu_order");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]); // State variable for cart items

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const consumerKey = 'ck_f78ca9752e851cb63c73f50b397c3087643a3776';
    const consumerSecret = 'cs_ac8988fb2a41fdad4f906e5eaff2ec83324369e0';
    const base64Credentials = encode(`${consumerKey}:${consumerSecret}`);
  
    try {
      const response = await fetch('https://e8gym.com/wp-json/wc/v3/products', {
        headers: {
          Authorization: `Basic ${base64Credentials}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
  
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  };

  const handleProductPress = (product) => {
    console.log(`Product ${product.name} pressed`);
  };

  const handleAddToCart = (item) => {
    // Add item to cart
    setCartItems([...cartItems, item]);
    // Display a confirmation message
    Alert.alert('Success', `${item.name} added to cart.`);
  };

  const handleProceedToCheckout = () => {
    // Navigate to the checkout screen with cart items passed as navigation parameter
    navigation.navigate('CheckoutScreen', { cartItems });
  };

  const sortedProducts = () => {
    switch (sortBy) {
      case 'popularity':
        return [...products].sort((a, b) => b.popularity - a.popularity);
      case 'rating':
        return [...products].sort((a, b) => b.rating - a.rating);
      case 'date':
        return [...products].sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'price':
        return [...products].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'price-desc':
        return [...products].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      default:
        return products;
    }
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productItemContainer} onPress={() => handleProductPress(item)}>
      <Image source={{ uri: item.images[0].src }} style={styles.productImage} resizeMode="cover" />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>Price: <Text style={styles.orangePrice}>{item.price}</Text></Text>
      </View>
      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={() => handleAddToCart(item)}>
        <View style={styles.buttonContent}>
          <Image source={require('../../assets/addtocart.png')} style={styles.cartIcon} />
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.headerContainer}>
        <Text style={styles.shopTitle}>E-Shop</Text>
        <TouchableOpacity
          style={styles.proceedToCheckoutButton}
          onPress={handleProceedToCheckout}>
          <Text style={styles.proceedToCheckoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.shopPageTop}>
        <View style={styles.resultCountContainer}>
          <Text>Showing all {products.length} results</Text>
        </View>
        <View style={styles.formContainer}>
          <Picker
            style={styles.picker}
            selectedValue={sortBy}
            onValueChange={(itemValue, itemIndex) => setSortBy(itemValue)}
          >
            <Picker.Item label="Default sorting" value="menu_order" />
            <Picker.Item label="Sort by popularity" value="popularity" />
            <Picker.Item label="Sort by average rating" value="rating" />
            <Picker.Item label="Sort by latest" value="date" />
            <Picker.Item label="Sort by price: low to high" value="price" />
            <Picker.Item label="Sort by price: high to low" value="price-desc" />
          </Picker>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : products.length > 0 ? (
        <FlatList
          data={sortedProducts()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductItem}
          contentContainerStyle={styles.productList}
        />
      ) : (
        <Text>No products found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  shopPageTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  resultCountContainer: {
    borderRightWidth: 1,
    borderColor: 'grey',
    paddingRight: 20,
  },
  formContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  picker: {
    marginLeft: 10,
    width: 200,
  },
  shopTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  productList: {
    // Remove justifyContent: 'space-between'
  },
  productItemContainer: {
    width: 350,
    height: 300,
    margin: 10,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  productImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  productPrice: {
    fontSize: 18,
    color: '#888',
    marginTop: 5,
  },
  orangePrice: {
    color: 'orange',
    fontWeight: 'bold',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addToCartButton: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  addToCartButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 5,
  },
  cartIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
    marginRight: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  proceedToCheckoutButton: {
    backgroundColor: 'orange',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "flex-end",
  },
  proceedToCheckoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EShopScreen;
