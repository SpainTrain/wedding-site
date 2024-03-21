import { z } from 'zod'

import { InviteeRecordData } from './schemas'

const TFAnswerName = z.object({
  type: z.literal('text'),
  text: z.string(),
  field: z.object({
    id: z.string(),
    type: z.literal('short_text'),
    ref: z.string(),
  }),
})
const TFAnswerEmail = z.object({
  type: z.literal('email'),
  email: z.string().email(),
  field: z.object({
    id: z.string(),
    type: z.literal('email'),
    ref: z.string(),
  }),
})
const TFAnswerPhone = z.object({
  type: z.literal('phone_number'),
  phone_number: z.string(),
  field: z.object({
    id: z.string(),
    type: z.literal('phone_number'),
    ref: z.string(),
  }),
})
const TFAnswerStreet = z.object({
  type: z.literal('text'),
  text: z.string(),
  field: z.object({
    id: z.string(),
    type: z.literal('short_text'),
    ref: z.string(),
  }),
})
const TFAnswerUnit = z.object({
  type: z.literal('text'),
  text: z.string(),
  field: z.object({
    id: z.string(),
    type: z.literal('short_text'),
    ref: z.string(),
  }),
})
const TFAnswerCity = z.object({
  type: z.literal('text'),
  text: z.string(),
  field: z.object({
    id: z.string(),
    type: z.literal('short_text'),
    ref: z.string(),
  }),
})
const TFAnswerState = z.object({
  type: z.literal('text'),
  text: z.string(),
  field: z.object({
    id: z.string(),
    type: z.literal('short_text'),
    ref: z.string(),
  }),
})
const TFAnswerPostal = z.object({
  type: z.literal('text'),
  text: z.string(),
  field: z.object({
    id: z.string(),
    type: z.literal('short_text'),
    ref: z.string(),
  }),
})

const TFAnswers = z.union([
  z.tuple([
    TFAnswerName,
    TFAnswerEmail,
    TFAnswerPhone,
    TFAnswerStreet,
    TFAnswerUnit,
    TFAnswerCity,
    TFAnswerState,
    TFAnswerPostal,
  ]),
  z.tuple([
    TFAnswerName,
    TFAnswerEmail,
    TFAnswerPhone,
    TFAnswerStreet,
    TFAnswerCity,
    TFAnswerState,
    TFAnswerPostal,
  ]),
])

const TypeformResponse = z.object({
  event_id: z.string(),
  event_type: z.literal('form_response'),
  form_response: z.object({
    form_id: z.string(),
    token: z.string(),
    landed_at: z.string(),
    submitted_at: z.string(),
    definition: z.object({
      id: z.string(),
      title: z.literal('Wedding Guest Info Request'),
      fields: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          type: z.string(),
          ref: z.string(),
          properties: z.object({}),
        })
      ),
    }),
    answers: TFAnswers,
  }),
})

export const parseTypeformRes = (
  typeformRes: unknown
): z.infer<typeof InviteeRecordData> => {
  const parsedTypeform = TypeformResponse.parse(typeformRes)
  const answers = parsedTypeform.form_response.answers

  const inviteeRecord: z.infer<typeof InviteeRecordData> =
    answers[7] === undefined
      ? {
          name: answers[0].text,
          addressee: answers[0].text,
          email: answers[1].email,
          mobile: answers[2].phone_number,
          street: answers[3].text,
          city: answers[4].text,
          state: answers[5].text,
          postal: answers[6].text,
          invitationSent: false,
          saveTheDateSent: false,
          guestCount: 2,
          overallRsvp: 'No Response',
        }
      : {
          name: answers[0].text,
          addressee: answers[0].text,
          email: answers[1].email,
          mobile: answers[2].phone_number,
          street: answers[3].text,
          unit: answers[4].text,
          city: answers[5].text,
          state: answers[6].text,
          postal: answers[7].text,
          invitationSent: false,
          saveTheDateSent: false,
          guestCount: 2,
          overallRsvp: 'No Response',
        }

  return inviteeRecord
}
