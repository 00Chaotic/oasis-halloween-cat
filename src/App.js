import { useEffect } from 'react';
import './App.css';
import Sketch from './Sketch';

function App() {
  useEffect(() => {
    // Return if device is not touchscreen
    if (!('ontouchstart' in window.document || navigator.maxTouchPoints > 0)) { return; }

    const toast = document.getElementById('toast');

    if (toast) {
      showToast(toast);
    }
  }, []);

  const showToast = (toast) => {
    toast.classList.remove('hidden');
    toast.classList.add('show');

    // Automatically hide the toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.classList.add('hidden'), 500); // Hide AFTER fade-out
    }, 3000);
  };

  return (
    <div className='App'>
      <div id='toast' className='toast hidden'>Tap once to enable audio</div>
      <Sketch />
    </div>
  );
}

export default App;
