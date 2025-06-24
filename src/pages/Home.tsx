import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Music, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();
  const { createRoom, joinRoom } = useGame();

  const handleCreateRoom = async () => {
    if (!username.trim()) return;
    
    setIsCreating(true);
    try {
      const newRoomId = await createRoom(username);
      navigate(`/lobby/${newRoomId}`);
    } catch (error) {
      console.error('Failed to create room:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!username.trim() || !roomId.trim()) return;
    
    setIsJoining(true);
    try {
      await joinRoom(roomId.toUpperCase(), username);
      navigate(`/lobby/${roomId.toUpperCase()}`);
    } catch (error) {
      console.error('Failed to join room:', error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
            <Music className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-display">
          What the Tune?
        </h1>
        <p className="text-xl text-purple-200 max-w-2xl mx-auto">
          Test your music knowledge in real-time multiplayer blindtest battles!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid md:grid-cols-2 gap-6 max-w-4xl w-full"
      >
        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              <CardTitle>Create Room</CardTitle>
            </div>
            <CardDescription className="text-purple-200">
              Start a new game and invite your friends
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-purple-200"
              maxLength={20}
            />
            <Button 
              onClick={handleCreateRoom}
              disabled={!username.trim() || isCreating}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
            >
              {isCreating ? 'Creating...' : 'Create Room'}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-400" />
              <CardTitle>Join Room</CardTitle>
            </div>
            <CardDescription className="text-purple-200">
              Enter a room code to join an existing game
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-purple-200"
              maxLength={20}
            />
            <Input
              placeholder="Enter room code"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              className="bg-white/20 border-white/30 text-white placeholder:text-purple-200"
              maxLength={6}
            />
            <Button 
              onClick={handleJoinRoom}
              disabled={!username.trim() || !roomId.trim() || isJoining}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold"
            >
              {isJoining ? 'Joining...' : 'Join Room'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12 text-center text-purple-200"
      >
        <div className="flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            <span>Guess the song</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Be fast to score</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Play with friends</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}