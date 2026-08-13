import React, { useState, useEffect, JSX } from 'react'
import commentService, { Comment } from '../services/comments'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Container,
  List,
  ListItem,
  Chip,
  IconButton,
  Alert
} from '@mui/material'
import ReplyIcon from '@mui/icons-material/Reply'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import LockIcon from '@mui/icons-material/Lock'

interface User {
  username: string
  token: string
  role: 'USER' | 'ADMIN'
}

interface GuestbookPageProps {
  user: User | null
  handleLogin: (username: string, password: string) => Promise<void>
}

const GuestbookPage = ({ user, handleLogin }: GuestbookPageProps): JSX.Element => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState<string>('')
  const [isPublic, setIsPublic] = useState<boolean>(true)
  const [guestName, setGuestName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'NONE' | 'LOGIN' | 'REGISTER' | 'GUEST'>('NONE')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await commentService.getAll(user?.token || null)
        setComments(data)
      } catch (err) {
        console.error(err)
      }
    }
    void fetchComments()
  }, [user])

  const handlePostComment = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault()
    try {
      const savedComment = await commentService.create(
        newComment,
        isPublic,
        guestName,
        user ? user.token : null,
        replyingTo
      )
      setComments([savedComment, ...comments])
      setNewComment('')
      setGuestName('')
      setError(null)
      setViewMode('NONE')
      setReplyingTo(null)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to post comment')
    }
  }

  const handleDeleteComment = async (id: number): Promise<void> => {
    if (!user || user.role !== 'ADMIN') return

    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await commentService.remove(id, user.token)
        setComments(comments.filter((comment) => comment.id !== id))
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to delete comment')
      }
    }
  }

  const renderCommentThread = (
    parentId: number | null = null,
    depth: number = 0
  ): JSX.Element | null => {
    const threadComments = comments.filter((c) => c.parentId === parentId)
    if (threadComments.length === 0) return null

    return (
      <List disablePadding sx={{ pl: depth === 0 ? 0 : { xs: 2, sm: 4 }, mt: depth === 0 ? 0 : 1 }}>
        {threadComments.map((comment) => (
          <ListItem
            key={comment.id}
            disablePadding
            sx={{
              mb: 1.5,
              display: 'block'
            }}
          >
            <Paper
              sx={{
                p: 2,
                bgcolor: 'rgba(10, 5, 20, 0.85)',
                border: '1px solid rgba(0, 255, 255, 0.3)',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                    {comment.user ? comment.user.username : comment.guestName}
                  </Typography>
                  {!comment.isPublic && (
                    <Chip
                      icon={<LockIcon sx={{ fontSize: '0.8rem !important', color: '#ff00a0 !important' }} />}
                      label="PRIVATE"
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255, 0, 160, 0.1)',
                        color: '#ff00a0',
                        border: '1px solid rgba(255, 0, 160, 0.4)',
                        fontSize: '0.65rem',
                        fontWeight: 'bold'
                      }}
                    />
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  {user && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setReplyingTo(comment.id)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      sx={{ color: '#00ffff', '&:hover': { bgcolor: 'rgba(0, 255, 255, 0.1)' } }}
                    >
                      <ReplyIcon fontSize="small" />
                    </IconButton>
                  )}
                  {user?.role === 'ADMIN' && (
                    <IconButton
                      size="small"
                      onClick={() => void handleDeleteComment(comment.id)}
                      sx={{ color: '#ff00a0', '&:hover': { bgcolor: 'rgba(255, 0, 160, 0.1)' } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Box>

              <Typography variant="body2" sx={{ color: '#e0e0e0', lineHeight: 1.5 }}>
                {comment.content}
              </Typography>
            </Paper>

            {renderCommentThread(comment.id, depth + 1)}
          </ListItem>
        ))}
      </List>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={10}
        sx={{
          p: { xs: 2, sm: 4 },
          bgcolor: 'rgba(15, 8, 30, 0.75)',
          border: '1px solid rgba(0, 255, 255, 0.3)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.8), 0 0 20px rgba(255, 0, 160, 0.2)'
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
          GUESTBOOK//TRANSMISSIONS
        </Typography>

        <Typography variant="body2" align="center" sx={{ color: '#aaa', fontStyle: 'italic', mb: 3 }}>
          Feel free to leave a public comment, or a private message for the admin's eyes only!
        </Typography>

        {replyingTo && (
          <Alert
            severity="info"
            action={
              <Button color="inherit" size="small" onClick={() => setReplyingTo(null)}>
                CANCEL
              </Button>
            }
            sx={{ mb: 3, bgcolor: 'rgba(0, 255, 255, 0.1)', color: '#00ffff', border: '1px solid #00ffff' }}
          >
            Replying to comment #{replyingTo}...
          </Alert>
        )}

        {user ? (
          <Box component="form" onSubmit={handlePostComment} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={newComment}
                onChange={({ target }) => setNewComment(target.value)}
                placeholder="Write a comment..."
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                sx={{ minWidth: '120px' }}
              >
                Post
              </Button>
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!isPublic}
                  onChange={() => setIsPublic(!isPublic)}
                  sx={{ color: '#ff00a0', '&.Mui-checked': { color: '#ff00a0' } }}
                />
              }
              label={<Typography variant="caption" sx={{ color: '#aaa' }}>Make comment private</Typography>}
            />
          </Box>
        ) : (
          <Box sx={{ mb: 4, mt: 2 }}>
            {viewMode === 'NONE' && (
              <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(10, 5, 20, 0.85)' }}>
                <Typography variant="body1" sx={{ color: '#fff', mb: 2 }}>
                  In order to leave a comment, choose one:
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Button variant="outlined" onClick={() => setViewMode('LOGIN')}>
                    Login
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => setViewMode('REGISTER')}>
                    Sign up
                  </Button>
                  <Button variant="outlined" color="primary" onClick={() => setViewMode('GUEST')}>
                    Leave comment as guest
                  </Button>
                </Box>
              </Paper>
            )}

            {viewMode === 'LOGIN' && (
              <LoginForm
                handleLogin={handleLogin}
                onSuccess={() => setViewMode('NONE')}
                onCancel={() => setViewMode('NONE')}
              />
            )}

            {viewMode === 'REGISTER' && (
              <RegisterForm
                handleLogin={handleLogin}
                onSuccess={() => setViewMode('NONE')}
                onCancel={() => setViewMode('NONE')}
              />
            )}

            {viewMode === 'GUEST' && (
              <Paper component="form" onSubmit={handlePostComment} sx={{ p: 3, bgcolor: 'rgba(10, 5, 20, 0.85)' }}>
                <Typography variant="caption" sx={{ color: '#aaa', display: 'block', mb: 1 }}>
                  Your name will start with Guest_ followed by a unique ID (+ optional ending).
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                    Guest_xxx +
                  </Typography>
                  <TextField
                    size="small"
                    value={guestName}
                    onChange={({ target }) => setGuestName(target.value)}
                    placeholder="Optional text..."
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={newComment}
                    onChange={({ target }) => setNewComment(target.value)}
                    placeholder="Write a comment..."
                    required
                  />
                  <Button type="submit" variant="contained" color="primary" endIcon={<SendIcon />}>
                    Post
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!isPublic}
                        onChange={() => setIsPublic(!isPublic)}
                        sx={{ color: '#ff00a0', '&.Mui-checked': { color: '#ff00a0' } }}
                      />
                    }
                    label={<Typography variant="caption" sx={{ color: '#aaa' }}>Make comment private</Typography>}
                  />
                  <Button variant="text" size="small" onClick={() => setViewMode('NONE')} sx={{ color: '#aaa' }}>
                    Cancel
                  </Button>
                </Box>
              </Paper>
            )}
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Typography variant="h6" sx={{ color: '#00ffff', fontFamily: '"Orbitron", sans-serif', mb: 2 }}>
          COMMENTS//
        </Typography>

        {renderCommentThread(null, 0)}
      </Paper>
    </Container>
  )
}

export default GuestbookPage
