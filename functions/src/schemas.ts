import { z } from 'zod'

export const StreetViewStaticReqCallBody = z.object({
  location: z.string(),
})

export const StreetViewStaticResCallBody = z.object({
  url: z.string(),
})

export const OverallRsvpDisposition = z.enum([
  'No Response',
  'Attending',
  'Regret',
])

export const FoodDisposition = z.enum([
  'Not Yet Selected',
  'Vegetarian',
  'Seafood',
  'Fowl',
])

export const LodgingOptions = z.enum([
  'Unselected/None',
  'Studio',
  'Lodge Room',
  '1 Bdrm Condo',
  '2 Bdrm Condo',
  '3 Bdrm Condo',
  '4 Bdrm Condo',
  '5 Bdrm Condo',
  '2 Bdrm House',
  '3 Bdrm House',
  '4 Bdrm House',
  '5 Bdrm House',
])

export const LodgingBooking = z.object({
  lodgingChoice: LodgingOptions,
  startDate: z.date(),
  endDate: z.date(),
})

export const InviteeRecordData = z.object({
  name: z.string(),
  addressee: z.string(),
  email: z.string().email(),
  mobile: z.string(),
  street: z.string(),
  unit: z.string().optional(),
  city: z.string(),
  state: z.string(),
  postal: z.string(),

  // Guest Stuff
  guestCount: z.number().default(2),

  // State data
  saveTheDateSent: z.boolean().default(false),
  invitationSent: z.boolean().default(false),

  overallRsvp: OverallRsvpDisposition.default('No Response'),

  lodgingBooking: LodgingBooking.optional(),
})

export const InviteeRecord = InviteeRecordData.extend({
  id: z.string(),
  // ref: z.string(),
})

export const VaxReqDisposition = z.enum([
  'Unviewed',
  'Viewed',
  'Accepted',
  'Rejected',
])
export const GuestRecordData = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  mobile: z.string(),
  inviteeId: z.string().min(1),
  eventsInvited: z.array(z.string().min(1)).default([]).optional(),
  eventsAttending: z.array(z.string().min(1)).default([]).optional(),
  eventsRegretting: z.array(z.string().min(1)).default([]).optional(),
  vaxRequirementDisposition: VaxReqDisposition.default('Unviewed'),
  dinnerChoice: FoodDisposition.default('Not Yet Selected'),
  foodRestrictions: z.string().optional(),
})

export const GuestRecord = GuestRecordData.extend({
  id: z.string(),
})

export const EventRecordData = z.object({
  name: z.string(),
  locationName: z.string(),
  location: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postal: z.string(),
  }),
  description: z.string(),
  dressCode: z.string().min(1).default('Casual'),
  startDateTime: z.date(),
  endDateTime: z.date(),

  imageUrl: z.string().optional(),
  shuttle: z.string().optional(),

  allGuestsInvited: z.boolean().default(false).optional(),
})

export const EventRecord = EventRecordData.extend({
  id: z.string(),
})
