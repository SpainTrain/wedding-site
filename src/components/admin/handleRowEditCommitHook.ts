import { mapValues, Dictionary } from 'lodash'
import React from 'react'
import { GridApi, GridRowId } from '@mui/x-data-grid-pro'

import { AdminAlertData } from './AdminAlert'

type UseHandleRowEditCommitProps<T extends Dictionary<unknown>> = {
  apiRef: React.MutableRefObject<GridApi>
  setAlertData: (alert: AdminAlertData) => void
  parser: (newRowValues: unknown) => T
  updater: (id: string, newRowValues: T) => Promise<void>
}

export const useHandleRowEditCommit = <T extends Dictionary<unknown>>({
  apiRef,
  setAlertData,
  parser,
  updater,
}: UseHandleRowEditCommitProps<T>) =>
  React.useCallback(
    (id: GridRowId) => {
      // This object contains all rows that are being edited
      const model = apiRef.current.getEditRowsModel()
      const newRow = model[id] // The data that will be committed
      const newRowValues = mapValues(newRow, 'value')
      console.log('Updating Record', id, newRowValues)

      // Get the row old value before committing
      const oldRow = apiRef.current.getRow(id) as T

      const handleErr = (error: unknown) => {
        setAlertData({ children: 'Error while saving', severity: 'error' })
        console.error(error)
        // Restore the row in case of error
        if (oldRow !== null) {
          apiRef.current.updateRows([oldRow])
        }
      }

      try {
        const newRecord = parser(newRowValues)
        updater(id as string, newRecord)
          .then(() => {
            setAlertData({
              children: 'Successfully saved',
              severity: 'success',
            })
          })
          .catch(handleErr)
      } catch (error) {
        handleErr(error)
      }
    },
    [apiRef, parser, setAlertData, updater]
  )
