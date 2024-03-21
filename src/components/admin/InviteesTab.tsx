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

import {
  InviteeRecord,
  OverallRsvpDisposition,
} from '../../../functions/src/schemas'
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

interface InviteesTabProps {
  inviteeRecords: ReadonlyArray<z.infer<typeof InviteeRecord>>
  loading: boolean
  error: string | void
}

export const InviteesTab = ({
  loading,
  error,
  inviteeRecords,
}: InviteesTabProps) => {
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
  const inviteeColumns: GridColDef[] = [
    { field: 'id', hide: true },
    { field: 'name', headerName: 'Name', width: 160, editable: true },
    { field: 'email', headerName: 'Email', width: 200, editable: true },
    { field: 'mobile', headerName: 'Mobile', width: 130, editable: true },
    {
      field: 'guestCount',
      headerName: 'Guests',
      width: 60,
      type: 'number',
      editable: true,
    },
    {
      field: 'overallRsvp',
      headerName: 'RSVP',
      type: 'singleSelect',
      valueOptions: OverallRsvpDisposition.options,
      editable: true,
    },
    {
      field: 'street',
      headerName: 'Street',
      width: 200,
      editable: true,
    },
    { field: 'unit', headerName: 'Unit', width: 130, editable: true },
    { field: 'city', headerName: 'City', width: 130, editable: true },
    { field: 'state', headerName: 'State', width: 60, editable: true },
    { field: 'postal', headerName: 'Postal', width: 70, editable: true },

    { field: 'saveTheDateSent', headerName: 'STD Sent', type: 'boolean' },
    { field: 'invitationSent', headerName: 'Invite Sent', type: 'boolean' },
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
        columns={inviteeColumns}
        pagination={false}
        onRowEditCommit={handleRowEditCommit}
        components={{
          Toolbar: CustomToolbar,
        }}
        initialState={{
          columns: {
            columnVisibilityModel: {
              street: false,
              unit: false,
              city: false,
              state: false,
              postal: false,
              saveTheDateSent: false,
              invitationSent: false,
            },
          },
        }}
      />
      <AdminAlert adminAlertData={alertData} onClose={handleCloseAlert} />
    </Box>
  )
}
