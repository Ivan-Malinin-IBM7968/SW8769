import React, { createContext, useReducer } from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import remove from 'lodash/remove';

import demoData from '../assets/demo/data.json';
import { move } from '../utils';

const initialState = {
  data: {
    profile: {
      heading: 'Профиль',
      photo: '',
      firstName: '',
      lastName: '',
      subtitle: '',
      address: {
        line1: '',
        line2: '',
        line3: '',
      },
      phone: '',
      website: '',
      email: '',
    },
    objective: {
      enable: true,
      heading: 'Приемущества',
      body: '',
    },
    work: {
      enable: true,
      heading: 'Опыт работы',
      items: [],
    },
    education: {
      enable: true,
      heading: 'Образование',
      items: [],
    },
    awards: {
      enable: true,
      heading: 'Награды и достижения',
      items: [],
    },
    certifications: {
      enable: true,
      heading: 'Сертификаты',
      items: [],
    },
    skills: {
      enable: true,
      heading: 'Опыт',
      items: [],
    },
    hobbies: {
      enable: true,
      heading: 'Хобби',
      items: [],
    },
    languages: {
      enable: true,
      heading: 'Знание языков',
      items: [],
    },
    references: {
      enable: true,
      heading: 'Предпочтение к рабочему месту',
      items: [],
    },
    extras: {
      enable: true,
      heading: 'Описание желаемой рабочей станции ПК',
      items: [],
    },
  },
  theme: {
    layout: 'Onyx',
    font: {
      family: '',
    },
    colors: {
      background: '#ffffff',
      primary: '#212121',
      accent: '#f44336',
    },
  },
  settings: {
    language: 'ru',
  },
};

const reducer = (state, { type, payload }) => {
  let items;

  switch (type) {
    case 'migrate_section':
      return set({ ...state }, `data.${payload.key}`, payload.value);
    case 'add_item':
      items = get({ ...state }, `data.${payload.key}.items`, []);
      items.push(payload.value);
      return set({ ...state }, `data.${payload.key}.items`, items);
    case 'delete_item':
      items = get({ ...state }, `data.${payload.key}.items`, []);
      remove(items, x => x === payload.value);
      return set({ ...state }, `data.${payload.key}.items`, items);
    case 'move_item_up':
      items = get({ ...state }, `data.${payload.key}.items`, []);
      move(items, payload.value, -1);
      return set({ ...state }, `data.${payload.key}.items`, items);
    case 'move_item_down':
      items = get({ ...state }, `data.${payload.key}.items`, []);
      move(items, payload.value, 1);
      return set({ ...state }, `data.${payload.key}.items`, items);
    case 'on_input':
      return set({ ...state }, payload.key, payload.value);
    case 'save_data':
      localStorage.setItem('state', JSON.stringify(state));
      return state;
    case 'import_data':
      if (payload === null) return initialState;

      for (const section of Object.keys(initialState.data)) {
        if (!(section in payload.data)) {
          payload.data[section] = initialState.data[section];
        }
      }

      return {
        ...state,
        ...payload,
      };
    case 'load_demo_data':
      return {
        ...state,
        ...demoData,
      };
    case 'reset':
      return initialState;
    default:
      return state;
  }
};

const AppContext = createContext(initialState);
const { Provider } = AppContext;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export const AppProvider = StateProvider;
export const AppConsumer = AppContext.Consumer;

export default AppContext;
