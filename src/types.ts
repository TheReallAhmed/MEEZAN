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
  weight: number;
  height: number;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: Goal;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
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
}

export type TabType = 'tracker' | 'profile' | 'meals' | 'telegram' | 'stats';

// ===== أكلات اليوم =====
export interface DailyEatenFood {
  id: string;
  name: string; // اسم الوجبة أو الطعام
  nameAr: string;
  nutrition: NutritionValues;
  quantity: number;
  unit: string;
  eatenAt: string;
  mealType: 'وجبة رئيسية' | 'سناك' | 'مشروب' | 'حلويات' | 'فواكه';
  notes?: string;
  source: 'manual' | 'saved_meal' | 'quick_add';
  isMeal?: boolean; // true إذا كانت وجبة كاملة من وجباتي
  mealId?: string; // ID الوجبة الأصلية
}

// ===== الإحصائيات =====
export interface DailyStats {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalSugar: number;
  totalSodium: number;
  mealCount: number;
  extraCount: number;
  metGoal: boolean;
}

export interface MonthlyStats {
  month: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalSugar: number;
  totalSodium: number;
  avgDailyCalories: number;
  avgDailyProtein: number;
  avgDailyCarbs: number;
  avgDailyFat: number;
  daysLogged: number;
  daysMetGoal: number;
  mealCount: number;
  extraCount: number;
}

export interface YearlyStats {
  year: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalSugar: number;
  totalSodium: number;
  avgMonthlyCalories: number;
  monthsLogged: number;
  totalDaysLogged: number;
  totalMeals: number;
  totalExtras: number;
}