/* eslint-disable import/extensions */
import Common from './common.js';

const socket = io();

function generateInitialMessage(host, pName, id) {
  const message = {
    messageType: 'initial',
    name: pName,
    host,
    gameId: id,
  };
  return JSON.stringify(message);
}

function validateUserInput(data, host = false) {
  const errors = [];
  let result = true;

  if (data[0].trim().length === 0) {
    errors.push('Debe introducir un nombre de jugador.');
  }

  if (host === false && data[1].trim().length === 0) {
    errors.push('Debe introducir un ID de sesión para unirse.');
  }

  if (errors.length > 0) {
    result = false;
    Common.showInputsError(errors, 'No se puede ingresar a la partida');
  }

  return result;
}

function askUserGuestGameInfo() {
  Swal.mixin({
    input: 'text',
    confirmButtonText: 'Siguiente &rarr;',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: Common.GetBaseColorOne(),
    cancelButtonColor: Common.GetBaseColorTwo(),
    progressSteps: ['1', '2'],
  }).queue([
    {
      title: 'Nombre',
      text: 'Introduzca su nombre de jugador',
    },
    {
      title: 'Id Sesión',
      text: 'Introduzca el id de la sesión',
    },
  ]).then((result) => {
    if (result.value) {
      if (validateUserInput(result.value)) {
        localStorage.setItem('playerName', result.value[0]);
        socket.emit('fromClient', generateInitialMessage(false, result.value[0], result.value[1]));
      }
    }
  });
}

function askUserHostGuestGameInfo() {
  Swal.mixin({
    input: 'text',
    confirmButtonText: 'Iniciar',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: Common.GetBaseColorOne(),
    cancelButtonColor: Common.GetBaseColorTwo(),
    progressSteps: ['1'],
  }).queue([
    {
      title: 'Nombre',
      text: 'Introduzca su nombre de jugador',
    },
  ]).then((result) => {
    if (result.value) {
      if (validateUserInput(result.value, true)) {
        localStorage.setItem('playerName', result.value[0]);
        socket.emit('fromClient', generateInitialMessage(true, result.value[0], ''));
      }
    }
  });
}

function loadWaitingRoom(response) {
  localStorage.setItem('state', 'toWaitingRoom');
  localStorage.setItem('playerId', response.playerId);
  localStorage.setItem('gameId', response.gameId);

  window.open(response.redirect, '_self');
}

function showErrorMessageLocal(response) {
  Common.showCommonError('Error al iniciar la partida', response.errorMsg);
}

function addEvents() {
  // Agregar evento al botón de crear sesión.
  const create = document.getElementById('create');
  create.addEventListener('click', askUserHostGuestGameInfo);

  // Agregar evento al botón de unirse a sesión.
  const join = document.getElementById('join');
  join.addEventListener('click', askUserGuestGameInfo);

  // Agregar evento al botón de ayuda
  const help = document.getElementById('help-img-button');
  help.addEventListener('click', Common.showHelp);
}

function messagesListener() {
  socket.on('fromServer', (msg) => {
    console.log(msg);
    const response = JSON.parse(msg);
    switch (response.messageType) {
      case 'initialResponse':
        loadWaitingRoom(response);
        break;
      case 'error':
        showErrorMessageLocal(response);
        break;
      default:
        break;
    }
  });
}

/*
Función inicial.
*/
function init() {
  localStorage.setItem('state', 'initial');
  messagesListener();
  addEvents();
}

// Espera a que se cargue la pagina para iniciar la funcion de init
window.addEventListener('load', init);
