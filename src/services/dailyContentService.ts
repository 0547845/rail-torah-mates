
import axios from 'axios';

// Types for the daily content
export interface ContentItem {
  id: string;
  title: string;
  content: string;
  source: string;
  category: string;
  date: string;
}

export interface DailyContentResponse {
  halacha: ContentItem[];
  chasidut: ContentItem[];
  parasha: ContentItem[];
}

const API_URL = process.env.REACT_APP_API_URL || 'https://api.yourservice.com';

class DailyContentService {
  // Get daily content
  async getDailyContent(): Promise<DailyContentResponse> {
    try {
      // In a real implementation, this would be an API call
      // return (await axios.get(`${API_URL}/daily-content`)).data;
      
      // For now, return mock data
      return this.getMockData();
    } catch (error) {
      console.error('Error fetching daily content:', error);
      return this.getMockData();
    }
  }

  // Get specific content by category
  async getContentByCategory(category: 'halacha' | 'chasidut' | 'parasha'): Promise<ContentItem[]> {
    try {
      // In a real implementation, this would be an API call
      // return (await axios.get(`${API_URL}/content/${category}`)).data;
      
      // For now, return mock data
      return this.getMockData()[category];
    } catch (error) {
      console.error(`Error fetching ${category} content:`, error);
      return this.getMockData()[category];
    }
  }

  // Mock data provider - this would be replaced with actual API calls
  private getMockData(): DailyContentResponse {
    const today = new Date().toLocaleDateString('he-IL');
    
    return {
      halacha: [
        {
          id: 'hal1',
          title: 'ברכות הנהנין',
          content: 'כל האוכל או השותה ונהנה חייב לברך לפני שיהנה. המברך על פרי העץ מברך "בורא פרי העץ", ועל פרי האדמה "בורא פרי האדמה"...',
          source: 'שולחן ערוך אורח חיים סימן רב',
          category: 'הלכה',
          date: today
        },
        {
          id: 'hal2',
          title: 'הלכות תפילה',
          content: 'זמן תפילת שחרית מתחיל מעלות השחר, וזמנה הראוי מהנץ החמה עד סוף שליש היום...',
          source: 'שולחן ערוך אורח חיים סימן פט',
          category: 'הלכה',
          date: today
        }
      ],
      chasidut: [
        {
          id: 'chas1',
          title: 'מידת הענווה',
          content: 'אמר רבי חייא בר אשי אמר רב תלמיד חכם צריך שיהא בו אחד משמונה בשמינית בגאווה, כדי שלא ינהגו בו קלות ראש. אבל המידה הראויה היא מידת הענווה...',
          source: 'ליקוטי מוהר"ן, סימן קצז',
          category: 'חסידות',
          date: today
        },
        {
          id: 'chas2',
          title: 'עבודת ה\' בשמחה',
          content: 'עיקר עבודת ה\' הוא להיות בשמחה תמיד, להתגבר להרחיק העצבות והמרה שחורה בכל כוחו...',
          source: 'התניא, שער היחוד והאמונה',
          category: 'חסידות',
          date: today
        }
      ],
      parasha: [
        {
          id: 'par1',
          title: 'פרשת השבוע - עיון',
          content: 'בפרשתנו אנו לומדים על מעשה העגל וי"ג מידות הרחמים. נראה כיצד גם אחרי חטא כה חמור, השם מלמד אותנו את דרכי הסליחה והתשובה...',
          source: 'דרשות הר"ן',
          category: 'פרשת השבוע',
          date: today
        },
        {
          id: 'par2',
          title: 'רעיון לשולחן שבת',
          content: 'המשכן הוא דוגמא כיצד האדם יכול להפוך את חייו למקום ראוי להשראת השכינה, דרך המעשים הקטנים היומיומיים...',
          source: 'שפת אמת',
          category: 'פרשת השבוע',
          date: today
        }
      ]
    };
  }
}

export default new DailyContentService();
