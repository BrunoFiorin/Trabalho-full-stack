import type { FormEvent } from 'react';
import { useState } from "react";

interface LivroInput {
  titulo: string;
  autor: string;
}

interface Props {
  onAdd: () => void;
}

export function AddBookForm({ onAdd }: Props) {
  const [form, setForm] = useState<LivroInput>({ titulo: '', autor: '' });
  const [status, setStatus] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('enviando');
    try {
      await fetch('http://localhost:3000/livros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus('salvo');
      setForm({ titulo: '', autor: '' });
      onAdd();
    } catch (err) {
      console.error('Erro ao adicionar livro', err);
      setStatus('erro');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Adicionar Livro</h2>
      <div>
        <label>Título: </label>
        <input
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
        />
      </div>
      <div>
        <label>Autor: </label>
        <input
          value={form.autor}
          onChange={(e) => setForm({ ...form, autor: e.target.value })}
        />
      </div>
      <button type="submit">Salvar</button>
      {status && <span>{status}</span>}
    </form>
  );
}
