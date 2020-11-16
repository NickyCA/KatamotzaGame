/* eslint-disable import/extensions */
import Common from './common.js';
import WaitingCommon from './waitingCommon.js';

const socket = io();

/**
 * Revisa que las configuraciones de la partida seleccionadas sean validos
 * Genera mensajes especificos para cada error
 * @param {int} objectsQuantity
 * @param {int} gameType
 * @param {int} gamePointsRounds
 * @param {int} playersCardsQuantity
 */
function gameOptionsValidate(objectsQuantity, gameType,
  gamePointsRounds, playersCardsQuantity) {
  const errors = [];
  if (Number.isNaN(objectsQuantity)) {
    errors.push('El valor para la cantidad de objetos en el tablero no es válido.');
  }

  if (Number.isNaN(gameType)) {
    errors.push('El valor para el tipo de juego no es válido.');
  }

  if (Number.isNaN(gamePointsRounds)) {
    errors.push('El valor para la cantidad de puntos o rondas no es válido.');
  }

  if (gamePointsRounds <= 0) {
    errors.push('El valor para la cantidad de puntos o rondas no puede ser menor o igual a cero.');
  }

  if (Number.isNaN(playersCardsQuantity)) {
    errors.push('El valor para la cantidad de cartas por jugador no es válido.');
  }

  if (objectsQuantity > 375) {
    errors.push('La cantidad de objetos en el tablero no puede ser mayor a 375.');
  }

  const playersInGame = localStorage.getItem('playersInGame');
  const neededCardsTotal = playersInGame * playersCardsQuantity;
  if (neededCardsTotal > objectsQuantity) {
    errors.push('No hay suficiente cartas para repartir por jugador.');
  }

  return errors;
}

/**
 * Envia el mensaje de gameStart al servidor
 * @param {Array} gameOptions
 */
function generateStartGameMessage(gameOptions) {
  const message = {
    messageType: 'gameStart',
    gameId: localStorage.getItem('gameId'),
    gameOptions,
  };
  return JSON.stringify(message);
}

/**
 * Obtiene todos los inputs que selecciono el usuario para la configuracion de la partida
 * los valida
 * y envia un mensaje al servidor
 */
function startGame() {
  const objectsQuantity = parseInt(document.getElementById('input_objects_quantity').value, 10);
  const gameType = parseInt(document.getElementById('input_game_type').value, 10);
  const gamePointsRounds = parseInt(document.getElementById('input_round_points_quantity').value, 10);
  const playersCardsQuantity = parseInt(document.getElementById('input_playercards_quantity').value, 10);
  const stopButton = document.getElementById('chk_winner_option').checked;
  const trapCard = parseInt(document.getElementById('input_trapcard_time').value, 10);

  const errors = gameOptionsValidate(objectsQuantity, gameType,
    gamePointsRounds, playersCardsQuantity);

  if (errors.length === 0) {
    const gameOptions = {
      objectsQuantity,
      gameType,
      gamePointsRounds,
      playersCardsQuantity,
      stopButton,
      trapCard,
    };

    socket.emit('fromClient', generateStartGameMessage(gameOptions));
  } else {
    Common.showInputsError(errors, 'No se puede iniciar la partida');
  }
}

/**
 * En el panel de configuraciones, dependiendo de si se elige por rondas o por puntos
 * se cambia la etiqueta donde esta el espacio para que el usuario diga el numero de rondas/puntos
 * de preferencia
 */
function changeGameTypeLabel() {
  const gameTypeValue = parseInt(document.getElementById('input_game_type').value, 10);
  const labelText = document.getElementById('round_points_quantity');
  if (gameTypeValue === 1) {
    labelText.innerText = 'Cantidad de puntos:';
  } else if (gameTypeValue === 2) {
    labelText.innerText = 'Cantidad de rondas:';
  }
}

/**
 * Asocia a los botones/dropdown de abandonar, iniciar partida, tipo de juego o de ayuda
 * sus correspondientes eventos
 */
function addEvents() {
  // Agregar evento al botón de abandonar
  const leave = document.getElementById('leave');
  leave.addEventListener('click', () => { Common.exitConfirm(socket); });

  // boton temporal
  const initGame = document.getElementById('initGame');
  initGame.addEventListener('click', startGame);

  // Cambio de tipo de juego
  const gameType = document.getElementById('input_game_type');
  gameType.addEventListener('change', changeGameTypeLabel);

  // Agregar evento al botón de ayuda
  const help = document.getElementById('help-img-button');
  help.addEventListener('click', Common.showHelp);
}

/**
 * Al terminarse una partida se llenan los campos de las configuraciones con aquellas elegidas
 * en la partida recien terminada
 */
function completeGameOptions() {
  const state = localStorage.getItem('state');

  if (state === 'returningToWaitingRoom') {
    const savedGameData = localStorage.getItem('gameInitialData');
    const game = JSON.parse(savedGameData);

    const objectsQuantity = document.getElementById('input_objects_quantity');
    const gameType = document.getElementById('input_game_type');
    const gamePointsRounds = document.getElementById('input_round_points_quantity');
    const playersCardsQuantity = document.getElementById('input_playercards_quantity');
    const stopButton = document.getElementById('chk_winner_option');
    const trapCard = document.getElementById('input_trapcard_time');

    objectsQuantity.value = parseInt(game.options.objectsQuantity, 10);
    gameType.value = parseInt(game.options.gameType, 10);
    gamePointsRounds.value = parseInt(game.options.points, 10);
    playersCardsQuantity.value = parseInt(game.options.playersCards, 10);
    stopButton.checked = game.options.stopButton;
    trapCard.value = game.options.trapCard;

    changeGameTypeLabel();
  }
}

/*
  Función de inicializacion.
  */
function init() {
  completeGameOptions();
  // const gameId = localStorage.getItem('gameId');
  WaitingCommon.joinGameRoom(socket);
  WaitingCommon.insertGameId();
  WaitingCommon.askForPlayersMessage(socket);
  WaitingCommon.messagesListener(socket);
  WaitingCommon.showHistoricalStats();
  addEvents();

  localStorage.setItem('state', 'setOptions');
  localStorage.setItem('host', 'true');
}

// Espera a que se cargue la pagina para iniciar la funcion de init
window.addEventListener('load', init);
