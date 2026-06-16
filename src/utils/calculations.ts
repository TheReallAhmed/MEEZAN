import type { Gender, ActivityLevel, Goal } from '../types';

// Activity level multipliers for TDEE calculation
const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,      // Little or no exercise
  light: 1.375,        // Light exercise 1-3 days/week
  moderate: 1.55,      // Moderate exercise 3-5 days/week
  active: 1.725,       // Heavy exercise 6-7 days/week
  veryActive: 1.9,     // Very heavy exercise, physical job
};

export const activityLabels: Record<ActivityLevel, { name: string; desc: string; emoji: string }> = {
  sedentary: { name: 'خامل', desc: 'لا تمارين أو قليل جداً', emoji: '🪑' },
  light: { name: 'نشاط خفيف', desc: 'تمارين خفيفة 1-3 أيام/أسبوع', emoji: '🚶' },
  moderate: { name: 'نشاط متوسط', desc: 'تمارين متوسطة 3-5 أيام/أسبوع', emoji: '🏃' },
  active: { name: 'نشاط عالي', desc: 'تمارين شاقة 6-7 أيام/أسبوع', emoji: '🏋️' },
  veryActive: { name: 'نشاط عالي جداً', desc: 'تمارين مكثفة + عمل بدني', emoji: '⚡' },
};

export const goalLabels: Record<Goal, { name: string; desc: string; emoji: string; color: string }> = {
  bulk: { name: 'تضخيم', desc: 'بناء عضلات وزيادة وزن', emoji: '💪', color: 'emerald' },
  maintain: { name: 'تثبيت', desc: 'الحفاظ على الوزن الحالي', emoji: '⚖️', color: 'blue' },
  cut: { name: 'تنشيف', desc: 'حرق دهون وإنقاص وزن', emoji: '🔥', color: 'orange' },
};

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation
 * Most accurate equation for modern populations
 */
export function calculateBMR(weight: number, height: number, age: number, gender: Gender): number {
  // Mifflin-St Jeor Equation
  const baseBMR = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? baseBMR + 5 : baseBMR - 161;
}

/**
 * Calculate Total Daily Energy Expenditure
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * activityMultipliers[activityLevel]);
}

/**
 * Calculate target calories based on goal
 */
export function calculateTargetCalories(tdee: number, goal: Goal): number {
  switch (goal) {
    case 'bulk':
      return Math.round(tdee + 400); // Surplus for muscle gain
    case 'cut':
      return Math.round(tdee - 500); // Deficit for fat loss
    case 'maintain':
    default:
      return tdee;
  }
}

/**
 * Calculate macros for bulking
 * - Protein: 2g per kg body weight (high for muscle synthesis)
 * - Fat: 25% of calories
 * - Carbs: remaining calories
 */
export function calculateBulkMacros(targetCalories: number, weight: number): { protein: number; carbs: number; fat: number } {
  // High protein for muscle building: 2g/kg
  const protein = Math.round(weight * 2);
  
  // Fat: 25% of calories (1g fat = 9 cal)
  const fatCalories = targetCalories * 0.25;
  const fat = Math.round(fatCalories / 9);
  
  // Carbs: remaining calories (1g carb = 4 cal)
  const proteinCalories = protein * 4;
  const remainingCalories = targetCalories - proteinCalories - fatCalories;
  const carbs = Math.round(remainingCalories / 4);
  
  return { protein, carbs, fat };
}

/**
 * Calculate macros for cutting
 * - Protein: 2.2g per kg (even higher to preserve muscle)
 * - Fat: 20% of calories
 * - Carbs: remaining calories
 */
export function calculateCutMacros(targetCalories: number, weight: number): { protein: number; carbs: number; fat: number } {
  // Very high protein to preserve muscle during deficit
  const protein = Math.round(weight * 2.2);
  
  // Lower fat during cut: 20%
  const fatCalories = targetCalories * 0.20;
  const fat = Math.round(fatCalories / 9);
  
  // Carbs: remaining
  const proteinCalories = protein * 4;
  const remainingCalories = targetCalories - proteinCalories - fatCalories;
  const carbs = Math.round(Math.max(remainingCalories / 4, 50)); // minimum 50g carbs
  
  return { protein, carbs, fat };
}

/**
 * Calculate macros for maintenance
 * - Protein: 1.6g per kg
 * - Fat: 25% of calories
 * - Carbs: remaining
 */
export function calculateMaintainMacros(targetCalories: number, weight: number): { protein: number; carbs: number; fat: number } {
  const protein = Math.round(weight * 1.6);
  const fatCalories = targetCalories * 0.25;
  const fat = Math.round(fatCalories / 9);
  const proteinCalories = protein * 4;
  const remainingCalories = targetCalories - proteinCalories - fatCalories;
  const carbs = Math.round(remainingCalories / 4);
  
  return { protein, carbs, fat };
}

/**
 * Calculate all targets for a user profile
 */
export function calculateAllTargets(
  weight: number,
  height: number,
  age: number,
  gender: Gender,
  activityLevel: ActivityLevel,
  goal: Goal
): { bmr: number; tdee: number; targetCalories: number; protein: number; carbs: number; fat: number } {
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const targetCalories = calculateTargetCalories(tdee, goal);
  
  let macros: { protein: number; carbs: number; fat: number };
  
  switch (goal) {
    case 'bulk':
      macros = calculateBulkMacros(targetCalories, weight);
      break;
    case 'cut':
      macros = calculateCutMacros(targetCalories, weight);
      break;
    case 'maintain':
    default:
      macros = calculateMaintainMacros(targetCalories, weight);
  }
  
  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    ...macros,
  };
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
}

/**
 * Get status color based on progress
 */
export function getProgressStatus(current: number, target: number): 'under' | 'good' | 'over' {
  const percent = (current / target) * 100;
  if (percent < 80) return 'under';
  if (percent <= 110) return 'good';
  return 'over';
}
