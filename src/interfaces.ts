export interface BaseAccount {
  organizationId: true;
  id: true;
  accountType: true;
  firstName: true;
  lastName: true;
  email: true;
  verified: true;
  username: true;
  imageId: true;
  image: Image;
  featured: true;
  timezone: true;
  internalRefId: true;
}

export interface Account extends BaseAccount {
  phone: true;
  interests: BaseInterest;
  title: true;
  company: true;
  bio: true;
  website: true;
  facebook: true;
  twitter: true;
  instagram: true;
  linkedIn: true;
  tikTok: true;
  video: true;
  youtube: true;
  dietaryRestrictions: true;
  address1: true;
  address2: true;
  city: true;
  state: true;
  country: true;
  zip: true;
  accountTiers: BaseAccountTier;
  createdAt: true;
  updatedAt: true;
}

export interface AccountShare extends Account {
  _count: undefined;
}

export interface BaseAccountTier {
  id: true;
  slug: true;
  name: true;
  color: true;
  priority: true;
  internal: true;
}

export interface AccountTier extends BaseAccountTier {
  iconName: true;
  imageId: true;
  image: BaseImage;
  description: true;
  createdAt: true;
  updatedAt: true;
  _count: {
    accounts: number;
  };
}

export interface BaseActivationCompletion {
  id: true;
  eventId: true;
  eventActivationId: true;
  eventActivation: BaseActivation;
  earnedPoints: true;
}

export interface ActivationCompletion extends BaseActivationCompletion {
  accountId: true;
  account: BaseAccount;
  createdAt: true;
  updatedAt: true;
}

export interface BaseActivation {
  id: true;
  slug: true;
  name: true;
  shortDescription: true;
  maxPoints: true;
  startAfter: true;
  protected: true;
}

export interface Activation extends BaseActivation {
  eventId: true;
  event: BaseEvent;
  managerId: true;
  manager: BaseAccount;
  imageId: true;
  image: BaseImage;
  protectionCode: true;
  longDescription: true;
  createdAt: true;
  updatedAt: true;
}

export interface ActivationTranslation {
  id: true;
  locale: true;
  name: true;
  shortDescription: true;
  longDescription: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseActivity {
  id: true;
  message: true;
  html: true;
  text: true;
  readMore: true;
  linkPreview: BaseLinkPreview;
  giphyId: true;
  image: BaseImage;
  imageId: true;
  account: BaseAccount;
  group: BaseGroup;
  event: BaseEvent;
  content: BaseContent;
  interests: BaseInterest;
  interestsId: true;
  createdAt: true;
  updatedAt: true;
  _count: {
    likes: number;
    comments: number;
    reshares: number;
    interests: number;
  };
}

export interface Activity extends BaseActivity {
  html: true;
  text: true;
  messageExtended: true;
}

export interface Advertisement {
  id: true;
  organizationId: true;
  advertisementId: true;
  advertisement: BaseAdvertisement;
  accountId: true;
  account: BaseAccount;
  createdAt: true;
  updatedAt: true;
}

export interface BaseAdvertisement {
  id: true;
  type: true;
  link: true;
  title: true;
  description: true;
  imageId: true;
  image: BaseImage;
  startDate: true;
  endDate: true;
  weight: true;
}

export interface Advertisement extends BaseAdvertisement {
  accountId: true;
  account: BaseAccount;
  eventId: true;
  event: BaseEvent;
  eventOnly: true;
  createdAt: true;
  updatedAt: true;
  _count: {
    views: number;
    clicks: number;
  };
}

export interface AdvertisementView {
  id: true;
  organizationId: true;
  advertisementId: true;
  advertisement: Advertisement;
  accountId: true;
  account: Account;
  createdAt: true;
  updatedAt: true;
}

export interface BaseAnnouncement {
  id: true;
  slug: true;
  title: true;
  email: true;
  push: true;
  sms: true;
}

export interface Announcement extends BaseAnnouncement {
  _count: {
    notifications: number;
  };
  verifiedAccounts: true;
  account: BaseAccount;
  accountId: true;
  creator: BaseAccount;
  creatorId: true;
  event: BaseEvent;
  eventId: true;
  group: BaseGroup;
  groupId: true;
  sponsorshipLevelId: true;
  sponsorshipLevel: BaseSponsorship;
  ticketId: true;
  ticket: BaseTicket;
  userId: true;
  user: BaseUser;
  html: true;
  message: true;
  updatedAt: true;
  createdAt: true;
}

export interface BenefitClick {
  id: true;
  benefitId: true;
  benefit: BaseBenefit;
  accountId: true;
  account: BaseAccount;
  createdAt: true;
  updatedAt: true;
}

export interface BaseBenefit {
  id: true;
  slug: true;
  link: true;
  imageId: true;
  image: BaseImage;
  title: true;
  description: true;
  startDate: true;
  endDate: true;
  priority: true;
}

export interface Benefit extends BaseBenefit {
  managerId: true;
  manager: BaseAccount;
  eventId: true;
  event: BaseEvent;
  eventOnly: true;
  createdAt: true;
  updatedAt: true;
  _count: {
    clicks: number;
  };
}

export interface BenefitTranslation {
  id: true;
  locale: true;
  title: true;
  description: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseContent {
  id: true;
  slug: true;
  featured: true;
  status: true;
  published: true;
  visible: true;
  title: true;
  description: true;
  duration: true;
  contentTypeId: true;
  contentType: BaseContentType;
}

export interface Content extends BaseContent {
  body: true;
  imageUrl: true;
  audioUrl: true;
  videoUrl: true;
  externalUrl: true;
  appleUrl: true;
  spotifyUrl: true;
  googleUrl: true;
  youtubeUrl: true;
  authors: BaseAccount;
  mentions: BaseAccount;
  createdAt: true;
  updatedAt: true;
}

export interface ContentTranslation {
  id: true;
  locale: true;
  title: true;
  description: true;
  body: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseContentType {
  id: true;
  slug: true;
  name: true;
  description: true;
  priority: true;
  visible: true;
  format: true;
  imageId: true;
  image: BaseImage;
}

export interface ContentType extends BaseContentType {
  externalUrl: true;
  appleUrl: true;
  spotifyUrl: true;
  googleUrl: true;
  youtubeUrl: true;
  createdAt: true;
  updatedAt: true;
  hosts: BaseAccount;
  _count: {
    subscribers: true;
    contents: true;
  };
}

export interface ContentTypeTranslation {
  id: true;
  locale: true;
  name: true;
  description: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseCoupon {
  id: true;
  code: true;
  description: true;
  active: true;
  startDate: true;
  endDate: true;
  discountAmount: true;
  discountPercent: true;
  quantityMin: true;
  quantityMax: true;
  amountMin: true;
  amountMax: true;
  useLimit: true;
  emailDomains: true;
}

export interface Coupon extends BaseCoupon {
  ticketId: true;
  ticket: BaseTicket;
  managerId: true;
  manager: BaseAccount;
  createdAt: true;
  updatedAt: true;
  _count: {
    registrations: true;
  };
}

export interface BaseEmailReceipt {
  id: true;
  status: true;
  from: true;
  to: true;
  replyTo: true;
  subject: true;
  account: BaseAccount;
  createdAt: true;
  updatedAt: true;
}

export interface EmailReceipt extends BaseEmailReceipt {
  html: true;
  text: true;
  debug: true;
}

export interface BaseEventAddOn {
  id: true;
  name: true;
  shortDescription: true;
  supply: true;
  price: true;
  sortOrder: true;
  minReservationStart: true;
  reservationStart: true;
  maxReservationStart: true;
  minReservationEnd: true;
  reservationEnd: true;
  maxReservationEnd: true;
  imageId: true;
  image: BaseImage;
  eventId: true;
  createdAt: true;
  updatedAt: true;
  _count: {
    purchases: true;
  };
}

export interface EventAddOn extends BaseEventAddOn {
  longDescription: true;
  event: BaseEvent;
}

export interface EventAddOnTranslation {
  id: true;
  locale: true;
  name: true;
  shortDescription: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseEventEmail {
  type: true;
  eventId: true;
  body: true;
  replyTo: true;
  enabled: true;
}

export interface EventEmail extends BaseEventEmail {
  createdAt: true;
  updatedAt: true;
}

export interface EventListing {}

export interface BaseEventOnSiteBadgeField {
  id: true;
  eventId: true;
  name: true;
  type: true;
  lookup: true;
  maxLength: true;
  defaultValue: true;
  transformation: true;
  sortOrder: true;
  createdAt: true;
  updatedAt: true;
}

export interface EventOnSiteBadgeField extends BaseEventOnSiteBadgeField {
  onSite: EventOnSite;
}

export interface BaseEventOnSite {
  eventId: true;
  authenticationCode: true;
  zplTemplate: true;
  createdAt: true;
  updatedAt: true;
}

export interface EventOnSite extends BaseEventOnSite {
  badgeFields: BaseEventOnSiteBadgeField[];
}

export interface BaseEventPage {
  id: true;
  slug: true;
  title: true;
  subtitle: true;
  sortOrder: true;
}

export interface EventPage extends BaseEventPage {
  html: true;
  createdAt: true;
  updatedAt: true;
}

export interface EventPageTranslation {
  id: true;
  locale: true;
  title: true;
  subtitle: true;
  html: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseEvent {
  id: true;
  slug: true;
  internalRefId: true;
  featured: true;
  visible: true;
  approved: true;
  source: true;
  eventType: true;
  name: true;
  shortDescription: true;
  eventStart: true;
  eventEnd: true;
  timezone: true;
  externalUrl: true;
  location: true;
  address1: true;
  address2: true;
  city: true;
  state: true;
  country: true;
  zip: true;
  imageId: true;
  registration: true;
  registrationStart: true;
  registrationEnd: true;
  image: BaseImage;
}

export interface Event extends BaseEvent {
  longDescription: true;
  meetingUrl: true;
  venue: true;
  venueMap: BaseImage;
  venueMapId: true;
  creatorId: true;
  creator: BaseAccount;
  registrationLimit: true;
  publicRegistrants: true;
  inviteOnly: true;
  sessionsVisible: true;
  speakersVisible: true;
  checkinCode: true;
  iosAppLink: true;
  androidAppLink: true;
  newActivityCreatorEmailNotification: true;
  newActivityCreatorPushNotification: true;
  seriesId: true;
  series: BaseSeries;
  streamInput: BaseStreamInput;
  streamReplayId: true;
  streamReplay: BaseVideo;
  groupId: true;
  group: BaseGroup;
  groupOnly: true;
  createdAt: true;
  updatedAt: true;
}

export interface EventTranslation {
  id: true;
  locale: true;
  name: true;
  shortDescription: true;
  longDescription: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseFaqSection {
  id: true;
  slug: true;
  name: true;
  priority: true;
}

export interface FaqSection extends BaseFaqSection {
  faqs: BaseFaqSection;
  eventId: true;
  event: BaseEvent;
  createdAt: true;
  updatedAt: true;
}

export interface FaqSectionTranslation {
  id: true;
  locale: true;
  name: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseFaqSection {
  id: true;
  slug: true;
  visible: true;
  question: true;
  answer: true;
}

export interface FaqSection extends BaseFaqSection {
  priority: true;
  organizationId: true;
  eventId: true;
  sectionId: true;
  section: BaseFaqSection;
  createdAt: true;
  updatedAt: true;
}

export interface FaqTranslation {
  id: true;
  locale: true;
  question: true;
  answer: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseGroupInvitation {
  id: true;
  status: true;
  groupId: true;
  accountId: true;
  inviterId: true;
  createdAt: true;
  updatedAt: true;
}

export interface GroupInvitation extends BaseGroupInvitation {
  group: BaseGroup;
  account: BaseAccount;
  inviter: BaseAccount;
}

export interface BaseGroupMembership {
  accountId: true;
  account: BaseAccount;
  groupId: true;
  group: BaseGroup;
  role: true;
}

export interface GroupMembership extends BaseGroupMembership {
  announcementEmailNotification: true;
  announcementPushNotification: true;
  activityEmailNotification: true;
  activityPushNotification: true;
  eventEmailNotification: true;
  eventPushNotification: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseGroupRequest {
  id: true;
  status: true;
  groupId: true;
  accountId: true;
  createdAt: true;
  updatedAt: true;
}

export interface GroupRequest extends BaseGroupRequest {
  group: BaseGroup;
  account: BaseAccount;
}

export interface BaseGroup {
  id: true;
  slug: true;
  name: true;
  active: true;
  access: true;
  description: true;
  featured: true;
  imageId: true;
  image: BaseImage;
}

export interface Group extends BaseGroup {
  externalUrl: true;
  createdAt: true;
  updatedAt: true;
  _count: {
    members: number;
    interests: number;
    events: number;
  };
}

export interface GroupTranslation {
  id: true;
  locale: true;
  name: true;
  description: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseImage {
  id: true;
  uri: true;
  width: true;
  height: true;
}

export interface Image extends BaseImage {
  name: true;
  type: true;
  description: true;
  moderation: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseImportItem {
  id: true;
  importId: true;
  values: true;
  status: true;
  message: true;
  debug: true;
  createdAt: true;
  updatedAt: true;
}

export interface ImportItem extends BaseImportItem {
  import: BaseImport;
}

export interface BaseImport {
  id: true;
  type: true;
  overwrite: true;
  userId: true;
  createdAt: true;
  updatedAt: true;
}

export interface Import extends BaseImport {
  user: BaseUser;
  _count: {
    items: number;
  };
}

export interface BaseIntegrations {
  chat42: true;
  evolve: true;
  ghost: true;
  ghostUrl: true;
}

export interface Integrations extends BaseIntegrations {}

export interface BaseInterest {
  id: true;
  featured: true;
  name: true;
  image: BaseImage;
  imageId: true;
}

export interface Interest extends BaseInterest {
  createdAt: true;
  updatedAt: true;
  _count: {
    accounts: number;
    groups: number;
    activities: number;
  };
}

export interface BaseInvoiceLineItem {
  id: true;
  name: true;
  description: true;
  quantity: true;
  amount: true;
  createdAt: true;
  updatedAt: true;
}

export interface InvoiceLineItem extends BaseInvoiceLineItem {
  invoiceId: true;
  invoice: BaseInvoice;
}

export interface BaseInvoice {
  alternateId: true;
  dueDate: true;
  id: true;
  sentDate: true;
  status: true;
  title: true;
}

export interface Invoice extends BaseInvoice {
  lineItems: BaseInvoiceLineItem;
  payments: BaseRegistrationPayment;
  notes: true;
  accountId: true;
  account: BaseAccount;
  createdAt: true;
  updatedAt: true;
}

export interface BaseLike {
  activity: BaseActivity;
  account: BaseAccount;
}

export interface Like extends BaseLike {
  createdAt: true;
  updatedAt: true;
}

export interface BaseLinkPreview {
  url: true;
  siteName: true;
  title: true;
  description: true;
  image: true;
  imageWidth: true;
  imageHeight: true;
  imageType: true;
  favicon: true;
}

export interface LinkPreview extends BaseLinkPreview {}

export interface NotificationPreferences {
  newFollowerPush: true;
  newFollowerEmail: true;
  likePush: true;
  resharePush: true;
  commentPush: true;
  commentEmail: true;
  transferPush: true;
  transferEmail: true;
  supportTicketConfirmationEmail: true;
  eventAnnouncementEmail: true;
  eventAnnouncementPush: true;
}

export interface BaseNotification {
  id: true;
  type: true;
  read: true;
  receiverId: true;
  receiver: BaseAccount;
  senderId: true;
  sender: BaseAccount;
}

export interface Notification extends BaseNotification {
  transfer: BaseTransfer;
  like: BaseLike;
  activity: BaseActivity;
  event: BaseEvent;
  announcement: BaseAnnouncement;
  createdAt: true;
  updatedAt: true;
}

export interface OrgMembership {
  organizationId: true;
  userId: true;
  user: BaseUser;
  org: true;
  users: true;
  accounts: true;
  activities: true;
  advertisements: true;
  announcements: true;
  // channels: true,
  groups: true;
  contentTypes: true;
  contents: true;
  coupons: true;
  events: true;
  registrations: true;
  storage: true;
  interests: true;
  levels: true;
  purchases: true;
  sponsorships: true;
  supportTickets: true;
  benefits: true;
  streams: true;
  reports: true;
  subscriptions: true;
  invoices: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseOrganization {
  id: true;
  slug: true;
  name: true;
  logo: BaseImage;
  logoId: true;
  website: true;
}

export interface Organization {
  email: true;
  phone: true;
  address1: true;
  address2: true;
  city: true;
  state: true;
  country: true;
  zip: true;
  primaryColor: true;
  secondaryColor: true;
  currency: true;
  facebook: true;
  twitter: true;
  instagram: true;
  linkedIn: true;
  tikTok: true;
  youtube: true;
  discord: true;
  timezone: true;
  iosAppLink: true;
  androidAppLink: true;
  createdAt: true;
  updatedAt: true;
  integrations: Integrations;
}

export interface OrganizationTrigger {
  code: true;
  type: true;
  enabled: true;
  createdAt: true;
  updatedAt: true;
}

export interface BasePage {
  title: true;
  subtitle: true;
}

export interface Page {
  html: true;
  createdAt: true;
  updatedAt: true;
}

export interface PageTranslation {
  id: true;
  locale: true;
  title: true;
  html: true;
  createdAt: true;
  updatedAt: true;
}

export interface BasePurchase {
  id: true;
  alternateId: true;
  ticketId: true;
  ticket: BaseTicket;
  location: true;
  usedAt: true;
  firstName: true;
  lastName: true;
  email: true;
  transfer: { id: true; email: true; createdAt: true };
  responses: BaseRegistrationQuestionResponse;
  paid: true;
  reservationStart: true;
  reservationEnd: true;
  reservationSectionLocation: BaseReservationSectionLocation;
  createdAt: true;
  updatedAt: true;
}

export interface Purchase extends BasePurchase {
  addOns: BaseEventAddOn;
  registrationId: true;
  registration: BaseRegistration;
}

export interface PushDevice {
  id: true;
  accountId: true;
  account: BaseAccount;
  name: true;
  model: true;
  brand: true;
  osName: true;
  osVersion: true;
  deviceYearClass: true;
  manufacturer: true;
  supportedCpuArchitectures: true;
  totalMemory: true;
  appType: true;
  pushService: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseRegistrationBypass {
  id: true;
  accountId: true;
  closed: true;
  preRegister: true;
  postRegister: true;
  createdAt: true;
  updatedAt: true;
}

export interface RegistrationBypass {
  account: BaseAccount;
}

export interface BaseRegistrationPayment {
  id: true;
  type: true;
  chargedAmt: true;
  ticketId: true;
  ticket: BaseTicket;
  stripeId: true;
  last4: true;
  debugId: true;
  createdAt: true;
}

export interface RegistrationPayment extends BaseRegistrationPayment {
  bypassedBy: BaseUser;
  integration: {
    type: true;
  };
  subscription: BaseSubscription;
}

export interface BaseRegistrationQuestionChoice {
  id: true;
  value: true;
  text: true;
  description: true;
  supply: true;
  sortOrder: true;
  subQuestions: {
    questionId: true;
  };
}

export interface RegistrationQuestionChoice
  extends BaseRegistrationQuestionChoice {
  questionId: true;
  question: BaseRegistrationQuestion;
  subQuestions: BaseRegistrationQuestionChoiceSubQuestion;
  createdAt: true;
  updatedAt: true;
}

export interface BaseRegistrationQuestionChoiceSubQuestion {
  choiceId: true;
  choice: BaseRegistrationQuestionChoice;
  questionId: true;
  question: BaseRegistrationQuestion;
}

export interface RegistrationQuestionChoiceSubQuestion
  extends BaseRegistrationQuestionChoiceSubQuestion {
  sortOrder: true;
  createdAt: true;
  updatedAt: true;
}

export interface RegistrationQuestionChoiceTranslation {
  id: true;
  locale: true;
  value: true;
  text: true;
  description: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseRegistrationQuestionResponseChange {
  id: true;
  newValue: true;
  oldValue: true;
  eventId: true;
  questionId: true;
  responseId: true;
  userId: true;
  createdAt: true;
}

export interface RegistrationQuestionResponseChange
  extends BaseRegistrationQuestionResponseChange {
  response: BaseRegistrationQuestionResponse;
  user: BaseUser;
}

export interface BaseRegistrationQuestionResponse {
  id: true;
  value: true;
  questionId: true;
  question: BaseRegistrationQuestion;
}

export interface RegistrationQuestionResponse
  extends BaseRegistrationQuestionResponse {
  changeLogs: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseRegistrationQuestionSearchValue {
  id: true;
  value: true;
}

export interface RegistrationQuestionSearchValue
  extends BaseRegistrationQuestionSearchValue {
  createdAt: true;
}

export interface BaseRegistrationQuestion {
  id: true;
  eventId: true;
  type: true;
  name: true;
  required: true;
  description: true;
  label: true;
  placeholder: true;
  default: true;
  span: true;
  mutable: true;
  min: true;
  max: true;
  validation: true;
  validationMessage: true;
  sortOrder: true;
  featured: true;
  choices: BaseRegistrationQuestionChoice;
}

export interface RegistrationQuestion extends BaseRegistrationQuestion {
  _count: {
    sections: true;
  };
  createdAt: true;
  updatedAt: true;
}

export interface RegistrationQuestionTranslation {
  id: true;
  locale: true;
  label: true;
  placeholder: true;
  description: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseRegistrationSectionQuestion {
  sectionId: true;
  section: BaseRegistrationSection;
  questionId: true;
  question: BaseRegistrationQuestion;
  sortOrder: true;
}

export interface RegistrationSectionQuestion
  extends BaseRegistrationSectionQuestion {
  createdAt: true;
  updatedAt: true;
}

export interface BaseRegistrationSection {
  id: true;
  eventId: true;
  name: true;
  description: true;
  sortOrder: true;
  _count: {
    questions: number;
  };
}

export interface RegistrationSection extends BaseRegistrationSection {
  questions: RegistrationSectionQuestion;
  eventTickets: BaseTicket;
  accountTiers: AccountTier;
  createdAt: true;
  updatedAt: true;
}

export interface RegistrationSectionTranslation {
  id: true;
  locale: true;
  name: true;
  description: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseRegistration {
  id: true;
  alternateId: true;
  status: true;
  accountId: true;
  account: BaseAccount;
}

export interface Registration extends BaseRegistration {
  eventId: true;
  event: BaseEvent;
  statusChanges: {
    orderBy: { createdAt: "desc" };
  };
  payments: BaseRegistrationPayment;
  co2uponId: true;
  coupon: BaseCoupon;
  purchases: BasePurchase;
  createdAt: true;
  updatedAt: true;
}

export interface ReportParent {
  id: true;
  name: true;
  description: true;
  type: true;
  createdAt: true;
  updatedAt: true;
}

export interface Report {
  id: true;
  name: true;
  description: true;
  columns: true;
  filters: true;
  charts: true;
  advancedFilter: true;
  parentId: true;
  parent: ReportParent;
  eventId: true;
  event: BaseEvent;
  user: BaseUser;
  createdAt: true;
  updatedAt: true;
}

export interface BaseReservationSectionLocation {
  id: true;
  eventId: true;
  reservationSectionId: true;
  name: true;
  shortDescription: true;
  supply: true;
  sortOrder: true;
  premium: true;
  reservationSection: BaseReservationSection;
  createdAt: true;
  updatedAt: true;
}

export interface ReservationSectionLocation
  extends BaseReservationSectionLocation {
  _count: {
    purchases: number;
  };
}

export interface ReservationSectionLocationTranslation {
  id: true;
  locale: true;
  name: true;
  shortDescription: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseReservationSection {
  id: true;
  eventId: true;
  name: true;
  price: true;
  shortDescription: true;
  pricePerDay: true;
  sortOrder: true;
  createdAt: true;
  updatedAt: true;
}

export interface ResercationSection extends BaseReservationSection {
  eventId: true;
  event: BaseEvent;
  imageId: true;
  image: BaseImage;
  _count: {
    locations: number;
  };
}

export interface ResercationSectionTranslation {
  id: true;
  locale: true;
  name: true;
  shortDescription: true;
  createdAt: true;
  updatedAt: true;
}

export interface Self extends Account {}

export interface BaseSeries {
  id: true;
  slug: true;
  name: true;
  description: true;
  imageId: true;
  image: BaseImage;
}

export interface Series extends BaseSeries {
  sortOrder: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseSession {
  id: true;
  slug: true;
  name: true;
  description: true;
  longDescription: true;
  location: true;
  imageId: true;
  image: BaseImage;
  startTime: true;
  endTime: true;
  sortOrder: true;
  tracks: BaseTrack;
  nonSession: true;
  visible: true;
  createdAt: true;
  updatedAt: true;
}

export interface Session extends BaseSession {
  eventId: true;
  event: BaseEvent;
  speakers: BaseSpeaker;
  streamInput: BaseStreamInput;
}

export interface SesionTranslation {
  id: true;
  locale: true;
  name: true;
  description: true;
  longDescription: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseSpeaker {
  id: true;
  slug: true;
  firstName: true;
  lastName: true;
  fullName: true;
  bio: true;
  title: true;
  company: true;
  companyBio: true;
  label: true;
  imageId: true;
  image: BaseImage;
  visible: true;
}

export interface Speaker {
  sessions: BaseSession;
  eventId: true;
  event: BaseEvent;
  isHost: true;
  priority: true;
  website: true;
  facebook: true;
  twitter: true;
  instagram: true;
  linkedIn: true;
  tikTok: true;
  createdAt: true;
  updatedAt: true;
}

export interface SpeakerTranslation {
  id: true;
  locale: true;
  title: true;
  bio: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseSponsorship {
  id: true;
  slug: true;
  name: true;
  subtitle: true;
  description: true;
  color: true;
  scale: true;
  imageId: true;
  image: BaseImage;
}

export interface SponsorshipLevel extends BaseSponsorship {
  sortOrder: true;
  createdAt: true;
  updatedAt: true;
}

export interface SponsorshipLevelTranslation {
  id: true;
  locale: true;
  name: true;
  subtitle: true;
  description: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseStreamInput {
  id: true;
  name: true;
  sortOrder: true;
  cloudflareId: true;
  connected: true;
}

export interface StreamInput extends BaseStreamInput {
  eventId: true;
  event: BaseEvent;
  sessionId: true;
  session: BaseSession;
  createdAt: true;
}

export interface BaseSubscriptionProductPrice {
  id: true;
  active: true;
  amount: true;
  currency: true;
  interval: true;
  intervalCount: true;
  maxAmount: true;
  minAmount: true;
  type: true;
}

export interface SubscriptionProductPrice extends BaseSubscriptionProductPrice {
  subscriptionProduct: BaseSubscriptionProduct;
  createdAt: true;
  updatedAt: true;
}

export interface BaseSubscriptionProduct {
  id: true;
  active: true;
  name: true;
  description: true;
}

export interface SubscriptionProduct extends BaseSubscriptionProduct {
  statementDescriptor: true;
  features: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseSubscription {
  id: true;
  status: true;
  expiresAt: true;
  cancelAtEnd: true;
  integrationId: true;
  subscriptionProduct: BaseSubscriptionProduct;
}

export interface Subscription extends BaseSubscription {
  accountId: true;
  account: BaseAccount;
  priceId: true;
  price: BaseSubscriptionProductPrice;
  createdAt: true;
  updatedAt: true;
}

export interface BaseSupportTicketNote {
  id: true;
  userId: true;
  user: BaseUser;
  text: true;
}

export interface SupportTicketNote extends BaseSupportTicketNote {
  supportTicketId: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseSupportTicket {
  id: true;
  type: true;
  email: true;
  request: true;
  status: true;
}

export interface SupportTicket extends BaseSupportTicket {
  accountId: true;
  account: BaseAccount;
  eventId: true;
  event: BaseEvent;
  notes: BaseSupportTicketNote;
  createdAt: true;
  updatedAt: true;
}

export interface BaseTeamMember {
  id: true;
  slug: true;
  priority: true;
  firstName: true;
  lastName: true;
  nickName: true;
  title: true;
  startDate: true;
  imageId: true;
  image: BaseImage;
}

export interface TeamMember extends BaseTeamMember {
  email: true;
  phone: true;
  bio: true;
  linkedIn: true;
  facebook: true;
  instagram: true;
  twitter: true;
  tikTok: true;
  discord: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseTicket {
  id: true;
  slug: true;
  active: true;
  transferable: true;
  visibility: true;
  name: true;
  shortDescription: true;
  longDescription: true;
  price: true;
  accessLevel: true;
  featuredImageId: true;
  featuredimage: BaseImage;
  supply: true;
  minQuantityPerSale: true;
  maxQuantityPerSale: true;
  limitPerAccount: true;
  emailDomains: true;
  sortOrder: true;
  allowedTiers: BaseAccountTier[];
  minReservationStart: true;
  reservationStart: true;
  maxReservationStart: true;
  minReservationEnd: true;
  reservationEnd: true;
  maxReservationEnd: true;
  createdAt: true;
  updatedAt: true;
}

export interface Ticket extends BaseTicket {
  event: BaseEvent;
  _count: {
    purchases: number;
  };
}

export interface TicketTranslation {
  id: true;
  locale: true;
  name: true;
  shortDescription: true;
  longDescription: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseTrack {
  id: true;
  slug: true;
  name: true;
  description: true;
  color: true;
}

export interface Track extends BaseTrack {
  createdAt: true;
  updatedAt: true;
  _count: {
    sessions: number;
  };
}

export interface TrackTranslation {
  id: true;
  locale: true;
  name: true;
  description: true;
  createdAt: true;
  updatedAt: true;
}

export interface BaseTransferLog {
  id: true;
  fromRegistrationId: true;
  fromRegistration: BaseRegistration;
  toRegistrationId: true;
  toRegistration: BaseRegistration;
}

export interface TransferLog extends BaseTransferLog {
  purchaseId: true;
  purchase: BasePurchase;
  userId: true;
  user: BaseUser;
  createdAt: true;
}

export interface BaseTransfer {
  id: true;
  email: true;
  purchaseId: true;
  purchase: BasePurchase;
}

export interface Transfer extends BaseTransfer {
  createdAt: true;
  updatedAt: true;
}

export interface BaseUser {
  id: true;
  email: true;
  firstName: true;
  lastName: true;
  phone: true;
  title: true;
}

export interface User extends BaseUser {
  createdAt: true;
  updatedAt: true;
}

export interface BaseVideo {
  id: true;
  width: true;
  height: true;
  thumbnailUrl: true;
  previewUrl: true;
  readyToStream: true;
}

export interface Video extends BaseVideo {
  name: true;
  status: true;
  source: true;
  hlsUrl: true;
  dashUrl: true;
  thumbnailPct: true;
  duration: true;
  createdAt: true;
}
