interface AccountCreateValidation {
  accountType?: "tod" | "todo" | null;
  featured?: boolean | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  imageId?: string | null;
  username?: string | null;
  phone?: string | null;
  title?: string | null;
  company?: string | null;
  bio?: string | null;
  website?: string | null;
  video?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  tikTok?: string | null;
  linkedIn?: string | null;
  youtube?: string | null;
  discord?: string | null;
  dietaryRestrictions?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip?: string | null;
  internalRefId?: string | null;
}

interface AccountUpdateValidation {
  accountType?: "todo" | "todo" | string | null; // Assuming "todo" | "todo" was a placeholder for actual enum values
  featured?: boolean | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  imageId?: string | null;
  username?: string | null;
  phone?: string | null;
  title?: string | null;
  company?: string | null;
  bio?: string | null;
  website?: string | null;
  video?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  tikTok?: string | null;
  linkedIn?: string | null;
  youtube?: string | null;
  discord?: string | null;
  dietaryRestrictions?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip?: string | null;
  internalRefId?: string | null;
}

interface ActivityCreateValidation {
  message?: string | null;
  html?: string | null;
  text?: string | null;
  giphyId?: string | null;
  imageId?: string | null;
  eventId?: string | null;
  groupId?: string | null;
  contentId?: string | null;
  commentedId?: string | null;
  videoId?: string | null;
}

interface ActivityUpdateValidation {
  message?: string | null;
  html?: string | null;
  text?: string | null;
  giphyId?: string | null;
  imageId?: string | null;
  eventId?: string | null;
  groupId?: string | null;
  contentId?: string | null;
  commentedId?: string | null;
  videoId?: string | null;
}

interface AdvertisementCreateValidation {
  type?: "todo" | "todo" | string | null;
  link?: string | null;
  title?: string | null;
  description?: string | null;
  imageId?: string | null;
  startDate?: string | null; // Assuming date is represented as a string
  endDate?: string | null; // Assuming date is represented as a string
  weight?: number | null;
  accountId?: string | null;
  eventId?: string | null;
  eventOnly?: boolean | null;
}

interface AdvertisementUpdateValidation {
  type?: "todo" | "todo" | string | null;
  link?: string | null;
  title?: string | null;
  description?: string | null;
  imageId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  weight?: number | string | null;
  accountId?: string | null;
  eventId?: string | null;
  eventOnly?: boolean | null;
}

interface AnnouncementCreateValidation {
  userId?: string | null;
  creatorId?: string | null;
  verifiedAccounts?: boolean | null;
  eventId?: string | null;
  groupId?: string | null;
  accountId?: string | null;
  ticketId?: string | null;
  sponsorshipLevelId?: string | null;
  title?: string | null;
  slug?: string | null; // Assuming validSlug is a function for validation and not relevant to TypeScript interface
  message?: string | null;
  html?: string | null;
  email?: boolean | null;
  sms?: boolean | null;
  push?: boolean | null;
}

interface BenefitCreateValidation {
  link?: string | null;
  title?: string | null;
  slug?: string | null; // Assuming validSlug is a function for validation and not relevant to TypeScript interface
  description?: string | null;
  imageId?: string | null;
  startDate?: string | null; // Assuming dates are represented as strings
  endDate?: string | null;
  priority?: number | string | null;
  managerId?: string | null;
  eventId?: string | null;
  eventOnly?: boolean | null;
}

interface BenefitTranslationUpdateValidation {
  title?: string | null;
  description?: string | null;
}

interface BenefitUpdateValidation {
  link?: string | null;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  imageId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  priority?: number | string | null;
  managerId?: string | null;
  eventId?: string | null;
  eventOnly?: boolean | null;
}

interface ChannelCollectionCreateValidation {
  name?: string | null;
  description?: string | null;
}

interface ChannelCollectionTranslationUpdateValidation {
  name?: string | null;
  description?: string | null;
}

interface ChannelCollectionUpdateValidation {
  name?: string | null;
  description?: string | null;
}

interface ChannelContentInterestCreateValidation {
  name?: string | null;
}

interface ChannelCreateValidation {
  name?: string | null;
  slug?: string | null; // Assuming validSlug is a function for validation and not relevant to TypeScript interface
  description?: string | null;
  priority?: number | string | null;
  visible?: boolean | null;
  imageId?: string | null;
  format?: "todo" | "todo" | string | null; // Placeholder for actual enum values
  externalUrl?: string | null;
  appleUrl?: string | null;
  spotifyUrl?: string | null;
  googleUrl?: string | null;
  youtubeUrl?: string | null;
  groupId?: string | null;
}

interface ChannelInterestCreateValidation {
  name?: string | null;
}

interface ChannelSubscriberUpdateValidation {
  contentEmailNotification?: boolean | null;
  contentPushNotification?: boolean | null;
}

interface ChannelTranslationUpdateValidation {
  name?: string | null;
  description?: string | null;
}

export const CHANNEL_UPDATE_VALIDATION = Joi.object({}).keys({
  name: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  description: OPTIONAL_STRING,
  priority: OPTIONAL_NUMBER,
  visible: OPTIONAL_BOOLEAN,
  imageId: OPTIONAL_STRING,
  format: OPTIONAL_STRING.valid("article", "podcast", "video"),
  externalUrl: OPTIONAL_STRING.uri(),
  appleUrl: OPTIONAL_STRING.uri(),
  spotifyUrl: OPTIONAL_STRING.uri(),
  googleUrl: OPTIONAL_STRING.uri(),
  youtubeUrl: OPTIONAL_STRING.uri(),
  groupId: OPTIONAL_STRING,
});

export const CONTENT_CREATE_VALIDATION = Joi.object({}).keys({
  type: OPTIONAL_STRING.valid(...Object.keys(ContentType)),
  published: OPTIONAL_DATE,
  channelId: OPTIONAL_STRING,
  featured: OPTIONAL_BOOLEAN,
  visible: OPTIONAL_BOOLEAN,
  title: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  description: OPTIONAL_STRING,
  duration: OPTIONAL_STRING,
  body: OPTIONAL_STRING,
  imageUrl: OPTIONAL_STRING,
  audioUrl: OPTIONAL_STRING,
  videoUrl: OPTIONAL_STRING,
  externalUrl: OPTIONAL_STRING.uri(),
  appleUrl: OPTIONAL_STRING.uri(),
  spotifyUrl: OPTIONAL_STRING.uri(),
  googleUrl: OPTIONAL_STRING.uri(),
  youtubeUrl: OPTIONAL_STRING.uri(),
});

export const CONTENT_GUEST_CREATE_VALIDATION = Joi.object().keys({
  type: OPTIONAL_STRING.valid(...Object.keys(ContentGuestType)),
  slug: OPTIONAL_STRING.custom(validSlug),
  name: OPTIONAL_STRING,
  title: OPTIONAL_STRING,
  bio: OPTIONAL_STRING,
  company: OPTIONAL_STRING,
  companyLink: OPTIONAL_STRING.uri(),
  companyBio: OPTIONAL_STRING,
  accountId: OPTIONAL_STRING,
  imageId: OPTIONAL_STRING,
  website: OPTIONAL_STRING.uri(),
  facebook: OPTIONAL_STRING.uri(),
  twitter: OPTIONAL_STRING.uri(),
  instagram: OPTIONAL_STRING.uri(),
  linkedIn: OPTIONAL_STRING.uri(),
  tikTok: OPTIONAL_STRING.uri(),
  youtube: OPTIONAL_STRING.uri(),
  discord: OPTIONAL_STRING.uri(),
});

export const CONTENT_GUEST_TRANSLATION_UPDATE_VALIDATION = Joi.object().keys({
  title: OPTIONAL_STRING,
  bio: OPTIONAL_STRING,
  companyBio: OPTIONAL_STRING,
});

export const CONTENT_GUEST_UPDATE_VALIDATION = Joi.object().keys({
  type: OPTIONAL_STRING.valid(...Object.keys(ContentGuestType)),
  slug: OPTIONAL_STRING.custom(validSlug),
  name: OPTIONAL_STRING,
  title: OPTIONAL_STRING,
  bio: OPTIONAL_STRING,
  company: OPTIONAL_STRING,
  companyLink: OPTIONAL_STRING.uri(),
  companyBio: OPTIONAL_STRING,
  accountId: OPTIONAL_STRING,
  imageId: OPTIONAL_STRING,
  website: OPTIONAL_STRING.uri(),
  facebook: OPTIONAL_STRING.uri(),
  twitter: OPTIONAL_STRING.uri(),
  instagram: OPTIONAL_STRING.uri(),
  linkedIn: OPTIONAL_STRING.uri(),
  tikTok: OPTIONAL_STRING.uri(),
  youtube: OPTIONAL_STRING.uri(),
  discord: OPTIONAL_STRING.uri(),
});

export const CONTENT_TRANSLATION_UPDATE_VALIDATION = Joi.object().keys({
  title: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  body: OPTIONAL_STRING,
});

export const CONTENT_UPDATE_VALIDATION = Joi.object({}).keys({
  type: OPTIONAL_STRING.valid(...Object.keys(ContentType)),
  published: OPTIONAL_DATE,
  channelId: OPTIONAL_STRING,
  featured: OPTIONAL_BOOLEAN,
  visible: OPTIONAL_BOOLEAN,
  title: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  description: OPTIONAL_STRING,
  duration: OPTIONAL_STRING,
  body: OPTIONAL_STRING,
  imageUrl: OPTIONAL_STRING,
  audioUrl: OPTIONAL_STRING,
  videoUrl: OPTIONAL_STRING,
  externalUrl: OPTIONAL_STRING.uri(),
  appleUrl: OPTIONAL_STRING.uri(),
  spotifyUrl: OPTIONAL_STRING.uri(),
  googleUrl: OPTIONAL_STRING.uri(),
  youtubeUrl: OPTIONAL_STRING.uri(),
});

//EVENT ACTIVATION
export const EVENT_ACTIVATION_CREATE_VALIDATION = Joi.object().keys({
  imageId: OPTIONAL_STRING,
  managerId: OPTIONAL_STRING,
  name: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  shortDescription: OPTIONAL_STRING,
  longDescription: OPTIONAL_STRING,
  maxPoints: OPTIONAL_NUMBER.min(1),
  startAfter: OPTIONAL_DATE,
  protected: OPTIONAL_BOOLEAN,
  protectionCode: OPTIONAL_NUMBER,
});

//EVENT ACTIVATION TRANSLATION
export const EVENT_ACTIVATION_UPDATE_TRANSLATION_VALIDATION = Joi.object().keys(
  {
    name: OPTIONAL_STRING,
    shortDescription: OPTIONAL_STRING,
    longDescription: OPTIONAL_STRING,
  }
);

export const EVENT_ACTIVATION_UPDATE_VALIDATION = Joi.object().keys({
  imageId: OPTIONAL_STRING,
  managerId: OPTIONAL_STRING,
  name: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  shortDescription: OPTIONAL_STRING,
  longDescription: OPTIONAL_STRING,
  maxPoints: OPTIONAL_NUMBER.min(1),
  startAfter: OPTIONAL_DATE,
  protected: OPTIONAL_BOOLEAN,
  protectionCode: OPTIONAL_NUMBER,
});

//EVENT ADDON
export const EVENT_ADD_ON_CREATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  shortDescription: OPTIONAL_STRING.max(255),
  longDescription: OPTIONAL_STRING.allow(""),
  price: OPTIONAL_PRICE,
  supply: OPTIONAL_NUMBER,
  sortOrder: OPTIONAL_NUMBER.min(1),
  imageId: OPTIONAL_STRING,
  reservationStart: OPTIONAL_DATE,
  minReservationStart: OPTIONAL_DATE.max(Joi.ref("reservationStart")).messages({
    "date.max": '"Min Reservation Start" must be before "reservationStart"',
  }),
  maxReservationStart: OPTIONAL_DATE.min(Joi.ref("reservationStart")).messages({
    "date.min": '"Max Reservation Start" must be after "reservationStart"',
  }),
  reservationEnd: OPTIONAL_DATE.greater(Joi.ref("reservationStart")).messages({
    "date.greater": '"Reservation End" must be after "reservationStart"',
  }),
  minReservationEnd: OPTIONAL_DATE.max(Joi.ref("reservationEnd")).messages({
    "date.max": '"Min Reservation End" must be before "reservationEnd"',
  }),
  maxReservationEnd: OPTIONAL_DATE.min(Joi.ref("reservationEnd")).messages({
    "date.min": '"Max Reservation End" must be after "reservationEnd"',
  }),
});

//EVENT ADDON TRANSLATION
export const EVENT_ADD_ON_UPDATE_TRANSLATION_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  shortDescription: OPTIONAL_STRING,
  longDescription: OPTIONAL_STRING,
});

export const EVENT_ADD_ON_UPDATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  shortDescription: OPTIONAL_STRING.max(255),
  longDescription: OPTIONAL_STRING.allow(""),
  price: OPTIONAL_PRICE,
  supply: OPTIONAL_NUMBER,
  sortOrder: OPTIONAL_NUMBER.min(1),
  imageId: OPTIONAL_STRING,
  reservationStart: OPTIONAL_DATE,
  minReservationStart: OPTIONAL_DATE.max(Joi.ref("reservationStart")).messages({
    "date.max": '"Min Reservation Start" must be before "reservationStart"',
  }),
  maxReservationStart: OPTIONAL_DATE.min(Joi.ref("reservationStart")).messages({
    "date.min": '"Max Reservation Start" must be after "reservationStart"',
  }),
  reservationEnd: OPTIONAL_DATE.greater(Joi.ref("reservationStart")).messages({
    "date.greater": '"Reservation End" must be after "reservationStart"',
  }),
  minReservationEnd: OPTIONAL_DATE.max(Joi.ref("reservationEnd")).messages({
    "date.max": '"Min Reservation End" must be before "reservationEnd"',
  }),
  maxReservationEnd: OPTIONAL_DATE.min(Joi.ref("reservationEnd")).messages({
    "date.min": '"Max Reservation End" must be after "reservationEnd"',
  }),
});

//EVENT BADGE FIELD
export const EVENT_BADGE_FIELD_UPDATE_VALIDATION = Joi.object({
  type: OPTIONAL_STRING.valid(...Object.values(BadgeFieldType)),
  lookup: OPTIONAL_STRING,
  maxLength: OPTIONAL_NUMBER,
  defaultValue: OPTIONAL_STRING,
  transformation: OPTIONAL_STRING.valid(
    ...Object.values(BadgeFieldTransfromation)
  ),
  sortOrder: OPTIONAL_NUMBER.min(1),
});

//EVENT COUPONS
export const EVENT_CREATE_COUPON_VALIDATION = Joi.object().keys({
  code: Joi.string().optional().uppercase().replace(/ /g, "_"),
  description: Joi.string().optional().max(255).allow("", null),
  active: OPTIONAL_BOOLEAN,
  startDate: OPTIONAL_DATE,
  endDate: OPTIONAL_DATE.min(Joi.ref("startDate")).messages({
    "date.min": "End date must be after start date",
  }),
  discountAmount: Joi.alternatives()
    .try(
      Joi.string()
        .valid("")
        .custom(() => null),
      Joi.number().integer()
    )
    .optional(),
  discountPercent: Joi.alternatives()
    .try(
      Joi.string()
        .valid("")
        .custom(() => null),
      Joi.number().integer()
    )
    .optional(),
  quantityMin: Joi.alternatives()
    .try(
      Joi.string()
        .valid("")
        .custom(() => 1),
      Joi.number().integer()
    )
    .optional(),
  quantityMax: Joi.alternatives()
    .try(
      Joi.string()
        .valid("")
        .custom(() => null),
      Joi.number().integer().allow(null)
    )
    .optional(),
  amountMin: Joi.alternatives()
    .try(
      Joi.string()
        .valid("")
        .custom(() => null),
      Joi.number().integer()
    )
    .optional(),
  amountMax: Joi.alternatives()
    .try(
      Joi.string()
        .valid("")
        .custom(() => null),
      Joi.number().integer().allow(null)
    )
    .optional(),
  useLimit: Joi.alternatives()
    .try(
      Joi.string()
        .valid("")
        .custom(() => null),
      Joi.number().integer().allow(null)
    )
    .optional(),
  emailDomains: OPTIONAL_STRING.pattern(
    /^([a-zA-Z0-9]*\.[a-zA-Z0-9]+)(,[a-zA-Z0-9]*\.[a-zA-Z0-9]+)*$/
  ).message("emailDomains must be a comma-separated list"),
  ticketId: OPTIONAL_STRING,
  managerId: OPTIONAL_STRING,
});

//EVENT FAQ SECTION QUESTIONS
export const EVENT_CREATE_FAQ_SECTION_QUESTIONS_VALIDATION = Joi.object().keys({
  question: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  answer: OPTIONAL_STRING,
  priority: OPTIONAL_NUMBER.min(1),
  visible: OPTIONAL_BOOLEAN,
});

//EVENT FAQ SECTIONS
export const EVENT_CREATE_FAQ_SECTION_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  priority: OPTIONAL_NUMBER.min(1),
});

//EVENT

export const EVENT_CREATE_VALIDATION = Joi.object().keys({
  featured: OPTIONAL_BOOLEAN,
  visible: OPTIONAL_BOOLEAN,
  name: OPTIONAL_STRING,
  eventType: OPTIONAL_STRING.valid(...Object.keys(EventType)),
  slug: OPTIONAL_STRING.custom(validSlug),
  internalRefId: OPTIONAL_STRING,
  shortDescription: OPTIONAL_STRING.max(256),
  longDescription: OPTIONAL_STRING,
  timezone: OPTIONAL_STRING.valid(...validTimezones()),
  eventStart: OPTIONAL_DATE,
  eventEnd: OPTIONAL_DATE.min(Joi.ref("eventStart")).messages({
    "date.min": "Event end date must be after event start date",
  }),
  externalUrl: OPTIONAL_STRING.uri(),
  imageId: OPTIONAL_STRING,
  venueMapId: OPTIONAL_STRING,
  venue: OPTIONAL_STRING,
  location: OPTIONAL_STRING,
  address1: OPTIONAL_STRING,
  address2: OPTIONAL_STRING,
  city: OPTIONAL_STRING,
  state: OPTIONAL_STRING.uppercase()
    .regex(/^[A-Z]{2}$/)
    .messages({
      "string.pattern.base":
        "Invalid state format. It should be a 2 letter code.",
    }),
  country: OPTIONAL_STRING.uppercase()
    .regex(/^[A-Z]{3}$/)
    .messages({
      "string.pattern.base":
        "Invalid country format. It should be a 3 letter code.",
    }),
  zip: OPTIONAL_STRING.regex(/^[0-9]{5}$/).messages({
    "string.pattern.base": "Invalid zip format. It should be a 5 digit number.",
  }),
  creatorId: OPTIONAL_STRING,
  seriesId: OPTIONAL_STRING,
  approved: OPTIONAL_BOOLEAN,
  meetingUrl: OPTIONAL_STRING.uri(),
  registration: OPTIONAL_BOOLEAN,
  registrationStart: OPTIONAL_DATE.max(Joi.ref("eventStart")).messages({
    "date.max": "Registration start date must be before event start date",
  }),
  registrationEnd: OPTIONAL_DATE.min(Joi.ref("registrationStart"))
    .max(Joi.ref("eventEnd"))
    .messages({
      "date.min": "Registration end date must be after registration start date",
      "date.max": "Registration end date must be before event end date",
    }),
  registrationLimit: Joi.alternatives().try(
    Joi.string()
      .valid("")
      .custom(() => null),
    Joi.number().integer().allow(null).optional()
  ),
  publicRegistrants: OPTIONAL_BOOLEAN,
  sessionsVisible: OPTIONAL_BOOLEAN,
  speakersVisible: OPTIONAL_BOOLEAN,
  inviteOnly: OPTIONAL_BOOLEAN,
  iosAppLink: OPTIONAL_STRING.uri(),
  androidAppLink: OPTIONAL_STRING.uri(),
  newActivityCreatorEmailNotification: OPTIONAL_BOOLEAN,
  newActivityCreatorPushNotification: OPTIONAL_BOOLEAN,
  streamReplayId: OPTIONAL_STRING,
  groupId: OPTIONAL_STRING,
  groupOnly: OPTIONAL_BOOLEAN,
});

export const EVENT_PAGE_CREATE_VALIDATION = Joi.object().keys({
  slug: OPTIONAL_STRING.custom(validSlug),
  title: OPTIONAL_STRING,
  subtitle: OPTIONAL_STRING,
  html: OPTIONAL_STRING,
  sortOrder: OPTIONAL_NUMBER.min(1),
});

export const EVENT_PAGE_TRANSLATION_UPDATE_VALIDATION = Joi.object().keys({
  title: OPTIONAL_STRING,
  subtitle: OPTIONAL_STRING,
  html: OPTIONAL_STRING,
});

export const EVENT_PAGE_UPDATE_VALIDATION = Joi.object().keys({
  slug: OPTIONAL_STRING.custom(validSlug),
  title: OPTIONAL_STRING,
  subtitle: OPTIONAL_STRING,
  html: OPTIONAL_STRING,
  sortOrder: OPTIONAL_NUMBER.min(1),
});

//RegistreationPurchases
export interface EventPurchaseCreateValidation {
  location?: string | null;
  usedAt?: Date | null;
  ticketId?: string | null;
  paid?: boolean | null;
  reservationStart?: Date | null;
  reservationEnd?: Date | null;
}

export interface EventPurchaseUpdateValidation {
  location?: string | null;
  usedAt?: Date | null;
  ticketId?: string | null;
  paid?: boolean | null;
  reservationStart?: Date | null;
  reservationEnd?: Date | null;
}

export interface EventRegistrationBypassCreateValidation {
  accountId?: string | null;
  closed?: boolean | null;
  preRegister?: boolean | null;
  postRegister?: boolean | null;
}

export interface EventRegistrationBypassUpdateValidation {
  accountId?: string | null;
  closed?: boolean | null;
  preRegister?: boolean | null;
  postRegister?: boolean | null;
}

export interface EventRegistrationSectionUpdateTranslationValidation {
  name?: string | null;
  description?: string | null;
  guestDescription?: string | null;
}

export interface EventReservationSectionCreateValidation {
  name?: string | null;
  shortDescription?: string | null;
  price?: number | null;
  sortOrder?: number | null;
  pricePerDay?: boolean | null;
  imageId?: string | null;
}

//EVENT RESERVATION SECTION LOCATION
export interface EventReservationSectionLocationCreateValidation {
  name?: string | null;
  shortDescription?: string | null;
  premium?: number | null;
  supply?: number | null;
  sortOrder?: number | null;
}

export interface EventReservationSectionLocationUpdateValidation {
  name?: string | null;
  shortDescription?: string | null;
  premium?: number | null;
  supply?: number | null;
  sortOrder?: number | null;
}

//EVENT RESERVATION SECTION TRANSLATION
export interface EventReservationSectionTranslationUpdateValidation {
  name?: string | null;
  shortDescription?: string | null;
}

export interface EventReservationSectionUpdateValidation {
  name?: string | null;
  shortDescription?: string | null;
  price?: string | null;
  sortOrder?: number | null;
  pricePerDay?: boolean | null;
  imageId?: string | null;
}

//EVENT SESSION
export interface EventSessionCreateValidation {
  name?: string | null;
  slug?: string | null;
  startTime?: Date | null;
  endTime?: Date | null;
  location?: string | null;
  description?: string | null;
  longDescription?: string | null;
  nonSession?: boolean | null;
  imageId?: string | null;
  visible?: boolean | null;
  sortOrder?: number | null;
}

//EVENT SESSION TRANSLATION
export interface EventSessionTranslationUpdateValidation {
  name?: string | null;
  description?: string | null;
  longDescription?: string | null;
}

export interface EventSessionUpdateValidation {
  name?: string | null;
  slug?: string | null;
  startTime?: Date | null;
  endTime?: Date | null;
  location?: string | null;
  description?: string | null;
  longDescription?: string | null;
  nonSession?: boolean | null;
  imageId?: string | null;
  visible?: boolean | null;
  sortOrder?: number | null;
}

//event speaker

export interface EventSpeakerCreateValidation {
  firstName?: string | null;
  lastName?: string | null;
  slug?: string | null;
  bio?: string | null;
  title?: string | null;
  company?: string | null;
  companyBio?: string | null;
  website?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  tikTok?: string | null;
  linkedIn?: string | null;
  youtube?: string | null;
  discord?: string | null;
  label?: string | null;
  isHost?: boolean | null;
  imageId?: string | null;
  priority?: number | null;
  visible?: boolean | null;
}

//EVENT SPEAKER TRANSLATION
export interface EventSpeakerTranslationUpdateValidation {
  title?: string | null;
  bio?: string | null;
}

export interface EventSpeakerUpdateValidation {
  firstName?: string | null;
  lastName?: string | null;
  slug?: string | null;
  bio?: string | null;
  title?: string | null;
  company?: string | null;
  companyBio?: string | null;
  website?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  tikTok?: string | null;
  linkedIn?: string | null;
  youtube?: string | null;
  discord?: string | null;
  label?: string | null;
  isHost?: boolean | null;
  imageId?: string | null;
  priority?: number | null;
  visible?: boolean | null;
}

export interface EventTicketTranslationUpdateValidation {
  name?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
}

export interface EventTrackTranslationUpdateValidation {
  name?: string | null;
  description?: string | null;
}

export interface EventTranslationUpdateValidation {
  name?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
}

export interface EventUpdateCouponValidation {
  code?: string | null;
  description?: string | null;
  active?: boolean | null;
  startDate?: Date | null;
  endDate?: Date | null;
  discountAmount?: number | null;
  discountPercent?: number | null;
  quantityMin?: number | null;
  quantityMax?: number | null;
  amountMin?: number | null;
  amountMax?: number | null;
  useLimit?: number | null;
  emailDomains?: string | null;
  ticketId?: string | null;
  managerId?: string | null;
}

export interface EventUpdateEmailValidation {
  body?: string | null;
  replyTo?: string | null;
}

// EVENT FAQ SECTION QUESTIONS TRANSLATION
export interface EventUpdateFaqSectionQuestionsTranslationValidation {
  question?: string | null;
  answer?: string | null;
}

export interface EventUpdateFaqSectionQuestionsValidation {
  question?: string | null;
  slug?: string | null;
  answer?: string | null;
  priority?: number | null;
  visible?: boolean | null;
}

//EVENT FAQ SECTIONS TRANSLATIONS
export interface EventUpdateFaqSectionTranslationValidation {
  name?: string | null;
}

export interface EventUpdateFaqSectionValidation {
  name?: string | null;
  slug?: string | null;
  priority?: number | null;
}

//EVENT RESERVATION SECTION LOCATION TRANSLATION
export interface EventUpdateReservationSectionLocationTranslationValidation {
  name?: string | null;
  shortDescription?: string | null;
}

export interface EventUpdateValidation {
  featured?: boolean | null;
  visible?: boolean | null;
  name?: string | null;
  eventType?: "todo" | "todo" | null;
  slug?: string | null;
  internalRefId?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
  timezone?: string | null;
  eventStart?: Date | null;
  eventEnd?: Date | null;
  externalUrl?: string | null;
  imageId?: string | null;
  venueMapId?: string | null;
  venue?: string | null;
  location?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip?: string | null;
  creatorId?: string | null;
  seriesId?: string | null;
  approved?: boolean | null;
  meetingUrl?: string | null;
  registration?: boolean | null;
  registrationStart?: Date | null;
  registrationEnd?: Date | null;
  registrationLimit?: number | null;
  publicRegistrants?: boolean | null;
  sessionsVisible?: boolean | null;
  speakersVisible?: boolean | null;
  inviteOnly?: boolean | null;
  iosAppLink?: string | null;
  androidAppLink?: string | null;
  newActivityCreatorEmailNotification?: boolean | null;
  newActivityCreatorPushNotification?: boolean | null;
  streamReplayId?: string | null;
  groupId?: string | null;
  groupOnly?: boolean | null;
}

export interface GroupCreateValidation {
  featured?: boolean | null;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  active?: boolean | null;
  access?: "public" | "private" | null;
  imageId?: string | null;
  externalUrl?: string | null;
}

export interface GroupMembershipUpdateValidation {
  announcementEmailNotification?: boolean | null;
  announcementPushNotification?: boolean | null;
  activityEmailNotification?: boolean | null;
  activityPushNotification?: boolean | null;
  eventEmailNotification?: boolean | null;
  eventPushNotification?: boolean | null;
  chatPushNotification?: boolean | null;
}

export interface GroupTranslationUpdateValidation {
  name?: string | null;
  description?: string | null;
}

export interface GroupUpdateValidation {
  featured?: boolean | null;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  active?: boolean | null;
  access?: "public" | "private" | null;
  imageId?: string | null;
  externalUrl?: string | null;
}

export interface InterestCreateValidation {
  name?: string | null;
  imageId?: string | null;
  featured?: boolean | null;
}

export interface InterestUpdateValidation {
  name?: string | null;
  imageId?: string | null;
  featured?: boolean | null;
}

export interface InvoiceCreateValidation {
  title?: string | null;
  description?: string | null;
  status?: "todo" | "todo";
  dueDate?: Date | null;
  notes?: string | null;
  accountId?: string | null;
}

export interface InvoiceLineItemCreateValidation {
  name?: string | null;
  description?: string | null;
  quantity?: number | null;
  amount?: number | null;
}

export interface InvoiceLineItemUpdateValidation {
  name?: string | null;
  description?: string | null;
  quantity?: number | null;
  amount?: number | null;
}

export interface InvoiceUpdateValidation {
  title?: string | null;
  description?: string | null;
  status?: "todo" | "todo";
  dueDate?: Date | null;
  notes?: string | null;
  accountId?: string | null;
}

export interface LeadCreateValidation {
  note?: string | null;
}

export interface LeadUpdateValidation {
  note?: string | null;
}

export interface NotificationPreferencesCreateValidation {
  newFollowerPush?: boolean | null;
  newFollowerEmail?: boolean | null;
  likePush?: boolean | null;
  resharePush?: boolean | null;
  commentPush?: boolean | null;
  commentEmail?: boolean | null;
  transferPush?: boolean | null;
  transferEmail?: boolean | null;
  supportTicketConfirmationEmail?: boolean | null;
  chatPush?: boolean | null;
  chatUnreadPush?: boolean | null;
  chatUnreadEmail?: boolean | null;
  eventReminderEmail?: boolean | null;
  eventAnnouncementPush?: boolean | null;
  eventAnnouncementEmail?: boolean | null;
  organizationAnnouncementPush?: boolean | null;
  organizationAnnouncementEmail?: boolean | null;
  groupAnnouncementPush?: boolean | null;
  groupAnnouncementEmail?: boolean | null;
  groupInvitationPush?: boolean | null;
  groupInvitationEmail?: boolean | null;
  groupRequestAcceptedEmail?: boolean | null;
  groupRequestAcceptedPush?: boolean | null;
}

export interface NotificationPreferencesUpdateValidation {
  newFollowerPush?: boolean | null;
  newFollowerEmail?: boolean | null;
  likePush?: boolean | null;
  resharePush?: boolean | null;
  commentPush?: boolean | null;
  commentEmail?: boolean | null;
  transferPush?: boolean | null;
  transferEmail?: boolean | null;
  supportTicketConfirmationEmail?: boolean | null;
  chatPush?: boolean | null;
  chatUnreadPush?: boolean | null;
  chatUnreadEmail?: boolean | null;
  eventReminderEmail?: boolean | null;
  eventAnnouncementPush?: boolean | null;
  eventAnnouncementEmail?: boolean | null;
  organizationAnnouncementPush?: boolean | null;
  organizationAnnouncementEmail?: boolean | null;
  groupAnnouncementPush?: boolean | null;
  groupAnnouncementEmail?: boolean | null;
  groupInvitationPush?: boolean | null;
  groupInvitationEmail?: boolean | null;
  groupRequestAcceptedEmail?: boolean | null;
  groupRequestAcceptedPush?: boolean | null;
}

export interface OrganizationPageCreateValidation {
  title?: string | null;
  subtitle?: string | null;
  html?: string | null;
}

export interface OrganizationPageTranslationUpdateValidation {
  title?: string | null;
  subtitle?: string | null;
  html?: string | null;
}

export interface OrganizationPageUpdateValidation {
  title?: string | null;
  subtitle?: string | null;
  html?: string | null;
}

export interface OrganizationUpdateValidation {
  email?: string;
  name?: string;
  description?: string;
  slug?: string;
  phone?: string | null;
  timezone?: "todo" | "todo";
  website?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  logoId?: string | null;
  darkLogoId?: string | null;
  iconId?: string | null;
  darkIconId?: string | null;
  currency?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  tikTok?: string | null;
  linkedIn?: string | null;
  youtube?: string | null;
  discord?: string | null;
  iosAppLink?: string | null;
  androidAppLink?: string | null;
  requirePhone?: boolean | null;
  requireTitle?: boolean | null;
  requireCompany?: boolean | null;
}

export interface PaymentIntentPurchaseMetadataValidation {
  purchaseId?: string | null;
  addOnIds?: (string | null)[] | null;
}

export interface PushDeviceCreateValidation {
  id?: string | null;
  deviceToken?: string | null;
  eventId?: string | null;
  bundleId?: string | null;
  name?: string | null;
  model?: string | null;
  brand?: string | null;
  osName?: string | null;
  osVersion?: string | null;
  deviceYearClass?: number | null;
  manufacturer?: string | null;
  supportedCpuArchitectures?: string | null;
  totalMemory?: number | null;
  appType?: "EVENTXM" | "COMMUNITYXM" | null;
  pushService?: "apn" | "firebase" | "huawei" | "xiaomi" | null;
  pushServiceName?: string | null;
}

export interface PushDeviceUpdateValidation {
  id?: string | null;
  deviceToken?: string | null;
  eventId?: string | null;
  bundleId?: string | null;
  name?: string | null;
  model?: string | null;
  brand?: string | null;
  osName?: string | null;
  osVersion?: string | null;
  deviceYearClass?: number | null;
  manufacturer?: string | null;
  supportedCpuArchitectures?: string | null;
  totalMemory?: number | null;
  appType?: "EVENTXM" | "COMMUNITYXM" | null;
  pushService?: "apn" | "firebase" | "huawei" | "xiaomi" | null;
  pushServiceName?: string | null;
}

export interface QuestionChoiceCreateValidation {
  value?: string | null;
  text?: string | null;
  supply?: number | null;
  description?: string | null;
  sortOrder?: number | null;
}

export interface QuestionChoiceTranslationUpdateValidation {
  value?: string | null;
  text?: string | null;
  description?: string | null;
}

export interface QuestionChoiceUpdateValidation {
  value?: string | null;
  text?: string | null;
  supply?: number | null;
  description?: string | null;
  sortOrder?: number | null;
}

export interface QuestionCreateValidation {
  name?: string | null;
  type?: "todo" | "todo" | null;
  required?: boolean | null;
  label?: string | null;
  placeholder?: string | null;
  description?: string | null;
  default?: string | null;
  span?: number | null;
  mutable?: boolean | null;
  min?: string | null;
  max?: string | null;
  validation?: string | null;
  validationMessage?: string | null;
  sortOrder?: number | null;
  featured?: boolean | null;
}

export interface QuestionSearchValueCreateValidation {
  value?: string | null;
  top?: boolean | null;
}

export interface QuestionSearchValueUpdateValidation {
  value?: string | null;
  top?: boolean | null;
}

export interface QuestionTranslationUpdateValidation {
  label?: string | null;
  placeholder?: string | null;
  description?: string | null;
}

export interface QuestionUpdateValidation {
  name?: string | null;
  type?: "todo" | "todo";
  required?: boolean | null;
  label?: string | null;
  placeholder?: string | null;
  description?: string | null;
  default?: string | null;
  span?: number | null;
  mutable?: boolean | null;
  min?: string | null;
  max?: string | null;
  validation?: string | null;
  validationMessage?: string | null;
  sortOrder?: number | null;
  featured?: boolean | null;
}

export interface ReportCreateValidation {
  name: string;
  parentId: number;
  eventId?: string | null;
  description?: string | null;
  filters?: string | null;
  columns?: string | null;
  charts?: string | null;
  advancedFilter?: string | null;
}

export interface ReportUpdateValidation {
  name?: string | null;
  description?: string | null;
  filters?: string | null;
  columns?: string | null;
  charts?: string | null;
  advancedFilter?: string | null;
}

export interface SectionCreateValidation {
  name?: string | null;
  description?: string | null;
  guestDescription?: string | null;
  sortOrder?: number | null;
}

export interface SectionUpdateValidation {
  name?: string | null;
  description?: string | null;
  guestDescription?: string | null;
  sortOrder?: number | null;
}

export interface SeriesCreateValidation {
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  imageId?: string | null;
  sortOrder?: number | null;
}

export interface SeriesUpdateValidation {
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  imageId?: string | null;
  sortOrder?: number | null;
}

export interface SponsorshipLevelCreateValidation {
  name?: string | null;
  slug?: string | null;
  subtitle?: string | null;
  description?: string | null;
  color?: string | null;
  scale?: number | null;
  imageId?: string | null;
  sortOrder?: number | null;
}

export interface SponsorshipLevelTranslationUpdateValidation {
  name?: string | null;
  subtitle?: string | null;
  description?: string | null;
}

export interface SponsorshipLevelUpdateValidation {
  name?: string | null;
  slug?: string | null;
  subtitle?: string | null;
  description?: string | null;
  color?: string | null;
  scale?: number | null;
  imageId?: string | null;
  sortOrder?: number | null;
}

export interface StreamOutputCreateValidation {
  enabled: boolean;
  streamKey: string;
  url: string;
}

export interface SubscriptionProductCreateValidation {
  active?: boolean | null;
  name?: string | null;
  description?: string | null;
  statementDescriptor?: string | null;
  features?: (string | null)[] | null;
}

export interface SubscriptionProductPriceCreateValidation {
  active?: boolean | null;
  type?: "flat" | null;
  amount: number;
  currency?: "usd" | null;
  interval: "day" | "week" | "month" | "year";
  intervalCount: number;
}

export interface SubscriptionProductPriceUpdateValidation {
  active?: boolean | null;
}

export interface SubscriptionProductUpdateValidation {
  active?: boolean | null;
  name?: string | null;
  description?: string | null;
  statementDescriptor?: string | null;
  features?: (string | null)[] | null;
}

export interface SubscriptionUpdateValidation {
  accountId?: string | null;
}

export interface SupportTicketCreateValidation {
  type?: "todo" | "todo";
  email?: string | null;
  request?: string | null;
  accountId?: string | null;
  eventId?: string | null;
  status?: "new" | "inProgress" | "complete" | null;
}

export interface SupportTicketUpdateValidation {
  type?: "todo" | "todo";
  email?: string | null;
  request?: string | null;
  accountId?: string | null;
  eventId?: string | null;
  status?: "new" | "inProgress" | "complete" | null;
}

export interface TeamCreateValidation {
  name: string;
  email?: string | null;
  username?: string | null;
}

export interface TeamMemberCreateValidation {
  firstName?: string | null;
  lastName?: string | null;
  slug?: string | null;
  nickName?: string | null;
  email?: string | null;
  phone?: string | null;
  title?: string | null;
  bio?: string | null;
  imageId?: string | null;
  linkedIn?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  tikTok?: string | null;
  discord?: string | null;
  priority?: number | null;
  startDate?: Date | null;
}

export interface TeamMemberUpdateValidation {
  firstName?: string | null;
  lastName?: string | null;
  slug?: string | null;
  nickName?: string | null;
  email?: string | null;
  phone?: string | null;
  title?: string | null;
  bio?: string | null;
  imageId?: string | null;
  linkedIn?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  tikTok?: string | null;
  discord?: string | null;
  priority?: number | null;
  startDate?: Date | null;
}

export interface TeamUpdateValidation {
  name?: string;
  email?: string | null;
  username?: string;
}

export interface ThreadCreateValidation {
  name?: string;
  description?: string;
  featured?: boolean | null;
  visible?: boolean | null;
  access?: "";
  groupId?: string | null;
  eventId?: string | null;
}

export interface ThreadUpdateValidation {
  name?: string;
  description?: string;
  featured?: boolean | null;
  visible?: boolean | null;
  access?: "todo" | "todo";
  groupId?: string | null;
  eventId?: string | null;
}

export interface TicketCreateValidation {
  visibility?: "todo" | "todo";
  featured?: boolean | null;
  active?: boolean | null;
  transferable?: boolean | null;
  name?: string | null;
  slug?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
  price?: number | null;
  accessLevel?: "todo" | "todo";
  featuredImageId?: string | null;
  imageId?: string | null;
  supply?: number | null;
  minQuantityPerSale?: number | null;
  maxQuantityPerSale?: number | null;
  emailDomains?: string | null;
  options?: any | null;
  allowlist?: boolean | null;
  sortOrder?: number | null;
  reservationStart?: Date | null;
  minReservationStart?: Date | null;
  maxReservationStart?: Date | null;
  reservationEnd?: Date | null;
  minReservationEnd?: Date | null;
  maxReservationEnd?: Date | null;
}

export interface TicketUpdateValidation {
  visibility?: "todo" | "todo";
  featured?: boolean | null;
  active?: boolean | null;
  transferable?: boolean | null;
  name?: string | null;
  slug?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
  price?: number | null;
  accessLevel?: "todo" | "todo";
  featuredImageId?: string | null;
  imageId?: string | null;
  supply?: number | null;
  minQuantityPerSale?: number | null;
  maxQuantityPerSale?: number | null;
  emailDomains?: string | null;
  options?: any | null;
  allowlist?: boolean | null;
  sortOrder?: number | null;
  reservationStart?: Date | null;
  minReservationStart?: Date | null;
  maxReservationStart?: Date | null;
  reservationEnd?: Date | null;
  minReservationEnd?: Date | null;
  maxReservationEnd?: Date | null;
}

export interface TierCreateValidation {
  name?: string | null;
  slug?: string | null;
  iconName?: string | null;
  priority?: number | null;
  description?: string | null;
  imageId?: string | null;
  color?: string | null;
  internal?: boolean | null;
}

export interface TierUpdateValidation {
  name?: string | null;
  slug?: string | null;
  iconName?: string | null;
  priority?: number | null;
  description?: string | null;
  imageId?: string | null;
  color?: string | null;
  internal?: boolean | null;
}
export interface TrackCreateValidation {
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  color?: string | null;
}

export interface TrackUpdateValidation {
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  color?: string | null;
}

export interface TriggerCreateValidation {
  code?: string | null;
  enabled?: boolean | null;
}

export interface TriggerUpdateValidation {
  code?: string | null;
  enabled?: boolean | null;
}

export interface UserCreateValidation {
  title?: string | null;
}

export interface UserUpdateValidation {
  title?: string | null;
}
