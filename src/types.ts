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

export type TabType = 'tracker' | 'profile' | 'meals' | 'telegram' | 'stats';

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

// ========== أنواع الإحصائيات ==========
export interface DailyStats {
  date: string; // YYYY-MM-DD
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
  month: string; // YYYY-MM
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
  year: string; // YYYY
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

export interface StatsData {
  dailyStats: DailyStats[];
  monthlyStats: MonthlyStats[];
  yearlyStats: YearlyStats[];
  currentStreak: number;
  bestStreak: number;
  totalDaysLogged: number;
}