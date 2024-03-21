import { z } from 'zod'
import React from 'react'
import {
  Button,
  ButtonProps,
  ListItemIcon,
  MenuItem,
  MenuList,
} from '@mui/material'
import { useForkRef } from '@mui/material/utils'
import {
  AccountTree as AccountTreeIcon,
  Group as GroupIcon,
  GroupRemove as GroupRemoveIcon,
} from '@mui/icons-material'
import { GridMenu } from '@mui/x-data-grid-pro'

// Grouping types and support context
const GridGroupingTypes = z.enum(['Ungrouped', 'ByInvitee'])
type GridGroupingTypesEnum = z.infer<typeof GridGroupingTypes>
interface GridGroupingContextItems {
  selectedGridGrouping: GridGroupingTypesEnum
  setSelectedGridGrouping: (newGrouping: GridGroupingTypesEnum) => void
}
const GridGroupingContext = React.createContext<GridGroupingContextItems>({
  selectedGridGrouping: GridGroupingTypes.enum.Ungrouped,
  setSelectedGridGrouping: () => void 0,
})

export const useGridGroupingSelector = (): GridGroupingContextItems & {
  GridGroupingContextProvider: React.Provider<GridGroupingContextItems>
} => {
  const [selectedGridGrouping, setSelectedGridGrouping] =
    React.useState<GridGroupingTypesEnum>(GridGroupingTypes.enum.Ungrouped)

  return {
    selectedGridGrouping,
    setSelectedGridGrouping,
    GridGroupingContextProvider: GridGroupingContext.Provider,
  }
}

// Custom Toolbar Tool
// Cribbed from https://github.com/mui/mui-x/blob/4f0a1a15432f1f25eb43c88101657d952f12ff0b/packages/grid/x-data-grid/src/components/toolbar/GridToolbarDensitySelector.tsx
export const GridToolbarGroupingSelector = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(function GridToolbarGroupingSelector(props, ref) {
  const { onClick, ...other } = props

  // State 'n' refs
  const [open, setOpen] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const handleRef = useForkRef(ref, buttonRef)

  // React context
  const { selectedGridGrouping, setSelectedGridGrouping } =
    React.useContext(GridGroupingContext)

  const handleGroupingSelectorOpen = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setOpen(true)
    onClick?.(event)
  }

  const handleGroupingSelectorClose = () => setOpen(false)

  const handleGroupingSelectorUpdate = (newGrouping: GridGroupingTypesEnum) => {
    setSelectedGridGrouping(newGrouping)
    setOpen(false)
  }

  return (
    <>
      <Button
        ref={handleRef}
        startIcon={<GroupIcon />}
        color="primary"
        size="small"
        {...other}
        onClick={handleGroupingSelectorOpen}
      >
        {'Grouping'}
      </Button>
      <GridMenu
        open={open}
        target={buttonRef.current}
        onClickAway={handleGroupingSelectorClose}
      >
        <MenuList>
          <MenuItem
            onClick={() => handleGroupingSelectorUpdate('Ungrouped')}
            selected={selectedGridGrouping === GridGroupingTypes.enum.Ungrouped}
          >
            <ListItemIcon>
              <GroupRemoveIcon />
            </ListItemIcon>
            {'Ungrouped'}
          </MenuItem>
          <MenuItem
            onClick={() => handleGroupingSelectorUpdate('ByInvitee')}
            selected={selectedGridGrouping === GridGroupingTypes.enum.ByInvitee}
          >
            <ListItemIcon>
              <AccountTreeIcon />
            </ListItemIcon>
            {'Group By Invitee'}
          </MenuItem>
        </MenuList>
      </GridMenu>
    </>
  )
})
