export type SocialKind = "linkedin" | "instagram" | "website" | "github";

export type SocialLink = {
  kind: SocialKind;
  label: string;
  url: string;
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
};

export type Person = PersonDefinition & {
  phone?: string;
  email?: string;
};

export const company = {
  name: "UpcyTech",
  website: "https://upcytech.com/tr",
  linkedin: "https://www.linkedin.com/company/upcytech/",
  location: "İstanbul, Türkiye",
};

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

  return {
    ...definition,
    phone: phone || undefined,
    email: email || undefined,
  };
}
