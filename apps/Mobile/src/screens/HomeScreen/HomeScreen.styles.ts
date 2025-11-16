import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = width - 48; // Full width minus padding

export const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: { 
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  carsSection: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  carsList: {
    paddingBottom: 20,
  },
  carCardWrapper: {
    marginBottom: 16,
  },
  carCard: {
    width: cardWidth,
    backgroundColor: '#161B22', // Using theme color directly
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  carCardContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  carImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#21262D', // Using theme color directly
    justifyContent: 'center',
    alignItems: 'center',
  },
  carImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
  },
  carInfo: {
    flex: 1,
  },
  carBrand: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F0F6FC', // Using theme color directly
    marginBottom: 4,
  },
  carModel: {
    fontSize: 16,
    color: '#8B949E', // Using theme color directly
    marginBottom: 4,
  },
  carYear: {
    fontSize: 14,
    color: '#8B949E', // Using theme color directly
    marginBottom: 4,
  },
  carPlate: {
    fontSize: 14,
    color: '#58A6FF', // Using theme color directly
    fontWeight: '600',
  },
  editButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#58A6FF', // Using theme color directly
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  editButtonText: {
    fontSize: 14,
    color: '#fff',
  },
  emptyCard: {
    width: cardWidth,
    backgroundColor: '#161B22', // Using theme color directly
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#30363D', // Using theme color directly
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyCardContent: {
    alignItems: 'center',
  },
  plusIcon: {
    fontSize: 48,
    color: '#58A6FF', // Using theme color directly
    marginBottom: 12,
  },
  emptyCardText: {
    fontSize: 16,
    color: '#8B949E', // Using theme color directly
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F0F6FC', // Using theme color directly
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#8B949E', // Using theme color directly
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
    alignItems: 'center',
  },
});

