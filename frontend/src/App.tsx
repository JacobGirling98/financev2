import { useEffect } from 'react';
import './App.css';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { fetchCategories } from './stores/CategoriesSlice';
import HomePage from './views/HomePage/HomePage';

function App() {

  const dispatch = useAppDispatch();
  const categoriesStatus = useAppSelector(state => state.categories.status);

  useEffect(() => {
    if (categoriesStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [categoriesStatus, dispatch]);

  return (
    <HomePage />
  );
}

export default App;
