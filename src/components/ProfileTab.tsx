// utils/calculations.ts

export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
export type Goal = 'bulk' | 'maintain' | 'cut';

export const activityLabels: Record<ActivityLevel, { name: string; desc: string; emoji: string; factor: number }> = {
  sedentary: { name: 'خامل', desc: 'لا تمارس رياضة', emoji: '🛋️', factor: 1.2 },
  light: { name: 'خفيف', desc: 'تمرين 1-3 أيام', emoji: '🚶', factor: 1.375 },
  moderate: { name: 'متوسط', desc: 'تمرين 3-5 أيام', emoji: '🏃', factor: 1.55 },
  active: { name: 'نشيط', desc: 'تمرين 6-7 أيام', emoji: '🏋️', factor: 1.725 },
  veryActive: { name: 'شديد', desc: 'تمرين يومي ×2', emoji: '⚡', factor: 1.9 },
};

export const goalLabels: Record<Goal, { name: string; desc: string; emoji: string }> = {
  bulk: { name: 'تضخيم', desc: 'بناء عضلات', emoji: '💪' },
  maintain: { name: 'تثبيت', desc: 'الحفاظ على الوزن', emoji: '⚖️' },
  cut: { name: 'تنشيف', desc: 'خسارة دهون', emoji: '🔥' },
};

// تعديل الأهداف لتتناسب مع النظام الغذائي المصري 🇪🇬
export function calculateAllTargets(
  weight: number,
  height: number,
  age: number,
  gender: Gender,
  activityLevel: ActivityLevel,
  goal: Goal
) {
  // BMR - Mifflin-St Jeor
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const activityFactor = activityLabels[activityLevel].factor;
  const tdee = Math.round(bmr * activityFactor);

  let targetCalories: number;
  const surplus = 400; // أقل شوية عشان المصريين ما يزيدوا بسرعة
  const deficit = 500;

  switch (goal) {
    case 'bulk':
      targetCalories = tdee + surplus;
      break;
    case 'cut':
      targetCalories = tdee - deficit;
      break;
    default:
      targetCalories = tdee;
  }

  // Macronutrients - معدلة للأكل المصري (كارب أعلى، بروتين ودهون أقل نسبياً) 🇪🇬
  let proteinRatio: number;
  let fatRatio: number;
  let carbRatio: number;

  switch (goal) {
    case 'bulk':
      proteinRatio = 2.0; // 2g لكل كغ
      fatRatio = 0.25; // 25% من السعرات
      break;
    case 'cut':
      proteinRatio = 2.2; // 2.2g لكل كغ
      fatRatio = 0.20; // 20% من السعرات (أقل عشان التنشيف)
      break;
    default: // maintain
      proteinRatio = 1.6;
      fatRatio = 0.25;
  }

  // البروتين بالغرام
  const proteinG = Math.round(weight * proteinRatio);
  const proteinCalories = proteinG * 4;

  // الدهون بالغرام
  const fatCalories = targetCalories * fatRatio;
  const fatG = Math.round(fatCalories / 9);

  // الكارب - الباقي من السعرات (نسبة أعلى للمصريين) 🇪🇬
  const remainingCalories = targetCalories - proteinCalories - fatCalories;
  const carbsG = Math.round(remainingCalories / 4);

  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    protein: proteinG,
    fat: fatG,
    carbs: carbsG,
  };
}