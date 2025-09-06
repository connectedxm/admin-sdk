import {
  AdvertisementType,
  BadgeFieldTransformation,
  BadgeFieldType,
  ContentGuestType,
  EventAgendaVisibility,
  EventType,
  GroupAccess,
  RegistrationQuestionType,
  MembershipPriceType,
  MembershipPriceInterval,
  PassTypeVisibility,
  PassTypeAccessLevel,
  SubscriptionStatus,
  BaseMembership,
  BaseAccount,
  BaseMembershipPrice,
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
  country?: string | null;
  internalRefId?: string | null;
  verified?: boolean;
  locale?: string | null;
  taxEntityUseCode?: string | null;
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
  country?: string | null;
  internalRefId?: string | null;
  verified?: boolean;
  locale?: string | null;
  taxEntityUseCode?: string | null;
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
  type: ActivityEntityType;
  startIndex: number;
  endIndex: number;
  marks: ("bold" | "italic" | "underline" | "strike")[];
}

export interface MentionInputs extends BaseActivityEntityInput {
  type: ActivityEntityType.mention;
  accountId: string;
}

export interface LinkInputs extends BaseActivityEntityInput {
  type: ActivityEntityType.link;
}

export interface InterestInputs extends BaseActivityEntityInput {
  type: ActivityEntityType.interest;
}

export interface SegmentInputs extends BaseActivityEntityInput {
  type: ActivityEntityType.segment;
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
}

export interface ActivityUpdateInputs {
  message?: string | null;
  entities?: ActivityEntityInputs[] | null;
  moderation?: keyof typeof ModerationStatus | null;
  featured?: boolean;
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
  published?: string | null;
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
  meetingUrl?: string | null;
  registration?: boolean;
  registrationStart?: string | null;
  registrationEnd?: string | null;
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
  template?: boolean;
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
}

export interface EventSessionLocationCreateInputs {
  name: string;
  googlePlaceId?: string | null;
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
  googlePlaceId?: string | null;
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
  span?: number | string | null;
  mutable?: boolean;
  min?: string | null;
  max?: string | null;
  validation?: string | null;
  validationMessage?: string | null;
  sortOrder?: number | string | null;
  featured?: boolean;
  choices?: string[] | null;
  price?: number | string | null;
  supply?: number | string | null;
}

export interface EventSessionQuestionSearchInputs {
  value: string;
  top?: boolean;
}

export interface EventSessionQuestionSearchValuesCreateInputs {
  values?: string;
}
export interface EventSessionQuestionSearchValueUpdateInputs {
  value?: string | null;
  top?: boolean;
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
  span?: number | string | null;
  mutable?: boolean;
  min?: string | null;
  max?: string | null;
  validation?: string | null;
  validationMessage?: string | null;
  sortOrder?: number | string | null;
  featured?: boolean;
  price?: number | string | null;
  supply?: number | string | null;
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
  meetingUrl?: string | null;
  registration?: boolean;
  registrationStart?: string | null;
  registrationEnd?: string | null;
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
  // MODULES
  activities: Omit<ModulePermissions, "superEnabled" | "enabled">;
  events: Omit<ModulePermissions, "superEnabled" | "enabled">;
  bookings: Omit<ModulePermissions, "superEnabled" | "enabled">;
  groups: Omit<ModulePermissions, "superEnabled" | "enabled">;
  accounts: Omit<ModulePermissions, "superEnabled" | "enabled">;
  channels: Omit<ModulePermissions, "superEnabled" | "enabled">;
  threads: Omit<ModulePermissions, "superEnabled" | "enabled">;
  storage: Omit<ModulePermissions, "superEnabled" | "enabled">;
  support: Omit<ModulePermissions, "superEnabled" | "enabled">;
  sponsors: Omit<ModulePermissions, "superEnabled" | "enabled">;
  benefits: Omit<ModulePermissions, "superEnabled" | "enabled">;
  interests: Omit<ModulePermissions, "superEnabled" | "enabled">;
  advertisements: Omit<ModulePermissions, "superEnabled" | "enabled">;
  subscriptions: Omit<ModulePermissions, "superEnabled" | "enabled">;
  invoices: Omit<ModulePermissions, "superEnabled" | "enabled">;
  announcements: Omit<ModulePermissions, "superEnabled" | "enabled">;
  surveys: Omit<ModulePermissions, "superEnabled" | "enabled">;
  streams: Omit<ModulePermissions, "superEnabled" | "enabled">;
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
  taxable?: boolean;
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
  amount?: number | null;
}

export interface InvoiceUpdateInputs {
  title?: string | null;
  description?: string | null;
  dueDate?: string | null;
  notes?: string | null;
  accountId?: string | null;
  eventId?: string | null;
  taxable?: boolean;
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
  currency?: string | null;
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
  requireTitle?: boolean;
  requireCompany?: boolean;
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
  span?: number | string | null;
  mutable?: boolean;
  min?: string | null;
  max?: string | null;
  validation?: string | null;
  validationMessage?: string | null;
  sortOrder?: number | string | null;
  featured?: boolean;
  choices?: string[] | null;
}

export interface EventQuestionSearchInputs {
  value: string;
  top?: boolean;
}

export interface EventQuestionSearchValuesCreateInputs {
  values?: string;
}
export interface EventQuestionSearchValueUpdateInputs {
  value?: string | null;
  top?: boolean;
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
  span?: number | string | null;
  mutable?: boolean;
  min?: string | null;
  max?: string | null;
  validation?: string | null;
  validationMessage?: string | null;
  sortOrder?: number | string | null;
  featured?: boolean;
  unique?: boolean;
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
  groupId?: string | null;
  details?: object | null;
  imageId?: string | null;
  public?: boolean;
}

export interface StreamInputUpdateInputs {
  name?: string;
  sortOrder?: number | string | null;
  eventId?: string | null;
  sessionId?: string | null;
  groupId?: string | null;
  details?: object | null;
  connected?: boolean;
  imageId?: string | null;
  public?: boolean;
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

export interface MembershipCreateInputs {
  name: string;
  active?: boolean;
  description?: string | null;
  statementDescriptor?: string | null;
  features?: string[] | null;
}

export interface MembershipPriceCreateInputs {
  active?: boolean;
  type: keyof typeof MembershipPriceType;
  amount: string | number; // Assuming REQUIRED_PRICE can be string or number
  currency: "usd"; // Assuming currency is limited to 'usd'
  interval: keyof typeof MembershipPriceInterval;
  intervalCount: string | number;
}

export interface MembershipPriceUpdateInputs {
  active?: boolean;
}

export interface MembershipUpdateInputs {
  active?: boolean;
  name?: string | null;
  description?: string | null;
  statementDescriptor?: string | null;
  features?: string[] | null;
}

export interface SubscriptionCreateInputs {
  status?: SubscriptionStatus;
  expiresAt?: string | null;
  cancelAtEnd?: boolean;
  integrationId?: string | null;
  subscriptionProductId?: string | null;
  subscriptionProduct?: BaseMembership;
  accountId?: string | null;
  account?: BaseAccount;
  priceId?: string | null;
  price?: BaseMembershipPrice;
}

export interface SubscriptionUpdateInputs {
  accountId?: string | null;
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
  streamId?: string;
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
  sortOrder?: number | string | null;
  enableCoupons?: boolean;
  overrideStartDate?: string | null;
  requireCoupon?: boolean;
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
  sortOrder?: number | string | null;
  enableCoupons?: boolean;
  overrideStartDate?: string | null;
  requireCoupon?: boolean;
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
}

export interface EventRoomTypeTranslationUpdateInputs {
  name?: string | null;
  description?: string | null;
}

export interface EventRoomTypeReservationCreateInputs {
  eventRoomTypeId: string;
  passes?: { id: string }[];
  start?: string | null;
  end?: string | null;
}

export interface EventRoomTypeReservationUpdateInputs {
  eventRoomTypeId?: string;
  start?: string | null;
  end?: string | null;
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
  subscriptionTaxCode?: string | null;
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
  span?: number | string | null;
  mutable?: boolean;
  min?: string | null;
  max?: string | null;
  validation?: string | null;
  validationMessage?: string | null;
  sortOrder?: number | string | null;
  featured?: boolean;
  choices?: string[] | null;
}

export interface SurveyQuestionSearchInputs {
  value: string;
  top?: boolean;
}

export interface SurveyQuestionSearchValuesCreateInputs {
  values?: string;
}
export interface SurveyQuestionSearchValueUpdateInputs {
  value?: string | null;
  top?: boolean;
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
  span?: number | string | null;
  mutable?: boolean;
  min?: string | null;
  max?: string | null;
  validation?: string | null;
  validationMessage?: string | null;
  sortOrder?: number | string | null;
  featured?: boolean;
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
}

export interface EventPackageUpdateInputs {
  name?: string;
  description?: string | null;
  price?: number;
  isActive?: boolean;
  imageId?: string | null;
  sortOrder?: number | string | null;
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
