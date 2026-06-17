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

export interface DailyLog {
  date: string;
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
  eatenAt: string;
  mealType?: 'وجبة رئيسية' | 'سناك' | 'مشروب' | 'حلويات' | 'فواكه';
}

export interface SavedMeal {
  id: string;
  name: string;
  entries: FoodEntry[];
  totalNutrition: NutritionValues;
  createdAt: string;
}

export type TabType = 'tracker' | 'profile' | 'meals' | 'telegram' | 'stats';

// ========== أنواع الأكلات المأكولة اليوم ==========
export interface DailyEatenFood {
  id: string;
  foodName: string;
  foodNameAr: string;
  category: string;
  nutrition: NutritionValues;
  quantity: number;
  unit: string;
  eatenAt: string;
  mealType: 'وجبة رئيسية' | 'سناك' | 'مشروب' | 'حلويات' | 'فواكه';
  notes?: string;
  source: 'manual' | 'saved_meal' | 'quick_add';
}

// ========== أنواع الإحصائيات ==========
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

export interface StatsData {
  dailyStats: DailyStats[];
  monthlyStats: MonthlyStats[];
  yearlyStats: YearlyStats[];
  currentStreak: number;
  bestStreak: number;
  totalDaysLogged: number;
}