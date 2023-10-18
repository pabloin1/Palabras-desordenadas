import React, { useState, useEffect } from "react";

const palabrasIniciales = ["libro","coche"];
const indiceInicial = 0;

export function App() {
  const initialState = {
    palabrasOriginales: palabrasIniciales,
    palabraOriginal: palabrasIniciales[indiceInicial],
    palabraDesordenada: "",
    valoresEntrada: Array(palabrasIniciales[indiceInicial].length).fill(""),
    indiceEntradaActual: 0,
    vidas: 3,
    mensaje: "",
    indiceActual: indiceInicial,
  };

  const [state, setState] = useState(initialState);

  useEffect(() => {
    // Desordena la palabra al cargar el componente
    let palabraDesordenada = "";
    do {
      palabraDesordenada = state.palabraOriginal
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
    } while (palabraDesordenada === state.palabraOriginal);

    setState({ ...state, palabraDesordenada });
  }, [state.palabraOriginal]);

  const manejarCambioEntrada = (event) => {
    const valorActual = event.target.value;
    const valoresEntradaActualizados = [...state.valoresEntrada];
    valoresEntradaActualizados[state.indiceEntradaActual] = valorActual;

    if (valorActual === state.palabraOriginal[state.indiceEntradaActual]) {
      if (state.indiceEntradaActual === state.palabraOriginal.length - 1) {
        // Adivinó la palabra, elimina la palabra del arreglo
        const nuevasPalabras = state.palabrasOriginales.filter(
          (palabra) => palabra !== state.palabraOriginal
        );

        if (nuevasPalabras.length > 0) {
          const nuevoIndice = Math.floor(Math.random() * nuevasPalabras.length);
          const newState = {
            ...state,
            palabrasOriginales: nuevasPalabras,
            palabraOriginal: nuevasPalabras[nuevoIndice],
            indiceEntradaActual: 0,
            valoresEntrada: Array(nuevasPalabras[nuevoIndice].length).fill(""),
            mensaje: "",
            indiceActual: nuevoIndice,
          };

          setState(newState);
        } else {
          setState({
            ...state,
            mensaje: "Ganaste",
          });
        }
      } else {
        setState({
          ...state,
          indiceEntradaActual: state.indiceEntradaActual + 1,
          mensaje: "Correcto",
          valoresEntrada: valoresEntradaActualizados,
        });
      }
    } else {
      const newVidas = state.vidas - 1;
      let newMensaje = "Nop";

      if (newVidas === 0) {
        newMensaje = "Perdiste";
      }

      setState({ ...state, vidas: newVidas, mensaje: newMensaje });
    }
  };

  const manejarEliminar = () => {
    const valoresEntradaActualizados = [...state.valoresEntrada];
    valoresEntradaActualizados[state.indiceEntradaActual] = ""; // Elimina la letra
    setState({ ...state, valoresEntrada: valoresEntradaActualizados });
  };

  const manejarReiniciar = () => {
    // Selecciona una nueva palabra al hacer clic en el botón "Reiniciar"
    const nuevasPalabras = state.palabrasOriginales.filter(
      (palabra) => palabra !== state.palabraOriginal
    );

    if (nuevasPalabras.length > 0) {
      const nuevoIndice = Math.floor(Math.random() * nuevasPalabras.length);
      setState({
        ...initialState, // Reinicia a los valores iniciales
        palabrasOriginales: nuevasPalabras,
        palabraOriginal: nuevasPalabras[nuevoIndice],
        indiceActual: nuevoIndice,
      });
    } else {
      setState({
        ...initialState, // Reinicia a los valores iniciales
        mensaje: "¡Felicidades, has adivinado todas las palabras!",
      });
    }
  };

  const cuadrosEntrada = state.valoresEntrada.map((valor, indice) => (
    <div
      key={indice}
      className="flex mr-9 flex-col-reverse items-center justify-center "
    >
      <input
        type="text"
        value={valor}
        onChange={manejarCambioEntrada}
        disabled={indice !== state.indiceEntradaActual || state.vidas === 0}
        className="w-32 text-center border-2 border-gray-400 rounded-md"
      />
    </div>
  ));

  return (
    <div className="flex flex-col items-center h-screen text-xl mt-60">
      <div className="flex flex-row ml-80 w-full mb-5">
        <div className="flex flex-col items-center bg-indigo-600 text-white rounded-md">
          <p className="p-2 font-bold rounded-md mr-4">
            Palabra: {state.palabraDesordenada}
          </p>
          <p className="p-2 font-bold rounded-md">Vidas: {state.vidas}</p>
        </div>
      </div>

      <p className="mt-5 text-2xl font-bold">{state.mensaje}</p>

      <div className="flex flex-row items-center justify-center mt-5 p-6">
        {cuadrosEntrada}
      </div>

      <div className="flex flex-row justify-center mt-5">
        <button
          onClick={manejarReiniciar}
          className="p-2 border mr-50 border-indigo-600 rounded-md transition duration-300 ease-in-out hover-bg-indigo-600 hover-text-white"
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}
