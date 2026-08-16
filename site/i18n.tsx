import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchCmsSite } from "./cms";

export type Lang = "en" | "fa" | "ps";

export const LANGS: { code: Lang; label: string; native: string; flag: string }[] = [
  { code: "en", label: "English", native: "English", flag: "EN" },
  { code: "fa", label: "Dari", native: "دری", flag: "DR" },
  { code: "ps", label: "Pashto", native: "پښتو", flag: "PS" },
];

export const isRTL = (l: Lang) => l !== "en";

type Dict = Record<string, string>;

const en: Dict = {
  "brand.name": "Tabiat Gran",
  "brand.full": "Tabiat Gran Agriculture Company",
  "brand.tag": "Agriculture • Development • Food Security",

  "nav.home": "Home",
  "nav.about": "About",
  "nav.services": "Services",
  "nav.projects": "Projects",
  "nav.partners": "Partners",
  "nav.contact": "Contact",
  "nav.quote": "Request a Proposal",

  "hero.badge": "Trusted implementing partner since 2009",
  "hero.title1": "Growing Afghanistan's",
  "hero.title2": "future, season after season",
  "hero.sub":
    "Tabiat Gran Agriculture Company delivers agriculture development, food security and rural livelihood programs across Afghanistan — implemented in partnership with United Nations agencies, international and national NGOs.",
  "hero.cta1": "Explore our projects",
  "hero.cta2": "Partner with us",
  "hero.scroll": "Scroll to discover",

  "stats.years": "Years of field experience",
  "stats.projects": "Projects implemented",
  "stats.provinces": "Provinces covered",
  "stats.farmers": "Farmers & households reached",

  "about.kicker": "Who we are",
  "about.title1i": "An Afghan company",
  "about.title": "rooted in the soil, guided by standards",
  "about.p1":
    "Founded in Kabul, Tabiat Gran Agriculture Company is a national agricultural services and implementation firm. We combine agronomy, engineering and community mobilisation to deliver measurable results for smallholder farmers in some of the most challenging environments in the country.",
  "about.p2":
    "For more than a decade we have worked as an implementing and supply partner for United Nations agencies as well as international and national NGOs operating in Afghanistan — delivering seeds, greenhouses, irrigation infrastructure, livestock packages and training to families who depend on the land.",
  "about.v1t": "Field-first delivery",
  "about.v1d": "Provincial teams and agronomists living in the communities they serve.",
  "about.v2t": "Donor-grade compliance",
  "about.v2d": "Transparent procurement, reporting and third-party monitoring readiness.",
  "about.v3t": "Inclusive by design",
  "about.v3d": "Dedicated women-led farming and home-garden components in every program.",
  "about.v4t": "Climate resilience",
  "about.v4d": "Water-efficient irrigation, drought-tolerant seed and soil conservation.",
  "about.mission": "Our mission",
  "about.missiontext":
    "To increase the productivity, income and resilience of Afghan farming families through professional, accountable and locally-led agricultural services.",

  "services.kicker": "What we do",
  "services.title": "Full-cycle agricultural services",
  "services.sub":
    "From certified seed to market linkage — we design, procure, implement and monitor.",
  "s1.t": "Seed multiplication & distribution",
  "s1.d":
    "Certified wheat, maize, vegetable and fodder seed production, quality testing, packaging and last-mile distribution to farming households.",
  "s2.t": "Irrigation & water management",
  "s2.d":
    "Canal rehabilitation, intake structures, check dams, solar-powered wells and drip / sprinkler systems that save every drop.",
  "s3.t": "Greenhouses & horticulture",
  "s3.d":
    "Design and construction of tunnel and steel greenhouses, orchard establishment, nurseries, grafting and trellising.",
  "s4.t": "Livestock, poultry & beekeeping",
  "s4.d":
    "Animal health campaigns, feed and shelter support, backyard poultry and honey production packages for vulnerable households.",
  "s5.t": "Training & extension",
  "s5.d":
    "Farmer Field Schools, Good Agricultural Practices, post-harvest handling, and cooperative and business skills development.",
  "s6.t": "Supply chain & logistics",
  "s6.d":
    "Bulk agricultural procurement, warehousing, cold chain and secure delivery to project sites in all regions of Afghanistan.",

  "projects.kicker": "Our work",
  "projects.title": "Projects delivered on the ground",
  "projects.sub":
    "A selection of programs implemented with UN agencies and international & national NGOs.",
  "projects.all": "All",
  "projects.view": "View project details",
  "projects.donor": "Client / Donor",
  "projects.location": "Location",
  "projects.year": "Period",
  "projects.beneficiaries": "Beneficiaries",
  "projects.gallery": "Project photos",
  "projects.outcomes": "Key outcomes",
  "projects.close": "Close",

  "cat.crops": "Crops & Seed",
  "cat.water": "Irrigation",
  "cat.horti": "Horticulture",
  "cat.livestock": "Livestock",
  "cat.training": "Training",
  "cat.value": "Value chain",

  "partners.kicker": "Trusted by",
  "partners.title": "Working with UN agencies & NGOs in Afghanistan",
  "partners.sub":
    "We have served as an implementing, supply and technical partner for United Nations organisations, international NGOs and Afghan national NGOs — as well as government line ministries.",
  "partners.un": "United Nations agencies",
  "partners.ingo": "International NGOs",
  "partners.nngo": "National NGOs & government",
  "partners.note":
    "Organisation names are listed as cooperation references and remain the property of their respective owners.",

  "testi.kicker": "Field voices",
  "testi.title": "What partners say",
  "t1.q":
    "The team mobilised to remote districts within days and delivered the full seed package before the planting window closed.",
  "t1.a": "Programme Officer, UN food security agency",
  "t2.q":
    "Documentation, beneficiary lists and post-distribution monitoring were audit-ready. A reliable national partner.",
  "t2.a": "Country Director, international NGO",
  "t3.q":
    "Their women's greenhouse component changed household nutrition and income in our target villages.",
  "t3.a": "Project Manager, Afghan national NGO",

  "contact.kicker": "Get in touch",
  "contact.title": "Let's build the next harvest together",
  "contact.sub":
    "For tenders, partnership proposals, procurement requests or field assessments — our team responds within two working days.",
  "contact.name": "Full name",
  "contact.email": "Email address",
  "contact.org": "Organisation",
  "contact.subject": "Subject",
  "contact.message": "Message",
  "contact.send": "Send message",
  "contact.sent": "Thank you — your message has been received.",
  "contact.address": "Head office",
  "contact.addressv": "Shahr-e-Naw, District 4, Kabul, Afghanistan",
  "contact.phone": "Phone",
  "contact.email2": "Email",
  "contact.hours": "Working hours",
  "contact.hoursv": "Saturday – Thursday, 8:00 – 16:30 (AFT)",
  "contact.offices": "Provincial offices",
  "contact.officesv": "Kabul • Herat • Balkh • Nangarhar • Kandahar • Bamyan",

  "footer.about":
    "A national agricultural services company delivering food security, irrigation and livelihood programs across Afghanistan.",
  "footer.links": "Quick links",
  "footer.services": "Services",
  "footer.contact": "Contact",
  "footer.rights": "All rights reserved.",
  "footer.reg": "Licensed with AISA / Ministry of Industry & Commerce, Afghanistan",

  "theme.light": "Light mode",
  "theme.dark": "Dark mode",
  "lang.select": "Language",
};

const fa: Dict = {
  "brand.name": "طبیعت گران",
  "brand.full": "شرکت زراعتی طبیعت گران",
  "brand.tag": "زراعت • انکشاف • مصونیت غذایی",

  "nav.home": "صفحه اصلی",
  "nav.about": "درباره ما",
  "nav.services": "خدمات",
  "nav.projects": "پروژه‌ها",
  "nav.partners": "همکاران",
  "nav.contact": "تماس",
  "nav.quote": "درخواست پیشنهاد",

  "hero.badge": "شریک قابل اعتماد تطبیق‌کننده از سال ۱۳۸۸",
  "hero.title1": "رشد آینده افغانستان،",
  "hero.title2": "فصل به فصل",
  "hero.sub":
    "شرکت زراعتی طبیعت گران پروژه‌های انکشاف زراعت، مصونیت غذایی و معیشت روستایی را در سراسر افغانستان تطبیق می‌کند — در همکاری با ادارات ملل متحد و مؤسسات غیر دولتی بین‌المللی و ملی.",
  "hero.cta1": "دیدن پروژه‌ها",
  "hero.cta2": "همکاری با ما",
  "hero.scroll": "برای دیدن بیشتر پایین بروید",

  "stats.years": "سال تجربه ساحوی",
  "stats.projects": "پروژه تطبیق شده",
  "stats.provinces": "ولایت تحت پوشش",
  "stats.farmers": "دهقان و خانواده مستفید",

  "about.kicker": "ما کی هستیم",
  "about.title1i": "یک شرکت افغان،",
  "about.title": "ریشه در خاک و پابند به معیارها",
  "about.p1":
    "شرکت زراعتی طبیعت گران که در کابل تأسیس شده است، یک شرکت ملی خدمات و تطبیق پروژه‌های زراعتی می‌باشد. ما دانش زراعت، انجنیری و بسیج اجتماعی را یکجا می‌سازیم تا برای دهقانان خرده‌مالک، حتی در سخت‌ترین مناطق کشور، نتایج قابل اندازه‌گیری به دست آوریم.",
  "about.p2":
    "بیش از یک دهه است که به حیث شریک تطبیق‌کننده و تدارکاتی برای ادارات ملل متحد و همچنان مؤسسات غیر دولتی بین‌المللی و ملی فعال در افغانستان کار کرده‌ایم — توزیع تخم بذری، اعمار گلخانه‌ها، زیربنای آبیاری، بسته‌های مالداری و آموزش برای خانواده‌هایی که زندگی‌شان به زمین وابسته است.",
  "about.v1t": "اولویت کار ساحوی",
  "about.v1d": "تیم‌ها و متخصصین زراعتی ما در همان جوامعی زندگی می‌کنند که به آن‌ها خدمت می‌کنند.",
  "about.v2t": "مطابقت با معیار تمویل‌کنندگان",
  "about.v2d": "تدارکات شفاف، گزارش‌دهی منظم و آمادگی برای نظارت شخص ثالث.",
  "about.v3t": "شمولیت همه‌جانبه",
  "about.v3d": "بخش مشخص زراعت زنان و باغچه‌های خانگی در هر پروژه.",
  "about.v4t": "تاب‌آوری اقلیمی",
  "about.v4d": "آبیاری کم‌مصرف، تخم بذری مقاوم به خشکسالی و حفاظت خاک.",
  "about.mission": "ماموریت ما",
  "about.missiontext":
    "افزایش حاصلات، عواید و تاب‌آوری خانواده‌های دهقان افغان از طریق خدمات زراعتی مسلکی، حسابده و رهبری‌شده توسط مردم محل.",

  "services.kicker": "خدمات ما",
  "services.title": "خدمات مکمل زراعتی",
  "services.sub": "از تخم بذری تصدیق‌شده تا وصل به بازار — طراحی، تدارک، تطبیق و نظارت.",
  "s1.t": "تکثیر و توزیع تخم بذری",
  "s1.d":
    "تولید تخم بذری تصدیق‌شده گندم، جواری، سبزیجات و علوفه، کنترول کیفیت، بسته‌بندی و توزیع تا آخرین روستا.",
  "s2.t": "آبیاری و مدیریت آب",
  "s2.d":
    "بازسازی کانال‌ها، اعمار دهنه‌ها، بندهای کوچک، چاه‌های آفتابی و سیستم‌های قطره‌ای و بارانی برای حفظ هر قطره آب.",
  "s3.t": "گلخانه‌ها و باغداری",
  "s3.d":
    "دیزاین و اعمار گلخانه‌های تونلی و فلزی، ایجاد باغ‌ها، قوریه‌جات، پیوند و داربست‌سازی.",
  "s4.t": "مالداری، مرغداری و زنبورداری",
  "s4.d":
    "کمپاین‌های صحت حیوانی، کمک به خوراکه و آغیل، مرغداری خانگی و بسته‌های تولید عسل برای خانواده‌های آسیب‌پذیر.",
  "s5.t": "آموزش و ترویج",
  "s5.d":
    "مکاتب ساحوی دهقانان، شیوه‌های خوب زراعتی، مدیریت پس از برداشت و انکشاف مهارت‌های تعاونی و تجارتی.",
  "s6.t": "زنجیره تدارکات و لوژستیک",
  "s6.d":
    "تدارکات عمده زراعتی، ذخیره‌گاه، زنجیره سرد و انتقال مصون به ساحات پروژه در تمام مناطق افغانستان.",

  "projects.kicker": "کارهای ما",
  "projects.title": "پروژه‌های تطبیق‌شده در ساحه",
  "projects.sub":
    "گزیده‌ای از پروژه‌های تطبیق‌شده با ادارات ملل متحد و مؤسسات غیر دولتی بین‌المللی و ملی.",
  "projects.all": "همه",
  "projects.view": "دیدن جزئیات پروژه",
  "projects.donor": "مشتری / تمویل‌کننده",
  "projects.location": "موقعیت",
  "projects.year": "دوره",
  "projects.beneficiaries": "مستفید شوندگان",
  "projects.gallery": "تصاویر پروژه",
  "projects.outcomes": "دستاوردهای کلیدی",
  "projects.close": "بستن",

  "cat.crops": "زراعت و تخم بذری",
  "cat.water": "آبیاری",
  "cat.horti": "باغداری",
  "cat.livestock": "مالداری",
  "cat.training": "آموزش",
  "cat.value": "زنجیره ارزش",

  "partners.kicker": "مورد اعتماد",
  "partners.title": "همکاری با ادارات ملل متحد و مؤسسات غیر دولتی در افغانستان",
  "partners.sub":
    "ما به حیث شریک تطبیق‌کننده، تدارکاتی و تخنیکی با سازمان‌های ملل متحد، مؤسسات بین‌المللی غیر دولتی و مؤسسات ملی افغانی — و همچنان وزارت‌های مربوطه دولت — کار کرده‌ایم.",
  "partners.un": "ادارات ملل متحد",
  "partners.ingo": "مؤسسات بین‌المللی غیر دولتی",
  "partners.nngo": "مؤسسات ملی و ادارات دولتی",
  "partners.note":
    "نام سازمان‌ها صرف به عنوان مرجع همکاری ذکر شده و ملکیت صاحبان مربوطه آن‌ها می‌باشد.",

  "testi.kicker": "صدای ساحه",
  "testi.title": "نظر همکاران ما",
  "t1.q":
    "تیم شرکت در جریان چند روز به ولسوالی‌های دوردست رسید و بسته‌های تخم بذری را پیش از ختم فصل کشت توزیع کرد.",
  "t1.a": "آمر برنامه، اداره مصونیت غذایی ملل متحد",
  "t2.q":
    "اسناد، لست مستفید شوندگان و نظارت بعد از توزیع کاملاً آماده بررسی بود. یک شریک ملی قابل اعتماد.",
  "t2.a": "رئیس دفتر، مؤسسه بین‌المللی غیر دولتی",
  "t3.q":
    "بخش گلخانه‌های زنان، تغذیه و عواید خانواده‌ها را در قریه‌های هدف ما دگرگون ساخت.",
  "t3.a": "مدیر پروژه، مؤسسه ملی افغانی",

  "contact.kicker": "در تماس شوید",
  "contact.title": "بیایید حاصل بعدی را باهم بسازیم",
  "contact.sub":
    "برای داوطلبی‌ها، پیشنهاد همکاری، درخواست تدارکات یا ارزیابی ساحوی — تیم ما در جریان دو روز کاری پاسخ می‌دهد.",
  "contact.name": "نام مکمل",
  "contact.email": "آدرس ایمیل",
  "contact.org": "اداره / مؤسسه",
  "contact.subject": "موضوع",
  "contact.message": "پیام",
  "contact.send": "ارسال پیام",
  "contact.sent": "تشکر — پیام شما دریافت شد.",
  "contact.address": "دفتر مرکزی",
  "contact.addressv": "شهر نو، ناحیه چهارم، کابل، افغانستان",
  "contact.phone": "تیلفون",
  "contact.email2": "ایمیل",
  "contact.hours": "ساعات کاری",
  "contact.hoursv": "شنبه تا پنجشنبه، ۸:۰۰ – ۱۶:۳۰",
  "contact.offices": "دفاتر ولایتی",
  "contact.officesv": "کابل • هرات • بلخ • ننگرهار • کندهار • بامیان",

  "footer.about":
    "یک شرکت ملی خدمات زراعتی که پروژه‌های مصونیت غذایی، آبیاری و معیشت را در سراسر افغانستان تطبیق می‌کند.",
  "footer.links": "لینک‌های سریع",
  "footer.services": "خدمات",
  "footer.contact": "تماس",
  "footer.rights": "تمام حقوق محفوظ است.",
  "footer.reg": "دارای جواز از آیسا / وزارت صنعت و تجارت افغانستان",

  "theme.light": "حالت روشن",
  "theme.dark": "حالت تاریک",
  "lang.select": "زبان",
};

const ps: Dict = {
  "brand.name": "طبیعت ګران",
  "brand.full": "د طبیعت ګران کرنیزه شرکت",
  "brand.tag": "کرنه • پراختیا • د خوړو خوندیتوب",

  "nav.home": "کور پاڼه",
  "nav.about": "زموږ په اړه",
  "nav.services": "خدمتونه",
  "nav.projects": "پروژې",
  "nav.partners": "همکاران",
  "nav.contact": "اړیکه",
  "nav.quote": "د وړاندیز غوښتنه",

  "hero.badge": "له ۱۳۸۸ کال راهیسې د باور وړ پلي کوونکی شریک",
  "hero.title1": "د افغانستان راتلونکې ودې ته،",
  "hero.title2": "موسم په موسم",
  "hero.sub":
    "د طبیعت ګران کرنیزه شرکت د کرنې پراختیا، د خوړو خوندیتوب او کلیوالي معیشت پروګرامونه په ټول افغانستان کې پلي کوي — د ملګرو ملتونو ادارو او نړیوالو او ملي غیر دولتي مؤسسو په همکارۍ.",
  "hero.cta1": "زموږ پروژې وګورئ",
  "hero.cta2": "زموږ سره همکاري",
  "hero.scroll": "د لا معلوماتو لپاره ښکته شئ",

  "stats.years": "کاله ساحوي تجربه",
  "stats.projects": "پلي شوې پروژې",
  "stats.provinces": "ولایتونه تر پوښښ لاندې",
  "stats.farmers": "بزګران او کورنۍ ګټه اخیستونکي",

  "about.kicker": "موږ څوک یو",
  "about.title1i": "یو افغاني شرکت،",
  "about.title": "په خاوره کې ریښې او په معیارونو ولاړ",
  "about.p1":
    "د طبیعت ګران کرنیزه شرکت چې په کابل کې تاسیس شوی، یوه ملي کرنیزه خدماتي او پلي کوونکې اداره ده. موږ د کرنې پوهه، انجنیري او ټولنیز بسیج سره یوځای کوو تر څو د وړو بزګرانو لپاره، حتی په ډېرو ستونزمنو سیمو کې، د اندازه کولو وړ پایلې تر لاسه کړو.",
  "about.p2":
    "له یوې لسیزې زیات وخت راهیسې موږ د ملګرو ملتونو ادارو او همدارنګه په افغانستان کې د فعالو نړیوالو او ملي غیر دولتي مؤسسو لپاره د پلي کوونکي او تدارکاتي شریک په توګه کار کړی — تخم، شنې خونې، د اوبو لګولو زیربناوې، د مالدارۍ بستې او روزنه هغو کورنیو ته چې ژوند یې په ځمکه پورې تړلی دی.",
  "about.v1t": "لومړیتوب ساحوي کار ته",
  "about.v1d": "زموږ ټیمونه او کرنپوهان په هماغو ټولنو کې ژوند کوي چې خدمت ورته کوي.",
  "about.v2t": "د تمویلوونکو له معیارونو سره سمون",
  "about.v2d": "شفاف تدارکات، منظم راپور ورکول او د دریمې خوا څارنې ته چمتووالی.",
  "about.v3t": "ټول شموله پروګرامونه",
  "about.v3d": "په هره پروژه کې د ښځو کرنې او کورني باغچو ځانګړې برخه.",
  "about.v4t": "د اقلیم په وړاندې مقاومت",
  "about.v4d": "لږ لګښت اوبه لګول، د وچکالۍ مقاوم تخم او د خاورې ساتنه.",
  "about.mission": "زموږ موخه",
  "about.missiontext":
    "د مسلکي، حساب ورکوونکو او د سیمې خلکو په مشرۍ کرنیزو خدمتونو له لارې د افغان بزګرو کورنیو د حاصلاتو، عوایدو او مقاومت لوړول.",

  "services.kicker": "زموږ خدمتونه",
  "services.title": "بشپړ کرنیز خدمتونه",
  "services.sub": "له تصدیق شوي تخم څخه تر بازار پورې — ډیزاین، تدارک، پلي کول او څارنه.",
  "s1.t": "د تخم تکثیر او وېش",
  "s1.d":
    "د غنمو، جوارو، سبزیجاتو او علوفې تصدیق شوی تخم تولید، د کیفیت کنټرول، بسته بندي او تر وروستي کلي پورې وېش.",
  "s2.t": "اوبه لګول او د اوبو مدیریت",
  "s2.d":
    "د ویالو بیا رغونه، د اوبو خولې، کوچني بندونه، لمریزې څاګانې او څاڅکي او باراني سیسټمونه چې هر څاڅکی ساتي.",
  "s3.t": "شنې خونې او باغداري",
  "s3.d":
    "د تونل او فلزي شنو خونو ډیزاین او جوړول، د باغونو رامنځته کول، شتلتونونه، پیوند او د انګورو داربست.",
  "s4.t": "مالداري، چرګ پالنه او د شاتو مچۍ",
  "s4.d":
    "د څارویو روغتیا کمپاینونه، د خوراک او غوجل ملاتړ، کورنۍ چرګ پالنه او د شاتو تولید بستې د زیانمنو کورنیو لپاره.",
  "s5.t": "روزنه او پراختیایي غځونه",
  "s5.d":
    "د بزګرانو ساحوي ښوونځي، ښې کرنیزې کړنې، د حاصلاتو وروسته اداره او د تعاونیو او سوداګریزو مهارتونو پراختیا.",
  "s6.t": "د اکمالاتو زنځیر او لوژستیک",
  "s6.d":
    "پرېمانه کرنیز تدارکات، ګودامونه، سړه زنځیره او په ټولو سیمو کې پروژو ته خوندي لېږد.",

  "projects.kicker": "زموږ کارونه",
  "projects.title": "په ساحه کې پلي شوې پروژې",
  "projects.sub":
    "د ملګرو ملتونو ادارو او نړیوالو او ملي غیر دولتي مؤسسو سره د پلي شویو پروژو یوه ټاکنه.",
  "projects.all": "ټول",
  "projects.view": "د پروژې جزئیات وګورئ",
  "projects.donor": "پیرودونکی / تمویلوونکی",
  "projects.location": "موقعیت",
  "projects.year": "موده",
  "projects.beneficiaries": "ګټه اخیستونکي",
  "projects.gallery": "د پروژې انځورونه",
  "projects.outcomes": "مهمې لاسته راوړنې",
  "projects.close": "بندول",

  "cat.crops": "کرنه او تخم",
  "cat.water": "اوبه لګول",
  "cat.horti": "باغداري",
  "cat.livestock": "مالداري",
  "cat.training": "روزنه",
  "cat.value": "د ارزښت زنځیر",

  "partners.kicker": "د باور وړ",
  "partners.title": "په افغانستان کې د ملګرو ملتونو ادارو او غیر دولتي مؤسسو سره کار",
  "partners.sub":
    "موږ د ملګرو ملتونو سازمانونو، نړیوالو غیر دولتي مؤسسو او افغاني ملي مؤسسو — او همدارنګه د حکومت اړوندو وزارتونو — لپاره د پلي کوونکي، تدارکاتي او تخنیکي شریک په توګه کار کړی دی.",
  "partners.un": "د ملګرو ملتونو ادارې",
  "partners.ingo": "نړیوالې غیر دولتي مؤسسې",
  "partners.nngo": "ملي مؤسسې او دولتي ادارې",
  "partners.note":
    "د سازمانونو نومونه یوازې د همکارۍ د مرجع په توګه راغلي او د خپلو خاوندانو ملکیت دي.",

  "testi.kicker": "د ساحې غږ",
  "testi.title": "همکاران څه وایي",
  "t1.q":
    "د شرکت ټیم په څو ورځو کې لرې پرتو ولسوالیو ته ورسېد او د کرلو موسم له پای ته رسېدو مخکې یې د تخم بشپړې بستې وویشلې.",
  "t1.a": "د پروګرام آمر، د ملګرو ملتونو د خوړو خوندیتوب اداره",
  "t2.q":
    "اسناد، د ګټه اخیستونکو لیستونه او له وېش وروسته څارنه بشپړه د پلټنې لپاره چمتو وه. یو د باور وړ ملي شریک.",
  "t2.a": "د دفتر رییس، نړیواله غیر دولتي مؤسسه",
  "t3.q":
    "د ښځو د شنو خونو برخې زموږ په هدفي کلیو کې د کورنیو تغذیه او عاید بدل کړ.",
  "t3.a": "د پروژې مدیر، افغاني ملي مؤسسه",

  "contact.kicker": "اړیکه ونیسئ",
  "contact.title": "راځئ چې راتلونکی حاصل سره جوړ کړو",
  "contact.sub":
    "د داوطلبیو، د همکارۍ وړاندیزونو، د تدارکاتو غوښتنو یا ساحوي ارزونې لپاره — زموږ ټیم په دوو کاري ورځو کې ځواب وایي.",
  "contact.name": "بشپړ نوم",
  "contact.email": "بریښنالیک پته",
  "contact.org": "اداره / مؤسسه",
  "contact.subject": "موضوع",
  "contact.message": "پیغام",
  "contact.send": "پیغام ولېږئ",
  "contact.sent": "مننه — ستاسو پیغام ترلاسه شو.",
  "contact.address": "مرکزي دفتر",
  "contact.addressv": "شهر نو، څلورمه ناحیه، کابل، افغانستان",
  "contact.phone": "تلیفون",
  "contact.email2": "بریښنالیک",
  "contact.hours": "کاري ساعتونه",
  "contact.hoursv": "شنبه تر پنجشنبې، ۸:۰۰ – ۱۶:۳۰",
  "contact.offices": "ولایتي دفترونه",
  "contact.officesv": "کابل • هرات • بلخ • ننګرهار • کندهار • بامیان",

  "footer.about":
    "یو ملي کرنیز خدماتي شرکت چې د خوړو خوندیتوب، اوبو لګولو او معیشت پروژې په ټول افغانستان کې پلي کوي.",
  "footer.links": "چټکې لینکونه",
  "footer.services": "خدمتونه",
  "footer.contact": "اړیکه",
  "footer.rights": "ټول حقوق خوندي دي.",
  "footer.reg": "د آیسا / د افغانستان د صنعت او سوداګرۍ وزارت جواز لرونکی",

  "theme.light": "روښانه حالت",
  "theme.dark": "تیاره حالت",
  "lang.select": "ژبه",
};

export const baseDicts: Record<Lang, Dict> = { en, fa, ps };

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
  rtl: boolean;
};

const I18nContext = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
  rtl: false,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [remoteDicts, setRemoteDicts] = useState<Partial<Record<Lang, Dict>>>({});
  const [lang, setLang] = useState<Lang>(() => {
    const saved = typeof localStorage !== "undefined" ? localStorage.getItem("tg-lang") : null;
    return (saved as Lang) || "en";
  });

  useEffect(() => {
    localStorage.setItem("tg-lang", lang);
    document.documentElement.lang = lang === "fa" ? "fa" : lang === "ps" ? "ps" : "en";
    document.documentElement.dir = isRTL(lang) ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    let active = true;
    void fetchCmsSite().then((site) => {
      if (active && site?.translations) setRemoteDicts(site.translations);
    });
    return () => { active = false; };
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (k: string) => remoteDicts[lang]?.[k] ?? baseDicts[lang][k] ?? remoteDicts.en?.[k] ?? baseDicts.en[k] ?? k,
      rtl: isRTL(lang),
    }),
    [lang, remoteDicts],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);

/** Localized numbers helper (keeps latin digits for clarity) */
export function useT() {
  return useI18n().t;
}
