
export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const topics: Topic[] = [
  {
    id: 'talmud',
    name: 'תלמוד',
    description: 'לימוד והעמקה בתלמוד הבבלי והירושלמי',
    icon: '📚'
  },
  {
    id: 'halacha',
    name: 'הלכה',
    description: 'לימוד הלכות יומיומיות ומעשיות',
    icon: '📜'
  },
  {
    id: 'mishna',
    name: 'משנה',
    description: 'לימוד משניות ופרקי אבות',
    icon: '📖'
  },
  {
    id: 'chumash',
    name: 'חומש (פרשת שבוע)',
    description: 'לימוד פרשת השבוע ומפרשים',
    icon: '🕯️'
  },
  {
    id: 'chassidut',
    name: 'חסידות',
    description: 'לימוד תורת החסידות והדרכותיה',
    icon: '✨'
  },
  {
    id: 'general',
    name: 'כללי',
    description: 'לימוד נושאים כלליים בתורה ויהדות',
    icon: '🌟'
  }
];
