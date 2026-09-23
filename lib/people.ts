export type SocialKind = "linkedin" | "instagram" | "website" | "github";

export type SocialLink = {
  kind: SocialKind;
  label: string;
  url: string;
};

export type SocialEnvDefinition = {
  kind: SocialKind;
  label: string;
  env: string;
};

export type PersonDefinition = {
  slug: string;
  displayName: string;
  givenName: string;
  familyName: string;
  initials: string;
  role: string;
  summary: string;
  phoneEnv: string;
  emailEnv: string;
  socials?: SocialLink[];
  socialEnvs?: SocialEnvDefinition[];
};

export type Person = Omit<PersonDefinition, "socialEnvs"> & {
  phone?: string;
  email?: string;
};

export const company = {
  name: "UpcyTech",
  website: "https://upcytech.com/tr",
  linkedin: "https://www.linkedin.com/company/upcytech/",
  location: "İstanbul, Türkiye",
  address: {
    street: "Reşitpaşa Mah. Katar Cad. İTÜ Tasarım ve Prototip Merkezi Binası No: 2/41 İç Kapı No: 19",
    postalCode: "34467",
    city: "Sarıyer",
    region: "İstanbul",
    country: "Türkiye",
  },
};

const commonSocialEnvs = (key: string): SocialEnvDefinition[] => [
  { kind: "linkedin", label: "LinkedIn", env: `UPCY_CONTACT_${key}_LINKEDIN` },
  { kind: "instagram", label: "Instagram", env: `UPCY_CONTACT_${key}_INSTAGRAM` },
];

const people: PersonDefinition[] = [
  {
    slug: "cagatay",
    displayName: "Cevat Çağatay Şentürk",
    givenName: "Cevat Çağatay",
    familyName: "Şentürk",
    initials: "CÇ",
    role: "Kurucu Ortak & Ürün Yöneticisi",
    summary: "Ürün yönetimi ve ürün kararlarından sorumludur.",
    phoneEnv: "UPCY_CONTACT_CAGATAY_PHONE",
    emailEnv: "UPCY_CONTACT_CAGATAY_EMAIL",
    socials: [
      { kind: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/cagataysntrkk" },
    ],
    socialEnvs: [
      { kind: "instagram", label: "Instagram", env: "UPCY_CONTACT_CAGATAY_INSTAGRAM" },
    ],
  },
  {
    slug: "enes",
    displayName: "Enes Özkan",
    givenName: "Enes",
    familyName: "Özkan",
    initials: "EÖ",
    role: "Kurucu Ortak & İş Geliştirme",
    summary: "İş geliştirme ve müşteri ilişkilerinden sorumludur.",
    phoneEnv: "UPCY_CONTACT_ENES_PHONE",
    emailEnv: "UPCY_CONTACT_ENES_EMAIL",
    socialEnvs: commonSocialEnvs("ENES"),
  },
  {
    slug: "hulusi",
    displayName: "Muhammed Hulusi Aydoğan",
    givenName: "Muhammed Hulusi",
    familyName: "Aydoğan",
    initials: "HA",
    role: "Kurucu Ortak & Finans Direktörü",
    summary: "Finans süreçlerinden sorumludur.",
    phoneEnv: "UPCY_CONTACT_HULUSI_PHONE",
    emailEnv: "UPCY_CONTACT_HULUSI_EMAIL",
    socials: [
      {
        kind: "linkedin",
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/muhammed-hulusi-aydo%C4%9Fan-bb7678300",
      },
    ],
    socialEnvs: [
      { kind: "instagram", label: "Instagram", env: "UPCY_CONTACT_HULUSI_INSTAGRAM" },
    ],
  },
  {
    slug: "harun",
    displayName: "A. Harun Öztürk",
    givenName: "A. Harun",
    familyName: "Öztürk",
    initials: "HÖ",
    role: "Kurucu Ortak & Teknoloji Lideri",
    summary: "Teknoloji yönü ve teknik kararlardan sorumludur.",
    phoneEnv: "UPCY_CONTACT_HARUN_PHONE",
    emailEnv: "UPCY_CONTACT_HARUN_EMAIL",
    socialEnvs: commonSocialEnvs("HARUN"),
  },
  {
    slug: "hamza",
    displayName: "Yusuf Hamza Çelebi",
    givenName: "Yusuf Hamza",
    familyName: "Çelebi",
    initials: "YH",
    role: "Kurucu Ortak & Yazılım Geliştirici",
    summary: "Yazılım geliştirme ve teknik uygulamadan sorumludur.",
    phoneEnv: "UPCY_CONTACT_HAMZA_PHONE",
    emailEnv: "UPCY_CONTACT_HAMZA_EMAIL",
    socials: [
      { kind: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/yhcelebi" },
      { kind: "github", label: "GitHub", url: "https://github.com/yhcelebi" },
    ],
    socialEnvs: [
      { kind: "instagram", label: "Instagram", env: "UPCY_CONTACT_HAMZA_INSTAGRAM" },
    ],
  },
];

export const personSlugs = people.map((person) => person.slug);

export function listPeople(): PersonDefinition[] {
  return people;
}

export function getPerson(slug: string): Person | undefined {
  const definition = people.find((person) => person.slug === slug);
  if (!definition) return undefined;

  const phone = process.env[definition.phoneEnv]?.trim();
  const email = process.env[definition.emailEnv]?.trim();
  const envSocials = (definition.socialEnvs ?? [])
    .map((social): SocialLink | null => {
      const url = process.env[social.env]?.trim();
      return url ? { kind: social.kind, label: social.label, url } : null;
    })
    .filter((social): social is SocialLink => social !== null);

  const { socialEnvs: _socialEnvs, ...rest } = definition;

  return {
    ...rest,
    phone: phone || undefined,
    email: email || undefined,
    socials: [...(definition.socials ?? []), ...envSocials],
  };
}
