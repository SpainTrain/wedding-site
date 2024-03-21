import {
  Alert,
  Backdrop,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material'

import { renderIf } from '../../render-if'
import { GuestError } from './GuestError'

interface ContentAreaMessageProps {
  headingMessage: string

  error?: GuestError
  loading?: boolean
  showQuestionPrompt?: boolean

  children?: React.ReactNode
}

/**
 *
 * Used to show a static message to the guest that fills the main content area.
 * Useful for errors, edge cases, etc.
 */
export const ContentAreaMessage = ({
  headingMessage,
  error,
  loading = false,
  showQuestionPrompt = false,
  children,
}: ContentAreaMessageProps) => (
  <Box
    sx={{
      height: '87vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Backdrop open={loading}>
      <CircularProgress />
    </Backdrop>
    <Card raised sx={{ px: 4, py: 2, mt: 4 }}>
      <CardContent>
        <Box sx={{ pb: 4 }}>
          <Typography variant="h1">{headingMessage}</Typography>
        </Box>
        <Divider />
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          {renderIf(showQuestionPrompt)(() => (
            <Typography>{'Questions?'}</Typography>
          ))}
          <Typography>
            {'Email '}
            <a href="mailto:us@mike-and-holly.com">{'us@mike-and-holly.com'}</a>
          </Typography>
          {error === undefined ? null : (
            <Alert
              severity="error"
              sx={{ mt: 2 }}
            >{`${error.code} - ${error.name}: ${error.message}`}</Alert>
          )}
        </Box>
      </CardContent>
    </Card>
    <Box sx={{ mt: 4 }}>{children}</Box>
  </Box>
)
