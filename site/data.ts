import type { Lang } from "./i18n";

export type Localized = Record<Lang, string>;

export type Project = {
  id: string;
  category: string;
  cover: string;
  gallery: string[];
  donor: string;
  location: Localized;
  year: string;
  beneficiaries: Localized;
  title: Localized;
  short: Localized;
  description: Localized;
  outcomes: Localized[];
};

const px = (id: number, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${Math.round(
    (w * 2) / 3,
  )}`;

export const HERO_IMAGE = px(6128933, 1600);
export const ABOUT_IMAGE = px(11678439, 1000);
export const ABOUT_IMAGE_2 = px(28220703, 800);

export const projects: Project[] = [
  {
    id: "wheat-seed",
    category: "crops",
    cover: px(36012460),
    gallery: [px(22493409), px(13065278), px(32890865)],
    donor: "FAO Afghanistan / MAIL",
    year: "2021 – 2023",
    location: {
      en: "Balkh, Jawzjan & Samangan provinces",
      fa: "ولایات بلخ، جوزجان و سمنگان",
      ps: "بلخ، جوزجان او سمنګان ولایتونه",
    },
    beneficiaries: {
      en: "18,400 farming households",
      fa: "۱۸,۴۰۰ خانواده دهقان",
      ps: "۱۸,۴۰۰ بزګرې کورنۍ",
    },
    title: {
      en: "Certified Wheat Seed Multiplication & Emergency Distribution",
      fa: "تکثیر تخم بذری تصدیق‌شده گندم و توزیع اضطراری",
      ps: "د غنمو د تصدیق شوي تخم تکثیر او بیړنی وېش",
    },
    short: {
      en: "Producing and distributing certified wheat seed and fertiliser to drought-affected households before the autumn planting window.",
      fa: "تولید و توزیع تخم بذری تصدیق‌شده گندم و کود کیمیاوی برای خانواده‌های متأثر از خشکسالی پیش از فصل کشت خزانی.",
      ps: "د مني د کرلو له موسم مخکې وچکالۍ ځپلو کورنیو ته د تصدیق شوي غنمو تخم او سرې تولید او وېش.",
    },
    description: {
      en: "Tabiat Gran contracted 260 lead farmers across three northern provinces to multiply certified wheat varieties on 1,150 jeribs of monitored land. Our agronomists supervised land preparation, roguing, harvesting and threshing, while an independent laboratory carried out germination and purity testing on every batch. Cleaned and treated seed was bagged in 50 kg branded sacks and distributed together with DAP and urea fertiliser through village-level distribution points, using biometric beneficiary verification and full post-distribution monitoring. The programme was completed two weeks ahead of the autumn planting deadline despite severe access constraints.",
      fa: "شرکت طبیعت گران با ۲۶۰ دهقان پیشرو در سه ولایت شمالی قرارداد بست تا واریته‌های تصدیق‌شده گندم را در ۱۱۵۰ جریب زمین تحت نظارت تکثیر نمایند. متخصصین زراعتی ما آماده‌سازی زمین، پاک‌کاری، برداشت و خرمن‌کوبی را نظارت کردند و یک لابراتوار مستقل، جوانه‌زنی و خلوص هر پارتی را آزمایش نمود. تخم بذری پاک و ضدعفونی‌شده در بوجی‌های ۵۰ کیلوگرامی بسته‌بندی شده و همراه با کود دی‌ای‌پی و یوریا از طریق نقاط توزیع در سطح قریه، با تثبیت هویت بایومتریک مستفید شوندگان و نظارت مکمل بعد از توزیع، توزیع گردید. این پروژه با وجود محدودیت‌های شدید دسترسی، دو هفته پیشتر از ختم مهلت کشت خزانی تکمیل شد.",
      ps: "طبیعت ګران په دریو شمالي ولایتونو کې له ۲۶۰ مخکښو بزګرانو سره تړون وکړ تر څو د غنمو تصدیق شوي ډولونه په ۱۱۵۰ جریبه څارل شوې ځمکه کې تکثیر کړي. زموږ کرنپوهانو د ځمکې چمتووالی، پاکول، رېبنه او درمند وڅاره، او یوه خپلواکه لابراتوار د هرې برخې د زرغونتیا او خلوص ازموینه وکړه. پاک او درمل شوی تخم په ۵۰ کیلویو بوجیو کې بسته او د DAP او یوریا سرې سره یوځای د کلي په کچه د وېش ټکو له لارې، د ګټه اخیستونکو د بایومټریک تاییدولو او له وېش وروسته بشپړې څارنې سره ووېشل شو. پروژه د لاسرسي له سختو ستونزو سره سره د مني د کرلو له نېټې دوې اونۍ مخکې بشپړه شوه.",
    },
    outcomes: [
      {
        en: "1,150 jeribs under certified seed multiplication",
        fa: "۱۱۵۰ جریب زمین زیر تکثیر تخم تصدیق‌شده",
        ps: "۱۱۵۰ جریبه ځمکه د تصدیق شوي تخم لاندې",
      },
      {
        en: "2,300 MT of seed produced and quality tested",
        fa: "۲۳۰۰ تُن تخم بذری تولید و کنترول کیفیت شد",
        ps: "۲۳۰۰ ټنه تخم تولید او د کیفیت ازموینه یې وشوه",
      },
      {
        en: "Average yield increase of 38% among recipients",
        fa: "افزایش اوسط ۳۸ فیصد حاصلات نزد مستفید شوندگان",
        ps: "د ګټه اخیستونکو ترمنځ په اوسط ډول ۳۸٪ د حاصلاتو زیاتوالی",
      },
    ],
  },
  {
    id: "women-greenhouse",
    category: "horti",
    cover: px(9098814),
    gallery: [px(5561356), px(38551884), px(4750271)],
    donor: "UN Women / WFP – national NGO consortium",
    year: "2022 – 2024",
    location: {
      en: "Herat & Ghor provinces",
      fa: "ولایات هرات و غور",
      ps: "هرات او غور ولایتونه",
    },
    beneficiaries: {
      en: "1,250 women-headed households",
      fa: "۱۲۵۰ خانواده تحت سرپرستی زن",
      ps: "۱۲۵۰ د ښځو په مشرۍ کورنۍ",
    },
    title: {
      en: "Women's Greenhouse Vegetable Production Programme",
      fa: "برنامه تولید سبزیجات در گلخانه‌های زنان",
      ps: "د ښځو د شنو خونو د سبزیجاتو تولید پروګرام",
    },
    short: {
      en: "Household tunnel greenhouses, seedlings and business training that turn courtyards into year-round income.",
      fa: "گلخانه‌های تونلی خانگی، نهال و آموزش تجارتی که حویلی‌ها را به منبع عاید دوامدار تبدیل می‌کند.",
      ps: "کورني تونلي شنې خونې، شتلې او سوداګریزه روزنه چې انګړونه په دوامداره عاید بدلوي.",
    },
    description: {
      en: "The programme installed 1,250 household tunnel greenhouses (6 × 24 m) inside family compounds so that women could cultivate safely and privately. Each package included a galvanised frame, UV-stabilised plastic sheeting, drip irrigation, tomato, cucumber and capsicum seedlings, organic compost and integrated pest management inputs. Female extension officers ran 12 training sessions per group covering nursery management, pollination, grading and simple bookkeeping. A market linkage component connected 42 women's producer groups to wholesale buyers in Herat city, with cold-storage access during peak harvest.",
      fa: "این برنامه ۱۲۵۰ گلخانه تونلی خانگی (۶ × ۲۴ متر) را در داخل حویلی‌های خانواده‌ها نصب کرد تا زنان بتوانند به شکل مصون و خصوصی کشت نمایند. هر بسته شامل چوکات گلوانیزه، پلاستیک مقاوم در برابر آفتاب، سیستم آبیاری قطره‌ای، نهال بادنجان رومی، بادرنگ و مرچ، کمپوست عضوی و مواد کنترول آفات بود. مأمورین ترویجی زن برای هر گروپ ۱۲ جلسه آموزشی در بخش مدیریت قوریه، تلقیح، درجه‌بندی و حسابداری ساده برگزار کردند. بخش وصل به بازار، ۴۲ گروپ تولیدی زنان را با خریداران عمده‌فروش در شهر هرات و ذخیره‌گاه سرد در فصل اوج برداشت وصل نمود.",
      ps: "دې پروګرام د کورنیو په انګړونو کې ۱۲۵۰ کورني تونلي شنې خونې (۶ × ۲۴ متره) جوړې کړې تر څو ښځې په خوندي او خصوصي توګه کرنه وکړي. هره بسته د ګالوانایز چوکاټ، د لمر په وړاندې مقاوم پلاستیک، د څاڅکي اوبو لګولو سیسټم، د رومي بانجن، بادرنګ او مرچو شتلې، عضوي کمپوسټ او د آفتونو د کنټرول توکي لرل. ښځینه پراختیایي کارکوونکو هرې ډلې ته ۱۲ روزنیز غونډې د شتلتون مدیریت، ګرده افشانۍ، درجه بندۍ او ساده حساب دارۍ په اړه ترسره کړې. د بازار د نښلولو برخې ۴۲ ښځینه تولیدي ډلې د هرات ښار له لویو پیرودونکو سره ونښلولې.",
    },
    outcomes: [
      {
        en: "Average household income up by AFN 4,800 per month",
        fa: "افزایش اوسط عاید خانواده تا ۴۸۰۰ افغانی در ماه",
        ps: "د کورنۍ اوسط عاید په میاشت کې ۴۸۰۰ افغانۍ لوړ شو",
      },
      {
        en: "42 women's producer groups formally registered",
        fa: "ثبت رسمی ۴۲ گروپ تولیدی زنان",
        ps: "۴۲ ښځینه تولیدي ډلې په رسمي ډول ثبت شوې",
      },
      {
        en: "Year-round vegetable availability in 96 villages",
        fa: "دسترسی دوامدار به سبزیجات در ۹۶ قریه",
        ps: "په ۹۶ کلیو کې د سبزیجاتو دوامداره شتون",
      },
    ],
  },
  {
    id: "irrigation",
    category: "water",
    cover: px(11678439),
    gallery: [px(34182297), px(33881124), px(32938427)],
    donor: "UNDP / UNOPS – rural resilience window",
    year: "2019 – 2022",
    location: {
      en: "Nangarhar & Laghman provinces",
      fa: "ولایات ننگرهار و لغمان",
      ps: "ننګرهار او لغمان ولایتونه",
    },
    beneficiaries: {
      en: "26,000 people across 74 villages",
      fa: "۲۶,۰۰۰ نفر در ۷۴ قریه",
      ps: "په ۷۴ کلیو کې ۲۶,۰۰۰ کسان",
    },
    title: {
      en: "Irrigation Canal Rehabilitation & Water Efficiency",
      fa: "بازسازی کانال‌های آبیاری و بهبود مصرف آب",
      ps: "د اوبو لګولو د ویالو بیا رغونه او د اوبو کارونې ښه والی",
    },
    short: {
      en: "Rebuilding 63 km of community canals with concrete lining, intakes and solar-powered drip systems.",
      fa: "بازسازی ۶۳ کیلومتر کانال اجتماعی با پوشش کانکریتی، دهنه‌ها و سیستم‌های قطره‌ای آفتابی.",
      ps: "د ۶۳ کیلومتره ټولنیزو ویالو بیا رغونه د کانکریټي پوښښ، د اوبو خولو او لمریزو څاڅکي سیسټمونو سره.",
    },
    description: {
      en: "Working through community development councils, our engineering teams surveyed, designed and rehabilitated 63 km of traditional irrigation canals, 21 permanent intake structures, 9 siphons and 4 flood-protection walls. Cash-for-work modality engaged 3,900 local labourers for 84 days, injecting immediate income into vulnerable communities. In the tail-end sections, 180 hectares were converted to solar-powered drip irrigation, cutting water use by roughly 45% while doubling cropping intensity. Mirab (water master) committees were trained and equipped with maintenance tool kits and a small O&M fund to sustain the assets after handover.",
      fa: "تیم‌های انجنیری ما از طریق شوراهای انکشافی قریه، ۶۳ کیلومتر کانال آبیاری سنتی، ۲۱ دهنه دایمی، ۹ سایفون و ۴ دیوار محافظتی در برابر سیلاب را سروی، دیزاین و بازسازی نمودند. در چوکات برنامه کار در بدل پول، ۳۹۰۰ کارگر محلی برای ۸۴ روز مصروف کار شدند که عاید فوری را وارد جوامع آسیب‌پذیر ساخت. در بخش‌های انتهایی، ۱۸۰ هکتار زمین به آبیاری قطره‌ای با انرژی آفتابی تبدیل شد که مصرف آب را حدود ۴۵ فیصد کاهش و شدت کشت را دوچند ساخت. کمیته‌های میراب آموزش دیده و با وسایل ترمیماتی و یک صندوق کوچک حفظ و مراقبت تجهیز شدند.",
      ps: "زموږ انجینري ټیمونو د کلي د پراختیایي شوراګانو له لارې ۶۳ کیلومتره دودیزې ویالې، ۲۱ دایمي د اوبو خولې، ۹ سیفونونه او ۴ د سیلاب مخنیوي دیوالونه سروې، ډیزاین او بیا رغولې. د پیسو په بدل کې د کار له لارې ۳۹۰۰ سیمه ییز کارګران د ۸۴ ورځو لپاره وګمارل شول چې زیانمنو ټولنو ته یې سمدستي عاید ورساوه. په وروستیو برخو کې ۱۸۰ هکتاره ځمکه لمریزو څاڅکي اوبو لګولو ته واړول شوه چې د اوبو لګښت یې نږدې ۴۵٪ راکم او د کرلو کچه یې دوه چنده کړه. د میراب کمېټې وروزل شوې او د ساتنې وسایل ورکړل شول.",
    },
    outcomes: [
      {
        en: "63 km canals rehabilitated, 4,300 ha re-irrigated",
        fa: "بازسازی ۶۳ کیلومتر کانال و آبیاری مجدد ۴۳۰۰ هکتار",
        ps: "۶۳ کیلومتره ویالې بیا رغول شوې، ۴۳۰۰ هکتاره بیا اوبه شوې",
      },
      {
        en: "312,000 labour days of cash-for-work created",
        fa: "ایجاد ۳۱۲,۰۰۰ روز کاری در برنامه کار در بدل پول",
        ps: "۳۱۲,۰۰۰ کاري ورځې د پیسو په بدل کې کار رامنځته شوې",
      },
      {
        en: "45% reduction in irrigation water losses",
        fa: "کاهش ۴۵ فیصدی ضایعات آب آبیاری",
        ps: "د اوبو لګولو په ضایعاتو کې ۴۵٪ کمښت",
      },
    ],
  },
  {
    id: "orchards",
    category: "horti",
    cover: px(11292936),
    gallery: [px(17765489), px(5381080), px(15908024)],
    donor: "Aga Khan Foundation / national NGO partner",
    year: "2020 – 2023",
    location: {
      en: "Kandahar, Zabul & Uruzgan provinces",
      fa: "ولایات کندهار، زابل و ارزگان",
      ps: "کندهار، زابل او روزګان ولایتونه",
    },
    beneficiaries: {
      en: "5,600 orchard-owning families",
      fa: "۵۶۰۰ خانواده باغدار",
      ps: "۵۶۰۰ باغوالې کورنۍ",
    },
    title: {
      en: "Almond & Apricot Orchard and Nursery Development",
      fa: "انکشاف باغ‌های بادام و زردالو و ایجاد قوریه‌جات",
      ps: "د بادام او زردالو د باغونو او شتلتونونو پراختیا",
    },
    short: {
      en: "Establishing certified nurseries and 1,400 hectares of new high-value orchards with modern pruning and pest management.",
      fa: "ایجاد قوریه‌های تصدیق‌شده و ۱۴۰۰ هکتار باغ جدید پُر ارزش با شاخه‌بری مدرن و کنترول آفات.",
      ps: "د تصدیق شویو شتلتونونو او ۱۴۰۰ هکتاره نویو ارزښتناکو باغونو رامنځته کول د عصري څانګه وهنې سره.",
    },
    description: {
      en: "Six mother nurseries were established with virus-free rootstock, producing over 620,000 grafted saplings of improved almond, apricot, apple and pomegranate varieties. Farmers received saplings, drip lines, tree guards and a three-year technical accompaniment package covering pit preparation, grafting, winter pruning, thinning and integrated pest management. Solar-powered water points were installed in 38 sites where surface water was insufficient. A post-harvest component introduced shade-drying tunnels and food-grade packaging so that producers could reach export-quality standards for dried fruit and nuts.",
      fa: "شش قوریه مادر با پایه‌های عاری از ویروس ایجاد گردید که بیش از ۶۲۰,۰۰۰ نهال پیوندی واریته‌های بهبودیافته بادام، زردالو، سیب و انار تولید کرد. دهقانان نهال، لین‌های قطره‌ای، محافظ درخت و یک بسته همراهی تخنیکی سه‌ساله شامل حفر چقرک، پیوند، شاخه‌بری زمستانی، تُنُک‌کاری و کنترول مدغم آفات دریافت نمودند. در ۳۸ ساحه که آب سطحی کافی نبود، منابع آبی آفتابی نصب شد. بخش بعد از برداشت، تونل‌های خشک‌کن سایه‌دار و بسته‌بندی معیاری را معرفی کرد تا تولیدکنندگان به معیارهای صادراتی میوه خشک دست یابند.",
      ps: "شپږ مورنۍ شتلتونونه د ویروس څخه پاکو ریښو سره جوړ شول چې د بادام، زردالو، مڼې او انار د ښه شویو ډولونو ۶۲۰,۰۰۰ پیوندي شتلې یې تولید کړې. بزګرانو شتلې، د څاڅکي لینونه، د ونو ساتونکي او د دریو کلونو تخنیکي ملاتړ بسته ترلاسه کړه چې د کندې چمتووالی، پیوند، د ژمي څانګه وهنه او د آفتونو مدغم کنټرول یې رانغاړه. په ۳۸ ځایونو کې لمریز د اوبو ټکي جوړ شول. د حاصلاتو وروسته برخې د سیوري وچولو تونلونه او معیاري بسته بندي معرفي کړه.",
    },
    outcomes: [
      {
        en: "620,000 certified saplings produced and planted",
        fa: "تولید و غرس ۶۲۰,۰۰۰ نهال تصدیق‌شده",
        ps: "۶۲۰,۰۰۰ تصدیق شوې شتلې تولید او کرل شوې",
      },
      {
        en: "1,400 ha of new orchards established",
        fa: "ایجاد ۱۴۰۰ هکتار باغ جدید",
        ps: "۱۴۰۰ هکتاره نوي باغونه رامنځته شول",
      },
      {
        en: "Post-harvest losses reduced from 30% to 11%",
        fa: "کاهش ضایعات بعد از برداشت از ۳۰ به ۱۱ فیصد",
        ps: "له حاصلاتو وروسته زیانونه له ۳۰٪ څخه ۱۱٪ ته راټیټ شول",
      },
    ],
  },
  {
    id: "livestock",
    category: "livestock",
    cover: px(26425514),
    gallery: [px(4939977), px(32858010), px(9792863)],
    donor: "IOM / DACAAR – returnee livelihoods",
    year: "2021 – 2024",
    location: {
      en: "Bamyan, Daykundi & Ghazni provinces",
      fa: "ولایات بامیان، دایکندی و غزنی",
      ps: "بامیان، دایکندي او غزني ولایتونه",
    },
    beneficiaries: {
      en: "3,800 returnee & IDP households",
      fa: "۳۸۰۰ خانواده عودت‌کننده و بیجاشده",
      ps: "۳۸۰۰ راستنېدونکې او بې ځایه شوې کورنۍ",
    },
    title: {
      en: "Livestock, Poultry & Beekeeping Livelihood Recovery",
      fa: "احیای معیشت از طریق مالداری، مرغداری و زنبورداری",
      ps: "د مالدارۍ، چرګ پالنې او د شاتو مچیو له لارې د معیشت بیا رغونه",
    },
    short: {
      en: "Restocking packages, animal health campaigns and honey production for returnee and displaced families.",
      fa: "توزیع بسته‌های مواشی، کمپاین‌های صحت حیوانی و تولید عسل برای خانواده‌های عودت‌کننده و بیجاشده.",
      ps: "د راستنېدونکو او بې ځایه شویو کورنیو لپاره د څارویو بستې، د روغتیا کمپاینونه او د شاتو تولید.",
    },
    description: {
      en: "Each household received either a small-ruminant package (four ewes and one improved ram), a backyard poultry package (25 vaccinated pullets plus feed and a prefabricated coop) or five modern beehives with protective equipment and an extraction kit. Tabiat Gran deployed 26 paravets who delivered two nationwide vaccination and deworming rounds covering 210,000 animals, plus fodder-block production units to bridge the harsh winter months. Beekeepers were organised into 34 cooperatives and supported with honey testing, food-grade jars and labelling for sale in provincial markets.",
      fa: "هر خانواده یا بسته حیوانات کوچک (چهار میش و یک قوچ اصلاح‌شده)، یا بسته مرغداری خانگی (۲۵ مرغ واکسین‌شده همراه با دانه و لانه پیش‌ساخته) و یا پنج کندوی عصری زنبور عسل همراه با تجهیزات محافظتی و وسایل استخراج دریافت نمود. طبیعت گران ۲۶ پاراویت را استخدام کرد که دو دور واکسیناسیون و ضد کرم را برای ۲۱۰,۰۰۰ رأس حیوان انجام دادند، همچنان واحدهای تولید بلاک علوفه برای عبور از زمستان سخت ایجاد شد. زنبورداران در ۳۴ تعاونی سازماندهی و در بخش آزمایش عسل، ظروف معیاری و لیبل‌گذاری برای فروش در بازارهای ولایتی حمایت شدند.",
      ps: "هرې کورنۍ یا د وړو څارویو بسته (څلور مېږې او یو ښه شوی پسه)، یا د کورنۍ چرګ پالنې بسته (۲۵ واکسین شوې چرګې، خواړه او چمتو شوی کور) او یا پنځه عصري د شاتو مچیو کنډوګانې د ساتنې وسایلو سره ترلاسه کړې. طبیعت ګران ۲۶ پاراویټان وګمارل چې د ۲۱۰,۰۰۰ څارویو لپاره یې دوه پړاوه واکسین او د چینجیو ضد درمل ورکړل. د شاتو مچۍ پالونکي په ۳۴ تعاونیو کې منظم او د شاتو ازموینې، معیاري لوښو او لیبل کولو کې ملاتړ شول.",
    },
    outcomes: [
      {
        en: "210,000 animals vaccinated and dewormed",
        fa: "واکسین و ضد کرم ۲۱۰,۰۰۰ رأس حیوان",
        ps: "۲۱۰,۰۰۰ څاروي واکسین او د چینجیو ضد درمل ورکړل شول",
      },
      {
        en: "34 beekeeping cooperatives producing 41 MT honey/year",
        fa: "۳۴ تعاونی زنبورداری با تولید ۴۱ تُن عسل در سال",
        ps: "۳۴ د شاتو تعاونۍ چې کلنی ۴۱ ټنه شات تولیدوي",
      },
      {
        en: "Animal mortality reduced by 52% in target districts",
        fa: "کاهش ۵۲ فیصدی تلفات حیوانی در ولسوالی‌های هدف",
        ps: "په هدفي ولسوالیو کې د څارویو مړینه ۵۲٪ راکمه شوه",
      },
    ],
  },
  {
    id: "grape-value",
    category: "value",
    cover: px(31561190),
    gallery: [px(18121334), px(19560749), px(31558798)],
    donor: "GIZ / Mercy Corps – value chain facility",
    year: "2022 – 2025",
    location: {
      en: "Parwan, Kapisa & Kabul provinces",
      fa: "ولایات پروان، کاپیسا و کابل",
      ps: "پروان، کاپیسا او کابل ولایتونه",
    },
    beneficiaries: {
      en: "2,100 grape growers & 60 traders",
      fa: "۲۱۰۰ باغدار انگور و ۶۰ تاجر",
      ps: "۲۱۰۰ د انګورو باغوال او ۶۰ سوداګر",
    },
    title: {
      en: "Grape Trellising & Raisin Value Chain Upgrading",
      fa: "داربست‌سازی تاک انگور و ارتقای زنجیره ارزش کشمش",
      ps: "د انګورو داربست جوړول او د کشمشو د ارزښت زنځیر لوړول",
    },
    short: {
      en: "Converting traditional vineyards to trellis systems and building modern raisin processing and cold-chain capacity.",
      fa: "تبدیل تاکستان‌های سنتی به سیستم داربستی و ایجاد ظرفیت پروسس عصری کشمش و زنجیره سرد.",
      ps: "دودیزو انګورو باغونو ته د داربست سیسټم اړول او د کشمشو د عصري پروسس او سړې زنځیرې ظرفیت جوړول.",
    },
    description: {
      en: "The project converted 780 hectares of traditional bush vineyards into T-shape and Y-shape trellis systems, which lift fruit off the ground, improve air circulation and reduce fungal disease. Growers received concrete posts, galvanised wire, pruning tools and season-long agronomic coaching. Nine raisin processing units were upgraded with mechanical cleaning, grading and vacuum packing lines, and three 200-tonne cold stores were constructed to stabilise farm-gate prices. Business development support helped 60 traders meet buyer requirements for aflatoxin testing and traceability, opening new contracts in regional export markets.",
      fa: "این پروژه ۷۸۰ هکتار تاکستان سنتی بوته‌ای را به سیستم داربستی T و Y تبدیل کرد که میوه را از زمین بلند کرده، جریان هوا را بهبود می‌بخشد و امراض فنگسی را کاهش می‌دهد. باغداران ستون‌های کانکریتی، سیم گلوانیزه، وسایل شاخه‌بری و رهنمایی زراعتی در تمام فصل دریافت نمودند. نُه واحد پروسس کشمش با لین‌های پاک‌کاری میخانیکی، درجه‌بندی و بسته‌بندی ویکیوم ارتقا یافت و سه ذخیره‌گاه سرد ۲۰۰ تُنه اعمار گردید تا قیمت‌های سر باغ ثبات یابد. حمایت انکشاف تجارت به ۶۰ تاجر کمک کرد تا معیارهای آزمایش افلاتوکسین و قابلیت ردیابی را تکمیل کرده و به قراردادهای جدید صادراتی دست یابند.",
      ps: "دې پروژې ۷۸۰ هکتاره دودیز د بوټي شکل انګور باغونه T او Y شکله داربست سیسټمونو ته واړول چې مېوه له ځمکې پورته کوي، د هوا جریان ښه کوي او فنګسي ناروغۍ کموي. باغوالو کانکریټي ستنې، ګالوانایز تار، د څانګه وهنې وسایل او د ټول موسم کرنیز لارښود ترلاسه کړ. نهه د کشمشو پروسس واحدونه د میخانیکي پاکولو، درجه بندۍ او ویکیوم بسته بندۍ لینونو سره لوړ شول او درې ۲۰۰ ټنه سړې زېرمې جوړې شوې. د سوداګرۍ پراختیا ملاتړ ۶۰ سوداګرو سره مرسته وکړه چې د افلاتوکسین ازموینې معیارونه پوره کړي.",
    },
    outcomes: [
      {
        en: "780 ha converted to trellis; yields up 60%",
        fa: "تبدیل ۷۸۰ هکتار به داربست؛ افزایش ۶۰ فیصد حاصلات",
        ps: "۷۸۰ هکتاره داربست ته واړول شول؛ حاصلات ۶۰٪ لوړ شول",
      },
      {
        en: "3 cold stores (600 MT) built and operated locally",
        fa: "اعمار و بهره‌برداری ۳ ذخیره‌گاه سرد به ظرفیت ۶۰۰ تُن",
        ps: "درې سړې زېرمې (۶۰۰ ټنه) جوړې او چلول شوې",
      },
      {
        en: "Grade-A raisin share increased from 22% to 58%",
        fa: "افزایش سهم کشمش درجه یک از ۲۲ به ۵۸ فیصد",
        ps: "د لومړي درجې کشمشو برخه له ۲۲٪ څخه ۵۸٪ ته لوړه شوه",
      },
    ],
  },
  {
    id: "farmer-schools",
    category: "training",
    cover: px(28220703),
    gallery: [px(20445206), px(20458079), px(20527483)],
    donor: "ACTED / Save the Children – resilience programme",
    year: "2018 – 2021",
    location: {
      en: "Kunduz, Takhar & Baghlan provinces",
      fa: "ولایات کندز، تخار و بغلان",
      ps: "کندز، تخار او بغلان ولایتونه",
    },
    beneficiaries: {
      en: "9,700 farmers (41% women)",
      fa: "۹۷۰۰ دهقان (۴۱٪ زنان)",
      ps: "۹۷۰۰ بزګران (۴۱٪ ښځې)",
    },
    title: {
      en: "Farmer Field Schools & Climate-Smart Extension",
      fa: "مکاتب ساحوی دهقانان و ترویج زراعت هوشمند اقلیمی",
      ps: "د بزګرانو ساحوي ښوونځي او د اقلیم سره سم پراختیایي روزنه",
    },
    short: {
      en: "388 season-long field schools teaching climate-smart practices, seed selection and post-harvest handling.",
      fa: "۳۸۸ مکتب ساحوی یک‌فصله برای آموزش شیوه‌های هوشمند اقلیمی، انتخاب تخم و مدیریت بعد از برداشت.",
      ps: "۳۸۸ د یو موسم ساحوي ښوونځي د اقلیم سره سمو کړنو، د تخم ټاکنې او له حاصلاتو وروسته ادارې لپاره.",
    },
    description: {
      en: "Tabiat Gran designed and ran 388 Farmer Field Schools using a learning-by-doing curriculum built around comparative demonstration plots. Each school met weekly through a full cropping season, with farmers comparing conventional practice against climate-smart alternatives: raised-bed planting, laser land levelling, conservation tillage, balanced fertiliser use and drought-tolerant varieties. Separate women's groups, facilitated by female trainers, focused on kitchen gardens, poultry and nutrition. The project also trained 120 government extension staff as master trainers and produced illustrated Dari and Pashto extension materials for low-literacy audiences.",
      fa: "طبیعت گران ۳۸۸ مکتب ساحوی دهقانان را با نصاب «آموزش از طریق عمل» و بر اساس قطعات نمایشی مقایسه‌ای دیزاین و اجرا کرد. هر مکتب در جریان یک فصل مکمل زراعتی هفته‌وار دایر می‌شد و دهقانان شیوه‌های سنتی را با گزینه‌های هوشمند اقلیمی — کشت روی پشته، هموارسازی زمین با لیزر، قلبه حفاظتی، استفاده متوازن کود و واریته‌های مقاوم به خشکسالی — مقایسه می‌نمودند. گروپ‌های جداگانه زنان با تسهیل‌کنندگان زن روی باغچه‌های خانگی، مرغداری و تغذیه تمرکز داشتند. همچنان ۱۲۰ کارمند ترویجی دولت به حیث ماستر ترینر آموزش دیدند و مواد آموزشی مصور به زبان‌های دری و پشتو برای افراد کم‌سواد تهیه شد.",
      ps: "طبیعت ګران ۳۸۸ د بزګرانو ساحوي ښوونځي د «په عمل کې زده کړه» نصاب او پرتلیزو نمایشي ټوټو پر بنسټ ډیزاین او پلي کړل. هر ښوونځی د یوه بشپړ کرنیز موسم په اوږدو کې اونیز جوړېده او بزګرانو دودیزې کړنې د اقلیم سره سمو بدیلونو — پر پُشتو کرل، د ځمکې لیزري همواري، ساتونکې قلبه، متوازن سره کارونه او د وچکالۍ مقاوم ډولونه — سره پرتله کولې. د ښځو جلا ډلې د ښځینه روزونکو په مرسته پر کورنیو باغچو، چرګ پالنې او تغذیې تمرکز کاوه. همدارنګه ۱۲۰ دولتي پراختیایي کارکوونکي د ماسټر ټرینر په توګه وروزل شول او په دري او پښتو انځوریز روزنیز توکي چمتو شول.",
    },
    outcomes: [
      {
        en: "388 field schools completed across 3 provinces",
        fa: "تکمیل ۳۸۸ مکتب ساحوی در ۳ ولایت",
        ps: "په ۳ ولایتونو کې ۳۸۸ ساحوي ښوونځي بشپړ شول",
      },
      {
        en: "Adoption of at least 3 new practices by 76% of graduates",
        fa: "تطبیق حداقل ۳ شیوه جدید توسط ۷۶٪ فارغان",
        ps: "د فارغانو ۷۶٪ لږ تر لږه ۳ نوې کړنې پلي کړې",
      },
      {
        en: "120 government extension officers trained as trainers",
        fa: "آموزش ۱۲۰ مامور ترویجی دولت به حیث ترینر",
        ps: "۱۲۰ دولتي پراختیایي کارکوونکي د روزونکو په توګه وروزل شول",
      },
    ],
  },
];

export const partners = {
  un: [
    "FAO",
    "WFP",
    "UNDP",
    "UNOPS",
    "UNHCR",
    "IOM",
    "UNICEF",
    "UN Women",
    "UNEP",
    "UNAMA",
  ],
  ingo: [
    "Aga Khan Foundation",
    "Mercy Corps",
    "ACTED",
    "Save the Children",
    "GIZ",
    "Concern Worldwide",
    "Welthungerhilfe",
    "NRC",
    "Islamic Relief",
    "CARE International",
  ],
  nngo: [
    "DACAAR",
    "AKDN Afghanistan",
    "CHA",
    "AREA",
    "ARAA",
    "MAIL (Ministry of Agriculture)",
    "NHLP",
    "Afghanaid",
  ],
};

export const stats = [
  { value: "16+", key: "stats.years" },
  { value: "120+", key: "stats.projects" },
  { value: "24", key: "stats.provinces" },
  { value: "65,000+", key: "stats.farmers" },
];
