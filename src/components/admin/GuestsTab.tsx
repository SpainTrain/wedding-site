import { z } from 'zod'
import { keyBy, identity, countBy, isEmpty, map } from 'lodash'
import React, { useCallback, useMemo } from 'react'

import {
  DataGridPro,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  useGridApiRef,
} from '@mui/x-data-grid-pro'
import { Box } from '@mui/material'
import {
  AddCircleOutline as AddIcon,
  Delete as DeleteIcon,
  Login as LoginIcon,
} from '@mui/icons-material'

import {
  FoodDisposition,
  GuestRecord,
  InviteeRecord,
  VaxReqDisposition,
} from '../../../functions/src/schemas'

import { AdminAlert, useAdminAlert } from './AdminAlert'
import { useUpdateGuestTableRecord } from './firebase-hooks'
import { useHandleRowEditCommit } from './handleRowEditCommitHook'
import { AddGuestDialog, useAddGuestDialog } from './AddGuestFormDialog'
import {
  ConfirmRemoveGuestDialog,
  useConfirmRemoveGuestDialog,
} from './ConfirmRemoveGuestDialog'
import {
  GridToolbarGroupingSelector,
  useGridGroupingSelector,
} from './GridToolbarGroupingSelector'

type InviteeRecordType = z.infer<typeof InviteeRecord>
const GuestGridRow = GuestRecord.extend({
  inviteeName: InviteeRecord.shape.name,
  inviteeRsvp: InviteeRecord.shape.overallRsvp,
})
type GuestGridRowType = z.infer<typeof GuestGridRow>

const CustomToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarColumnsButton />
    <GridToolbarFilterButton />
    <GridToolbarDensitySelector />
    <GridToolbarExport />
    <GridToolbarGroupingSelector />
  </GridToolbarContainer>
)

interface GuestsTabProps {
  guestRecords: ReadonlyArray<z.infer<typeof GuestRecord>>
  inviteeRecords: ReadonlyArray<InviteeRecordType>
  loading: boolean
  error: string | void
}

export const GuestsTab = ({
  loading,
  error,
  guestRecords,
  inviteeRecords,
}: GuestsTabProps) => {
  // AdminAlert
  const { alertData, setAlertData, handleCloseAlert } = useAdminAlert()

  // GridToolbarGroupingSelector
  const {
    GridGroupingContextProvider,
    selectedGridGrouping,
    setSelectedGridGrouping,
  } = useGridGroupingSelector()

  // Firebase update hook
  const updateGuestTableRecord = useUpdateGuestTableRecord()

  // Constant lookup invitee dictionary (and helpers)
  const inviteesById = useMemo(
    () => keyBy(inviteeRecords, 'id'),
    [inviteeRecords]
  )

  // Create grid rows with derived columns
  const guestGridRows: ReadonlyArray<GuestGridRowType> = useMemo(
    () =>
      map(guestRecords, (g) => ({
        ...g,
        inviteeName: inviteesById[g.inviteeId]?.name ?? 'UNKNOWN (ERROR)',
        inviteeRsvp: inviteesById[g.inviteeId]?.overallRsvp ?? 'No Response',
      })),
    [guestRecords, inviteesById]
  )

  const inviteeGuestCount = useMemo(
    () => countBy(guestRecords, 'inviteeId'),
    [guestRecords]
  )
  const getGuestCountForInvitee = useCallback(
    (id: string): number => inviteeGuestCount[id] ?? 0,
    [inviteeGuestCount]
  )
  const getGuestMaxForInvitee = useCallback(
    (id: string) => inviteesById[id]?.guestCount ?? 0,
    [inviteesById]
  )
  const inviteeHasMaxGuests = useCallback(
    (id: string): boolean =>
      getGuestCountForInvitee(id) >= getGuestMaxForInvitee(id),
    [getGuestCountForInvitee, getGuestMaxForInvitee]
  )

  const isGuestAlsoInvitee = useCallback(
    (guest: z.infer<typeof GuestRecord>) =>
      guest.email === inviteesById[guest.inviteeId]?.email,
    [inviteesById]
  )

  // Add guest to invitee dialog
  const {
    handleAddGuestDialogClose,
    handleAddGuestDialogOpen,
    inviteeForAddGuestDialog,
    isAddGuestDialogOpen,
  } = useAddGuestDialog()

  // Confirmation dialog for Remove Guest action
  const {
    guestForConfirmRemove,
    handleConfirmRemoveGuestDialogClose,
    handleConfirmRemoveGuestDialogOpen,
    isConfirmRemoveGuestDialogOpen,
  } = useConfirmRemoveGuestDialog()

  // Data grid fuckery
  const apiRef = useGridApiRef()
  const handleRowEditCommit = useHandleRowEditCommit({
    apiRef,
    setAlertData,
    parser: identity,
    updater: updateGuestTableRecord,
  })

  // __HANDLERS__
  const handleAddGuest = useCallback(
    (invitee: typeof inviteeForAddGuestDialog) => () => {
      handleAddGuestDialogOpen(invitee)
    },
    [handleAddGuestDialogOpen]
  )

  const handleRemoveGuest = useCallback(
    (guestToRemove: typeof guestForConfirmRemove) => () => {
      handleConfirmRemoveGuestDialogOpen(guestToRemove)
    },
    [handleConfirmRemoveGuestDialogOpen]
  )

  // COLUMN DEFS
  const guestColumns: GridColDef[] = useMemo(
    () => [
      { field: 'id', hide: true },
      {
        field: 'firstName',
        headerName: 'First Name',
        width: 120,
        editable: true,
      },
      {
        field: 'lastName',
        headerName: 'Last Name',
        width: 150,
        editable: true,
      },
      { field: 'email', headerName: 'Email', width: 200, editable: true },
      { field: 'mobile', headerName: 'Mobile', width: 130, editable: true },
      {
        field: 'inviteeName',
        headerName: 'Invitee',
        width: 200,
        hide: selectedGridGrouping === 'ByInvitee', // TODO move to col viz mdl
      },
      {
        field: 'inviteeRsvp',
        headerName: 'Overall RSVP',
        width: 150,
      },
      {
        field: 'vaxRequirementDisposition',
        type: 'singleSelect',
        valueOptions: VaxReqDisposition.options,
        headerName: 'Vax Req',
        width: 100,
        editable: true,
      },
      {
        field: 'dinnerChoice',
        type: 'singleSelect',
        valueOptions: FoodDisposition.options,
        headerName: 'Dinner',
        width: 100,
        editable: true,
      },
      {
        field: 'actions',
        type: 'actions',
        width: 80,
        getActions: (params: GridRowParams<GuestGridRowType>) =>
          isEmpty(params.row)
            ? []
            : isGuestAlsoInvitee(params.row)
            ? [
                <GridActionsCellItem
                  key="add"
                  icon={<AddIcon />}
                  label="Add Guest"
                  color="success"
                  onClick={handleAddGuest({
                    inviteeId: params.row.inviteeId,
                    inviteeName: params.row.inviteeName,
                  })}
                  disabled={inviteeHasMaxGuests(params.row.inviteeId)}
                />,
                <GridActionsCellItem
                  key="loginAsGuest"
                  icon={<LoginIcon />}
                  label="View As Guest"
                  onClick={() => {
                    window.open(`/admin/guest/${params.id}`, '_blank')
                  }}
                />,
              ]
            : [
                <GridActionsCellItem
                  key="delete"
                  icon={<DeleteIcon />}
                  label="Remove Guest"
                  color="error"
                  onClick={handleRemoveGuest({
                    guestId: params.id as string,
                    guestFirstName: params.row.firstName,
                    guestLastName: params.row.lastName,
                  })}
                />,
                <GridActionsCellItem
                  key="loginAsGuest"
                  icon={<LoginIcon />}
                  label="View As Guest"
                  onClick={() => {
                    window.open(`/admin/guest/${params.id}`, '_blank')
                  }}
                />,
              ],
      },
    ],
    [
      handleAddGuest,
      handleRemoveGuest,
      inviteeHasMaxGuests,
      isGuestAlsoInvitee,
      selectedGridGrouping,
    ]
  )

  return (
    <GridGroupingContextProvider
      value={{ selectedGridGrouping, setSelectedGridGrouping }}
    >
      <Box sx={{ height: '87vh' }}>
        <DataGridPro
          apiRef={apiRef}
          loading={loading}
          density="compact"
          editMode="row"
          error={error}
          rows={guestGridRows}
          columns={guestColumns}
          pagination={false}
          onRowEditCommit={handleRowEditCommit}
          components={{
            Toolbar: CustomToolbar,
          }}
          treeData={selectedGridGrouping === 'ByInvitee'}
          getTreeDataPath={(row: unknown) => {
            const guestRow = GuestGridRow.parse(row)

            return [
              guestRow.inviteeName,
              `${guestRow.firstName} ${guestRow.lastName}`,
            ]
          }}
        />
        <AdminAlert adminAlertData={alertData} onClose={handleCloseAlert} />
      </Box>
      <AddGuestDialog
        onClose={handleAddGuestDialogClose}
        open={isAddGuestDialogOpen}
        invitee={inviteeForAddGuestDialog}
      />
      <ConfirmRemoveGuestDialog
        onClose={handleConfirmRemoveGuestDialogClose}
        open={isConfirmRemoveGuestDialogOpen}
        guestToRemove={guestForConfirmRemove}
      />
    </GridGroupingContextProvider>
  )
}
