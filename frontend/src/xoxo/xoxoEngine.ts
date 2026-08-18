import { heuristics } from './xoxoHeuristics'

export type CellValue = ' ' | 'X' | 'O'
export type BoardState = CellValue[][]
export type Coordinate = [number, number]

export const BOARD_SIZE = 20

export const createEmptyBoard = (size: number = BOARD_SIZE): BoardState => {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => ' '))
}

export const updatePossibleMoves = (
  board: BoardState,
  possibleMoves: Set<string>,
  lastMove: Coordinate
): Set<string> => {
  const nextMoves = new Set<string>(possibleMoves)
  const [row, col] = lastMove
  const limit = board.length - 1

  for (let r = row - 2; r <= row + 2; r++) {
    if (r < 0) continue
    if (r > limit) break
    for (let c = col - 2; c <= col + 2; c++) {
      if (c < 0) continue
      if (c > limit) break
      if (board[r][c] === ' ') {
        nextMoves.add(`${r},${c}`)
      }
    }
  }

  nextMoves.delete(`${row},${col}`)
  return nextMoves
}

export const checkWin = (board: BoardState, lastMove: Coordinate): boolean => {
  const [row, col] = lastMove
  const target = board[row][col]
  if (target === ' ') return false

  const limit = board.length - 1

  let horizontal = 1
  let c = col + 1
  while (c <= limit && board[row][c] === target) {
    horizontal++
    c++
  }
  c = col - 1
  while (c >= 0 && board[row][c] === target) {
    horizontal++
    c--
  }
  if (horizontal >= 5) return true

  let vertical = 1
  let r = row + 1
  while (r <= limit && board[r][col] === target) {
    vertical++
    r++
  }
  r = row - 1
  while (r >= 0 && board[r][col] === target) {
    vertical++
    r--
  }
  if (vertical >= 5) return true

  let mainDiag = 1
  r = row + 1
  c = col + 1
  while (r <= limit && c <= limit && board[r][c] === target) {
    mainDiag++
    r++
    c++
  }
  r = row - 1
  c = col - 1
  while (r >= 0 && c >= 0 && board[r][c] === target) {
    mainDiag++
    r--
    c--
  }
  if (mainDiag >= 5) return true

  let antiDiag = 1
  r = row + 1
  c = col - 1
  while (r <= limit && c >= 0 && board[r][c] === target) {
    antiDiag++
    r++
    c--
  }
  r = row - 1
  c = col + 1
  while (r >= 0 && c <= limit && board[r][c] === target) {
    antiDiag++
    r--
    c++
  }
  if (antiDiag >= 5) return true

  return false
}

const getBoardLines = (board: BoardState): string[] => {
  const lines: string[] = []
  const n = board.length

  for (let r = 0; r < n; r++) {
    lines.push(board[r].join(''))
  }

  for (let c = 0; c < n; c++) {
    let colStr = ''
    for (let r = 0; r < n; r++) {
      colStr += board[r][c]
    }
    lines.push(colStr)
  }

  for (let startRow = 0; startRow < n; startRow++) {
    let diag = ''
    let r = startRow
    let c = 0
    while (r < n && c < n) {
      diag += board[r][c]
      r++
      c++
    }
    lines.push(diag)
  }

  for (let startCol = 1; startCol < n; startCol++) {
    let diag = ''
    let r = 0
    let c = startCol
    while (r < n && c < n) {
      diag += board[r][c]
      r++
      c++
    }
    lines.push(diag)
  }

  for (let startRow = 0; startRow < n; startRow++) {
    let diag = ''
    let r = startRow
    let c = n - 1
    while (r < n && c >= 0) {
      diag += board[r][c]
      r++
      c--
    }
    lines.push(diag)
  }

  for (let startCol = n - 2; startCol >= 0; startCol--) {
    let diag = ''
    let r = 0
    let c = startCol
    while (r < n && c >= 0) {
      diag += board[r][c]
      r++
      c--
    }
    lines.push(diag)
  }

  return lines
}

export const evaluateBoard = (board: BoardState): number => {
  let score = 0
  const lines = getBoardLines(board)

  for (const line of lines) {
    for (const pattern in heuristics) {
      if (line.includes(pattern)) {
        let count = 0
        let pos = line.indexOf(pattern)
        while (pos !== -1) {
          count++
          pos = line.indexOf(pattern, pos + 1)
        }
        score += count * heuristics[pattern]
      }
    }
  }

  return score
}

export const minimax = (
  board: BoardState,
  depth: number,
  maxing: boolean,
  lastMove: Coordinate | null,
  possibleMoves: Set<string>,
  alpha: number,
  beta: number
): [number, Coordinate | null] => {
  if (lastMove && checkWin(board, lastMove)) {
    if (!maxing) {
      return [1111111111 * Math.pow(depth + 1, depth + 1), lastMove]
    } else {
      return [-1111111111 * Math.pow(depth + 1, depth + 1), lastMove]
    }
  }

  if (depth === 0 || possibleMoves.size === 0) {
    return [evaluateBoard(board), lastMove]
  }

  const movesList: Coordinate[] = Array.from(possibleMoves).map((m) => {
    const [r, c] = m.split(',').map(Number)
    return [r, c]
  })

  let bestMove: Coordinate | null = null

  if (maxing) {
    let maxEval = -Infinity
    for (const [r, c] of movesList) {
      board[r][c] = 'X'
      const updatedMoves = updatePossibleMoves(board, possibleMoves, [r, c])
      const [evaluation] = minimax(board, depth - 1, false, [r, c], updatedMoves, alpha, beta)
      board[r][c] = ' '

      if (evaluation > maxEval) {
        maxEval = evaluation
        bestMove = [r, c]
      }
      alpha = Math.max(alpha, evaluation)
      if (beta <= alpha) {
        break
      }
    }
    return [maxEval, bestMove]
  } else {
    let minEval = Infinity
    for (const [r, c] of movesList) {
      board[r][c] = 'O'
      const updatedMoves = updatePossibleMoves(board, possibleMoves, [r, c])
      const [evaluation] = minimax(board, depth - 1, true, [r, c], updatedMoves, alpha, beta)
      board[r][c] = ' '

      if (evaluation < minEval) {
        minEval = evaluation
        bestMove = [r, c]
      }
      beta = Math.min(beta, evaluation)
      if (beta <= alpha) {
        break
      }
    }
    return [minEval, bestMove]
  }
}

export const getAiMove = (
  board: BoardState,
  lastMove: Coordinate,
  possibleMoves: Set<string>,
  depth: number = 3
): Coordinate | null => {
  if (possibleMoves.size === 0) {
    const center = Math.floor(board.length / 2)
    return [center, center]
  }

  const [, bestMove] = minimax(
    board,
    depth,
    true,
    lastMove,
    possibleMoves,
    -Infinity,
    Infinity
  )

  return bestMove
}