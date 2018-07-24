import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Canvas from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Canvas />, document.getElementById('root'));
registerServiceWorker();
