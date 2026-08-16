import "dotenv/config";
import { createHash } from "node:crypto";
import { connectDb } from "../lib/db";
import { getCloudinary } from "../lib/cloudinary";
import {
  Media,
  Partner,
  Project,
  ProjectCategory,
  Service,
  SiteSettings,
  Statistic,
  Testimonial,
} from "../models";
import { ABOUT_IMAGE, ABOUT_IMAGE_2, HERO_IMAGE, partners, projects, stats } from "../site/data";
import { baseDicts } from "../site/i18n";

const langs = ["en", "fa", "ps"] as const;
const localized = (key: string) => Object.fromEntries(langs.map((lang) => [lang, baseDicts[lang][key] || ""]));
const migrateLegacyMedia = process.env.MIGRATE_LEGACY_MEDIA !== "false";
const mediaCache = new Map<string, any>();

async function migrateMedia(remoteUrl: string) {
  if (!remoteUrl) return { url: "" };
  if (!migrateLegacyMedia) return { url: remoteUrl };
  const cached = mediaCache.get(remoteUrl);
  if (cached) return cached;

  const cloudinary = getCloudinary();
  const publicId = `legacy-${createHash("sha1").update(remoteUrl).digest("hex").slice(0, 20)}`;
  const result = await cloudinary.uploader.upload(remoteUrl, {
    folder: "tabiat-gran/legacy",
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
  });
  const ref = {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
  };
  mediaCache.set(remoteUrl, ref);
  await Media.findOneAndUpdate(
    { publicId: result.public_id },
    {
      url: result.url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      originalFilename: result.original_filename || publicId,
      folder: "tabiat-gran/legacy",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  return ref;
}

async function main() {
  await connectDb();

  const categorySlugs = ["crops", "water", "horti", "livestock", "training", "value"];
  for (const [displayOrder, slug] of categorySlugs.entries()) {
    await ProjectCategory.updateOne(
      { slug },
      { $set: { slug, name: localized(`cat.${slug}`), displayOrder, active: true } },
      { upsert: true },
    );
  }

  for (const [source, displayOrder] of projects.map((project, index) => [project, index] as const)) {
    const cover = await migrateMedia(source.cover);
    const gallery = await Promise.all(source.gallery.map(migrateMedia));
    await Project.updateOne(
      { slug: source.id },
      {
        $set: {
          slug: source.id,
          category: source.category,
          donor: source.donor,
          location: source.location,
          year: source.year,
          beneficiaries: source.beneficiaries,
          title: source.title,
          short: source.short,
          description: source.description,
          outcomes: source.outcomes,
          cover,
          gallery,
          status: "published",
          displayOrder,
        },
      },
      { upsert: true },
    );
  }

  for (let index = 1; index <= 6; index += 1) {
    await Service.updateOne(
      { slug: `service-${index}` },
      {
        $set: {
          slug: `service-${index}`,
          icon: `s${index}`,
          title: localized(`s${index}.t`),
          description: localized(`s${index}.d`),
          displayOrder: index - 1,
          status: "published",
        },
      },
      { upsert: true },
    );
  }

  for (const [item, displayOrder] of stats.map((stat, index) => [stat, index] as const)) {
    const key = item.key.replace("stats.", "");
    await Statistic.updateOne(
      { key },
      { $set: { key, value: item.value, label: localized(item.key), displayOrder, active: true } },
      { upsert: true },
    );
  }

  const partnerRows = [
    ...partners.un.map((name, displayOrder) => ({ name, type: "un", displayOrder })),
    ...partners.ingo.map((name, displayOrder) => ({ name, type: "ingo", displayOrder })),
    ...partners.nngo.map((name, displayOrder) => ({ name, type: "nngo", displayOrder })),
  ];
  for (const row of partnerRows) {
    await Partner.updateOne({ name: row.name }, { $set: { ...row, active: true } }, { upsert: true });
  }

  for (let index = 1; index <= 3; index += 1) {
    const quote = localized(`t${index}.q`);
    const author = localized(`t${index}.a`);
    await Testimonial.updateOne(
      { "quote.en": quote.en },
      {
        $set: {
          quote,
          author,
          organization: { en: "", fa: "", ps: "" },
          displayOrder: index - 1,
          status: "published",
        },
      },
      { upsert: true },
    );
  }

  const [heroImage, aboutImage1, aboutImage2] = await Promise.all([
    migrateMedia(HERO_IMAGE),
    migrateMedia(ABOUT_IMAGE),
    migrateMedia(ABOUT_IMAGE_2),
  ]);

  await SiteSettings.findOneAndUpdate(
    { key: "main" },
    {
      $set: {
        key: "main",
        company: {
          name: localized("brand.full"),
          shortName: localized("brand.name"),
          tagline: localized("brand.tag"),
          establishedYear: "2009",
          phonePrimary: "+93 700 123 456",
          phoneSecondary: "+93 780 987 654",
          emailGeneral: "info@tabiatgran.af",
          emailTenders: "tenders@tabiatgran.af",
          address: localized("contact.addressv"),
          workingHours: localized("contact.hoursv"),
          provincialOffices: localized("contact.officesv"),
          social: {},
          logo: {},
          favicon: {},
        },
        homepage: {
          hero: {
            badge: localized("hero.badge"),
            title1: localized("hero.title1"),
            title2: localized("hero.title2"),
            subtitle: localized("hero.sub"),
            cta1: localized("hero.cta1"),
            cta2: localized("hero.cta2"),
            image: heroImage,
          },
          about: {
            kicker: localized("about.kicker"),
            titlePrefix: localized("about.title1i"),
            title: localized("about.title"),
            paragraph1: localized("about.p1"),
            paragraph2: localized("about.p2"),
            image1: aboutImage1,
            image2: aboutImage2,
          },
        },
        navigation: {
          labels: {
            home: localized("nav.home"),
            about: localized("nav.about"),
            services: localized("nav.services"),
            projects: localized("nav.projects"),
            partners: localized("nav.partners"),
            contact: localized("nav.contact"),
            quote: localized("nav.quote"),
          },
        },
        footer: {
          about: localized("footer.about"),
          registrationText: localized("footer.reg"),
          linksLabel: localized("footer.links"),
          servicesLabel: localized("footer.services"),
          contactLabel: localized("footer.contact"),
          rights: localized("footer.rights"),
        },
        seo: {
          title: localized("brand.full"),
          description: localized("hero.sub"),
          keywords: "agriculture, Afghanistan, food security, irrigation, livelihoods",
          ogImage: heroImage,
        },
      },
    },
    { upsert: true, new: true },
  );

  console.log(`CMS seed complete. Legacy media migration: ${migrateLegacyMedia ? "Cloudinary" : "disabled"}.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
