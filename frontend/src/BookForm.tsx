import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface LivroInput {
  titulo: string;
  autor: string;
}

interface Categoria {
  id: number;
  nome: string;
}

export function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<LivroInput>({ titulo: '', autor: '' });
  const [error, setError] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selecionadas, setSelecionadas] = useState<number[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/categorias')
      .then(res => res.json())
      .then(setCategorias);

    if (isEdit) {
      fetch('http://localhost:3000/livros')
        .then(res => res.json())
        .then((data) => {
          const livro = data.find((l: any) => l.id === Number(id));
          if (livro) {
            setForm({ titulo: livro.titulo, autor: livro.autor });
            setSelecionadas(livro.categorias.map((c: any) => c.id));
          }
        });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.autor.trim()) {
      setError('Todos os campos são obrigatórios');
      return;
    }
    try {
      await fetch(`http://localhost:3000/livros${isEdit ? '/' + id : ''}` , {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, categorias: selecionadas }),
      });
      navigate('/livros');
    } catch (err) {
      setError('Erro ao salvar');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <h2>{isEdit ? 'Editar Livro' : 'Novo Livro'}</h2>
      {error && <p className="error">{error}</p>}
      <div>
        <label>Título:</label>
        <input
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Autor:</label>
        <input
          value={form.autor}
          onChange={(e) => setForm({ ...form, autor: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Categorias:</label>
        <select
          multiple
          value={selecionadas.map(String)}
          onChange={(e) => {
            const options = Array.from(e.target.selectedOptions).map(o => Number(o.value));
            setSelecionadas(options);
          }}
        >
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nome}</option>
          ))}
        </select>
      </div>
      <button type="submit">Salvar</button>
      <button type="button" onClick={() => navigate('/livros')}>Cancelar</button>
    </form>
  );
}
