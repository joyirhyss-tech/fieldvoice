/** Equity-focused motivational quotes — rotating daily */

export interface QuoteEntry {
  text: string;
  attribution: string;
}

const QUOTES: QuoteEntry[] = [
  {
    text: 'The most common way people give up their power is by thinking they don\'t have any.',
    attribution: 'Alice Walker',
  },
  {
    text: 'When we listen and celebrate what is both common and different, we become wiser, more inclusive, and better as an organization.',
    attribution: 'Pat Wadors',
  },
  {
    text: 'Diversity is being invited to the party; inclusion is being asked to dance.',
    attribution: 'Verna Myers',
  },
  {
    text: 'If you want to go fast, go alone. If you want to go far, go together.',
    attribution: 'African Proverb',
  },
  {
    text: 'The measure of a community is found in how it treats its most vulnerable members.',
    attribution: 'Adapted from Mahatma Gandhi',
  },
  {
    text: 'People will forget what you said, people will forget what you did, but people will never forget how you made them feel.',
    attribution: 'Maya Angelou',
  },
  {
    text: 'Every voice matters. Every story counts. Every person deserves to be heard.',
    attribution: 'FieldVoices',
  },
  {
    text: 'Change will not come if we wait for some other person or some other time. We are the ones we\'ve been waiting for.',
    attribution: 'Barack Obama',
  },
  {
    text: 'Listening is an act of love.',
    attribution: 'Dave Isay',
  },
  {
    text: 'The single biggest problem in communication is the illusion that it has taken place.',
    attribution: 'George Bernard Shaw',
  },
  {
    text: 'When you know better, you do better.',
    attribution: 'Maya Angelou',
  },
  {
    text: 'Leadership is not about being in charge. It is about taking care of those in your charge.',
    attribution: 'Simon Sinek',
  },
  {
    text: 'In the middle of difficulty lies opportunity.',
    attribution: 'Albert Einstein',
  },
  {
    text: 'We don\'t have to engage in grand, heroic actions to participate in change. Small acts, multiplied by millions, can transform the world.',
    attribution: 'Howard Zinn',
  },
  {
    text: 'Real change, enduring change, happens one step at a time.',
    attribution: 'Ruth Bader Ginsburg',
  },
  {
    text: 'Equity is not just about equal access. It\'s about creating conditions where everyone can thrive.',
    attribution: 'FieldVoices',
  },
  {
    text: 'Service to others is the rent you pay for your room here on Earth.',
    attribution: 'Muhammad Ali',
  },
  {
    text: 'Alone we can do so little; together we can do so much.',
    attribution: 'Helen Keller',
  },
];

/**
 * Returns a quote that rotates daily based on the current date.
 * Same quote appears all day, changes at midnight.
 */
export function getRotatingQuote(): QuoteEntry {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}
