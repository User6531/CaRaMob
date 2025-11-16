import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  imageContainer: {
    height: 250,
    backgroundColor: '#161B22', // Using theme color directly
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  carImage: {
    width: width,
    height: 250,
    resizeMode: 'cover',
  },
  placeholderImage: {
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderLabel: {
    fontSize: 16,
    color: '#8B949E', // Using theme color directly
  },
  infoContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  carTitle: {
    marginBottom: 8,
  },
  carYear: {
    // Additional styles if needed
  },
  detailsSection: {
    marginBottom: 24,
  },
  metaSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#21262D', // Using theme color directly
  },
  detailLabel: {
    flex: 1,
  },
  detailValue: {
    flex: 2,
    textAlign: 'right',
  },
  licensePlate: {
    color: '#58A6FF', // Using theme color directly
    fontWeight: '600',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
});

