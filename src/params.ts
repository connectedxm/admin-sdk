import {
  AdvertisementType,
  BadgeFieldTransformation,
  BadgeFieldType,
  ContentGuestType,
  EventAgendaVisibility,
  EventType,
  GroupAccess,
  RegistrationQuestionType,
  PassTypeVisibility,
  PassTypeAccessLevel,
  ImageType,
  FileSource,
  ModulePermissions,
  AuthLayout,
  DefaultAuthAction,
  BaseSupportTicketNote,
  SupportTicketType,
  ImportType,
  EventAnnouncementFilters,
  PurchaseStatus,
  IntegrationType,
  LeadStatus,
  SurveyQuestionType,
  ReportFilters,
  CustomModulePosition,
  MatchQuestionType,
  EventSessionQuestionType,
  ModerationStatus,
  ActivityEntityType,
  ThreadCircleAccountRole,
  AccountAccess,
  SessionAccess,
  SupportTicketState,
  EventActivationType,
  TaxLocationType,
  LocationQuestionOption,
  MeetingType,
  PaymentIntegrationType,
} from "./interfaces";

export interface AccountCreateInputs {
  email: string;
  username?: string | null;
  featured?: boolean;
  firstName?: string | null;
  lastName?: string | null;
  imageId?: string | null;
  bannerId?: string | null;
  phone?: string | null;
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
  country?: string | null;
  internalRefId?: string | null;
  verified?: boolean;
  locale?: string | null;
  taxEntityUseCode?: string | null;
  attributes?: Record<string, string> | null;
}

export interface AccountUpdateInputs {
  accountAccess?: keyof typeof AccountAccess | null;
  featured?: boolean;
  firstName?: string | null;
  lastName?: string | null;
  imageId?: string | null;
  bannerId?: string | null;
  username?: string | null;
  email?: string | null;
  phone?: string | null;
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
  country?: string | null;
  internalRefId?: string | null;
  verified?: boolean;
  locale?: string | null;
  taxEntityUseCode?: string | null;
  attributes?: Record<string, string> | null;
}

export interface AccountAddressCreateInputs {
  name?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

export interface AccountAddressUpdateInputs {
  primary?: boolean;
  name?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
}

export interface ImportCreateInputs {
  values?: { email: string }[] | null;
  type?: ImportType | null;
}

export interface BaseActivityEntityInput {
  type: keyof typeof ActivityEntityType;
  startIndex: number;
  endIndex: number;
  marks: ("bold" | "italic" | "underline" | "strike")[];
}

export interface MentionInputs extends BaseActivityEntityInput {
  type: "mention";
  username: string;
}

export interface InterestInputs extends BaseActivityEntityInput {
  type: "interest";
  interest: string;
}

export interface LinkInputs extends BaseActivityEntityInput {
  type: "link";
  href: string;
}

export interface SegmentInputs extends BaseActivityEntityInput {
  type: "segment";
}

type ActivityEntityInputs =
  | MentionInputs
  | LinkInputs
  | InterestInputs
  | SegmentInputs;

export interface ActivityCreateInputs {
  message: string;
  entities?: ActivityEntityInputs[] | null;
  featured?: boolean;
  imageId?: string | null;
  videoId?: string | null;
  eventId?: string | null;
  groupId?: string | null;
  contentId?: string | null;
  commentedId?: string | null;
  createdAt?: string | null;
}

export interface ActivityUpdateInputs {
  accountId?: string | null;
  message?: string | null;
  entities?: ActivityEntityInputs[] | null;
  moderation?: keyof typeof ModerationStatus | null;
  featured?: boolean;
  pinned?: boolean;
  imageId?: string | null;
  videoId?: string | null;
  createdAt?: string | null;
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
  eventOnly?: boolean;
  enabled?: boolean;
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
  eventOnly?: boolean;
  enabled?: boolean;
}

export interface AnnouncementCreateInputs {
  title: string | null;
  html?: string | null;
  slug?: string | null;
  creatorId?: string | null;
  eventId?: string | null;
  groupId?: string | null;
  tierId?: string | null;
  channelId?: string | null;
  accountId?: string | null;
  verifiedAccounts?: boolean | null;
  sponsorshipLevelId?: string | null;
  email?: boolean;
  push?: boolean;
  filters?: EventAnnouncementFilters | null;
  includePasses?: boolean;
}

export interface AnnouncementUpdateInputs {
  title?: string | null;
  html?: string | null;
  slug?: string | null;
  email?: boolean;
  push?: boolean;
  filters?: EventAnnouncementFilters | null;
  includePasses?: boolean;
}

export interface AnnouncementTranslationUpdateInputs {
  title?: string | null;
  html?: string | null;
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
  eventOnly?: boolean;
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
  eventOnly?: boolean;
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
  bannerId?: string | null;
  slug?: string | null;
  featured?: boolean;
  description?: string | null;
  priority?: number | string | null;
  visible?: boolean;
  private?: boolean;
  externalUrl?: string | null;
  appleUrl?: string | null;
  spotifyUrl?: string | null;
  googleUrl?: string | null;
  youtubeUrl?: string | null;
  groupId?: string | null;
  creatorId?: string | null;
}

export interface ChannelSubscriberUpdateInputs {
  contentEmailNotification?: boolean;
  contentPushNotification?: boolean;
}

export interface ChannelTranslationUpdateInputs {
  name?: string | null;
  description?: string | null;
}

export interface ChannelUpdateInputs {
  name?: string | null;
  imageId?: string | null;
  bannerId?: string | null;
  slug?: string | null;
  featured?: boolean;
  description?: string | null;
  priority?: number | string | null;
  visible?: boolean;
  private?: boolean;
  externalUrl?: string | null;
  appleUrl?: string | null;
  spotifyUrl?: string | null;
  googleUrl?: string | null;
  youtubeUrl?: string | null;
  groupId?: string | null;
  creatorId?: string | null;
}

export interface ChannelContentCreateInputs {
  title: string;
  published?: string | null;
  channelId?: string | null;
  featured?: boolean;
  slug?: string | null;
  description?: string | null;
  duration?: string | null;
  body?: string | null;
  imageUrl?: string | null;
  imageId?: string | null;
  squareImageId?: string | null;
  audioId?: number | null;
  videoId?: string | null;
  externalUrl?: string | null;
  appleUrl?: string | null;
  spotifyUrl?: string | null;
  googleUrl?: string | null;
  youtubeUrl?: string | null;
}

export interface ChannelContentGuestCreateInputs {
  name: string;
  type: keyof typeof ContentGuestType | null;
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
  imageId?: string | null;
  videoId?: string | null;
  audioId?: number | null;
}

export interface ChannelContentUpdateInputs {
  channelId?: string | null;
  featured?: boolean;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  duration?: string | null;
  body?: string | null;
  imageUrl?: string | null;
  imageId?: string | null;
  squareImageId?: string | null;
  audioId?: number | null;
  videoId?: string | null;
  externalUrl?: string | null;
  appleUrl?: string | null;
  spotifyUrl?: string | null;
  googleUrl?: string | null;
  youtubeUrl?: string | null;
  email?: boolean;
  push?: boolean;
}

export interface EventActivationCreateInputs {
  name: string;
  shortDescription: string;
  visible?: boolean;
  imageId?: string | null;
  slug?: string | null;
  longDescription?: string | null;
  maxPoints?: number | string | null;
  startAfter?: string | null;
  type?: keyof typeof EventActivationType;
  protectionCode?: number | string | null;
  email?: boolean;
  push?: boolean;
  accessLevel?: keyof typeof PassTypeAccessLevel;
}

export interface EventActivationTranslationUpdateInputs {
  name?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
}

export interface EventActivationUpdateInputs {
  imageId?: string | null;
  name?: string | null;
  slug?: string | null;
  visible?: boolean;
  shortDescription?: string | null;
  longDescription?: string | null;
  maxPoints?: number | string | null;
  startAfter?: string | null;
  type?: keyof typeof EventActivationType;
  protectionCode?: number | string | null;
  accessLevel?: keyof typeof PassTypeAccessLevel;
}

export interface EventActivationCompletionCreateInputs {
  passId: string;
  earnedPoints: number | string | null;
}

export interface EventActivationCompletionUpdateInputs {
  earnedPoints: number | string | null;
}

export interface EventAddOnCreateInputs {
  name: string;
  shortDescription: string;
  longDescription?: string | null;
  price: number | string | null;
  pricePerNight?: boolean;
  supply?: number | string | null;
  sortOrder?: number | string | null;
  imageId?: string | null;
  taxCode?: string | null;
  taxIncluded?: boolean;
  taxLocation?: keyof typeof TaxLocationType;
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
  pricePerNight?: boolean;
  supply?: number | string | null;
  sortOrder?: number | string | null;
  imageId?: string | null;
  taxCode?: string | null;
  taxIncluded?: boolean;
  taxLocation?: keyof typeof TaxLocationType;
}

export interface EventBadgeFieldUpdateInputs {
  type?: keyof typeof BadgeFieldType | null;
  lookup?: string | null;
  maxLength?: number | string | null;
  defaultValue?: string | null;
  transformation?: keyof typeof BadgeFieldTransformation | null;
  sortOrder?: number | string | null;
  iconData?: string | null;
  sessionId?: string | null;
}

export interface EventCouponCreateInputs {
  code: string;
  description?: string | null;
  active?: boolean;
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
  applyToPassType?: boolean;
  applyToAddOns?: boolean;
  applyToReservation?: boolean;
}

export interface EventCouponUpdateInputs {
  code?: string | null;
  description?: string | null;
  active?: boolean;
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
  applyToPassType?: boolean;
  applyToAddOns?: boolean;
  applyToReservation?: boolean;
}

export interface EventVariantCouponCreateInputs {
  quantity?: number;
}

export interface EventVariantCouponSyncInputs {
  fields?: string[];
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
  timezone: string;
  eventStart: string;
  eventEnd: string;
  featured?: boolean;
  visible?: boolean;
  slug?: string | null;
  internalRefId?: string | null;
  longDescription?: string | null;
  reservationDescription?: string | null;
  externalUrl?: string | null;
  imageId?: string | null;
  squareImageId?: string | null;
  backgroundImageId?: string | null;
  venue?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip?: string | null;
  creatorId?: string | null;
  seriesId?: string | null;
  registration?: boolean;
  registrationStart?: string | null;
  registrationEnd?: string | null;
  registrationHeaderImageId?: string | null;
  registrationFooterImageId?: string | null;
  registrationHideTitle?: boolean;
  registrationLimit?: number | string | null;
  allowMultipleRegistrations?: boolean;
  allowSplitPayment?: boolean;
  splitPaymentPercentage?: number | string;
  splitPaymentNetDays?: number | string | null;
  splitPaymentDueDate?: string | null;
  publicRegistrants?: boolean;
  sessionsVisibility?: keyof typeof EventAgendaVisibility;
  speakersVisibility?: keyof typeof EventAgendaVisibility;
  iosAppLink?: string | null;
  androidAppLink?: string | null;
  newActivityCreatorEmailNotification?: boolean;
  newActivityCreatorPushNotification?: boolean;
  streamReplayId?: string | null;
  groupId?: string | null;
  groupOnly?: boolean;
  passSupply?: number | string | null;
  passLimitPerAccount?: string | number | null;
  roundName?: string | null;
  matchName?: string | null;
  activityFeedEnabled?: boolean;
  options?: object | null;
  paymentIntegrationId?: string | null;
  template?: boolean;
  meetingId?: string | null;
}

export interface EventUpdateInputs {
  featured?: boolean;
  visible?: boolean;
  name?: string | null;
  eventType?: keyof typeof EventType | null;
  slug?: string | null;
  internalRefId?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
  reservationDescription?: string | null;
  timezone?: string | null;
  eventStart?: string | null;
  eventEnd?: string | null;
  externalUrl?: string | null;
  imageId?: string | null;
  squareImageId?: string | null;
  backgroundImageId?: string | null;
  venue?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip?: string | null;
  creatorId?: string | null;
  seriesId?: string | null;
  registration?: boolean;
  registrationStart?: string | null;
  registrationEnd?: string | null;
  registrationHeaderImageId?: string | null;
  registrationFooterImageId?: string | null;
  registrationHideTitle?: boolean;
  registrationLimit?: number | null | string;
  allowMultipleRegistrations?: boolean;
  allowSplitPayment?: boolean;
  splitPaymentPercentage?: number | string;
  splitPaymentNetDays?: number | string | null;
  splitPaymentDueDate?: string | null;
  publicRegistrants?: boolean;
  sessionsVisibility?: keyof typeof EventAgendaVisibility;
  speakersVisibility?: keyof typeof EventAgendaVisibility;
  inviteOnly?: boolean;
  iosAppLink?: string | null;
  androidAppLink?: string | null;
  newActivityCreatorEmailNotification?: boolean;
  newActivityCreatorPushNotification?: boolean;
  streamReplayId?: string | null;
  groupId?: string | null;
  groupOnly?: boolean;
  passSupply?: number | string | null;
  passLimitPerAccount?: string | number | null;
  roundName?: string | null;
  matchName?: string | null;
  activityFeedEnabled?: boolean;
  options?: object | null;
  paymentIntegrationId?: string | null;
  meetingId?: string | null;
}

export interface EventEmailUpdateInputs {
  body?: string | null;
  replyTo?: string | null;
  calendarFile?: boolean;
  enabled?: boolean;
}

export interface EventEmailTranslationUpdateInputs {
  body?: string | null;
}

export interface EventFaqSectionQuestionCreateInputs {
  question: string;
  answer?: string;
  slug?: string | null;
  priority?: number | string | null;
  visible?: boolean;
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
  visible?: boolean;
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
  active?: boolean;
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
  active?: boolean;
  subtitle?: string | null;
  html?: string | null;
  sortOrder?: number | string | null;
}

export interface EventPassCreateInputs {
  status?: PurchaseStatus | null;
  location?: string | null;
  ticketId?: string | null;
  usedAt?: string | null;
}

export interface EventPassUpdateInputs {
  status?: PurchaseStatus | null;
  location?: string | null;
  ticketId?: string | null;
  couponId?: string | null;
  usedAt?: string | null;
}

export interface EventAttendeeUpdateInputs {}

export interface EventRegistrationBypassCreateInputs {
  accountId: string;
  closed?: boolean;
  preRegister?: boolean;
  postRegister?: boolean;
}

export interface EventRegistrationBypassUpdateInputs {
  accountId?: string | null;
  closed?: boolean;
  preRegister?: boolean;
  postRegister?: boolean;
}

export interface EventSessionCreateInputs {
  name: string;
  startTime: string;
  endTime: string;
  registrationEnd?: string | null;
  slug?: string | null;
  description?: string | null;
  longDescription?: string | null;
  nonSession?: boolean;
  imageId?: string | null;
  visible?: boolean;
  access?: keyof typeof SessionAccess;
  sortOrder?: number | string | null;
  registrationEnabled?: boolean;
  allowQuickRegister?: boolean;
  limit?: number | string | null;
  price?: number | string | null;
  locationId?: string | null;
  roundName?: string | null;
  matchName?: string | null;
  taxCode?: string | null;
  taxIncluded?: boolean;
  taxLocation?: keyof typeof TaxLocationType;
  meetingId?: string | null;
}

export interface EventSessionAccessUpdateInputs {
  status?: PurchaseStatus;
}

export interface EventSessionTranslationUpdateInputs {
  name?: string | null;
  description?: string | null;
  longDescription?: string | null;
  imageId?: string | null;
}

export interface EventSessionUpdateInputs {
  name?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  registrationEnd?: string | null;
  slug?: string | null;
  description?: string | null;
  longDescription?: string | null;
  nonSession?: boolean;
  imageId?: string | null;
  visible?: boolean;
  access?: keyof typeof SessionAccess;
  sortOrder?: number | string | null;
  registrationEnabled?: boolean;
  allowQuickRegister?: boolean;
  limit?: number | string | null;
  price?: number | string | null;
  locationId?: string | null;
  roundName?: string | null;
  matchName?: string | null;
  taxCode?: string | null;
  taxIncluded?: boolean;
  taxLocation?: keyof typeof TaxLocationType;
  meetingId?: string | null;
}

export interface EventSessionLocationCreateInputs {
  name: string;
  description?: string | null;
  imageId?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip?: string | null;
}

export interface EventSessionLocationTranslationUpdateInputs {
  name?: string | null;
  description?: string | null;
}

export interface EventSessionLocationUpdateInputs {
  name?: string;
  description?: string | null;
  imageId?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip?: string | null;
}

export interface EventSessionQuestionChoiceCreateInputs {
  value: string;
  text?: string | null;
  supply?: number | string | null;
  description?: string | null;
  sortOrder?: number | string | null;
}

export interface EventSessionQuestionChoiceTranslationUpdateInputs {
  value?: string | null;
  text?: string | null;
  description?: string | null;
}

export interface EventSessionQuestionChoiceUpdateInputs {
  value?: string | null;
  text?: string | null;
  supply?: number | string | null;
  description?: string | null;
  sortOrder?: number | string | null;
}

export interface EventSessionQuestionCreateInputs {
  name: string;
  type: keyof typeof EventSessionQuestionType | null;
  sectionId?: string;
  questionId?: string;
  choiceId?: string;
  required?: boolean;
  label?: string | null;
  placeholder?: string | null;
  description?: string | null;
  default?: string | null;
  dashboardVisibility?: boolean;
  span?: number | string | null;
  mutable?: boolean;
  min?: string | null;
  max?: string | null;
  validation?: string | null;
  validationMessage?: string | null;
  locationOption?: LocationQuestionOption | null;
  sortOrder?: number | string | null;
  featured?: boolean;
  choices?: string[] | null;
  price?: number | string | null;
  supply?: number | string | null;
  searchListId?: string | null;
  masked?: boolean;
}

export interface EventSessionQuestionTranslationUpdateInputs {
  label?: string | null;
  placeholder?: string | null;
  description?: string | null;
}

export interface EventSessionQuestionUpdateInputs {
  name?: string | null;
  type?: keyof typeof EventSessionQuestionType | null;
  required?: boolean;
  label?: string | null;
  placeholder?: string | null;
  description?: string | null;
  default?: string | null;
  dashboardVisibility?: boolean;
  span?: number | string | null;
  mutable?: boolean;
  min?: string | null;
  max?: string | null;
  masked?: boolean;
  validation?: string | null;
  validationMessage?: string | null;
  locationOption?: LocationQuestionOption | null;
  sortOrder?: number | string | null;
  featured?: boolean;
  price?: number | string | null;
  supply?: number | string | null;
  searchListId?: string | null;
}

export interface EventSessionSectionCreateInputs {
  name: string;
  description?: string | null;
  sortOrder?: number | string | null;
}

export interface EventSessionSectionTranslationUpdateInputs {
  name?: string | null;
  description?: string | null;
  guestDescription?: string | null;
}

export interface EventSessionSectionUpdateInputs {
  name?: string | null;
  description?: string | null;
  guestDescription?: string | null;
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
  isHost?: boolean;
  imageId?: string | null;
  priority?: number | string | null;
  visible?: boolean;
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
  isHost?: boolean;
  imageId?: string | null;
  priority?: number | string | null;
  visible?: boolean;
}

export interface PassTypeTranslationUpdateInputs {
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
  reservationDescription?: string | null;
  imageId?: string | null;
}

export interface FileUpdateInputs {
  name?: string;
  source?: FileSource;
  public?: boolean;
}

export interface GroupCreateInputs {
  name: string;
  description: string;
  featured?: boolean;
  slug?: string | null;
  active?: boolean;
  access?: keyof typeof GroupAccess | null;
  imageId?: string | null;
  squareImageId?: string | null;
  externalUrl?: string | null;
  meetingId?: string | null;
}

export interface GroupMembershipUpdateInputs {
  announcementEmailNotification?: boolean;
  announcementPushNotification?: boolean;
  activityEmailNotification?: boolean;
  activityPushNotification?: boolean;
  eventEmailNotification?: boolean;
  eventPushNotification?: boolean;
  chatPushNotification?: boolean;
}

export interface OrganizationMembershipUpdateInputs {
  org: Omit<ModulePermissions, "superEnabled" | "enabled">;
  users: Omit<ModulePermissions, "superEnabled" | "enabled">;
  reports: Omit<ModulePermissions, "superEnabled" | "enabled">;
  dashboards: Omit<ModulePermissions, "superEnabled" | "enabled">;
  logs: Omit<ModulePermissions, "superEnabled" | "enabled">;
  // MODULES
  activities: Omit<ModulePermissions, "superEnabled" | "enabled">;
  events: Omit<ModulePermissions, "superEnabled" | "enabled">;
  attendees: Omit<ModulePermissions, "superEnabled" | "enabled">;
  bookings: Omit<ModulePermissions, "superEnabled" | "enabled">;
  groups: Omit<ModulePermissions, "superEnabled" | "enabled">;
  accounts: Omit<ModulePermissions, "superEnabled" | "enabled">;
  tiers: Omit<ModulePermissions, "superEnabled" | "enabled">;
  channels: Omit<ModulePermissions, "superEnabled" | "enabled">;
  contents: Omit<ModulePermissions, "superEnabled" | "enabled">;
  threads: Omit<ModulePermissions, "superEnabled" | "enabled">;
  storage: Omit<ModulePermissions, "superEnabled" | "enabled">;
  support: Omit<ModulePermissions, "superEnabled" | "enabled">;
  sponsors: Omit<ModulePermissions, "superEnabled" | "enabled">;
  benefits: Omit<ModulePermissions, "superEnabled" | "enabled">;
  interests: Omit<ModulePermissions, "superEnabled" | "enabled">;
  advertisements: Omit<ModulePermissions, "superEnabled" | "enabled">;
  invoices: Omit<ModulePermissions, "superEnabled" | "enabled">;
  announcements: Omit<ModulePermissions, "superEnabled" | "enabled">;
  surveys: Omit<ModulePermissions, "superEnabled" | "enabled">;
  streams: Omit<ModulePermissions, "superEnabled" | "enabled">;
  meetings: Omit<ModulePermissions, "superEnabled" | "enabled">;
  payments: Omit<ModulePermissions, "superEnabled" | "enabled">;
}

export interface GroupTranslationUpdateInputs {
  name?: string | null;
  description?: string | null;
  imageId?: string | null;
}

export interface GroupUpdateInputs {
  featured?: boolean;
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  active?: boolean;
  access?: keyof typeof GroupAccess | null;
  imageId?: string | null;
  squareImageId?: string | null;
  externalUrl?: string | null;
  meetingId?: string | null;
}

export interface ImageCreateInputs {
  imageDataUri: string;
  name: string;
  description?: string | null;
  type: ImageType;
}
export interface UserImageUpdateInputs {
  imageDataUri?: string | undefined;
  userId?: string | undefined;
}

export interface ImageUpdateInputs {
  name?: string | null;
  description?: string | null;
  type?: ImageType;
}

export interface InterestCreateInputs {
  name: string;
  imageId?: string | null;
  featured?: boolean;
}

export interface InterestUpdateInputs {
  name?: string | null;
  imageId?: string | null;
  featured?: boolean;
}

export interface InvoiceCreateInputs {
  title: string;
  dueDate: string;
  description?: string | null;
  notes?: string | null;
  accountId?: string | null;
  eventId?: string | null;
  paymentIntegrationId?: string | null;
}

export interface InvoiceUpdateInputs {
  title?: string | null;
  description?: string | null;
  dueDate?: string | null;
  notes?: string | null;
  accountId?: string | null;
  eventId?: string | null;
  paymentIntegrationId?: string | null;
}

export interface InvoiceLineItemCreateInputs {
  name: string;
  description: string;
  quantity: string | number;
  amount: string;
  taxCode?: string | null;
  taxIncluded?: boolean;
  taxLocation?: keyof typeof TaxLocationType;
}

export interface InvoiceLineItemUpdateInputs {
  name?: string | null;
  description?: string | null;
  quantity?: string | number | null;
  amount?: number | null;
  taxCode?: string | null;
  taxIncluded?: boolean;
  taxLocation?: keyof typeof TaxLocationType;
}

export interface LeadCreateInputs {
  status?: LeadStatus;
  note?: string | null;
}

export interface LeadUpdateInputs {
  status?: LeadStatus;
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
  clientTheme?: string | null;
  appName?: string | null;
  logoId?: string | null;
  darkLogoId?: string | null;
  iconId?: string | null;
  darkIconId?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  tikTok?: string | null;
  linkedIn?: string | null;
  youtube?: string | null;
  discord?: string | null;
  defaultAuthAction?: keyof typeof DefaultAuthAction;
  authLayout?: keyof typeof AuthLayout;
  emailAuthEnabled?: boolean;
  requirePhone?: boolean;
  requestInternalRefId?: boolean;
  internalRefIdName?: string | null;
  iosAppLink?: string | null;
  androidAppLink?: string | null;
  appIconId?: string | null;
  appAdaptiveIconId?: string | null;
  appSplashScreenId?: string | null;
  appSplashScreenColor?: string | null;
  locale?: string | null;
  locales?: string[] | null;
  inviteOnly?: boolean;
  googleTagManagerId?: string | null;
  meetingGroupCallAdminPreset?: string;
  meetingGroupCallGuestPreset?: string;
  meetingWebinarAdminPreset?: string;
  meetingWebinarGuestPreset?: string;
  meetingLivestreamAdminPreset?: string;
  meetingLivestreamGuestPreset?: string;
  options?: object | null;
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
  sectionId?: string;
  followupId?: string;
  questionId?: string;
  choiceId?: string;
  required?: boolean;
  label?: string | null;
  placeholder?: string | null;
  description?: string | null;
  default?: string | null;
  dashboardVisibility?: boolean;
  span?: number | string | null;
  mutable?: boolean;
  min?: string | null;
  max?: string | null;
  validation?: string | null;
  validationMessage?: string | null;
  locationOption?: LocationQuestionOption | null;
  sortOrder?: number | string | null;
  featured?: boolean;
  choices?: string[] | null;
  searchListId?: string | null;
  masked?: boolean;
}

export interface EventQuestionTranslationUpdateInputs {
  label?: string | null;
  placeholder?: string | null;
  description?: string | null;
}

export interface EventQuestionUpdateInputs {
  name?: string | null;
  type?: keyof typeof RegistrationQuestionType | null;
  required?: boolean;
  label?: string | null;
  placeholder?: string | null;
  description?: string | null;
  default?: string | null;
  dashboardVisibility?: boolean;
  span?: number | string | null;
  mutable?: boolean;
  min?: string | null;
  max?: string | null;
  masked?: boolean;
  validation?: string | null;
  validationMessage?: string | null;
  locationOption?: LocationQuestionOption | null;
  sortOrder?: number | string | null;
  featured?: boolean;
  unique?: boolean;
  searchListId?: string | null;
}

export interface CustomReportCreateInputs extends ReportFilters {
  name: string;
  description?: string | null;
  gridState?: string | null;
  shared?: boolean;
}

export interface CustomReportUpdateInputs {
  name?: string | null;
  description?: string | null;
  gridState?: string | null;
  shared?: boolean;
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

export interface EventFollowupCreateInputs {
  name: string;
  description?: string | null;
  guestDescription?: string | null;
  sortOrder?: number | string | null;
}

export interface EventFollowupTranslationUpdateInputs {
  name?: string | null;
  description?: string | null;
  guestDescription?: string | null;
}

export interface EventFollowupUpdateInputs {
  name?: string | null;
  description?: string | null;
  guestDescription?: string | null;
  sortOrder?: number | string | null;
}

export interface SeriesCreateInputs {
  name: string;
  slug?: string | null;
  description?: string | null;
  longDescription?: string | null;
  imageId?: string | null;
  templateId: string;
  startDate?: string | null;
  endDate?: string | null;
}

export interface SeriesUpdateInputs {
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  longDescription?: string | null;
  imageId?: string | null;
  templateId?: string;
  startDate?: string | null;
  endDate?: string | null;
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

export interface StreamOutputCreateInputs {
  enabled: boolean;
  streamKey: string;
  url: string;
}

export interface SupportTicketCreateInputs {
  // No fields defined in the provided validation object
}

export interface SupportTicketUpdateInputs {
  type?: SupportTicketType;
  email?: string;
  request?: string;
  accountId?: string | null;
  eventId?: string | null;
  state?: SupportTicketState;
  notes?: BaseSupportTicketNote[];
}

export interface SupportTicketNoteCreateInputs {
  text: string;
}

export interface SupportTicketNoteUpdateInputs {
  // No fields defined in the provided validation object
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
  subject?: string | null;
  imageId?: string | null;
  groupId?: string;
  circleId?: string;
  eventId?: string;
}

export interface ThreadUpdateInputs {
  subject?: string | null;
  imageId?: string | null;
}

export interface ThreadMessageCreateInputs {
  accountId: string;
  body: string;
  entities: any[];
}

export interface ThreadMessageUpdateInputs {
  body: string;
  entities: any[];
}

export interface ThreadMemberCreateInputs {}

export interface ThreadMemberUpdateInputs {
  blocked?: boolean;
}

export interface ThreadCircleCreateInputs {
  name: string;
}

export interface ThreadCircleUpdateInputs {
  name?: string | null;
}

export interface ThreadCircleAccountCreateInputs {
  accountId: string;
  role: keyof typeof ThreadCircleAccountRole;
}

export interface ThreadCircleAccountUpdateInputs {
  role?: keyof typeof ThreadCircleAccountRole | null;
}

export interface ThreadMessageReactionCreateInputs {
  emojiName: string;
}

export interface ThreadMessageReactionUpdateInputs {
  emojiName?: string;
}

export interface PassTypeCreateInputs {
  name: string;
  shortDescription: string;
  price: string | number; // Assuming REQUIRED_PRICE can be string or number
  visibility?: keyof typeof PassTypeVisibility | null;
  featured?: boolean;
  active?: boolean;
  cancelable?: boolean;
  transferable?: boolean;
  slug?: string | null;
  longDescription?: string | null;
  accessLevel?: keyof typeof PassTypeAccessLevel | null;
  featuredImageId?: string | null;
  supply?: number | string | null;
  minQuantityPerSale?: number | string | null;
  maxQuantityPerSale?: number | string | null;
  limitPerAccount?: number | string | null;
  emailDomains?: string | null; // Assuming the pattern validation is not directly translatable to TypeScript
  requiredPassTypeId?: string | null;
  sortOrder?: number | string | null;
  enableCoupons?: boolean;
  groupPassDescription?: string | null;
  overrideStartDate?: string | null;
  requireCoupon?: boolean;
  taxCode?: string | null;
  taxIncluded?: boolean;
  taxLocation?: keyof typeof TaxLocationType;
}

export interface PassTypeUpdateInputs {
  visibility?: keyof typeof PassTypeVisibility | null;
  featured?: boolean;
  active?: boolean;
  cancelable?: boolean;
  transferable?: boolean;
  name?: string | null;
  slug?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
  price?: string | number | null; // Assuming OPTIONAL_PRICE can be string, number, or null
  accessLevel?: keyof typeof PassTypeAccessLevel | null;
  featuredImageId?: string | null;
  supply?: number | string | null;
  minQuantityPerSale?: number | string | null;
  maxQuantityPerSale?: number | string | null;
  limitPerAccount?: number | string | null;
  emailDomains?: string | null; // Assuming the pattern validation is not directly translatable to TypeScript
  requiredPassTypeId?: string | null;
  sortOrder?: number | string | null;
  enableCoupons?: boolean;
  minCouponQuantity?: number;
  maxCouponQuantity?: number | null;
  groupPassDescription?: string | null;
  overrideStartDate?: string | null;
  requireCoupon?: boolean;
  taxCode?: string | null;
  taxIncluded?: boolean;
  taxLocation?: keyof typeof TaxLocationType;
}

export interface TierCreateInputs {
  name: string;
  slug?: string | null;
  iconName?: string | null;
  priority?: number | string | null;
  description?: string | null;
  imageId?: string | null;
  color?: string | null;
  internal?: boolean;
  exclusionGroup?: string | null;
}

export interface TierUpdateInputs {
  name?: string | null;
  slug?: string | null;
  iconName?: string | null;
  priority?: number | string | null;
  description?: string | null;
  imageId?: string | null;
  color?: string | null;
  internal?: boolean;
  exclusionGroup?: string | null;
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
  enabled?: boolean;
}

export interface TriggerUpdateInputs {
  code?: string | null;
  enabled?: boolean;
}

export interface UserCreateInputs {
  // No fields defined in the provided validation object
}

export interface UserUpdateInputs {
  title?: string | null;
  firstName?: string;
  lastName?: string;
  termsAccepted?: boolean;
}

export interface UserApiKeyCreateInputs {
  name: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  description?: string | null;
}

export interface VideoUpdateInputs {
  name?: string;
  thumbnailPct?: number | null;
}

export interface OrganizationModuleUpdateInputs {
  requireAuth?: boolean;
  enabled?: boolean;
  editable?: boolean;
  options?: object | null;
}

export interface PassTypePriceScheduleCreateInputs {
  ticketId?: string | null;
  price?: string | null;
  name?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}
export interface PassTypePriceScheduleUpdateInputs {
  ticketId?: string | null;
  price?: string | null;
  name?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface PassTypeRefundScheduleCreateInputs {
  percentage: number;
  startDate: string;
  endDate: string;
}

export interface PassTypeRefundScheduleUpdateInputs {
  percentage?: number;
  startDate?: string;
  endDate?: string;
}

export interface IntegrationCreateInputs {
  type: keyof typeof IntegrationType;
  enabled?: boolean;
  publicUrl?: string;
  publicKey?: string;
  secretKey?: string;
}

export interface IntegrationUpdateInputs {
  enabled?: boolean;
  publicUrl?: string | null;
  publicKey?: string | null;
  secretKey?: string | null;
}

export interface EventRoomTypeCreateInputs {
  name: string;
  price: number | string;
  pricePerNight?: boolean;
  description?: string | null;
  sortOrder?: number | string;
  supply?: number | string | null;
  minPasses?: number | string | null;
  maxPasses?: number | string | null;
  minStart?: string | null;
  defaultStart?: string | null;
  maxStart?: string | null;
  minEnd?: string | null;
  defaultEnd?: string | null;
  maxEnd?: string | null;
  imageId?: string | null;
  taxCode?: string | null;
  taxIncluded?: boolean;
  taxLocation?: keyof typeof TaxLocationType;
}

export interface EventRoomTypeUpdateInputs {
  name?: string;
  price?: number | string;
  pricePerNight?: boolean;
  description?: string | null;
  sortOrder?: number | string;
  supply?: number | string | null;
  minPasses?: number | string | null;
  maxPasses?: number | string | null;
  minStart?: string | null;
  defaultStart?: string | null;
  maxStart?: string | null;
  minEnd?: string | null;
  defaultEnd?: string | null;
  maxEnd?: string | null;
  imageId?: string | null;
  taxCode?: string | null;
  taxIncluded?: boolean;
  taxLocation?: keyof typeof TaxLocationType;
}

export interface RoomCreateInputs {
  roomName: string;
}

export interface RoomUpdateInputs {
  roomName?: string | null;
}
export interface EventRoomTypeTranslationUpdateInputs {
  name?: string | null;
  description?: string | null;
}

export interface EventRoomTypeReservationCreateInputs {
  eventRoomTypeId: string;
  passes?: { id: string }[];
  start?: string | null;
  roomId?: string | null;
  end?: string | null;
}

export interface EventRoomTypeReservationUpdateInputs {
  eventRoomTypeId?: string;
  start?: string | null;
  end?: string | null;
  roomId?: string | null;
}

export interface EventRoomTypePassTypeDetailsUpdateInputs {
  enabled?: boolean;
  premium?: number | string | null;
  includedNights?: number | string | null;
  minPasses?: number | string | null;
  maxPasses?: number | string | null;
  minStart?: string | null;
  defaultStart?: string | null;
  maxStart?: string | null;
  minEnd?: string | null;
  defaultEnd?: string | null;
  maxEnd?: string | null;
}

export interface EventRoomTypeAddOnDetailsUpdateInputs {
  minStart?: string | null;
  defaultStart?: string | null;
  maxStart?: string | null;
  minEnd?: string | null;
  defaultEnd?: string | null;
  maxEnd?: string | null;
}

export interface TaxIntegrationCreateInputs {
  sandbox?: boolean;
  apiKey?: string; // taxjar
  accountId?: string; // avalara
  licenseKey?: string; // avalara
}

export interface TaxIntegrationUpdateInputs {
  companyCode?: string | null;
  commit?: boolean;
  logging?: boolean;
  // TYPE CODES
  passTaxCode?: string | null;
  packageTaxCode?: string | null;
  reservationTaxCode?: string | null;
  addOnTaxCode?: string | null;
  accessTaxCode?: string | null;
  invoiceTaxCode?: string | null;
  bookingTaxCode?: string | null;
  couponTaxCode?: string | null;
}

export interface CloneOptions {
  name: string;
  eventStart: string;
  // REGISTRATION
  passTypes: boolean;
  packages: boolean;
  addOns: boolean;
  roomTypes: boolean;
  questions: boolean;
  bypassList: boolean;
  coupons: boolean;
  followups: boolean;
  // DETAILS
  coHosts: boolean;
  emails: boolean;
  faqSections: boolean;
  pages: boolean;
  benefits: boolean;
  interests: boolean;
  announcements: boolean;
  media: boolean;
  // ONSITE
  activations: boolean;
  onSite: boolean;
  // AGENDA
  tracks: boolean;
  speakers: boolean;
  sponsors: boolean;
  sponsorshipLevels: boolean;
  locations: boolean; // locations
  sessions: boolean;
  rounds: boolean;
  // SETTINGS
  sideEffects: boolean;
  advancedSettings: boolean;
}

export interface SearchListCreateInputs {
  name: string;
}

export interface SearchListUpdateInputs {
  name?: string;
}

export interface SearchListValueCreateInputs {
  value: string;
  priority?: number | null;
}

export interface SearchListValueUpdateInputs {
  value?: string;
  priority?: number | null;
}

export interface AttachSearchListInputs {
  searchListId: string;
}

export interface BookingPlaceCreateInputs {
  name: string;
  timezone: string;
  description?: string | null;
  imageId?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip?: string | null;
  sortOrder?: number | string | null;
  visible?: boolean;
  paymentIntegrationId?: string | null;
}

export interface BookingPlaceUpdateInputs {
  name?: string;
  timezone?: string;
  description?: string | null;
  imageId?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip?: string | null;
  sortOrder?: number | string | null;
  visible?: boolean;
  paymentIntegrationId?: string | null;
}

export interface BookingPlaceTranslationUpdateInputs {
  name?: string | null;
  description?: string | null;
}

export interface BookingSpaceCreateInputs {
  name: string;
  supply: number | string;
  slotDuration: number | string;
  price?: number | string;
  description?: string | null;
  imageId?: string | null;
  start?: string | null;
  end?: string | null;
  sortOrder?: number | string | null;
  visible?: boolean;
  confirmationBody?: string | null;
  confirmationReplyTo?: string | null;
  taxCode?: string | null;
  taxIncluded?: boolean;
  taxLocation?: keyof typeof TaxLocationType;
}

export interface BookingSpaceUpdateInputs {
  name?: string;
  supply?: number | string;
  price?: number | string;
  description?: string | null;
  imageId?: string | null;
  start?: string | null;
  end?: string | null;
  sortOrder?: number | string | null;
  visible?: boolean;
  confirmationBody?: string | null;
  confirmationReplyTo?: string | null;
  taxCode?: string | null;
  taxIncluded?: boolean;
  taxLocation?: keyof typeof TaxLocationType;
}

export interface BookingSpaceTranslationUpdateInputs {
  name?: string | null;
  description?: string | null;
}

export interface BookingSpaceAvailabilityCreateInputs {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface BookingSpaceAvailabilityUpdateInputs {
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
}

export interface BookingSpaceBlackoutCreateInputs {
  start: string;
  end: string;
}

export interface BookingSpaceBlackoutUpdateInputs {
  start?: string;
  end?: string;
}

export interface BookingCreateInputs {
  accountId: string;
  day: string;
  time: string;
  status?: PurchaseStatus;
}

export interface BookingUpdateInputs {
  status?: PurchaseStatus;
  day?: string;
  time?: string;
}
export interface UpdateEventPassResponseInputs {
  value: string;
}

export interface DashboardCreateInputs {
  name: string;
  eventId?: string;
}

export interface DashboardUpdateInputs {
  name?: string;
}

export interface DashboardWidgetCreateInputs {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DashboardWidgetUpdateInputs {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

export interface SurveyCreateInputs {
  name: string;
  slug?: string;
  description?: string | null;
  imageId?: string | null;
  requireAuth?: boolean;
  submissionsPerAccount?: string | number;
  replyTo?: string | null;
  emailBody?: string | null;
}

export interface SurveyUpdateInputs {
  name?: string;
  slug?: string;
  description?: string | null;
  imageId?: string | null;
  requireAuth?: boolean;
  submissionsPerAccount?: string | number;
  replyTo?: string | null;
  emailBody?: string | null;
}

export interface SurveyTranslationUpdateInputs {
  name?: string | null;
  description?: string | null;
  emailBody?: string | null;
}

export interface SurveySubmissionUpdateInputs {
  status?: keyof typeof PurchaseStatus;
}

export interface SurveyQuestionChoiceCreateInputs {
  value: string;
  text?: string | null;
  supply?: number | string | null;
  description?: string | null;
  sortOrder?: number | string | null;
}

export interface SurveyQuestionChoiceTranslationUpdateInputs {
  value?: string | null;
  text?: string | null;
  description?: string | null;
}

export interface SurveyQuestionChoiceUpdateInputs {
  value?: string | null;
  text?: string | null;
  supply?: number | string | null;
  description?: string | null;
  sortOrder?: number | string | null;
}

export interface SurveyQuestionCreateInputs {
  name: string;
  type: keyof typeof SurveyQuestionType | null;
  sectionId?: string;
  questionId?: string;
  choiceId?: string;
  required?: boolean;
  label?: string | null;
  placeholder?: string | null;
  description?: string | null;
  default?: string | null;
  dashboardVisibility?: boolean;
  span?: number | string | null;
  mutable?: boolean;
  min?: string | null;
  max?: string | null;
  validation?: string | null;
  validationMessage?: string | null;
  locationOption?: LocationQuestionOption | null;
  sortOrder?: number | string | null;
  featured?: boolean;
  choices?: string[] | null;
  searchListId?: string | null;
  masked?: boolean;
}

export interface SurveyQuestionTranslationUpdateInputs {
  label?: string | null;
  placeholder?: string | null;
  description?: string | null;
}

export interface SurveyQuestionUpdateInputs {
  name?: string | null;
  type?: keyof typeof SurveyQuestionType | null;
  required?: boolean;
  label?: string | null;
  placeholder?: string | null;
  description?: string | null;
  default?: string | null;
  dashboardVisibility?: boolean;
  span?: number | string | null;
  mutable?: boolean;
  min?: string | null;
  max?: string | null;
  masked?: boolean;
  validation?: string | null;
  validationMessage?: string | null;
  locationOption?: LocationQuestionOption | null;
  sortOrder?: number | string | null;
  featured?: boolean;
  searchListId?: string | null;
}

export interface SurveySectionCreateInputs {
  name: string;
  description?: string | null;
  sortOrder?: number | string | null;
}

export interface SurveySectionTranslationUpdateInputs {
  name?: string | null;
  description?: string | null;
  guestDescription?: string | null;
}

export interface SurveySectionUpdateInputs {
  name?: string | null;
  description?: string | null;
  guestDescription?: string | null;
  sortOrder?: number | string | null;
}
export interface EventPackageCreateInputs {
  name: string;
  description?: string | null;
  price: number;
  isActive?: boolean;
  imageId?: string | null;
  sortOrder?: number | string | null;
  taxCode?: string | null;
  taxIncluded?: boolean;
  taxLocation?: keyof typeof TaxLocationType;
}

export interface EventPackageUpdateInputs {
  name?: string;
  description?: string | null;
  price?: number;
  isActive?: boolean;
  imageId?: string | null;
  sortOrder?: number | string | null;
  taxCode?: string | null;
  taxIncluded?: boolean;
  taxLocation?: keyof typeof TaxLocationType;
}

export interface EventPackagePassCreateInputs {
  passTypeId: string;
  quantity: number;
}

export interface EventPackagePassUpdateInputs {
  passTypeId?: string;
  quantity?: number;
}

export interface AttendeeEventPackageCreateInputs {
  packageId: string;
  attendeeId: string;
}

export interface AttendeeEventPackageUpdateInputs {
  packageId?: string;
  attendeeId?: string;
}

export interface EventPackageTranslationUpdateInputs {
  name?: string | null;
  description?: string | null;
}

export interface EventMediaItemCreateInputs {
  name?: string | null;
  description?: string | null;
  sortOrder?: number | string | null;
  imageId?: string | null;
  videoId?: string | null;
  fileId?: string | null;
}

export interface EventMediaItemUpdateInputs {
  name?: string | null;
  description?: string | null;
  sortOrder?: number | string | null;
}

export interface EventSponsorshipLevelCreateInputs {
  name: string;
  slug?: string | null;
  sponsorsPerRow?: number | string;
  sortOrder?: number | string;
  description?: string | null;
}

export interface EventSponsorshipLevelUpdateInputs {
  name?: string;
  slug?: string;
  sponsorsPerRow?: number | string;
  sortOrder?: number | string;
  description?: string | null;
}

export interface EventSponsorshipLevelTranslationUpdateInputs {
  name?: string | null;
  description?: string | null;
}

export interface EventSponsorshipCreateInputs {
  name: string;
  slug?: string;
  description?: string | null;
  url?: string | null;
  imageId?: string | null;
  accountId?: string | null;
  sortOrder?: number | string;
}

export interface EventSponsorshipUpdateInputs {
  name?: string;
  slug?: string;
  description?: string | null;
  url?: string | null;
  imageId?: string | null;
  accountId?: string | null;
  sortOrder?: number;
}

export interface EventSponsorshipTranslationUpdateInputs {
  name?: string | null;
  description?: string | null;
}

export interface PaymentUpdateInputs {
  captured?: boolean;
  registrationId?: string | null;
}

export interface CustomModuleCreateInputs {
  name: string;
  url: string;
  iconName: string;
  color: string;
  description?: string | null;
  sortOrder?: number | string | null;
}

export interface CustomModuleUpdateInputs {
  name?: string | null;
  url?: string | null;
  description?: string | null;
  iconName?: string | null;
  position?: CustomModulePosition | null;
  color?: string | null;
  sortOrder?: number | string | null;
}

export interface CustomModuleTranslationUpdateInputs {
  name?: string | null;
  description?: string | null;
}

export interface MatchUpdateInputs {
  title?: string | null;
  description?: string | null;
}

export interface EventAttendeePackageCreateInputs {
  packageId: string;
  status?: PurchaseStatus;
}

export interface EventAttendeePackageUpdateInputs {
  packageId?: string;
  status?: PurchaseStatus;
}
export interface AccountAttributeCreateInputs {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "boolean";
  description?: string | null;
  required?: boolean;
  adminOnly?: boolean;
  editable?: boolean;
  public?: boolean;
  includedInDashboards?: boolean;
  sortOrder?: number | string | null;
}

export interface AccountAttributeUpdateInputs {
  label?: string | null;
  description?: string | null;
  required?: boolean;
  adminOnly?: boolean;
  editable?: boolean;
  public?: boolean;
  includedInDashboards?: boolean;
  sortOrder?: number | string | null;
}

export interface WebhookCreateInputs {
  name?: string | null;
  url: string;
  secret: string;
}

export interface WebhookUpdateInputs {
  name?: string | null;
}

export interface RoundEventQuestionUpdataInputs {
  type: keyof typeof MatchQuestionType;
}

export interface RoundSessionQuestionUpdateInputs {
  type: keyof typeof MatchQuestionType;
}

// ============================================================================
// StreamsV2 (Cloudflare Calls) Params
// ============================================================================

export interface MeetingCreateInputs {
  type: keyof typeof MeetingType;
  eventId?: string;
  sessionId?: string;
  groupId?: string;
  title: string | null;
  preferred_region:
    | "ap-south-1"
    | "ap-southeast-1"
    | "us-east-1"
    | "eu-central-1"
    | null;
  record_on_start: boolean;
  live_stream_on_start: boolean;
  persist_chat: boolean;
  summarize_on_end: boolean;

  // AI config fields (flattened)
  "ai_config.transcription.keywords"?: string[];
  "ai_config.transcription.language"?:
    | "en-US"
    | "en-IN"
    | "multi"
    | "de"
    | "hi"
    | "sv"
    | "ru"
    | "pl"
    | "el"
    | "fr"
    | "nl"
    | "tr"
    | "es"
    | "it"
    | "pt"
    | "pt-BR"
    | "ro"
    | "ko"
    | "id";
  "ai_config.transcription.profanity_filter"?: boolean;
  // Summarization config fields (flattened)
  "ai_config.summarization.word_limit"?: number;
  "ai_config.summarization.text_format"?: "plain_text" | "markdown";
  "ai_config.summarization.summary_type"?:
    | "general"
    | "team_meeting"
    | "sales_call"
    | "client_check_in"
    | "interview"
    | "daily_standup"
    | "one_on_one_meeting"
    | "lecture"
    | "code_review";
}

export interface MeetingUpdateInputs {
  type?: keyof typeof MeetingType;
  eventId?: string;
  sessionId?: string;
  groupId?: string;
  title?: string | null;
  preferred_region?:
    | "ap-south-1"
    | "ap-southeast-1"
    | "us-east-1"
    | "eu-central-1"
    | null;
  record_on_start?: boolean;
  live_stream_on_start?: boolean;
  status?: "ACTIVE" | "INACTIVE";
  persist_chat?: boolean;
  summarize_on_end?: boolean;

  // AI config fields (flattened)
  "ai_config.transcription.keywords"?: string[];
  "ai_config.transcription.language"?:
    | "en-US"
    | "en-IN"
    | "multi"
    | "de"
    | "hi"
    | "sv"
    | "ru"
    | "pl"
    | "el"
    | "fr"
    | "nl"
    | "tr"
    | "es"
    | "it"
    | "pt"
    | "pt-BR"
    | "ro"
    | "ko"
    | "id";
  "ai_config.transcription.profanity_filter"?: boolean;

  // Summarization config fields (flattened)
  "ai_config.summarization.word_limit"?: number;
  "ai_config.summarization.text_format"?: "plain_text" | "markdown";
  "ai_config.summarization.summary_type"?:
    | "general"
    | "team_meeting"
    | "sales_call"
    | "client_check_in"
    | "interview"
    | "daily_standup"
    | "one_on_one_meeting"
    | "lecture"
    | "code_review";
}

export interface MeetingParticipantCreateInputs {
  custom_participant_id: string;
  name?: string | null;
  picture?: string | null;
}

export interface MeetingParticipantUpdateInputs {
  name?: string | null;
  picture?: string | null;
  preset_name?: string | null;
}

export interface MeetingRecordingCreateInputs {
  max_seconds?: number;
  file_name_prefix?: string;
  allow_multiple_recordings?: boolean;

  // Video config fields (flattened)
  video_codec?: string;
  video_width?: number;
  video_height?: number;
  video_export_file?: boolean;

  // Watermark fields (flattened)
  watermark_url?: string;
  watermark_size_width?: number;
  watermark_size_height?: number;
  watermark_position?: string;

  // Audio config fields (flattened)
  audio_codec?: string;
  audio_channel?: string;
  audio_export_file?: boolean;

  // Realtimekit bucket config
  realtimekit_bucket_enabled?: boolean;

  // Interactive config
  interactive_type?: string;
}

export interface MeetingRecordingUpdateInputs {
  action: "stop" | "pause" | "resume";
}

export interface MeetingPresetCreateInputs {
  name: string;

  // Config fields (dot notation)
  "config.view_type": "GROUP_CALL" | "WEBINAR" | "AUDIO_ROOM" | "LIVESTREAM";
  "config.max_video_streams.mobile": number;
  "config.max_video_streams.desktop": number;
  "config.max_screenshare_count": number;
  "config.media.audio.enable_stereo": boolean;
  "config.media.audio.enable_high_bitrate": boolean;
  "config.media.video.quality": "hd" | "vga" | "qvga";
  "config.media.video.frame_rate": number;
  "config.media.screenshare.quality": "hd" | "vga" | "qvga";
  "config.media.screenshare.frame_rate": number;

  // Permissions fields (dot notation)
  "permissions.accept_waiting_requests": boolean;
  "permissions.transcription_enabled": boolean;
  "permissions.can_accept_production_requests": boolean;
  "permissions.can_edit_display_name": boolean;
  "permissions.can_spotlight": boolean;
  "permissions.is_recorder": boolean;
  "permissions.recorder_type": "NONE" | "RECORDER" | "LIVESTREAMER";
  "permissions.disable_participant_audio": boolean;
  "permissions.disable_participant_screensharing": boolean;
  "permissions.disable_participant_video": boolean;
  "permissions.kick_participant": boolean;
  "permissions.pin_participant": boolean;
  "permissions.can_record": boolean;
  "permissions.can_livestream": boolean;
  "permissions.waiting_room_type":
    | "SKIP"
    | "ON_PRIVILEGED_USER_ENTRY"
    | "SKIP_ON_ACCEPT";
  "permissions.hidden_participant": boolean;
  "permissions.show_participant_list": boolean;
  "permissions.can_change_participant_permissions": boolean;
  "permissions.stage_enabled": boolean;
  "permissions.stage_access": "ALLOWED" | "NOT_ALLOWED" | "CAN_REQUEST";

  // Permissions.plugins fields (dot notation)
  "permissions.plugins.can_close": boolean;
  "permissions.plugins.can_start": boolean;
  "permissions.plugins.can_edit_config": boolean;
  "permissions.plugins.config": Record<string, any>;

  // Permissions.connected_meetings fields (dot notation)
  "permissions.connected_meetings.can_alter_connected_meetings": boolean;
  "permissions.connected_meetings.can_switch_connected_meetings": boolean;
  "permissions.connected_meetings.can_switch_to_parent_meeting": boolean;

  // Permissions.polls fields (dot notation)
  "permissions.polls.can_create": boolean;
  "permissions.polls.can_vote": boolean;
  "permissions.polls.can_view": boolean;

  // Permissions.media fields (dot notation)
  "permissions.media.video.can_produce":
    | "ALLOWED"
    | "NOT_ALLOWED"
    | "CAN_REQUEST";
  "permissions.media.audio.can_produce":
    | "ALLOWED"
    | "NOT_ALLOWED"
    | "CAN_REQUEST";
  "permissions.media.screenshare.can_produce":
    | "ALLOWED"
    | "NOT_ALLOWED"
    | "CAN_REQUEST";

  // Permissions.chat fields (dot notation)
  "permissions.chat.public.can_send": boolean;
  "permissions.chat.public.text": boolean;
  "permissions.chat.public.files": boolean;
  "permissions.chat.private.can_send": boolean;
  "permissions.chat.private.can_receive": boolean;
  "permissions.chat.private.text": boolean;
  "permissions.chat.private.files": boolean;

  // UI.design_tokens fields (dot notation)
  "ui.design_tokens.border_radius": "rounded";
  "ui.design_tokens.border_width": "thin";
  "ui.design_tokens.spacing_base": number;
  "ui.design_tokens.theme": "dark";
  "ui.design_tokens.logo": string;

  // UI.design_tokens.colors.brand fields (dot notation)
  "ui.design_tokens.colors.brand.300": string;
  "ui.design_tokens.colors.brand.400": string;
  "ui.design_tokens.colors.brand.500": string;
  "ui.design_tokens.colors.brand.600": string;
  "ui.design_tokens.colors.brand.700": string;

  // UI.design_tokens.colors.background fields (dot notation)
  "ui.design_tokens.colors.background.600": string;
  "ui.design_tokens.colors.background.700": string;
  "ui.design_tokens.colors.background.800": string;
  "ui.design_tokens.colors.background.900": string;
  "ui.design_tokens.colors.background.1000": string;

  // UI.design_tokens.colors other fields (dot notation)
  "ui.design_tokens.colors.danger": string;
  "ui.design_tokens.colors.text": string;
  "ui.design_tokens.colors.text_on_brand": string;
  "ui.design_tokens.colors.success": string;
  "ui.design_tokens.colors.video_bg": string;
  "ui.design_tokens.colors.warning": string;

  // UI.config_diff field (dot notation)
  "ui.config_diff": Record<string, any>;
}

export interface MeetingLinkCreateInputs {
  name: string;
  preset_name: string;
  requireAuth: boolean;
}

export interface MeetingLinkUpdateInputs {
  name?: string;
  preset_name?: string;
  requireAuth?: boolean;
}

export interface MeetingPresetUpdateInputs {
  name?: string | null;

  // Config fields (dot notation, all optional for updates)
  "config.view_type"?: "GROUP_CALL" | "WEBINAR" | "AUDIO_ROOM" | "LIVESTREAM";
  "config.max_video_streams.mobile"?: number;
  "config.max_video_streams.desktop"?: number;
  "config.max_screenshare_count"?: number;
  "config.media.audio.enable_stereo"?: boolean;
  "config.media.audio.enable_high_bitrate"?: boolean;
  "config.media.video.quality"?: "hd" | "vga" | "qvga";
  "config.media.video.frame_rate"?: number;
  "config.media.screenshare.quality"?: "hd" | "vga" | "qvga";
  "config.media.screenshare.frame_rate"?: number;

  // Permissions fields (dot notation, all optional for updates)
  "permissions.accept_waiting_requests"?: boolean;
  "permissions.transcription_enabled"?: boolean;
  "permissions.can_accept_production_requests"?: boolean;
  "permissions.can_edit_display_name"?: boolean;
  "permissions.can_spotlight"?: boolean;
  "permissions.is_recorder"?: boolean;
  "permissions.recorder_type"?: "NONE" | "RECORDER" | "LIVESTREAMER";
  "permissions.disable_participant_audio"?: boolean;
  "permissions.disable_participant_screensharing"?: boolean;
  "permissions.disable_participant_video"?: boolean;
  "permissions.kick_participant"?: boolean;
  "permissions.pin_participant"?: boolean;
  "permissions.can_record"?: boolean;
  "permissions.can_livestream"?: boolean;
  "permissions.waiting_room_type"?:
    | "SKIP"
    | "ON_PRIVILEGED_USER_ENTRY"
    | "SKIP_ON_ACCEPT";
  "permissions.hidden_participant"?: boolean;
  "permissions.show_participant_list"?: boolean;
  "permissions.can_change_participant_permissions"?: boolean;
  "permissions.stage_enabled"?: boolean;
  "permissions.stage_access"?: "ALLOWED" | "NOT_ALLOWED" | "CAN_REQUEST";

  // Permissions.plugins fields (dot notation, all optional for updates)
  "permissions.plugins.can_close"?: boolean;
  "permissions.plugins.can_start"?: boolean;
  "permissions.plugins.can_edit_config"?: boolean;
  "permissions.plugins.config"?: Record<string, any>;

  // Permissions.connected_meetings fields (dot notation, all optional for updates)
  "permissions.connected_meetings.can_alter_connected_meetings"?: boolean;
  "permissions.connected_meetings.can_switch_connected_meetings"?: boolean;
  "permissions.connected_meetings.can_switch_to_parent_meeting"?: boolean;

  // Permissions.polls fields (dot notation, all optional for updates)
  "permissions.polls.can_create"?: boolean;
  "permissions.polls.can_vote"?: boolean;
  "permissions.polls.can_view"?: boolean;

  // Permissions.media fields (dot notation, all optional for updates)
  "permissions.media.video.can_produce"?:
    | "ALLOWED"
    | "NOT_ALLOWED"
    | "CAN_REQUEST";
  "permissions.media.audio.can_produce"?:
    | "ALLOWED"
    | "NOT_ALLOWED"
    | "CAN_REQUEST";
  "permissions.media.screenshare.can_produce"?:
    | "ALLOWED"
    | "NOT_ALLOWED"
    | "CAN_REQUEST";

  // Permissions.chat fields (dot notation, all optional for updates)
  "permissions.chat.public.can_send"?: boolean;
  "permissions.chat.public.text"?: boolean;
  "permissions.chat.public.files"?: boolean;
  "permissions.chat.private.can_send"?: boolean;
  "permissions.chat.private.can_receive"?: boolean;
  "permissions.chat.private.text"?: boolean;
  "permissions.chat.private.files"?: boolean;

  // UI.design_tokens fields (dot notation, all optional for updates)
  "ui.design_tokens.border_radius"?: "rounded";
  "ui.design_tokens.border_width"?: "thin";
  "ui.design_tokens.spacing_base"?: number;
  "ui.design_tokens.theme"?: "dark";
  "ui.design_tokens.logo"?: string;

  // UI.design_tokens.colors.brand fields (dot notation, all optional for updates)
  "ui.design_tokens.colors.brand.300"?: string;
  "ui.design_tokens.colors.brand.400"?: string;
  "ui.design_tokens.colors.brand.500"?: string;
  "ui.design_tokens.colors.brand.600"?: string;
  "ui.design_tokens.colors.brand.700"?: string;

  // UI.design_tokens.colors.background fields (dot notation, all optional for updates)
  "ui.design_tokens.colors.background.600"?: string;
  "ui.design_tokens.colors.background.700"?: string;
  "ui.design_tokens.colors.background.800"?: string;
  "ui.design_tokens.colors.background.900"?: string;
  "ui.design_tokens.colors.background.1000"?: string;

  // UI.design_tokens.colors other fields (dot notation, all optional for updates)
  "ui.design_tokens.colors.danger"?: string;
  "ui.design_tokens.colors.text"?: string;
  "ui.design_tokens.colors.text_on_brand"?: string;
  "ui.design_tokens.colors.success"?: string;
  "ui.design_tokens.colors.video_bg"?: string;
  "ui.design_tokens.colors.warning"?: string;

  // UI.config_diff field (dot notation, all optional for updates)
  "ui.config_diff"?: Record<string, any>;
}

export interface StreamInputCreateInputs {
  name: string;
  displayName?: string | null;
  sortOrder?: number | string | null;
  eventId?: string | null;
  sessionId?: string | null;
  groupId?: string | null;
  meetingId?: string | null;
  details?: object | null;
  imageId?: string | null;
  public?: boolean;
  locale?: string | null;
}

export interface StreamInputUpdateInputs {
  name?: string;
  displayName?: string | null;
  sortOrder?: number | string | null;
  eventId?: string | null;
  sessionId?: string | null;
  groupId?: string | null;
  meetingId?: string | null;
  connected?: boolean;
  imageId?: string | null;
  public?: boolean;
  locale?: string | null;
}

export interface StreamInputOutputCreateInputs {
  enabled: boolean;
  url: string;
  streamKey: string;
}

export interface StreamInputOutputUpdateInputs {
  enabled: boolean;
}

export interface OrganizationPaymentIntegrationCreateInputs {
  type: keyof typeof PaymentIntegrationType;
  name: string;
  currencyCode: string;
  clientId?: string;
  clientPublicKey?: string;
  clientSecret?: string;
}

export interface OrganizationPaymentIntegrationUpdateInputs {
  name?: string | null;
}
