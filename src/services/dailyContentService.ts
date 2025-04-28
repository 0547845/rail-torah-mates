
import axios from 'axios';
import { useEffect, useState } from 'react';

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  source?: string;
  category: 'halacha' | 'chasidut' | 'parasha';
  date: string;
  timestamp: number;
}

export interface DailyContentData {
  halacha: ContentItem[];
  chasidut: ContentItem[];
  parasha: ContentItem[];
}

// Service for fetching daily Torah content
// In a production app, this would connect to a real API with updated content
const dailyContentService = {
  // Get all daily content for the current date
  getDailyContent: async (): Promise<DailyContentData> => {
    try {
      // In a real app, this would call your backend API
      // const response = await axios.get('/api/daily-content');
      // return response.data;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get current Hebrew date
      const hebrewDate = getHebrewDateString();
      
      // Generate content with current date
      return generateMockContent(hebrewDate);
    } catch (error) {
      console.error("Error fetching daily content:", error);
      throw new Error("שגיאה בטעינת התוכן היומי");
    }
  },
  
  // Get content by specific category
  getContentByCategory: async (category: 'halacha' | 'chasidut' | 'parasha'): Promise<ContentItem[]> => {
    try {
      // In a real app, this would call your backend API with the category
      // const response = await axios.get(`/api/content/${category}`);
      // return response.data;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Get current Hebrew date
      const hebrewDate = getHebrewDateString();
      
      // Get all content and return only the specific category
      const allContent = generateMockContent(hebrewDate);
      return allContent[category] || [];
    } catch (error) {
      console.error(`Error fetching ${category} content:`, error);
      throw new Error(`שגיאה בטעינת תוכן ${category}`);
    }
  },
  
  // Get specific content item by ID
  getContentById: async (id: string): Promise<ContentItem | null> => {
    try {
      // In a real app, this would call your backend API with the ID
      // const response = await axios.get(`/api/content/item/${id}`);
      // return response.data;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Get all content
      const allContent = generateMockContent();
      
      // Search for the item across categories
      const categories = ['halacha', 'chasidut', 'parasha'] as const;
      for (const category of categories) {
        const item = allContent[category].find(item => item.id === id);
        if (item) {
          return item;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching content item:", error);
      throw new Error("שגיאה בטעינת פריט תוכן");
    }
  }
};

// Helper function to generate Hebrew date string
function getHebrewDateString(): string {
  // In a real app, you would use a Hebrew calendar library like Hebcal or call an API
  // For now, we'll simulate it
  
  const date = new Date();
  
  // Mock Hebrew months
  const hebrewMonths = [
    'ניסן', 'אייר', 'סיוון', 'תמוז', 'אב', 'אלול',
    'תשרי', 'חשוון', 'כסלו', 'טבת', 'שבט', 'אדר'
  ];
  
  // Calculate a "mock" Hebrew date based on Gregorian date (this is not accurate)
  const day = ((date.getDate() + 10) % 30) + 1;
  const monthIndex = (date.getMonth() + 7) % 12;
  const month = hebrewMonths[monthIndex];
  
  // Format: "יז בניסן תשפ״ג"
  return `${getHebrewDayString(day)} ב${month} תשפ״ג`;
}

// Helper function to convert number to Hebrew day format
function getHebrewDayString(day: number): string {
  // Hebrew numerals for 1-30
  const hebrewNumerals = [
    'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י',
    'יא', 'יב', 'יג', 'יד', 'טו', 'טז', 'יז', 'יח', 'יט', 'כ',
    'כא', 'כב', 'כג', 'כד', 'כה', 'כו', 'כז', 'כח', 'כט', 'ל'
  ];
  
  return hebrewNumerals[day - 1];
}

// Helper function to generate mock content based on date
function generateMockContent(hebrewDate = ''): DailyContentData {
  const date = hebrewDate || getHebrewDateString();
  const timestamp = Date.now();
  
  // Mock data for daily Torah content
  return {
    halacha: [
      {
        id: `hal_${timestamp}_1`,
        title: 'הלכות ברכות השחר',
        content: `לפני תחילת היום יברך אדם את ברכות השחר, כולל "ברוך שאמר", "אשרי", "ישתבח", "יוצר אור", "אהבת עולם", קריאת שמע וברכותיה. יש הנוהגים לומר את ברכות השחר מיד כשקמים ממיטתם, ויש הנוהגים לאומרם בבית הכנסת.`,
        source: 'שולחן ערוך אורח חיים סימן מו',
        category: 'halacha',
        date,
        timestamp
      },
      {
        id: `hal_${timestamp}_2`,
        title: 'כוונה בתפילה',
        content: `המתפלל צריך שיכוון בכל הברכות, ואם אינו יכול לכוון בכולן לפחות יכוון באבות. אמרו חכמים, לעולם ימוד אדם את עצמו, אם יכול לכוון את ליבו - יתפלל, ואם לאו - אל יתפלל.`,
        source: 'רמב"ם הלכות תפילה פרק ד',
        category: 'halacha',
        date,
        timestamp
      },
      {
        id: `hal_${timestamp}_3`,
        title: 'הלכות תפילת שמונה עשרה',
        content: `בתפילת שמונה עשרה עומדים ברגליים צמודות, כאילו אדם עומד לפני מלך. יש לכוון במיוחד בברכה ראשונה, ואם לא כיוון - חוזר ומתפלל. אין לענות אמן בתוך שמונה עשרה, אפילו באמצע הפרק.`,
        source: 'שולחן ערוך אורח חיים סימן צח',
        category: 'halacha',
        date,
        timestamp
      }
    ],
    chasidut: [
      {
        id: `chas_${timestamp}_1`,
        title: 'שמחה בעבודת השם',
        content: `העבודה מתוך שמחה היא יסוד גדול בדרך החסידות. אמר רבי נחמן מברסלב: "מצווה גדולה להיות בשמחה תמיד" (ליקוטי מוהר"ן ב, כד). השמחה מעלה את האדם למדרגות רוחניות גבוהות ומאפשרת לו להתגבר על כל המניעות והמכשולים.`,
        source: 'ליקוטי מוהר"ן',
        category: 'chasidut',
        date,
        timestamp
      },
      {
        id: `chas_${timestamp}_2`,
        title: 'עבודת הביטול',
        content: `יסוד מרכזי בתורת החסידות הוא ביטול האני והישות העצמית. כאשר האדם מבטל את עצמו לפני הבורא, הוא זוכה להיות כלי להשראת השכינה. האדמו"ר הזקן כותב בתניא: "שאין שום מציאות בעולם מלבדו יתברך, וזהו עניין ביטול במציאות".`,
        source: 'תניא, שער היחוד והאמונה',
        category: 'chasidut',
        date,
        timestamp
      },
      {
        id: `chas_${timestamp}_3`,
        title: 'אהבת ישראל',
        content: `אהבת ישראל היא מיסודי החסידות. הבעל שם טוב אמר שיש לאהוב את הרשע הגדול ביותר כמו את הצדיק הגדול ביותר, כי כולם בנים למקום. אהבת ישראל היא הבסיס לאחדות בעם ישראל ולגאולה העתידה.`,
        source: 'כתר שם טוב',
        category: 'chasidut',
        date,
        timestamp
      }
    ],
    parasha: [
      {
        id: `par_${timestamp}_1`,
        title: 'יסודות בפרשת השבוע',
        content: `בפרשת השבוע אנו לומדים על מעשי האבות שהם סימן לבנים. כל סיפור מלמד אותנו הוראה לחיים, כפי שאמרו חז"ל: "מעשה אבות סימן לבנים". עלינו להתבונן בכל פרשה ולהפיק ממנה לקחים לחיי היומיום שלנו.`,
        source: 'מדרש תנחומא',
        category: 'parasha',
        date,
        timestamp
      },
      {
        id: `par_${timestamp}_2`,
        title: 'סגולות פרשת השבוע',
        content: `אמרו חז"ל: "לעולם ישלים אדם פרשיותיו עם הציבור שנים מקרא ואחד תרגום". קריאת פרשת השבוע מחברת את האדם לזמן הרוחני של השבוע ומסוגלת להשפיע שפע וברכה. יש הנוהגים לקרוא את הפרשה בערב שבת כהכנה רוחנית לשבת.`,
        source: 'ברכות דף ח',
        category: 'parasha',
        date,
        timestamp
      },
      {
        id: `par_${timestamp}_3`,
        title: 'רמזים וסודות בפרשה',
        content: `התורה נדרשת בפרד"ס - פשט, רמז, דרוש וסוד. בכל פרשה יש משמעויות עמוקות מעבר למובן הפשוט. כפי שאמר דוד המלך: "גל עיני ואביטה נפלאות מתורתך". העיון בפנימיות התורה מגלה רבדים עמוקים של קדושה ואלוקות.`,
        source: 'זוהר הקדוש',
        category: 'parasha',
        date,
        timestamp
      }
    ]
  };
}

export default dailyContentService;
