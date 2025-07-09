import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Livro {
  id: number;
  titulo: string;
  autor: string;
  disponivel: boolean;
}

export function BookList() {
  const [livros, setLivros] = useState<Livro[]>([]);

  const carregar = () => {
    fetch('http://localhost:3000/livros')
      .then(res => res.json())
      .then(data => setLivros(data))
      .catch(err => console.error('Erro ao buscar livros', err));
  };

  useEffect(carregar, []);

  const remover = async (id: number) => {
    if (!confirm('Deseja excluir este livro?')) return;
    await fetch(`http://localhost:3000/livros/${id}`, { method: 'DELETE' });
    carregar();
  };

  return (
    <div>
      <h2>Lista de Livros</h2>
      <Link to="/livros/novo">Novo Livro</Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Disponível</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {livros.map(livro => (
            <tr key={livro.id}>
              <td>{livro.id}</td>
              <td>{livro.titulo}</td>
              <td>{livro.autor}</td>
              <td>{livro.disponivel ? 'Sim' : 'Não'}</td>
              <td>
                <Link to={`/livros/${livro.id}/editar`}>Editar</Link>
                {' '}<button onClick={() => remover(livro.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
