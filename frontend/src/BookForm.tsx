import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface LivroInput {
  titulo: string;
  autor: string;
}

interface Livro extends LivroInput {
  id: number;
  disponivel: boolean;
}

export function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<LivroInput>({ titulo: '', autor: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetch(`http://localhost:3000/livros`)
        .then(res => res.json())
        .then((data: Livro[]) => {
          const livro = data.find(l => l.id === Number(id));
          if (livro) {
            setForm({ titulo: livro.titulo, autor: livro.autor });
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
        body: JSON.stringify(form),
      });
      navigate('/livros');
    } catch (err) {
      console.error('Erro ao salvar', err);
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
      <button type="submit">Salvar</button>
      <button type="button" onClick={() => navigate('/livros')}>Cancelar</button>
    </form>
  );
}
