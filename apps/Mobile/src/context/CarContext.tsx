import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: string;
  color: string;
  licensePlate: string;
  vin: string;
  carImage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CarContextType {
  cars: Car[];
  addCar: (car: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCar: (id: string, car: Partial<Omit<Car, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteCar: (id: string) => void;
  getCarById: (id: string) => Car | undefined;
}

const CarContext = createContext<CarContextType | undefined>(undefined);

export const useCar = () => {
  const context = useContext(CarContext);
  if (context === undefined) {
    throw new Error('useCar must be used within a CarProvider');
  }
  return context;
};

interface CarProviderProps {
  children: ReactNode;
}

export const CarProvider: React.FC<CarProviderProps> = ({ children }) => {
  const [cars, setCars] = useState<Car[]>([]);

  const addCar = (carData: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCar: Car = {
      ...carData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCars(prevCars => [...prevCars, newCar]);
  };

  const updateCar = (id: string, carData: Partial<Omit<Car, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setCars(prevCars =>
      prevCars.map(car =>
        car.id === id
          ? { ...car, ...carData, updatedAt: new Date() }
          : car
      )
    );
  };

  const deleteCar = (id: string) => {
    setCars(prevCars => prevCars.filter(car => car.id !== id));
  };

  const getCarById = (id: string) => {
    return cars.find(car => car.id === id);
  };

  const value: CarContextType = {
    cars,
    addCar,
    updateCar,
    deleteCar,
    getCarById,
  };

  return (
    <CarContext.Provider value={value}>
      {children}
    </CarContext.Provider>
  );
};
