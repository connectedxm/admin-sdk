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

interface ChannelUpdateValidation {
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  priority?: number | string | null;
  visible?: boolean | null;
  imageId?: string | null;
  format?: "todo" | "todo" | string | null; // Assuming "article", "podcast", "video" are the only valid strings
  externalUrl?: string | null;
  appleUrl?: string | null;
  spotifyUrl?: string | null;
  googleUrl?: string | null;
  youtubeUrl?: string | null;
  groupId?: string | null;
}

interface ContentCreateValidation {
  type?: "todo" | "todo" | string | null; // Assuming ContentType keys are the valid strings
  published?: string | null;
  channelId?: string | null;
  featured?: boolean | null;
  visible?: boolean | null;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  duration?: string | null;
  body?: string | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
  videoUrl?: string | null;
  externalUrl?: string | null;
  appleUrl?: string | null;
  spotifyUrl?: string | null;
  googleUrl?: string | null;
  youtubeUrl?: string | null;
}
interface ContentGuestCreateValidation {
  type?: "todo" | "todo" | string | null;
  slug?: string | null;
  name?: string | null;
  title?: string | null;
  bio?: string | null;
  company?: string | null;
  companyLink?: string | null;
  companyBio?: string | null;
  accountId?: string | null;
  imageId?: string | null;
  website?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  linkedIn?: string | null;
  tikTok?: string | null;
  youtube?: string | null;
  discord?: string | null;
}

interface ContentGuestTranslationUpdateValidation {
  title?: string | null;
  bio?: string | null;
  companyBio?: string | null;
}

interface ContentGuestUpdateValidation {
  type?: "todo" | "todo" | string | null;
  slug?: string | null;
  name?: string | null;
  title?: string | null;
  bio?: string | null;
  company?: string | null;
  companyLink?: string | null;
  companyBio?: string | null;
  accountId?: string | null;
  imageId?: string | null;
  website?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  linkedIn?: string | null;
  tikTok?: string | null;
  youtube?: string | null;
  discord?: string | null;
}

interface ContentTranslationUpdateValidation {
  title?: string | null;
  description?: string | null;
  body?: string | null;
}

interface ContentUpdateValidation {
  type?: "todo" | "todo" | string | null;
  published?: string | null;
  channelId?: string | null;
  featured?: boolean | null;
  visible?: boolean | null;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  duration?: string | null;
  body?: string | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
  videoUrl?: string | null;
  externalUrl?: string | null;
  appleUrl?: string | null;
  spotifyUrl?: string | null;
  googleUrl?: string | null;
  youtubeUrl?: string | null;
}

interface EventActivationCreateValidation {
  imageId?: string | null;
  managerId?: string | null;
  name?: string | null;
  slug?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
  maxPoints?: number | string | null;
  startAfter?: string | null;
  protected?: boolean | null;
  protectionCode?: number | string | null;
}

interface EventActivationUpdateTranslationValidation {
  name?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
}

interface EventActivationUpdateValidation {
  imageId?: string | null;
  managerId?: string | null;
  name?: string | null;
  slug?: string | null; // Assuming validSlug is a function for validation and not relevant to TypeScript interface
  shortDescription?: string | null;
  longDescription?: string | null;
  maxPoints?: number | string | null;
  startAfter?: string | null;
  protected?: boolean | null;
  protectionCode?: number | string | null;
}

interface EventAddOnCreateValidation {
  name?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
  price?: number | string | null; // Assuming OPTIONAL_PRICE is similar to OPTIONAL_NUMBER but for prices
  supply?: number | string | null;
  sortOrder?: number | string | null;
  imageId?: string | null;
  reservationStart?: string | null;
  minReservationStart?: string | null;
  maxReservationStart?: string | null;
  reservationEnd?: string | null;
  minReservationEnd?: string | null;
  maxReservationEnd?: string | null;
}
interface EventAddOnUpdateTranslationValidation {
  name?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
}

interface EventAddOnUpdateValidation {
  name?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
  price?: number | string | null;
  supply?: number | string | null;
  sortOrder?: number | string | null;
  imageId?: string | null;
  reservationStart?: string | null;
  minReservationStart?: string | null;
  maxReservationStart?: string | null;
  reservationEnd?: string | null;
  minReservationEnd?: string | null;
  maxReservationEnd?: string | null;
}

interface EventBadgeFieldUpdateValidation {
  type?: "todo" | "todo" | string | null;
  lookup?: string | null;
  maxLength?: number | string | null;
  defaultValue?: string | null;
  transformation?: "todo" | "todo" | string | null;
  sortOrder?: number | string | null;
}

interface EventCreateCouponValidation {
  code?: string | null;
  description?: string | null;
  active?: boolean | null;
  startDate?: string | null;
  endDate?: string | null;
  discountAmount?: number | string | null;
  discountPercent?: number | string | null;
  quantityMin?: number | string | null;
  quantityMax?: number | string | null;
  amountMin?: number | string | null;
  amountMax?: number | string | null;
  useLimit?: number | string | null;
  emailDomains?: string | null;
  ticketId?: string | null;
  managerId?: string | null;
}

interface EventFaqSectionQuestionsValidation {
  question?: string | null;
  slug?: string | null;
  answer?: string | null;
  priority?: number | string | null;
  visible?: boolean | null;
}

interface EventFaqSectionValidation {
  name?: string | null;
  slug?: string | null;
  priority?: number | string | null;
}

interface EventCreateValidation {
  featured?: boolean | null;
  visible?: boolean | null;
  name?: string | null;
  eventType?: "todo" | "todo" | string | null;
  slug?: string | null;
  internalRefId?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
  timezone?: "todo" | "todo" | string | null;
  eventStart?: string | null;
  eventEnd?: string | null;
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
  registrationStart?: string | null;
  registrationEnd?: string | null;
  registrationLimit?: number | string | null;
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

interface EventPageCreateValidation {
  slug?: string | null;
  title?: string | null;
  subtitle?: string | null;
  html?: string | null;
  sortOrder?: number | string | null;
}

interface EventPageTranslationUpdateValidation {
  title?: string | null;
  subtitle?: string | null;
  html?: string | null;
}

interface EventPageUpdateValidation {
  slug?: string | null;
  title?: string | null;
  subtitle?: string | null;
  html?: string | null;
  sortOrder?: number | string | null;
}

interface EventPurchaseCreateValidation {
  location?: string | null;
  usedAt?: string | null;
  ticketId?: string | null;
  paid?: boolean | null;
  reservationStart?: string | null;
  reservationEnd?: string | null;
}

export const EVENT_PURCHASE_UPDATE_VALIDATION = Joi.object({}).keys({
  location: OPTIONAL_STRING,
  usedAt: OPTIONAL_DATE,
  ticketId: OPTIONAL_STRING,
  paid: OPTIONAL_BOOLEAN,
  reservationStart: OPTIONAL_DATE,
  reservationEnd: OPTIONAL_DATE,
});

export const EVENT_REGISTRATION_BYPASS_CREATE_VALIDATION = Joi.object().keys({
  accountId: OPTIONAL_STRING,
  closed: OPTIONAL_BOOLEAN,
  preRegister: OPTIONAL_BOOLEAN,
  postRegister: OPTIONAL_BOOLEAN,
});

export const EVENT_REGISTRATION_BYPASS_UPDATE_VALIDATION = Joi.object().keys({
  accountId: OPTIONAL_STRING,
  closed: OPTIONAL_BOOLEAN,
  preRegister: OPTIONAL_BOOLEAN,
  postRegister: OPTIONAL_BOOLEAN,
});

//Event registration section translation
export const EVENT_REGISTRATION_SECTION_UPDATE_TRANSLATION_VALIDATION =
  Joi.object().keys({
    name: OPTIONAL_STRING,
    description: OPTIONAL_STRING,
    guestDescription: OPTIONAL_STRING,
  });

//EVENT RESERVATION SECTION
export const EVENT_RESERVATION_SECTION_CREATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  shortDescription: OPTIONAL_STRING,
  price: OPTIONAL_PRICE,
  sortOrder: OPTIONAL_NUMBER,
  pricePerDay: OPTIONAL_BOOLEAN,
  imageId: OPTIONAL_STRING,
});

//EVENT RESERVATION SECTION LOCATION
export const EVENT_RESERVATION_SECTION_LOCATION_CREATE_VALIDATION =
  Joi.object().keys({
    name: OPTIONAL_STRING,
    shortDescription: OPTIONAL_STRING,
    premium: OPTIONAL_NUMBER,
    supply: OPTIONAL_NUMBER,
    sortOrder: OPTIONAL_NUMBER.min(1),
  });

export const EVENT_RESERVATION_SECTION_LOCATION_UPDATE_VALIDATION =
  Joi.object().keys({
    name: OPTIONAL_STRING,
    shortDescription: OPTIONAL_STRING,
    premium: OPTIONAL_NUMBER,
    supply: OPTIONAL_NUMBER,
    sortOrder: OPTIONAL_NUMBER.min(1),
  });

//EVENT RESERVATION SECTION TRANSLATION
export const EVENT_RESERVATION_SECTION_TRANSLATION_UPDATE_VALIDATION =
  Joi.object().keys({
    name: OPTIONAL_STRING,
    shortDescription: OPTIONAL_STRING,
  });

export const EVENT_RESERVATION_SECTION_UPDATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  shortDescription: OPTIONAL_STRING,
  price: OPTIONAL_PRICE,
  sortOrder: OPTIONAL_NUMBER,
  pricePerDay: OPTIONAL_BOOLEAN,
  imageId: OPTIONAL_STRING,
});

//EVENT SESSION
export const EVENT_SESSION_CREATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  startTime: OPTIONAL_DATE,
  endTime: OPTIONAL_DATE,
  location: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  longDescription: OPTIONAL_STRING,
  nonSession: OPTIONAL_BOOLEAN,
  imageId: OPTIONAL_STRING,
  visible: OPTIONAL_BOOLEAN,
  sortOrder: OPTIONAL_NUMBER,
});

//EVENT SESSION TRANSLATION
export const EVENT_SESSION_TRANSLATION_UPDATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  longDescription: OPTIONAL_STRING,
});

export const EVENT_SESSION_UPDATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  startTime: OPTIONAL_DATE,
  endTime: OPTIONAL_DATE,
  location: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  longDescription: OPTIONAL_STRING,
  nonSession: OPTIONAL_BOOLEAN,
  imageId: OPTIONAL_STRING,
  visible: OPTIONAL_BOOLEAN,
  sortOrder: OPTIONAL_NUMBER,
});

//event speaker

export const EVENT_SPEAKER_CREATE_VALIDATION = Joi.object().keys({
  firstName: OPTIONAL_STRING,
  lastName: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  bio: OPTIONAL_STRING,
  title: OPTIONAL_STRING,
  company: OPTIONAL_STRING,
  companyBio: OPTIONAL_STRING,
  website: OPTIONAL_STRING.uri(),
  facebook: OPTIONAL_STRING.uri(),
  twitter: OPTIONAL_STRING.uri(),
  instagram: OPTIONAL_STRING.uri(),
  tikTok: OPTIONAL_STRING.uri(),
  linkedIn: OPTIONAL_STRING.uri(),
  youtube: OPTIONAL_STRING.uri(),
  discord: OPTIONAL_STRING.uri(),
  label: OPTIONAL_STRING,
  isHost: OPTIONAL_BOOLEAN,
  imageId: OPTIONAL_STRING,
  priority: OPTIONAL_NUMBER.min(1),
  visible: OPTIONAL_BOOLEAN,
});

//EVENT SPEAKER TRANSLATION
export const EVENT_SPEAKER_TRANSLATION_UPDATE_VALIDATION = Joi.object().keys({
  title: OPTIONAL_STRING,
  bio: OPTIONAL_STRING,
});

export const EVENT_SPEAKER_UPDATE_VALIDATION = Joi.object().keys({
  firstName: OPTIONAL_STRING,
  lastName: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  bio: OPTIONAL_STRING,
  title: OPTIONAL_STRING,
  company: OPTIONAL_STRING,
  companyBio: OPTIONAL_STRING,
  website: OPTIONAL_STRING.uri(),
  facebook: OPTIONAL_STRING.uri(),
  twitter: OPTIONAL_STRING.uri(),
  instagram: OPTIONAL_STRING.uri(),
  tikTok: OPTIONAL_STRING.uri(),
  linkedIn: OPTIONAL_STRING.uri(),
  youtube: OPTIONAL_STRING.uri(),
  discord: OPTIONAL_STRING.uri(),
  label: OPTIONAL_STRING,
  isHost: OPTIONAL_BOOLEAN,
  imageId: OPTIONAL_STRING,
  priority: OPTIONAL_NUMBER.min(1),
  visible: OPTIONAL_BOOLEAN,
});

export const EVENT_TICKET_TRANSLATION_UPDATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  shortDescription: OPTIONAL_STRING,
  longDescription: OPTIONAL_STRING,
});

export const EVENT_TRACK_TRANSLATION_UPDATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
});

export const EVENT_TRANSLATION_UPDATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  shortDescription: OPTIONAL_STRING,
  longDescription: OPTIONAL_STRING,
});

export const EVENT_UPDATE_COUPON_VALIDATION = Joi.object().keys({
  code: OPTIONAL_STRING.uppercase().replace(/ /g, "_"),
  description: OPTIONAL_STRING.max(255),
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

//EVENT EMAILS
export const EVENT_UPDATE_EMAIL_VALIDATION = Joi.object().keys({
  body: OPTIONAL_STRING,
  replyTo: OPTIONAL_STRING.email().lowercase(),
});

// EVENT FAQ SECTION QUESTIONS TRANSLATION
export const EVENT_UPDATE_FAQ_SECTION_QUESTIONS_TRANSLATION_VALIDATION =
  Joi.object().keys({
    question: OPTIONAL_STRING,
    answer: OPTIONAL_STRING,
  });

export const EVENT_UPDATE_FAQ_SECTION_QUESTIONS_VALIDATION = Joi.object().keys({
  question: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  answer: OPTIONAL_STRING,
  priority: OPTIONAL_NUMBER.min(1),
  visible: OPTIONAL_BOOLEAN,
});

//EVENT FAQ SECTIONS TRANSLATIONS
export const EVENT_UPDATE_FAQ_SECTION_TRANSLATION_VALIDATION =
  Joi.object().keys({
    name: OPTIONAL_STRING,
  });

export const EVENT_UPDATE_FAQ_SECTION_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  priority: OPTIONAL_NUMBER.min(1),
});

//EVENT RESERVATION SECTION LOCATION TRANSLATION
export const EVENT_UPDATE_RESERVATION_SECTION_LOCATION_TRANSLATION_VALIDATION =
  Joi.object().keys({
    name: OPTIONAL_STRING,
    shortDescription: OPTIONAL_STRING,
  });

export const EVENT_UPDATE_VALIDATION = Joi.object().keys({
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

export const GROUP_CREATE_VALIDATION = Joi.object().keys({
  featured: OPTIONAL_BOOLEAN,
  name: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  description: OPTIONAL_STRING.max(1000),
  active: OPTIONAL_BOOLEAN,
  access: OPTIONAL_STRING.valid("public", "private"),
  imageId: OPTIONAL_STRING.allow(null, ""),
  externalUrl: OPTIONAL_STRING.uri(),
});

export const GROUP_MEMBERSHIP_UPDATE_VALIDATION = Joi.object().keys({
  announcementEmailNotification: OPTIONAL_BOOLEAN,
  announcementPushNotification: OPTIONAL_BOOLEAN,
  activityEmailNotification: OPTIONAL_BOOLEAN,
  activityPushNotification: OPTIONAL_BOOLEAN,
  eventEmailNotification: OPTIONAL_BOOLEAN,
  eventPushNotification: OPTIONAL_BOOLEAN,
  chatPushNotification: OPTIONAL_BOOLEAN,
});

export const GROUP_TRANSLATION_UPDATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
});

export const GROUP_UPDATE_VALIDATION = Joi.object().keys({
  featured: OPTIONAL_BOOLEAN,
  name: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  description: OPTIONAL_STRING.max(1000),
  active: OPTIONAL_BOOLEAN,
  access: OPTIONAL_STRING.valid("public", "private"),
  imageId: OPTIONAL_STRING.allow(null, ""),
  externalUrl: OPTIONAL_STRING.uri(),
});

export const INTEREST_CREATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING.custom(validSlug),
  imageId: OPTIONAL_STRING,
  featured: OPTIONAL_BOOLEAN,
});

export const INTEREST_UPDATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING.custom(validSlug),
  imageId: OPTIONAL_STRING,
  featured: OPTIONAL_BOOLEAN,
});

export const INVOICE_CREATE_VALIDATION = Joi.object({
  title: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  status: OPTIONAL_STRING.valid("draft", "sent", "void"),
  dueDate: OPTIONAL_DATE,
  notes: OPTIONAL_STRING,
  accountId: OPTIONAL_STRING,
});

export const INVOICE_LINE_ITEM_CREATE_VALIDATION = Joi.object({
  name: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  quantity: OPTIONAL_NUMBER.min(1),
  amount: OPTIONAL_PRICE,
});

export const INVOICE_LINE_ITEM_UPDATE_VALIDATION = Joi.object({
  name: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  quantity: OPTIONAL_NUMBER.min(1),
  amount: OPTIONAL_PRICE,
});

export const INVOICE_UPDATE_VALIDATION = Joi.object({
  title: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  status: OPTIONAL_STRING.valid("draft", "sent", "void"),
  dueDate: OPTIONAL_DATE,
  notes: OPTIONAL_STRING,
  accountId: OPTIONAL_STRING,
});

export const LEAD_CREATE_VALIDATION = Joi.object({}).keys({
  note: OPTIONAL_STRING,
});

export const LEAD_UPDATE_VALIDATION = Joi.object({}).keys({
  note: OPTIONAL_STRING,
});

export const NOTIFICATION_PREFERENCES_CREATE_VALIDATION = Joi.object({}).keys({
  newFollowerPush: OPTIONAL_BOOLEAN,
  newFollowerEmail: OPTIONAL_BOOLEAN,
  likePush: OPTIONAL_BOOLEAN,
  resharePush: OPTIONAL_BOOLEAN,
  commentPush: OPTIONAL_BOOLEAN,
  commentEmail: OPTIONAL_BOOLEAN,
  transferPush: OPTIONAL_BOOLEAN,
  transferEmail: OPTIONAL_BOOLEAN,
  supportTicketConfirmationEmail: OPTIONAL_BOOLEAN,
  chatPush: OPTIONAL_BOOLEAN,
  chatUnreadPush: OPTIONAL_BOOLEAN,
  chatUnreadEmail: OPTIONAL_BOOLEAN,
  eventReminderEmail: OPTIONAL_BOOLEAN,
  eventAnnouncementPush: OPTIONAL_BOOLEAN,
  eventAnnouncementEmail: OPTIONAL_BOOLEAN,
  organizationAnnouncementPush: OPTIONAL_BOOLEAN,
  organizationAnnouncementEmail: OPTIONAL_BOOLEAN,
  groupAnnouncementPush: OPTIONAL_BOOLEAN,
  groupAnnouncementEmail: OPTIONAL_BOOLEAN,
  groupInvitationPush: OPTIONAL_BOOLEAN,
  groupInvitationEmail: OPTIONAL_BOOLEAN,
  groupRequestAcceptedEmail: OPTIONAL_BOOLEAN,
  groupRequestAcceptedPush: OPTIONAL_BOOLEAN,
});

export const NOTIFICATION_PREFERENCES_UPDATE_VALIDATION = Joi.object({}).keys({
  newFollowerPush: OPTIONAL_BOOLEAN,
  newFollowerEmail: OPTIONAL_BOOLEAN,
  likePush: OPTIONAL_BOOLEAN,
  resharePush: OPTIONAL_BOOLEAN,
  commentPush: OPTIONAL_BOOLEAN,
  commentEmail: OPTIONAL_BOOLEAN,
  transferPush: OPTIONAL_BOOLEAN,
  transferEmail: OPTIONAL_BOOLEAN,
  supportTicketConfirmationEmail: OPTIONAL_BOOLEAN,
  chatPush: OPTIONAL_BOOLEAN,
  chatUnreadPush: OPTIONAL_BOOLEAN,
  chatUnreadEmail: OPTIONAL_BOOLEAN,
  eventReminderEmail: OPTIONAL_BOOLEAN,
  eventAnnouncementPush: OPTIONAL_BOOLEAN,
  eventAnnouncementEmail: OPTIONAL_BOOLEAN,
  organizationAnnouncementPush: OPTIONAL_BOOLEAN,
  organizationAnnouncementEmail: OPTIONAL_BOOLEAN,
  groupAnnouncementPush: OPTIONAL_BOOLEAN,
  groupAnnouncementEmail: OPTIONAL_BOOLEAN,
  groupInvitationPush: OPTIONAL_BOOLEAN,
  groupInvitationEmail: OPTIONAL_BOOLEAN,
  groupRequestAcceptedEmail: OPTIONAL_BOOLEAN,
  groupRequestAcceptedPush: OPTIONAL_BOOLEAN,
});

export const ORGANIZATION_PAGE_CREATE_VALIDATION = Joi.object({}).keys({
  title: OPTIONAL_STRING,
  subtitle: OPTIONAL_STRING,
  html: OPTIONAL_STRING,
});

export const ORGANIZATION_PAGE_TRANSLATION_UPDATE_VALIDATION =
  Joi.object().keys({
    title: OPTIONAL_STRING,
    subtitle: OPTIONAL_STRING,
    html: OPTIONAL_STRING,
  });

export const ORGANIZATION_PAGE_UPDATE_VALIDATION = Joi.object({}).keys({
  title: OPTIONAL_STRING,
  subtitle: OPTIONAL_STRING,
  html: OPTIONAL_STRING,
});

export const ORGANIZATION_UPDATE_VALIDATION = Joi.object({}).keys({
  email: OPTIONAL_STRING.email().lowercase(),
  name: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  slug: OPTIONAL_STRING,
  phone: OPTIONAL_STRING.custom((val, helper) => {
    if (!phone(val).isValid) {
      return helper.error("any.invalid");
    } else {
      return phone(val).phoneNumber;
    }
  }, "Phone"),
  timezone: OPTIONAL_STRING.valid(...validTimezones()),
  website: OPTIONAL_STRING.uri(),
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
  primaryColor: OPTIONAL_STRING,
  secondaryColor: OPTIONAL_STRING,
  logoId: OPTIONAL_STRING,
  darkLogoId: OPTIONAL_STRING,
  iconId: OPTIONAL_STRING,
  darkIconId: OPTIONAL_STRING,
  currency: OPTIONAL_STRING,
  facebook: OPTIONAL_STRING.uri(),
  twitter: OPTIONAL_STRING.uri(),
  instagram: OPTIONAL_STRING.uri(),
  tikTok: OPTIONAL_STRING.uri(),
  linkedIn: OPTIONAL_STRING.uri(),
  youtube: OPTIONAL_STRING.uri(),
  discord: OPTIONAL_STRING.uri(),
  iosAppLink: OPTIONAL_STRING.uri(),
  androidAppLink: OPTIONAL_STRING.uri(),
  requirePhone: OPTIONAL_BOOLEAN,
  requireTitle: OPTIONAL_BOOLEAN,
  requireCompany: OPTIONAL_BOOLEAN,
});

export const PAYMENT_INTENT_PURCHASE_METADATA_VALIDATION = Joi.object({}).keys({
  purchaseId: REQUIRED_STRING,
  addOnIds: Joi.array().items(REQUIRED_STRING.uuid()).min(1).required(),
});

export const PUSH_DEVICE_CREATE_VALIDATION = Joi.object({}).keys({
  id: REQUIRED_STRING,
  deviceToken: REQUIRED_STRING,
  eventId: OPTIONAL_STRING,
  bundleId: OPTIONAL_STRING,
  name: OPTIONAL_STRING,
  model: OPTIONAL_STRING,
  brand: OPTIONAL_STRING,
  osName: OPTIONAL_STRING,
  osVersion: OPTIONAL_STRING,
  deviceYearClass: OPTIONAL_NUMBER,
  manufacturer: OPTIONAL_STRING,
  supportedCpuArchitectures: OPTIONAL_STRING,
  totalMemory: OPTIONAL_NUMBER,
  appType: OPTIONAL_STRING.valid("EVENTXM", "COMMUNITYXM"),
  pushService: OPTIONAL_STRING.valid("apn", "firebase", "huawei", "xiaomi"),
  pushServiceName: OPTIONAL_STRING,
});

export const PUSH_DEVICE_UPDATE_VALIDATION = Joi.object({}).keys({
  id: REQUIRED_STRING,
  deviceToken: REQUIRED_STRING,
  eventId: OPTIONAL_STRING,
  bundleId: OPTIONAL_STRING,
  name: OPTIONAL_STRING,
  model: OPTIONAL_STRING,
  brand: OPTIONAL_STRING,
  osName: OPTIONAL_STRING,
  osVersion: OPTIONAL_STRING,
  deviceYearClass: OPTIONAL_NUMBER,
  manufacturer: OPTIONAL_STRING,
  supportedCpuArchitectures: OPTIONAL_STRING,
  totalMemory: OPTIONAL_NUMBER,
  appType: OPTIONAL_STRING.valid("EVENTXM", "COMMUNITYXM"),
  pushService: OPTIONAL_STRING.valid("apn", "firebase", "huawei", "xiaomi"),
  pushServiceName: OPTIONAL_STRING,
});

export const QUESTION_CHOICE_CREATE_VALIDATION = Joi.object().keys({
  value: OPTIONAL_STRING,
  text: OPTIONAL_STRING,
  supply: OPTIONAL_NUMBER,
  description: OPTIONAL_STRING,
  sortOrder: OPTIONAL_NUMBER.min(1),
});

export const QUESTION_CHOICE_TRANSLATION_UPDATE_VALIDATION = Joi.object().keys({
  value: OPTIONAL_STRING,
  text: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
});

export const QUESTION_CHOICE_UPDATE_VALIDATION = Joi.object().keys({
  value: OPTIONAL_STRING,
  text: OPTIONAL_STRING,
  supply: OPTIONAL_NUMBER,
  description: OPTIONAL_STRING,
  sortOrder: OPTIONAL_NUMBER.min(1),
});

export const QUESTION_CREATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  type: OPTIONAL_STRING.valid(...Object.values(RegistrationQuestionType)),
  required: OPTIONAL_BOOLEAN,
  label: OPTIONAL_STRING,
  placeholder: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  default: OPTIONAL_STRING,
  span: OPTIONAL_NUMBER,
  mutable: OPTIONAL_BOOLEAN,
  min: OPTIONAL_STRING,
  max: OPTIONAL_STRING,
  validation: OPTIONAL_STRING,
  validationMessage: OPTIONAL_STRING,
  sortOrder: OPTIONAL_NUMBER.min(1),
  featured: OPTIONAL_BOOLEAN,
});

export const QUESTION_SEARCH_VALUE_CREATE_VALIDATION = Joi.object().keys({
  value: OPTIONAL_STRING,
  top: OPTIONAL_BOOLEAN,
});

export const QUESTION_SEARCH_VALUE_UPDATE_VALIDATION = Joi.object().keys({
  value: OPTIONAL_STRING,
  top: OPTIONAL_BOOLEAN,
});

export const QUESTION_TRANSLATION_UPDATE_VALIDATION = Joi.object().keys({
  label: OPTIONAL_STRING,
  placeholder: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
});

export const QUESTION_UPDATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  type: OPTIONAL_STRING.valid(...Object.values(RegistrationQuestionType)),
  required: OPTIONAL_BOOLEAN,
  label: OPTIONAL_STRING,
  placeholder: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  default: OPTIONAL_STRING,
  span: OPTIONAL_NUMBER,
  mutable: OPTIONAL_BOOLEAN,
  min: OPTIONAL_STRING,
  max: OPTIONAL_STRING,
  validation: OPTIONAL_STRING,
  validationMessage: OPTIONAL_STRING,
  sortOrder: OPTIONAL_NUMBER.min(1),
  featured: OPTIONAL_BOOLEAN,
});

export const REPORT_CREATE_VALIDATION = Joi.object({
  name: REQUIRED_STRING,
  parentId: REQUIRED_NUMBER,
  eventId: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  filters: OPTIONAL_STRING,
  columns: OPTIONAL_STRING,
  charts: OPTIONAL_STRING,
  advancedFilter: OPTIONAL_STRING,
});

export const REPORT_UPDATE_VALIDATION = Joi.object({
  name: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  filters: OPTIONAL_STRING,
  columns: OPTIONAL_STRING,
  charts: OPTIONAL_STRING,
  advancedFilter: OPTIONAL_STRING,
});

export const SECTION_CREATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  guestDescription: OPTIONAL_STRING,
  sortOrder: OPTIONAL_NUMBER.min(1),
});

export const SECTION_UPDATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  guestDescription: OPTIONAL_STRING,
  sortOrder: OPTIONAL_NUMBER.min(1),
});

export const SERIES_CREATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  slug: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  imageId: OPTIONAL_STRING,
  sortOrder: OPTIONAL_NUMBER,
});
export const SERIES_UPDATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  slug: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  imageId: OPTIONAL_STRING,
  sortOrder: OPTIONAL_NUMBER,
});

export const SPONSORSHIP_LEVEL_CREATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  subtitle: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  color: OPTIONAL_STRING,
  scale: OPTIONAL_NUMBER.min(1).max(5),
  imageId: OPTIONAL_STRING,
  sortOrder: OPTIONAL_NUMBER.min(1),
});

export const SPONSORSHIP_LEVEL_TRANSLATION_UPDATE_VALIDATION =
  Joi.object().keys({
    name: OPTIONAL_STRING,
    subtitle: OPTIONAL_STRING,
    description: OPTIONAL_STRING,
  });

export const SPONSORSHIP_LEVEL_UPDATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  subtitle: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  color: OPTIONAL_STRING,
  scale: OPTIONAL_NUMBER.min(1).max(5),
  imageId: OPTIONAL_STRING,
  sortOrder: OPTIONAL_NUMBER.min(1),
});

export const STREAM_OUTPUT_CREATE_VALIDATION = Joi.object().keys({
  enabled: REQUIRED_BOOLEAN,
  streamKey: REQUIRED_STRING,
  url: REQUIRED_STRING,
});

export const SUBSCRIPTION_PRODUCT_CREATE_VALIDATION = Joi.object({
  active: OPTIONAL_BOOLEAN,
  name: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  statementDescriptor: OPTIONAL_STRING,
  features: Joi.array().items(REQUIRED_STRING.max(64)).max(15).optional(),
});

export const SUBSCRIPTION_PRODUCT_PRICE_CREATE_VALIDATION = Joi.object({
  active: OPTIONAL_BOOLEAN,
  type: OPTIONAL_STRING.valid("flat"),
  amount: REQUIRED_PRICE,
  currency: OPTIONAL_STRING.valid("usd"),
  interval: REQUIRED_STRING.valid("day", "week", "month", "year"),
  intervalCount: REQUIRED_NUMBER,
});

export const SUBSCRIPTION_PRODUCT_PRICE_UPDATE_VALIDATION = Joi.object({
  active: OPTIONAL_BOOLEAN,
});

export const SUBSCRIPTION_PRODUCT_UPDATE_VALIDATION = Joi.object({
  active: OPTIONAL_BOOLEAN,
  name: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  statementDescriptor: OPTIONAL_STRING,
  features: Joi.array().items(REQUIRED_STRING.max(64)).max(15).optional(),
});

export const SUBSCRIPTION_UPDATE_VALIDATION = Joi.object({}).keys({
  accountId: OPTIONAL_STRING,
});

export const SUPPORT_TICKET_CREATE_VALIDATION = Joi.object().keys({
  type: OPTIONAL_STRING.valid("support", "inquiry"),
  email: OPTIONAL_STRING.email().lowercase(),
  request: OPTIONAL_STRING,
  accountId: OPTIONAL_STRING,
  eventId: OPTIONAL_STRING,
  status: OPTIONAL_STRING.valid("new", "inProgress", "complete"),
});

export const SUPPORT_TICKET_UPDATE_VALIDATION = Joi.object().keys({
  type: OPTIONAL_STRING.valid("support", "inquiry"),
  email: OPTIONAL_STRING.email().lowercase(),
  request: OPTIONAL_STRING,
  accountId: OPTIONAL_STRING,
  eventId: OPTIONAL_STRING,
  status: OPTIONAL_STRING.valid("new", "inProgress", "complete"),
});

export const TEAM_CREATE_VALIDATION = Joi.object({}).keys({
  name: REQUIRED_STRING,
  email: OPTIONAL_STRING.email().lowercase(),
  username: OPTIONAL_STRING.custom(validSlug),
});

export const TEAM_MEMBER_CREATE_VALIDATION = Joi.object().keys({
  firstName: OPTIONAL_STRING,
  lastName: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  nickName: OPTIONAL_STRING,
  email: OPTIONAL_STRING.email().lowercase(),
  phone: OPTIONAL_STRING,
  title: OPTIONAL_STRING,
  bio: OPTIONAL_STRING,
  imageId: OPTIONAL_STRING,
  linkedIn: OPTIONAL_STRING.uri(),
  facebook: OPTIONAL_STRING.uri(),
  instagram: OPTIONAL_STRING.uri(),
  twitter: OPTIONAL_STRING.uri(),
  tikTok: OPTIONAL_STRING.uri(),
  discord: OPTIONAL_STRING.uri(),
  priority: OPTIONAL_NUMBER,
  startDate: OPTIONAL_DATE,
});

export const TEAM_MEMBER_UPDATE_VALIDATION = Joi.object().keys({
  firstName: OPTIONAL_STRING,
  lastName: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  nickName: OPTIONAL_STRING,
  email: OPTIONAL_STRING.email().lowercase(),
  phone: OPTIONAL_STRING,
  title: OPTIONAL_STRING,
  bio: OPTIONAL_STRING,
  imageId: OPTIONAL_STRING,
  linkedIn: OPTIONAL_STRING.uri(),
  facebook: OPTIONAL_STRING.uri(),
  instagram: OPTIONAL_STRING.uri(),
  twitter: OPTIONAL_STRING.uri(),
  tikTok: OPTIONAL_STRING.uri(),
  discord: OPTIONAL_STRING.uri(),
  priority: OPTIONAL_NUMBER,
  startDate: OPTIONAL_DATE,
});

export const TEAM_UPDATE_VALIDATION = Joi.object({}).keys({
  name: REQUIRED_STRING,
  email: OPTIONAL_STRING.email().lowercase(),
  username: OPTIONAL_STRING.custom(validSlug),
});

export const THREAD_CREATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  featured: OPTIONAL_BOOLEAN,
  visible: OPTIONAL_BOOLEAN,
  access: OPTIONAL_STRING.valid("public", "private"),
  groupId: OPTIONAL_STRING,
  eventId: OPTIONAL_STRING,
});
export const THREAD_UPDATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  description: OPTIONAL_STRING,
  featured: OPTIONAL_BOOLEAN,
  visible: OPTIONAL_BOOLEAN,
  access: OPTIONAL_STRING.valid("public", "private"),
  groupId: OPTIONAL_STRING,
  eventId: OPTIONAL_STRING,
});

export const TICKET_CREATE_VALIDATION = Joi.object().keys({
  visibility: OPTIONAL_STRING.valid(...Object.keys(TicketVisibility)),
  featured: OPTIONAL_BOOLEAN,
  active: OPTIONAL_BOOLEAN,
  transferable: OPTIONAL_BOOLEAN,
  name: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  shortDescription: OPTIONAL_STRING.max(255),
  longDescription: OPTIONAL_STRING,
  price: OPTIONAL_PRICE,
  accessLevel: OPTIONAL_STRING.valid(...Object.keys(TicketEventAccessLevel)),
  featuredImageId: OPTIONAL_STRING,
  imageId: OPTIONAL_STRING,
  supply: OPTIONAL_NUMBER,
  minQuantityPerSale: OPTIONAL_NUMBER,
  maxQuantityPerSale: OPTIONAL_NUMBER,
  emailDomains: OPTIONAL_STRING.pattern(/(\d+)(,\s*\d+)*/).message(
    "emailDomains must be a comma-separated list"
  ),
  options: Joi.any().optional(),
  allowlist: OPTIONAL_BOOLEAN,
  sortOrder: OPTIONAL_NUMBER,
  reservationStart: OPTIONAL_DATE,
  minReservationStart: OPTIONAL_DATE.max(Joi.ref("reservationStart")).messages({
    "date.max": '"Min Reservation Start" must be before "reservationStart"',
  }),
  maxReservationStart: OPTIONAL_DATE.min(Joi.ref("reservationStart")).messages({
    "date.min": '"Max Reservation Start" must be after "reservationStart"',
  }),
  reservationEnd: OPTIONAL_DATE.custom((val) => (val === "" ? null : val))
    .greater(Joi.ref("reservationStart"))
    .messages({
      "date.greater": '"Reservation End" must be after "reservationStart"',
    }),
  minReservationEnd: OPTIONAL_DATE.custom((val) => (val === "" ? null : val))
    .max(Joi.ref("reservationEnd"))
    .messages({
      "date.max": '"Min Reservation End" must be before "reservationEnd"',
    }),
  maxReservationEnd: OPTIONAL_DATE.custom((val) => (val === "" ? null : val))
    .min(Joi.ref("reservationEnd"))
    .messages({
      "date.min": '"Max Reservation End" must be after "reservationEnd"',
    }),
});

export const TICKET_UPDATE_VALIDATION = Joi.object().keys({
  visibility: OPTIONAL_STRING.valid(...Object.keys(TicketVisibility)),
  featured: OPTIONAL_BOOLEAN,
  active: OPTIONAL_BOOLEAN,
  transferable: OPTIONAL_BOOLEAN,
  name: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  shortDescription: OPTIONAL_STRING.max(255),
  longDescription: OPTIONAL_STRING,
  price: OPTIONAL_PRICE,
  accessLevel: OPTIONAL_STRING.valid(...Object.keys(TicketEventAccessLevel)),
  featuredImageId: OPTIONAL_STRING,
  imageId: OPTIONAL_STRING,
  supply: OPTIONAL_NUMBER,
  minQuantityPerSale: OPTIONAL_NUMBER,
  maxQuantityPerSale: OPTIONAL_NUMBER,
  emailDomains: OPTIONAL_STRING.pattern(/(\d+)(,\s*\d+)*/).message(
    "emailDomains must be a comma-separated list"
  ),
  options: Joi.any().optional(),
  allowlist: OPTIONAL_BOOLEAN,
  sortOrder: OPTIONAL_NUMBER,
  reservationStart: OPTIONAL_DATE,
  minReservationStart: OPTIONAL_DATE.max(Joi.ref("reservationStart")).messages({
    "date.max": '"Min Reservation Start" must be before "reservationStart"',
  }),
  maxReservationStart: OPTIONAL_DATE.min(Joi.ref("reservationStart")).messages({
    "date.min": '"Max Reservation Start" must be after "reservationStart"',
  }),
  reservationEnd: OPTIONAL_DATE.custom((val) => (val === "" ? null : val))
    .greater(Joi.ref("reservationStart"))
    .messages({
      "date.greater": '"Reservation End" must be after "reservationStart"',
    }),
  minReservationEnd: OPTIONAL_DATE.custom((val) => (val === "" ? null : val))
    .max(Joi.ref("reservationEnd"))
    .messages({
      "date.max": '"Min Reservation End" must be before "reservationEnd"',
    }),
  maxReservationEnd: OPTIONAL_DATE.custom((val) => (val === "" ? null : val))
    .min(Joi.ref("reservationEnd"))
    .messages({
      "date.min": '"Max Reservation End" must be after "reservationEnd"',
    }),
});

export const TIER_CREATE_VALIDATION = Joi.object({
  name: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  iconName: OPTIONAL_STRING,
  priority: OPTIONAL_NUMBER.min(1),
  description: OPTIONAL_STRING,
  imageId: OPTIONAL_STRING,
  color: OPTIONAL_STRING,
  internal: OPTIONAL_BOOLEAN,
});

export const TIER_UPDATE_VALIDATION = Joi.object({
  name: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  iconName: OPTIONAL_STRING,
  priority: OPTIONAL_NUMBER.min(1),
  description: OPTIONAL_STRING,
  imageId: OPTIONAL_STRING,
  color: OPTIONAL_STRING,
  internal: OPTIONAL_BOOLEAN,
});
export const TRACK_CREATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  description: OPTIONAL_STRING,
  color: OPTIONAL_STRING,
});

export const TRACK_UPDATE_VALIDATION = Joi.object().keys({
  name: OPTIONAL_STRING,
  slug: OPTIONAL_STRING.custom(validSlug),
  description: OPTIONAL_STRING,
  color: OPTIONAL_STRING,
});

export const TRIGGER_CREATE_VALIDATION = Joi.object({}).keys({
  code: OPTIONAL_STRING,
  enabled: OPTIONAL_BOOLEAN,
});

export const TRIGGER_UPDATE_VALIDATION = Joi.object({}).keys({
  code: OPTIONAL_STRING,
  enabled: OPTIONAL_BOOLEAN,
});

export const USER_CREATE_VALIDATION = Joi.object({}).keys({
  title: OPTIONAL_STRING,
});

export const USER_UPDATE_VALIDATION = Joi.object({}).keys({
  title: OPTIONAL_STRING,
});
