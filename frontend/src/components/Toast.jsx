import React, { useEffect } from 'react';
import '../styles/styles.css' // Archivo de estilos para el Toast

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // El Toast se cierra automáticamente después de 3 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      {message}
    </div>
  );
};

export default Toast;