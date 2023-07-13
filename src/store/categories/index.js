import { createSlice } from '@reduxjs/toolkit';

export const retrieveCategories = () => async () => {
  const serverResponse = await fetch('http://localhost:3001/api/categories');
  const categoriesData = await serverResponse.json();
  console.log('store, categories, categoriesData', categoriesData);

  return categoriesData;
};

const categoriesSlice = createSlice({
  name: 'categoryList',
  initialState: {
    allCategories: [],
    selectedCategory: {},
  },
  reducers: {
    changeActiveCategory(state, action) {
      state.selectedCategory = state.allCategories.find(
        (category) => category.name === action.payload.toLowerCase()
      );
    },
    resetActiveCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    loadCategories(state, action) {
      state.allCategories = action.payload;
    },
  },
});

export default categoriesSlice;
