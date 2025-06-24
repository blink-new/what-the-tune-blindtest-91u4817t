import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Play, Pause, Volume2, Trophy, Clock, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Game() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { state, submitAnswer } = useGame();
  const [isPlaying, setIsPlaying] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!state.currentPlayer || state.roomId !== roomId) {
      navigate('/');
    }
  }, [state.currentPlayer, state.roomId, roomId, navigate]);

  useEffect(() => {
    if (state.gameStatus === 'finished') {
      navigate(`/results/${roomId}`);
    }
  }, [state.gameStatus, roomId, navigate]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.timeLeft > 0 && state.gameStatus === 'playing') {
      interval = setInterval(() => {
        // This would be handled by the socket in a real implementation
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.timeLeft, state.gameStatus]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim() || hasSubmitted) return;

    submitAnswer(title.trim(), artist.trim());
    setHasSubmitted(true);
    toast.success('Answer submitted!');
  };

  if (!state.currentPlayer || !roomId) {
    return null;
  }

  const timePercentage = state.timeLeft > 0 ? (state.timeLeft / 30) * 100 : 0;
  const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Game Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-200">
              Round {state.round} / {state.maxRounds}
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-200">
              Room: {roomId}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">What the Tune?</h1>
          <p className="text-purple-200">Listen carefully and guess the song!</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Audio Player & Answer Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Audio Player */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-purple-400" />
                  Now Playing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Timer */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-200">Time Remaining</span>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-lg font-bold text-white">
                        {Math.max(0, state.timeLeft)}s
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={timePercentage} 
                    className="h-2 bg-white/20"
                  />
                </div>

                {/* Audio Controls */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-4 p-6 bg-white/5 rounded-xl">
                    <Button
                      onClick={handlePlayPause}
                      size="lg"
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6 ml-1" />
                      )}
                    </Button>
                    <Volume2 className="w-6 h-6 text-purple-400" />
                  </div>
                </div>

                {/* Hidden audio element */}
                <audio
                  ref={audioRef}
                  src={state.currentSong?.audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              </CardContent>
            </Card>

            {/* Answer Form */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle>Your Answer</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitAnswer} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-purple-200">Song Title</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter the song title..."
                      disabled={hasSubmitted || state.timeLeft === 0}
                      className="bg-white/20 border-white/30 text-white placeholder:text-purple-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-purple-200">Artist</label>
                    <Input
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                      placeholder="Enter the artist name..."
                      disabled={hasSubmitted || state.timeLeft === 0}
                      className="bg-white/20 border-white/30 text-white placeholder:text-purple-300"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!title.trim() || !artist.trim() || hasSubmitted || state.timeLeft === 0}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 font-semibold"
                  >
                    {hasSubmitted ? 'Answer Submitted!' : 'Submit Answer'}
                  </Button>
                </form>

                {hasSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg"
                  >
                    <p className="text-green-200 text-sm">
                      Answer submitted! Waiting for other players...
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <AnimatePresence>
                    {sortedPlayers.map((player, index) => (
                      <motion.div
                        key={player.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          player.id === state.currentPlayer?.id
                            ? 'bg-purple-500/20 border border-purple-500/30'
                            : 'bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500 text-black' :
                            index === 1 ? 'bg-gray-400 text-black' :
                            index === 2 ? 'bg-amber-600 text-white' :
                            'bg-white/20 text-white'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {player.username}
                              {player.id === state.currentPlayer?.id && (
                                <span className="text-purple-300 text-sm ml-1">(You)</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-white">{player.score}</div>
                          <div className="text-xs text-purple-200">points</div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}