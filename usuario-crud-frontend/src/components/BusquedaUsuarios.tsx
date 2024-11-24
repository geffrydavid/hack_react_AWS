import React from 'react';

interface Props {
  busqueda: string;
  setBusqueda: (busqueda: string) => void;
  onBuscar: (query: string) => void;
}

const BusquedaUsuarios: React.FC<Props> = ({ busqueda, setBusqueda, onBuscar }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBuscar(busqueda);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar usuario..."
        className="p-2 border rounded w-full"
      />
      <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded">
        Buscar
      </button>
    </form>
  );
};

export default BusquedaUsuarios;