import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Categoria {
  id: number;
  nome: string;
}

export function CategoryList() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const carregar = () => {
    fetch('http://localhost:3000/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error('Erro ao buscar categorias', err));
  };

  useEffect(carregar, []);

  const remover = async (id: number) => {
    if (!confirm('Deseja excluir esta categoria?')) return;
    await fetch(`http://localhost:3000/categorias/${id}`, { method: 'DELETE' });
    carregar();
  };

  return (
    <div>
      <h2>Categorias</h2>
      <Link to="/categorias/nova">Nova Categoria</Link>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(cat => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.nome}</td>
              <td>
                <Link to={`/categorias/${cat.id}/editar`}>Editar</Link>{' '}
                <button onClick={() => remover(cat.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
