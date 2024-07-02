export interface AccountCreateValidation {
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

export interface AccountUpdateValidation {
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

export interface ActivityCreateValidation {
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

export interface ActivityUpdateValidation {
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

export interface AdvertisementCreateValidation {
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

export interface AdvertisementUpdateValidation {
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

export interface AnnouncementCreateValidation {
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

export interface BenefitCreateValidation {
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

export interface BenefitTranslationUpdateValidation {
  title?: string | null;
  description?: string | null;
}

export interface BenefitUpdateValidation {
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

export interface ChannelCollectionCreateValidation {
  name?: string | null;
  description?: string | null;
}

export interface ChannelCollectionTranslationUpdateValidation {
  name?: string | null;
  description?: string | null;
}

export interface ChannelCollectionUpdateValidation {
  name?: string | null;
  description?: string | null;
}

export interface ChannelContentInterestCreateValidation {
  name?: string | null;
}

export interface ChannelCreateValidation {
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

export interface ChannelInterestCreateValidation {
  name?: string | null;
}

export interface ChannelSubscriberUpdateValidation {
  contentEmailNotification?: boolean | null;
  contentPushNotification?: boolean | null;
}

export interface ChannelTranslationUpdateValidation {
  name?: string | null;
  description?: string | null;
}

export interface ChannelUpdateValidation {
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

export interface ContentCreateValidation {
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
export interface ContentGuestCreateValidation {
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

export interface ContentGuestTranslationUpdateValidation {
  title?: string | null;
  bio?: string | null;
  companyBio?: string | null;
}

export interface ContentGuestUpdateValidation {
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

export interface ContentTranslationUpdateValidation {
  title?: string | null;
  description?: string | null;
  body?: string | null;
}

export interface ContentUpdateValidation {
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

export interface EventActivationCreateValidation {
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

export interface EventActivationUpdateTranslationValidation {
  name?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
}

export interface EventActivationUpdateValidation {
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

export interface EventAddOnCreateValidation {
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
export interface EventAddOnUpdateTranslationValidation {
  name?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
}

export interface EventAddOnUpdateValidation {
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

export interface EventBadgeFieldUpdateValidation {
  type?: "todo" | "todo" | string | null;
  lookup?: string | null;
  maxLength?: number | string | null;
  defaultValue?: string | null;
  transformation?: "todo" | "todo" | string | null;
  sortOrder?: number | string | null;
}

export interface EventCreateCouponValidation {
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

export interface EventFaqSectionQuestionsValidation {
  question?: string | null;
  slug?: string | null;
  answer?: string | null;
  priority?: number | string | null;
  visible?: boolean | null;
}

export interface EventFaqSectionValidation {
  name?: string | null;
  slug?: string | null;
  priority?: number | string | null;
}

export interface EventCreateValidation {
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

export interface EventPageCreateValidation {
  slug?: string | null;
  title?: string | null;
  subtitle?: string | null;
  html?: string | null;
  sortOrder?: number | string | null;
}

export interface EventPageTranslationUpdateValidation {
  title?: string | null;
  subtitle?: string | null;
  html?: string | null;
}

export interface EventPageUpdateValidation {
  slug?: string | null;
  title?: string | null;
  subtitle?: string | null;
  html?: string | null;
  sortOrder?: number | string | null;
}

export interface EventPurchaseCreateValidation {
  location?: string | null;
  usedAt?: string | null;
  ticketId?: string | null;
  paid?: boolean | null;
  reservationStart?: string | null;
  reservationEnd?: string | null;
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
