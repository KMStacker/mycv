import { useState, useEffect, JSX } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'
import {
  createEmptyBoard,
  updatePossibleMoves,
  checkWin,
  getAiMove,
  BoardState,
  Coordinate,
  BOARD_SIZE
} from '../xoxo/xoxoEngine'

const GamePage = (): JSX.Element => {
  const [board, setBoard] = useState<BoardState>(() => createEmptyBoard())
  const [possibleMoves, setPossibleMoves] = useState<Set<string>>(new Set())
  const [status, setStatus] = useState<'PLAYING' | 'PLAYER_WON' | 'AI_WON' | 'DRAW'>('PLAYING')
  const [depth, setDepth] = useState<number>(3)
  const [moveCount, setMoveCount] = useState<number>(0)
  const [lastMove, setLastMove] = useState<Coordinate | null>(null)
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false)

  useEffect(() => {
    if (!isAiThinking || status !== 'PLAYING' || !lastMove) {
      return
    }

    const timer = setTimeout(() => {
      const aiTarget = getAiMove(board, lastMove, possibleMoves, depth)

      if (!aiTarget) {
        setStatus('DRAW')
        setIsAiThinking(false)
        return
      }

      const [aiRow, aiCol] = aiTarget
      const boardAfterAi = board.map((r) => [...r])
      boardAfterAi[aiRow][aiCol] = 'X'
      const movesAfterAi = updatePossibleMoves(boardAfterAi, possibleMoves, aiTarget)

      setBoard(boardAfterAi)
      setLastMove(aiTarget)
      setPossibleMoves(movesAfterAi)
      setIsAiThinking(false)

      if (checkWin(boardAfterAi, aiTarget)) {
        setStatus('AI_WON')
        return
      }

      if (movesAfterAi.size === 0) {
        setStatus('DRAW')
      }
    }, 50)

    return () => clearTimeout(timer)
  }, [isAiThinking, board, lastMove, possibleMoves, depth, status])

  const handleCellClick = (row: number, col: number): void => {
    if (status !== 'PLAYING' || isAiThinking || board[row][col] !== ' ') {
      return
    }

    const nextBoard = board.map((r) => [...r])
    nextBoard[row][col] = 'O'
    const playerMove: Coordinate = [row, col]
    const nextPossibleMoves = updatePossibleMoves(nextBoard, possibleMoves, playerMove)

    setBoard(nextBoard)
    setLastMove(playerMove)
    setMoveCount((prev) => prev + 1)
    setPossibleMoves(nextPossibleMoves)

    if (checkWin(nextBoard, playerMove)) {
      setStatus('PLAYER_WON')
      return
    }

    if (nextPossibleMoves.size === 0) {
      setStatus('DRAW')
      return
    }

    setIsAiThinking(true)
  }

  const handleResetGame = (): void => {
    setBoard(createEmptyBoard())
    setPossibleMoves(new Set())
    setStatus('PLAYING')
    setMoveCount(0)
    setLastMove(null)
    setIsAiThinking(false)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={10}
        sx={{
          p: { xs: 2, sm: 4 },
          bgcolor: 'rgba(15, 8, 30, 0.75)',
          border: '1px solid rgba(0, 255, 255, 0.3)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.8), 0 0 20px rgba(0, 255, 255, 0.2)'
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontFamily: '"Orbitron", sans-serif',
            fontWeight: 900,
            color: '#00ffff',
            textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
            letterSpacing: '2px',
            mb: 2
          }}
        >
          XOXO//GAME_ARENA
        </Typography>

        <Typography variant="body2" align="center" sx={{ color: '#aaa', mb: 3 }}>
          20x20 Five-in-a-row against Minimax AI with Alpha-Beta Pruning. Form 5 in a row to win!
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mb: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Chip
              icon={<PersonIcon sx={{ color: '#00ff66 !important' }} />}
              label="YOU: O"
              sx={{
                bgcolor: 'rgba(0, 255, 102, 0.15)',
                color: '#00ff66',
                border: '1px solid #00ff66',
                fontFamily: 'monospace',
                fontWeight: 'bold'
              }}
            />
            <Chip
              icon={<SmartToyIcon sx={{ color: '#ff00a0 !important' }} />}
              label="AI: X"
              sx={{
                bgcolor: 'rgba(255, 0, 160, 0.15)',
                color: '#ff00a0',
                border: '1px solid #ff00a0',
                fontFamily: 'monospace',
                fontWeight: 'bold'
              }}
            />
            <Chip
              label={`MOVES: ${moveCount}`}
              sx={{
                bgcolor: 'rgba(0, 255, 255, 0.1)',
                color: '#00ffff',
                border: '1px solid rgba(0, 255, 255, 0.4)',
                fontFamily: 'monospace'
              }}
            />
            {isAiThinking && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={18} sx={{ color: '#ff00a0' }} />
                <Typography variant="caption" sx={{ color: '#ff00a0', fontFamily: 'monospace' }}>
                  AI CALCULATING...
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel sx={{ color: '#00ffff' }}>Difficulty</InputLabel>
              <Select
                value={depth}
                label="Difficulty"
                disabled={moveCount > 0}
                onChange={(e) => setDepth(Number(e.target.value))}
                sx={{
                  color: '#fff',
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 255, 255, 0.4)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00ffff' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00ffff' }
                }}
              >
                <MenuItem value={2}>Fast (Depth 2)</MenuItem>
                <MenuItem value={3}>Standard (Depth 3)</MenuItem>
                <MenuItem value={4}>Master (Depth 4)</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              color="primary"
              onClick={handleResetGame}
              startIcon={<RestartAltIcon />}
            >
              Reset
            </Button>
          </Box>
        </Box>

        {status !== 'PLAYING' && (
          <Paper
            sx={{
              p: 2,
              mb: 3,
              textAlign: 'center',
              bgcolor:
                status === 'PLAYER_WON'
                  ? 'rgba(0, 255, 102, 0.15)'
                  : status === 'AI_WON'
                    ? 'rgba(255, 0, 160, 0.15)'
                    : 'rgba(0, 255, 255, 0.15)',
              border: `1px solid ${
                status === 'PLAYER_WON' ? '#00ff66' : status === 'AI_WON' ? '#ff00a0' : '#00ffff'
              }`
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Orbitron", sans-serif',
                color:
                  status === 'PLAYER_WON'
                    ? '#00ff66'
                    : status === 'AI_WON'
                      ? '#ff00a0'
                      : '#00ffff',
                fontWeight: 'bold'
              }}
            >
              {status === 'PLAYER_WON' && 'VICTORY! You connected 5 in a row!'}
              {status === 'AI_WON' && 'DEFEAT! AI connected 5 in a row!'}
              {status === 'DRAW' && 'DRAW! Board has no further moves.'}
            </Typography>
          </Paper>
        )}

        <Box
          sx={{
            overflowX: 'auto',
            pb: 2,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${BOARD_SIZE}, 26px)`,
              gridTemplateRows: `repeat(${BOARD_SIZE}, 26px)`,
              gap: '2px',
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              p: 1,
              border: '2px solid rgba(0, 255, 255, 0.4)',
              borderRadius: '4px'
            }}
          >
            {board.map((rowArr, rowIndex) =>
              rowArr.map((cell, colIndex) => {
                const isLast = lastMove && lastMove[0] === rowIndex && lastMove[1] === colIndex
                return (
                  <Box
                    key={`${rowIndex}-${colIndex}`}
                    data-testid={`cell-${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    sx={{
                      width: 26,
                      height: 26,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isLast
                        ? 'rgba(255, 255, 255, 0.2)'
                        : 'rgba(20, 10, 35, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: cell === 'O' ? '#00ff66' : cell === 'X' ? '#ff00a0' : 'transparent',
                      fontWeight: 'bold',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      cursor: status === 'PLAYING' && cell === ' ' ? 'pointer' : 'default',
                      userSelect: 'none',
                      '&:hover': {
                        bgcolor:
                          status === 'PLAYING' && cell === ' '
                            ? 'rgba(0, 255, 255, 0.25)'
                            : undefined
                      }
                    }}
                  >
                    {cell !== ' ' ? cell : ''}
                  </Box>
                )
              })
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default GamePage