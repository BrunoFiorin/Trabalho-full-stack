import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface CategoriaInput {
  nome: string;
}

export function CategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<CategoriaInput>({ nome: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetch('http://localhost:3000/categorias')
        .then(res => res.json())
        .then((data) => {
          const cat = data.find((c: any) => c.id === Number(id));
          if (cat) {
            setForm({ nome: cat.nome });
          }
        });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) {
      setError('Nome é obrigatório');
      return;
    }
    try {
      await fetch(`http://localhost:3000/categorias${isEdit ? '/' + id : ''}` , {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      navigate('/categorias');
    } catch (err) {
      setError('Erro ao salvar');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="category-form">
      <h2>{isEdit ? 'Editar Categoria' : 'Nova Categoria'}</h2>
      {error && <p className="error">{error}</p>}
      <div>
        <label>Nome:</label>
        <input
          value={form.nome}
          onChange={(e) => setForm({ nome: e.target.value })}
          required
        />
      </div>
      <button type="submit">Salvar</button>
      <button type="button" onClick={() => navigate('/categorias')}>Cancelar</button>
    </form>
  );
}
