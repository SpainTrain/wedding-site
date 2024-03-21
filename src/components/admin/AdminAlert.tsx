import React, { useState, useCallback } from 'react'
import { Snackbar, Alert, AlertProps } from '@mui/material'

import { renderIf } from '../..'

export type AdminAlertData = Pick<AlertProps, 'children' | 'severity'> | null
export type AlertDataSetter = (a: AdminAlertData) => void

interface AdminAlertProps {
  adminAlertData: AdminAlertData
  autoHideDuration?: number
  onClose: () => void
}

/**
 * Hook helper for using the AdminAlert component
 *
 * @returns {alertData, setAlertData, handleCloseAlert}
 */
export const useAdminAlert = () => {
  const [alertData, setAlertData] = useState<AdminAlertData>(null)
  const handleCloseAlert = useCallback(() => setAlertData(null), [setAlertData])
  return {
    alertData,
    setAlertData,
    handleCloseAlert,
  }
}

export const AdminAlert = ({
  adminAlertData,
  autoHideDuration = 6000,
  onClose: handleCloseSnackbar,
}: AdminAlertProps) =>
  renderIf(adminAlertData !== null)(() => (
    <Snackbar
      open
      onClose={handleCloseSnackbar}
      autoHideDuration={autoHideDuration}
    >
      <Alert {...adminAlertData} onClose={handleCloseSnackbar} />
    </Snackbar>
  ))
