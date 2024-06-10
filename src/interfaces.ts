export interface ConnectedXMResponse<TData> {
  status: "ok" | "error" | "redirect";
  message: string;
  data: TData;
  count?: number;
  url?: string;
}

export enum Currency {
  USD = "USD",
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

export enum RegistrationStatus {
  registered = "registered",
  checkedIn = "checkedIn",
  checkedOut = "checkedOut",
  cancelled = "cancelled",
  draft = "draft",
}

export enum TicketVisibility {
  public = "public",
  private = "private",
}

export enum TicketEventAccessLevel {
  regular = "regular",
  virtual = "virtual",
  vip = "vip",
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
}

export enum SupportTicketType {
  support = "support",
  inquiry = "inquiry",
}

export enum ContentTypeFormat {
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
}

export enum OrganizationTriggerType {
  postAuth = "postAuth",
}
export interface Organization {
  id: string;
  email: string;
  name: string;
  slug: string | null;
  phone: string | null;
  website: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  stripeConnectAccountId: string | null;
  logo: Image | null;
  logoId: string | null;
  currency: Currency;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedIn: string | null;
  tikTok: string | null;
  youtube: string | null;
  discord: string | null;
  timezone: string;
  iosAppLink: string | null;
  androidAppLink: string | null;
  createdAt: string;
  updatedAt: string;
  integrations: Integrations;
}

export interface Page {
  title: string | null;
  subtitle: string | null;
  html: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PageTranslation {
  locale: string;
  title: string | null;
  subtitle: string | null;
  html: string | null;
}

export interface TeamMember {
  id: string;
  slug: string;
  priority: number | null;
  firstName: string | null;
  lastName: string | null;
  nickName: string | null;
  email: string | null;
  phone: string | null;
  title: string | null;
  bio: string | null;
  imageId: string | null;
  image: Image | null;
  linkedIn: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  tikTok: string | null;
  discord: string | null;
  startDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Integrations {
  chat42: boolean;
  evolve: boolean;
  ghost: boolean;
  ghostUrl: string | null;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Permissions {
  read: boolean;
  create: boolean;
  update: boolean;
  del: boolean;
}
export interface OrgMembership {
  organizationId: string;
  userId: string;
  user: User;
  org: Permissions;
  users: Permissions;
  accounts: Permissions;
  activities: Permissions;
  advertisements: Permissions;
  announcements: Permissions;
  groups: Permissions;
  contentTypes: Permissions;
  contents: Permissions;
  coupons: Permissions;
  events: Permissions;
  registrations: Permissions;
  storage: Permissions;
  interests: Permissions;
  levels: Permissions;
  purchases: Permissions;
  sponsorships: Permissions;
  supportTickets: Permissions;
  benefits: Permissions;
  streams: Permissions;
  reports: Permissions;
  subscriptions: Permissions;
  invoices: Permissions;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMembershipDomainPermissions {
  read: boolean;
  create: boolean;
  update: boolean;
  del: boolean;
}

export interface Tier {
  id: string;
  slug: string;
  name: string;
  priority: number;
  iconName: string;
  imageId: string | null;
  image: Image | null;
  color: string | null;
  description: string | null;
  internal: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    accounts: number;
  };
}

export interface Account {
  id: string;
  organizationId: string;
  email: string;
  username: string;
  phone: string | null;
  verified: boolean;
  imageId: string | null;
  image: Image | null;
  featured: boolean;
  accountType: AccountType;
  firstName: string | null;
  lastName: string | null;
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
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip: string | null;
  timezone: string | null;
  accountTiers: Tier[];
  internalRefId: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    groups: number;
    interests: number;
    followers: number;
    following: number;
  };
}

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

export interface PushDevice {
  id: string;
  accountId: string | null;
  account: Account | null;
  name: string | null;
  model: string | null;
  brand: string | null;
  osName: string | null;
  osVersion: string | null;
  deviceYearClass: number | null;
  manufacturer: string | null;
  supportedCpuArchitectures: string | null;
  totalMemory: string | null;
  appType: PushDeviceAppType;
  pushService: PushService;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  shareAccountId: string;
  shareAccount: {
    image: Image;
  };
  eventId: string | null;
  event: Event | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  title: string | null;
  state: string | null;
  country: string | null;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  linkedIn: string | null;
  twitter: string | null;
  tikTok: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseEvent {
  id: string;
  name: string;
}

export interface Event extends BaseEvent {
  slug: string;
  internalRefId: string | null;
  featured: boolean;
  visible: boolean;
  approved: boolean;
  source: EventSource;
  eventType: EventType;
  shortDescription: string;
  longDescription: string | null;
  eventStart: string;
  eventEnd: string;
  externalUrl: string | null;
  meetingUrl: string | null;
  imageId: string | null;
  image: Image | null;
  venue: string | null;
  venueMapId: string | null;
  venueMap: Image | null;
  location: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip: string | null;
  creatorId: string | null;
  creator: Account | null;
  registration: boolean;
  registrationCount: number;
  registrationLimit: number | null;
  publicRegistrants: boolean;
  inviteOnly: boolean;
  registrationStart: string | null;
  registrationEnd: string | null;
  timezone: string | null;
  sessionsVisible: boolean;
  speakersVisible: boolean;
  checkinCode: number | null;
  iosAppLink: string | null;
  androidAppLink: string | null;
  tickets: Ticket[];
  newActivityCreatorEmailNotification: boolean;
  newActivityCreatorPushNotification: boolean;
  seriesId: string | null;
  series: Series | null;
  streamReplayId: string | null;
  streamReplay: BaseVideo | null;
  createdAt: string;
  updatedAt: string;
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

export enum BadgeFieldType {
  attribute = "attribute",
  tier = "tier",
  question = "question",
  ticket = "ticket",
}

export interface BaseEventOnSiteBadgeField {
  id: number;
  eventId: string;
  name: string;
  type: BadgeFieldType;
  lookup: string | null;
  maxLength: number | null;
  defaultValue: string | null;
  transformation: "uppercase" | "lowercase" | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventOnSiteBadgeField extends BaseEventOnSiteBadgeField {
  onSite: EventOnSite;
}

export enum EventEmailType {
  confirmation = "confirmation",
  cancellation = "cancellation",
  reminder = "reminder",
}

export interface EventEmail {
  type: string;
  eventId: string;
  body: string;
  replyTo: string | null;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventTranslation {
  locale: string;
  name: string;
  shortDescription: string;
  longDescription: string | null;
}

export interface EventActivation {
  id: string;
  slug: string;
  eventId: string;
  event: Event;
  managerId: string | null;
  manager: Account | null;
  imageId: string | null;
  image: Image | null;
  name: string;
  shortDescription: string;
  longDescription: string | null;
  maxPoints: number;
  startAfter: string | null;
  protected: boolean;
  protectionCode: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventActivationTranslation {
  locale: string;
  name: string;
  shortDescription: string;
  longDescription: string | null;
}

export interface EventActivationCompletion {
  id: string;
  eventId: string;
  eventActivationId: string;
  eventActivation: EventActivation;
  accountId: string;
  account: Account;
  earnedPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventPage {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  sortOrder: number;
}

export interface EventPage extends BaseEventPage {
  html: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventPageTranslation {
  locale: string;
  title: string;
  subtitle: string;
  html: string;
}

export interface Registration {
  id: string;
  alternateId: number;
  eventId: string;
  event: Event;
  accountId: string;
  account: Account;
  status: RegistrationStatus;
  statusChanges: RegistrationStatusChange[];
  couponId: string | null;
  coupon: Coupon | null;
  purchases: BasePurchase[];
  payments: Payment[];
  intentId: string | null;
  intentCreatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationStatusChange {
  id: number;
  registrationId: string;
  registration: Registration;
  status: RegistrationStatus;
  reason: string | null;
  userId: string | null;
  user: User | null;
  createdAt: string;
}

export enum PaymentType {
  charge = "charge",
  refund = "refund",
}

export interface Payment {
  id: string;
  type: PaymentType;
  registrationId: string;
  ticketId: string;
  stripeId: string;
  bypassedBy: User | null;
  bypassedById: string | null;
  chargedAmt: number;
  createdAt: string;
}

export interface Speaker {
  id: string;
  slug: string;
  sessions: Session[];
  eventId: string;
  event: Event;
  firstName: string;
  lastName: string | null;
  fullName: string | null;
  bio: string | null;
  title: string | null;
  company: string | null;
  companyBio: string | null;
  label: string | null;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedIn: string | null;
  tikTok: string | null;
  discord: string | null;
  youtube: string | null;
  imageId: string | null;
  image: Image | null;
  isHost: boolean;
  priority: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SpeakerTranslation {
  locale: string;
  title: string | null;
  bio: string | null;
}

export interface SessionBase {
  id: string;
  slug: string;
  eventId: string;
  event: Event;
  name: string;
  description: string | null;
  longDescription: string | null;
  location: string | null;
  imageId: string | null;
  image: Image | null;
  startTime: string;
  endTime: string;
  sortOrder: number | null;
  tracks: Track[];
  nonSession: boolean;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Session extends SessionBase {
  speakers: Speaker[];
}

export interface SessionTranslation {
  locale: string;
  name: string;
  description: string | null;
  longDescription: string | null;
}

export interface Track {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  color: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    sessions: number;
  };
}

export interface TrackTranslation {
  locale: string;
  name: string;
  description: string | null;
}

export interface FAQSection {
  id: string;
  slug: string;
  name: string;
  priority: number;
  faqs: FAQ[];
  organizationId: string;
  eventId: string;
  event: Event;
  createdAt: string;
  updatedAt: string;
}

export interface FAQSectionTranslation {
  locale: string;
  name: string;
}

export interface FAQ {
  id: string;
  slug: string;
  visible: boolean;
  question: string;
  answer: string;
  priority: number;
  organizationId: string;
  eventId: string;
  sectionId: string | null;
  section: FAQSection | null;
  createdAt: string;
  updatedAt: string;
}

export interface FAQTranslation {
  locale: string;
  question: string;
  answer: string;
}

export interface BaseTicket {
  id: string;
  slug: string;
  active: boolean;
  transferable: boolean;
  featured: boolean;
  visibility: TicketVisibility;
  name: string;
  shortDescription: string;
  longDescription: string | null;
  price: number;
  accessLevel: TicketEventAccessLevel;
  featuredImageId: string | null;
  featuredImage: Image | null;
  event: Event;
  supply: number | null;
  minQuantityPerSale: number | null;
  maxQuantityPerSale: number | null;
  limitPerAccount: number | null;
  emailDomains: string | null;
  allowedTiers: Tier[];
  sortOrder: number;
  minReservationStart: string | null;
  reservationStart: string | null;
  maxReservationStart: string | null;
  minReservationEnd: string | null;
  reservationEnd: string | null;
  maxReservationEnd: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket extends BaseTicket {
  _count: {
    purchases: number;
  };
}

export interface TicketTranslation {
  locale: string;
  name: string;
  shortDescription: string;
  longDescription: string | null;
}

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  active: boolean;
  startDate: string | null;
  endDate: string | null;
  discountAmount: number;
  discountPercent: number;
  quantityMin: number;
  quantityMax: number | null;
  amountMin: number;
  amountMax: number | null;
  useLimit: number | null;
  emailDomains: string | null;
  ticketId: string | null;
  ticket: BaseTicket | null;
  managerId: string | null;
  manager: Account | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    registrations: number;
  };
}

export interface BasePurchase {
  id: string;
  alternateId: number;
  ticketId: string;
  ticket: BaseTicket;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  location: string | null;
  usedAt: string | null;
  transfer: {
    id: string;
    email: string;
    createdAt: string;
  } | null;
  paid: boolean;
  responses: BaseRegistrationQuestionResponse[];
  reservationStart: string | null;
  reservationEnd: string | null;
  reservationSectionLocation: BaseEventReservationSectionLocation | null;
  createdAt: string;
  updatedAt: string;
}

export interface Purchase extends BasePurchase {
  addOns: BaseEventAddOn[];
  registrationId: string;
  registration: Registration;
}

export interface Transfer {
  id: string;
  email: string;
  purchaseId: string;
  purchase: Purchase;
  createdAt: string;
  updatedAt: string;
}

export interface BasePurchaseTransferLog {
  id: number;
}

export interface PurchaseTransferLog extends BasePurchaseTransferLog {
  purchaseId: string;
  purchase: BasePurchase;
  fromRegistrationId: string;
  fromRegistration: Registration;
  toRegistrationId: string;
  toRegistration: Registration;
  userId: string;
  user: User;
  createdAt: string;
}

export interface Group {
  id: string;
  slug: string;
  name: string;
  active: boolean;
  access: GroupAccess;
  description: string;
  featured: boolean;
  imageId: string | null;
  image: Image | null;
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
  locale: string;
  name: string;
  description: string;
}

export interface GroupMembership {
  accountId: string;
  account: Account;
  groupId: string;
  group: Group;
  following: boolean;
  role: GroupMembershipRole;
  announcementEmailNotification: boolean;
  announcementPushNotification: boolean;
  activityEmailNotification: boolean;
  activityPushNotification: boolean;
  eventEmailNotification: boolean;
  eventPushNotification: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Interest {
  id: string;
  name: string;
  featured: boolean;
  image: Image | null;
  imageId: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    accounts: number;
    groups: number;
    activities: number;
  };
}

export interface BaseActivity {
  id: string;
  message: string;
  html: string;
  text: string;
  linkPreview: LinkPreview | null;
  imageId: string | null;
  image: Image | null;
  account: Account;
  group: Group | null;
  event: Event | null;
  content: Content | null;
  giphyId: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    likes: number;
    comments: number;
    reshares: number;
  };
}

export interface Activity extends BaseActivity {
  commented: BaseActivity | null;
  reshared: BaseActivity | null;
  mentions: Account[];
  messageExtended: string | null;
}

export interface LinkPreview {
  id: number;
  url: string;
  title: string | null;
  siteName: string | null;
  description: string | null;
  image: string | null;
  imageType: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  favicon: string | null;
}

export interface Like {
  account: Account;
  activity: Activity;
  createdAt: string;
}

export interface Announcement {
  id: string;
  slug: string;
  verifiedAccounts: boolean;
  userId: string | null;
  user: User | null;
  eventId: string | null;
  event: Event | null;
  groupId: string | null;
  group: Group | null;
  accountId: string | null;
  account: Account | null;
  ticketId: string | null;
  ticket: Account | null;
  sponsorshipLevelId: string | null;
  sponsorshipLevel: SponsorshipLevel | null;
  creatorId: string | null;
  creator: Account | null;
  title: string | null;
  message: string | null;
  html: string | null;
  email: boolean;
  sms: boolean;
  push: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    notifications: number;
  };
}

export interface Notification {
  id: string;
  type: NotificationType;
  read: boolean;
  receiverId: string;
  receiver: Account;
  senderId: string | null;
  sender: Account | null;
  createdAt: string;
  updatedAt: string;
  transfer: Transfer | null;
  like: Like | null;
  activity: Activity | null;
  event: Event | null;
  announcement: Announcement | null;
}

export interface SponsorshipLevel {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  description: string | null;
  color: string;
  scale: number;
  imageId: string | null;
  image: Image | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SponsorshipLevelTranslation {
  locale: string;
  name: string;
  subtitle: string | null;
  description: string | null;
}

export interface Advertisement {
  id: string;
  type: AdvertisementType;
  link: string;
  title: string;
  description: string | null;
  imageId: string | null;
  image: Image | null;
  startDate: string;
  endDate: string | null;
  weight: number;
  accountId: string | null;
  account: Account | null;
  eventId: string | null;
  event: Event | null;
  eventOnly: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    views: number;
    clicks: number;
  };
}

export interface AdvertisementClick {
  id: string;
  organizationId: string;
  advertisementId: string;
  advertisement: Advertisement;
  accountId: string | null;
  account: Account | null;
  createdAt: string;
  updatedAt: string;
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

export interface Image {
  id: string;
  uri: string;
  type: ImageType;
  name: string | null;
  description: string | null;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicket {
  id: string;
  type: SupportTicketType;
  email: string;
  request: string;
  accountId: string | null;
  account: Account | null;
  eventId: string;
  event: Event;
  notes: SupportTicketNote[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicketNote {
  id: string;
  supportTicketId: string;
  userId: string;
  user: User;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentType {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  priority: number;
  visible: boolean;
  format: ContentTypeFormat;
  imageId: string;
  image: Image;
  externalUrl: string | null;
  appleUrl: string | null;
  spotifyUrl: string | null;
  googleUrl: string | null;
  youtubeUrl: string | null;
  createdAt: string;
  updatedAt: string;
  hosts: Account[];
  _count: {
    subscribers: number;
    contents: number;
  };
}

export interface ContentTypeTranslation {
  locale: string;
  name: string;
  description: string | null;
}

export interface Content {
  id: string;
  slug: string;
  contentTypeId: string;
  contentType: ContentType;
  status: ContentStatus;
  featured: boolean;
  visible: boolean;
  title: string | null;
  description: string | null;
  duration: string | null;
  body: string | null;
  imageUrl: string | null;
  audioUrl: string | null;
  videoUrl: string | null;
  published: string | null;
  externalUrl: string | null;
  appleUrl: string | null;
  spotifyUrl: string | null;
  googleUrl: string | null;
  youtubeUrl: string | null;
  authors: Account[];
  mentions: Account[];
  createdAt: string;
  updatedAt: string;
}

export interface ContentTranslation {
  locale: string;
  title: string | null;
  description: string | null;
  body: string | null;
}

export interface Benefit {
  id: string;
  slug: string;
  link: string;
  title: string;
  description: string | null;
  imageId: string | null;
  image: Image | null;
  startDate: string;
  endDate: string | null;
  priority: number;
  managerId: string | null;
  manager: Account | null;
  eventId: string | null;
  event: Event | null;
  eventOnly: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    clicks: number;
  };
}

export interface BenefitTranslation {
  locale: string;
  title: string;
  description: string | null;
}

export interface BenefitClick {
  id: string;
  benefitId: string;
  benefit: Benefit;
  accountId: string | null;
  account: Account | null;
  createdAt: string;
  updatedAt: string;
}

export interface SponsorshipPurchase {
  id: string;
  alternateId: number;
  organizationId: string;
  accountId: string;
  account: Account;
  sponsorshipId: string;
  sponsorship: Sponsorship;
  createdAt: string;
  updatedAt: string;
}

export interface Sponsorship {
  id: string;
  slug: string;
  active: boolean;
  name: string;
  description: string | null;
  price: string;
  imageId: string | null;
  image: Image | null;
  createdAt: string;
  updatedAt: string;
}

export interface SponsorshipTranslation {
  locale: string;
  name: string;
  description: string | null;
}

export interface SponsorshipPurchase {
  id: string;
  alternateId: number;
  accountId: string;
  account: Account;
  sponsorshipId: string;
  sponsorship: Sponsorship;
  createdAt: string;
  updatedAt: string;
}

export interface BaseVideo {
  id: string;
  width: number;
  height: number;
  thumbnailUrl: string;
  previewUrl: string;
  readyToStream: boolean;
}

export interface Video extends BaseVideo {
  name: string;
  status: string;
  source: "admin" | "activity";
  hlsUrl: string;
  thumbnailPct: number;
  dashUrl: string;
  duration: number;
  createdAt: string;
}

export interface StreamInput {
  id: string;
  organizationId: string;
  name: string;
  sortOrder: number;
  connected: boolean;
  details?: StreamInputDetails;
  cloudflareId: string | null;
  eventId: string | null;
  event: Event | null;
  sessionId: string | null;
  session: Session | null;
  createdAt: string;
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

export interface StreamInputOutput {
  status: string;
  enabled: boolean;
  url: string;
  streamKey: string;
  uid: string;
}

export interface GhostMember {
  id: string;
  email: string;
  name: string;
  newsletters: Newsletter[];
}

export interface Newsletter {
  id: string;
  name: string;
  description: string;
  status: string;
  visibility: string;
  header_image: string;
  created_at: string;
  updated_at: string;
}

export interface BaseRegistrationQuestion {
  eventId: string;
  id: number;
  type: RegistrationQuestionType;
  name: string;
  required: boolean;
  description: string | null;
  label: string | null;
  placeholder: string | null;
  default: string | null;
  span: number;
  mutable: boolean;
  min: number | null;
  max: number | null;
  validation: string | null;
  validationMessage: string | null;
  choices: BaseRegistrationQuestionChoice[];
  sortOrder: number;
  featured: boolean;
}

export interface RegistrationQuestion extends BaseRegistrationQuestion {
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationQuestionTranslation {
  id: number;
  locale: string;
  label: string;
  placeholder: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationSectionQuestion {
  sectionId: number;
  section: BaseRegistrationSection;
  questionId: number;
  question: BaseRegistrationQuestion;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface BaseRegistrationQuestionChoice {
  id: number;
  value: string;
  text: string | null;
  supply: number | null;
  description: string | null;
  sortOrder: number;
  _count: {
    subQuestions: number;
  };
}

export interface RegistrationQuestionChoice
  extends BaseRegistrationQuestionChoice {
  questionId: number;
  question: RegistrationQuestion;
  subQuestions: RegistrationChoiceSubQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationQuestionChoiceTranslation {
  id: number;
  locale: string;
  value: string;
  text: string | null;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationQuestionSearchValue {
  id: number;
  value: string;
  top: boolean;
  createdAt: string;
}

export interface RegistrationChoiceSubQuestion {
  choiceId: number;
  choice: BaseRegistrationQuestionChoice;
  questionId: number;
  question: BaseRegistrationQuestion;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface BaseRegistrationQuestionResponse {
  id: string;
  value: string;
  questionId: string;
  question: BaseRegistrationQuestion;
}

export interface RegistrationQuestionResponse
  extends BaseRegistrationQuestionResponse {
  registrationId: string;
  registration: Registration;
  // changeLogs: RegistrationQuestionResponseChangeLog[];
  createdAt: string;
  updatedAt: string;
}

export interface BaseRegistrationQuestionResponseChange {
  id: number;
  newValue: string;
  oldValue: string;
  eventId: string;
  questionId: number;
  responseId: number;
  userId: string;
  createdAt: string;
}
export interface RegistrationQuestionResponseChange
  extends BaseRegistrationQuestionResponseChange {
  response: RegistrationQuestionResponse;
  user: User;
}

export interface BaseRegistrationSection {
  id: number;
  name: string;
  description: string | null;
  sortOrder: number;
  _count: {
    questions: number;
  };
}

export interface RegistrationSection extends BaseRegistrationSection {
  questions: BaseRegistrationQuestion[];
  eventTickets: BaseTicket[];
  accountTiers: Tier[];
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationSectionTranslation {
  id: number;
  locale: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface BaseSeries {
  id: string;
  sortOrder: number;
  name: string;
  slug: string;
  description: string | null;
  imageId: string | null;
  image: Image | null;
  createdAt: string;
  updatedAt: string;
}

export interface Series extends BaseSeries {}

export enum ExportStatus {
  pending = "pending",
  resolved = "resolved",
  failed = "failed",
}

export interface BaseExport {
  id: string;
  status: ExportStatus;
  type: string;
  message: string | null;
  eventId: string | null;
  userId: string | null;
  expiration: string | null;
  downloadUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Export extends BaseExport {
  event: BaseEvent;
  user: User;
}

export interface BaseImport {
  id: string;
  type: string;
  overwrite: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Import extends BaseImport {
  user: User;
  _count: {
    items: number;
  };
}

export enum ImportStatus {
  pending = "pending",
  resolved = "resolved",
  failed = "failed",
}
export type ImportType = "account-tiers";

export interface BaseImportItem {
  id: true;
  importId: true;
  values: object;
  status: ImportStatus;
  message: string;
  debug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImportItem extends BaseImportItem {
  import: BaseImport;
}

export interface PaymentIntegration {
  id: string;
  type: "stripe" | "paypal";
  connectionId: string;
  enabled: boolean | null;
  stripe?: any | null;
  paypal?: any | null;
  createdAt: string;
  updatedAt: string;
}

export type CognitoUserStatus =
  | "UNCONFIRMED"
  | "CONFIRMED"
  | "ARCHIVED"
  | "COMPROMISED"
  | "RESET_REQUIRED"
  | "FORCE_CHANGE_PASSWORD"
  | "DISABLED"
  | "UNKNOWN";

export interface CognitoUser {
  username: string;
  status: CognitoUserStatus;
  enabled: boolean;
  email: string;
  emailVerified: boolean;
}

export interface EventRegistrationBypass {
  id: number;
  accountId: string;
  account: Account;
  closed: boolean;
  preRegister: boolean;
  postRegister: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum EmailReceiptStatus {
  delivered = "delivered",
  pending = "pending",
  bounced = "bounced",
  complaint = "complaint",
}

export interface BaseEmailReceipt {
  id: string;
  status: EmailReceiptStatus;
  from: string;
  to: string;
  replyTo: string | null;
  subject: string;
  account: Account;
  createdAt: string;
  updatedAt: string;
}

export interface EmailReceipt extends BaseEmailReceipt {
  html: string;
  text: string;
  debug: Record<string, any> | null;
}
export interface ReportParent {
  id: number;
  type: keyof typeof ReportType;
  name: string;
  description: string;
  colDefs: string;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: number;
  name: string;
  description: string | null;
  columns: string;
  filters: string;
  charts: string;
  advancedFilter: string;
  parentId: string;
  parent: ReportParent;
  eventId: string | null;
  event: BaseEvent | null;
  rowData: any[];
  colDefs: any[];
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface BaseSubscriptionProduct {
  id: string;
  active: boolean;
  name: string;
  description: string;
}

export interface SubscriptionProduct extends BaseSubscriptionProduct {
  statementDescriptor: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BaseSubscriptionProductPrice {
  id: string;
  active: boolean;
  amount: number;
  currency: "usd";
  interval: "day" | "week" | "month" | "year";
  intervalCount: number;
  maxAmount: number | null;
  minAmount: number | null;
  type: "flat" | "payWhatYouWant";
}

export interface SubscriptionProductPrice extends BaseSubscriptionProductPrice {
  subscriptionProduct: BaseSubscriptionProduct;
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
  subscriptionProduct: BaseSubscriptionProduct;
}

export interface Subscription extends BaseSubscription {
  accountId: string;
  account: Account;
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

export enum InvoiceStatus {
  draft = "draft",
  sent = "sent",
  paid = "paid",
  void = "void",
}

export interface BaseInvoice {
  id: string;
  alternateId: number;
  title: string;
  description: string | null;
  dueDate: string;
  sentDate: string | null;
  status: InvoiceStatus;
}

export interface Invoice extends BaseInvoice {
  lineItems: BaseInvoiceLineItem[];
  payments: Payment[];
  accountId: string | null;
  account: Account | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BaseInvoiceLineItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  amount: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceLineItem extends BaseInvoiceLineItem {
  invoiceId: string;
  invoice: BaseInvoice;
}

export interface OrganizationTrigger {
  code: string;
  type: OrganizationTriggerType;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface BaseEventAddOn {
  id: string;
  name: string;
  shortDescription: string;
  supply: number | null;
  price: number;
  sortOrder: number;
  minReservationStart: string | null;
  reservationStart: string | null;
  maxReservationStart: string | null;
  minReservationEnd: string | null;
  reservationEnd: string | null;
  maxReservationEnd: string | null;
  eventId: string;
  imageId: string | null;
  image: Image | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    purchases: string;
  };
}

export interface EventAddOn extends BaseEventAddOn {
  longDescription: string | null;
  event: BaseEvent;
}

export interface EventAddOnTranslation {
  id: string;
  locale: string;
  name: string;
  shortDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventReservationSection {
  id: string;
  eventId: string;
  name: string;
  price: number;
  shortDescription: string;
  sortOrder: number;
  pricePerDay: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventReservationSection extends BaseEventReservationSection {
  imageId: string | null;
  image: Image | null;
  eventId: string;
  event: BaseEvent;
  _count: {
    locations: number;
  };
}

export interface EventReservationSectionTranslation {
  id: string;
  locale: string;
  name: string;
  shortDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface BaseEventReservationSectionLocation {
  id: string;
  eventId: string;
  reservationSectionId: string;
  name: string;
  shortDescription: string;
  supply: number;
  sortOrder: number;
  premium: number;
  reservationSection: {
    name: string;
    pricePerDay: boolean;
    price: number;
    image: Image | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EventReservationSectionLocation
  extends BaseEventReservationSectionLocation {
  _count: {
    purchases: number;
  };
}

export interface EventReservationSectionLocationTranslation {
  id: string;
  locale: string;
  name: string;
  shortDescription: string;
  createdAt: string;
  updatedAt: string;
}
