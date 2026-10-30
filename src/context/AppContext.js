import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { DEFAULT_CITY_ID, cityById, routeDetails, shortestPath } from '../data/cities';

const STORAGE_KEY = '@tracking-demo/state';
const DEFAULT_DATE = '2026-10-30T08:00:00.000Z';
const TICK_MS = 5000;
const SIMULATED_HOURS_PER_TICK = 2;

const initialState = {
  products: [],
  orders: [],
  selectedOrderId: null,
  departure: { street: 'Av. Reforma 100', cityId: DEFAULT_CITY_ID, postalCode: '06600', isDefault: true },
  simulatedNow: DEFAULT_DATE,
  simulationRunning: true,
  hydrated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'hydrate':
      return { ...initialState, ...action.value, hydrated: true };
    case 'addProduct':
      return { ...state, products: [action.product, ...state.products] };
    case 'saveDeparture':
      return { ...state, departure: { ...action.departure, isDefault: false } };
    case 'addOrder':
      return { ...state, orders: [action.order, ...state.orders], selectedOrderId: action.order.id };
    case 'selectOrder':
      return { ...state, selectedOrderId: action.id };
    case 'toggleSimulation':
      return { ...state, simulationRunning: !state.simulationRunning };
    case 'tick': {
      const nextNow = new Date(new Date(state.simulatedNow).getTime() + action.hours * 3600000);
      const orders = state.orders.map((order) => {
        if (order.status === 'delivered') return order;
        const progress = Math.min(action.hours + order.elapsedHours, order.totalHours);
        const completedNodes = order.route.slice(0, Math.max(1, order.segments.filter((segment) => segment.startHour + segment.hours <= progress).length + 1));
        const delivered = progress >= order.totalHours;
        return {
          ...order,
          elapsedHours: progress,
          status: delivered ? 'delivered' : progress >= order.totalHours * 0.7 ? 'near_destination' : 'in_transit',
          currentCityId: delivered ? order.destinationCityId : completedNodes[completedNodes.length - 1],
        };
      });
      return { ...state, simulatedNow: nextNow.toISOString(), orders };
    }
    case 'resetDate':
      return { ...state, simulatedNow: DEFAULT_DATE };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value) dispatch({ type: 'hydrate', value: JSON.parse(value) });
      else dispatch({ type: 'hydrate', value: {} });
    }).catch(() => dispatch({ type: 'hydrate', value: {} }));
  }, []);

  useEffect(() => {
    if (state.hydrated) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!state.hydrated || !state.simulationRunning) return undefined;
    const timer = setInterval(() => {
      if (stateRef.current.orders.some((order) => order.status !== 'delivered')) {
        dispatch({ type: 'tick', hours: SIMULATED_HOURS_PER_TICK });
      }
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [state.hydrated, state.simulationRunning]);

  const actions = useMemo(() => ({
    addProduct: (product) => dispatch({ type: 'addProduct', product }),
    saveDeparture: (departure) => dispatch({ type: 'saveDeparture', departure }),
    selectOrder: (id) => dispatch({ type: 'selectOrder', id }),
    toggleSimulation: () => dispatch({ type: 'toggleSimulation' }),
    resetDate: () => dispatch({ type: 'resetDate' }),
    createOrder: ({ product, recipient, address, destinationCityId }) => {
      const path = shortestPath(stateRef.current.departure.cityId, destinationCityId);
      const segments = routeDetails(path).map((segment, index) => ({
        ...segment,
        startHour: index === 0 ? 2 : routeDetails(path).slice(0, index).reduce((sum, item) => sum + item.hours, 2),
      }));
      const totalHours = segments.reduce((sum, segment) => sum + segment.hours, 2);
      const order = {
        id: `order-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        recipient,
        address,
        destinationCityId,
        originCityId: stateRef.current.departure.cityId,
        route: path,
        segments,
        totalHours,
        elapsedHours: 0,
        currentCityId: path[0],
        status: 'preparing',
        createdAt: stateRef.current.simulatedNow,
      };
      dispatch({ type: 'addOrder', order });
    },
  }), []);

  const value = { ...state, ...actions, constants: { DEFAULT_DATE, TICK_MS, SIMULATED_HOURS_PER_TICK } };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

export function formatDate(value) {
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export function copyImageToApp(uri) {
  const target = `${FileSystem.documentDirectory}product-${Date.now()}.jpg`;
  return FileSystem.copyAsync({ from: uri, to: target }).then(() => target);
}

export { cityById };
