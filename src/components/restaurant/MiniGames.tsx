import { useState } from 'react';
import { Gamepad2, X, Users, Brain, Zap, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type TicTacToeSquare = 'X' | 'O' | null;
type SudokuCell = number | null;

const INITIAL_SUDOKU_PUZZLE = [
  [5, 3, null, null, 7, null, null, null, null],
  [6, null, null, 1, 9, 5, null, null, null],
  [null, 9, 8, null, null, null, null, 6, null],
  [8, null, null, null, 6, null, null, null, 3],
  [4, null, null, 8, null, 3, null, null, 1],
  [7, null, null, null, 2, null, null, null, 6],
  [null, 6, null, null, null, null, 2, 8, null],
  [null, null, null, 4, 1, 9, null, null, 5],
  [null, null, null, null, 8, null, null, 7, 9]
];

export function MiniGames() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  
  // Tic Tac Toe State
  const [ticTacBoard, setTicTacBoard] = useState<TicTacToeSquare[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [ticTacWinner, setTicTacWinner] = useState<string | null>(null);
  
  // Sudoku State
  const [sudokuBoard, setSudokuBoard] = useState<SudokuCell[][]>(
    INITIAL_SUDOKU_PUZZLE.map(row => [...row])
  );

  // Memory Game State
  const [memoryCards, setMemoryCards] = useState<number[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);

  const checkTicTacWinner = (board: TicTacToeSquare[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    
    if (board.every(square => square !== null)) {
      return 'tie';
    }
    
    return null;
  };

  const handleTicTacClick = (index: number) => {
    if (ticTacBoard[index] || ticTacWinner) return;

    const newBoard = [...ticTacBoard];
    newBoard[index] = currentPlayer;
    setTicTacBoard(newBoard);

    const winner = checkTicTacWinner(newBoard);
    if (winner) {
      setTicTacWinner(winner);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetTicTac = () => {
    setTicTacBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setTicTacWinner(null);
  };

  const handleSudokuChange = (row: number, col: number, value: string) => {
    const num = value === '' ? null : parseInt(value);
    if (num && (num < 1 || num > 9)) return;

    const newBoard = sudokuBoard.map((r, rIndex) =>
      r.map((cell, cIndex) => (rIndex === row && cIndex === col ? num : cell))
    );
    setSudokuBoard(newBoard);
  };

  const initMemoryGame = () => {
    const cards = [...Array(8)].map((_, i) => i).concat([...Array(8)].map((_, i) => i));
    setMemoryCards(cards.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMatchedCards([]);
    setMemoryMoves(0);
  };

  const handleMemoryCardClick = (index: number) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(index) || matchedCards.includes(index)) return;

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves(prev => prev + 1);
      if (memoryCards[newFlipped[0]] === memoryCards[newFlipped[1]]) {
        setMatchedCards(prev => [...prev, ...newFlipped]);
        setFlippedCards([]);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  const games = [
    {
      id: 'tictactoe',
      name: 'Tic Tac Toe',
      description: 'Classic X vs O game',
      icon: <Users className="h-6 w-6" />,
      difficulty: 'Easy'
    },
    {
      id: 'sudoku',
      name: 'Sudoku',
      description: 'Number puzzle challenge',
      icon: <Brain className="h-6 w-6" />,
      difficulty: 'Hard'
    },
    {
      id: 'memory',
      name: 'Memory Match',
      description: 'Find matching pairs',
      icon: <Zap className="h-6 w-6" />,
      difficulty: 'Medium'
    }
  ];

  const renderTicTacToe = () => (
    <div className="space-y-6">
      <div className="text-center">
        {ticTacWinner ? (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {ticTacWinner === 'tie' ? "It's a tie!" : `Player ${ticTacWinner} wins!`}
            </h3>
            <Button onClick={resetTicTac} variant="outline">
              Play Again
            </Button>
          </div>
        ) : (
          <h3 className="text-lg font-semibold">Player {currentPlayer}'s turn</h3>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {ticTacBoard.map((square, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-20 w-20 text-2xl font-bold border-2 border-border"
            onClick={() => handleTicTacClick(index)}
            disabled={!!square || !!ticTacWinner}
          >
            {square}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderSudoku = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Sudoku Challenge</h3>
        <p className="text-sm text-muted-foreground">Fill in numbers 1-9</p>
      </div>
      
      <div className="grid grid-cols-9 gap-1 max-w-md mx-auto border-4 border-primary p-2 rounded-lg bg-card">
        {sudokuBoard.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              value={cell || ''}
              onChange={(e) => handleSudokuChange(rowIndex, colIndex, e.target.value)}
              className={`w-8 h-8 text-center border-2 border-border text-xs font-semibold rounded ${
                INITIAL_SUDOKU_PUZZLE[rowIndex][colIndex] ? 'bg-muted border-muted-foreground' : 'bg-background border-input'
              } ${(rowIndex + 1) % 3 === 0 ? 'border-b-4 border-b-primary' : ''} 
              ${(colIndex + 1) % 3 === 0 ? 'border-r-4 border-r-primary' : ''}`}
              maxLength={1}
              disabled={!!INITIAL_SUDOKU_PUZZLE[rowIndex][colIndex]}
            />
          ))
        )}
      </div>
    </div>
  );

  const renderMemoryGame = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Memory Match</h3>
        <p className="text-sm text-muted-foreground">Moves: {memoryMoves}</p>
        {memoryCards.length === 0 && (
          <Button onClick={initMemoryGame} className="text-white" style={{ background: 'linear-gradient(135deg, #9D080F 0%, #c20a13 100%)' }}>Start Game</Button>
        )}
      </div>
      
      {memoryCards.length > 0 && (
        <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
          {memoryCards.map((card, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-16 w-16 text-xl border-2 border-border"
              onClick={() => handleMemoryCardClick(index)}
              disabled={matchedCards.includes(index)}
            >
              {flippedCards.includes(index) || matchedCards.includes(index) 
                ? ['🍎', '🍌', '🍓', '🍊', '🍇', '🥝', '🍑', '🥭'][card]
                : '?'
              }
            </Button>
          ))}
        </div>
      )}
      
      {matchedCards.length === 16 && (
        <div className="text-center">
          <h3 className="text-lg font-semibold text-primary">
            Congratulations! You won in {memoryMoves} moves!
          </h3>
          <Button onClick={initMemoryGame} variant="outline" className="mt-2">
            Play Again
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="gap-3 text-white border-none font-semibold transition-all duration-300 animate-fade-in"
          style={{ background: 'linear-gradient(135deg, #9D080F 0%, #c20a13 100%)' }}
        >
          <Gamepad2 className="h-5 w-5" />
          <span className="font-medium">Mini Games</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            Mini Games
          </DialogTitle>
          <DialogDescription>
            Take a break and enjoy some fun games while waiting for your order!
          </DialogDescription>
        </DialogHeader>
        
        {!currentGame ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            {games.map((game) => (
              <Card 
                key={game.id} 
                className="cursor-pointer hover:shadow-hover transition-all duration-300 hover-scale border-2 border-border"
                onClick={() => setCurrentGame(game.id)}
              >
                <CardHeader className="text-center pb-3">
                  <div className="mx-auto mb-2 h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    {game.icon}
                  </div>
                  <CardTitle className="text-lg">{game.name}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 text-center">
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    game.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    game.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {game.difficulty}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">
                {games.find(g => g.id === currentGame)?.name}
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCurrentGame(null)}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Back to Games
              </Button>
            </div>
            
            <div className="overflow-y-auto max-h-96">
              {currentGame === 'tictactoe' && renderTicTacToe()}
              {currentGame === 'sudoku' && renderSudoku()}
              {currentGame === 'memory' && renderMemoryGame()}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}