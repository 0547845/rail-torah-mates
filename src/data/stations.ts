
export interface Station {
  id: string;
  name: string;
  region: 'north' | 'center' | 'south' | 'jerusalem';
}

export const stations: Station[] = [
  // Northern stations
  { id: 'nahariya', name: 'נהריה', region: 'north' },
  { id: 'acre', name: 'עכו', region: 'north' },
  { id: 'kiryat-motzkin', name: 'קרית מוצקין', region: 'north' },
  { id: 'kiryat-haim', name: 'קרית חיים', region: 'north' },
  { id: 'hof-hacarmel', name: 'חוף הכרמל', region: 'north' },
  { id: 'haifa-center', name: 'חיפה מרכז', region: 'north' },
  { id: 'haifa-bat-galim', name: 'חיפה בת גלים', region: 'north' },
  { id: 'haifa-hof-hacarmel', name: 'חיפה חוף הכרמל', region: 'north' },
  { id: 'atlit', name: 'עתלית', region: 'north' },
  { id: 'binyamina', name: 'בנימינה', region: 'north' },
  { id: 'caesarea-pardes-hanna', name: 'קיסריה פרדס חנה', region: 'north' },
  { id: 'hadera-west', name: 'חדרה מערב', region: 'north' },
  
  // Central stations
  { id: 'netanya', name: 'נתניה', region: 'center' },
  { id: 'bet-yehoshua', name: 'בית יהושע', region: 'center' },
  { id: 'herzliya', name: 'הרצליה', region: 'center' },
  { id: 'tel-aviv-university', name: 'תל אביב אוניברסיטה', region: 'center' },
  { id: 'tel-aviv-savidor-center', name: 'תל אביב סבידור מרכז', region: 'center' },
  { id: 'tel-aviv-hashalom', name: 'תל אביב השלום', region: 'center' },
  { id: 'tel-aviv-hahagana', name: 'תל אביב ההגנה', region: 'center' },
  { id: 'bnei-brak', name: 'בני ברק', region: 'center' },
  { id: 'petah-tikva-segula', name: 'פתח תקווה סגולה', region: 'center' },
  { id: 'petah-tikva-kiryat-arye', name: 'פתח תקווה קרית אריה', region: 'center' },
  { id: 'rosh-haayin-north', name: 'ראש העין צפון', region: 'center' },
  { id: 'kfar-saba-nordau', name: 'כפר סבא נורדאו', region: 'center' },
  { id: 'hod-hasharon-sokolov', name: 'הוד השרון סוקולוב', region: 'center' },
  
  // Southern stations
  { id: 'bat-yam-yoseftal', name: 'בת ים יוספטל', region: 'south' },
  { id: 'bat-yam-komemiyut', name: 'בת ים קוממיות', region: 'south' },
  { id: 'holon-junction', name: 'חולון צומת', region: 'south' },
  { id: 'holon-wolfson', name: 'חולון וולפסון', region: 'south' },
  { id: 'rishon-lezion-moshe-dayan', name: 'ראשון לציון משה דיין', region: 'south' },
  { id: 'rishon-lezion-harishonim', name: 'ראשון לציון הראשונים', region: 'south' },
  { id: 'yavne-east', name: 'יבנה מזרח', region: 'south' },
  { id: 'ashdod-ad-halom', name: 'אשדוד עד הלום', region: 'south' },
  { id: 'ashkelon', name: 'אשקלון', region: 'south' },
  { id: 'beer-sheva-north', name: 'באר שבע צפון', region: 'south' },
  { id: 'beer-sheva-center', name: 'באר שבע מרכז', region: 'south' },
  { id: 'dimona', name: 'דימונה', region: 'south' },
  
  // Jerusalem line stations
  { id: 'lod', name: 'לוד', region: 'center' },
  { id: 'ramla', name: 'רמלה', region: 'center' },
  { id: 'bet-shemesh', name: 'בית שמש', region: 'jerusalem' },
  { id: 'jerusalem-malha', name: 'ירושלים מלחה', region: 'jerusalem' },
  { id: 'jerusalem-yitzhak-navon', name: 'ירושלים יצחק נבון', region: 'jerusalem' }
];
