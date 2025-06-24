import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
  isHost: boolean;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  duration: number;
}

interface Answer {
  playerId: string;
  songId: string;
  title: string;
  artist: string;
  timestamp: number;
  isCorrect: boolean;
  points: number;
}

interface GameState {
  roomId: string | null;
  players: Player[];
  currentPlayer: Player | null;
  currentSong: Song | null;
  songIndex: number;
  totalSongs: number;
  isPlaying: boolean;
  isGameStarted: boolean;
  timeRemaining: number;
  answers: Answer[];
  gameStatus: 'waiting' | 'playing' | 'between-songs' | 'finished';
}

interface GameContextType {
  gameState: GameState;
  joinRoom: (roomId: string, playerName: string) => void;
  createRoom: (playerName: string) => string;
  startGame: () => void;
  submitAnswer: (title: string, artist: string) => void;
  toggleReady: () => void;
  leaveRoom: () => void;
  nextSong: () => void;
  setTimeRemaining: (time: number) => void;
}

const defaultGameState: GameState = {
  roomId: null,
  players: [],
  currentPlayer: null,
  currentSong: null,
  songIndex: 0,
  totalSongs: 10,
  isPlaying: false,
  isGameStarted: false,
  timeRemaining: 30,
  answers: [],
  gameStatus: 'waiting',
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);

  // WebSocket connection will be implemented here
  useEffect(() => {
    // TODO: Initialize WebSocket connection
    // This will handle real-time updates between players
  }, [gameState.roomId]);

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRoom = (playerName: string): string => {
    const roomId = generateRoomId();
    const newPlayer: Player = {
      id: Math.random().toString(36).substring(2, 11),
      name: playerName,
      score: 0,
      isReady: false,
      isHost: true,
    };

    setGameState(prev => ({
      ...prev,
      roomId,
      players: [newPlayer],
      currentPlayer: newPlayer,
    }));

    return roomId;
  };

  const joinRoom = (roomId: string, playerName: string) => {
    const newPlayer: Player = {
      id: Math.random().toString(36).substring(2, 11),
      name: playerName,
      score: 0,
      isReady: false,
      isHost: false,
    };

    setGameState(prev => ({
      ...prev,
      roomId,
      players: [...prev.players, newPlayer],
      currentPlayer: newPlayer,
    }));
  };

  const toggleReady = () => {
    if (!gameState.currentPlayer) return;

    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player =>
        player.id === prev.currentPlayer?.id
          ? { ...player, isReady: !player.isReady }
          : player
      ),
    }));
  };

  const startGame = () => {
    if (!gameState.currentPlayer?.isHost) return;

    setGameState(prev => ({
      ...prev,
      isGameStarted: true,
      gameStatus: 'playing',
      songIndex: 0,
    }));

    // TODO: Start the first song
    nextSong();
  };

  const nextSong = () => {
    // TODO: Load next song from the playlist
    // This will be implemented with the WebSocket backend
    setGameState(prev => ({
      ...prev,
      songIndex: prev.songIndex + 1,
      timeRemaining: 30,
      gameStatus: 'playing',
    }));
  };

  const submitAnswer = (title: string, artist: string) => {
    if (!gameState.currentPlayer || !gameState.currentSong) return;

    const answer: Answer = {
      playerId: gameState.currentPlayer.id,
      songId: gameState.currentSong.id,
      title,
      artist,
      timestamp: Date.now(),
      isCorrect: false, // Will be validated by backend
      points: 0,
    };

    setGameState(prev => ({
      ...prev,
      answers: [...prev.answers, answer],
    }));

    // TODO: Send answer to backend via WebSocket
  };

  const leaveRoom = () => {
    setGameState(defaultGameState);
    // TODO: Notify backend via WebSocket
  };

  const setTimeRemaining = (time: number) => {
    setGameState(prev => ({ ...prev, timeRemaining: time }));
  };

  const contextValue: GameContextType = {
    gameState,
    joinRoom,
    createRoom,
    startGame,
    submitAnswer,
    toggleReady,
    leaveRoom,
    nextSong,
    setTimeRemaining,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};