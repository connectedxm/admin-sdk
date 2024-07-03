import {
  AccountType,
  AdvertisementType,
  BadgeFieldTransformation,
  BadgeFieldType,
  ContentGuestType,
  ContentType,
  InvoiceStatus,
  EventType,
  GroupAccess,
  RegistrationQuestionType,
  SubscriptionProductPriceType,
  SubscriptionProductPriceInterval,
  ThreadAccessLevel,
  TicketVisibility,
  TicketEventAccessLevel,
} from "./interfaces";

export interface AccountCreateParams {
  accountType: keyof typeof AccountType;
  email: string;
  username: string;
  featured?: boolean | null;
  firstName?: string | null;
  lastName?: string | null;
  imageId?: string | null;
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

export interface AccountUpdateParams {
  accountType?: keyof typeof AccountType | null;
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

export interface ActivityCreateParams {
  message: string;
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

export interface ActivityUpdateParams {
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

export interface AdvertisementCreateParams {
  type: keyof typeof AdvertisementType;
  link: string;
  title: string;
  startDate: Date;
  description?: string | null;
  imageId?: string | null;
  endDate?: string | null;
  weight?: number | string | null;
  accountId?: string | null;
  eventId?: string | null;
  eventOnly?: boolean | null;
}

export interface AdvertisementUpdateParams {
  type?: keyof typeof AdvertisementType | null;
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

export interface AnnouncementCreateParams {
  title: string;
  html: string;
  email: boolean;
  push: boolean;
  slug?: string | null;
  creatorId?: string | null;
  userId?: string | null;
  eventId?: string | null;
  groupId?: string | null;
  accountId?: string | null;
  sponsorshipLevelId?: string | null;
}

export interface BenefitCreateParams {
  link: string;
  title: string;
  startDate: string;
  slug?: string | null;
  description?: string | null;
  imageId?: string | null;
  endDate?: string | null;
  priority?: number | string | null;
  managerId?: string | null;
  eventId?: string | null;
  eventOnly?: boolean | null;
}

export interface BenefitTranslationUpdateParams {
  title?: string | null;
  description?: string | null;
}

export interface BenefitUpdateParams {
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

export interface ChannelCollectionCreateParams {
  name: string;
  description?: string | null;
}

export interface ChannelCollectionTranslationUpdateParams {
  name?: string | null;
  description?: string | null;
}

export interface ChannelCollectionUpdateParams {
  name?: string | null;
  description?: string | null;
}

export interface ChannelCreateParams {
  name: string;
  imageId: string;
  slug?: string | null; // Assuming validSlug is a function for validation, not an enum conversion
  description?: string | null;
  priority?: number | string | null;
  visible?: boolean | null;
  externalUrl?: string | null;
  appleUrl?: string | null;
  spotifyUrl?: string | null;
  googleUrl?: string | null;
  youtubeUrl?: string | null;
  groupId?: string | null;
}

export interface ChannelSubscriberUpdateParams {
  contentEmailNotification?: boolean | null;
  contentPushNotification?: boolean | null;
}

export interface ChannelTranslationUpdateParams {
  name?: string | null;
  description?: string | null;
}

export interface ChannelUpdateParams {
  name?: string | null;
  imageId?: string | null;
  slug?: string | null; // Assuming validSlug is a function for validation, not an enum conversion
  description?: string | null;
  priority?: number | string | null;
  visible?: boolean | null;
  externalUrl?: string | null;
  appleUrl?: string | null;
  spotifyUrl?: string | null;
  googleUrl?: string | null;
  youtubeUrl?: string | null;
  groupId?: string | null;
}

export interface ContentCreateParams {
  title: string;
  type: keyof typeof ContentType;
  published?: string | null;
  channelId?: string | null;
  featured?: boolean | null;
  visible?: boolean | null;
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

export interface ContentGuestCreateParams {
  name: string;
  type?: keyof typeof ContentGuestType | null;
  slug?: string | null;
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

export interface ContentGuestTranslationUpdateParams {
  title?: string | null;
  bio?: string | null;
  companyBio?: string | null;
}

export interface ContentGuestUpdateParams {
  type?: keyof typeof ContentGuestType | null;
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

export interface ContentTranslationUpdateParams {
  title?: string | null;
  description?: string | null;
  body?: string | null;
}

export interface ContentUpdateParams {
  type?: keyof typeof ContentType | null;
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

export interface EventActivationCreateParams {
  name: string;
  shortDescription: string;
  imageId?: string | null;
  managerId?: string | null;
  slug?: string | null; // Assuming validSlug is a method for validation, not an enum conversion
  longDescription?: string | null;
  maxPoints?: number | string | null;
  startAfter?: string | null;
  protected?: boolean | null;
  protectionCode?: number | string | null;
}

export interface EventActivationUpdateTranslationParams {
  name?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
}

export interface EventActivationUpdateParams {
  imageId?: string | null;
  managerId?: string | null;
  name?: string | null;
  slug?: string | null; // Assuming validSlug is a method for validation, not an enum conversion
  shortDescription?: string | null;
  longDescription?: string | null;
  maxPoints?: number | string | null;
  startAfter?: string | null;
  protected?: boolean | null;
  protectionCode?: number | string | null;
}

export interface EventAddOnCreateParams {
  name: string;
  shortDescription: string;
  longDescription?: string | null;
  price?: number | string | null; // Assuming OPTIONAL_PRICE is similar to OPTIONAL_NUMBER
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

export interface EventAddOnUpdateTranslationParams {
  name?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
}

export interface EventAddOnUpdateParams {
  name?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
  price?: number | string | null; // Assuming OPTIONAL_PRICE is similar to OPTIONAL_NUMBER
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

export interface EventBadgeFieldUpdateParams {
  type?: keyof typeof BadgeFieldType | null;
  lookup?: string | null;
  maxLength?: number | string | null;
  defaultValue?: string | null;
  transformation?: keyof typeof BadgeFieldTransformation | null;
  sortOrder?: number | string | null;
}

export interface EventCouponCreateParams {
  code: string;
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

export interface EventCouponUpdateParams {
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

export interface EventFaqSectionCreateParams {
  name?: string | null;
  slug?: string | null;
  priority?: number | string | null;
}

export interface EventCreateParams {
  eventType: keyof typeof EventType;
  name: string;
  shortDescription: string;
  eventStart: Date;
  eventEnd: Date;
  featured?: boolean | null;
  visible?: boolean | null;
  slug?: string | null;
  internalRefId?: string | null;
  longDescription?: string | null;
  timezone?: string;
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
  iosAppLink?: string | null;
  androidAppLink?: string | null;
  newActivityCreatorEmailNotification?: boolean | null;
  newActivityCreatorPushNotification?: boolean | null;
  streamReplayId?: string | null;
  groupId?: string | null;
  groupOnly?: boolean | null;
}

export interface EventEmailUpdateParams {
  body?: string | null;
  replyTo?: string | null;
}

export interface EventFaqSectionQuestionCreateParams {
  question: string;
  answer: string;
  slug?: string | null;
  priority?: number | string | null;
  visible?: boolean | null;
}

export interface EventFaqSectionQuestionTranslationUpdateParams {
  question?: string | null;
  answer?: string | null;
}

export interface EventFaqSectionQuestionUpdateParams {
  question?: string | null;
  slug?: string | null;
  answer?: string | null;
  priority?: number | string | null;
  visible?: boolean | null;
}

export interface EventFaqSectionTranslationUpdateParams {
  name?: string | null;
}

export interface EventFaqSectionUpdateParams {
  name?: string | null;
  slug?: string | null;
  priority?: number | string | null;
}

export interface EventPageCreateParams {
  slug?: string | null;
  title: string;
  subtitle?: string | null;
  html?: string | null;
  sortOrder?: number | string | null;
}

export interface EventPageTranslationUpdateParams {
  title?: string | null;
  subtitle?: string | null;
  html?: string | null;
}

export interface EventPageUpdateParams {
  slug?: string | null; // Assuming validSlug is a method for validation, not an enum conversion
  title?: string | null;
  subtitle?: string | null;
  html?: string | null;
  sortOrder?: number | string | null;
}

export interface EventPurchaseCreateParams {
  location?: string | null;
  usedAt?: string | null;
  ticketId?: string | null;
  paid?: boolean | null;
  reservationStart?: string | null;
  reservationEnd?: string | null;
}

export interface EventPurchaseUpdateParams {
  location?: string | null;
  usedAt?: string | null;
  ticketId?: string | null;
  paid?: boolean | null;
  reservationStart?: string | null;
  reservationEnd?: string | null;
}

export interface EventRegistrationBypassCreateParams {
  accountId: string;
  closed?: boolean | null;
  preRegister?: boolean | null;
  postRegister?: boolean | null;
}

export interface EventRegistrationBypassUpdateParams {
  accountId?: string | null;
  closed?: boolean | null;
  preRegister?: boolean | null;
  postRegister?: boolean | null;
}

export interface EventRegistrationSectionUpdateTranslationParams {
  name?: string | null;
  description?: string | null;
  guestDescription?: string | null;
}

export interface EventReservationSectionCreateParams {
  name: string;
  shortDescription?: string | null;
  price?: number | string | null; // Assuming OPTIONAL_PRICE is similar to OPTIONAL_NUMBER
  sortOrder?: number | string | null;
  pricePerDay?: boolean | null;
  imageId?: string | null;
}

export interface EventReservationSectionLocationCreateParams {
  name: string;
  shortDescription?: string | null;
  premium?: number | string | null;
  supply?: number | string | null;
  sortOrder?: number | string | null;
}

export interface EventReservationSectionLocationTranslationUpdateParams {
  name?: string | null;
  shortDescription?: string | null;
}

export interface EventReservationSectionLocationUpdateParams {
  name?: string | null;
  shortDescription?: string | null;
  premium?: number | string | null;
  supply?: number | string | null;
  sortOrder?: number | string | null;
}

export interface EventReservationSectionTranslationUpdateParams {
  name?: string | null;
  shortDescription?: string | null;
}

export interface EventReservationSectionUpdateParams {
  name?: string | null;
  shortDescription?: string | null;
  price?: number | string | null;
  sortOrder?: number | string | null;
  pricePerDay?: boolean | null;
  imageId?: string | null;
}

export interface EventSessionCreateParams {
  name: string;
  startTime: Date;
  endTime: Date;
  slug?: string | null;
  location?: string | null;
  description?: string | null;
  longDescription?: string | null;
  nonSession?: boolean | null;
  imageId?: string | null;
  visible?: boolean | null;
  sortOrder?: number | string | null;
}

export interface EventSessionTranslationUpdateParams {
  name?: string | null;
  description?: string | null;
  longDescription?: string | null;
}

export interface EventSessionUpdateParams {
  name?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  slug?: string | null;
  location?: string | null;
  description?: string | null;
  longDescription?: string | null;
  nonSession?: boolean | null;
  imageId?: string | null;
  visible?: boolean | null;
  sortOrder?: number | string | null;
}

export interface EventSpeakerCreateParams {
  firstName: string;
  lastName?: string | null;
  slug?: string | null; // Assuming validSlug is a method for validation, not an enum conversion
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
  priority?: number | string | null;
  visible?: boolean | null;
}

export interface EventSpeakerTranslationUpdateParams {
  title?: string | null;
  bio?: string | null;
}

export interface EventSpeakerUpdateParams {
  firstName?: string | null;
  lastName?: string | null;
  slug?: string | null; // Assuming validSlug is a method for validation, not an enum conversion
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
  priority?: number | string | null;
  visible?: boolean | null;
}

export interface EventTicketTranslationUpdateParams {
  name?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
}

export interface EventTrackTranslationUpdateParams {
  name?: string | null;
  description?: string | null;
}

export interface EventTranslationUpdateParams {
  name?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
}

export interface EventUpdateParams {
  featured?: boolean | null;
  visible?: boolean | null;
  name?: string | null;
  eventType?: keyof typeof EventType | null;
  slug?: string | null;
  internalRefId?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
  timezone?: string | null;
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
  registrationLimit?: number | null | string;
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

export interface GroupCreateParams {
  name: string;
  description: string;
  featured?: boolean | null;
  slug?: string | null;
  active?: boolean | null;
  access?: keyof typeof GroupAccess | null;
  imageId?: string | null;
  externalUrl?: string | null;
}

export interface GroupMembershipUpdateParams {
  announcementEmailNotification?: boolean | null;
  announcementPushNotification?: boolean | null;
  activityEmailNotification?: boolean | null;
  activityPushNotification?: boolean | null;
  eventEmailNotification?: boolean | null;
  eventPushNotification?: boolean | null;
  chatPushNotification?: boolean | null;
}

export interface GroupTranslationUpdateParams {
  name?: string | null;
  description?: string | null;
}

export interface GroupUpdateParams {
  featured?: boolean | null;
  name?: string | null;
  slug?: string | null; // Assuming validSlug is a method for validation, not an enum conversion
  description?: string | null;
  active?: boolean | null;
  access?: keyof typeof GroupAccess | null;
  imageId?: string | null;
  externalUrl?: string | null;
}

export interface InterestCreateParams {
  name: string; // Assuming validSlug is a method for validation, not an enum conversion
  imageId?: string | null;
  featured?: boolean | null;
}

export interface InterestUpdateParams {
  name?: string | null; // Assuming validSlug is a method for validation, not an enum conversion
  imageId?: string | null;
  featured?: boolean | null;
}

export interface InvoiceCreateParams {
  title: string;
  dueDate: string; // Assuming dueDate is a string that represents a date
  description?: string | null;
  status?: keyof typeof InvoiceStatus | null;
  notes?: string | null;
  accountId?: string | null;
}

export interface InvoiceLineItemCreateParams {
  name: string;
  description: string;
  quantity: string | number;
  amount: string; // Assuming REQUIRED_PRICE is a string format for price
}

export interface InvoiceLineItemUpdateParams {
  name?: string | null;
  description?: string | null;
  quantity?: string | number | null;
  amount?: string | null; // Assuming OPTIONAL_PRICE is a string format for price
}

export interface InvoiceUpdateParams {
  title?: string | null;
  description?: string | null;
  status?: keyof typeof InvoiceStatus | null;
  dueDate?: string | null; // Assuming dueDate is a string that represents a date
  notes?: string | null;
  accountId?: string | null;
}

export interface LeadCreateParams {
  note?: string | null;
}

export interface LeadUpdateParams {
  note?: string | null;
}

export interface NotificationPreferencesCreateParams {
  // No fields defined in the provided validation object
}

export interface NotificationPreferencesUpdateParams {
  // No fields defined in the provided validation object
}

export interface OrganizationPageCreateParams {
  title: string;
  subtitle?: string | null;
  html?: string | null;
}

export interface OrganizationPageTranslationUpdateParams {
  title?: string | null;
  subtitle?: string | null;
  html?: string | null;
}

export interface OrganizationPageUpdateParams {
  title?: string | null;
  subtitle?: string | null;
  html?: string | null;
}

export interface OrganizationUpdateParams {
  email?: string | null;
  name?: string | null;
  description?: string | null;
  slug?: string | null;
  phone?: string | null;
  timezone?: string | null;
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
  requirePhone?: boolean | null;
  requireTitle?: boolean | null;
  requireCompany?: boolean | null;
}

export interface PaymentIntentPurchaseMetadataParams {}

export interface PushDeviceCreateParams {}

export interface PushDeviceUpdateParams {}

export interface EventQuestionChoiceCreateParams {
  value: string;
  text?: string | null;
  supply?: number | string | null;
  description?: string | null;
  sortOrder?: number | string | null;
}

export interface EventQuestionChoiceTranslationUpdateParams {
  value?: string | null;
  text?: string | null;
  description?: string | null;
}

export interface EventQuestionChoiceUpdateParams {
  value?: string | null;
  text?: string | null;
  supply?: number | string | null;
  description?: string | null;
  sortOrder?: number | string | null;
}

export interface EventQuestionCreateParams {
  name: string;
  type?: keyof typeof RegistrationQuestionType | null;
  required?: boolean | null;
  label?: string | null;
  placeholder?: string | null;
  description?: string | null;
  default?: string | null;
  span?: number | string | null;
  mutable?: boolean | null;
  min?: string | null;
  max?: string | null;
  validation?: string | null;
  validationMessage?: string | null;
  sortOrder?: number | string | null;
  featured?: boolean | null;
}

export interface EventQuestionSearchParams {
  value: string;
  top?: boolean | null;
}

export interface EventQuestionSearchValueUpdateParams {
  value?: string | null;
  top?: boolean | null;
}

export interface EventQuestionTranslationUpdateParams {
  label?: string | null;
  placeholder?: string | null;
  description?: string | null;
}

export interface EventQuestionUpdateParams {
  name?: string | null;
  type?: keyof typeof RegistrationQuestionType | null;
  required?: boolean | null;
  label?: string | null;
  placeholder?: string | null;
  description?: string | null;
  default?: string | null;
  span?: number | string | null;
  mutable?: boolean | null;
  min?: string | null;
  max?: string | null;
  validation?: string | null;
  validationMessage?: string | null;
  sortOrder?: number | string | null;
  featured?: boolean | null;
}

export interface ReportCreateParams {
  name: string;
  parentId: string | number;
  eventId?: string | null;
  description?: string | null;
  filters?: string | null;
  columns?: string | null;
  charts?: string | null;
  advancedFilter?: string | null;
}

export interface ReportUpdateParams {
  name?: string | null;
  description?: string | null;
  filters?: string | null;
  columns?: string | null;
  charts?: string | null;
  advancedFilter?: string | null;
}

export interface EventSectionCreateParams {
  name: string;
  description?: string | null;
  guestDescription?: string | null;
  sortOrder?: number | string | null;
}

export interface EventSectionUpdateParams {
  name?: string | null;
  description?: string | null;
  guestDescription?: string | null;
  sortOrder?: number | string | null;
}

export interface SeriesCreateParams {
  name: string;
  slug?: string | null;
  description?: string | null;
  imageId?: string | null;
  sortOrder?: number | string | null;
}

export interface SeriesUpdateParams {
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  imageId?: string | null;
  sortOrder?: number | string | null;
}

export interface LevelCreateParams {
  name: string;
  slug?: string | null; // Assuming validSlug is a method for validation, not an enum conversion
  subtitle?: string | null;
  description?: string | null;
  color?: string | null;
  scale?: number | string | null;
  imageId?: string | null;
  sortOrder?: number | string | null;
}

export interface LevelTranslationUpdateParams {
  name?: string | null;
  subtitle?: string | null;
  description?: string | null;
}

export interface LevelUpdateParams {
  name?: string | null;
  slug?: string | null; // Assuming validSlug is a method for validation, not an enum conversion
  subtitle?: string | null;
  description?: string | null;
  color?: string | null;
  scale?: number | string | null;
  imageId?: string | null;
  sortOrder?: number | string | null;
}

export interface StreamOutputCreateParams {
  enabled: boolean;
  streamKey: string;
  url: string;
}

export interface SubscriptionProductCreateParams {
  name: string;
  active?: boolean | null;
  description?: string | null;
  statementDescriptor?: string | null;
  features?: string[] | null;
}

export interface SubscriptionProductPriceCreateParams {
  active?: boolean | null;
  type: keyof typeof SubscriptionProductPriceType;
  amount: string | number; // Assuming REQUIRED_PRICE can be string or number
  currency: "usd"; // Assuming currency is limited to 'usd'
  interval: keyof typeof SubscriptionProductPriceInterval;
  intervalCount: string | number;
}

export interface SubscriptionProductPriceUpdateParams {
  active?: boolean | null;
}

export interface SubscriptionProductUpdateParams {
  active?: boolean | null;
  name?: string | null;
  description?: string | null;
  statementDescriptor?: string | null;
  features?: string[] | null;
}

export interface SubscriptionUpdateParams {
  accountId?: string | null;
}

export interface SupportTicketCreateParams {
  // No fields defined in the provided validation object
}

export interface SupportTicketUpdateParams {
  status?: "new" | "inProgress" | "complete";
}

export interface TeamCreateParams {
  name: string;
  email: string;
  username?: string | null;
}

export interface OrganizationTeamMemberCreateParams {
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
  priority?: number | string | null;
  startDate?: string | null;
}

export interface OrganizationTeamMemberUpdateParams {
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
  priority?: number | string | null;
  startDate?: string | null;
}

export interface TeamUpdateParams {
  name?: string | null;
  email?: string | null;
  username?: string | null;
}

export interface ThreadCreateParams {
  access: keyof typeof ThreadAccessLevel;
  name: string;
  description?: string | null;
  featured?: boolean | null;
  visible?: boolean | null;
  groupId?: string | null;
  eventId?: string | null;
}

export interface ThreadUpdateParams {
  name?: string | null;
  description?: string | null;
  featured?: boolean | null;
  visible?: boolean | null;
  access?: keyof typeof ThreadAccessLevel | null;
  groupId?: string | null;
  eventId?: string | null;
}

export interface EventTicketCreateParams {
  name: string;
  shortDescription: string;
  price: string | number; // Assuming REQUIRED_PRICE can be string or number
  visibility?: keyof typeof TicketVisibility | null;
  featured?: boolean | null;
  active?: boolean | null;
  transferable?: boolean | null;
  slug?: string | null; // Assuming validSlug is a method for validation, not an enum conversion
  longDescription?: string | null;
  accessLevel?: keyof typeof TicketEventAccessLevel | null;
  featuredImageId?: string | null;
  supply?: number | string | null;
  minQuantityPerSale?: number | string | null;
  maxQuantityPerSale?: number | string | null;
  emailDomains?: string | null; // Assuming the pattern validation is not directly translatable to TypeScript
  sortOrder?: number | string | null;
  reservationStart?: string | null;
  minReservationStart?: string | null;
  maxReservationStart?: string | null;
  reservationEnd?: string | null;
  minReservationEnd?: string | null;
  maxReservationEnd?: string | null;
}

export interface EventTicketUpdateParams {
  visibility?: keyof typeof TicketVisibility | null;
  featured?: boolean | null;
  active?: boolean | null;
  transferable?: boolean | null;
  name?: string | null;
  slug?: string | null; // Assuming validSlug is a method for validation, not an enum conversion
  shortDescription?: string | null;
  longDescription?: string | null;
  price?: string | number | null; // Assuming OPTIONAL_PRICE can be string, number, or null
  accessLevel?: keyof typeof TicketEventAccessLevel | null;
  featuredImageId?: string | null;
  supply?: number | string | null;
  minQuantityPerSale?: number | string | null;
  maxQuantityPerSale?: number | string | null;
  emailDomains?: string | null; // Assuming the pattern validation is not directly translatable to TypeScript
  sortOrder?: number | string | null;
  reservationStart?: string | null;
  minReservationStart?: string | null;
  maxReservationStart?: string | null;
  reservationEnd?: string | null;
  minReservationEnd?: string | null;
  maxReservationEnd?: string | null;
}

export interface TierCreateParams {
  name: string;
  slug?: string | null;
  iconName?: string | null;
  priority?: number | string | null;
  description?: string | null;
  imageId?: string | null;
  color?: string | null;
  internal?: boolean | null;
}

export interface TierUpdateParams {
  name?: string | null;
  slug?: string | null;
  iconName?: string | null;
  priority?: number | string | null;
  description?: string | null;
  imageId?: string | null;
  color?: string | null;
  internal?: boolean | null;
}

export interface EventTrackCreateParams {
  name: string;
  slug?: string | null;
  description?: string | null;
  color?: string | null;
}

export interface EventTrackUpdateParams {
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  color?: string | null;
}

export interface TriggerCreateParams {
  code: string;
  enabled?: boolean | null;
}

export interface TriggerUpdateParams {
  code?: string | null;
  enabled?: boolean | null;
}

export interface UserCreateParams {
  // No fields defined in the provided validation object
}

export interface UserUpdateParams {
  title?: string | null;
}
