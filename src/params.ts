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
  SubscriptionStatus,
  BaseSubscriptionProduct,
  BaseAccount,
  BaseSubscriptionProductPrice,
  ImageType,
  FileSource,
  RegistrationStatus,
} from "./interfaces";

export interface AccountCreateInputs {
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

export interface AccountUpdateInputs {
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

export interface ActivityCreateInputs {
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

export interface ActivityUpdateInputs {
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

export interface AdvertisementCreateInputs {
  type: keyof typeof AdvertisementType;
  link: string;
  title: string;
  startDate: string;
  description?: string | null;
  imageId?: string | null;
  endDate?: string | null;
  weight?: number | string | null;
  accountId?: string | null;
  eventId?: string | null;
  eventOnly?: boolean | null;
}

export interface AdvertisementUpdateInputs {
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

export interface AnnouncementCreateInputs {
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

export interface BenefitCreateInputs {
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

export interface BenefitTranslationUpdateInputs {
  title?: string | null;
  description?: string | null;
}

export interface BenefitUpdateInputs {
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

export interface ChannelCollectionCreateInputs {
  name: string;
  description?: string | null;
}

export interface ChannelCollectionTranslationUpdateInputs {
  name?: string | null;
  description?: string | null;
}

export interface ChannelCollectionUpdateInputs {
  name?: string | null;
  description?: string | null;
}

export interface ChannelCreateInputs {
  name: string;
  imageId: string;
  slug?: string | null;
  featured?: boolean | null;
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

export interface ChannelSubscriberUpdateInputs {
  contentEmailNotification?: boolean | null;
  contentPushNotification?: boolean | null;
}

export interface ChannelTranslationUpdateInputs {
  name?: string | null;
  description?: string | null;
}

export interface ChannelUpdateInputs {
  name?: string | null;
  imageId?: string | null;
  slug?: string | null;
  featured?: boolean | null;
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

export interface ChannelContentCreateInputs {
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

export interface ChannelContentGuestCreateInputs {
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

export interface ChannelContentGuestTranslationUpdateInputs {
  title?: string | null;
  bio?: string | null;
  companyBio?: string | null;
}

export interface ChannelContentGuestUpdateInputs {
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

export interface ChannelContentTranslationUpdateInputs {
  title?: string | null;
  description?: string | null;
  body?: string | null;
}

export interface ChannelContentUpdateInputs {
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

export interface EventActivationCreateInputs {
  name: string;
  shortDescription: string;
  imageId?: string | null;
  managerId?: string | null;
  slug?: string | null;
  longDescription?: string | null;
  maxPoints?: number | string | null;
  startAfter?: string | null;
  protected?: boolean | null;
  protectionCode?: number | string | null;
}

export interface EventActivationTranslationUpdateInputs {
  name?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
}

export interface EventActivationUpdateInputs {
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

export interface EventActivationCompletionCreateInputs {}

export interface EventActivationCompletionUpdateInputs {}

export interface EventAddOnCreateInputs {
  name: string;
  shortDescription: string;
  longDescription?: string | null;
  price: number | string | null;
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

export interface EventAddOnTranslationUpdateInputs {
  name?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
}

export interface EventAddOnUpdateInputs {
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

export interface EventBadgeFieldUpdateInputs {
  type?: keyof typeof BadgeFieldType | null;
  lookup?: string | null;
  maxLength?: number | string | null;
  defaultValue?: string | null;
  transformation?: keyof typeof BadgeFieldTransformation | null;
  sortOrder?: number | string | null;
}

export interface EventCouponCreateInputs {
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

export interface EventCouponUpdateInputs {
  code?: string | null;
  description?: string | null;
  active?: boolean | null;
  startDate?: string | null;
  endDate?: string | null;
  discountAmount?: number | string | null;
  discountPercent?: number | string | null;
  quantityMin?: number | string | null;
  quantityMax?: number | string | null;
  useLimit?: number | string | null;
  limitPerAccount?: number | string | null;
  purchaseLimit?: number | string | null;
  emailDomains?: string | null;
  ticketId?: string | null;
  registrationId?: string | null;
}

export interface EventFaqSectionCreateInputs {
  name?: string | null;
  slug?: string | null;
  priority?: number | string | null;
}

export interface EventCreateInputs {
  eventType: keyof typeof EventType;
  name: string;
  shortDescription: string;
  eventStart: string;
  eventEnd: string;
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

export interface EventEmailUpdateInputs {
  body?: string | null;
  replyTo?: string | null;
}

export interface EventFaqSectionQuestionCreateInputs {
  question: string;
  answer: string;
  slug?: string | null;
  priority?: number | string | null;
  visible?: boolean | null;
}

export interface EventFaqSectionQuestionTranslationUpdateInputs {
  question?: string | null;
  answer?: string | null;
}

export interface EventFaqSectionQuestionUpdateInputs {
  question?: string | null;
  slug?: string | null;
  answer?: string | null;
  priority?: number | string | null;
  visible?: boolean | null;
}

export interface EventFaqSectionTranslationUpdateInputs {
  name?: string | null;
}

export interface EventFaqSectionUpdateInputs {
  name?: string | null;
  slug?: string | null;
  priority?: number | string | null;
}

export interface EventPageCreateInputs {
  slug?: string | null;
  title: string;
  subtitle?: string | null;
  html?: string | null;
  sortOrder?: number | string | null;
}

export interface EventPageTranslationUpdateInputs {
  title?: string | null;
  subtitle?: string | null;
  html?: string | null;
}

export interface EventPageUpdateInputs {
  slug?: string | null;
  title?: string | null;
  subtitle?: string | null;
  html?: string | null;
  sortOrder?: number | string | null;
}

export interface EventPurchaseCreateInputs {
  location?: string | null;
  usedAt?: string | null;
  ticketId?: string | null;
  paid?: boolean | null;
  reservationStart?: string | null;
  reservationEnd?: string | null;
}

export interface EventPurchaseUpdateInputs {
  location?: string | null;
  usedAt?: string | null;
  ticketId?: string | null;
  paid?: boolean | null;
  reservationStart?: string | null;
  reservationEnd?: string | null;
}

export interface EventRegistrationUpdateInputs {
  status?: keyof typeof RegistrationStatus;
}

export interface EventRegistrationBypassCreateInputs {
  accountId: string;
  closed?: boolean | null;
  preRegister?: boolean | null;
  postRegister?: boolean | null;
}

export interface EventRegistrationBypassUpdateInputs {
  accountId?: string | null;
  closed?: boolean | null;
  preRegister?: boolean | null;
  postRegister?: boolean | null;
}

export interface EventReservationSelectInputs {
  reservationStart?: string;
  reservationEnd?: string;
}

export interface EventReservationSectionCreateInputs {
  name: string;
  shortDescription?: string | null;
  price?: number | string | null; // Assuming OPTIONAL_PRICE is similar to OPTIONAL_NUMBER
  sortOrder?: number | string | null;
  pricePerDay?: boolean | null;
  imageId?: string | null;
}

export interface EventReservationSectionLocationCreateInputs {
  name: string;
  shortDescription?: string | null;
  premium?: number | string | null;
  supply?: number | string | null;
  sortOrder?: number | string | null;
}

export interface EventReservationSectionLocationTranslationUpdateInputs {
  name?: string | null;
  shortDescription?: string | null;
}

export interface EventReservationSectionLocationUpdateInputs {
  name?: string | null;
  shortDescription?: string | null;
  premium?: number | string | null;
  supply?: number | string | null;
  sortOrder?: number | string | null;
}

export interface EventReservationSectionTranslationUpdateInputs {
  name?: string | null;
  shortDescription?: string | null;
}

export interface EventReservationSectionUpdateInputs {
  name?: string | null;
  shortDescription?: string | null;
  price?: number | string | null;
  sortOrder?: number | string | null;
  pricePerDay?: boolean | null;
  imageId?: string | null;
}

export interface EventSessionCreateInputs {
  name: string;
  startTime: string;
  endTime: string;
  slug?: string | null;
  location?: string | null;
  description?: string | null;
  longDescription?: string | null;
  nonSession?: boolean | null;
  imageId?: string | null;
  visible?: boolean | null;
  sortOrder?: number | string | null;
}

export interface EventSessionTranslationUpdateInputs {
  name?: string | null;
  description?: string | null;
  longDescription?: string | null;
}

export interface EventSessionUpdateInputs {
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

export interface EventSpeakerCreateInputs {
  firstName: string;
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
  priority?: number | string | null;
  visible?: boolean | null;
}

export interface EventSpeakerTranslationUpdateInputs {
  title?: string | null;
  bio?: string | null;
}

export interface EventSpeakerUpdateInputs {
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
  priority?: number | string | null;
  visible?: boolean | null;
}

export interface EventTicketTranslationUpdateInputs {
  name?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
}

export interface EventTrackTranslationUpdateInputs {
  name?: string | null;
  description?: string | null;
}

export interface EventTranslationUpdateInputs {
  name?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
}

export interface EventUpdateInputs {
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

export interface FileUpdateInputs {
  name?: string;
  source?: FileSource;
}

export interface GroupCreateInputs {
  name: string;
  description: string;
  featured?: boolean | null;
  slug?: string | null;
  active?: boolean | null;
  access?: keyof typeof GroupAccess | null;
  imageId?: string | null;
  externalUrl?: string | null;
}

export interface GroupMembershipUpdateInputs {
  announcementEmailNotification?: boolean | null;
  announcementPushNotification?: boolean | null;
  activityEmailNotification?: boolean | null;
  activityPushNotification?: boolean | null;
  eventEmailNotification?: boolean | null;
  eventPushNotification?: boolean | null;
  chatPushNotification?: boolean | null;
}

export interface GroupTranslationUpdateInputs {
  name?: string | null;
  description?: string | null;
}

export interface GroupUpdateInputs {
  featured?: boolean | null;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  active?: boolean | null;
  access?: keyof typeof GroupAccess | null;
  imageId?: string | null;
  externalUrl?: string | null;
}

export interface ImageCreateInputs {
  imageDataUri: string;
  name: string;
  description?: string | null;
  type: ImageType;
}

export interface ImageUpdateInputs {
  name?: string | null;
  description?: string | null;
  type?: ImageType;
}

export interface InterestCreateInputs {
  name: string;
  imageId?: string | null;
  featured?: boolean | null;
}

export interface InterestUpdateInputs {
  name?: string | null;
  imageId?: string | null;
  featured?: boolean | null;
}

export interface InvoiceCreateInputs {
  title: string;
  dueDate: string;
  description?: string | null;
  status?: keyof typeof InvoiceStatus | null;
  notes?: string | null;
  accountId?: string | null;
}

export interface InvoiceLineItemCreateInputs {
  name: string;
  description: string;
  quantity: string | number;
  amount: string;
}

export interface InvoiceLineItemUpdateInputs {
  name?: string | null;
  description?: string | null;
  quantity?: string | number | null;
  amount?: string | null;
}

export interface InvoiceUpdateInputs {
  title?: string | null;
  description?: string | null;
  status?: keyof typeof InvoiceStatus | null;
  dueDate?: string | null;
  notes?: string | null;
  accountId?: string | null;
}

export interface LeadCreateInputs {
  note?: string | null;
}

export interface LeadUpdateInputs {
  note?: string | null;
}

export interface NotificationPreferencesCreateInputs {
  // No fields defined in the provided validation object
}

export interface NotificationPreferencesUpdateInputs {
  // No fields defined in the provided validation object
}

export interface OrganizationPageCreateInputs {
  title: string;
  subtitle?: string | null;
  html?: string | null;
}

export interface OrganizationPageTranslationUpdateInputs {
  title?: string | null;
  subtitle?: string | null;
  html?: string | null;
}

export interface OrganizationPageUpdateInputs {
  title?: string | null;
  subtitle?: string | null;
  html?: string | null;
}

export interface OrganizationUpdateInputs {
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

export interface PaymentIntentPurchaseMetadataInputs {}

export interface PushDeviceCreateInputs {}

export interface PushDeviceUpdateInputs {}

export interface EventQuestionChoiceCreateInputs {
  value: string;
  text?: string | null;
  supply?: number | string | null;
  description?: string | null;
  sortOrder?: number | string | null;
}

export interface EventQuestionChoiceTranslationUpdateInputs {
  value?: string | null;
  text?: string | null;
  description?: string | null;
}

export interface EventQuestionChoiceUpdateInputs {
  value?: string | null;
  text?: string | null;
  supply?: number | string | null;
  description?: string | null;
  sortOrder?: number | string | null;
}

export interface EventQuestionCreateInputs {
  name: string;
  type: keyof typeof RegistrationQuestionType | null;
  sectionId?: number;
  questionId?: number;
  choiceId?: number;
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
  choices?: string[] | null;
}

export interface EventQuestionSearchInputs {
  value: string;
  top?: boolean | null;
}

export interface EventQuestionSearchValueUpdateInputs {
  value?: string | null;
  top?: boolean | null;
}

export interface EventQuestionTranslationUpdateInputs {
  label?: string | null;
  placeholder?: string | null;
  description?: string | null;
}

export interface EventQuestionUpdateInputs {
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

export interface ReportCreateInputs {
  name: string;
  parentId: string | number;
  eventId?: string | null;
  description?: string | null;
  filters?: string | null;
  columns?: string | null;
  charts?: string | null;
  advancedFilter?: string | null;
}

export interface ReportUpdateInputs {
  name?: string | null;
  description?: string | null;
  filters?: string | null;
  columns?: string | null;
  charts?: string | null;
  advancedFilter?: string | null;
}

export interface EventSectionCreateInputs {
  name: string;
  description?: string | null;
  guestDescription?: string | null;
  sortOrder?: number | string | null;
}

export interface EventSectionTranslationUpdateInputs {
  name?: string | null;
  description?: string | null;
  guestDescription?: string | null;
}

export interface EventSectionUpdateInputs {
  name?: string | null;
  description?: string | null;
  guestDescription?: string | null;
  sortOrder?: number | string | null;
}

export interface SeriesCreateInputs {
  name: string;
  slug?: string | null;
  description?: string | null;
  imageId?: string | null;
  sortOrder?: number | string | null;
}

export interface SeriesUpdateInputs {
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  imageId?: string | null;
  sortOrder?: number | string | null;
}

export interface LevelCreateInputs {
  name: string;
  slug?: string | null;
  subtitle?: string | null;
  description?: string | null;
  color?: string | null;
  scale?: number | string | null;
  imageId?: string | null;
  sortOrder?: number | string | null;
}

export interface LevelTranslationUpdateInputs {
  name?: string | null;
  subtitle?: string | null;
  description?: string | null;
}

export interface LevelUpdateInputs {
  name?: string | null;
  slug?: string | null;
  subtitle?: string | null;
  description?: string | null;
  color?: string | null;
  scale?: number | string | null;
  imageId?: string | null;
  sortOrder?: number | string | null;
}

export interface StreamInputCreateInputs {
  name: string;
  sortOrder?: number | string | null;
  eventId?: string | null;
  sessionId?: string | null;
  details?: object | null;
}

export interface StreamInputUpdateInputs {
  name?: string;
  sortOrder?: number | string | null;
  eventId?: string | null;
  sessionId?: string | null;
  details?: object | null;
}

export interface StreamInputOutputCreateInputs {
  enabled: boolean;
  url: string;
  streamKey: string;
}
export interface StreamInputOutputUpdateInputs {
  enabled: boolean;
}

export interface StreamOutputCreateInputs {
  enabled: boolean;
  streamKey: string;
  url: string;
}

export interface SubscriptionProductCreateInputs {
  name: string;
  active?: boolean | null;
  description?: string | null;
  statementDescriptor?: string | null;
  features?: string[] | null;
}

export interface SubscriptionProductPriceCreateInputs {
  active?: boolean | null;
  type: keyof typeof SubscriptionProductPriceType;
  amount: string | number; // Assuming REQUIRED_PRICE can be string or number
  currency: "usd"; // Assuming currency is limited to 'usd'
  interval: keyof typeof SubscriptionProductPriceInterval;
  intervalCount: string | number;
}

export interface SubscriptionProductPriceUpdateInputs {
  active?: boolean | null;
}

export interface SubscriptionProductUpdateInputs {
  active?: boolean | null;
  name?: string | null;
  description?: string | null;
  statementDescriptor?: string | null;
  features?: string[] | null;
}

export interface SubscriptionCreateInputs {
  status?: SubscriptionStatus;
  expiresAt?: string | null;
  cancelAtEnd?: boolean | null;
  integrationId?: string | null;
  subscriptionProductId?: string | null;
  subscriptionProduct?: BaseSubscriptionProduct;
  accountId?: string | null;
  account?: BaseAccount;
  priceId?: string | null;
  price?: BaseSubscriptionProductPrice;
}

export interface SubscriptionUpdateInputs {
  accountId?: string | null;
}

export interface SupportTicketCreateInputs {
  // No fields defined in the provided validation object
}

export interface SupportTicketUpdateInputs {
  status?: "new" | "inProgress" | "complete";
}

export interface TeamCreateInputs {
  name: string;
  email: string;
  username?: string | null;
}

export interface OrganizationTeamMemberCreateInputs {
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

export interface OrganizationTeamMemberUpdateInputs {
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

export interface TeamUpdateInputs {
  name?: string | null;
  email?: string | null;
  username?: string | null;
}

export interface ThreadCreateInputs {
  access: keyof typeof ThreadAccessLevel;
  name: string;
  description?: string | null;
  featured?: boolean | null;
  visible?: boolean | null;
  groupId?: string | null;
  eventId?: string | null;
}

export interface ThreadUpdateInputs {
  name?: string | null;
  description?: string | null;
  featured?: boolean | null;
  visible?: boolean | null;
  access?: keyof typeof ThreadAccessLevel | null;
  groupId?: string | null;
  eventId?: string | null;
}

export interface EventTicketCreateInputs {
  name: string;
  shortDescription: string;
  price: string | number; // Assuming REQUIRED_PRICE can be string or number
  visibility?: keyof typeof TicketVisibility | null;
  featured?: boolean | null;
  active?: boolean | null;
  transferable?: boolean | null;
  slug?: string | null;
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

export interface EventTicketUpdateInputs {
  visibility?: keyof typeof TicketVisibility | null;
  featured?: boolean | null;
  active?: boolean | null;
  transferable?: boolean | null;
  name?: string | null;
  slug?: string | null;
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

export interface TierCreateInputs {
  name: string;
  slug?: string | null;
  iconName?: string | null;
  priority?: number | string | null;
  description?: string | null;
  imageId?: string | null;
  color?: string | null;
  internal?: boolean | null;
}

export interface TierUpdateInputs {
  name?: string | null;
  slug?: string | null;
  iconName?: string | null;
  priority?: number | string | null;
  description?: string | null;
  imageId?: string | null;
  color?: string | null;
  internal?: boolean | null;
}

export interface EventTrackCreateInputs {
  name: string;
  slug?: string | null;
  description?: string | null;
  color?: string | null;
}

export interface EventTrackUpdateInputs {
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  color?: string | null;
}

export interface TriggerCreateInputs {
  code: string;
  enabled?: boolean | null;
}

export interface TriggerUpdateInputs {
  code?: string | null;
  enabled?: boolean | null;
}

export interface UserCreateInputs {
  // No fields defined in the provided validation object
}

export interface UserUpdateInputs {
  title?: string | null;
}

export interface VideoUpdateInputs {
  name?: string;
  thumbnailPct?: number | null;
}
