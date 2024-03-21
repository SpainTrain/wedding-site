import { z } from 'zod'
import { useCallback } from 'react'
import { addDoc, updateDoc, deleteField } from 'firebase/firestore'

import { getGuestCollection } from '..'
import { FoodDisposition, GuestRecordData } from '../../functions/src/schemas'
import { getGuestDoc } from '../firestore'

export const useAddGuestRecordToInvitee = () =>
  useCallback(async (guestRecord: z.infer<typeof GuestRecordData>) => {
    console.log('addGuestRecordToInvitee', guestRecord)
    const parsedGuestRecord = GuestRecordData.parse(guestRecord)
    await addDoc(getGuestCollection(), parsedGuestRecord)
  }, [])

export const useSelectGuestFood = () =>
  useCallback(
    async (guestId: string, dinnerChoice: z.infer<typeof FoodDisposition>) => {
      console.log('selectGuestFood', guestId)

      const guestRef = getGuestDoc(guestId)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = { dinnerChoice }
      await updateDoc(guestRef, data)
    },
    []
  )

export const useSetGuestFoodRestrictions = () =>
  useCallback(async (guestId: string, foodRestrictions: string | undefined) => {
    console.log('setGuestFoodRestrictions', guestId, foodRestrictions)

    const guestRef = getGuestDoc(guestId)
    const data = {
      foodRestrictions:
        foodRestrictions === undefined ? deleteField() : foodRestrictions,
    }
    await updateDoc(guestRef, data)
  }, [])
