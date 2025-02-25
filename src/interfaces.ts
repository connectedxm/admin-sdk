export interface ConnectedXMResponse<TData> {
  status: string;
  message: string;
  count?: number;
  data: TData;
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

export enum AccountType {
  account = "account",
  team = "team",
}

export enum PushDeviceAppType {
  EVENTXM = "EVENTXM",
  COMMUNITYXM = "COMMUNITYXM",
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

export enum ThreadAccessLevel {
  public = "public",
  private = "private",
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
  RESHARE = "RESHARE",
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
  inquiry = "inquiry",
}

export enum SupportTicketState {
  new = "new",
  awaitingResponse = "awaitingResponse",
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
}

export enum ReportType {
  organization = "organization",
  event = "event",
  booking = "booking",
  group = "group",
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

export interface BaseAccount {
  organizationId: string;
  id: string;
  accountType: AccountType;
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
  subscriptions: {
    subscriptionProduct: {
      tiers: BaseTier[];
    };
  }[];
  createdAt: string;
}

export interface Account extends BaseAccount {
  bannerId: string | null;
  banner: BaseImage | null;
  phone: string | null;
  interests: BaseInterest[];
  title: string | null;
  company: string | null;
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
  accountId: string;
  account: BaseAccount;
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
}

export interface Tier extends BaseTier {
  imageId: string;
  image: BaseImage;
  description: string | null;
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
  accountId: string;
}

export interface ActivationCompletion extends BaseActivationCompletion {
  account: BaseAccount;
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventActivation {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  maxPoints: number;
  startAfter: string | null;
  protected: false;
}

export interface EventActivation extends BaseEventActivation {
  eventId: string;
  event: BaseEvent;
  managerId: string | null;
  manager: BaseAccount | null;
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

export interface BaseActivity {
  id: string;
  message: string;
  readMore: boolean;
  linkPreview: BaseLinkPreview;
  giphyId: string | null;
  imageId: string | null;
  image: BaseImage | null;
  account: BaseAccount;
  eventId: string | null;
  groupId: string | null;
  contentId: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    likes: number;
    comments: number;
    reshares: number;
    interests: number;
  };
}

export interface Activity extends BaseActivity {
  video: BaseVideo | null;
  group: BaseGroup | null;
  event: BaseEvent | null;
  content: BaseChannelContent | null;
  interests: BaseInterest[];
  videoId: string | null;
  html: string | null;
  text: string | null;
  messageExtended: boolean;
}

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
  channelId: string;
  id: string;
  slug: string;
  featured: boolean;
  status: ContentStatus;
  published: string | null;
  visible: boolean;
  title: string | null;
  description: string | null;
  duration: string | null;
  email: boolean;
  push: boolean;
}

export interface ChannelContent extends BaseChannelContent {
  body: string | null;
  imageUrl: string | null;
  audioUrl: string | null;
  videoUrl: string | null;
  externalUrl: string | null;
  appleUrl: string | null;
  spotifyUrl: string | null;
  googleUrl: string | null;
  youtubeUrl: string | null;
  authors: BaseAccount[];
  mentions: BaseAccount[];
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
  createdAt: string;
  updatedAt: string;
}

export interface ChannelTranslation {
  locale: string;
  name: string;
  description: string | null;
}

export interface BaseChannel {
  id: string;
  slug: string;
  featured: boolean;
  name: string;
  description: string | null;
  priority: number;
  visible: boolean;
  imageId: string;
  image: BaseImage;
  bannerId: string | null;
  banner: BaseImage | null;
  subscriberCount: number;
}

export interface Channel extends BaseChannel {
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
}

export interface Coupon extends BaseCoupon {
  registrationId: string | null;
  registration: BaseEventAttendee | null;
  paymentId: number | null;
  payment: BasePayment;
  createdAt: string;
  updatedAt: string;
  _count: {
    purchases: number;
    uses: number;
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
  approved: boolean;
  source: EventSource;
  eventType: EventType;
  name: string;
  shortDescription: string;
  eventStart: string;
  eventEnd: string;
  timezone: string;
  externalUrl: string | null;
  location: string | null;
  venue: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip: string | null;
  imageId: string | null;
  image: BaseImage | null;
  registration: boolean;
  registrationStart: string | null;
  registrationEnd: string | null;
}

export interface Event extends BaseEvent {
  passSupply: number | null;
  passLimitPerAccount: number | null;
  reservationDescription: string | null;
  longDescription: string | null;
  meetingUrl: string | null;
  venueMapId: string | null;
  venueMap: BaseImage | null;
  creatorId: string | null;
  creator: BaseAccount | null;
  registrationLimit: number | null;
  publicRegistrants: boolean;
  sessionsVisible: boolean;
  speakersVisible: boolean;
  checkinCode: number | null;
  iosAppLink: string | null;
  androidAppLink: string | null;
  newActivityCreatorEmailNotification: boolean;
  newActivityCreatorPushNotification: boolean;
  seriesId: string | null;
  series: BaseSeries | null;
  streamInputs: BaseStreamInput[];
  streamReplayId: string | null;
  streamReplay: BaseVideo | null;
  groupId: string | null;
  group: BaseGroup | null;
  groupOnly: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventTranslation {
  id: number;
  locale: string;
  name: string;
  shortDescription: string;
  longDescription: string | null;
  reservationDescription: string | null;
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

enum SupportedLocale {
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
    activities: number;
  };
}

export interface BaseInvoiceLineItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  amount: number;
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
  payments: BasePayment;
  accountId: string | null;
  account: BaseAccount | null;
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
  newFollowerEmail: boolean;
  likePush: boolean;
  resharePush: boolean;
  commentPush: boolean;
  commentEmail: boolean;
  transferPush: boolean;
  transferEmail: boolean;
  supportTicketConfirmationEmail: boolean;
  eventAnnouncementEmail: boolean;
  eventAnnouncementPush: boolean;
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

export type PermissionDomain = keyof Omit<
  OrganizationMembership,
  "organizationId" | "userId" | "user"
>;

export type PermissionType = "read" | "create" | "update" | "del";

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
  // MODULES
  activities: ModulePermissions;
  events: ModulePermissions;
  groups: ModulePermissions;
  accounts: ModulePermissions;
  channels: ModulePermissions;
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
  locale: true;
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
  currency: string | null;
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
  appIconId: string | null;
  appIcon: BaseImage | null;
  appAdaptiveIconId: string | null;
  appAdaptiveIcon: BaseImage | null;
  appSplashScreenId: string | null;
  appSplashScreen: BaseImage | null;
  darkIconId: string | null;
  darkIcon: BaseImage | null;
  darkLogoId: string | null;
  darkLogo: BaseImage | null;
  requireCompany: boolean;
  requirePhone: boolean;
  requireTitle: boolean;
  authLayout: AuthLayout;
  defaultAuthAction: DefaultAuthAction;
  userPoolId: string | null;
  userPoolClientId: string | null;
  userPoolHostedUrl: string | null;
  appBundleIdentifier: string | null;
  expoProjectId: string | null;
  expoSlug: string | null;
  appleAuthEnabled: boolean;
  facebookAuthEnabled: boolean;
  googleAuthEnabled: boolean;
  oAuth: boolean;
  maxFileGbs: number | null;
  maxImageCount: number | null;
  maxVideoMins: number | null;
  locales: string[];
  googleServices: string | null;
  inviteOnly: boolean;
}

export interface OrganizationTrigger {
  id: number;
  code: string;
  type: OrganizationTriggerType;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BasePage {
  id: string;
  slug: string;
  title: string | null;
  subtitle: string | null;
}

export interface Page extends BasePage {
  html: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PageTranslation {
  id: number;
  locale: string;
  title: string | null;
  subtitle: string | null;
  html: string | null;
  createdAt: string;
  updatedAt: string;
}

export enum EventPassStatus {
  draft = "draft",
  canceled = "canceled",
  needsInfo = "needsInfo",
  ready = "ready",
}

export interface BaseEventPass {
  id: string;
  alternateId: number;
  ticketId: string | null;
  ticket: BaseEventPassType | null;
  location: string | null;
  usedAt: string | null;
  transfer: { id: string; email: string; createdAt: string };
  responses: BaseRegistrationQuestionResponse[];
  status: EventPassStatus;
  reservationId: string | null;
  reservation: BaseEventRoomTypeReservation | null;
  couponId: string | null;
  coupon: BaseCoupon | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventPass extends BaseEventPass {
  passAddOns: PassAddOn[];
  attendeeId: string;
  attendee: BaseEventAttendee;
  // registrationId: string;
  // registration: BaseEventAttendee;
  payerId: string | null;
  payer: BaseAccount | null;
  amtPaid: number;
  amtRefunded: number;
}

export interface PassAddOn {
  addOnId: string;
  addOn: BaseEventAddOn;
  createdAt: string;
  updatedAt: string;
}

export interface PushDevice {
  id: string;
  accountId: string;
  account: BaseAccount;
  name: string | null;
  model: string | null;
  brand: string | null;
  osName: string | null;
  osVersion: string | null;
  deviceYearClass: number | null;
  manufacturer: string | null;
  supportedCpuArchitectures: string | null;
  totalMemory: number | null;
  appType: PushDeviceAppType;
  pushService: PushService;
  createdAt: string;
  updatedAt: string;
}

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
  chargedAmt: number;
  ticketId: string | null;
  ticket: BaseEventPassType | null;
  stripeId: string | null;
  last4: string | null;
  debugId: string | null;
  salesTax: number;
  salesTaxRate: string | null;
  country: string;
  state: string;
  zip: string;
  createdAt: string;
}

export enum PaymentIntegrationType {
  stripe = "stripe",
  paypal = "paypal",
  braintree = "braintree",
}

export interface Payment extends BasePayment {
  accountId: string;
  account: BaseAccount;
  bypassedId: string | null;
  bypassedBy: BaseUser | null;
  integration: {
    type: PaymentIntegrationType;
  };
  subscription: BaseSubscription;
  addOns: BaseEventAddOn[];
  purchases: BaseEventPass[];
  coupons: BaseCoupon[];
  invoice: BaseInvoice;
  registrationId: string | null;
  bookingId: string | null;
  booking: BaseBooking | null;
  metadata?: any;
}

export interface PaymentIntegration {
  id: string;
  type: PaymentIntegrationType;
  connectionId: string;
  enabled: boolean;
  stripe?: any | null;
  paypal?: any | null;
  braintree?: any | null;
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
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
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
  user: BaseUser;
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

export interface BaseRegistrationQuestionSearchValue {
  id: string;
  value: string;
  top: boolean;
}

export interface RegistrationQuestionSearchValue
  extends BaseRegistrationQuestionSearchValue {
  createdAt: string;
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
  span: number;
  mutable: boolean;
  min: string | null;
  max: string | null;
  validation: string | null;
  validationMessage: string | null;
  sortOrder: number;
  featured: boolean;
  choices: BaseRegistrationQuestionChoice[];
}

export interface RegistrationQuestion extends BaseRegistrationQuestion {
  sections: BaseRegistrationSectionQuestion[];
  subQuestionOf: RegistrationQuestionChoiceSubQuestion[];
  createdAt: string;
  updatedAt: string;
  _count: {
    responses: number;
  };
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

export interface RegistrationSectionTranslation {
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
  coupons: BaseCoupon[];
  createdAt: string;
  updatedAt: string;
}

export interface ReportParent {
  id: number;
  type: ReportType;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: number;
  name: string;
  description: string | null;
  columns: string | null;
  filters: string | null;
  charts: string | null;
  advancedFilter: string | null;
  parentId: number | null;
  parent: ReportParent | null;
  eventId: string | null;
  event: BaseEvent | null;
  user: BaseUser | null;
  shared: boolean;
  sharedUsers: BaseUser[];
  createdAt: string;
  updatedAt: string;
  // DYNAMIC
  colDefs: any;
  rowData: any[];
  nextCursor: number | null;
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

export interface Self extends Account {}

export interface BaseSeries {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imageId: string | null;
  image: BaseImage | null;
}

export interface Series extends BaseSeries {
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
  tracks: BaseEventTrack[];
  nonSession: boolean;
  visible: boolean;
  location: BaseEventSession | null;
  registrationEnabled: boolean;
  price: number | null;
  limit: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventSession extends BaseEventSession {
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
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventSessionLocation {
  id: string;
  name: string;
}

export interface EventSessionLocation extends BaseEventSessionLocation {
  googlePlaceId: string | null;
  description: string | null;
  address1: string | null;
  address2: string | null;
  zip: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  image: BaseImage | null;
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

export interface BaseEventSessionQuestion {
  id: string;
  name: string;
  label: string | null;
  description: string | null;
  required: boolean;
  sortOrder: number;
}

export interface EventSessionQuestion extends BaseEventSessionQuestion {
  createdAt: string;
  updatedAt: string;
}

export interface EventSessionQuestionTranslation {
  id: string;
  locale: string;
  label: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventSessionQuestionResponse {
  id: string;
  value: string;
}

export interface EventSessionQuestionResponse
  extends BaseEventSessionQuestionResponse {
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventSessionPass {
  id: true;
  canceled: boolean;
}

export interface EventSessionPass extends BaseEventSessionPass {
  createdAt: true;
  updatedAt: true;
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
  eventId: string | null;
  event: {
    name: string;
  } | null;
}

export interface StreamInput extends BaseStreamInput {
  sortOrder: number;
  event: BaseEvent | null;
  sessionId: string | null;
  session: BaseEventSession | null;
  details?: StreamInputDetails;
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

export enum SubscriptionProductPriceType {
  flat = "flat",
  payWhatYouWant = "payWhatYouWant",
}

export enum SubscriptionProductPriceInterval {
  day = "day",
  week = "week",
  month = "month",
  year = "year",
}

export interface BaseSubscriptionProductPrice {
  id: string;
  active: boolean;
  amount: number;
  currency: string;
  interval: SubscriptionProductPriceInterval;
  intervalCount: number;
  minAmount: number;
  maxAmount: number;
  type: SubscriptionProductPriceType;
}

export interface SubscriptionProductPrice extends BaseSubscriptionProductPrice {
  subscriptionProduct: BaseSubscriptionProduct;
  createdAt: string;
  updatedAt: string;
}

export interface BaseSubscriptionProduct {
  id: string;
  active: boolean;
  name: string;
  description: string | null;
}

export interface SubscriptionProduct extends BaseSubscriptionProduct {
  prices: BaseSubscriptionProductPrice[];
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
  subscriptionProduct: BaseSubscriptionProduct;
}

export interface Subscription extends BaseSubscription {
  accountId: string;
  account: BaseAccount;
  priceId: string;
  price: BaseSubscriptionProductPrice;
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
  status: "new" | "inProgress" | "complete";
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

  createdAt: string;
  updatedAt: string;
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

export interface EventPassType extends BaseEventPassType {
  overrideStartDate: string | null;
  sortOrder: number;
  event: BaseEvent;
  allowedTiers: BaseTier[];
  disallowedTiers: BaseTier[];
  _count: {
    purchases: number;
  };
}

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

export interface BaseThread {
  id: string;
  name: string;
  description: string | null;
  featured: boolean;
  imageId: string | null;
  image: BaseImage | null;
  access: ThreadAccessLevel;
  section: string | null;
  eventId: string | null;
  groupId: string | null;
  lastMessageAt: string | null;
}

export interface Thread extends BaseThread {
  createdAt: string;
  event: BaseEvent | null;
  group: BaseGroup | null;
  members: ThreadMember[];
  _count: {
    members: number;
    messages: number;
  };
}

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
  organizationId: string;
  threadId: string;
  body: string;
  createdAt: string;
  replyToId: string | null;
  reactions: ThreadMessageReaction[];
  account: BaseAccount;
}

export interface ThreadMessage extends BaseThreadMessage {
  thread: BaseThread;
  accountId: string;
  type: ThreadMessageType;
  replyTo: BaseThreadMessage | null;
  replies: BaseThreadMessage[];
  mentions: BaseAccount[];
  files: BaseFile[];
  images: BaseImage[];
  videos: BaseVideo[];
  editedAt: string | null;
  sentAt: string;
}

export interface BaseThreadMember {
  accountId: string;
  role: ThreadMemberRole;
  account: BaseAccount;
}

export interface ThreadMember extends BaseThreadMember {
  id: string;
  organizationId: string;
  threadId: string;
  thread: BaseThread;
  accepted: boolean;
  lastReadAt: string | null;
  notifications: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaypalActivationFormParams {
  clientId: string;
  clientSecret: string;
}

export interface BraintreeActivationFormParams {
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
  cognitoUsername: string;
  provider: string;
  updatedAt: string;
  createdAt: string;
}

export interface Login extends BaseLogin {
  sub: string;
  userPoolId: string;
  enabled: boolean;
  status: string;
  email: string;
  verified: boolean;
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

export interface BaseEventRoomTypeReservation {
  id: string;
  start: string | null;
  end: string | null;
  eventRoomTypeId: string;
  eventRoomType: BaseEventRoomType;
}

export interface EventRoomTypeReservation extends BaseEventRoomTypeReservation {
  passes: {
    id: string;
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
  company: string | null;
  title: string | null;
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
  status: EventPassStatus;
  account: BaseAccount;
  space: BaseBookingSpace;
}

export interface Booking extends BaseBooking {
  createdAt: string;
  updatedAt: string;
}

export interface BookingSlot {
  time: string;
  supply: number | null;
}
