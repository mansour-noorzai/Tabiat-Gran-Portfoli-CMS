import mongoose, { Schema } from "mongoose";

const LocalizedSchema = new Schema(
  { en: { type: String, default: "" }, fa: { type: String, default: "" }, ps: { type: String, default: "" } },
  { _id: false },
);

const MediaRefSchema = new Schema(
  {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
    width: Number,
    height: Number,
    format: String,
  },
  { _id: false },
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["super_admin", "admin", "editor"], default: "editor", index: true },
    isActive: { type: Boolean, default: true },
    mustChangePassword: { type: Boolean, default: false },
    avatar: { type: MediaRefSchema, default: () => ({}) },
    preferences: {
      language: { type: String, enum: ["en", "fa", "ps"], default: "en" },
      themeMode: { type: String, enum: ["light", "dark", "system"], default: "light" },
      themeColor: { type: String, default: "#696cff" },
    },
    lastLoginAt: Date,
  },
  { timestamps: true },
);

const ProjectCategorySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: LocalizedSchema, required: true },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const ProjectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, index: true },
    donor: { type: String, default: "" },
    year: { type: String, default: "" },
    location: { type: LocalizedSchema, default: () => ({}) },
    beneficiaries: { type: LocalizedSchema, default: () => ({}) },
    title: { type: LocalizedSchema, required: true },
    short: { type: LocalizedSchema, default: () => ({}) },
    description: { type: LocalizedSchema, default: () => ({}) },
    outcomes: { type: [LocalizedSchema], default: [] },
    cover: { type: MediaRefSchema, default: () => ({}) },
    gallery: { type: [MediaRefSchema], default: [] },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft", index: true },
  },
  { timestamps: true },
);

const ServiceSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    icon: { type: String, default: "leaf" },
    title: { type: LocalizedSchema, required: true },
    description: { type: LocalizedSchema, default: () => ({}) },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published", "archived"], default: "published" },
  },
  { timestamps: true },
);

const StatisticSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: String, required: true },
    label: { type: LocalizedSchema, required: true },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const PartnerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["un", "ingo", "nngo", "government", "other"], default: "other", index: true },
    logo: { type: MediaRefSchema, default: () => ({}) },
    websiteUrl: { type: String, default: "" },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const TestimonialSchema = new Schema(
  {
    quote: { type: LocalizedSchema, required: true },
    author: { type: LocalizedSchema, default: () => ({}) },
    organization: { type: LocalizedSchema, default: () => ({}) },
    photo: { type: MediaRefSchema, default: () => ({}) },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published", "archived"], default: "published" },
  },
  { timestamps: true },
);

const ContactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    organization: { type: String, default: "" },
    subject: { type: String, default: "" },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "in_progress", "replied", "archived", "spam"], default: "new", index: true },
    internalNote: { type: String, default: "" },
    sourceIp: { type: String, default: "" },
  },
  { timestamps: true },
);

const MediaSchema = new Schema(
  {
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    resourceType: { type: String, default: "image" },
    format: { type: String, default: "" },
    width: Number,
    height: Number,
    bytes: Number,
    originalFilename: { type: String, default: "" },
    folder: { type: String, default: "tabiat-gran" },
    alt: { type: LocalizedSchema, default: () => ({}) },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const SiteSettingsSchema = new Schema(
  {
    key: { type: String, default: "main", unique: true },
    company: {
      name: { type: LocalizedSchema, default: () => ({}) },
      shortName: { type: LocalizedSchema, default: () => ({}) },
      tagline: { type: LocalizedSchema, default: () => ({}) },
      establishedYear: { type: String, default: "2009" },
      registrationNumber: { type: String, default: "" },
      phonePrimary: { type: String, default: "" },
      phoneSecondary: { type: String, default: "" },
      emailGeneral: { type: String, default: "" },
      emailTenders: { type: String, default: "" },
      address: { type: LocalizedSchema, default: () => ({}) },
      workingHours: { type: LocalizedSchema, default: () => ({}) },
      provincialOffices: { type: LocalizedSchema, default: () => ({}) },
      social: { type: Schema.Types.Mixed, default: {} },
      logo: { type: MediaRefSchema, default: () => ({}) },
      favicon: { type: MediaRefSchema, default: () => ({}) },
    },
    homepage: {
      hero: {
        badge: { type: LocalizedSchema, default: () => ({}) },
        title1: { type: LocalizedSchema, default: () => ({}) },
        title2: { type: LocalizedSchema, default: () => ({}) },
        subtitle: { type: LocalizedSchema, default: () => ({}) },
        cta1: { type: LocalizedSchema, default: () => ({}) },
        cta2: { type: LocalizedSchema, default: () => ({}) },
        image: { type: MediaRefSchema, default: () => ({}) },
      },
      about: {
        kicker: { type: LocalizedSchema, default: () => ({}) },
        titlePrefix: { type: LocalizedSchema, default: () => ({}) },
        title: { type: LocalizedSchema, default: () => ({}) },
        paragraph1: { type: LocalizedSchema, default: () => ({}) },
        paragraph2: { type: LocalizedSchema, default: () => ({}) },
        image1: { type: MediaRefSchema, default: () => ({}) },
        image2: { type: MediaRefSchema, default: () => ({}) },
      },
    },
    navigation: { type: Schema.Types.Mixed, default: {} },
    footer: { type: Schema.Types.Mixed, default: {} },
    seo: {
      title: { type: LocalizedSchema, default: () => ({}) },
      description: { type: LocalizedSchema, default: () => ({}) },
      keywords: { type: String, default: "" },
      ogImage: { type: MediaRefSchema, default: () => ({}) },
    },
  },
  { timestamps: true },
);

const AuditLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    userName: { type: String, default: "System" },
    action: { type: String, required: true, index: true },
    resource: { type: String, required: true, index: true },
    resourceId: { type: String, default: "" },
    details: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

function model(name: string, schema: Schema) {
  return mongoose.models[name] || mongoose.model(name, schema);
}

export const User = model("User", UserSchema);
export const ProjectCategory = model("ProjectCategory", ProjectCategorySchema);
export const Project = model("Project", ProjectSchema);
export const Service = model("Service", ServiceSchema);
export const Statistic = model("Statistic", StatisticSchema);
export const Partner = model("Partner", PartnerSchema);
export const Testimonial = model("Testimonial", TestimonialSchema);
export const ContactMessage = model("ContactMessage", ContactMessageSchema);
export const Media = model("Media", MediaSchema);
export const SiteSettings = model("SiteSettings", SiteSettingsSchema);
export const AuditLog = model("AuditLog", AuditLogSchema);
