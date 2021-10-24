import { useEffect } from 'react';
import './App.css';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { fetchFormOptions } from './stores/FormOptionsSlice';
import HomePage from './views/HomePage/HomePage';

function App() {

  const dispatch = useAppDispatch();
  const formOptionsStatus = useAppSelector(state => state.formOptions.status);

  useEffect(() => {
    if (formOptionsStatus === "idle") {
      dispatch(fetchFormOptions());
    }
  }, [formOptionsStatus, dispatch]);

  return (
    <HomePage />
  );
}

export default App;
