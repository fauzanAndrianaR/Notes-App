import './components/noteapp.js';
import './components/header.js';
import './components/loading-indicator.js';
import './styles.css';

document.addEventListener('DOMContentLoaded', () => {
  const loadingIndicator = document.querySelector('loading-indicator');

  setTimeout(() => {
      loadingIndicator.style.display = 'none';
  }, 3000);  
});
