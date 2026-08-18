import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, describe } from 'vitest'
import XoxoPage from './XoxoPage'

describe('GamePage Component', () => {
  test('renders game arena title and status chips', () => {
    render(<XoxoPage />)
    screen.debug()
    expect(screen.getByText(/XOXO\/\/GAME_ARENA/i)).toBeInTheDocument()
    expect(screen.getByText('YOU: O')).toBeInTheDocument()
    expect(screen.getByText('AI: X')).toBeInTheDocument()
    expect(screen.getByText('MOVES: 0')).toBeInTheDocument()
  })

  test('allows player to make a move on empty board', async () => {
    const user = userEvent.setup()
    render(<XoxoPage />)

    const targetCell = screen.getByTestId('cell-0-0')
    await user.click(targetCell)

    await waitFor(() => {
      expect(screen.getByText(/MOVES: 1/i)).toBeInTheDocument()
    })
  })

  test('resets game board when Reset button is clicked', async () => {
    const user = userEvent.setup()
    render(<XoxoPage />)

    const targetCell = screen.getByTestId('cell-0-0')
    await user.click(targetCell)

    await waitFor(() => {
      expect(screen.getByText(/MOVES: 1/i)).toBeInTheDocument()
    })

    const resetButton = screen.getByRole('button', { name: /reset/i })
    await user.click(resetButton)

    expect(screen.getByText('MOVES: 0')).toBeInTheDocument()
  })
})