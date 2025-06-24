import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Copy, Crown, Users, MessageCircle, Play, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Lobby() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { gameState, startGame, leaveRoom, sendChatMessage } = useGame();
  const [chatMessage, setChatMessage] = useState('');

  useEffect(() => {
    if (!gameState.currentPlayer && !gameState.isLoading) {
      navigate('/');
    }
  }, [gameState.currentPlayer, gameState.isLoading, navigate]);

  const handleCopyRoomCode = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      toast.success('Room code copied to clipboard!');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      sendChatMessage(chatMessage);
      setChatMessage('');
    }
  };

  const handleStartGame = () => {
    startGame();
    navigate(`/game/${roomId}`);
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    navigate('/');
  };

  if (gameState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Loading lobby...
      </div>
    );
  }

  if (!gameState.currentPlayer || !roomId) {
    return null;
  }

  const isHost = gameState.currentPlayer.isHost;
  const canStartGame = gameState.players.length >= 2 && gameState.players.every(p => p.isReady);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLeaveRoom}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Leave
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Game Lobby</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-200">
                  Room: {roomId}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyRoomCode}
                  className="h-6 px-2 text-purple-200 hover:bg-purple-500/20"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
          
          {isHost && (
            <Button
              onClick={handleStartGame}
              disabled={!canStartGame}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Game
            </Button>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Players List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Players ({gameState.players?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <AnimatePresence>
                    {(gameState.players || []).map((player, index) => (
                      <motion.div
                        key={player.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{player.name}</span>
                              {player.isHost && (
                                <Crown className="w-4 h-4 text-yellow-400" />
                              )}
                            </div>
                            <div className="text-sm text-purple-200">
                              Score: {player.score}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={player.isReady ? "default" : "secondary"}
                          className={player.isReady 
                            ? "bg-green-500/20 text-green-300" 
                            : "bg-yellow-500/20 text-yellow-300"
                          }
                        >
                          {player.isReady ? "Ready" : "Not Ready"}
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                {!canStartGame && (
                  <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-yellow-200 text-sm">
                      {gameState.players.length < 2 
                        ? "Waiting for more players to join..."
                        : "Waiting for all players to be ready..."
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Chat */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white h-[500px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-400" />
                  Chat
                </CardTitle>
              </CardHeader>
              <Separator className="bg-white/20" />
              <CardContent className="flex-1 flex flex-col p-0">
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  <AnimatePresence>
                    {(gameState.chat || []).map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2"
                      >
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs text-white font-semibold">
                          {message.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-purple-200">
                              {message.username}
                            </span>
                            <span className="text-xs text-purple-300">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-white text-sm">{message.message}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <Separator className="bg-white/20" />
                <form onSubmit={handleSendMessage} className="p-4">
                  <div className="flex gap-2">
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-purple-200"
                      maxLength={200}
                    />
                    <Button 
                      type="submit" 
                      size="sm"
                      disabled={!chatMessage.trim()}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Send
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}