import React, { useState } from "react";

const Toast = ({ type, message, onClose }) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose(); // Llamamos a la función para eliminar el toast
    }, 300); // Tiempo de la animación antes de eliminarlo del DOM
  };

  return (
    visible && (
      <div className={`toast ${type}`}>
        <span>{message}</span>
        <button className="btn btn-clear float-right" onClick={handleClose}>
        
        </button>
      </div>
    )
  );
};

export default Toast;
