import { isEmpty } from 'lodash'
import { z } from 'zod'
import React, { useCallback, useState } from 'react'
import { useDebounceCallback } from '@react-hook/debounce'
import {
  Card,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material'
import { CheckCircleOutline as CheckCircleOutlineIcon } from '@mui/icons-material'

import { FoodDisposition } from '../../../functions/src/schemas'
import {
  useSelectGuestFood,
  useSetGuestFoodRestrictions,
} from '../firebaseHooks'
import { renderIf } from '../../render-if'

type FoodDispositionType = z.infer<typeof FoodDisposition>

interface ChooseFoodCardProps {
  name: string
  email?: string
  guestId: string
  currentSelection: FoodDispositionType
  currentRestrictions: string | undefined
}

export const ChooseFoodCard = ({
  name,
  email,
  guestId,
  currentSelection,
  currentRestrictions,
}: ChooseFoodCardProps) => {
  // Food Selection
  const selectGuestFood = useSelectGuestFood()
  const handleSelectVeg = useCallback(() => {
    selectGuestFood(guestId, 'Vegetarian').catch((err) => console.error(err))
  }, [guestId, selectGuestFood])
  const handleSelectSeafood = useCallback(() => {
    selectGuestFood(guestId, 'Seafood').catch((err) => console.error(err))
  }, [guestId, selectGuestFood])
  const handleSelectMeat = useCallback(() => {
    selectGuestFood(guestId, 'Fowl').catch((err) => console.error(err))
  }, [guestId, selectGuestFood])

  const seafoodSelected = currentSelection === 'Seafood'
  const vegSelected = currentSelection === 'Vegetarian'
  const meatSelected = currentSelection === 'Fowl'

  // Dietary Restrictions
  const [dietaryRestrictions, setDietaryRestrictions] = useState<
    string | undefined
  >(currentRestrictions)
  const [isRestrictionSaving, setRestrictionSaving] = useState<boolean>(false)
  const setGuestFoodRestrictionsAsync = useSetGuestFoodRestrictions()
  const setGuestFoodRestrictionsSync = useCallback(
    (guestId: string, foodRestrictions: string | undefined) => {
      setGuestFoodRestrictionsAsync(guestId, foodRestrictions)
        .catch((err) => console.error(err))
        .finally(() => setRestrictionSaving(false))
    },
    [setGuestFoodRestrictionsAsync]
  )
  const setGuestFoodRestrictions = useDebounceCallback(
    setGuestFoodRestrictionsSync,
    1200
  )
  const handleDietaryRestrictionsChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value
      const saveableValue = isEmpty(rawValue) ? undefined : rawValue

      setDietaryRestrictions(saveableValue)
      setRestrictionSaving(true)
      setGuestFoodRestrictions(guestId, saveableValue)
    },
    [guestId, setGuestFoodRestrictions]
  )
  const restrictionsAreSaved = currentRestrictions === dietaryRestrictions

  return (
    <Card
      sx={{
        p: 2,
        m: 2,
        minWidth: 240,
      }}
    >
      <Typography variant="h3">{name}</Typography>
      {renderIf(email !== void 0)(() => (
        <Typography variant="body1">{email}</Typography>
      ))}
      <Typography variant="h4" sx={{ mb: 2 }}>
        {'Select Dinner'}
      </Typography>
      <List disablePadding sx={{ mt: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            dense
            onClick={handleSelectVeg}
            selected={vegSelected}
          >
            <ListItemIcon>{vegSelected ? '✅' : '🍆'}</ListItemIcon>
            <ListItemText
              primary="Vegetarian: Eggplant au Poivre"
              primaryTypographyProps={{
                fontWeight: vegSelected ? 'bold' : 'normal',
              }}
              secondary={
                <>
                  <Typography variant="body2" component="div">
                    {'Pan seared pepper-crusted eggplant'}
                  </Typography>
                  <Typography variant="body2" component="div">
                    {'Brandy cream sauce'}
                  </Typography>
                </>
              }
              secondaryTypographyProps={{
                component: 'div',
              }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            dense
            onClick={handleSelectSeafood}
            selected={seafoodSelected}
          >
            <ListItemIcon>{seafoodSelected ? '✅' : '🦀'}</ListItemIcon>
            <ListItemText
              primary="Seafood: Crab Cakes"
              primaryTypographyProps={{
                fontWeight: seafoodSelected ? 'bold' : 'normal',
              }}
              secondary={
                <Typography variant="body2">{'Lemon caper sauce'}</Typography>
              }
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            dense
            onClick={handleSelectMeat}
            selected={meatSelected}
          >
            <ListItemIcon>{meatSelected ? '✅' : '🍗'}</ListItemIcon>
            <ListItemText
              primary="Meat: Stuffed Chicken"
              primaryTypographyProps={{
                fontWeight: meatSelected ? 'bold' : 'normal',
              }}
              secondary={
                <>
                  <Typography variant="body2" component="div">
                    {'Chicken with apple, almond, and raisin stuffing'}
                  </Typography>
                  <Typography variant="body2" component="div">
                    {'Herbed supreme sauce'}
                  </Typography>
                </>
              }
              secondaryTypographyProps={{
                component: 'div',
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />
      <Grid container sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <TextField
            label="Dietary Restrictions"
            multiline
            value={dietaryRestrictions}
            onChange={handleDietaryRestrictionsChange}
            fullWidth
            InputProps={{
              endAdornment: renderIf(
                restrictionsAreSaved || isRestrictionSaving
              )(() => (
                <InputAdornment position="end">
                  {isRestrictionSaving ? (
                    <CircularProgress size={20} />
                  ) : (
                    <CheckCircleOutlineIcon color="success" />
                  )}
                </InputAdornment>
              )),
            }}
          />
        </Grid>
      </Grid>
    </Card>
  )
}
