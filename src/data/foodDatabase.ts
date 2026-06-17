export interface FoodItem {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  defaultUnit: string;
  availableUnits: string[];
  nutritionPer100g: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
    iron: number;
    calcium: number;
    vitaminC: number;
  };
  pieceWeightG?: number;
}

export const unitLabels: Record<string, string> = {
  piece: 'حبة',
  gram: 'غرام',
  kg: 'كيلو',
  cup: 'كوب',
  tbsp: 'ملعقة كبيرة',
  tsp: 'ملعقة صغيرة',
  slice: 'شريحة',
  ml: 'مل',
  liter: 'لتر',
  scoop: 'سكوب',
  can: 'علبة',
  bowl: 'صحن',
};

export const unitToGrams: Record<string, number> = {
  gram: 1,
  kg: 1000,
  cup: 240,
  tbsp: 15,
  tsp: 5,
  ml: 1,
  liter: 1000,
  slice: 30,
  scoop: 30,
  can: 330,
  bowl: 300,
};

export const categories = [
  { id: 'vegetables', name: 'خضروات', emoji: '🥦' },
  { id: 'fruits', name: 'فواكه', emoji: '🍎' },
  { id: 'grains', name: 'حبوب ونشويات', emoji: '🌾' },
  { id: 'protein', name: 'بروتينات ولحوم', emoji: '🥩' },
  { id: 'seafood', name: 'أسماك ومأكولات بحرية', emoji: '🐟' },
  { id: 'dairy', name: 'ألبان وأجبان', emoji: '🥛' },
  { id: 'oils', name: 'زيوت ودهون', emoji: '🫒' },
  { id: 'nuts', name: 'مكسرات وبذور', emoji: '🥜' },
  { id: 'legumes', name: 'بقوليات', emoji: '🫘' },
  { id: 'beverages', name: 'مشروبات', emoji: '☕' },
  { id: 'sweets', name: 'حلويات وسكريات', emoji: '🍰' },
  { id: 'snacks', name: 'وجبات خفيفة', emoji: '🍿' },
  { id: 'sauces', name: 'صلصات وتوابل', emoji: '🥫' },
  { id: 'prepared', name: 'أطباق جاهزة', emoji: '🍲' },
  { id: 'supplements', name: 'مكملات غذائية', emoji: '💊' },
];

export const foodDatabase: FoodItem[] = [
  // ╔══════════════════════════════════════════════╗
  // ║              🥦 خضروات                       ║
  // ╚══════════════════════════════════════════════╝
  { id: 'tomato', name: 'Tomato', nameAr: 'بندورة / طماطم', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'kg', 'cup'], nutritionPer100g: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sugar: 2.6, sodium: 5, iron: 0.3, calcium: 10, vitaminC: 14 }, pieceWeightG: 123 },
  { id: 'cucumber', name: 'Cucumber', nameAr: 'خيار', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'kg', 'cup'], nutritionPer100g: { calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, sugar: 1.7, sodium: 2, iron: 0.3, calcium: 16, vitaminC: 2.8 }, pieceWeightG: 201 },
  { id: 'onion', name: 'Onion', nameAr: 'بصل', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'kg', 'cup'], nutritionPer100g: { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7, sugar: 4.2, sodium: 4, iron: 0.2, calcium: 23, vitaminC: 7.4 }, pieceWeightG: 110 },
  { id: 'potato', name: 'Potato', nameAr: 'بطاطا', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'kg'], nutritionPer100g: { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2, sugar: 0.8, sodium: 6, iron: 0.8, calcium: 12, vitaminC: 19.7 }, pieceWeightG: 150 },
  { id: 'sweet_potato', name: 'Sweet Potato', nameAr: 'بطاطا حلوة', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'kg'], nutritionPer100g: { calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, sugar: 4.2, sodium: 55, iron: 0.6, calcium: 30, vitaminC: 2.4 }, pieceWeightG: 130 },
  { id: 'carrot', name: 'Carrot', nameAr: 'جزر', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'kg', 'cup'], nutritionPer100g: { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, sugar: 4.7, sodium: 69, iron: 0.3, calcium: 33, vitaminC: 5.9 }, pieceWeightG: 72 },
  { id: 'pepper_green', name: 'Green Pepper', nameAr: 'فلفل أخضر حلو', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'kg'], nutritionPer100g: { calories: 20, protein: 0.9, carbs: 4.6, fat: 0.2, fiber: 1.7, sugar: 2.4, sodium: 3, iron: 0.3, calcium: 10, vitaminC: 80 }, pieceWeightG: 120 },
  { id: 'pepper_red', name: 'Red Pepper', nameAr: 'فلفل أحمر حلو', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'kg'], nutritionPer100g: { calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1, sugar: 4.2, sodium: 4, iron: 0.4, calcium: 7, vitaminC: 128 }, pieceWeightG: 120 },
  { id: 'pepper_yellow', name: 'Yellow Pepper', nameAr: 'فلفل أصفر حلو', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'kg'], nutritionPer100g: { calories: 27, protein: 1, carbs: 6.3, fat: 0.2, fiber: 0.9, sugar: 0, sodium: 2, iron: 0.5, calcium: 11, vitaminC: 184 }, pieceWeightG: 120 },
  { id: 'hot_pepper', name: 'Hot Pepper', nameAr: 'فلفل حار', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 40, protein: 1.9, carbs: 9, fat: 0.4, fiber: 1.5, sugar: 5.3, sodium: 9, iron: 1, calcium: 14, vitaminC: 144 }, pieceWeightG: 45 },
  { id: 'lettuce', name: 'Lettuce', nameAr: 'خس', category: 'vegetables', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'piece'], nutritionPer100g: { calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 1.3, sugar: 0.8, sodium: 28, iron: 0.9, calcium: 36, vitaminC: 9.2 }, pieceWeightG: 300 },
  { id: 'spinach', name: 'Spinach', nameAr: 'سبانخ', category: 'vegetables', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'kg'], nutritionPer100g: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4, sodium: 79, iron: 2.7, calcium: 99, vitaminC: 28 } },
  { id: 'eggplant', name: 'Eggplant', nameAr: 'باذنجان', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'kg'], nutritionPer100g: { calories: 25, protein: 1, carbs: 6, fat: 0.2, fiber: 3, sugar: 3.5, sodium: 2, iron: 0.2, calcium: 9, vitaminC: 2.2 }, pieceWeightG: 82 },
  { id: 'zucchini', name: 'Zucchini', nameAr: 'كوسا', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'kg'], nutritionPer100g: { calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1, sugar: 2.5, sodium: 8, iron: 0.4, calcium: 16, vitaminC: 17.9 }, pieceWeightG: 196 },
  { id: 'garlic', name: 'Garlic', nameAr: 'ثوم', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'tsp'], nutritionPer100g: { calories: 149, protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1, sugar: 1, sodium: 17, iron: 1.7, calcium: 181, vitaminC: 31 }, pieceWeightG: 3 },
  { id: 'mushroom', name: 'Mushroom', nameAr: 'فطر / مشروم', category: 'vegetables', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'piece'], nutritionPer100g: { calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1, sugar: 2, sodium: 5, iron: 0.5, calcium: 3, vitaminC: 2.1 }, pieceWeightG: 18 },
  { id: 'cabbage', name: 'Cabbage', nameAr: 'ملفوف', category: 'vegetables', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'kg'], nutritionPer100g: { calories: 25, protein: 1.3, carbs: 5.8, fat: 0.1, fiber: 2.5, sugar: 3.2, sodium: 18, iron: 0.5, calcium: 40, vitaminC: 36 } },
  { id: 'red_cabbage', name: 'Red Cabbage', nameAr: 'ملفوف أحمر', category: 'vegetables', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 31, protein: 1.4, carbs: 7.4, fat: 0.2, fiber: 2.1, sugar: 3.8, sodium: 27, iron: 0.8, calcium: 45, vitaminC: 57 } },
  { id: 'broccoli', name: 'Broccoli', nameAr: 'بروكلي', category: 'vegetables', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'piece'], nutritionPer100g: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, sugar: 1.7, sodium: 33, iron: 0.7, calcium: 47, vitaminC: 89 }, pieceWeightG: 600 },
  { id: 'cauliflower', name: 'Cauliflower', nameAr: 'قرنبيط / زهرة', category: 'vegetables', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'piece'], nutritionPer100g: { calories: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2, sugar: 1.9, sodium: 30, iron: 0.4, calcium: 22, vitaminC: 48 }, pieceWeightG: 575 },
  { id: 'corn', name: 'Corn', nameAr: 'ذرة', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'cup', 'gram'], nutritionPer100g: { calories: 86, protein: 3.3, carbs: 19, fat: 1.4, fiber: 2.7, sugar: 6.3, sodium: 15, iron: 0.5, calcium: 2, vitaminC: 6.8 }, pieceWeightG: 90 },
  { id: 'peas', name: 'Green Peas', nameAr: 'بازيلاء', category: 'vegetables', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 81, protein: 5.4, carbs: 14, fat: 0.4, fiber: 5.7, sugar: 5.7, sodium: 5, iron: 1.5, calcium: 25, vitaminC: 40 } },
  { id: 'green_beans', name: 'Green Beans', nameAr: 'فاصوليا خضراء / لوبيا', category: 'vegetables', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 31, protein: 1.8, carbs: 7, fat: 0.1, fiber: 3.4, sugar: 3.3, sodium: 6, iron: 1, calcium: 37, vitaminC: 12 } },
  { id: 'celery', name: 'Celery', nameAr: 'كرفس', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'cup'], nutritionPer100g: { calories: 16, protein: 0.7, carbs: 3, fat: 0.2, fiber: 1.6, sugar: 1.3, sodium: 80, iron: 0.2, calcium: 40, vitaminC: 3.1 }, pieceWeightG: 40 },
  { id: 'radish', name: 'Radish', nameAr: 'فجل', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'cup'], nutritionPer100g: { calories: 16, protein: 0.7, carbs: 3.4, fat: 0.1, fiber: 1.6, sugar: 1.9, sodium: 39, iron: 0.3, calcium: 25, vitaminC: 14.8 }, pieceWeightG: 4.5 },
  { id: 'beet', name: 'Beetroot', nameAr: 'شمندر / بنجر', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'cup'], nutritionPer100g: { calories: 43, protein: 1.6, carbs: 10, fat: 0.2, fiber: 2.8, sugar: 6.8, sodium: 78, iron: 0.8, calcium: 16, vitaminC: 4.9 }, pieceWeightG: 82 },
  { id: 'turnip', name: 'Turnip', nameAr: 'لفت', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 28, protein: 0.9, carbs: 6.4, fat: 0.1, fiber: 1.8, sugar: 3.8, sodium: 67, iron: 0.3, calcium: 30, vitaminC: 21 }, pieceWeightG: 122 },
  { id: 'parsley', name: 'Parsley', nameAr: 'بقدونس', category: 'vegetables', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'tbsp'], nutritionPer100g: { calories: 36, protein: 3, carbs: 6.3, fat: 0.8, fiber: 3.3, sugar: 0.9, sodium: 56, iron: 6.2, calcium: 138, vitaminC: 133 } },
  { id: 'cilantro', name: 'Cilantro', nameAr: 'كزبرة', category: 'vegetables', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'tbsp'], nutritionPer100g: { calories: 23, protein: 2.1, carbs: 3.7, fat: 0.5, fiber: 2.8, sugar: 0.9, sodium: 46, iron: 1.8, calcium: 67, vitaminC: 27 } },
  { id: 'mint', name: 'Mint', nameAr: 'نعناع', category: 'vegetables', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'tbsp'], nutritionPer100g: { calories: 70, protein: 3.8, carbs: 15, fat: 0.9, fiber: 8, sugar: 0, sodium: 31, iron: 5.1, calcium: 243, vitaminC: 32 } },
  { id: 'arugula', name: 'Arugula', nameAr: 'جرجير', category: 'vegetables', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 25, protein: 2.6, carbs: 3.7, fat: 0.7, fiber: 1.6, sugar: 2, sodium: 27, iron: 1.5, calcium: 160, vitaminC: 15 } },
  { id: 'okra', name: 'Okra', nameAr: 'بامية', category: 'vegetables', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 33, protein: 1.9, carbs: 7, fat: 0.2, fiber: 3.2, sugar: 1.5, sodium: 7, iron: 0.6, calcium: 82, vitaminC: 23 } },
  { id: 'artichoke', name: 'Artichoke', nameAr: 'خرشوف / أرضي شوكي', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 47, protein: 3.3, carbs: 11, fat: 0.2, fiber: 5.4, sugar: 1, sodium: 94, iron: 1.3, calcium: 44, vitaminC: 12 }, pieceWeightG: 128 },
  { id: 'asparagus', name: 'Asparagus', nameAr: 'هليون', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'cup'], nutritionPer100g: { calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1, fiber: 2.1, sugar: 1.9, sodium: 2, iron: 2.1, calcium: 24, vitaminC: 5.6 }, pieceWeightG: 16 },
  { id: 'leek', name: 'Leek', nameAr: 'كراث', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 61, protein: 1.5, carbs: 14, fat: 0.3, fiber: 1.8, sugar: 3.9, sodium: 20, iron: 2.1, calcium: 59, vitaminC: 12 }, pieceWeightG: 89 },
  { id: 'spring_onion', name: 'Spring Onion', nameAr: 'بصل أخضر', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'cup'], nutritionPer100g: { calories: 32, protein: 1.8, carbs: 7.3, fat: 0.2, fiber: 2.6, sugar: 2.3, sodium: 16, iron: 1.5, calcium: 72, vitaminC: 19 }, pieceWeightG: 15 },
  { id: 'watercress', name: 'Watercress', nameAr: 'رشاد / جرجير الماء', category: 'vegetables', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 11, protein: 2.3, carbs: 1.3, fat: 0.1, fiber: 0.5, sugar: 0.2, sodium: 41, iron: 0.2, calcium: 120, vitaminC: 43 } },
  { id: 'pumpkin', name: 'Pumpkin', nameAr: 'يقطين / قرع', category: 'vegetables', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'kg'], nutritionPer100g: { calories: 26, protein: 1, carbs: 6.5, fat: 0.1, fiber: 0.5, sugar: 2.8, sodium: 1, iron: 0.8, calcium: 21, vitaminC: 9 } },
  { id: 'avocado', name: 'Avocado', nameAr: 'أفوكادو', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, sugar: 0.7, sodium: 7, iron: 0.6, calcium: 12, vitaminC: 10 }, pieceWeightG: 150 },
  { id: 'olive_green', name: 'Green Olives', nameAr: 'زيتون أخضر', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'cup'], nutritionPer100g: { calories: 145, protein: 1, carbs: 3.8, fat: 15, fiber: 3.3, sugar: 0, sodium: 1556, iron: 0.5, calcium: 52, vitaminC: 0 }, pieceWeightG: 4 },
  { id: 'olive_black', name: 'Black Olives', nameAr: 'زيتون أسود', category: 'vegetables', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'cup'], nutritionPer100g: { calories: 115, protein: 0.8, carbs: 6, fat: 11, fiber: 3.2, sugar: 0, sodium: 735, iron: 3.3, calcium: 88, vitaminC: 0.9 }, pieceWeightG: 4 },
  { id: 'ginger', name: 'Ginger', nameAr: 'زنجبيل طازج', category: 'vegetables', defaultUnit: 'tsp', availableUnits: ['tsp', 'tbsp', 'gram'], nutritionPer100g: { calories: 80, protein: 1.8, carbs: 18, fat: 0.8, fiber: 2, sugar: 1.7, sodium: 13, iron: 0.6, calcium: 16, vitaminC: 5 } },

  // ╔══════════════════════════════════════════════╗
  // ║              🍎 فواكه                         ║
  // ╚══════════════════════════════════════════════╝
  { id: 'apple', name: 'Apple', nameAr: 'تفاح', category: 'fruits', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'kg'], nutritionPer100g: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sugar: 10, sodium: 1, iron: 0.1, calcium: 6, vitaminC: 4.6 }, pieceWeightG: 182 },
  { id: 'banana', name: 'Banana', nameAr: 'موز', category: 'fruits', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'kg'], nutritionPer100g: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12, sodium: 1, iron: 0.3, calcium: 5, vitaminC: 8.7 }, pieceWeightG: 118 },
  { id: 'orange', name: 'Orange', nameAr: 'برتقال', category: 'fruits', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'kg', 'cup'], nutritionPer100g: { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, sugar: 9.4, sodium: 0, iron: 0.1, calcium: 40, vitaminC: 53 }, pieceWeightG: 131 },
  { id: 'watermelon', name: 'Watermelon', nameAr: 'بطيخ أحمر', category: 'fruits', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'kg', 'slice'], nutritionPer100g: { calories: 30, protein: 0.6, carbs: 8, fat: 0.2, fiber: 0.4, sugar: 6.2, sodium: 1, iron: 0.2, calcium: 7, vitaminC: 8.1 } },
  { id: 'cantaloupe', name: 'Cantaloupe', nameAr: 'شمّام', category: 'fruits', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'slice'], nutritionPer100g: { calories: 34, protein: 0.8, carbs: 8.2, fat: 0.2, fiber: 0.9, sugar: 7.9, sodium: 16, iron: 0.2, calcium: 9, vitaminC: 37 } },
  { id: 'grapes', name: 'Grapes', nameAr: 'عنب', category: 'fruits', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'kg'], nutritionPer100g: { calories: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9, sugar: 16, sodium: 2, iron: 0.4, calcium: 10, vitaminC: 3.2 } },
  { id: 'strawberry', name: 'Strawberry', nameAr: 'فراولة', category: 'fruits', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'piece'], nutritionPer100g: { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2, sugar: 4.9, sodium: 1, iron: 0.4, calcium: 16, vitaminC: 59 }, pieceWeightG: 12 },
  { id: 'blueberry', name: 'Blueberry', nameAr: 'توت أزرق', category: 'fruits', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4, sugar: 10, sodium: 1, iron: 0.3, calcium: 6, vitaminC: 9.7 } },
  { id: 'raspberry', name: 'Raspberry', nameAr: 'توت العليق', category: 'fruits', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 52, protein: 1.2, carbs: 12, fat: 0.7, fiber: 6.5, sugar: 4.4, sodium: 1, iron: 0.7, calcium: 25, vitaminC: 26 } },
  { id: 'mango', name: 'Mango', nameAr: 'مانجو', category: 'fruits', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'cup'], nutritionPer100g: { calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, sugar: 14, sodium: 1, iron: 0.2, calcium: 11, vitaminC: 36 }, pieceWeightG: 200 },
  { id: 'pineapple', name: 'Pineapple', nameAr: 'أناناس', category: 'fruits', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'slice'], nutritionPer100g: { calories: 50, protein: 0.5, carbs: 13, fat: 0.1, fiber: 1.4, sugar: 10, sodium: 1, iron: 0.3, calcium: 13, vitaminC: 48 } },
  { id: 'peach', name: 'Peach', nameAr: 'خوخ / دراق', category: 'fruits', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 39, protein: 0.9, carbs: 10, fat: 0.3, fiber: 1.5, sugar: 8.4, sodium: 0, iron: 0.3, calcium: 6, vitaminC: 6.6 }, pieceWeightG: 150 },
  { id: 'apricot', name: 'Apricot', nameAr: 'مشمش', category: 'fruits', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 48, protein: 1.4, carbs: 11, fat: 0.4, fiber: 2, sugar: 9.2, sodium: 1, iron: 0.4, calcium: 13, vitaminC: 10 }, pieceWeightG: 35 },
  { id: 'plum', name: 'Plum', nameAr: 'برقوق', category: 'fruits', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 46, protein: 0.7, carbs: 11, fat: 0.3, fiber: 1.4, sugar: 9.9, sodium: 0, iron: 0.2, calcium: 6, vitaminC: 9.5 }, pieceWeightG: 66 },
  { id: 'cherry', name: 'Cherry', nameAr: 'كرز', category: 'fruits', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 63, protein: 1.1, carbs: 16, fat: 0.2, fiber: 2.1, sugar: 13, sodium: 0, iron: 0.4, calcium: 13, vitaminC: 7 } },
  { id: 'kiwi', name: 'Kiwi', nameAr: 'كيوي', category: 'fruits', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 61, protein: 1.1, carbs: 15, fat: 0.5, fiber: 3, sugar: 9, sodium: 3, iron: 0.3, calcium: 34, vitaminC: 93 }, pieceWeightG: 76 },
  { id: 'dates', name: 'Dates', nameAr: 'تمر', category: 'fruits', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'kg'], nutritionPer100g: { calories: 277, protein: 1.8, carbs: 75, fat: 0.2, fiber: 6.7, sugar: 66, sodium: 1, iron: 0.9, calcium: 64, vitaminC: 0 }, pieceWeightG: 24 },
  { id: 'medjool_dates', name: 'Medjool Dates', nameAr: 'تمر مجدول', category: 'fruits', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 277, protein: 1.8, carbs: 75, fat: 0.2, fiber: 6.7, sugar: 66, sodium: 1, iron: 0.9, calcium: 64, vitaminC: 0 }, pieceWeightG: 24 },
  { id: 'fig', name: 'Fig', nameAr: 'تين', category: 'fruits', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 74, protein: 0.8, carbs: 19, fat: 0.3, fiber: 2.9, sugar: 16, sodium: 1, iron: 0.4, calcium: 35, vitaminC: 2 }, pieceWeightG: 50 },
  { id: 'dried_fig', name: 'Dried Fig', nameAr: 'تين مجفف', category: 'fruits', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 249, protein: 3.3, carbs: 64, fat: 0.9, fiber: 10, sugar: 48, sodium: 10, iron: 2, calcium: 162, vitaminC: 1.2 }, pieceWeightG: 8 },
  { id: 'pomegranate', name: 'Pomegranate', nameAr: 'رمان', category: 'fruits', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'cup'], nutritionPer100g: { calories: 83, protein: 1.7, carbs: 19, fat: 1.2, fiber: 4, sugar: 14, sodium: 3, iron: 0.3, calcium: 10, vitaminC: 10 }, pieceWeightG: 282 },
  { id: 'lemon', name: 'Lemon', nameAr: 'ليمون', category: 'fruits', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'tbsp'], nutritionPer100g: { calories: 29, protein: 1.1, carbs: 9.3, fat: 0.3, fiber: 2.8, sugar: 2.5, sodium: 2, iron: 0.6, calcium: 26, vitaminC: 53 }, pieceWeightG: 58 },
  { id: 'lime', name: 'Lime', nameAr: 'ليمون أخضر', category: 'fruits', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 30, protein: 0.7, carbs: 11, fat: 0.2, fiber: 2.8, sugar: 1.7, sodium: 2, iron: 0.6, calcium: 33, vitaminC: 29 }, pieceWeightG: 67 },
  { id: 'coconut', name: 'Coconut (fresh)', nameAr: 'جوز هند طازج', category: 'fruits', defaultUnit: 'gram', availableUnits: ['gram', 'cup'], nutritionPer100g: { calories: 354, protein: 3.3, carbs: 15, fat: 33, fiber: 9, sugar: 6.2, sodium: 20, iron: 2.4, calcium: 14, vitaminC: 3.3 } },
  { id: 'coconut_dried', name: 'Coconut (dried)', nameAr: 'جوز هند مبشور مجفف', category: 'fruits', defaultUnit: 'gram', availableUnits: ['gram', 'cup', 'tbsp'], nutritionPer100g: { calories: 660, protein: 6.9, carbs: 24, fat: 65, fiber: 16, sugar: 7.3, sodium: 37, iron: 3.3, calcium: 26, vitaminC: 1.5 } },
  { id: 'guava', name: 'Guava', nameAr: 'جوافة', category: 'fruits', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 68, protein: 2.6, carbs: 14, fat: 1, fiber: 5.4, sugar: 8.9, sodium: 2, iron: 0.3, calcium: 18, vitaminC: 228 }, pieceWeightG: 55 },
  { id: 'papaya', name: 'Papaya', nameAr: 'بابايا', category: 'fruits', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'piece'], nutritionPer100g: { calories: 43, protein: 0.5, carbs: 11, fat: 0.3, fiber: 1.7, sugar: 7.8, sodium: 8, iron: 0.3, calcium: 20, vitaminC: 61 }, pieceWeightG: 500 },
  { id: 'pear', name: 'Pear', nameAr: 'كمثرى / إجاص', category: 'fruits', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 57, protein: 0.4, carbs: 15, fat: 0.1, fiber: 3.1, sugar: 10, sodium: 1, iron: 0.2, calcium: 9, vitaminC: 4.3 }, pieceWeightG: 178 },
  { id: 'grapefruit', name: 'Grapefruit', nameAr: 'جريب فروت', category: 'fruits', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'cup'], nutritionPer100g: { calories: 42, protein: 0.8, carbs: 11, fat: 0.1, fiber: 1.6, sugar: 7, sodium: 0, iron: 0.1, calcium: 22, vitaminC: 31 }, pieceWeightG: 246 },
  { id: 'raisins', name: 'Raisins', nameAr: 'زبيب', category: 'fruits', defaultUnit: 'gram', availableUnits: ['gram', 'cup', 'tbsp'], nutritionPer100g: { calories: 299, protein: 3.1, carbs: 79, fat: 0.5, fiber: 3.7, sugar: 59, sodium: 11, iron: 1.9, calcium: 50, vitaminC: 2.3 } },
  { id: 'dried_apricot', name: 'Dried Apricot', nameAr: 'مشمش مجفف / قمر الدين', category: 'fruits', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 241, protein: 3.4, carbs: 63, fat: 0.5, fiber: 7.3, sugar: 53, sodium: 10, iron: 2.7, calcium: 55, vitaminC: 1 }, pieceWeightG: 7 },
  { id: 'prunes', name: 'Prunes', nameAr: 'برقوق مجفف', category: 'fruits', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 240, protein: 2.2, carbs: 64, fat: 0.4, fiber: 7.1, sugar: 38, sodium: 2, iron: 0.9, calcium: 43, vitaminC: 0.6 }, pieceWeightG: 10 },

  // ╔══════════════════════════════════════════════╗
  // ║              🌾 حبوب ونشويات                  ║
  // ╚══════════════════════════════════════════════╝
  { id: 'rice_white_raw', name: 'White Rice (raw)', nameAr: 'أرز أبيض (غير مطبوخ)', category: 'grains', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'kg'], nutritionPer100g: { calories: 365, protein: 7.1, carbs: 80, fat: 0.7, fiber: 1.3, sugar: 0.1, sodium: 5, iron: 0.8, calcium: 28, vitaminC: 0 } },
  { id: 'rice_white_cooked', name: 'White Rice (cooked)', nameAr: 'أرز أبيض (مطبوخ)', category: 'grains', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'kg'], nutritionPer100g: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0, sodium: 1, iron: 0.2, calcium: 10, vitaminC: 0 } },
  { id: 'rice_brown_raw', name: 'Brown Rice (raw)', nameAr: 'أرز بني (غير مطبوخ)', category: 'grains', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'kg'], nutritionPer100g: { calories: 370, protein: 7.9, carbs: 77, fat: 2.9, fiber: 3.5, sugar: 0.7, sodium: 7, iron: 1.5, calcium: 23, vitaminC: 0 } },
  { id: 'rice_brown_cooked', name: 'Brown Rice (cooked)', nameAr: 'أرز بني (مطبوخ)', category: 'grains', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'kg'], nutritionPer100g: { calories: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, sugar: 0.4, sodium: 5, iron: 0.4, calcium: 10, vitaminC: 0 } },
  { id: 'basmati_raw', name: 'Basmati Rice (raw)', nameAr: 'أرز بسمتي (غير مطبوخ)', category: 'grains', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'kg'], nutritionPer100g: { calories: 350, protein: 7.1, carbs: 78, fat: 0.6, fiber: 0.4, sugar: 0, sodium: 1, iron: 0.7, calcium: 15, vitaminC: 0 } },
  { id: 'bread_white', name: 'White Bread', nameAr: 'خبز أبيض (توست)', category: 'grains', defaultUnit: 'slice', availableUnits: ['slice', 'gram', 'piece'], nutritionPer100g: { calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7, sugar: 5, sodium: 491, iron: 3.6, calcium: 151, vitaminC: 0 }, pieceWeightG: 28 },
  { id: 'bread_brown', name: 'Whole Wheat Bread', nameAr: 'خبز أسمر', category: 'grains', defaultUnit: 'slice', availableUnits: ['slice', 'gram', 'piece'], nutritionPer100g: { calories: 247, protein: 13, carbs: 41, fat: 3.4, fiber: 7, sugar: 6, sodium: 400, iron: 2.5, calcium: 107, vitaminC: 0 }, pieceWeightG: 28 },
  { id: 'pita_bread', name: 'Pita Bread', nameAr: 'خبز عربي / كماج', category: 'grains', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 275, protein: 9.1, carbs: 55, fat: 1.2, fiber: 2.2, sugar: 1.3, sodium: 536, iron: 2.6, calcium: 86, vitaminC: 0 }, pieceWeightG: 60 },
  { id: 'pita_whole', name: 'Whole Wheat Pita', nameAr: 'خبز عربي أسمر', category: 'grains', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 262, protein: 10, carbs: 53, fat: 1.7, fiber: 7.4, sugar: 1, sodium: 527, iron: 3, calcium: 15, vitaminC: 0 }, pieceWeightG: 64 },
  { id: 'tortilla_flour', name: 'Flour Tortilla', nameAr: 'تورتيلا دقيق', category: 'grains', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 312, protein: 8.3, carbs: 52, fat: 8, fiber: 2.1, sugar: 3, sodium: 586, iron: 3.5, calcium: 128, vitaminC: 0 }, pieceWeightG: 49 },
  { id: 'tortilla_corn', name: 'Corn Tortilla', nameAr: 'تورتيلا ذرة', category: 'grains', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 218, protein: 5.7, carbs: 45, fat: 2.9, fiber: 5.2, sugar: 0.8, sodium: 40, iron: 1.6, calcium: 46, vitaminC: 0 }, pieceWeightG: 26 },
  { id: 'pasta_raw', name: 'Pasta (raw)', nameAr: 'معكرونة (غير مطبوخة)', category: 'grains', defaultUnit: 'gram', availableUnits: ['gram', 'cup', 'kg'], nutritionPer100g: { calories: 371, protein: 13, carbs: 75, fat: 1.5, fiber: 3.2, sugar: 2.7, sodium: 6, iron: 3.5, calcium: 21, vitaminC: 0 } },
  { id: 'pasta_cooked', name: 'Pasta (cooked)', nameAr: 'معكرونة (مطبوخة)', category: 'grains', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, sugar: 0.6, sodium: 1, iron: 1.3, calcium: 7, vitaminC: 0 } },
  { id: 'oats', name: 'Oats (raw)', nameAr: 'شوفان', category: 'grains', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'tbsp'], nutritionPer100g: { calories: 389, protein: 17, carbs: 66, fat: 7, fiber: 11, sugar: 0, sodium: 2, iron: 4.7, calcium: 54, vitaminC: 0 } },
  { id: 'oats_cooked', name: 'Oats (cooked)', nameAr: 'شوفان مطبوخ', category: 'grains', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 71, protein: 2.5, carbs: 12, fat: 1.5, fiber: 1.7, sugar: 0.3, sodium: 4, iron: 0.9, calcium: 9, vitaminC: 0 } },
  { id: 'quinoa_raw', name: 'Quinoa (raw)', nameAr: 'كينوا (غير مطبوخ)', category: 'grains', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 368, protein: 14, carbs: 64, fat: 6.1, fiber: 7, sugar: 0, sodium: 5, iron: 4.6, calcium: 47, vitaminC: 0 } },
  { id: 'quinoa_cooked', name: 'Quinoa (cooked)', nameAr: 'كينوا (مطبوخ)', category: 'grains', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8, sugar: 0.9, sodium: 7, iron: 1.5, calcium: 17, vitaminC: 0 } },
  { id: 'freekeh', name: 'Freekeh (raw)', nameAr: 'فريكة', category: 'grains', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 325, protein: 12, carbs: 72, fat: 2.5, fiber: 16, sugar: 0, sodium: 5, iron: 3.5, calcium: 30, vitaminC: 0 } },
  { id: 'bulgur_raw', name: 'Bulgur (raw)', nameAr: 'برغل (غير مطبوخ)', category: 'grains', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 342, protein: 12, carbs: 76, fat: 1.3, fiber: 18, sugar: 0.4, sodium: 17, iron: 2.5, calcium: 35, vitaminC: 0 } },
  { id: 'bulgur_cooked', name: 'Bulgur (cooked)', nameAr: 'برغل (مطبوخ)', category: 'grains', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 83, protein: 3.1, carbs: 19, fat: 0.2, fiber: 4.5, sugar: 0.1, sodium: 5, iron: 1, calcium: 10, vitaminC: 0 } },
  { id: 'couscous_raw', name: 'Couscous (raw)', nameAr: 'كسكس (غير مطبوخ)', category: 'grains', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 376, protein: 13, carbs: 77, fat: 0.6, fiber: 5, sugar: 0, sodium: 10, iron: 1, calcium: 24, vitaminC: 0 } },
  { id: 'couscous_cooked', name: 'Couscous (cooked)', nameAr: 'كسكس (مطبوخ)', category: 'grains', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 112, protein: 3.8, carbs: 23, fat: 0.2, fiber: 1.4, sugar: 0.1, sodium: 5, iron: 0.4, calcium: 8, vitaminC: 0 } },
  { id: 'flour_white', name: 'White Flour', nameAr: 'طحين أبيض', category: 'grains', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'kg'], nutritionPer100g: { calories: 364, protein: 10, carbs: 76, fat: 1, fiber: 2.7, sugar: 0.3, sodium: 2, iron: 4.6, calcium: 15, vitaminC: 0 } },
  { id: 'flour_whole', name: 'Whole Wheat Flour', nameAr: 'طحين أسمر / قمح كامل', category: 'grains', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'kg'], nutritionPer100g: { calories: 340, protein: 13, carbs: 72, fat: 2.5, fiber: 11, sugar: 0.4, sodium: 2, iron: 3.6, calcium: 34, vitaminC: 0 } },
  { id: 'cornflakes', name: 'Cornflakes', nameAr: 'كورن فليكس', category: 'grains', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 357, protein: 7.5, carbs: 84, fat: 0.4, fiber: 3.3, sugar: 10, sodium: 729, iron: 28, calcium: 5, vitaminC: 21 } },
  { id: 'granola', name: 'Granola', nameAr: 'جرانولا', category: 'grains', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 489, protein: 15, carbs: 64, fat: 20, fiber: 7, sugar: 22, sodium: 26, iron: 3.5, calcium: 76, vitaminC: 0 } },
  { id: 'vermicelli', name: 'Vermicelli', nameAr: 'شعيرية', category: 'grains', defaultUnit: 'gram', availableUnits: ['gram', 'cup'], nutritionPer100g: { calories: 357, protein: 12, carbs: 74, fat: 1, fiber: 2.3, sugar: 2, sodium: 7, iron: 3.1, calcium: 16, vitaminC: 0 } },
  { id: 'maftoul', name: 'Maftoul', nameAr: 'مفتول', category: 'grains', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 360, protein: 12, carbs: 74, fat: 1.5, fiber: 4, sugar: 0, sodium: 10, iron: 2.5, calcium: 20, vitaminC: 0 } },
  // Egyptian Baladi Bread
  { id: 'baladi_bread', name: 'Baladi Bread', nameAr: 'عيش بلدي / تموين', category: 'grains', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 250, protein: 9, carbs: 50, fat: 1.5, fiber: 6, sugar: 2, sodium: 400, iron: 3, calcium: 50, vitaminC: 0 }, pieceWeightG: 100 },

  // ╔══════════════════════════════════════════════╗
  // ║        🥩 بروتينات ولحوم                      ║
  // ╚══════════════════════════════════════════════╝
  { id: 'chicken_breast_raw', name: 'Chicken Breast (raw)', nameAr: 'صدر دجاج (نيء)', category: 'protein', defaultUnit: 'gram', availableUnits: ['gram', 'kg', 'piece'], nutritionPer100g: { calories: 120, protein: 22.5, carbs: 0, fat: 2.6, fiber: 0, sugar: 0, sodium: 45, iron: 0.4, calcium: 5, vitaminC: 0 }, pieceWeightG: 170 },
  { id: 'chicken_breast_cooked', name: 'Chicken Breast (cooked)', nameAr: 'صدر دجاج (مطبوخ)', category: 'protein', defaultUnit: 'gram', availableUnits: ['gram', 'kg', 'piece'], nutritionPer100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74, iron: 1, calcium: 15, vitaminC: 0 }, pieceWeightG: 170 },
  { id: 'chicken_thigh', name: 'Chicken Thigh', nameAr: 'فخذ دجاج', category: 'protein', defaultUnit: 'piece', availableUnits: ['piece', 'gram', 'kg'], nutritionPer100g: { calories: 209, protein: 26, carbs: 0, fat: 11, fiber: 0, sugar: 0, sodium: 84, iron: 1.1, calcium: 12, vitaminC: 0 }, pieceWeightG: 130 },
  { id: 'chicken_wing', name: 'Chicken Wing', nameAr: 'جناح دجاج', category: 'protein', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 203, protein: 30, carbs: 0, fat: 8, fiber: 0, sugar: 0, sodium: 77, iron: 1.3, calcium: 15, vitaminC: 0 }, pieceWeightG: 34 },
  { id: 'chicken_whole', name: 'Whole Chicken', nameAr: 'دجاجة كاملة (مشوية)', category: 'protein', defaultUnit: 'gram', availableUnits: ['gram', 'kg'], nutritionPer100g: { calories: 190, protein: 29, carbs: 0, fat: 7.4, fiber: 0, sugar: 0, sodium: 70, iron: 1.1, calcium: 13, vitaminC: 0 } },
  { id: 'chicken_liver', name: 'Chicken Liver', nameAr: 'كبدة دجاج', category: 'protein', defaultUnit: 'gram', availableUnits: ['gram', 'piece'], nutritionPer100g: { calories: 119, protein: 17, carbs: 0.7, fat: 4.8, fiber: 0, sugar: 0, sodium: 71, iron: 9, calcium: 8, vitaminC: 17.9 }, pieceWeightG: 32 },
  { id: 'beef_lean', name: 'Beef (lean)', nameAr: 'لحم بقر هبر', category: 'protein', defaultUnit: 'gram', availableUnits: ['gram', 'kg'], nutritionPer100g: { calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, sugar: 0, sodium: 72, iron: 2.6, calcium: 18, vitaminC: 0 } },
  { id: 'beef_ground', name: 'Ground Beef', nameAr: 'لحم بقر مفروم', category: 'protein', defaultUnit: 'gram', availableUnits: ['gram', 'kg'], nutritionPer100g: { calories: 254, protein: 17, carbs: 0, fat: 20, fiber: 0, sugar: 0, sodium: 66, iron: 2.2, calcium: 12, vitaminC: 0 } },
  { id: 'beef_liver', name: 'Beef Liver', nameAr: 'كبدة بقر', category: 'protein', defaultUnit: 'gram', availableUnits: ['gram'], nutritionPer100g: { calories: 135, protein: 20, carbs: 3.9, fat: 3.6, fiber: 0, sugar: 0, sodium: 69, iron: 6.5, calcium: 5, vitaminC: 1.3 } },
  { id: 'lamb', name: 'Lamb', nameAr: 'لحم خروف / غنم', category: 'protein', defaultUnit: 'gram', availableUnits: ['gram', 'kg'], nutritionPer100g: { calories: 294, protein: 25, carbs: 0, fat: 21, fiber: 0, sugar: 0, sodium: 59, iron: 1.9, calcium: 17, vitaminC: 0 } },
  { id: 'lamb_chop', name: 'Lamb Chop', nameAr: 'ريش خروف / كستليتة', category: 'protein', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 282, protein: 26, carbs: 0, fat: 19, fiber: 0, sugar: 0, sodium: 65, iron: 1.8, calcium: 17, vitaminC: 0 }, pieceWeightG: 70 },
  { id: 'lamb_ground', name: 'Ground Lamb', nameAr: 'لحم خروف مفروم', category: 'protein', defaultUnit: 'gram', availableUnits: ['gram', 'kg'], nutritionPer100g: { calories: 283, protein: 17, carbs: 0, fat: 23, fiber: 0, sugar: 0, sodium: 68, iron: 1.6, calcium: 17, vitaminC: 0 } },
  { id: 'veal', name: 'Veal', nameAr: 'لحم عجل', category: 'protein', defaultUnit: 'gram', availableUnits: ['gram', 'kg'], nutritionPer100g: { calories: 172, protein: 24, carbs: 0, fat: 8, fiber: 0, sugar: 0, sodium: 76, iron: 1.2, calcium: 22, vitaminC: 0 } },
  { id: 'egg', name: 'Egg', nameAr: 'بيضة', category: 'protein', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1, sodium: 124, iron: 1.8, calcium: 56, vitaminC: 0 }, pieceWeightG: 50 },
  { id: 'egg_white', name: 'Egg White', nameAr: 'بياض بيضة', category: 'protein', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0, sugar: 0.7, sodium: 166, iron: 0.1, calcium: 7, vitaminC: 0 }, pieceWeightG: 33 },
  { id: 'egg_yolk', name: 'Egg Yolk', nameAr: 'صفار بيضة', category: 'protein', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 322, protein: 16, carbs: 3.6, fat: 27, fiber: 0, sugar: 0.6, sodium: 48, iron: 2.7, calcium: 129, vitaminC: 0 }, pieceWeightG: 17 },
  { id: 'turkey_breast', name: 'Turkey Breast', nameAr: 'صدر ديك رومي', category: 'protein', defaultUnit: 'gram', availableUnits: ['gram', 'slice'], nutritionPer100g: { calories: 135, protein: 30, carbs: 0, fat: 1, fiber: 0, sugar: 0, sodium: 48, iron: 0.7, calcium: 10, vitaminC: 0 } },
  { id: 'turkey_deli', name: 'Turkey Deli', nameAr: 'مرتديلا ديك رومي', category: 'protein', defaultUnit: 'slice', availableUnits: ['slice', 'gram'], nutritionPer100g: { calories: 104, protein: 18, carbs: 2, fat: 2.4, fiber: 0, sugar: 2, sodium: 1015, iron: 0.6, calcium: 4, vitaminC: 0 } },
  { id: 'shawarma_chicken', name: 'Chicken Shawarma', nameAr: 'شاورما دجاج', category: 'protein', defaultUnit: 'gram', availableUnits: ['gram', 'piece'], nutritionPer100g: { calories: 215, protein: 20, carbs: 5, fat: 12, fiber: 0.5, sugar: 1, sodium: 450, iron: 1.5, calcium: 20, vitaminC: 2 }, pieceWeightG: 300 },
  { id: 'shawarma_meat', name: 'Meat Shawarma', nameAr: 'شاورما لحم', category: 'protein', defaultUnit: 'gram', availableUnits: ['gram', 'piece'], nutritionPer100g: { calories: 270, protein: 18, carbs: 4, fat: 20, fiber: 0.3, sugar: 1, sodium: 500, iron: 2.5, calcium: 18, vitaminC: 1 }, pieceWeightG: 300 },
  { id: 'kabab', name: 'Kabab', nameAr: 'كباب / كفتة مشوية', category: 'protein', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 278, protein: 17, carbs: 4, fat: 22, fiber: 0.5, sugar: 1, sodium: 520, iron: 2.2, calcium: 25, vitaminC: 3 }, pieceWeightG: 30 },

  // ╔══════════════════════════════════════════════╗
  // ║              🐟 أسماك ومأكولات بحرية           ║
  // ╚══════════════════════════════════════════════╝
  { id: 'tuna_canned', name: 'Tuna (canned)', nameAr: 'تونة معلبة', category: 'seafood', defaultUnit: 'gram', availableUnits: ['gram', 'can'], nutritionPer100g: { calories: 116, protein: 26, carbs: 0, fat: 0.8, fiber: 0, sugar: 0, sodium: 338, iron: 1.4, calcium: 11, vitaminC: 0 }, pieceWeightG: 160 },
  { id: 'tuna_fresh', name: 'Tuna (fresh)', nameAr: 'تونة طازجة', category: 'seafood', defaultUnit: 'gram', availableUnits: ['gram', 'piece'], nutritionPer100g: { calories: 130, protein: 29, carbs: 0, fat: 1, fiber: 0, sugar: 0, sodium: 45, iron: 1, calcium: 8, vitaminC: 0 }, pieceWeightG: 170 },
  { id: 'salmon', name: 'Salmon', nameAr: 'سلمون', category: 'seafood', defaultUnit: 'gram', availableUnits: ['gram', 'piece'], nutritionPer100g: { calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sugar: 0, sodium: 59, iron: 0.3, calcium: 12, vitaminC: 0 }, pieceWeightG: 170 },
  { id: 'fish_tilapia', name: 'Fish (Tilapia)', nameAr: 'سمك بلطي / مشط', category: 'seafood', defaultUnit: 'gram', availableUnits: ['gram', 'piece'], nutritionPer100g: { calories: 96, protein: 20, carbs: 0, fat: 1.7, fiber: 0, sugar: 0, sodium: 52, iron: 0.6, calcium: 10, vitaminC: 0 }, pieceWeightG: 170 },
  { id: 'fish_cod', name: 'Cod Fish', nameAr: 'سمك قد', category: 'seafood', defaultUnit: 'gram', availableUnits: ['gram', 'piece'], nutritionPer100g: { calories: 82, protein: 18, carbs: 0, fat: 0.7, fiber: 0, sugar: 0, sodium: 54, iron: 0.4, calcium: 16, vitaminC: 1 }, pieceWeightG: 180 },
  { id: 'sardines', name: 'Sardines (canned)', nameAr: 'سردين معلب', category: 'seafood', defaultUnit: 'can', availableUnits: ['can', 'gram', 'piece'], nutritionPer100g: { calories: 208, protein: 25, carbs: 0, fat: 11, fiber: 0, sugar: 0, sodium: 505, iron: 2.9, calcium: 382, vitaminC: 0 }, pieceWeightG: 12 },
  { id: 'shrimp', name: 'Shrimp', nameAr: 'جمبري / روبيان', category: 'seafood', defaultUnit: 'gram', availableUnits: ['gram', 'cup', 'piece'], nutritionPer100g: { calories: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0, sugar: 0, sodium: 111, iron: 0.2, calcium: 70, vitaminC: 0 }, pieceWeightG: 6 },
  { id: 'calamari', name: 'Calamari / Squid', nameAr: 'كاليماري / حبّار', category: 'seafood', defaultUnit: 'gram', availableUnits: ['gram', 'cup'], nutritionPer100g: { calories: 92, protein: 16, carbs: 3.1, fat: 1.4, fiber: 0, sugar: 0, sodium: 44, iron: 0.7, calcium: 32, vitaminC: 5 } },
  { id: 'crab', name: 'Crab Meat', nameAr: 'لحم سلطعون / كابوريا', category: 'seafood', defaultUnit: 'gram', availableUnits: ['gram', 'cup'], nutritionPer100g: { calories: 87, protein: 18, carbs: 0, fat: 1.1, fiber: 0, sugar: 0, sodium: 395, iron: 0.7, calcium: 91, vitaminC: 7 } },

  // ╔══════════════════════════════════════════════╗
  // ║             🥛 ألبان وأجبان                    ║
  // ╚══════════════════════════════════════════════╝
  { id: 'milk_full', name: 'Full Fat Milk', nameAr: 'حليب كامل الدسم', category: 'dairy', defaultUnit: 'cup', availableUnits: ['cup', 'ml', 'liter'], nutritionPer100g: { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, sugar: 5.1, sodium: 43, iron: 0, calcium: 113, vitaminC: 0 } },
  { id: 'milk_skim', name: 'Skim Milk', nameAr: 'حليب خالي الدسم', category: 'dairy', defaultUnit: 'cup', availableUnits: ['cup', 'ml', 'liter'], nutritionPer100g: { calories: 34, protein: 3.4, carbs: 5, fat: 0.1, fiber: 0, sugar: 5, sodium: 42, iron: 0, calcium: 122, vitaminC: 0 } },
  { id: 'milk_lowfat', name: 'Low Fat Milk', nameAr: 'حليب قليل الدسم', category: 'dairy', defaultUnit: 'cup', availableUnits: ['cup', 'ml', 'liter'], nutritionPer100g: { calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0, sugar: 5.1, sodium: 44, iron: 0, calcium: 125, vitaminC: 0 } },
  { id: 'almond_milk', name: 'Almond Milk', nameAr: 'حليب لوز', category: 'dairy', defaultUnit: 'cup', availableUnits: ['cup', 'ml'], nutritionPer100g: { calories: 15, protein: 0.6, carbs: 0.3, fat: 1.2, fiber: 0.2, sugar: 0, sodium: 67, iron: 0.3, calcium: 184, vitaminC: 0 } },
  { id: 'oat_milk', name: 'Oat Milk', nameAr: 'حليب شوفان', category: 'dairy', defaultUnit: 'cup', availableUnits: ['cup', 'ml'], nutritionPer100g: { calories: 48, protein: 1, carbs: 7.6, fat: 1.5, fiber: 0.8, sugar: 4, sodium: 42, iron: 0.2, calcium: 120, vitaminC: 0 } },
  { id: 'soy_milk', name: 'Soy Milk', nameAr: 'حليب صويا', category: 'dairy', defaultUnit: 'cup', availableUnits: ['cup', 'ml'], nutritionPer100g: { calories: 33, protein: 2.8, carbs: 1.8, fat: 1.6, fiber: 0.4, sugar: 1, sodium: 51, iron: 0.6, calcium: 25, vitaminC: 0 } },
  { id: 'yogurt', name: 'Yogurt', nameAr: 'لبن / زبادي', category: 'dairy', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'ml'], nutritionPer100g: { calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, fiber: 0, sugar: 4.7, sodium: 46, iron: 0.1, calcium: 121, vitaminC: 0.5 } },
  { id: 'greek_yogurt', name: 'Greek Yogurt', nameAr: 'زبادي يوناني', category: 'dairy', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, sugar: 3.2, sodium: 36, iron: 0.1, calcium: 110, vitaminC: 0 } },
  { id: 'labneh', name: 'Labneh', nameAr: 'لبنة', category: 'dairy', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'gram', 'cup'], nutritionPer100g: { calories: 160, protein: 6, carbs: 4, fat: 14, fiber: 0, sugar: 3, sodium: 300, iron: 0.1, calcium: 150, vitaminC: 0 } },
  { id: 'cheese_white', name: 'White Cheese', nameAr: 'جبنة بيضاء / نابلسية', category: 'dairy', defaultUnit: 'gram', availableUnits: ['gram', 'slice', 'tbsp'], nutritionPer100g: { calories: 264, protein: 18, carbs: 1.3, fat: 21, fiber: 0, sugar: 0.5, sodium: 1146, iron: 0.7, calcium: 493, vitaminC: 0 } },
  { id: 'cheese_cheddar', name: 'Cheddar Cheese', nameAr: 'جبنة شيدر', category: 'dairy', defaultUnit: 'gram', availableUnits: ['gram', 'slice'], nutritionPer100g: { calories: 403, protein: 25, carbs: 1.3, fat: 33, fiber: 0, sugar: 0.5, sodium: 621, iron: 0.7, calcium: 721, vitaminC: 0 } },
  { id: 'cheese_mozzarella', name: 'Mozzarella', nameAr: 'جبنة موزاريلا', category: 'dairy', defaultUnit: 'gram', availableUnits: ['gram', 'slice', 'cup'], nutritionPer100g: { calories: 280, protein: 28, carbs: 3.1, fat: 17, fiber: 0, sugar: 1.2, sodium: 16, iron: 0.4, calcium: 505, vitaminC: 0 } },
  { id: 'cheese_feta', name: 'Feta Cheese', nameAr: 'جبنة فيتا', category: 'dairy', defaultUnit: 'gram', availableUnits: ['gram', 'cup'], nutritionPer100g: { calories: 264, protein: 14, carbs: 4.1, fat: 21, fiber: 0, sugar: 4.1, sodium: 1116, iron: 0.7, calcium: 493, vitaminC: 0 } },
  { id: 'cheese_parmesan', name: 'Parmesan', nameAr: 'جبنة بارميزان', category: 'dairy', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'gram'], nutritionPer100g: { calories: 431, protein: 38, carbs: 4.1, fat: 29, fiber: 0, sugar: 0.9, sodium: 1529, iron: 0.8, calcium: 1184, vitaminC: 0 } },
  { id: 'cheese_cream', name: 'Cream Cheese', nameAr: 'جبنة كريمية', category: 'dairy', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'gram'], nutritionPer100g: { calories: 342, protein: 6, carbs: 4.1, fat: 34, fiber: 0, sugar: 3.8, sodium: 321, iron: 0.1, calcium: 98, vitaminC: 0 } },
  { id: 'cheese_halloumi', name: 'Halloumi', nameAr: 'جبنة حلوم', category: 'dairy', defaultUnit: 'gram', availableUnits: ['gram', 'slice'], nutritionPer100g: { calories: 316, protein: 22, carbs: 2.6, fat: 25, fiber: 0, sugar: 2.6, sodium: 1225, iron: 0.2, calcium: 700, vitaminC: 0 } },
  { id: 'cheese_akkawi', name: 'Akkawi Cheese', nameAr: 'جبنة عكاوي', category: 'dairy', defaultUnit: 'gram', availableUnits: ['gram', 'slice'], nutritionPer100g: { calories: 289, protein: 20, carbs: 1.5, fat: 23, fiber: 0, sugar: 0, sodium: 950, iron: 0.5, calcium: 600, vitaminC: 0 } },
  { id: 'butter', name: 'Butter', nameAr: 'زبدة', category: 'dairy', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'tsp', 'gram'], nutritionPer100g: { calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0, sugar: 0.1, sodium: 643, iron: 0, calcium: 24, vitaminC: 0 } },
  { id: 'ghee', name: 'Ghee', nameAr: 'سمن', category: 'dairy', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'tsp', 'gram'], nutritionPer100g: { calories: 876, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0, sodium: 0, iron: 0, calcium: 0, vitaminC: 0 } },
  { id: 'cream_heavy', name: 'Heavy Cream', nameAr: 'كريمة طبخ / خفق', category: 'dairy', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'ml', 'cup'], nutritionPer100g: { calories: 340, protein: 2, carbs: 2.8, fat: 36, fiber: 0, sugar: 2.8, sodium: 38, iron: 0, calcium: 65, vitaminC: 0.6 } },
  { id: 'cream_sour', name: 'Sour Cream', nameAr: 'كريمة حامضة', category: 'dairy', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'gram', 'cup'], nutritionPer100g: { calories: 193, protein: 2.1, carbs: 4.6, fat: 19, fiber: 0, sugar: 3.4, sodium: 53, iron: 0.1, calcium: 110, vitaminC: 0.8 } },
  { id: 'ayran', name: 'Ayran', nameAr: 'عيران / شنينة', category: 'dairy', defaultUnit: 'cup', availableUnits: ['cup', 'ml'], nutritionPer100g: { calories: 32, protein: 1.7, carbs: 2.5, fat: 1.6, fiber: 0, sugar: 2.5, sodium: 200, iron: 0, calcium: 60, vitaminC: 0 } },

  // ╔══════════════════════════════════════════════╗
  // ║             🫒 زيوت ودهون                     ║
  // ╚══════════════════════════════════════════════╝
  { id: 'olive_oil', name: 'Olive Oil', nameAr: 'زيت زيتون', category: 'oils', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'tsp', 'ml', 'cup'], nutritionPer100g: { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0, sodium: 2, iron: 0.6, calcium: 1, vitaminC: 0 } },
  { id: 'sunflower_oil', name: 'Sunflower Oil', nameAr: 'زيت دوار الشمس', category: 'oils', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'tsp', 'ml'], nutritionPer100g: { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0, sodium: 0, iron: 0, calcium: 0, vitaminC: 0 } },
  { id: 'vegetable_oil', name: 'Vegetable Oil', nameAr: 'زيت نباتي', category: 'oils', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'tsp', 'ml'], nutritionPer100g: { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0, sodium: 0, iron: 0, calcium: 0, vitaminC: 0 } },
  { id: 'coconut_oil', name: 'Coconut Oil', nameAr: 'زيت جوز الهند', category: 'oils', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'tsp', 'ml'], nutritionPer100g: { calories: 862, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0, sodium: 0, iron: 0, calcium: 0, vitaminC: 0 } },
  { id: 'sesame_oil', name: 'Sesame Oil', nameAr: 'زيت سمسم', category: 'oils', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'tsp', 'ml'], nutritionPer100g: { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0, sodium: 0, iron: 0, calcium: 0, vitaminC: 0 } },
  { id: 'tahini', name: 'Tahini', nameAr: 'طحينة', category: 'oils', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'gram', 'cup'], nutritionPer100g: { calories: 595, protein: 17, carbs: 21, fat: 54, fiber: 9, sugar: 0.5, sodium: 115, iron: 9, calcium: 426, vitaminC: 0 } },

  // ╔══════════════════════════════════════════════╗
  // ║             🥜 مكسرات وبذور                    ║
  // ╚══════════════════════════════════════════════╝
  { id: 'almonds', name: 'Almonds', nameAr: 'لوز', category: 'nuts', defaultUnit: 'gram', availableUnits: ['gram', 'cup', 'piece'], nutritionPer100g: { calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12, sugar: 4.4, sodium: 1, iron: 3.7, calcium: 269, vitaminC: 0 }, pieceWeightG: 1.2 },
  { id: 'walnuts', name: 'Walnuts', nameAr: 'جوز', category: 'nuts', defaultUnit: 'gram', availableUnits: ['gram', 'cup', 'piece'], nutritionPer100g: { calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 7, sugar: 2.6, sodium: 2, iron: 2.9, calcium: 98, vitaminC: 1.3 }, pieceWeightG: 4 },
  { id: 'peanuts', name: 'Peanuts', nameAr: 'فول سوداني', category: 'nuts', defaultUnit: 'gram', availableUnits: ['gram', 'cup', 'tbsp'], nutritionPer100g: { calories: 567, protein: 26, carbs: 16, fat: 49, fiber: 9, sugar: 4, sodium: 18, iron: 4.6, calcium: 92, vitaminC: 0 } },
  { id: 'peanut_butter', name: 'Peanut Butter', nameAr: 'زبدة فول سوداني', category: 'nuts', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'gram', 'cup'], nutritionPer100g: { calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, sugar: 9, sodium: 17, iron: 1.7, calcium: 43, vitaminC: 0 } },
  { id: 'almond_butter', name: 'Almond Butter', nameAr: 'زبدة لوز', category: 'nuts', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'gram'], nutritionPer100g: { calories: 614, protein: 21, carbs: 19, fat: 56, fiber: 10, sugar: 4.4, sodium: 7, iron: 3.3, calcium: 347, vitaminC: 0 } },
  { id: 'cashews', name: 'Cashews', nameAr: 'كاجو', category: 'nuts', defaultUnit: 'gram', availableUnits: ['gram', 'cup'], nutritionPer100g: { calories: 553, protein: 18, carbs: 30, fat: 44, fiber: 3.3, sugar: 6, sodium: 12, iron: 6.7, calcium: 37, vitaminC: 0 } },
  { id: 'pistachios', name: 'Pistachios', nameAr: 'فستق حلبي', category: 'nuts', defaultUnit: 'gram', availableUnits: ['gram', 'cup'], nutritionPer100g: { calories: 560, protein: 20, carbs: 28, fat: 45, fiber: 10, sugar: 8, sodium: 1, iron: 3.9, calcium: 105, vitaminC: 5.6 } },
  { id: 'hazelnuts', name: 'Hazelnuts', nameAr: 'بندق', category: 'nuts', defaultUnit: 'gram', availableUnits: ['gram', 'cup'], nutritionPer100g: { calories: 628, protein: 15, carbs: 17, fat: 61, fiber: 10, sugar: 4.3, sodium: 0, iron: 4.7, calcium: 114, vitaminC: 6.3 } },
  { id: 'pine_nuts', name: 'Pine Nuts', nameAr: 'صنوبر', category: 'nuts', defaultUnit: 'gram', availableUnits: ['gram', 'tbsp'], nutritionPer100g: { calories: 673, protein: 14, carbs: 13, fat: 68, fiber: 3.7, sugar: 3.6, sodium: 2, iron: 5.5, calcium: 16, vitaminC: 0.8 } },
  { id: 'sunflower_seeds', name: 'Sunflower Seeds', nameAr: 'بذور دوار الشمس / لب سوري', category: 'nuts', defaultUnit: 'gram', availableUnits: ['gram', 'cup', 'tbsp'], nutritionPer100g: { calories: 584, protein: 21, carbs: 20, fat: 51, fiber: 9, sugar: 2.6, sodium: 9, iron: 5.3, calcium: 78, vitaminC: 1.4 } },
  { id: 'pumpkin_seeds', name: 'Pumpkin Seeds', nameAr: 'بذور يقطين / لب أبيض', category: 'nuts', defaultUnit: 'gram', availableUnits: ['gram', 'cup', 'tbsp'], nutritionPer100g: { calories: 559, protein: 30, carbs: 11, fat: 49, fiber: 6, sugar: 1.4, sodium: 7, iron: 8.8, calcium: 46, vitaminC: 1.9 } },
  { id: 'chia_seeds', name: 'Chia Seeds', nameAr: 'بذور شيا', category: 'nuts', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'gram'], nutritionPer100g: { calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34, sugar: 0, sodium: 16, iron: 7.7, calcium: 631, vitaminC: 1.6 } },
  { id: 'flax_seeds', name: 'Flax Seeds', nameAr: 'بذور كتان', category: 'nuts', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'gram'], nutritionPer100g: { calories: 534, protein: 18, carbs: 29, fat: 42, fiber: 27, sugar: 1.6, sodium: 30, iron: 5.7, calcium: 255, vitaminC: 0.6 } },
  { id: 'sesame_seeds', name: 'Sesame Seeds', nameAr: 'بذور سمسم', category: 'nuts', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'gram'], nutritionPer100g: { calories: 573, protein: 18, carbs: 23, fat: 50, fiber: 12, sugar: 0.3, sodium: 11, iron: 14.6, calcium: 975, vitaminC: 0 } },
  { id: 'macadamia', name: 'Macadamia Nuts', nameAr: 'مكاديميا', category: 'nuts', defaultUnit: 'gram', availableUnits: ['gram', 'cup'], nutritionPer100g: { calories: 718, protein: 7.9, carbs: 14, fat: 76, fiber: 8.6, sugar: 4.6, sodium: 5, iron: 3.7, calcium: 85, vitaminC: 1.2 } },
  { id: 'brazil_nuts', name: 'Brazil Nuts', nameAr: 'جوز برازيلي', category: 'nuts', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 659, protein: 14, carbs: 12, fat: 67, fiber: 7.5, sugar: 2.3, sodium: 3, iron: 2.4, calcium: 160, vitaminC: 0.7 }, pieceWeightG: 5 },

  // ╔══════════════════════════════════════════════╗
  // ║             🫘 بقوليات                        ║
  // ╚══════════════════════════════════════════════╝
  { id: 'hummus', name: 'Hummus', nameAr: 'حمص (طبق)', category: 'legumes', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'cup', 'gram'], nutritionPer100g: { calories: 166, protein: 8, carbs: 14, fat: 10, fiber: 4, sugar: 0, sodium: 379, iron: 1.6, calcium: 38, vitaminC: 0 } },
  { id: 'chickpeas_raw', name: 'Chickpeas (raw)', nameAr: 'حمص حب (جاف)', category: 'legumes', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 364, protein: 19, carbs: 61, fat: 6, fiber: 17, sugar: 11, sodium: 24, iron: 6.2, calcium: 105, vitaminC: 4 } },
  { id: 'chickpeas_cooked', name: 'Chickpeas (cooked)', nameAr: 'حمص حب (مطبوخ)', category: 'legumes', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 164, protein: 9, carbs: 27, fat: 2.6, fiber: 8, sugar: 4.8, sodium: 7, iron: 2.9, calcium: 49, vitaminC: 1.3 } },
  { id: 'lentils_raw', name: 'Lentils (raw)', nameAr: 'عدس (جاف)', category: 'legumes', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 352, protein: 25, carbs: 60, fat: 1.1, fiber: 31, sugar: 2, sodium: 6, iron: 6.5, calcium: 35, vitaminC: 4.5 } },
  // Updated lentils_cooked to include bowl and tbsp for Egyptian usage
  { id: 'lentils_cooked', name: 'Lentils (cooked)', nameAr: 'عدس (مطبوخ)', category: 'legumes', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'bowl', 'tbsp'], nutritionPer100g: { calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8, sugar: 1.8, sodium: 2, iron: 3.3, calcium: 19, vitaminC: 1.5 } },
  { id: 'fava_beans', name: 'Fava Beans (Foul)', nameAr: 'فول مدمس', category: 'legumes', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 110, protein: 8, carbs: 19, fat: 0.4, fiber: 5, sugar: 1.8, sodium: 5, iron: 1.5, calcium: 36, vitaminC: 0.3 } },
  { id: 'falafel', name: 'Falafel', nameAr: 'فلافل', category: 'legumes', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 333, protein: 13, carbs: 32, fat: 18, fiber: 5, sugar: 0, sodium: 294, iron: 3.4, calcium: 54, vitaminC: 4 }, pieceWeightG: 17 },
  // Ta'meya – Egyptian falafel (fava bean based)
  { id: 'tameya', name: "Ta'meya", nameAr: 'طعمية', category: 'legumes', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 330, protein: 13, carbs: 32, fat: 18, fiber: 5, sugar: 0, sodium: 300, iron: 3.4, calcium: 54, vitaminC: 4 }, pieceWeightG: 20 },
  { id: 'kidney_beans_cooked', name: 'Kidney Beans (cooked)', nameAr: 'فاصوليا حمراء (مطبوخة)', category: 'legumes', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 127, protein: 9, carbs: 23, fat: 0.5, fiber: 6.4, sugar: 2, sodium: 2, iron: 2.9, calcium: 28, vitaminC: 1.2 } },
  { id: 'black_beans', name: 'Black Beans (cooked)', nameAr: 'فاصوليا سوداء (مطبوخة)', category: 'legumes', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 132, protein: 9, carbs: 24, fat: 0.5, fiber: 8.7, sugar: 0.3, sodium: 1, iron: 2.1, calcium: 27, vitaminC: 0 } },
  { id: 'white_beans_cooked', name: 'White Beans (cooked)', nameAr: 'فاصوليا بيضاء (مطبوخة)', category: 'legumes', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 139, protein: 10, carbs: 25, fat: 0.4, fiber: 6.3, sugar: 0.3, sodium: 6, iron: 3.7, calcium: 90, vitaminC: 0 } },
  { id: 'edamame', name: 'Edamame', nameAr: 'إدامامي / فول الصويا الأخضر', category: 'legumes', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 121, protein: 12, carbs: 8.9, fat: 5.2, fiber: 5.2, sugar: 2.2, sodium: 6, iron: 2.3, calcium: 63, vitaminC: 6.1 } },
  { id: 'tofu', name: 'Tofu', nameAr: 'توفو', category: 'legumes', defaultUnit: 'gram', availableUnits: ['gram', 'cup', 'piece'], nutritionPer100g: { calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, sugar: 0.6, sodium: 7, iron: 5.4, calcium: 350, vitaminC: 0.1 }, pieceWeightG: 120 },

  // ╔══════════════════════════════════════════════╗
  // ║             ☕ مشروبات                        ║
  // ╚══════════════════════════════════════════════╝
  { id: 'coffee_black', name: 'Black Coffee', nameAr: 'قهوة سوداء (بدون سكر)', category: 'beverages', defaultUnit: 'cup', availableUnits: ['cup', 'ml'], nutritionPer100g: { calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 5, iron: 0, calcium: 2, vitaminC: 0 } },
  { id: 'arabic_coffee', name: 'Arabic Coffee', nameAr: 'قهوة عربية', category: 'beverages', defaultUnit: 'cup', availableUnits: ['cup', 'ml'], nutritionPer100g: { calories: 2, protein: 0.1, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 2, iron: 0, calcium: 1, vitaminC: 0 } },
  { id: 'turkish_coffee', name: 'Turkish Coffee', nameAr: 'قهوة تركية', category: 'beverages', defaultUnit: 'cup', availableUnits: ['cup', 'ml'], nutritionPer100g: { calories: 5, protein: 0.3, carbs: 0.7, fat: 0, fiber: 0, sugar: 0, sodium: 3, iron: 0.1, calcium: 3, vitaminC: 0 } },
  { id: 'latte', name: 'Latte', nameAr: 'لاتيه', category: 'beverages', defaultUnit: 'cup', availableUnits: ['cup', 'ml'], nutritionPer100g: { calories: 42, protein: 2.4, carbs: 3.6, fat: 2, fiber: 0, sugar: 3.6, sodium: 33, iron: 0, calcium: 85, vitaminC: 0 } },
  { id: 'cappuccino', name: 'Cappuccino', nameAr: 'كابتشينو', category: 'beverages', defaultUnit: 'cup', availableUnits: ['cup', 'ml'], nutritionPer100g: { calories: 30, protein: 1.7, carbs: 2.5, fat: 1.4, fiber: 0, sugar: 2.5, sodium: 25, iron: 0, calcium: 65, vitaminC: 0 } },
  { id: 'tea', name: 'Tea', nameAr: 'شاي (بدون سكر)', category: 'beverages', defaultUnit: 'cup', availableUnits: ['cup', 'ml'], nutritionPer100g: { calories: 1, protein: 0, carbs: 0.3, fat: 0, fiber: 0, sugar: 0, sodium: 3, iron: 0, calcium: 0, vitaminC: 0 } },
  { id: 'green_tea', name: 'Green Tea', nameAr: 'شاي أخضر', category: 'beverages', defaultUnit: 'cup', availableUnits: ['cup', 'ml'], nutritionPer100g: { calories: 1, protein: 0.2, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 1, iron: 0, calcium: 0, vitaminC: 0 } },
  { id: 'orange_juice', name: 'Orange Juice', nameAr: 'عصير برتقال طبيعي', category: 'beverages', defaultUnit: 'cup', availableUnits: ['cup', 'ml', 'liter'], nutritionPer100g: { calories: 45, protein: 0.7, carbs: 10, fat: 0.2, fiber: 0.2, sugar: 8.4, sodium: 1, iron: 0.2, calcium: 11, vitaminC: 50 } },
  { id: 'apple_juice', name: 'Apple Juice', nameAr: 'عصير تفاح', category: 'beverages', defaultUnit: 'cup', availableUnits: ['cup', 'ml'], nutritionPer100g: { calories: 46, protein: 0.1, carbs: 11, fat: 0.1, fiber: 0.1, sugar: 10, sodium: 4, iron: 0.1, calcium: 8, vitaminC: 1 } },
  { id: 'lemonade', name: 'Lemonade', nameAr: 'ليموناضة / عصير ليمون بسكر', category: 'beverages', defaultUnit: 'cup', availableUnits: ['cup', 'ml'], nutritionPer100g: { calories: 40, protein: 0, carbs: 10, fat: 0, fiber: 0, sugar: 9.6, sodium: 4, iron: 0, calcium: 2, vitaminC: 4 } },
  { id: 'cola', name: 'Cola', nameAr: 'كولا / بيبسي', category: 'beverages', defaultUnit: 'can', availableUnits: ['can', 'ml', 'cup', 'liter'], nutritionPer100g: { calories: 42, protein: 0, carbs: 11, fat: 0, fiber: 0, sugar: 11, sodium: 4, iron: 0, calcium: 2, vitaminC: 0 } },
  { id: 'cola_diet', name: 'Diet Cola', nameAr: 'كولا دايت', category: 'beverages', defaultUnit: 'can', availableUnits: ['can', 'ml'], nutritionPer100g: { calories: 0.4, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 6, iron: 0, calcium: 1, vitaminC: 0 } },
  { id: 'energy_drink', name: 'Energy Drink', nameAr: 'مشروب طاقة', category: 'beverages', defaultUnit: 'can', availableUnits: ['can', 'ml'], nutritionPer100g: { calories: 45, protein: 0.3, carbs: 11, fat: 0, fiber: 0, sugar: 11, sodium: 40, iron: 0, calcium: 4, vitaminC: 0 } },
  { id: 'coconut_water', name: 'Coconut Water', nameAr: 'ماء جوز الهند', category: 'beverages', defaultUnit: 'cup', availableUnits: ['cup', 'ml'], nutritionPer100g: { calories: 19, protein: 0.7, carbs: 3.7, fat: 0.2, fiber: 1.1, sugar: 2.6, sodium: 105, iron: 0.3, calcium: 24, vitaminC: 2.4 } },
  { id: 'sahlab', name: 'Sahlab', nameAr: 'سحلب', category: 'beverages', defaultUnit: 'cup', availableUnits: ['cup', 'ml', 'gram'], nutritionPer100g: { calories: 110, protein: 3, carbs: 20, fat: 2, fiber: 1, sugar: 12, sodium: 50, iron: 0.5, calcium: 100, vitaminC: 0 } },

  // ╔══════════════════════════════════════════════╗
  // ║          🍰 حلويات وسكريات                     ║
  // ╚══════════════════════════════════════════════╝
  { id: 'sugar', name: 'Sugar', nameAr: 'سكر أبيض', category: 'sweets', defaultUnit: 'tsp', availableUnits: ['tsp', 'tbsp', 'gram', 'cup'], nutritionPer100g: { calories: 387, protein: 0, carbs: 100, fat: 0, fiber: 0, sugar: 100, sodium: 1, iron: 0, calcium: 1, vitaminC: 0 } },
  { id: 'brown_sugar', name: 'Brown Sugar', nameAr: 'سكر بني', category: 'sweets', defaultUnit: 'tsp', availableUnits: ['tsp', 'tbsp', 'gram'], nutritionPer100g: { calories: 380, protein: 0.1, carbs: 98, fat: 0, fiber: 0, sugar: 97, sodium: 39, iron: 0.7, calcium: 83, vitaminC: 0 } },
  { id: 'honey', name: 'Honey', nameAr: 'عسل', category: 'sweets', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'tsp', 'gram'], nutritionPer100g: { calories: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2, sugar: 82, sodium: 4, iron: 0.4, calcium: 6, vitaminC: 0.5 } },
  { id: 'maple_syrup', name: 'Maple Syrup', nameAr: 'شراب القيقب', category: 'sweets', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'ml', 'gram'], nutritionPer100g: { calories: 260, protein: 0, carbs: 67, fat: 0.1, fiber: 0, sugar: 60, sodium: 12, iron: 0.1, calcium: 102, vitaminC: 0 } },
  { id: 'molasses', name: 'Molasses', nameAr: 'دبس سكر / عسل أسود', category: 'sweets', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'gram'], nutritionPer100g: { calories: 290, protein: 0, carbs: 75, fat: 0.1, fiber: 0, sugar: 74, sodium: 37, iron: 4.7, calcium: 205, vitaminC: 0 } },
  { id: 'date_syrup', name: 'Date Syrup', nameAr: 'دبس تمر', category: 'sweets', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'gram'], nutritionPer100g: { calories: 293, protein: 1.5, carbs: 73, fat: 0.2, fiber: 2, sugar: 65, sodium: 3, iron: 1.2, calcium: 50, vitaminC: 0 } },
  { id: 'pomegranate_molasses', name: 'Pomegranate Molasses', nameAr: 'دبس رمان', category: 'sweets', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'gram'], nutritionPer100g: { calories: 250, protein: 0, carbs: 65, fat: 0, fiber: 0, sugar: 55, sodium: 15, iron: 0.5, calcium: 10, vitaminC: 2 } },
  { id: 'chocolate_dark', name: 'Dark Chocolate', nameAr: 'شوكولاتة داكنة', category: 'sweets', defaultUnit: 'gram', availableUnits: ['gram', 'piece'], nutritionPer100g: { calories: 546, protein: 5, carbs: 60, fat: 31, fiber: 7, sugar: 48, sodium: 24, iron: 8, calcium: 56, vitaminC: 0 }, pieceWeightG: 10 },
  { id: 'chocolate_milk', name: 'Milk Chocolate', nameAr: 'شوكولاتة بالحليب', category: 'sweets', defaultUnit: 'gram', availableUnits: ['gram', 'piece'], nutritionPer100g: { calories: 535, protein: 8, carbs: 59, fat: 30, fiber: 3.4, sugar: 52, sodium: 79, iron: 2.4, calcium: 189, vitaminC: 0 }, pieceWeightG: 10 },
  { id: 'nutella', name: 'Nutella', nameAr: 'نوتيلا', category: 'sweets', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'gram'], nutritionPer100g: { calories: 539, protein: 6.3, carbs: 58, fat: 31, fiber: 3.4, sugar: 55, sodium: 41, iron: 4, calcium: 105, vitaminC: 0 } },
  { id: 'jam', name: 'Jam', nameAr: 'مربى', category: 'sweets', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'gram'], nutritionPer100g: { calories: 250, protein: 0.4, carbs: 63, fat: 0.1, fiber: 1.1, sugar: 49, sodium: 32, iron: 0.5, calcium: 20, vitaminC: 8 } },
  { id: 'knafeh', name: 'Kunafa', nameAr: 'كنافة', category: 'sweets', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 410, protein: 8, carbs: 42, fat: 24, fiber: 1, sugar: 28, sodium: 200, iron: 1, calcium: 100, vitaminC: 0 }, pieceWeightG: 120 },
  { id: 'baklava', name: 'Baklava', nameAr: 'بقلاوة', category: 'sweets', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 428, protein: 6, carbs: 43, fat: 27, fiber: 2, sugar: 26, sodium: 250, iron: 1.2, calcium: 30, vitaminC: 0 }, pieceWeightG: 60 },
  { id: 'basbousa', name: 'Basbousa', nameAr: 'بسبوسة / نمورة / هريسة', category: 'sweets', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 350, protein: 5, carbs: 50, fat: 15, fiber: 1, sugar: 30, sodium: 150, iron: 0.8, calcium: 40, vitaminC: 0 }, pieceWeightG: 80 },
  { id: 'halva', name: 'Halva', nameAr: 'حلاوة طحينية', category: 'sweets', defaultUnit: 'gram', availableUnits: ['gram', 'piece'], nutritionPer100g: { calories: 469, protein: 12, carbs: 52, fat: 25, fiber: 3, sugar: 40, sodium: 10, iron: 5, calcium: 100, vitaminC: 0 }, pieceWeightG: 30 },
  { id: 'ice_cream', name: 'Ice Cream', nameAr: 'آيس كريم / بوظة', category: 'sweets', defaultUnit: 'cup', availableUnits: ['cup', 'gram', 'scoop'], nutritionPer100g: { calories: 207, protein: 3.5, carbs: 24, fat: 11, fiber: 0.7, sugar: 21, sodium: 80, iron: 0.1, calcium: 128, vitaminC: 0.6 } },
  { id: 'maamoul', name: 'Maamoul', nameAr: 'معمول', category: 'sweets', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 450, protein: 6, carbs: 55, fat: 24, fiber: 2, sugar: 25, sodium: 100, iron: 1.5, calcium: 30, vitaminC: 0 }, pieceWeightG: 40 },
  { id: 'qatayef', name: 'Qatayef', nameAr: 'قطايف', category: 'sweets', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 380, protein: 7, carbs: 45, fat: 20, fiber: 1.5, sugar: 22, sodium: 180, iron: 1, calcium: 50, vitaminC: 0 }, pieceWeightG: 70 },
  // Baleela (Egyptian wheat berry dessert)
  { id: 'baleela', name: 'Baleela', nameAr: 'بليلة', category: 'sweets', defaultUnit: 'gram', availableUnits: ['gram', 'cup', 'tbsp'], nutritionPer100g: { calories: 180, protein: 5, carbs: 30, fat: 5, fiber: 3, sugar: 12, sodium: 20, iron: 1, calcium: 50, vitaminC: 0 } },
  // Umm Ali
  { id: 'umm_ali', name: "Umm Ali", nameAr: 'أم علي', category: 'sweets', defaultUnit: 'bowl', availableUnits: ['bowl', 'gram'], nutritionPer100g: { calories: 250, protein: 6, carbs: 30, fat: 12, fiber: 1, sugar: 18, sodium: 100, iron: 1, calcium: 100, vitaminC: 0 } },
  // Roz bil Laban (Rice Pudding)
  { id: 'roz_bil_laban', name: 'Rice Pudding', nameAr: 'رز بلبن', category: 'sweets', defaultUnit: 'bowl', availableUnits: ['bowl', 'gram', 'cup'], nutritionPer100g: { calories: 130, protein: 3, carbs: 22, fat: 3, fiber: 0.5, sugar: 12, sodium: 50, iron: 0.5, calcium: 80, vitaminC: 0 } },

  // ╔══════════════════════════════════════════════╗
  // ║          🍿 وجبات خفيفة                       ║
  // ╚══════════════════════════════════════════════╝
  { id: 'chips', name: 'Potato Chips', nameAr: 'شيبس / رقائق بطاطا', category: 'snacks', defaultUnit: 'gram', availableUnits: ['gram', 'cup'], nutritionPer100g: { calories: 536, protein: 7, carbs: 53, fat: 35, fiber: 4.4, sugar: 0.3, sodium: 525, iron: 1.6, calcium: 24, vitaminC: 12 } },
  { id: 'popcorn', name: 'Popcorn', nameAr: 'فشار / بوب كورن', category: 'snacks', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 387, protein: 13, carbs: 78, fat: 4.5, fiber: 15, sugar: 0.9, sodium: 8, iron: 3.2, calcium: 7, vitaminC: 0 } },
  { id: 'crackers', name: 'Crackers', nameAr: 'بسكويت مالح / كراكرز', category: 'snacks', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 484, protein: 8, carbs: 62, fat: 23, fiber: 2.4, sugar: 8.5, sodium: 756, iron: 4.5, calcium: 118, vitaminC: 0 }, pieceWeightG: 5 },
  { id: 'rice_cake', name: 'Rice Cake', nameAr: 'كعكة أرز', category: 'snacks', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 387, protein: 8, carbs: 82, fat: 2.8, fiber: 1.8, sugar: 0, sodium: 235, iron: 0.8, calcium: 6, vitaminC: 0 }, pieceWeightG: 9 },
  { id: 'protein_bar', name: 'Protein Bar', nameAr: 'بار بروتين', category: 'snacks', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 375, protein: 30, carbs: 35, fat: 12, fiber: 5, sugar: 15, sodium: 250, iron: 5, calcium: 350, vitaminC: 0 }, pieceWeightG: 60 },
  { id: 'corn_puffs', name: 'Corn Puffs', nameAr: 'شيتوس / بوف ذرة', category: 'snacks', defaultUnit: 'gram', availableUnits: ['gram'], nutritionPer100g: { calories: 524, protein: 6, carbs: 60, fat: 29, fiber: 1, sugar: 3, sodium: 700, iron: 2, calcium: 20, vitaminC: 0 } },

  // ╔══════════════════════════════════════════════╗
  // ║            🥫 صلصات وتوابل                     ║
  // ╚══════════════════════════════════════════════╝
  { id: 'ketchup', name: 'Ketchup', nameAr: 'كاتشب', category: 'sauces', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'gram'], nutritionPer100g: { calories: 112, protein: 1.7, carbs: 26, fat: 0.1, fiber: 0.3, sugar: 22, sodium: 907, iron: 0.4, calcium: 14, vitaminC: 4 } },
  { id: 'mustard', name: 'Mustard', nameAr: 'خردل / مسطردة', category: 'sauces', defaultUnit: 'tsp', availableUnits: ['tsp', 'tbsp', 'gram'], nutritionPer100g: { calories: 60, protein: 4.4, carbs: 5.3, fat: 3.3, fiber: 3.3, sugar: 2.2, sodium: 1135, iron: 1.5, calcium: 58, vitaminC: 1.5 } },
  { id: 'mayonnaise', name: 'Mayonnaise', nameAr: 'مايونيز', category: 'sauces', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'gram'], nutritionPer100g: { calories: 680, protein: 1, carbs: 0.6, fat: 75, fiber: 0, sugar: 0.6, sodium: 635, iron: 0.2, calcium: 12, vitaminC: 0 } },
  { id: 'mayo_light', name: 'Light Mayonnaise', nameAr: 'مايونيز لايت', category: 'sauces', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'gram'], nutritionPer100g: { calories: 325, protein: 0.8, carbs: 3, fat: 34, fiber: 0, sugar: 2.5, sodium: 680, iron: 0.1, calcium: 8, vitaminC: 0 } },
  { id: 'soy_sauce', name: 'Soy Sauce', nameAr: 'صلصة صويا', category: 'sauces', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'tsp', 'ml'], nutritionPer100g: { calories: 53, protein: 8.1, carbs: 4.9, fat: 0, fiber: 0.8, sugar: 0.4, sodium: 5637, iron: 1.7, calcium: 19, vitaminC: 0 } },
  { id: 'hot_sauce', name: 'Hot Sauce', nameAr: 'صلصة حارة', category: 'sauces', defaultUnit: 'tsp', availableUnits: ['tsp', 'tbsp', 'ml'], nutritionPer100g: { calories: 11, protein: 0.5, carbs: 1.7, fat: 0.4, fiber: 0.5, sugar: 0.9, sodium: 2643, iron: 0.5, calcium: 8, vitaminC: 5 } },
  { id: 'tomato_sauce', name: 'Tomato Sauce', nameAr: 'صلصة طماطم', category: 'sauces', defaultUnit: 'cup', availableUnits: ['cup', 'tbsp', 'gram'], nutritionPer100g: { calories: 29, protein: 1.3, carbs: 5.4, fat: 0.6, fiber: 1.5, sugar: 3.6, sodium: 560, iron: 0.9, calcium: 18, vitaminC: 7 } },
  { id: 'tomato_paste', name: 'Tomato Paste', nameAr: 'معجون طماطم / صلصة', category: 'sauces', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'gram', 'can'], nutritionPer100g: { calories: 82, protein: 4.3, carbs: 19, fat: 0.5, fiber: 4.1, sugar: 12, sodium: 98, iron: 2.3, calcium: 36, vitaminC: 22 } },
  { id: 'vinegar', name: 'Vinegar', nameAr: 'خل', category: 'sauces', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'tsp', 'ml'], nutritionPer100g: { calories: 18, protein: 0, carbs: 0.6, fat: 0, fiber: 0, sugar: 0.4, sodium: 2, iron: 0, calcium: 6, vitaminC: 0 } },
  { id: 'salt', name: 'Salt', nameAr: 'ملح', category: 'sauces', defaultUnit: 'tsp', availableUnits: ['tsp', 'gram'], nutritionPer100g: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 38758, iron: 0.3, calcium: 24, vitaminC: 0 } },
  { id: 'cumin', name: 'Cumin', nameAr: 'كمون', category: 'sauces', defaultUnit: 'tsp', availableUnits: ['tsp', 'tbsp', 'gram'], nutritionPer100g: { calories: 375, protein: 18, carbs: 44, fat: 22, fiber: 11, sugar: 2.3, sodium: 168, iron: 66, calcium: 931, vitaminC: 7.7 } },
  { id: 'turmeric', name: 'Turmeric', nameAr: 'كركم', category: 'sauces', defaultUnit: 'tsp', availableUnits: ['tsp', 'tbsp', 'gram'], nutritionPer100g: { calories: 312, protein: 10, carbs: 67, fat: 3.2, fiber: 22, sugar: 3.2, sodium: 27, iron: 55, calcium: 168, vitaminC: 0.7 } },
  { id: 'cinnamon', name: 'Cinnamon', nameAr: 'قرفة', category: 'sauces', defaultUnit: 'tsp', availableUnits: ['tsp', 'tbsp', 'gram'], nutritionPer100g: { calories: 247, protein: 4, carbs: 81, fat: 1.2, fiber: 53, sugar: 2.2, sodium: 10, iron: 8.3, calcium: 1002, vitaminC: 3.8 } },
  { id: 'black_pepper', name: 'Black Pepper', nameAr: 'فلفل أسود', category: 'sauces', defaultUnit: 'tsp', availableUnits: ['tsp', 'gram'], nutritionPer100g: { calories: 251, protein: 10, carbs: 64, fat: 3.3, fiber: 25, sugar: 0.6, sodium: 20, iron: 9.7, calcium: 443, vitaminC: 0 } },
  { id: 'paprika', name: 'Paprika', nameAr: 'بابريكا / فلفل أحمر مطحون', category: 'sauces', defaultUnit: 'tsp', availableUnits: ['tsp', 'tbsp', 'gram'], nutritionPer100g: { calories: 282, protein: 14, carbs: 54, fat: 13, fiber: 35, sugar: 10, sodium: 68, iron: 21, calcium: 229, vitaminC: 0.9 } },
  { id: 'sumac', name: 'Sumac', nameAr: 'سماق', category: 'sauces', defaultUnit: 'tsp', availableUnits: ['tsp', 'tbsp', 'gram'], nutritionPer100g: { calories: 239, protein: 5, carbs: 53, fat: 4, fiber: 23, sugar: 0, sodium: 5, iron: 3, calcium: 100, vitaminC: 10 } },
  { id: 'zaatar', name: 'Zaatar Mix', nameAr: 'زعتر (خلطة)', category: 'sauces', defaultUnit: 'tbsp', availableUnits: ['tbsp', 'tsp', 'gram'], nutritionPer100g: { calories: 276, protein: 9, carbs: 49, fat: 7, fiber: 15, sugar: 2, sodium: 50, iron: 7, calcium: 350, vitaminC: 50 } },

  // ╔══════════════════════════════════════════════╗
  // ║            🍲 أطباق جاهزة                      ║
  // ╚══════════════════════════════════════════════╝
  { id: 'mansaf', name: 'Mansaf', nameAr: 'منسف', category: 'prepared', defaultUnit: 'bowl', availableUnits: ['bowl', 'gram'], nutritionPer100g: { calories: 195, protein: 10, carbs: 18, fat: 9, fiber: 0.3, sugar: 1, sodium: 350, iron: 1.2, calcium: 80, vitaminC: 0 } },
  { id: 'maqluba', name: 'Maqluba', nameAr: 'مقلوبة', category: 'prepared', defaultUnit: 'bowl', availableUnits: ['bowl', 'gram'], nutritionPer100g: { calories: 175, protein: 8, carbs: 20, fat: 7, fiber: 1.5, sugar: 2, sodium: 300, iron: 1, calcium: 30, vitaminC: 3 } },
  { id: 'musakhan', name: 'Musakhan', nameAr: 'مسخن', category: 'prepared', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 240, protein: 14, carbs: 20, fat: 12, fiber: 2, sugar: 3, sodium: 400, iron: 1.5, calcium: 35, vitaminC: 5 }, pieceWeightG: 250 },
  { id: 'tabbouleh', name: 'Tabbouleh', nameAr: 'تبولة', category: 'prepared', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 70, protein: 1.5, carbs: 8, fat: 3.5, fiber: 2.5, sugar: 2, sodium: 230, iron: 1.2, calcium: 25, vitaminC: 18 } },
  { id: 'fattoush', name: 'Fattoush', nameAr: 'فتوش', category: 'prepared', defaultUnit: 'cup', availableUnits: ['cup', 'gram'], nutritionPer100g: { calories: 85, protein: 1.5, carbs: 9, fat: 5, fiber: 2, sugar: 3, sodium: 280, iron: 0.8, calcium: 30, vitaminC: 15 } },
  { id: 'grape_leaves', name: 'Stuffed Grape Leaves', nameAr: 'ورق عنب / دوالي', category: 'prepared', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 160, protein: 3.5, carbs: 16, fat: 9, fiber: 2.5, sugar: 1.5, sodium: 400, iron: 1.5, calcium: 40, vitaminC: 3 }, pieceWeightG: 30 },
  { id: 'kibbeh', name: 'Kibbeh', nameAr: 'كبة', category: 'prepared', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 260, protein: 12, carbs: 18, fat: 16, fiber: 3, sugar: 1, sodium: 400, iron: 2, calcium: 25, vitaminC: 2 }, pieceWeightG: 50 },
  { id: 'sambousek', name: 'Sambousek', nameAr: 'سمبوسك', category: 'prepared', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 310, protein: 8, carbs: 28, fat: 19, fiber: 1.5, sugar: 1, sodium: 450, iron: 1.5, calcium: 20, vitaminC: 2 }, pieceWeightG: 35 },
  { id: 'pizza', name: 'Pizza', nameAr: 'بيتزا', category: 'prepared', defaultUnit: 'slice', availableUnits: ['slice', 'gram', 'piece'], nutritionPer100g: { calories: 266, protein: 11, carbs: 33, fat: 10, fiber: 2.3, sugar: 3.6, sodium: 598, iron: 2.5, calcium: 184, vitaminC: 2 }, pieceWeightG: 800 },
  { id: 'burger', name: 'Burger (with bun)', nameAr: 'برغر (مع خبز)', category: 'prepared', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 264, protein: 15, carbs: 24, fat: 12, fiber: 1.3, sugar: 5, sodium: 480, iron: 2.8, calcium: 73, vitaminC: 1 }, pieceWeightG: 220 },
  { id: 'french_fries', name: 'French Fries', nameAr: 'بطاطا مقلية', category: 'prepared', defaultUnit: 'gram', availableUnits: ['gram', 'cup'], nutritionPer100g: { calories: 312, protein: 3.4, carbs: 41, fat: 15, fiber: 3.8, sugar: 0.3, sodium: 210, iron: 0.8, calcium: 11, vitaminC: 4.7 } },
  { id: 'shakshuka', name: 'Shakshuka', nameAr: 'شكشوكة', category: 'prepared', defaultUnit: 'bowl', availableUnits: ['bowl', 'gram'], nutritionPer100g: { calories: 100, protein: 6, carbs: 5, fat: 6.5, fiber: 1.2, sugar: 3.5, sodium: 350, iron: 1.5, calcium: 40, vitaminC: 15 } },
  { id: 'lentil_soup', name: 'Lentil Soup', nameAr: 'شوربة عدس', category: 'prepared', defaultUnit: 'bowl', availableUnits: ['bowl', 'cup', 'gram'], nutritionPer100g: { calories: 56, protein: 3.5, carbs: 9, fat: 0.7, fiber: 3.5, sugar: 1, sodium: 300, iron: 1.5, calcium: 15, vitaminC: 2 } },
  { id: 'chicken_soup', name: 'Chicken Soup', nameAr: 'شوربة دجاج', category: 'prepared', defaultUnit: 'bowl', availableUnits: ['bowl', 'cup', 'gram'], nutritionPer100g: { calories: 36, protein: 3.3, carbs: 2, fat: 1.5, fiber: 0.3, sugar: 0.5, sodium: 340, iron: 0.3, calcium: 8, vitaminC: 0.5 } },
  // Koshary - Egyptian national dish
  { id: 'koshary', name: 'Koshary', nameAr: 'كشري', category: 'prepared', defaultUnit: 'bowl', availableUnits: ['bowl', 'gram'], nutritionPer100g: { calories: 190, protein: 7, carbs: 32, fat: 4.5, fiber: 4, sugar: 3, sodium: 350, iron: 2.5, calcium: 30, vitaminC: 3 } },
  // Molokhiya
  { id: 'molokhiya', name: 'Molokhiya', nameAr: 'ملوخية', category: 'prepared', defaultUnit: 'bowl', availableUnits: ['bowl', 'gram'], nutritionPer100g: { calories: 65, protein: 4, carbs: 8, fat: 2, fiber: 3, sugar: 1, sodium: 280, iron: 3.5, calcium: 120, vitaminC: 15 } },
  // Mahshi (Stuffed Vegetables)
  { id: 'mahshi', name: 'Mahshi (Stuffed Vegetables)', nameAr: 'محشي (ورق عنب / كوسا / باذنجان)', category: 'prepared', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 120, protein: 3, carbs: 18, fat: 4, fiber: 3, sugar: 2, sodium: 350, iron: 1.2, calcium: 40, vitaminC: 5 }, pieceWeightG: 80 },
  // Hawawshi
  { id: 'hawawshi', name: 'Hawawshi', nameAr: 'حواوشي', category: 'prepared', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 280, protein: 14, carbs: 25, fat: 14, fiber: 2, sugar: 2, sodium: 450, iron: 2.5, calcium: 35, vitaminC: 2 }, pieceWeightG: 150 },
  // Feteer Meshaltet
  { id: 'feteer', name: 'Feteer Meshaltet', nameAr: 'فطير مشلتت', category: 'prepared', defaultUnit: 'piece', availableUnits: ['piece', 'gram'], nutritionPer100g: { calories: 350, protein: 8, carbs: 38, fat: 18, fiber: 1.5, sugar: 3, sodium: 380, iron: 2, calcium: 30, vitaminC: 0 }, pieceWeightG: 120 },
  // Egyptian Rice with Noodles (Roz ma'a Sha'reyya)
  { id: 'rice_noodles', name: 'Rice with Vermicelli', nameAr: 'أرز بالشعيرية', category: 'prepared', defaultUnit: 'bowl', availableUnits: ['bowl', 'gram', 'cup'], nutritionPer100g: { calories: 160, protein: 3, carbs: 28, fat: 4, fiber: 1, sugar: 0.5, sodium: 200, iron: 0.8, calcium: 15, vitaminC: 0 } },
  // Egyptian Lentil Soup (Shorbet Ads)
  { id: 'shorbet_ads', name: 'Egyptian Lentil Soup', nameAr: 'شوربة عدس مصرية', category: 'prepared', defaultUnit: 'bowl', availableUnits: ['bowl', 'cup', 'gram'], nutritionPer100g: { calories: 70, protein: 4, carbs: 11, fat: 1, fiber: 4, sugar: 1.5, sodium: 320, iron: 2, calcium: 20, vitaminC: 3 } },

  // ╔══════════════════════════════════════════════╗
  // ║          💊 مكملات غذائية                      ║
  // ╚══════════════════════════════════════════════╝
  { id: 'whey_protein', name: 'Whey Protein', nameAr: 'بروتين واي', category: 'supplements', defaultUnit: 'scoop', availableUnits: ['scoop', 'gram'], nutritionPer100g: { calories: 400, protein: 80, carbs: 10, fat: 5, fiber: 0, sugar: 5, sodium: 200, iron: 2, calcium: 200, vitaminC: 0 } },
  { id: 'casein_protein', name: 'Casein Protein', nameAr: 'بروتين كازين', category: 'supplements', defaultUnit: 'scoop', availableUnits: ['scoop', 'gram'], nutritionPer100g: { calories: 370, protein: 77, carbs: 6, fat: 3.5, fiber: 0, sugar: 2, sodium: 280, iron: 1, calcium: 500, vitaminC: 0 } },
  { id: 'creatine', name: 'Creatine', nameAr: 'كرياتين', category: 'supplements', defaultUnit: 'tsp', availableUnits: ['tsp', 'gram'], nutritionPer100g: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0, iron: 0, calcium: 0, vitaminC: 0 } },
  { id: 'bcaa', name: 'BCAA', nameAr: 'أحماض أمينية BCAA', category: 'supplements', defaultUnit: 'scoop', availableUnits: ['scoop', 'gram'], nutritionPer100g: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0, iron: 0, calcium: 0, vitaminC: 0 } },
  { id: 'mass_gainer', name: 'Mass Gainer', nameAr: 'ماس غينر', category: 'supplements', defaultUnit: 'scoop', availableUnits: ['scoop', 'gram'], nutritionPer100g: { calories: 400, protein: 15, carbs: 75, fat: 5, fiber: 2, sugar: 20, sodium: 100, iron: 3, calcium: 150, vitaminC: 0 } },
  { id: 'collagen', name: 'Collagen Powder', nameAr: 'بودرة كولاجين', category: 'supplements', defaultUnit: 'scoop', availableUnits: ['scoop', 'gram'], nutritionPer100g: { calories: 350, protein: 90, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 150, iron: 0, calcium: 0, vitaminC: 0 } },
];

export function searchFood(query: string): FoodItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return foodDatabase.filter(
    (f) =>
      f.nameAr.includes(q) ||
      f.name.toLowerCase().includes(q) ||
      f.category.includes(q)
  ).slice(0, 20);
}

export function calculateNutrition(food: FoodItem, quantity: number, unit: string) {
  let grams: number;
  if (unit === 'piece' && food.pieceWeightG) {
    grams = quantity * food.pieceWeightG;
  } else if (unit === 'slice') {
    grams = quantity * (food.pieceWeightG || 30);
  } else if (unit === 'can') {
    grams = quantity * (food.pieceWeightG || 330);
  } else if (unit === 'scoop') {
    grams = quantity * 30;
  } else if (unit === 'bowl') {
    grams = quantity * 300;
  } else {
    grams = quantity * (unitToGrams[unit] || 1);
  }
  const factor = grams / 100;
  const n = food.nutritionPer100g;
  return {
    calories: Math.round(n.calories * factor * 10) / 10,
    protein: Math.round(n.protein * factor * 10) / 10,
    carbs: Math.round(n.carbs * factor * 10) / 10,
    fat: Math.round(n.fat * factor * 10) / 10,
    fiber: Math.round(n.fiber * factor * 10) / 10,
    sugar: Math.round(n.sugar * factor * 10) / 10,
    sodium: Math.round(n.sodium * factor * 10) / 10,
    iron: Math.round(n.iron * factor * 10) / 10,
    calcium: Math.round(n.calcium * factor * 10) / 10,
    vitaminC: Math.round(n.vitaminC * factor * 10) / 10,
    grams: Math.round(grams * 10) / 10,
  };
}