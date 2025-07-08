import { useState } from 'react';
import './App.css';
import { BookList } from './BookList';
import { AddBookForm } from './AddBookForm';

function App() {
  const [reload, setReload] = useState(false);

  const triggerReload = () => setReload(!reload);

  return (
    <div className="App">
      <h1>Biblioteca</h1>
      <AddBookForm onAdd={triggerReload} />
      {/* key ensures component remount on reload toggle */}
      <BookList key={String(reload)} />
    </div>
  );
}

export default App;
