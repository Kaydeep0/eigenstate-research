/** Money in Motion author / LinkedIn surfaces (public). */
export const MIM_AUTHOR = {
  name: 'Kirandeep Kaur Sekhon',
  shortName: 'Kiran',
  linkedinProfile: 'https://www.linkedin.com/in/ksekhon44/',
  linkedinNewsletter:
    'https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7054180694628995073',
} as const;

/** §23 — human publication CTA only. No UTM. */
export const MIM_SUBSCRIBE = {
  label: 'Subscribe to Money in Motion on LinkedIn',
  href: MIM_AUTHOR.linkedinNewsletter,
} as const;
