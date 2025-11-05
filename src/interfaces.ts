export interface ConnectedXMResponse<TData> {
  status: string;
  message: string;
  count?: number;
  data: TData;
  cursor?: string | number | null;
}

export enum OrganizationActionType {
  create = "create",
  read = "read",
  update = "update",
  delete = "delete",
}

export enum ImportType {
  accountTiers = "account-tiers",
}

export enum TaxLocationType {
  pointOfSale = "pointOfSale",
  accountAddress = "accountAddress",
}

export enum OrganizationModuleType {
  activities = "activities",
  events = "events",
  groups = "groups",
  accounts = "accounts",
  channels = "channels",
  threads = "threads",
  storage = "storage",
  support = "support",
  sponsors = "sponsors",
  benefits = "benefits",
  interests = "interests",
  advertisements = "advertisements",
  subscriptions = "subscriptions",
  invoices = "invoices",
  streams = "streams",
}

export enum LocationQuestionOption {
  country = "country",
  countryState = "countryState",
  countryStateCity = "countryStateCity",
}

export interface BaseOrganizationModule {
  id: string;
  moduleType: OrganizationModuleType;
  superEnabled: boolean;
  requireAuth: boolean;
  enabled: boolean;
  editable: boolean;
}

export interface OrganizationModule extends BaseOrganizationModule {
  enabledTiers: BaseTier[];
  editableTiers: BaseTier[];
  options: object | null;
  createdAt: string;
  updatedAt: string;
}

export enum Currency {
  USD = "USD",
}

export enum ContentGuestType {
  guest = "guest",
  host = "host",
  author = "author",
}

export enum PageType {
  about = "about",
  privacy = "privacy",
  terms = "terms",
  team = "team",
}

export enum UserRole {
  manager = "manager",
  staff = "staff",
}

export enum AccountAccess {
  FULL_ACCESS = "FULL_ACCESS",
  DELISTED = "DELISTED",
  RESTRICTED = "RESTRICTED",
  BANNED = "BANNED",
}

export enum PushService {
  apn = "apn",
  firebase = "firebase",
  huawei = "huawei",
  xiaomi = "xiaomi",
}

export enum DelegateRole {
  manager = "manager",
  member = "member",
}

export enum EventType {
  physical = "physical",
  virtual = "virtual",
  hybrid = "hybrid",
}

export enum EventSource {
  admin = "admin",
  moderator = "moderator",
  account = "account",
}

export enum PassTypeVisibility {
  public = "public",
  private = "private",
}

export enum PassTypeAccessLevel {
  regular = "regular",
  virtual = "virtual",
  vip = "vip",
}

export enum EventAgendaVisibility {
  everyone = "everyone",
  registered = "registered",
  hidden = "hidden",
}

export enum GroupAccess {
  public = "public",
  private = "private",
}

export enum GroupMembershipRole {
  member = "member",
  moderator = "moderator",
}

export enum NotificationType {
  ANNOUNCEMENT = "ANNOUNCEMENT",
  FOLLOW = "FOLLOW",
  INVITATION = "INVITATION",
  TRANSFER = "TRANSFER",
  LIKE = "LIKE",
  COMMENT = "COMMENT",
  EVENT = "EVENT",
  ACTIVITY = "ACTIVITY",
}

export enum AdvertisementType {
  square = "square",
  rectangle = "rectangle",
}

export enum ImageType {
  admin = "admin",
  people = "people",
  activity = "activity",
  banner = "banner",
  chat = "chat",
  content = "content",
}

export enum SupportTicketType {
  support = "support",
  feedback = "feedback",
  bug = "bug",
}

export enum SupportTicketState {
  new = "new",
  awaitingAdmin = "awaitingAdmin",
  awaitingClient = "awaitingClient",
  resolved = "resolved",
  spam = "spam",
}

export enum ChannelFormat {
  article = "article",
  podcast = "podcast",
  video = "video",
}

export enum ContentStatus {
  draft = "draft",
  published = "published",
}

export enum VideoStatus {
  pendingupload = "pendingupload",
  downloading = "downloading",
  queued = "queued",
  inprogress = "inprogress",
  ready = "ready",
  error = "error",
}

export enum RegistrationQuestionType {
  text = "text",
  textarea = "textarea",
  number = "number",
  time = "time",
  date = "date",
  toggle = "toggle",
  select = "select",
  radio = "radio",
  checkbox = "checkbox",
  search = "search",
  file = "file",
  location = "location",
}

export enum OrganizationTriggerType {
  postAuth = "postAuth",
}

export enum AuthLayout {
  default = "default",
  social = "social",
}

export enum DefaultAuthAction {
  signIn = "signIn",
  signUp = "signUp",
}

export enum FileSource {
  admin = "admin",
  response = "response",
  content = "content",
}

export enum SessionAccess {
  public = "PUBLIC",
  private = "PRIVATE",
}

export interface BaseAccountAttribute {
  id: string;
  name: string;
  label: string;
  type: "text" | "number" | "date" | "boolean";
  description: string | null;
  required: boolean;
  adminOnly: boolean;
  editable: boolean;
  public: boolean;
  includedInDashboards: boolean;
  sortOrder: number;
}

export interface AccountAttribute extends BaseAccountAttribute {
  createdAt: string;
  updatedAt: string;
  _count: {
    values: number;
  };
}

export interface BaseAccountAttributeValue {
  id: string;
  attributeId: string;
  attribute: BaseAccountAttribute;
  value: string;
}

export interface AccountAttributeValue extends BaseAccountAttributeValue {
  createdAt: string;
  updatedAt: string;
}

export interface BaseAccount {
  organizationId: string;
  id: string;
  accountAccess: AccountAccess;
  firstName: string | null;
  lastName: string | null;
  email: string;
  verified: boolean;
  username: string;
  imageId: string;
  image: BaseImage;
  featured: boolean;
  timezone: string | null;
  locale: string;
  country: string | null;
  internalRefId: string | null;
  accountTiers: BaseTier[];
  chatConnected: boolean;
  subscriptions: {
    subscriptionProduct: {
      tiers: BaseTier[];
    };
  }[];
  attributes?: AccountAttributeValue[];
  createdAt: string;
}

export interface Account extends BaseAccount {
  bannerId: string | null;
  banner: BaseImage | null;
  phone: string | null;
  interests: BaseInterest[];
  bio: string | null;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedIn: string | null;
  tikTok: string | null;
  video: string | null;
  youtube: string | null;
  dietaryRestrictions: string | null;
  taxEntityUseCode: string | null;
  attributes?: AccountAttributeValue[];
  updatedAt: string;
}

export interface BaseAccountInvitation {
  email: string;
  createdAt: string;
}

export interface AccountInvitation extends BaseAccountInvitation {}

export interface BaseAccountAddress {
  id: string;
  primary: boolean;
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

export interface AccountAddress extends BaseAccountAddress {
  createdAt: string;
  updatedAt: string;
}

export interface BaseAPILog {
  id: string;
  login: BaseLogin | null;
  account: BaseAccount | null;
  user: BaseUser | null;
  source: "admin" | "client";
  // RESPONSE
  status: "success" | "failure";
  statusCode: number;
  response: string | null;
  path: string;
  method: string;
  deviceType: string | null;
  ipaddress: string;
  country: string;
  createdAt: string;
}

export interface APILog extends BaseAPILog {
  headers: object | null;
  params: object | null;
  query: object | null;
  body: object | null;
  // TRACKING
  updatedAt: string;
  // User Agent
  architecture: string | null;
  browser: string | null;
  browserVersion: string | null;
  deviceModel: string | null;
  deviceVendor: string | null;
  engine: string | null;
  engineVersion: string | null;
  osName: string | null;
  osVersion: string | null;
}

export interface AuthSession {
  id: number;
  organizationId: string;
  login?: BaseLogin;
  createdAt: string;
}

export interface BaseTier {
  id: string;
  slug: string;
  priority: number;
  name: string;
  iconName: string;
  color: string | null;
  internal: boolean;
  imageId: string | null;
  image: BaseImage | null;
}

export interface Tier extends BaseTier {
  description: string | null;
  exclusionGroup: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    accounts: number;
  };
}

export interface BaseActivationCompletion {
  id: string;
  eventId: string;
  eventActivationId: string;
  eventActivation: BaseEventActivation;
  earnedPoints: number;
  passId: string;
}

export interface ActivationCompletion extends BaseActivationCompletion {
  pass: BaseEventPass;
  createdAt: string;
  updatedAt: string;
}

export enum EventActivationType {
  public = "public",
  private = "private",
  protected = "protected",
}

export interface BaseEventActivation {
  id: string;
  slug: string;
  visible: boolean;
  name: string;
  shortDescription: string;
  maxPoints: number;
  startAfter: string | null;
  type: keyof typeof EventActivationType;
  accessLevel: keyof typeof PassTypeAccessLevel;
}

export interface EventActivation extends BaseEventActivation {
  eventId: string;
  event: BaseEvent;
  imageId: string | null;
  image: BaseImage | null;
  protectionCode: number | null;
  longDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActivationTranslation {
  id: number;
  locale: string;
  name: string;
  shortDescription: string;
  longDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export enum ModerationStatus {
  none = "none",
  reported = "reported",
  approved = "approved",
}

export enum ActivityStatus {
  draft = "draft",
  scheduled = "scheduled",
  published = "published",
  archived = "archived",
}

export interface BaseActivity {
  id: string;
  message: string;
  status: keyof typeof ActivityStatus;
  featured: boolean;
  pinned: boolean;
  giphyId: string | null;
  imageId: string | null;
  image: BaseImage | null;
  account: BaseAccount;
  entities: BaseActivityEntity[];
  moderation: keyof typeof ModerationStatus | null;
  eventId: string | null;
  groupId: string | null;
  contentId: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    likes: number;
    comments: number;
  };
}

export interface Activity extends BaseActivity {
  video: BaseVideo | null;
  group: BaseGroup | null;
  event: BaseEvent | null;
  content: BaseChannelContent | null;
  schedule: BaseSchedule | null;
}

export enum ActivityEntityType {
  mention = "mention",
  interest = "interest",
  link = "link",
  segment = "segment",
}

export interface BaseActivityEntity {
  type: ActivityEntityType;
  startIndex: number;
  endIndex: number;
  marks: string[];
  accountId: string;
  account: BaseAccount;
  interestId: string;
  interest: BaseInterest;
  linkPreviewId: string;
  linkPreview: BaseLinkPreview;
}

export interface ActivityEntity extends BaseActivityEntity {}

export interface AdvertisementClick {
  id: string;
  organizationId: string;
  advertisementId: string;
  advertisement: BaseAdvertisement;
  accountId: string | null;
  account: BaseAccount | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseAdvertisement {
  id: string;
  type: AdvertisementType;
  link: string;
  title: string;
  description: string | null;
  imageId: string | null;
  image: BaseImage | null;
  startDate: string;
  endDate: string | null;
  weight: number;
  accountId: string | null;
  eventId: string | null;
  enabled: boolean;
}

export interface Advertisement extends BaseAdvertisement {
  account: BaseAccount | null;
  event: BaseEvent | null;
  eventOnly: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    views: number;
    clicks: number;
  };
}

export interface AdvertisementView {
  id: string;
  organizationId: string;
  advertisementId: string;
  advertisement: Advertisement;
  accountId: string | null;
  account: Account | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseAnnouncement {
  id: string;
  slug: string;
  title: string | null;
  html: string | null;
  email: boolean;
  push: boolean;
  sms: boolean;
  includePasses: boolean;
  accountId: string | null;
  creatorId: string | null;
  eventId: string | null;
  groupId: string | null;
  tierId: string | null;
  channelId: string | null;
  ticketId: string | null;
  userId: string | null;
  schedule: BaseSchedule;
  createdAt: string;
}

export interface EventAnnouncementFilters {
  type: "event";
  ticketId?: string;
  questionId?: string;
  choiceId?: string;
  eventRoomTypeId?: string;
  addOnId?: string;
}

export interface Announcement extends BaseAnnouncement {
  _count: {
    notifications: number;
    emailReceipt: number;
  };
  verifiedAccounts: boolean;
  account: BaseAccount | null;
  creator: BaseAccount | null;
  event: BaseEvent | null;
  group: BaseGroup | null;
  tier: BaseTier | null;
  channel: BaseChannel | null;
  sponsorshipLevelId: string | null;
  sponsorshipLevel: BaseLevel | null;
  ticket: BaseEventPassType | null;
  user: BaseUser | null;
  message: string | null;
  filters: EventAnnouncementFilters | null;
  updatedAt: string;
}

export interface AnnouncementTranslation {
  id: number;
  locale: string;
  title: string | null;
  html: string | null;
  message: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BenefitClick {
  id: string;
  benefitId: string;
  benefit: BaseBenefit;
  accountId: string | null;
  account: BaseAccount | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseBenefit {
  id: string;
  slug: string;
  link: string;
  imageId: string | null;
  image: BaseImage | null;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  priority: number;
}

export interface Benefit extends BaseBenefit {
  managerId: string | null;
  manager: BaseAccount | null;
  eventId: string | null;
  event: BaseEvent | null;
  eventOnly: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    clicks: number;
  };
}

export interface BenefitTranslation {
  id: number;
  locale: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseChannelContent {
  id: string;
  featured: boolean;
  slug: string;
  title: string | null;
  description: string | null;
  imageId: string | null;
  image: BaseImage | null;
  squareImageId: string | null;
  squareImage: BaseImage | null;
  imageUrl: string | null;
  audioId: number | null;
  audio: BaseFile | null;
  videoId: string | null;
  video: BaseVideo | null;
  channelId: string;
  channel: BaseChannel | null;
  duration: string | null;
  published: string | null;
  email: boolean;
  push: boolean;
}

export interface ChannelContent extends BaseChannelContent {
  body: string | null;
  externalUrl: string | null;
  appleUrl: string | null;
  spotifyUrl: string | null;
  googleUrl: string | null;
  youtubeUrl: string | null;
  guests: BaseChannelContentGuest[];
  publishSchedule: BaseSchedule | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    likes: number;
    activities: number;
  };
}

export interface BaseChannelContentLike {
  accountId: string;
  channelId: string;
  contentId: string;
}

export interface ChannelContentLike extends BaseChannelContentLike {
  account: BaseAccount;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelContentTranslation {
  id: number;
  locale: string;
  title: string;
  description: string | null;
  body: string | null;
  imageId: string | null;
  image: BaseImage | null;
  audioId: number | null;
  audio: BaseFile | null;
  videoId: string | null;
  video: BaseVideo | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseChannel {
  id: string;
  slug: string;
  featured: boolean;
  name: string;
  description: string | null;
  priority: number;
  visible: boolean;
  private: boolean;
  imageId: string;
  image: BaseImage;
  bannerId: string | null;
  banner: BaseImage | null;
  _count: {
    subscribers: number;
  };
}

export interface Channel extends Omit<BaseChannel, "_count"> {
  externalUrl: string | null;
  appleUrl: string | null;
  spotifyUrl: string | null;
  googleUrl: string | null;
  youtubeUrl: string | null;
  creatorId: string | null;
  creator: BaseAccount | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    subscribers: number;
    contents: number;
  };
}

export interface BaseChannelSubscriber {
  organizationId: string | null;
  channelId: string | null;
  channel: Channel;
  accountId: string | null;
  account: Account;
  contentEmailNotification: boolean;
  contentPushNotification: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelTranslation {
  id: string;
  locale: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseCoupon {
  eventId: string;
  id: string;
  prePaid: boolean;
  code: string;
  description: string | null;
  active: boolean;
  startDate: string | null;
  endDate: string | null;
  discountAmount: number;
  discountPercent: number;
  quantityMin: number;
  quantityMax: number | null;
  useLimit: number | null;
  limitPerAccount: number | null;
  purchaseLimit: number | null;
  emailDomains: string | null;
  ticketId: string | null;
  ticket: BaseEventPassType | null;
  applyToPassType: boolean;
  applyToAddOns: boolean;
  applyToReservation: boolean;
  registrationId: string | null;
  registration: {
    accountId: string;
  } | null;
}

export interface Coupon extends BaseCoupon {
  registration: BaseEventAttendee | null;
  lineItem: PaymentLineItem | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    purchases: number;
    payments: number;
  };
}

export enum EmailReceiptStatus {
  pending = "pending",
  delivered = "delivered",
  bounced = "bounced",
  complaint = "complaint",
  opened = "opened",
}

export interface BaseEmailReceipt {
  id: string;
  status: EmailReceiptStatus;
  from: string;
  to: string;
  replyTo: string | null;
  subject: string;
  accountId: string | null;
  account: BaseAccount | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmailReceipt extends BaseEmailReceipt {
  html: string;
  text: string;
  debug: string | null;
}

export interface BaseEventAddOn {
  id: string;
  name: string;
  shortDescription: string;
  supply: number | null;
  price: number;
  pricePerNight: boolean;
  sortOrder: number;
  imageId: string | null;
  image: BaseImage | null;
  eventId: string | null;
  taxCode: string | null;
  taxIncluded: boolean;
  taxLocation: TaxLocationType;
  createdAt: string;
  updatedAt: string;
}

export interface EventAddOn extends BaseEventAddOn {
  longDescription: string | null;
  event: BaseEvent | null;
  allowedTickets: BaseEventPassType[];
  allowedTiers: BaseTier[];
  disallowedTiers: BaseTier[];
  _count: {
    passes: number;
  };
}

export interface EventAddOnTranslation {
  id: number;
  locale: string;
  name: string;
  shortDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventActivationTranslation {
  locale: string;
  name: string;
  shortDescription: string;
  longDescription: string | null;
}

export enum EventEmailType {
  confirmation = "confirmation",
  cancellation = "cancellation",
  reminder = "reminder",
}

export interface BaseEventEmail {
  type: EventEmailType;
  eventId: string;
  body: string | null;
  replyTo: string | null;
  enabled: boolean;
  calendarFile: boolean;
}

export interface EventEmail extends BaseEventEmail {
  createdAt: string;
  updatedAt: string;
}

export interface EventEmailTranslation {
  id: number;
  locale: string;
  body: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventListing {}

export enum BadgeFieldType {
  attribute = "attribute",
  question = "question",
  tier = "tier",
  ticket = "ticket",
  pass = "pass",
  session = "session",
  session_question = "session_question",
}

export enum BadgeFieldTransformation {
  uppercase = "uppercase",
  lowercase = "lowercase",
}

export interface BaseEventOnSiteBadgeField {
  id: number;
  eventId: string;
  name: string;
  type: BadgeFieldType;
  lookup: string | null;
  maxLength: number | null;
  defaultValue: string | null;
  transformation: BadgeFieldTransformation | null;
  iconData: string | null;
  sessionId: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventOnSiteBadgeField extends BaseEventOnSiteBadgeField {
  onSite: EventOnSite;
}

export interface BaseEventOnSite {
  eventId: string;
  authenticationCode: number;
  zplTemplate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventOnSite extends BaseEventOnSite {
  badgeFields: BaseEventOnSiteBadgeField[];
}

export interface BaseEventPage {
  id: string;
  slug: string;
  title: string;
  active: boolean;
  subtitle: string | null;
  sortOrder: number;
}

export interface EventPage extends BaseEventPage {
  html: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventPageTranslation {
  id: number;
  locale: string;
  title: string | null;
  subtitle: string | null;
  html: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseEvent {
  id: string;
  slug: string;
  internalRefId: string | null;
  featured: boolean;
  visible: boolean;
  template: boolean;
  source: EventSource;
  eventType: EventType;
  name: string;
  shortDescription: string;
  eventStart: string;
  eventEnd: string;
  timezone: string;
  externalUrl: string | null;
  venue: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip: string | null;
  imageId: string | null;
  image: BaseImage | null;
  squareImageId: string | null;
  squareImage: BaseImage | null;
  registration: boolean;
  registrationStart: string | null;
  registrationEnd: string | null;
  createdAt: string;
  updatedAt: string;
  seriesId: string | null;
  series: BaseSeries | null;
}

export interface Event extends BaseEvent {
  roundName: string | null;
  matchName: string | null;
  passSupply: number | null;
  passLimitPerAccount: number | null;
  reservationDescription: string | null;
  longDescription: string | null;
  meetingUrl: string | null;
  creatorId: string | null;
  creator: BaseAccount | null;
  registrationLimit: number | null;
  allowMultipleRegistrations: boolean;
  allowSplitPayment: boolean;
  splitPaymentPercentage: number;
  splitPaymentNetDays: number | null;
  splitPaymentDueDate: string | null;
  publicRegistrants: boolean;
  sessionsVisibility: EventAgendaVisibility;
  speakersVisibility: EventAgendaVisibility;
  checkinCode: number | null;
  iosAppLink: string | null;
  androidAppLink: string | null;
  newActivityCreatorEmailNotification: boolean;
  newActivityCreatorPushNotification: boolean;
  streamInputs: BaseStreamInput[];
  streamReplayId: string | null;
  streamReplay: BaseVideo | null;
  groupId: string | null;
  group: BaseGroup | null;
  groupOnly: boolean;
  backgroundImageId: string | null;
  backgroundImage: BaseImage | null;
  activityFeedEnabled: boolean;
  options: object | null;
}

export interface EventTranslation {
  id: number;
  locale: string;
  name: string;
  shortDescription: string;
  longDescription: string | null;
  reservationDescription: string | null;
  imageId: string | null;
  image: BaseImage | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseFaqSection {
  id: string;
  slug: string;
  name: string;
  priority: number;
}

export interface FaqSection extends BaseFaqSection {
  faqs: BaseFaq[];
  eventId: string;
  event: BaseEvent;
  createdAt: string;
  updatedAt: string;
}

export interface FaqSectionTranslation {
  id: number;
  locale: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface BaseFaq {
  id: string;
  slug: string;
  visible: boolean;
  question: string;
  answer?: string;
}

export interface Faq extends BaseFaq {
  priority: number;
  organizationId: string;
  eventId: string;
  sectionId: string;
  section: BaseFaqSection;
  createdAt: string;
  updatedAt: string;
}

export interface FaqTranslation {
  id: number;
  locale: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export enum SupportedLocale {
  af = "af",
  sq = "sq",
  am = "am",
  ar = "ar",
  hy = "hy",
  az = "az",
  bn = "bn",
  bs = "bs",
  bg = "bg",
  "zh-CN" = "zh-CN",
  ca = "ca",
  "zh-TW" = "zh-TW",
  hr = "hr",
  cs = "cs",
  da = "da",
  nl = "nl",
  en = "en",
  et = "et",
  fi = "fi",
  fr = "fr",
  "fr-CA" = "fr-CA",
  ka = "ka",
  de = "de",
  el = "el",
  ht = "ht",
  he = "he",
  hi = "hi",
  hu = "hu",
  is = "is",
  id = "id",
  ga = "ga",
  it = "it",
  ja = "ja",
  kk = "kk",
  ko = "ko",
  lv = "lv",
  lt = "lt",
  mk = "mk",
  ms = "ms",
  mt = "mt",
  mn = "mn",
  no = "no",
  fa = "fa",
  ps = "ps",
  pl = "pl",
  pt = "pt",
  "pt-PT" = "pt-PT",
  pa = "pa",
  ro = "ro",
  ru = "ru",
  sr = "sr",
  sk = "sk",
  sl = "sl",
  so = "so",
  es = "es",
  "es-MX" = "es-MX",
  sw = "sw",
  sv = "sv",
  ta = "ta",
  th = "th",
  tr = "tr",
  uk = "uk",
  ur = "ur",
  uz = "uz",
  vi = "vi",
}

export type ISupportedLocale = keyof typeof SupportedLocale;

export enum GroupInvitationStatus {
  invited = "invited",
  rejected = "rejected",
  canceled = "canceled",
}

export interface BaseGroupInvitation {
  id: string;
  status: GroupInvitationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GroupInvitation extends BaseGroupInvitation {
  group: BaseGroup;
  groupId: string;
  accountId: string;
  account: BaseAccount;
  inviterId: string;
  inviter: BaseAccount;
}

export interface BaseGroupMembership {
  accountId: string;
  account: BaseAccount;
  groupId: string;
  group: BaseGroup;
  role: GroupMembershipRole;
  createdAt: string;
}

export enum ActivityPreference {
  all = "all",
  featured = "featured",
  none = "none",
}

export interface GroupMembership extends BaseGroupMembership {
  announcementEmailNotification: boolean;
  announcementPushNotification: boolean;
  activityEmailNotification: boolean;
  activityPushNotification: boolean;
  eventEmailNotification: boolean;
  eventPushNotification: boolean;
  updatedAt: string;
}

export enum GroupRequestStatus {
  requested = "requested",
  rejected = "rejected",
}

export interface BaseGroupRequest {
  id: string;
  status: GroupRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GroupRequest extends BaseGroupRequest {
  groupId: string;
  group: BaseGroup;
  accountId: string;
  account: BaseAccount;
}

export interface BaseGroup {
  id: string;
  slug: string;
  name: string;
  active: boolean;
  access: GroupAccess;
  description: string;
  featured: boolean;
  imageId: string | null;
  image: BaseImage | null;
  squareImageId: string | null;
  squareImage: BaseImage | null;
  _count: {
    members: number;
  };
}

export interface Group extends BaseGroup {
  externalUrl: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    members: number;
    interests: number;
    events: number;
  };
}

export interface GroupTranslation {
  id: number;
  locale: string;
  name: string;
  description: string;
  imageId: string | null;
  image: BaseImage | null;
  createdAt: string;
  updatedAt: string;
}

enum ImageModerationLevel {
  safe = "safe",
  warning = "warning",
}

export interface BaseImage {
  id: string;
  name: string | null;
  uri: string;
  width: number;
  height: number;
  createdAt: string;
}

export interface Image extends BaseImage {
  type: ImageType;
  description: string | null;
  moderation: ImageModerationLevel;
  updatedAt: string;
}

export enum ExportStatus {
  pending = "pending",
  resolved = "resolved",
  failed = "failed",
}

export enum ImportItemStatus {
  pending = "pending",
  resolved = "resolved",
  failed = "failed",
}

export interface BaseImportItem {
  id: string;
  importId: string;
  values: string;
  status: ImportItemStatus;
  message: string | null;
  debug: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ImportItem extends BaseImportItem {
  import: BaseImport;
}

export interface BaseImport {
  id: string;
  type: string;
  overwrite: boolean;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Import extends BaseImport {
  user: BaseUser;
  tier: BaseTier;
  _count: {
    items: number;
  };
}

export enum IntegrationType {
  snagtag = "snagtag",
}

export interface BaseIntegration {
  id: string;
  type: IntegrationType;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Integration extends BaseIntegration {
  publicUrl: string | null;
  publicKey: string | null;
  secretKey: string | null;
  details: {
    type: keyof typeof IntegrationType;
    name: string;
    description: string;
    logo: string;
  };
}

export interface BaseInterest {
  id: string;
  featured: boolean;
  name: string;
  imageId: string | null;
  image: BaseImage | null;
}

export interface Interest extends BaseInterest {
  createdAt: string;
  updatedAt: string;
  _count: {
    accounts: number;
    groups: number;
  };
}

export interface BaseSearchList {
  id: string;
  organizationId: string;
  name: string;
}

export interface SearchList extends BaseSearchList {
  createdAt: string;
  updatedAt: string;
  _count: {
    values: number;
  };
}

export interface BaseSearchListValue {
  id: string;
  searchListId: string;
  value: string;
  priority: number | null;
}

export interface SearchListValue extends BaseSearchListValue {
  createdAt: string;
  updatedAt: string;
  searchList: SearchList;
}

export interface SearchListConnectedQuestion {
  id: string;
  name: string;
  label: string | null;
  type: string;
  required: boolean;
  questionType: "registration" | "session" | "survey";
  parentName: string;
  parentId: string;
  sessionName?: string;
  sessionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BaseInvoiceLineItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  amount: number;
  taxCode: string | null;
  taxIncluded: boolean;
  taxLocation: TaxLocationType;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceLineItem extends BaseInvoiceLineItem {
  invoiceId: string;
  invoice: BaseInvoice;
}

export enum InvoiceStatus {
  draft = "draft",
  sent = "sent",
  paid = "paid",
  void = "void",
}

export interface BaseInvoice {
  id: string;
  alternateId: string;
  dueDate: string;
  sentDate: string | null;
  status: InvoiceStatus;
  title: string;
  notes: string | null;
}

export interface Invoice extends BaseInvoice {
  lineItems: BaseInvoiceLineItem;
  accountId: string | null;
  account: BaseAccount | null;
  eventId: string | null;
  event: BaseEvent | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseLike {
  activity: BaseActivity;
  account: BaseAccount;
}

export interface Like extends BaseLike {
  createdAt: string;
  updatedAt: string;
}

export interface BaseLinkPreview {
  url: string;
  siteName: string | null;
  title: string | null;
  description: string | null;
  image: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  imageType: string | null;
  favicon: string | null;
}

export interface LinkPreview extends BaseLinkPreview {}

export interface NotificationPreferences {
  newFollowerPush: boolean;
  likePush: boolean;
  commentPush: boolean;
  transferPush: boolean;
  transferEmail: boolean;
  supportTicketConfirmationEmail: boolean;
  eventReminderEmail: boolean;
  eventAnnouncementEmail: boolean;
  eventAnnouncementPush: boolean;
  chatPush: boolean;
  chatUnreadEmail: boolean;
  chatUnreadPush: boolean;
  organizationAnnouncementEmail: boolean;
  organizationAnnouncementPush: boolean;
  groupAnnouncementEmail: boolean;
  groupAnnouncementPush: boolean;
  groupInvitationEmail: boolean;
  groupInvitationPush: boolean;
  groupRequestAcceptedEmail: boolean;
  groupRequestAcceptedPush: boolean;
}

export interface BaseNotification {
  id: string;
  type: NotificationType;
  read: boolean;
  receiverId: string;
  receiver: BaseAccount;
  senderId: string | null;
  sender: BaseAccount | null;
}

export interface Notification extends BaseNotification {
  transfer: BaseTransfer | null;
  like: BaseLike | null;
  activity: BaseActivity | null;
  event: BaseEvent | null;
  announcement: BaseAnnouncement | null;
  createdAt: string;
  updatedAt: string;
}

export interface ModulePermissions {
  superEnabled: boolean;
  enabled: boolean;
  read: boolean;
  create: boolean;
  update: boolean;
  del: boolean;
}

export interface OrganizationMembership {
  organizationId: string;
  userId: string;
  user: BaseUser;
  // ADMIN
  org: ModulePermissions;
  users: ModulePermissions;
  reports: ModulePermissions;
  dashboards: ModulePermissions;
  logs: ModulePermissions;
  // MODULES
  activities: ModulePermissions;
  events: ModulePermissions;
  attendees: ModulePermissions;
  groups: ModulePermissions;
  accounts: ModulePermissions;
  tiers: ModulePermissions;
  channels: ModulePermissions;
  contents: ModulePermissions;
  threads: ModulePermissions;
  storage: ModulePermissions;
  support: ModulePermissions;
  sponsors: ModulePermissions;
  benefits: ModulePermissions;
  interests: ModulePermissions;
  advertisements: ModulePermissions;
  subscriptions: ModulePermissions;
  invoices: ModulePermissions;
  announcements: ModulePermissions;
  bookings: ModulePermissions;
  surveys: ModulePermissions;
  searchlists: ModulePermissions;
  streams: ModulePermissions;
  payments: ModulePermissions;
}

export interface BaseOrganization {
  id: string;
  slug: string;
  name: string;
  logoId: string | null;
  logo: BaseImage | null;
  iconId: string | null;
  icon: BaseImage | null;
  domain: string | null;
  locale: string;
  currency: string;
}

export interface Organization extends BaseOrganization {
  email: string | null;
  description: string | null;
  phone: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  clientTheme: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedIn: string | null;
  tikTok: string | null;
  youtube: string | null;
  discord: string | null;
  timezone: string | null;
  iosAppLink: string | null;
  androidAppLink: string | null;
  createdAt: string;
  updatedAt: string;
  integrations: Integration[];
  appName: string | null;
  appIconId: string | null;
  appIcon: BaseImage | null;
  appAdaptiveIconId: string | null;
  appAdaptiveIcon: BaseImage | null;
  appSplashScreenId: string | null;
  appSplashScreen: BaseImage | null;
  appSplashScreenColor: string | null;
  darkIconId: string | null;
  darkIcon: BaseImage | null;
  darkLogoId: string | null;
  darkLogo: BaseImage | null;
  requirePhone: boolean;
  requestInternalRefId: boolean;
  internalRefIdName: string | null;
  authLayout: AuthLayout;
  defaultAuthAction: DefaultAuthAction;
  userPoolId: string | null;
  userPoolClientId: string | null;
  userPoolHostedUrl: string | null;
  appBundleIdentifier: string | null;
  expoProjectId: string | null;
  expoSlug: string | null;
  emailAuthEnabled: boolean;
  appleAuthEnabled: boolean;
  facebookAuthEnabled: boolean;
  googleAuthEnabled: boolean;
  oAuth: { id: string }[];
  maxFileGbs: number | null;
  maxImageCount: number | null;
  maxVideoMins: number | null;
  locales: string[];
  inviteOnly: boolean;
  googleTagManagerId: string | null;
  options: object | null;
}

export interface OrganizationTrigger {
  id: number;
  code: string;
  type: OrganizationTriggerType;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum PurchaseStatus {
  draft = "draft",
  canceled = "canceled",
  needsInfo = "needsInfo",
  ready = "ready",
}

export interface BaseEventPass {
  id: string;
  eventId: string;
  attendeeId: string;
  attendee: {
    account: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      email: string;
    };
  };
  alternateId: number;
  ticketId: string;
  ticket: BaseEventPassType;
  location: string | null;
  usedAt: string | null;
  transfer: { id: string; email: string; createdAt: string };
  responses: BaseRegistrationQuestionResponse[];
  status: PurchaseStatus;
  reservationId: string | null;
  reservation: BaseEventRoomTypeReservation | null;
  matches: BaseMatch[];
  couponId: string | null;
  coupon: BaseCoupon | null;
  packageId: string | null;
  package: BaseAttendeePackage | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventPass extends BaseEventPass {
  passAddOns: BasePassAddOn[];
  attendeeId: string;
  attendee: BaseEventAttendee;
  lineItem: PaymentLineItem | null;
  payerId: string | null;
  payer: BaseAccount | null;
}

export interface BasePassAddOn {
  addOnId: string;
  addOn: BaseEventAddOn;
  pass: {
    id: string;
    attendee: {
      accountId: string;
    };
  };
  createdAt: string;
}

export interface PassAddOn extends Omit<BasePassAddOn, "pass"> {
  pass: BaseEventPass;
  updatedAt: string;
}

export interface BasePushDevice {
  id: string;
  name: string | null;
  model: string | null;
  brand: string | null;
  osName: string | null;
  osVersion: string | null;
  deviceYearClass: number | null;
  manufacturer: string | null;
  supportedCpuArchitectures: string | null;
  totalMemory: number | null;
  pushService: PushService;
  login: BaseLogin;
  createdAt: string;
  updatedAt: string;
}

export interface PushDevice extends BasePushDevice {}

export interface BaseRegistrationBypass {
  id: number;
  closed: boolean;
  preRegister: boolean;
  postRegister: boolean;
  accountId: string;
  account: BaseAccount;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationBypass extends BaseRegistrationBypass {}

export enum PaymentType {
  charge = "charge",
  refund = "refund",
}

export interface BasePayment {
  id: number;
  type: PaymentType;
  currency: string;
  ticketId: string | null;
  ticket: BaseEventPassType | null;
  stripeId: string | null;
  last4: string | null;
  debugId: string | null;
  address1: true;
  address2: true;
  city: true;
  country: string;
  state: string;
  zip: string;
  captured: boolean;
  accountId: string | null;
  eventId: string | null;
  registrationId: string | null;
  passTypeId: string | null;
  passId: string | null;
  sessionId: string | null;
  placeId: string | null;
  spaceId: string | null;
  membershipId: string | null;
  couponId: string | null;
  invoiceId: string | null;
  lineItems: BasePaymentLineItem[];
  createdAt: string;
}

export enum PaymentIntegrationType {
  stripe = "stripe",
  paypal = "paypal",
  braintree = "braintree",
  authorizenet = "authorizenet",
  manual = "manual",
}

export interface Payment extends BasePayment {
  locationAddress1: string | null;
  locationAddress2: string | null;
  locationCity: string | null;
  locationState: string | null;
  locationCountry: string | null;
  locationZip: string | null;
  account: BaseAccount | null;
  bypassedId: string | null;
  bypassedBy: BaseUser | null;
  refunds: BasePayment[];
  refunded: Omit<BasePayment, "refunded"> | null;
  deferredAmount: number | null;
  deferredDueDate: string | null;
  deferredInvoices: BaseInvoice[];
  integration: {
    type: PaymentIntegrationType;
  };
  event: BaseEvent | null;
  registration: BaseEventAttendee | null;
  passType: BaseEventPassType | null;
  pass: BaseEventPass | null;
  session: BaseEventSession | null;
  place: BaseBookingPlace | null;
  space: BaseBookingSpace | null;
  membership: BaseMembership | null;
  coupon: BaseCoupon | null;
  invoice: BaseInvoice | null;
  metadata?: any;
  lineItems: Omit<PaymentLineItem, "payment">[];
}

export enum PaymentLineItemType {
  general = "general",
  pass = "pass",
  package = "package",
  reservation = "reservation",
  addOn = "addOn",
  access = "access",
  invoice = "invoice",
  booking = "booking",
  coupon = "coupon",
  subscription = "subscription",
  refund = "refund",
}

export interface BasePaymentLineItem {
  id: string;
  type: keyof typeof PaymentLineItemType;
  parent: string | null;
  name: string;
  quantity: number;
  amount: number;
  paid: number;
  refunded: number;
  discount: number;
  deferred: number;
  salesTax: number;
  refundedSalesTax: number;
  paymentId: number;
  taxCode: string | null;
  taxIncluded: boolean;
  taxLocation: TaxLocationType;
  // ITEM IDS
  passId: string | null;
  packageId: string | null;
  passAddOnId: string | null;
  reservationId: string | null;
  accessId: string | null;
  bookingId: string | null;
  subscriptionId: string | null;
}

export interface PaymentLineItem extends BasePaymentLineItem {
  pass: BaseEventPass | null;
  package: BaseEventPackage | null;
  passAddOn: BasePassAddOn | null;
  reservation: BaseEventRoomTypeReservation | null;
  access: BaseEventSessionAccess | null;
  booking: BaseBooking | null;
  subscription: BaseSubscription | null;
  coupon: BaseCoupon | null;
  payment: BasePayment;
}

export interface PaymentIntegration {
  id: string;
  type: PaymentIntegrationType;
  connectionId: string;
  enabled: boolean;
  stripe?: any | null;
  paypal?: any | null;
  braintree?: any | null;
  authorizenet?: any | null;
  manual?: any | null;
  createdAt: string;
  updatedAt: string;
}

export enum TaxIntegrationType {
  stripe = "stripe",
  taxjar = "taxjar",
  vertex = "vertex",
  avalara = "avalara",
}

export interface TaxIntegration {
  id: string;
  type: TaxIntegrationType;
  connectionId: string;
  sandbox: boolean;
  enabled: boolean;
  companyCode: string;
  commit: boolean;
  logging: boolean;
  passTaxCode: string;
  packageTaxCode: string;
  reservationTaxCode: string;
  addOnTaxCode: string;
  accessTaxCode: string;
  invoiceTaxCode: string;
  bookingTaxCode: string;
  couponTaxCode: string;
  subscriptionTaxCode: string;
  createdAt: string;
  updatedAt: string;
}

enum TaxIntegrationLogType {
  quote = "quote",
  record = "record",
  refund = "refund",
}

export interface BaseTaxIntegrationLog {
  id: string;
  type: TaxIntegrationLogType;
  success: boolean;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaxIntegrationLog extends BaseTaxIntegrationLog {
  request: object;
  response: object;
}

export interface BaseRegistrationQuestionChoice {
  id: string;
  value: string;
  text: string | null;
  description: string | null;
  supply: number | null;
  sortOrder: number;
  subQuestions?:
    | RegistrationQuestion[]
    | {
        questionId: string;
      }[];
  question: {
    id: string;
    name: string;
  };
  _count: {
    subQuestions: number;
  };
}

export interface Question {
  id: string;
  value: string;
}

export interface RegistrationQuestionChoice
  extends BaseRegistrationQuestionChoice {
  questionId: string;
  question: BaseRegistrationQuestion;
  subQuestions: BaseRegistrationQuestionChoiceSubQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface BaseRegistrationQuestionChoiceSubQuestion {
  choiceId: string;
  choice: BaseRegistrationQuestionChoice;
  questionId: string;
  question: BaseRegistrationQuestion;
}

export interface RegistrationQuestionChoiceSubQuestion
  extends BaseRegistrationQuestionChoiceSubQuestion {
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationQuestionChoiceTranslation {
  id: string;
  locale: string;
  value: string;
  text: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseRegistrationQuestionResponseChange {
  id: string;
  newValue: string;
  oldValue: string;
  eventId: string;
  questionId: string;
  responseId: string;
  userId: string | null;
  createdAt: string;
}

export interface RegistrationQuestionResponseChange
  extends BaseRegistrationQuestionResponseChange {
  response: BaseRegistrationQuestionResponse;
  user: BaseUser | null;
}

export interface BaseRegistrationQuestionResponse {
  id: string;
  value: string;
  questionId: string;
  question: BaseRegistrationQuestion;
}

export interface RegistrationQuestionResponse
  extends BaseRegistrationQuestionResponse {
  changeLogs: BaseRegistrationQuestionResponseChange[];
  createdAt: string;
  updatedAt: string;
}

export interface BaseRegistrationQuestion {
  id: string;
  eventId: string;
  type: RegistrationQuestionType;
  name: string;
  required: boolean;
  description: string | null;
  label: string | null;
  placeholder: string | null;
  default: string | null;
  searchListId: string | null;
  span: number;
  mutable: boolean;
  min: string | null;
  max: string | null;
  masked: boolean;
  validation: string | null;
  validationMessage: string | null;
  locationOption: LocationQuestionOption | null;
  sortOrder: number;
  featured: boolean;
  choices: BaseRegistrationQuestionChoice[];
  unique: boolean;
}

export interface RegistrationQuestion extends BaseRegistrationQuestion {
  sections: BaseRegistrationSectionQuestion[];
  followups: BaseRegistrationFollowupQuestion[];
  subQuestionOf: RegistrationQuestionChoiceSubQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationQuestionTranslation {
  id: string;
  locale: string;
  label: string | null;
  placeholder: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseRegistrationSectionQuestion {
  sectionId: string;
  section: BaseRegistrationSection;
  questionId: string;
  question: BaseRegistrationQuestion;
  sortOrder: number;
}

export interface RegistrationSectionQuestion
  extends BaseRegistrationSectionQuestion {
  createdAt: string;
  updatedAt: string;
}

export interface BaseRegistrationFollowupQuestion {
  followupId: string;
  followup: BaseRegistrationFollowup;
  questionId: string;
  question: BaseRegistrationQuestion;
  sortOrder: number;
}

export interface RegistrationFollowupQuestion
  extends BaseRegistrationFollowupQuestion {
  createdAt: string;
  updatedAt: string;
}

export interface BaseRegistrationSection {
  id: string;
  eventId: string;
  name: string;
  description: string | null;
  sortOrder: number;
  _count: {
    questions: number;
  };
}

export interface RegistrationSection extends BaseRegistrationSection {
  questions: RegistrationQuestion[];
  eventTickets: BaseEventPassType[];
  eventAddOns: BaseEventAddOn[];
  accountTiers: BaseTier[];
  disallowedTiers: BaseTier[];
  createdAt: string;
  updatedAt: string;
}

export interface BaseRegistrationFollowup {
  id: string;
  eventId: string;
  name: string;
  description: string | null;
  sortOrder: number;
  _count: {
    questions: number;
  };
}

export interface RegistrationFollowup extends BaseRegistrationFollowup {
  questions: RegistrationQuestion[];
  passTypes: BaseEventPassType[];
  eventAddOns: BaseEventAddOn[];
  accountTiers: BaseTier[];
  disallowedTiers: BaseTier[];
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationSectionTranslation {
  id: string;
  locale: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationFollowupTranslation {
  id: string;
  locale: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventAttendee {
  id: string;
  alternateId: number;
  accountId: string;
  account: BaseAccount;
  eventId: string;
  event: BaseEvent;
}

export interface EventAttendee extends BaseEventAttendee {
  payments: BasePayment[];
  passes: BaseEventPass[];
  packages: BaseAttendeePackage[];
  coupons: BaseCoupon[];
  createdAt: string;
  updatedAt: string;
}

export enum ReportType {
  organization = "organization",
  activities = "activities",
  activity = "activity",
  surveys = "surveys",
  survey = "survey",
  events = "events",
  event = "event",
  session = "session",
  listing = "listing",
  bookings = "bookings",
  booking = "booking",
  groups = "groups",
  group = "group",
  channels = "channels",
  channel = "channel",
  content = "content",
  threads = "threads",
  thread = "thread",
  accounts = "accounts",
  account = "account",
  revenue = "revenue",
  subscriptionProduct = "subscriptionProduct",
  series = "series",
}

export enum EventReportDateType {
  lifetime = "lifetime",
  year = "year",
  quarter = "quarter",
  month = "month",
}

export interface ReportFilters {
  eventId?: string;
  placeId?: string;
  groupId?: string;
  channelId?: string;
  accountId?: string;
  surveyId?: string;
  subscriptionProductId?: string;
  sessionId?: string;
  seriesId?: string;
}

export interface BaseStandardReport {
  id: string;
  type: keyof typeof ReportType;
  category: string;
  name: string;
  description: string;
  dateType: keyof typeof EventReportDateType;
  favorite: boolean;
  rowLink?: string;
}

export interface StandardReport extends BaseStandardReport {
  rowData: object[];
  colDefs: object[];
  nextCursor: number | null;
}

export interface CustomReport {
  id: number;
  name: string;
  description: string | null;
  gridState: string | null;
  columns: string | null;
  filters: string | null;
  charts: string | null;
  advancedFilter: string | null;
  standard: StandardReport;
  user: BaseUser | null;
  shared: boolean;
  sharedUsers: BaseUser[];
  createdAt: string;
  updatedAt: string;
}

export interface SearchField {
  id: string;
  name: string;
  subtext: string | null;
  search: string;
  accountId: string | null;
  eventId: string | null;
  groupId: string | null;
  contentId: string | null;
  channelId: string | null;
  threadId: string | null;
  updatedAt: string;
}

export interface Self extends User {}

export interface BaseSeries {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  longDescription: string | null;
  startDate: string | null;
  endDate: string | null;
  imageId: string | null;
  image: BaseImage | null;
}

export interface Series extends BaseSeries {
  templateId: string;
  template: BaseEvent;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventSession {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  longDescription: string | null;
  imageId: string | null;
  image: BaseImage | null;
  startTime: string;
  endTime: string;
  registrationEnd?: string;
  allowQuickRegister: boolean;
  tracks: BaseEventTrack[];
  nonSession: boolean;
  visible: boolean;
  access: SessionAccess;
  location: BaseEventSessionLocation | null;
  registrationEnabled: boolean;
  price: number | null;
  limit: number | null;
  taxCode: string | null;
  taxIncluded: boolean;
  taxLocation: TaxLocationType;
  createdAt: string;
  updatedAt: string;
}

export interface EventSession extends BaseEventSession {
  roundName: string | null;
  matchName: string | null;
  sortOrder: number;
  eventId: string;
  event: BaseEvent;
  speakers: BaseEventSpeaker[];
  streamInput: BaseStreamInput | null;
}

export interface EventSessionTranslation {
  id: number;
  locale: string;
  name: string;
  description: string | null;
  longDescription: string | null;
  imageId: string | null;
  image: BaseImage | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventSessionLocation {
  id: string;
  name: string;
  address1: string | null;
  address2: string | null;
  zip: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  image: BaseImage | null;
}

export interface EventSessionLocation extends BaseEventSessionLocation {
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventSessionLocationTranslation {
  id: string;
  locale: string;
  name: string;
  description: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface BaseEventSessionAccess {
  id: string;
  session: BaseEventSession;
  passId: string;
  pass: BaseEventPass;
  status: PurchaseStatus;
  responses: BaseEventSessionQuestionResponse[];
}

export interface EventSessionAccess extends BaseEventSessionAccess {
  lineItem: PaymentLineItem | null;
  createdAt: string;
  updatedAt: string;
}

export enum EventSessionQuestionType {
  text = "text",
  textarea = "textarea",
  number = "number",
  time = "time",
  date = "date",
  toggle = "toggle",
  select = "select",
  radio = "radio",
  checkbox = "checkbox",
  search = "search",
  file = "file",
  quantity = "quantity",
  location = "location",
}

export interface BaseEventSessionQuestionChoice {
  id: string;
  value: string;
  text: string | null;
  description: string | null;
  supply: number | null;
  sortOrder: number;
  subQuestions?:
    | EventSessionQuestion[]
    | {
        questionId: string;
      }[];
  question: {
    id: string;
    name: string;
  };
  _count: {
    subQuestions: number;
  };
}

export interface EventSessionQuestionChoice
  extends BaseEventSessionQuestionChoice {
  questionId: string;
  question: BaseEventSessionQuestion;
  subQuestions: BaseEventSessionQuestionChoiceSubQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventSessionQuestionChoiceSubQuestion {
  choiceId: string;
  choice: BaseEventSessionQuestionChoice;
  questionId: string;
  question: BaseEventSessionQuestion;
}

export interface EventSessionQuestionChoiceSubQuestion
  extends BaseEventSessionQuestionChoiceSubQuestion {
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventSessionQuestionChoiceTranslation {
  id: string;
  locale: string;
  value: string;
  text: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventSessionQuestionResponseChange {
  id: string;
  newValue: string;
  oldValue: string;
  eventId: string;
  questionId: string;
  responseId: string;
  userId: string | null;
  createdAt: string;
}

export interface EventSessionQuestionResponseChange
  extends BaseEventSessionQuestionResponseChange {
  response: BaseEventSessionQuestionResponse;
  user: BaseUser;
}

export interface BaseEventSessionQuestionResponse {
  id: string;
  value: string;
  questionId: string;
  question: BaseEventSessionQuestion;
}

export interface EventSessionQuestionResponse
  extends BaseEventSessionQuestionResponse {
  changeLogs: BaseEventSessionQuestionResponseChange[];
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventSessionQuestion {
  id: string;
  eventId: string;
  type: EventSessionQuestionType;
  name: string;
  required: boolean;
  description: string | null;
  label: string | null;
  placeholder: string | null;
  default: string | null;
  searchListId: string | null;
  mutable: boolean;
  min: string | null;
  max: string | null;
  masked: boolean;
  validation: string | null;
  validationMessage: string | null;
  locationOption: LocationQuestionOption | null;
  sortOrder: number;
  featured: boolean;
  choices: BaseEventSessionQuestionChoice[];
  price: number | null;
  supply: number | null;
}

export interface EventSessionQuestion extends BaseEventSessionQuestion {
  sections: BaseEventSessionSectionQuestion[];
  subQuestionOf: EventSessionQuestionChoiceSubQuestion[];
  createdAt: string;
  updatedAt: string;
  _count: {
    responses: number;
  };
}

export interface EventSessionQuestionTranslation {
  id: string;
  locale: string;
  label: string | null;
  placeholder: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventSessionSectionQuestion {
  sectionId: string;
  section: BaseEventSessionSection;
  questionId: string;
  question: BaseEventSessionQuestion;
  sortOrder: number;
}

export interface EventSessionSectionQuestion
  extends BaseEventSessionSectionQuestion {
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventSessionSection {
  id: string;
  eventId: string;
  name: string;
  description: string | null;
  sortOrder: number;
  _count: {
    questions: number;
  };
}

export interface EventSessionSection extends BaseEventSessionSection {
  questions: EventSessionQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface EventSessionSectionTranslation {
  id: string;
  locale: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventSpeaker {
  id: string;
  slug: string;
  firstName: string;
  lastName: string | null;
  fullName: string | null;
  bio: string | null;
  title: string | null;
  company: string | null;
  companyBio: string | null;
  label: string | null;
  imageId: string | null;
  image: BaseImage | null;
  visible: boolean;
}

export interface EventSpeaker extends BaseEventSpeaker {
  sessions: BaseEventSession[];
  eventId: string;
  event: BaseEvent;
  isHost: boolean;
  priority: number;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedIn: string | null;
  tikTok: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventSpeakerTranslation {
  id: number;
  locale: string;
  title: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseLevel {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  description: string | null;
  color: string;
  scale: number;
  imageId: string | null;
  image: BaseImage | null;
}

export interface Level extends BaseLevel {
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  _count: {
    accounts: number;
  };
}

export interface SponsorshipLevelTranslation {
  id: number;
  locale: string;
  name: string;
  subtitle: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseStreamInput {
  id: number;
  name: string;
  cloudflareId: string | null;
  connected: boolean;
  public: boolean;
  sessionId: string | null;
  eventId: string | null;
  groupId: string | null;
  imageId: string | null;
  image: BaseImage | null;
}

export interface StreamInput extends BaseStreamInput {
  sortOrder: number;
  event: BaseEvent | null;
  session: BaseEventSession | null;
  group: BaseGroup | null;
  details?: StreamInputDetails;
  threads: BaseThread[];
  createdAt: string;
}

export interface StreamInputOutput {
  enabled: boolean;
  url: string;
  streamKey: string;
  uid: string;
}

export interface StreamInputConfig {
  mode: "automatic" | "off";
  requireSignedURLs: boolean;
  allowedOrigins: string[];
  deleteRecordingAfterDays: null | number;
}

export interface StreamInputDetails {
  uid: string;
  rtmps: {
    url: string;
    streamKey: string;
  };
  rtmpsPlayback: {
    url: string;
    streamKey: string;
  };
  srt: {
    url: string;
    streamId: string;
    passphrase: string;
  };
  srtPlayback: {
    url: string;
    streamId: string;
    passphrase: string;
  };
  webRTC: {
    url: string;
  };
  webRTCPlayback: {
    url: string;
  };
  created: string;
  modified: string;
  meta: Record<string, any>;
  defaultCreator: string;
  status: any;
  recording: {
    mode: "automatic" | "off";
    requireSignedURLs: boolean;
    allowedOrigins: string[];
  };
  deleteRecordingAfterDays: null | number;
}

// ============================================================================
// StreamsV2 (Cloudflare Calls) Interfaces
// ============================================================================

export type RecordingAction = "stop" | "pause" | "resume";

export interface StorageConfig {
  type: "aws" | "azure" | "digitalocean" | "gcs" | "sftp";
  access_key?: string;
  secret?: string;
  bucket?: string;
  region?: string;
  path?: string;
  auth_method?: "KEY" | "PASSWORD";
  username?: string;
  password?: string;
  host?: string;
  port?: number;
  private_key?: string;
}

export interface BaseMeeting {
  id: string;
  title: string;
  preferred_region?:
    | "ap-south-1"
    | "ap-southeast-1"
    | "us-east-1"
    | "eu-central-1"
    | null;
  record_on_start: boolean;
  live_stream_on_start: boolean;
  persist_chat: boolean;
  summarize_on_end: boolean;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
  updated_at: string;
}

export interface Meeting extends BaseMeeting {
  "ai_config.transcription.keywords": string[];
  "ai_config.transcription.language":
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
  "ai_config.transcription.profanity_filter": boolean;
  "ai_config.summarization.word_limit": number;
  "ai_config.summarization.text_format": "plain_text" | "markdown";
  "ai_config.summarization.summary_type":
    | "general"
    | "team_meeting"
    | "sales_call"
    | "client_check_in"
    | "interview";
}

export interface Participant {
  id: string;
  name: string | null;
  picture: string | null;
  custom_participant_id: string;
  account: BaseAccount | null;
  preset_name: string;
  token?: string;
  created_at: string;
  updated_at: string;
}

export interface MeetingSession {
  id: string;
  associated_id: string;
  meeting_display_name: string;
  type: "meeting" | "livestream" | "participant";
  status: "LIVE" | "ENDED";
  live_participants: number;
  max_concurrent_participants: number;
  minutes_consumed: number;
  organization_id: string;
  started_at: string;
  created_at: string;
  updated_at: string;
  ended_at?: string;
  meta?: Record<string, any>;
  breakout_rooms: MeetingSession[];
}

export interface MeetingSessionChatDownload {
  chat_download_url: string;
  chat_download_url_expiry: string;
}

export interface MeetingSessionTranscriptDownload {
  sessionId: string;
  transcript_download_url: string;
  transcript_download_url_expiry: string;
}

export interface MeetingSessionSummaryDownload {
  sessionId: string;
  summary_download_url: string;
  summary_download_url_expiry: string;
}

export interface Livestream {
  id: string;
  name: string;
  status: "LIVE" | "IDLE" | "ERRORED" | "INVOKED";
  ingest_server: string;
  stream_key: string;
  playback_url: string;
  meeting_id: string;
  created_at: string;
  updated_at: string;
  disabled: boolean;
}

export interface LivestreamSession {
  id: string;
  livestream_id: string;
  err_message: string;
  invoked_time: string;
  started_time: string;
  stopped_time: string;
  created_at: string;
  updated_at: string;
  ingest_seconds: string;
}

export interface BaseMeetingRecording {
  id: string;
  meeting_id: string;
  download_url: string | null;
  download_url_expiry: string | null;
  file_size: number | null;
  session_id: string | null;
  output_file_name: string;
  status: string;
  invoked_time: string;
  started_time: string | null;
  stopped_time: string | null;
  recording_duration: number;
}

export interface MeetingRecording extends BaseMeetingRecording {
  // meeting fields (flattened)
  "meeting.preferred_region": string | null;
  "meeting.id": string;
  "meeting.title": string;
  "meeting.record_on_start": boolean;
  "meeting.live_stream_on_start": boolean;
  "meeting.persist_chat": boolean;
  "meeting.summarize_on_end": boolean;
  "meeting.is_large": boolean;
  "meeting.status": string;
  "meeting.created_at": string;
  "meeting.updated_at": string;
  "start_reason.reason": string;
  "start_reason.caller.type": string;
  "stop_reason.reason": string;
  "stop_reason.caller.type": string;
}

export interface BasePreset {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Preset extends BasePreset {
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

export enum MembershipPriceType {
  flat = "flat",
  payWhatYouWant = "payWhatYouWant",
}

export enum MembershipPriceInterval {
  day = "day",
  week = "week",
  month = "month",
  year = "year",
}

export interface BaseMembershipPrice {
  id: string;
  active: boolean;
  amount: number;
  currency: string;
  interval: MembershipPriceInterval;
  intervalCount: number;
  minAmount: number;
  maxAmount: number;
  type: MembershipPriceType;
}

export interface MembershipPrice extends BaseMembershipPrice {
  subscriptionProduct: BaseMembership;
  createdAt: string;
  updatedAt: string;
}

export interface BaseMembership {
  id: string;
  active: boolean;
  name: string;
  description: string | null;
}

export interface Membership extends BaseMembership {
  prices: BaseMembershipPrice[];
  statementDescriptor: string | null;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export enum SubscriptionStatus {
  active = "active",
  canceled = "canceled",
  paused = "paused",
  trialing = "trialing",
  past_due = "past_due",
  unpaid = "unpaid",
}

export interface BaseSubscription {
  id: string;
  status: SubscriptionStatus;
  expiresAt: string;
  cancelAtEnd: boolean;
  integrationId: string | null;
  subscriptionProductId: string;
  subscriptionProduct: BaseMembership;
}

export interface Subscription extends BaseSubscription {
  accountId: string;
  account: BaseAccount;
  priceId: string;
  price: BaseMembershipPrice;
  createdAt: string;
  updatedAt: string;
}

export interface BaseSubscriptionPayment {
  id: string;
  amount: number;
  currency: string;
}

export interface SubscriptionPayment extends BaseSubscriptionPayment {
  subscription: BaseSubscription;
  createdAt: string;
  updatedAt: string;
}

export interface BaseSupportTicketNote {
  id: string;
  userId: string;
  user: BaseUser;
  text: string;
}

export interface SupportTicketNote extends BaseSupportTicketNote {
  supportTicketId: string;
  supportTicket: BaseSupportTicket;
  createdAt: string;
  updatedAt: string;
}

export interface BaseSupportTicket {
  id: string;
  type: SupportTicketType;
  email: string;
  request: string;
  state: SupportTicketState;
}

export interface SupportTicket extends BaseSupportTicket {
  accountId: string | null;
  account: BaseAccount | null;
  eventId: string | null;
  event: BaseEvent | null;
  notes: BaseSupportTicketNote[];
  createdAt: string;
  updatedAt: string;
}

export interface BaseTeamMember {
  id: string;
  slug: string;
  priority: number;
  firstName: string | null;
  lastName: string | null;
  nickName: string | null;
  title: string | null;
  startDate: string | null;
  imageId: string | null;
  image: BaseImage | null;
}

export interface TeamMember extends BaseTeamMember {
  email: string | null;
  phone: string | null;
  bio: string | null;
  linkedIn: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  tikTok: string | null;
  discord: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventPassType {
  id: string;
  slug: string;
  active: boolean;
  cancelable: boolean;
  transferable: boolean;
  featured: boolean;
  visibility: PassTypeVisibility;
  name: string;
  shortDescription: string;
  longDescription: string | null;
  price: number;
  accessLevel: PassTypeAccessLevel;
  featuredImageId: string | null;
  featuredImage: BaseImage | null;
  supply: number | null;
  minQuantityPerSale: number;
  maxQuantityPerSale: number;
  emailDomains: string | null;
  enableCoupons: boolean;
  minCouponQuantity: number;
  maxCouponQuantity: number | null;
  requireCoupon: boolean;
  taxCode: string | null;
  taxIncluded: boolean;
  taxLocation: TaxLocationType;
  createdAt: string;
  updatedAt: string;
  requiredPassTypeId: string | null;
}

export interface EventPassType extends BaseEventPassType {
  overrideStartDate: string | null;
  sortOrder: number;
  event: BaseEvent;
  allowedTiers: BaseTier[];
  disallowedTiers: BaseTier[];
  _count: {
    purchases: number;
  };
  requiredPassType: BaseEventPassType | null;
}

export interface BaseEventPassTypePriceSchedule {
  id: string;
  ticketId: string;
  price: string;
  name: string | null;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventPassTypePriceSchedule
  extends BaseEventPassTypePriceSchedule {}

export interface BaseEventPassTypeRefundSchedule {
  id: string;
  passTypeId: string;
  percentage: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventPassTypeRefundSchedule
  extends BaseEventPassTypeRefundSchedule {}

export interface EventPassTypeTranslation {
  id: number;
  locale: string;
  name: string;
  shortDescription: string;
  longDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventTrack {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  color: string;
}

export interface EventTrack extends BaseEventTrack {
  createdAt: string;
  updatedAt: string;
  _count: {
    sessions: number;
  };
}

export interface EventTrackTranslation {
  id: number;
  locale: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseTransferLog {
  id: number;
  fromRegistrationId: string;
  fromRegistration: BaseEventAttendee;
  toRegistrationId: string;
  toRegistration: BaseEventAttendee;
}

export interface TransferLog extends BaseTransferLog {
  purchaseId: string;
  purchase: BaseEventPass;
  userId: string | null;
  user: BaseUser | null;
  createdAt: string;
}

export interface BaseTransfer {
  id: string;
  email: string;
  purchaseId: string;
  purchase: BaseEventPass;
}

export interface Transfer extends BaseTransfer {
  createdAt: string;
  updatedAt: string;
}

export interface BaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  title: string | null;
  imageUrl: string;
  termsAccepted: string | null;
}

export interface User extends BaseUser {
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserApiKey {
  id: string;
  publicPart: string;
  key: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
}

export enum VideoSource {
  admin = "admin",
  activity = "activity",
  content = "content",
}

export interface BaseVideo {
  id: string;
  name: string;
  status: string;
  source: VideoSource;
  width: number;
  height: number;
  thumbnailUrl: string | null;
  previewUrl: string | null;
  readyToStream: boolean;
  duration: number | null;
  createdAt: string;
}

export interface Video extends BaseVideo {
  downloadUrl: string | null;
  hlsUrl: string | null;
  dashUrl: string | null;
  thumbnailPct: number | null;
}

export interface BaseChannelContentGuest {
  id: string;
  slug: string;
  contentId: string;
  accountId: string | null;
  account: BaseAccount | null;
  type: ContentGuestType;
  name: string;
  title: string | null;
  bio: string | null;
  company: string | null;
  companyLink: string | null;
  companyBio: string | null;
  imageId: string | null;
  image: BaseImage | null;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedIn: string | null;
  tikTok: string | null;
  youtube: string | null;
  discord: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelContentGuest extends BaseChannelContentGuest {}

export interface ChannelContentGuestTranslation {
  id: number;
  locale: string;
  title: string | null;
  bio: string | null;
  companyBio: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseFile {
  id: number;
  name: string;
  r2Path: string;
  source: FileSource;
  kilobytes: number;
  url?: string;
  public: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface File extends BaseFile {}

export enum ThreadInvitationStatus {
  invited = "invited",
  rejected = "rejected",
}

export interface ThreadInvitation {
  id: string;
  organizationId: string;
  threadId: string;
  thread: BaseThread;
  status: ThreadInvitationStatus;
  role: ThreadMemberRole;
  invitedById: string;
  invitedBy: BaseAccount;
  invitedId: string;
  invited: BaseAccount;
  createdAt: string;
  updatedAt: string;
}

export enum ThreadType {
  circle = "circle",
  group = "group",
  event = "event",
  stream = "stream",
}

export interface BaseThread {
  id: string;
  subject: string;
  imageId: string | null;
  image: BaseImage | null;
  type: ThreadType;
  lastMessageAt: string | null;
  lastMessage: string | null;
  createdAt: string;
}

export interface Thread extends BaseThread {}

export enum ThreadMemberRole {
  member = "member",
  moderator = "moderator",
}

export enum ThreadMessageType {
  user = "user",
  bot = "bot",
  system = "system",
}

export interface BaseThreadMessageReaction {
  id: string;
  messageId: string;
  accountId: string;
  emojiName: string;
}

export interface ThreadMessageReaction extends BaseThreadMessageReaction {
  organizationId: string;
  threadId: string;
  message: BaseThreadMessage;
  account: BaseAccount;
  createdAt: string;
  updatedAt: string;
}

export interface BaseThreadMessage {
  id: string;
  body: string;
  accountId: string | null;
  viewer: BaseThreadMember | null;
  createdAt: string;
  editedAt: string | null;
  sentAt: string;
}

export interface ThreadMessage extends BaseThreadMessage {
  type: ThreadMessageType;
  reactions: ThreadMessageReaction[];
  entities: ThreadMessageEntity[];
  replyToId: string | null;
  replyTo: BaseThreadMessage | null;
  files: BaseFile[];
  images: BaseImage[];
  videos: BaseVideo[];
}

export interface BaseThreadMessageEntity {
  type: string;
  startIndex: number;
  endIndex: number;
  marks: string[];
  accountId?: string;
  account?: BaseAccount;
  href?: string;
  linkPreview?: BaseLinkPreview;
}

export interface ThreadMessageEntity extends BaseThreadMessageEntity {}

export interface BaseThreadMember {
  id: string;
  accountId: string;
  lastReadAt: string | null;
  notifications: boolean;
  account: BaseAccount;
  blocked: boolean;
}

export interface ThreadMember extends BaseThreadMember {
  createdAt: string;
  updatedAt: string;
}

export enum ThreadCircleAccountRole {
  member = "member",
  manager = "manager",
  invited = "invited",
}

export enum ThreadCircleType {
  private = "private",
  direct = "direct",
}

export interface BaseThreadCircle {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  type: ThreadCircleType;
}

export interface ThreadCircle extends BaseThreadCircle {}

export interface BaseThreadCircleAccount {
  accountId: string;
  role: ThreadCircleAccountRole;
  account: BaseAccount;
}

export interface ThreadCircleAccount extends BaseThreadCircleAccount {}

export interface PaypalActivationFormParams {
  clientId: string;
  clientSecret: string;
}

export interface BraintreeActivationFormParams {
  clientId: string;
  clientPublicKey: string;
  clientSecret: string;
}

export interface AuthorizeNetActivationFormParams {
  clientId: string;
  clientPublicKey: string;
  clientSecret: string;
}

export interface BaseSchedule {
  name: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Schedule extends BaseSchedule {}

export interface BaseLogin {
  sub: string;
  userPoolId: string;
  username: string;
  email: string;
  status: string;
  enabled: boolean;
  verified: boolean;
  firstName: string | null;
  lastName: string | null;
  internalRefId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Login extends BaseLogin {
  _count: {
    accounts: number;
    devices: number;
  };
}

export interface DomainDetails {
  name: string;
}

export interface BaseEventRoomType {
  id: string;
  name: string;
  price: number;
  pricePerNight: boolean;
  image: BaseImage | null;
  passTypes: BaseEventRoomTypePassTypeDetails[];
  addOns: BaseEventRoomTypeAddOnDetails[];
  taxCode: string | null;
  taxIncluded: boolean;
  taxLocation: TaxLocationType;
}

export interface EventRoomType extends BaseEventRoomType {
  sortOrder: number;
  description: string | null;
  supply: number | null;
  minPasses: number | null;
  maxPasses: number | null;
  minStart: string | null;
  defaultStart: string | null;
  maxStart: string | null;
  minEnd: string | null;
  defaultEnd: string | null;
  maxEnd: string | null;
  allowedTiers: BaseTier[];
  disallowedTiers: BaseTier[];
  rooms: Room[];
  createdAt: string;
  updatedAt: string;
  _count: {
    reservations: number;
  };
}

export interface EventRoomTypeTranslation {
  id: number;
  locale: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface BaseRoom {
  id: string;
  roomId: string;
  reservationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Room extends BaseRoom {
  roomTypes: BaseEventRoomType[];
  reservation: BaseEventRoomTypeReservation;
}

export interface BaseEventRoomTypeReservation {
  id: string;
  start: string | null;
  end: string | null;
  eventRoomTypeId: string;
  eventRoomType: BaseEventRoomType;
  roomId: string;
  passes: {
    id: string;
    attendee: {
      accountId: string;
    };
  }[];
}

export interface EventRoomTypeReservation
  extends Omit<BaseEventRoomTypeReservation, "passes"> {
  room: BaseRoom;
  passes: {
    id: string;
    status: PurchaseStatus;
    ticket?: {
      id: string;
      name: string;
    };
    attendee: {
      id: string;
      account: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string;
      };
    };
  }[];
  lineItem: PaymentLineItem | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventRoomTypePassTypeDetails {
  id: string;
  passTypeId: string | null;
  enabled: boolean;
  premium: number;
  includedNights: number;
  minPasses: number | null;
  maxPasses: number | null;
  minStart: string | null;
  defaultStart: string | null;
  maxStart: string | null;
  minEnd: string | null;
  defaultEnd: string | null;
  maxEnd: string | null;
}

export interface EventRoomTypePassTypeDetails
  extends BaseEventRoomTypePassTypeDetails {
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventRoomTypeAddOnDetails {
  id: string;
  addOnId: string;
  minStart: string | null;
  defaultStart: string | null;
  maxStart: string | null;
  minEnd: string | null;
  defaultEnd: string | null;
  maxEnd: string | null;
}

export interface EventRoomTypeAddOnDetails
  extends BaseEventRoomTypeAddOnDetails {
  createdAt: string;
  updatedAt: string;
}

export enum LeadStatus {
  new = "new",
  favorited = "favorited",
  archived = "archived",
  deleted = "deleted",
}

export interface BaseLead {
  id: string;
  firstName: string | null;
  lastName: string | null;
  shareAccount: {
    id: string;
    image: BaseImage;
  };
  status: LeadStatus;
  createdAt: string;
}

export interface Lead extends BaseLead {
  eventId: string | null;
  event: BaseEvent | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  linkedIn: string | null;
  twitter: string | null;
  tikTok: string | null;
  note: string | null;
  attributes: { name: string; value: string }[];
  updatedAt: string;
}

export enum DayOfWeek {
  sunday = "sunday",
  monday = "monday",
  tuesday = "tuesday",
  wednesday = "wednesday",
  thursday = "thursday",
  friday = "friday",
  saturday = "saturday",
}

export interface BaseBookingPlace {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  description: string | null;
  image: BaseImage | null;
  sortOrder: number;
  visible: boolean;
}

export interface BookingPlace extends BaseBookingPlace {
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseBookingSpace {
  id: string;
  name: string;
  slug: string;
  supply: number;
  slotDuration: number;
  price: number;
  description: string | null;
  image: BaseImage | null;
  start: string | null;
  end: string | null;
  sortOrder: number;
  visible: boolean;
  taxCode: string | null;
  taxIncluded: boolean;
  taxLocation: TaxLocationType;
}

export interface BookingSpace extends BaseBookingSpace {
  confirmationBody: string | null;
  confirmationReplyTo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookingPlaceTranslation {
  id: number;
  locale: string;
  name: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookingSpaceTranslation {
  id: number;
  locale: string;
  name: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseBookingSpaceAvailability {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface BookingSpaceAvailability extends BaseBookingSpaceAvailability {
  createdAt: string;
  updatedAt: string;
}

export interface BaseBookingSpaceBlackout {
  id: string;
  start: string;
  end: string;
}

export interface BookingSpaceBlackout extends BaseBookingSpaceBlackout {
  createdAt: string;
  updatedAt: string;
}

export interface BaseBooking {
  id: string;
  alternateId: string;
  placeId: string;
  day: string;
  time: string;
  duration: number;
  status: PurchaseStatus;
  account: BaseAccount;
  space: BaseBookingSpace;
}

export interface Booking extends BaseBooking {
  lineItem: PaymentLineItem | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookingSlot {
  time: string;
  supply: number | null;
}

export enum WidgetCategory {
  organization = "organization",
  event = "event",
}

export enum WidgetType {
  kpi = "kpi",
  bar = "bar",
  line = "line",
}

export interface DashboardWidgetEndpoint {
  name: string;
  description: string;
  type: WidgetType;
  endpoint: (params?: any) => string;
  requiresDateRange: boolean;
  category: WidgetCategory;
  defaultSize?: {
    w: number;
    h: number;
  };
}

export interface BaseDashboardWidget {
  id: string;
  endpoint: DashboardWidgetEndpoint;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DashboardWidget extends BaseDashboardWidget {}

export interface BaseDashboard {
  id: string;
  name: string;
  organizationId: string;
  eventId: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Dashboard extends BaseDashboard {
  widgets: BaseDashboardWidget[];
}

export interface BaseEventPackage {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isActive: boolean;
  imageId: string | null;
  image: BaseImage | null;
  sortOrder: number;
  taxCode: string | null;
  taxIncluded: boolean;
  taxLocation: TaxLocationType;
}

export interface EventPackage extends BaseEventPackage {
  passes: BaseEventPackagePass[];
  createdAt: string;
  updatedAt: string;
}

export interface EventPackageTranslation {
  id: string;
  locale: string;
  name: string | null;
  description: string | null;
}

export interface BaseEventPackagePass {
  id: string;
  passTypeId: string;
  passType: BaseEventPassType;
  quantity: number;
}

export interface EventPackagePass extends BaseEventPackagePass {
  createdAt: string;
  updatedAt: string;
}

export interface BaseAttendeePackage {
  id: string;
  attendeeId: string;
  packageId: string;
  package: BaseEventPackage;
  status: PurchaseStatus;
  createdAt: string;
}

export interface AttendeePackage extends BaseAttendeePackage {
  passes: BaseEventPass[];
  lineItem: PaymentLineItem | null;
  updatedAt: string;
}

export interface BaseEventMediaItem {
  id: string;
  name: string | null;
  description: string | null;
  imageId: string | null;
  image: BaseImage | null;
  videoId: string | null;
  video: BaseVideo | null;
  fileId: string | null;
  file: BaseFile | null;
  sortOrder: number;
}

export interface EventMediaItem extends BaseEventMediaItem {
  allowedPassTypes: BaseEventPassType[];
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventSponsorshipLevel {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sponsorsPerRow: number;
}

export interface EventSponsorshipLevel extends BaseEventSponsorshipLevel {
  sortOrder: number;
  sponsors: BaseEventSponsorship[];
  createdAt: string;
  updatedAt: string;
}

export interface EventSponsorshipLevelTranslation {
  id: number;
  locale: string;
  name: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventSponsorship {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  url: string | null;
  account: BaseAccount | null;
  image: BaseImage | null;
}

export interface EventSponsorship extends BaseEventSponsorship {
  createdAt: string;
  updatedAt: string;
}

export interface EventSponsorshipTranslation {
  id: number;
  locale: string;
  name: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseSurvey {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image: BaseImage;
  requireAuth: boolean;
  submissionsPerAccount: number;
}

export interface Survey extends BaseSurvey {
  replyTo: string | null;
  emailBody: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SurveyTranslation {
  id: string;
  locale: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseSurveySubmission {
  id: string;
  account: BaseAccount | null;
  status: PurchaseStatus;
  responses: BaseSurveyQuestionResponse[];
}

export interface SurveySubmission extends BaseSurveySubmission {
  createdAt: string;
  updatedAt: string;
}

export enum SurveyQuestionType {
  text = "text",
  textarea = "textarea",
  number = "number",
  time = "time",
  date = "date",
  toggle = "toggle",
  select = "select",
  radio = "radio",
  checkbox = "checkbox",
  search = "search",
  file = "file",
  location = "location",
}

export interface BaseSurveyQuestionChoice {
  id: string;
  value: string;
  text: string | null;
  description: string | null;
  supply: number | null;
  sortOrder: number;
  subQuestions?:
    | SurveyQuestion[]
    | {
        questionId: string;
      }[];
  question: {
    id: string;
    name: string;
  };
  _count: {
    subQuestions: number;
  };
}

export interface SurveyQuestionChoice extends BaseSurveyQuestionChoice {
  questionId: string;
  question: BaseSurveyQuestion;
  subQuestions: BaseSurveyQuestionChoiceSubQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface BaseSurveyQuestionChoiceSubQuestion {
  choiceId: string;
  choice: BaseSurveyQuestionChoice;
  questionId: string;
  question: BaseSurveyQuestion;
}

export interface SurveyQuestionChoiceSubQuestion
  extends BaseSurveyQuestionChoiceSubQuestion {
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SurveyQuestionChoiceTranslation {
  id: string;
  locale: string;
  value: string;
  text: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseSurveyQuestionResponseChange {
  id: string;
  newValue: string;
  oldValue: string;
  eventId: string;
  questionId: string;
  responseId: string;
  userId: string | null;
  createdAt: string;
}

export interface SurveyQuestionResponseChange
  extends BaseSurveyQuestionResponseChange {
  response: BaseSurveyQuestionResponse;
  user: BaseUser;
}

export interface BaseSurveyQuestionResponse {
  id: string;
  value: string;
  questionId: string;
  question: BaseSurveyQuestion;
}

export interface SurveyQuestionResponse extends BaseSurveyQuestionResponse {
  changeLogs: BaseSurveyQuestionResponseChange[];
  createdAt: string;
  updatedAt: string;
}

export interface BaseSurveyQuestion {
  id: string;
  eventId: string;
  type: SurveyQuestionType;
  name: string;
  required: boolean;
  description: string | null;
  label: string | null;
  placeholder: string | null;
  default: string | null;
  searchListId: string | null;
  mutable: boolean;
  min: string | null;
  max: string | null;
  masked: boolean;
  validation: string | null;
  validationMessage: string | null;
  locationOption: LocationQuestionOption | null;
  sortOrder: number;
  featured: boolean;
  choices: BaseSurveyQuestionChoice[];
}

export interface SurveyQuestion extends BaseSurveyQuestion {
  sections: BaseSurveySectionQuestion[];
  subQuestionOf: SurveyQuestionChoiceSubQuestion[];
  createdAt: string;
  updatedAt: string;
  _count: {
    responses: number;
  };
}

export interface SurveyQuestionTranslation {
  id: string;
  locale: string;
  label: string | null;
  placeholder: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseSurveySectionQuestion {
  sectionId: string;
  section: BaseSurveySection;
  questionId: string;
  question: BaseSurveyQuestion;
  sortOrder: number;
}

export interface SurveySectionQuestion extends BaseSurveySectionQuestion {
  createdAt: string;
  updatedAt: string;
}

export interface BaseSurveySection {
  id: string;
  eventId: string;
  name: string;
  description: string | null;
  sortOrder: number;
  _count: {
    questions: number;
  };
}

export interface SurveySection extends BaseSurveySection {
  questions: SurveyQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface SurveySectionTranslation {
  id: string;
  locale: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export enum CustomModulePosition {
  top = "top",
  bottom = "bottom",
}

export interface CustomModule {
  id: string;
  name: string;
  url: string;
  iconName: string;
  color: string;
  description: string | null;
  enabled: boolean;
  position: CustomModulePosition;
}

export interface CustomModuleTranslation {
  id: string;
  moduleId: string;
  locale: string;
  name: string;
  description: string | null;
}

export enum MatchQuestionType {
  exclude = "exclude",
  include = "include",
  split = "split",
}

export interface BaseRound {
  id: string;
  event: {
    id: string;
    roundName: string | null;
    matchName: string | null;
  } | null;
  session: {
    id: string;
    roundName: string | null;
    matchName: string | null;
  } | null;
  number: number;
}

export interface Round extends BaseRound {
  matches: { id: string; number: number; title: string | null }[];
  createdAt: string;
  updatedAt: string;
}

export interface RoundEventQuestion extends RegistrationQuestion {
  matchType: "include" | "split" | "exclude";
  roundQuestionId?: string;
}

export interface RoundSessionQuestion extends EventSessionQuestion {
  matchType: "include" | "split" | "exclude";
  roundQuestionId?: string;
}

export interface BaseMatchPass {
  id: string;
  alternateId: number;
  ticket: BaseEventPassType;
  attendee: BaseEventAttendee;
  responses?: BaseRegistrationQuestionResponse[];
  accesses?: {
    responses: BaseEventSessionQuestionResponse[];
  }[];
}

export interface BaseMatch {
  id: string;
  round: BaseRound;
  number: number;
  title: string | null;
  description: string | null;
}

export interface Match extends BaseMatch {
  passes: BaseMatchPass[];
  createdAt: string;
  updatedAt: string;
}

export enum SideEffectTriggerType {
  NEW_PASS_OF_PASS_TYPE = "NEW_PASS_OF_PASS_TYPE",
  CHECKED_IN_EVENT_PASS = "CHECKED_IN_EVENT_PASS",
  NEW_ACCOUNT_TIER = "NEW_ACCOUNT_TIER",
  REMOVED_ACCOUNT_TIER = "REMOVED_ACCOUNT_TIER",
}

export enum SideEffectActionType {
  JOIN_GROUP = "JOIN_GROUP",
  LEAVE_GROUP = "LEAVE_GROUP",
  ADD_TO_TIER = "ADD_TO_TIER",
  SUBSCRIBE_TO_CHANNEL = "SUBSCRIBE_TO_CHANNEL",
  SEND_WEBHOOK = "SEND_WEBHOOK",
}

export interface BaseSideEffect {
  id: string;
  // Triggers
  newPassOfPassTypeId: string | null;
  checkedInPassEventId: string | null;
  newAccountTierId: string | null;
  removedAccountTierId: string | null;
  // ACTIONS
  joinGroupId: string | null;
  leaveGroupId: string | null;
  addToTierId: string | null;
  subscribeToChannelId: string | null;
  sendWebhookId: string | null;
}

export interface SideEffect extends BaseSideEffect {
  id: string;
  organizationId: string;
  // Triggers
  newPassOfPassType: BaseEventPassType | null;
  checkedInPassEvent: BaseEvent | null;
  newAccountTier: BaseTier | null;
  removedAccountTier: BaseTier | null;
  // Effects
  joinGroup: BaseGroup | null;
  leaveGroup: BaseGroup | null;
  addToTier: BaseTier | null;
  subscribeToChannel: BaseChannel | null;
  sendWebhook: BaseWebhook | null;
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export enum SystemEventLogStatus {
  pending = "pending",
  completed = "completed",
}

export interface SystemEventLog {
  id: string;
  organizationId: string;
  status: SystemEventLogStatus;
  trigger: string;
  progress: Record<string, boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface BaseWebhook {
  id: string;
  url: string;
  name: string;
  verified: boolean;
}

export interface Webhook extends BaseWebhook {
  createdAt: string;
  updatedAt: string;
}

export interface VideoCaption {
  language: string;
  label: string;
  generated: boolean;
  status: "inprogress" | "ready" | "error";
}

export interface TaxCode {
  code: string;
  description: string;
}

export interface EntityUseCode {
  code: string;
  name: string;
  description: string;
}
