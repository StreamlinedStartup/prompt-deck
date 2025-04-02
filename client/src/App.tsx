import React from 'react';
import Layout from './components/Layout';
import { Toaster } from 'react-hot-toast'; // Import Toaster

function App() {
  return (
    <>
      <Layout />
      <Toaster position="bottom-right" reverseOrder={false} /> {/* Add Toaster for notifications */}
    </>
  );
}

export default App;