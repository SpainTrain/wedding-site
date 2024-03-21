import { z } from 'zod'
import { identity } from 'lodash'
import React from 'react'

import {
  DataGridPro,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  useGridApiRef,
} from '@mui/x-data-grid-pro'
import { Box } from '@mui/material'
// import { Add as AddIcon } from '@mui/icons-material'

import { InviteeRecord } from '../../../functions/src/schemas'
import { AdminAlert, useAdminAlert } from './AdminAlert'
import { useUpdateInviteeTableRecord } from './firebase-hooks'
import { useHandleRowEditCommit } from './handleRowEditCommitHook'

const CustomToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarColumnsButton />
    <GridToolbarFilterButton />
    <GridToolbarDensitySelector />
    <GridToolbarExport />
  </GridToolbarContainer>
)

interface AddresseesTabProps {
  inviteeRecords: ReadonlyArray<z.infer<typeof InviteeRecord>>
  loading: boolean
  error: string | void
}

export const AddresseesTab = ({
  loading,
  error,
  inviteeRecords,
}: AddresseesTabProps) => {
  // AdminAlert
  const { alertData, setAlertData, handleCloseAlert } = useAdminAlert()

  // Firebase update hook
  const updateInviteeTableRecord = useUpdateInviteeTableRecord()

  // Data grid fuckery
  const apiRef = useGridApiRef()
  const handleRowEditCommit = useHandleRowEditCommit({
    apiRef,
    setAlertData,
    parser: identity,
    updater: updateInviteeTableRecord,
  })

  // COLUMN DEFS
  const addresseeColumns: GridColDef[] = [
    { field: 'id', hide: true },
    { field: 'name', headerName: 'Name', width: 240, editable: true },
    { field: 'addressee', headerName: 'Addressee', width: 480, editable: true },
    { field: 'saveTheDateSent', headerName: 'STD Sent', type: 'boolean' },
  ]

  return (
    <Box sx={{ height: '87vh' }}>
      <DataGridPro
        apiRef={apiRef}
        loading={loading}
        density="compact"
        editMode="row"
        error={error}
        rows={inviteeRecords}
        columns={addresseeColumns}
        pagination={false}
        onRowEditCommit={handleRowEditCommit}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
      <AdminAlert adminAlertData={alertData} onClose={handleCloseAlert} />
    </Box>
  )
}
