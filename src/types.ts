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
  category: string;
}

export interface SavedMeal {
  id: string;
  name: string;
  entries: FoodEntry[];
  totalNutrition: NutritionValues;
  createdAt: string;
  mealType?: ExtraMealType;
}

export type TabType = 'tracker' | 'profile' | 'meals' | 'telegram';

// ========== أنواع الأكلات الإضافية ==========
export type ExtraMealType = 'وجبة رئيسية' | 'سناك' | 'مشروب' | 'حلويات' | 'فواكه';

export interface DailyExtraFood {
  id: string;
  foodName: string;
  foodNameAr: string;
  category: string;
  nutrition: NutritionValues;
  quantity: number;
  unit: string;
  timestamp: string;
  mealType: ExtraMealType;
  notes?: string;
}

// ========== أنواع الوجبات المأكولة اليوم ==========
export interface EatenMeal {
  mealId: string;
  mealName: string;
  entries: FoodEntry[];
  totalNutrition: NutritionValues;
  eatenAt: string;
  date: string; // YYYY-MM-DD
}

export interface EatenExtraFood {
  id: string;
  foodName: string;
  foodNameAr: string;
  category: string;
  nutrition: NutritionValues;
  quantity: number;
  unit: string;
  eatenAt: string;
  mealType: ExtraMealType;
  notes?: string;
  source: 'extra' | 'saved_meal';
}