import React from 'react';
import { Usuario } from '../types';

interface Props {
  usuarios: Usuario[];
  onEliminar: (id: number) => void;
  onEditar: (usuario: Usuario) => void;
}

const ListaUsuarios: React.FC<Props> = ({ usuarios, onEliminar, onEditar }) => {
  const truncarNombre = (nombre: string) => {
    return nombre.length > 10 ? `${nombre.substring(0, 10)}...` : nombre;
  };

  return (
    <ul>
      {usuarios.map(usuario => (
        <li key={usuario.id} className="mb-2 p-2 border rounded">
          <span>{truncarNombre(usuario.nombre)}</span> - 
          <span>{usuario.correo}</span> - 
          <span>{usuario.edad} años</span>
          <button onClick={() => onEditar(usuario)} className="ml-2 p-1 bg-yellow-500 text-white rounded">
            Editar
          </button>
          <button onClick={() => onEliminar(usuario.id)} className="ml-2 p-1 bg-red-500 text-white rounded">
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ListaUsuarios;