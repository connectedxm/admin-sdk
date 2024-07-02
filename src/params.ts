import { AccountType, AdvertisementType } from "./interfaces";

export interface AccountCreateParams {
  accountType: keyof typeof AccountType;
  email: string;
  username: string;
  featured?: boolean;
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
  accountType?: keyof typeof AccountType;
  featured?: boolean;
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
  message?: string;
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
  startDate: string | null;
  description?: string | null;
  imageId?: string | null;
  endDate?: string | null;
  weight?: number | null;
  accountId?: string | null;
  eventId?: string | null;
  eventOnly?: boolean | null;
}

export interface AdvertisementUpdateParams {
  type?: keyof typeof AdvertisementType;
  link?: string;
  title?: string;
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

export interface BenefitCreateParams {
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
  name?: string | null;
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

export interface ChannelContentInterestCreateParams {
  name?: string | null;
}

export interface ChannelCreateParams {
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

export interface ChannelInterestCreateParams {
  name?: string | null;
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

export interface ContentCreateParams {
  type?: "todo" | "todo" | string | null; // Assuming ContentType keys are the valid strings
  published?: string | null;
  channelId?: string | null;
  featured?: boolean;
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
export interface ContentGuestCreateParams {
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

export interface ContentGuestTranslationUpdateParams {
  title?: string | null;
  bio?: string | null;
  companyBio?: string | null;
}

export interface ContentGuestUpdateParams {
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

export interface ContentTranslationUpdateParams {
  title?: string | null;
  description?: string | null;
  body?: string | null;
}

export interface ContentUpdateParams {
  type?: "todo" | "todo" | string | null;
  published?: string | null;
  channelId?: string | null;
  featured?: boolean;
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

export interface EventActivationUpdateTranslationParams {
  name?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
}

export interface EventActivationUpdateParams {
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

export interface EventAddOnCreateParams {
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
export interface EventAddOnUpdateTranslationParams {
  name?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
}

export interface EventAddOnUpdateParams {
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

export interface EventBadgeFieldUpdateParams {
  type?: "todo" | "todo" | string | null;
  lookup?: string | null;
  maxLength?: number | string | null;
  defaultValue?: string | null;
  transformation?: "todo" | "todo" | string | null;
  sortOrder?: number | string | null;
}

export interface EventCreateCouponParams {
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

export interface EventFaqSectionQuestionsParams {
  question?: string | null;
  slug?: string | null;
  answer?: string | null;
  priority?: number | string | null;
  visible?: boolean | null;
}

export interface EventFaqSectionParams {
  name?: string | null;
  slug?: string | null;
  priority?: number | string | null;
}

export interface EventCreateParams {
  featured?: boolean;
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

export interface EventPageCreateParams {
  slug?: string | null;
  title?: string | null;
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
  slug?: string | null;
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
  usedAt?: Date | null;
  ticketId?: string | null;
  paid?: boolean | null;
  reservationStart?: Date | null;
  reservationEnd?: Date | null;
}

export interface EventRegistrationBypassCreateParams {
  accountId?: string | null;
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
  name?: string | null;
  shortDescription?: string | null;
  price?: number | null;
  sortOrder?: number | null;
  pricePerDay?: boolean | null;
  imageId?: string | null;
}

//EVENT RESERVATION SECTION LOCATION
export interface EventReservationSectionLocationCreateParams {
  name?: string | null;
  shortDescription?: string | null;
  premium?: number | null;
  supply?: number | null;
  sortOrder?: number | null;
}

export interface EventReservationSectionLocationUpdateParams {
  name?: string | null;
  shortDescription?: string | null;
  premium?: number | null;
  supply?: number | null;
  sortOrder?: number | null;
}

//EVENT RESERVATION SECTION TRANSLATION
export interface EventReservationSectionTranslationUpdateParams {
  name?: string | null;
  shortDescription?: string | null;
}

export interface EventReservationSectionUpdateParams {
  name?: string | null;
  shortDescription?: string | null;
  price?: string | null;
  sortOrder?: number | null;
  pricePerDay?: boolean | null;
  imageId?: string | null;
}

//EVENT SESSION
export interface EventSessionCreateParams {
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
export interface EventSessionTranslationUpdateParams {
  name?: string | null;
  description?: string | null;
  longDescription?: string | null;
}

export interface EventSessionUpdateParams {
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

export interface EventSpeakerCreateParams {
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
export interface EventSpeakerTranslationUpdateParams {
  title?: string | null;
  bio?: string | null;
}

export interface EventSpeakerUpdateParams {
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

export interface EventUpdateCouponParams {
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

export interface EventUpdateEmailParams {
  body?: string | null;
  replyTo?: string | null;
}

// EVENT FAQ SECTION QUESTIONS TRANSLATION
export interface EventUpdateFaqSectionQuestionsTranslationParams {
  question?: string | null;
  answer?: string | null;
}

export interface EventUpdateFaqSectionQuestionsParams {
  question?: string | null;
  slug?: string | null;
  answer?: string | null;
  priority?: number | null;
  visible?: boolean | null;
}

//EVENT FAQ SECTIONS TRANSLATIONS
export interface EventUpdateFaqSectionTranslationParams {
  name?: string | null;
}

export interface EventUpdateFaqSectionParams {
  name?: string | null;
  slug?: string | null;
  priority?: number | null;
}

//EVENT RESERVATION SECTION LOCATION TRANSLATION
export interface EventUpdateReservationSectionLocationTranslationParams {
  name?: string | null;
  shortDescription?: string | null;
}

export interface EventUpdateParams {
  featured?: boolean;
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

export interface GroupCreateParams {
  featured?: boolean;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  active?: boolean | null;
  access?: "public" | "private" | null;
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
  featured?: boolean;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  active?: boolean | null;
  access?: "public" | "private" | null;
  imageId?: string | null;
  externalUrl?: string | null;
}

export interface InterestCreateParams {
  name?: string | null;
  imageId?: string | null;
  featured?: boolean;
}

export interface InterestUpdateParams {
  name?: string | null;
  imageId?: string | null;
  featured?: boolean;
}

export interface InvoiceCreateParams {
  title?: string | null;
  description?: string | null;
  status?: "todo" | "todo";
  dueDate?: Date | null;
  notes?: string | null;
  accountId?: string | null;
}

export interface InvoiceLineItemCreateParams {
  name?: string | null;
  description?: string | null;
  quantity?: number | null;
  amount?: number | null;
}

export interface InvoiceLineItemUpdateParams {
  name?: string | null;
  description?: string | null;
  quantity?: number | null;
  amount?: number | null;
}

export interface InvoiceUpdateParams {
  title?: string | null;
  description?: string | null;
  status?: "todo" | "todo";
  dueDate?: Date | null;
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

export interface NotificationPreferencesUpdateParams {
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

export interface OrganizationPageCreateParams {
  title?: string | null;
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

export interface PaymentIntentPurchaseMetadataParams {
  purchaseId?: string | null;
  addOnIds?: (string | null)[] | null;
}

export interface PushDeviceCreateParams {
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

export interface PushDeviceUpdateParams {
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

export interface QuestionChoiceCreateParams {
  value?: string | null;
  text?: string | null;
  supply?: number | null;
  description?: string | null;
  sortOrder?: number | null;
}

export interface QuestionChoiceTranslationUpdateParams {
  value?: string | null;
  text?: string | null;
  description?: string | null;
}

export interface QuestionChoiceUpdateParams {
  value?: string | null;
  text?: string | null;
  supply?: number | null;
  description?: string | null;
  sortOrder?: number | null;
}

export interface QuestionCreateParams {
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
  featured?: boolean;
}

export interface QuestionSearchValueCreateParams {
  value?: string | null;
  top?: boolean | null;
}

export interface QuestionSearchValueUpdateParams {
  value?: string | null;
  top?: boolean | null;
}

export interface QuestionTranslationUpdateParams {
  label?: string | null;
  placeholder?: string | null;
  description?: string | null;
}

export interface QuestionUpdateParams {
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
  featured?: boolean;
}

export interface ReportCreateParams {
  name: string;
  parentId: number;
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

export interface SectionCreateParams {
  name?: string | null;
  description?: string | null;
  guestDescription?: string | null;
  sortOrder?: number | null;
}

export interface SectionUpdateParams {
  name?: string | null;
  description?: string | null;
  guestDescription?: string | null;
  sortOrder?: number | null;
}

export interface SeriesCreateParams {
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  imageId?: string | null;
  sortOrder?: number | null;
}

export interface SeriesUpdateParams {
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  imageId?: string | null;
  sortOrder?: number | null;
}

export interface SponsorshipLevelCreateParams {
  name?: string | null;
  slug?: string | null;
  subtitle?: string | null;
  description?: string | null;
  color?: string | null;
  scale?: number | null;
  imageId?: string | null;
  sortOrder?: number | null;
}

export interface SponsorshipLevelTranslationUpdateParams {
  name?: string | null;
  subtitle?: string | null;
  description?: string | null;
}

export interface SponsorshipLevelUpdateParams {
  name?: string | null;
  slug?: string | null;
  subtitle?: string | null;
  description?: string | null;
  color?: string | null;
  scale?: number | null;
  imageId?: string | null;
  sortOrder?: number | null;
}

export interface StreamOutputCreateParams {
  enabled: boolean;
  streamKey: string;
  url: string;
}

export interface SubscriptionProductCreateParams {
  active?: boolean | null;
  name?: string | null;
  description?: string | null;
  statementDescriptor?: string | null;
  features?: (string | null)[] | null;
}

export interface SubscriptionProductPriceCreateParams {
  active?: boolean | null;
  type?: "flat" | null;
  amount: number;
  currency?: "usd" | null;
  interval: "day" | "week" | "month" | "year";
  intervalCount: number;
}

export interface SubscriptionProductPriceUpdateParams {
  active?: boolean | null;
}

export interface SubscriptionProductUpdateParams {
  active?: boolean | null;
  name?: string | null;
  description?: string | null;
  statementDescriptor?: string | null;
  features?: (string | null)[] | null;
}

export interface SubscriptionUpdateParams {
  accountId?: string | null;
}

export interface SupportTicketCreateParams {
  type?: "todo" | "todo";
  email?: string | null;
  request?: string | null;
  accountId?: string | null;
  eventId?: string | null;
  status?: "new" | "inProgress" | "complete" | null;
}

export interface SupportTicketUpdateParams {
  type?: "todo" | "todo";
  email?: string | null;
  request?: string | null;
  accountId?: string | null;
  eventId?: string | null;
  status?: "new" | "inProgress" | "complete" | null;
}

export interface TeamCreateParams {
  name: string;
  email?: string | null;
  username?: string | null;
}

export interface TeamMemberCreateParams {
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

export interface TeamMemberUpdateParams {
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

export interface TeamUpdateParams {
  name?: string;
  email?: string | null;
  username?: string;
}

export interface ThreadCreateParams {
  name?: string;
  description?: string;
  featured?: boolean;
  visible?: boolean | null;
  access?: "";
  groupId?: string | null;
  eventId?: string | null;
}

export interface ThreadUpdateParams {
  name?: string;
  description?: string;
  featured?: boolean;
  visible?: boolean | null;
  access?: "todo" | "todo";
  groupId?: string | null;
  eventId?: string | null;
}

export interface TicketCreateParams {
  visibility?: "todo" | "todo";
  featured?: boolean;
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

export interface TicketUpdateParams {
  visibility?: "todo" | "todo";
  featured?: boolean;
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

export interface TierCreateParams {
  name?: string | null;
  slug?: string | null;
  iconName?: string | null;
  priority?: number | null;
  description?: string | null;
  imageId?: string | null;
  color?: string | null;
  internal?: boolean | null;
}

export interface TierUpdateParams {
  name?: string | null;
  slug?: string | null;
  iconName?: string | null;
  priority?: number | null;
  description?: string | null;
  imageId?: string | null;
  color?: string | null;
  internal?: boolean | null;
}
export interface TrackCreateParams {
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  color?: string | null;
}

export interface TrackUpdateParams {
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  color?: string | null;
}

export interface TriggerCreateParams {
  code?: string | null;
  enabled?: boolean | null;
}

export interface TriggerUpdateParams {
  code?: string | null;
  enabled?: boolean | null;
}

export interface UserCreateParams {
  title?: string | null;
}

export interface UserUpdateParams {
  title?: string | null;
}
