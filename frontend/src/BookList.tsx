import { useEffect, useState } from 'react';

interface Livro {
  id: number;
  titulo: string;
  autor: string;
  disponivel: boolean;
}

export function BookList() {
  const [livros, setLivros] = useState<Livro[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/livros')
      .then(res => res.json())
      .then(data => setLivros(data))
      .catch(err => console.error('Erro ao buscar livros', err));
  }, []);

  return (
    <div>
      <h2>Lista de Livros</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Disponível</th>
          </tr>
        </thead>
        <tbody>
          {livros.map(livro => (
            <tr key={livro.id}>
              <td>{livro.id}</td>
              <td>{livro.titulo}</td>
              <td>{livro.autor}</td>
              <td>{livro.disponivel ? 'Sim' : 'Não'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
