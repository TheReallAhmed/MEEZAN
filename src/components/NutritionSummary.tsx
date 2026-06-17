import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Target, TrendingUp, Check } from 'lucide-react';
import type { NutritionValues, UserProfile } from '../types';

interface NutritionSummaryProps {
  total: NutritionValues;
  entryCount: number;
  profile: UserProfile | null;
  extraTotal?: NutritionValues;
  extraCount?: number;
  todayTotal?: NutritionValues;
  todayCount?: number;
}

interface NutrientInfo {
  key: keyof NutritionValues;
  label: string;
  unit: string;
  gradient: string;
  textColor: string;
  bgColor: string;
  dailyTarget: number;
  emoji: string;
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 600;
    const start = display;
    const diff = value - start;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round((start + diff * eased) * 10) / 10);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);

  return <>{Math.round(display * 10) / 10}</>;
}

export default function NutritionSummary({ total, entryCount, profile, extraTotal, extraCount, todayTotal, todayCount }: NutritionSummaryProps) {
  if (entryCount === 0 && (!extraCount || extraCount === 0) && (!todayCount || todayCount === 0)) return null;

  const hasProfile = !!profile;
  const hasExtras = extraTotal && extraCount && extraCount > 0;
  const hasToday = todayTotal && todayCount && todayCount > 0;

  // دمج الإجمالي مع الإضافات والوجبات المأكولة
  let combinedTotal = { ...total };
  
  if (hasExtras) {
    combinedTotal = {
      calories: combinedTotal.calories + extraTotal.calories,
      protein: combinedTotal.protein + extraTotal.protein,
      carbs: combinedTotal.carbs + extraTotal.carbs,
      fat: combinedTotal.fat + extraTotal.fat,
      fiber: combinedTotal.fiber + extraTotal.fiber,
      sugar: combinedTotal.sugar + extraTotal.sugar,
      sodium: combinedTotal.sodium + extraTotal.sodium,
      iron: combinedTotal.iron + extraTotal.iron,
      calcium: combinedTotal.calcium + extraTotal.calcium,
      vitaminC: combinedTotal.vitaminC + extraTotal.vitaminC,
      grams: combinedTotal.grams + extraTotal.grams,
    };
  }

  // إضافة الوجبات المأكولة للتوتال (لأنها فعلاً أكلت)
  if (hasToday) {
    combinedTotal = {
      calories: combinedTotal.calories + todayTotal.calories,
      protein: combinedTotal.protein + todayTotal.protein,
      carbs: combinedTotal.carbs + todayTotal.carbs,
      fat: combinedTotal.fat + todayTotal.fat,
      fiber: combinedTotal.fiber + todayTotal.fiber,
      sugar: combinedTotal.sugar + todayTotal.sugar,
      sodium: combinedTotal.sodium + todayTotal.sodium,
      iron: combinedTotal.iron + todayTotal.iron,
      calcium: combinedTotal.calcium + todayTotal.calcium,
      vitaminC: combinedTotal.vitaminC + todayTotal.vitaminC,
      grams: combinedTotal.grams + todayTotal.grams,
    };
  }

  const getTargets = () => {
    if (profile) {
      return {
        calories: profile.targetCalories || 2000,
        protein: profile.targetProtein || 50,
        carbs: profile.targetCarbs || 300,
        fat: profile.targetFat || 65,
      };
    }
    return {
      calories: 2000,
      protein: 50,
      carbs: 380,
      fat: 60,
    };
  };

  const targets = getTargets();

  const mainNutrients: NutrientInfo[] = [
    { 
      key: 'calories', 
      label: 'سعرات حرارية', 
      unit: '', 
      gradient: 'from-orange-500 to-red-500', 
      textColor: 'text-orange-400', 
      bgColor: 'from-orange-500/15 to-red-500/5', 
      dailyTarget: targets.calories, 
      emoji: '🔥' 
    },
    { 
      key: 'protein', 
      label: 'بروتين', 
      unit: 'g', 
      gradient: 'from-blue-500 to-cyan-500', 
      textColor: 'text-blue-400', 
      bgColor: 'from-blue-500/15 to-cyan-500/5', 
      dailyTarget: targets.protein, 
      emoji: '💪' 
    },
    { 
      key: 'carbs', 
      label: 'كربوهيدرات', 
      unit: 'g', 
      gradient: 'from-amber-500 to-yellow-500', 
      textColor: 'text-amber-400', 
      bgColor: 'from-amber-500/15 to-yellow-500/5', 
      dailyTarget: targets.carbs, 
      emoji: '🌾' 
    },
    { 
      key: 'fat', 
      label: 'دهون', 
      unit: 'g', 
      gradient: 'from-pink-500 to-rose-500', 
      textColor: 'text-rose-400', 
      bgColor: 'from-pink-500/15 to-rose-500/5', 
      dailyTarget: targets.fat, 
      emoji: '🧈' 
    },
  ];

  const secondaryNutrients: NutrientInfo[] = [
    { key: 'fiber', label: 'ألياف', unit: 'g', gradient: 'from-green-500 to-emerald-500', textColor: 'text-green-400', bgColor: 'from-green-500/10 to-emerald-500/5', dailyTarget: 25, emoji: '🥬' },
    { key: 'sugar', label: 'سكر', unit: 'g', gradient: 'from-purple-500 to-violet-500', textColor: 'text-purple-400', bgColor: 'from-purple-500/10 to-violet-500/5', dailyTarget: 50, emoji: '🍬' },
    { key: 'sodium', label: 'صوديوم', unit: 'mg', gradient: 'from-slate-400 to-gray-500', textColor: 'text-slate-400', bgColor: 'from-slate-500/10 to-gray-500/5', dailyTarget: 2300, emoji: '🧂' },
    { key: 'iron', label: 'حديد', unit: 'mg', gradient: 'from-red-600 to-red-500', textColor: 'text-red-400', bgColor: 'from-red-500/10 to-red-600/5', dailyTarget: 18, emoji: '🩸' },
    { key: 'calcium', label: 'كالسيوم', unit: 'mg', gradient: 'from-teal-400 to-teal-500', textColor: 'text-teal-400', bgColor: 'from-teal-500/10 to-teal-600/5', dailyTarget: 1000, emoji: '🦴' },
    { key: 'vitaminC', label: 'فيتامين C', unit: 'mg', gradient: 'from-yellow-400 to-orange-400', textColor: 'text-yellow-400', bgColor: 'from-yellow-500/10 to-orange-500/5', dailyTarget: 90, emoji: '🍊' },
  ];

  const remainingCalories = targets.calories - combinedTotal.calories;
  const remainingProtein = targets.protein - combinedTotal.protein;
  const remainingCarbs = targets.carbs - combinedTotal.carbs;
  const remainingFat = targets.fat - combinedTotal.fat;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', bounce: 0.2 }}
      className="space-y-4"
    >
      {/* Extra foods summary */}
      {hasExtras && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-amber-400/60 bg-amber-500/10 rounded-xl py-2 px-4 border border-amber-500/15"
        >
          📊 إضافات اليوم: <span className="font-bold">{Math.round(extraTotal.calories)}</span> سعرة 
          ({extraCount} أكلات) — 💪 {extraTotal.protein}g | 🌾 {extraTotal.carbs}g | 🧈 {extraTotal.fat}g
        </motion.div>
      )}

      {/* Today eaten summary */}
      {hasToday && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-emerald-400/60 bg-emerald-500/10 rounded-xl py-2 px-4 border border-emerald-500/15"
        >
          ✅ أكلت اليوم: <span className="font-bold">{Math.round(todayTotal.calories)}</span> سعرة 
          ({todayCount} عناصر) — 💪 {todayTotal.protein}g | 🌾 {todayTotal.carbs}g | 🧈 {todayTotal.fat}g
        </motion.div>
      )}

      {/* Target header if profile exists */}
      {hasProfile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 text-xs text-white/25"
        >
          <Target size={12} />
          <span>هدفك: {profile.goal === 'bulk' ? 'تضخيم 💪' : profile.goal === 'cut' ? 'تنشيف 🔥' : 'تثبيت ⚖️'}</span>
        </motion.div>
      )}

      {/* Main macros */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {mainNutrients.map((n, i) => {
          const value = combinedTotal[n.key];
          const percent = Math.min((value / n.dailyTarget) * 100, 100);
          const remaining = n.dailyTarget - value;
          const isComplete = percent >= 100;

          return (
            <motion.div
              key={n.key}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.08, type: 'spring', bounce: 0.3 }}
              className={`relative bg-gradient-to-br ${n.bgColor} rounded-3xl p-5 text-center overflow-hidden border ${
                isComplete ? 'border-green-500/30' : 'border-white/[0.04]'
              }`}
            >
              {isComplete && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 left-2"
                >
                  <Check size={14} className="text-green-400" />
                </motion.div>
              )}

              <div className="relative z-10">
                <span className="text-lg">{n.emoji}</span>
                <div className={`text-3xl font-extrabold ${n.textColor} mt-1`}>
                  <AnimatedNumber value={value} />
                  {n.unit && <span className="text-sm font-normal opacity-50 mr-1">{n.unit}</span>}
                </div>
                <div className="text-[11px] text-white/30 mt-1 font-medium">{n.label}</div>

                <div className="mt-3 relative">
                  <div className="nutrient-bar h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 1.2, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                      className={`nutrient-bar-fill h-full ${
                        isComplete ? 'bg-green-500' : `bg-gradient-to-r ${n.gradient}`
                      }`}
                    />
                  </div>

                  {hasProfile ? (
                    <div className={`text-[9px] mt-1.5 font-medium ${
                      remaining > 0 ? 'text-white/20' : 'text-green-400/60'
                    }`}>
                      {remaining > 0 ? `باقي ${Math.round(remaining)}${n.unit}` : '✓ مكتمل!'}
                    </div>
                  ) : (
                    <div className="text-[9px] text-white/15 mt-1.5 font-medium">
                      {Math.round(percent)}% من اليومي
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Remaining summary if profile exists */}
      {hasProfile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-primary-500/5 to-emerald-500/5 rounded-2xl p-4 border border-primary-500/10"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <TrendingUp size={14} className="text-primary-400" />
            <span className="text-xs font-bold text-white/50">المتبقي لهدفك اليوم</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className={`text-sm font-bold ${remainingCalories > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                {remainingCalories > 0 ? Math.round(remainingCalories) : '✓'}
              </div>
              <div className="text-[9px] text-white/20">سعرات</div>
            </div>
            <div>
              <div className={`text-sm font-bold ${remainingProtein > 0 ? 'text-blue-400' : 'text-green-400'}`}>
                {remainingProtein > 0 ? `${Math.round(remainingProtein)}g` : '✓'}
              </div>
              <div className="text-[9px] text-white/20">بروتين</div>
            </div>
            <div>
              <div className={`text-sm font-bold ${remainingCarbs > 0 ? 'text-amber-400' : 'text-green-400'}`}>
                {remainingCarbs > 0 ? `${Math.round(remainingCarbs)}g` : '✓'}
              </div>
              <div className="text-[9px] text-white/20">كارب</div>
            </div>
            <div>
              <div className={`text-sm font-bold ${remainingFat > 0 ? 'text-pink-400' : 'text-green-400'}`}>
                {remainingFat > 0 ? `${Math.round(remainingFat)}g` : '✓'}
              </div>
              <div className="text-[9px] text-white/20">دهون</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Secondary nutrients */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white/[0.02] rounded-3xl p-5 border border-white/[0.04]"
      >
        <h4 className="text-white/25 text-xs font-semibold text-right mb-4">📊 تفاصيل إضافية</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {secondaryNutrients.map((n, i) => {
            const value = combinedTotal[n.key];
            const percent = Math.min((value / n.dailyTarget) * 100, 100);
            return (
              <motion.div
                key={n.key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.06 }}
                className="text-right"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`font-bold text-sm ${n.textColor}`}>
                    <AnimatedNumber value={value} />
                    <span className="text-white/20 text-xs font-normal mr-0.5">{n.unit}</span>
                  </span>
                  <span className="text-white/30 text-[11px] font-medium flex items-center gap-1">
                    {n.label}
                    <span>{n.emoji}</span>
                  </span>
                </div>
                <div className="nutrient-bar h-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1, delay: 0.7 + i * 0.06 }}
                    className={`nutrient-bar-fill h-full bg-gradient-to-r ${n.gradient}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Weight badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center"
      >
        <span className="inline-flex items-center gap-1.5 text-white/15 text-xs bg-white/[0.02] px-4 py-1.5 rounded-full">
          ⚖️ الوزن الإجمالي: {Math.round(combinedTotal.grams)} غرام
        </span>
      </motion.div>
    </motion.div>
  );
}