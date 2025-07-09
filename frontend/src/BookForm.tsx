import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface LivroInput {
  titulo: string;
  autor: string;
}

export function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<LivroInput>({ titulo: '', autor: '' });
  const [error, setError] = useState('');

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
