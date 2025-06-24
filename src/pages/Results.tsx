export default function Results() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { gameState, leaveRoom, isLoading } = useGame();

  const sortedPlayers = [...(gameState.players || [])].sort((a, b) => b.score - a.score);
  const currentPlayerRank = sortedPlayers.findIndex(p => p.id === gameState.currentPlayer?.id) + 1;

  const handlePlayAgain = () => {
    // In a real implementation, this would reset the game
    navigate(`/lobby/${roomId}`);
  };

  const handleGoHome = () => {
    leaveRoom();
    navigate('/');
  };

  const handleShare = () => {
    const shareText = `I just played What the Tune? and ranked #${currentPlayerRank} with ${gameState.currentPlayer?.score} points! Join me for a music blindtest battle!`;
    if (navigator.share) {
      navigator.share({
        title: 'What the Tune? - Results',
        text: shareText,
        url: window.location.origin,
      }).catch(() => {
        navigator.clipboard.writeText(shareText);
        toast.success('Results copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Results copied to clipboard!');
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 2:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 3:
        return <Award className="w-8 h-8 text-amber-600" />;
      default:
        return <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">{rank}</div>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500 to-orange-500';
      case 2:
        return 'from-gray-400 to-gray-600';
      case 3:
        return 'from-amber-600 to-amber-800';
      default:
        return 'from-purple-500 to-purple-700';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Loading results...
      </div>
    );
  }

  if (!gameState.currentPlayer || !roomId) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Game Over!</h1>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 text-lg px-4 py-2">
            Room: {roomId}
          </Badge>
        </motion.div>

        {/* Player's Result */}
        {gameState.currentPlayer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className={`bg-gradient-to-r ${getRankColor(currentPlayerRank)} text-white border-none`}>
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  {getRankIcon(currentPlayerRank)}
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {currentPlayerRank === 1 ? 'Congratulations!' : 'Well Played!'}
                </h2>
                <p className="text-lg mb-4">
                  You ranked #{currentPlayerRank} with {gameState.currentPlayer.score} points
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={handleShare}
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-none"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Share Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Final Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Final Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(sortedPlayers || []).map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      player.id === gameState.currentPlayer?.id
                        ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50'
                        : 'bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {getRankIcon(index + 1)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{player.name}</span>
                          {player.id === gameState.currentPlayer?.id && (
                            <Badge variant="secondary" className="bg-purple-500/30 text-purple-200">
                              You
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-purple-200">
                          {index === 0 ? '🏆 Champion' : 
                           index === 1 ? '🥈 Runner-up' : 
                           index === 2 ? '🥉 Third Place' : 
                           `${index + 1}${index + 1 === 4 ? 'th' : index + 1 === 5 ? 'th' : 'th'} Place`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-2xl text-white">{player.score}</div>
                      <div className="text-sm text-purple-200">points</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center gap-4"
        >
          <Button
            onClick={handlePlayAgain}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-8 py-3"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 px-8 py-3"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
}