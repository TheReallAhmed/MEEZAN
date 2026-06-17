export interface NutritionValues {
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
  grams: number;
}

export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
export type Goal = 'bulk' | 'maintain' | 'cut';

export interface UserProfile {
  weight: number; // kg
  height: number; // cm
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: Goal;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  entries: FoodEntry[];
  totalNutrition: NutritionValues;
}

export interface FoodEntry {
  id: string;
  foodId: string;
  foodName: string;
  foodNameAr: string;
  quantity: number;
  unit: string;
  nutrition: NutritionValues;
  category: string; // إضافة التصنيف
}

export interface SavedMeal {
  id: string;
  name: string;
  entries: FoodEntry[];
  totalNutrition: NutritionValues;
  createdAt: string;
  mealType?: ExtraMealType; // إضافة اختيارية
}

export type TabType = 'tracker' | 'profile' | 'meals' | 'telegram';

// ========== أنواع جديدة للأكلات الإضافية ==========
export type ExtraMealType = 'وجبة رئيسية' | 'سناك' | 'مشروب' | 'حلويات' | 'فواكه';

export interface DailyExtraFood {
  id: string;
  foodName: string;
  foodNameAr: string;
  category: string;
  nutrition: NutritionValues;
  quantity: number;
  unit: string;
  timestamp: string; // ISO string
  mealType: ExtraMealType;
  notes?: string;
}