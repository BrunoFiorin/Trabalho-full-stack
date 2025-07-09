import './App.css';
import { BrowserRouter, Navigate, Route, Routes, Link } from 'react-router-dom';
import { BookList } from './BookList';
import { BookForm } from './BookForm';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <h1>Biblioteca</h1>
        <nav>
          <Link to="/livros">Livros</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to="/livros" />} />
          <Route path="/livros" element={<BookList />} />
          <Route path="/livros/novo" element={<BookForm />} />
          <Route path="/livros/:id/editar" element={<BookForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
