import React, { useState, useEffect } from 'react';
import { Usuario } from '../types';

interface Props {
  onSubmit: (usuario: Omit<Usuario, 'id'> & { id?: number }) => void;
  usuarioInicial?: Usuario | null;
}

const FormularioUsuario: React.FC<Props> = ({ onSubmit, usuarioInicial }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [edad, setEdad] = useState('');

  useEffect(() => {
    if (usuarioInicial) {
      setNombre(usuarioInicial.nombre);
      setCorreo(usuarioInicial.correo);
      setEdad(usuarioInicial.edad.toString());
    }
  }, [usuarioInicial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const usuarioSubmit: Omit<Usuario, 'id'> & { id?: number } = {
      ...(usuarioInicial?.id ? { id: usuarioInicial.id } : {}),
      nombre,
      correo,
      edad: parseInt(edad, 10)
    };
    onSubmit(usuarioSubmit);
    if (!usuarioInicial) {
      setNombre('');
      setCorreo('');
      setEdad('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre"
        required
        className="mr-2 p-2 border rounded"
      />
      <input
        type="email"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        placeholder="Correo"
        required
        className="mr-2 p-2 border rounded"
      />
      <input
        type="number"
        value={edad}
        onChange={(e) => setEdad(e.target.value)}
        placeholder="Edad"
        required
        className="mr-2 p-2 border rounded"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        {usuarioInicial ? 'Actualizar' : 'Agregar'} Usuario
      </button>
    </form>
  );
};

export default FormularioUsuario;