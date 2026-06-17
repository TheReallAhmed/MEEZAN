import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, ChevronLeft, ChevronRight, BarChart3, PieChart,
  Dumbbell, Wheat, Droplet, Award, Flame, Target, TrendingUp, 
  TrendingDown, Activity, Weight, Zap, Crown, Medal, GitBranch
} from 'lucide-react';
import type { 
  DailyStats, MonthlyStats, YearlyStats, 
  NutritionValues, UserProfile, EatenMeal, EatenExtraFood 
} from '../types';

interface StatsTabProps {
  profile: UserProfile | null;
  eatenMeals: EatenMeal[];
  eatenExtras: EatenExtraFood[];
}

// حساب السعرات الزائدة/الناقصة
function calculateCalorieSurplus(caloriesEaten: number, targetCalories: number): number {
  return caloriesEaten - targetCalories;
}

// تقدير تغير الوزن بناءً على السعرات (1 كجم دهون = 7700 سعرة)
function estimateWeightChange(calorieSurplus: number, days: number): number {
  const totalSurplus = calorieSurplus * days;
  return totalSurplus / 7700; // بالكيلوجرام
}

// تقدير نسبة العضلات المضافة (تقديرية)
function estimateMuscleGain(calorieSurplus: number, proteinIntake: number, targetProtein: number, days: number): number {
  // إذا كان في تضخيم وبروتين كافي
  if (calorieSurplus > 0 && proteinIntake >= targetProtein * 0.8) {
    // تقدير: 20-30% من الوزن الزائد عضلات
    const totalSurplus = calorieSurplus * days;
    const muscleRatio = Math.min(proteinIntake / targetProtein, 1.5) * 0.25;
    return (totalSurplus / 7700) * muscleRatio;
  }
  // إذا كان في تنشيف
  if (calorieSurplus < 0 && proteinIntake >= targetProtein * 0.9) {
    // الحفاظ على العضلات أثناء التنشيف
    return 0;
  }
  return 0;
}

export default function StatsTab({ profile, eatenMeals, eatenExtras }: StatsTabProps) {
  const [view, setView] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    return String(new Date().getFullYear());
  });

  // حساب الإحصائيات من البيانات
  const statsData = useMemo(() => {
    const dailyMap: Map<string, DailyStats> = new Map();
    const allEntries: { date: string; nutrition: NutritionValues; type: 'meal' | 'extra' }[] = [];

    eatenMeals.forEach(meal => {
      const date = meal.date;
      allEntries.push({
        date,
        nutrition: meal.totalNutrition,
        type: 'meal'
      });
    });

    eatenExtras.forEach(extra => {
      const date = new Date(extra.eatenAt).toISOString().split('T')[0];
      allEntries.push({
        date,
        nutrition: extra.nutrition,
        type: 'extra'
      });
    });

    allEntries.forEach(({ date, nutrition, type }) => {
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          totalFiber: 0,
          totalSugar: 0,
          totalSodium: 0,
          mealCount: 0,
          extraCount: 0,
          metGoal: false,
        });
      }
      const stat = dailyMap.get(date)!;
      stat.totalCalories += nutrition.calories;
      stat.totalProtein += nutrition.protein;
      stat.totalCarbs += nutrition.carbs;
      stat.totalFat += nutrition.fat;
      stat.totalFiber += nutrition.fiber;
      stat.totalSugar += nutrition.sugar;
      stat.totalSodium += nutrition.sodium;
      if (type === 'meal') stat.mealCount += 1;
      else stat.extraCount += 1;
    });

    const dailyStats: DailyStats[] = Array.from(dailyMap.values()).map(stat => {
      if (profile) {
        const calPercent = (stat.totalCalories / profile.targetCalories) * 100;
        // هدف: 80-120% من الهدف يعتبر محقق
        stat.metGoal = calPercent >= 80 && calPercent <= 120;
      } else {
        stat.metGoal = stat.totalCalories >= 1500 && stat.totalCalories <= 2500;
      }
      return stat;
    });

    dailyStats.sort((a, b) => a.date.localeCompare(b.date));

    // Monthly stats
    const monthlyMap: Map<string, MonthlyStats> = new Map();
    dailyStats.forEach(stat => {
      const month = stat.date.substring(0, 7);
      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, {
          month,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          totalFiber: 0,
          totalSugar: 0,
          totalSodium: 0,
          avgDailyCalories: 0,
          avgDailyProtein: 0,
          avgDailyCarbs: 0,
          avgDailyFat: 0,
          daysLogged: 0,
          daysMetGoal: 0,
          mealCount: 0,
          extraCount: 0,
        });
      }
      const mStat = monthlyMap.get(month)!;
      mStat.totalCalories += stat.totalCalories;
      mStat.totalProtein += stat.totalProtein;
      mStat.totalCarbs += stat.totalCarbs;
      mStat.totalFat += stat.totalFat;
      mStat.totalFiber += stat.totalFiber;
      mStat.totalSugar += stat.totalSugar;
      mStat.totalSodium += stat.totalSodium;
      mStat.daysLogged += 1;
      if (stat.metGoal) mStat.daysMetGoal += 1;
      mStat.mealCount += stat.mealCount;
      mStat.extraCount += stat.extraCount;
    });

    monthlyMap.forEach(stat => {
      stat.avgDailyCalories = Math.round(stat.totalCalories / stat.daysLogged);
      stat.avgDailyProtein = Math.round(stat.totalProtein / stat.daysLogged);
      stat.avgDailyCarbs = Math.round(stat.totalCarbs / stat.daysLogged);
      stat.avgDailyFat = Math.round(stat.totalFat / stat.daysLogged);
    });

    const monthlyStats: MonthlyStats[] = Array.from(monthlyMap.values());
    monthlyStats.sort((a, b) => a.month.localeCompare(b.month));

    // Yearly stats
    const yearlyMap: Map<string, YearlyStats> = new Map();
    monthlyStats.forEach(stat => {
      const year = stat.month.substring(0, 4);
      if (!yearlyMap.has(year)) {
        yearlyMap.set(year, {
          year,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          totalFiber: 0,
          totalSugar: 0,
          totalSodium: 0,
          avgMonthlyCalories: 0,
          monthsLogged: 0,
          totalDaysLogged: 0,
          totalMeals: 0,
          totalExtras: 0,
        });
      }
      const yStat = yearlyMap.get(year)!;
      yStat.totalCalories += stat.totalCalories;
      yStat.totalProtein += stat.totalProtein;
      yStat.totalCarbs += stat.totalCarbs;
      yStat.totalFat += stat.totalFat;
      yStat.totalFiber += stat.totalFiber;
      yStat.totalSugar += stat.totalSugar;
      yStat.totalSodium += stat.totalSodium;
      yStat.monthsLogged += 1;
      yStat.totalDaysLogged += stat.daysLogged;
      yStat.totalMeals += stat.mealCount;
      yStat.totalExtras += stat.extraCount;
    });

    yearlyMap.forEach(stat => {
      stat.avgMonthlyCalories = Math.round(stat.totalCalories / stat.monthsLogged);
    });

    const yearlyStats: YearlyStats[] = Array.from(yearlyMap.values());
    yearlyStats.sort((a, b) => a.year.localeCompare(b.year));

    // Streak
    let currentStreak = 0;
    let bestStreak = 0;
    const dates = dailyStats.map(s => s.date);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (dates.includes(today)) {
      currentStreak = 1;
      let checkDate = new Date(Date.now() - 86400000);
      while (dates.includes(checkDate.toISOString().split('T')[0])) {
        currentStreak += 1;
        checkDate = new Date(checkDate.getTime() - 86400000);
      }
    } else if (dates.includes(yesterday)) {
      currentStreak = 1;
      let checkDate = new Date(Date.now() - 2 * 86400000);
      while (dates.includes(checkDate.toISOString().split('T')[0])) {
        currentStreak += 1;
        checkDate = new Date(checkDate.getTime() - 86400000);
      }
    }

    let streak = 0;
    for (let i = 0; i < dates.length; i++) {
      if (i === 0) {
        streak = 1;
      } else {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        const diff = (curr.getTime() - prev.getTime()) / 86400000;
        if (diff === 1) {
          streak += 1;
        } else {
          streak = 1;
        }
      }
      bestStreak = Math.max(bestStreak, streak);
    }

    return {
      dailyStats,
      monthlyStats,
      yearlyStats,
      currentStreak,
      bestStreak,
      totalDaysLogged: dailyStats.length,
    };
  }, [eatenMeals, eatenExtras, profile]);

  // ============================================
  // حساب تقديرات الوزن
  // ============================================
  const weightEstimates = useMemo(() => {
    if (!profile) return null;

    const targetCalories = profile.targetCalories;
    const currentWeight = profile.weight;
    const goal = profile.goal;

    // إجمالي الأيام المسجلة
    const totalDays = statsData.totalDaysLogged;

    // حساب متوسط السعرات اليومية من الأيام المسجلة
    const avgDailyCalories = statsData.dailyStats.length > 0
      ? statsData.dailyStats.reduce((sum, d) => sum + d.totalCalories, 0) / statsData.dailyStats.length
      : 0;

    // حساب متوسط البروتين اليومي
    const avgDailyProtein = statsData.dailyStats.length > 0
      ? statsData.dailyStats.reduce((sum, d) => sum + d.totalProtein, 0) / statsData.dailyStats.length
      : 0;

    // السعرات الزائدة/الناقصة يومياً
    const dailySurplus = avgDailyCalories - targetCalories;

    // تقدير تغير الوزن الكلي
    const estimatedWeightChange = estimateWeightChange(dailySurplus, totalDays);

    // تقدير العضلات المضافة
    const estimatedMuscleGain = estimateMuscleGain(
      dailySurplus, 
      avgDailyProtein, 
      profile.targetProtein, 
      totalDays
    );

    // تقدير الدهون المفقودة/المضافة
    const estimatedFatChange = estimatedWeightChange - estimatedMuscleGain;

    // الوزن المتوقع حالياً
    const estimatedCurrentWeight = currentWeight + estimatedWeightChange;

    // نسبة تحقيق الهدف
    const goalAchievementRate = statsData.dailyStats.length > 0
      ? (statsData.dailyStats.filter(d => d.metGoal).length / statsData.dailyStats.length) * 100
      : 0;

    // عدد الأيام المتبقية لتحقيق الهدف (تقديري)
    const kgRemaining = goal === 'bulk' 
      ? Math.max(0, (currentWeight * 1.1) - estimatedCurrentWeight) // افتراض زيادة 10%
      : goal === 'cut'
        ? Math.max(0, estimatedCurrentWeight - (currentWeight * 0.9))
        : 0;

    const daysToGoal = kgRemaining > 0 && Math.abs(dailySurplus) > 0
      ? Math.round(kgRemaining / (Math.abs(dailySurplus) / 7700))
      : 0;

    return {
      avgDailyCalories,
      avgDailyProtein,
      dailySurplus,
      estimatedWeightChange,
      estimatedMuscleGain,
      estimatedFatChange,
      estimatedCurrentWeight,
      goalAchievementRate,
      kgRemaining,
      daysToGoal,
      totalDays,
      goal,
      targetCalories,
      currentWeight,
    };
  }, [profile, statsData]);

  // ============================================
  // عرض تقديرات الوزن
  // ============================================
  const renderWeightEstimates = () => {
    if (!weightEstimates) {
      return (
        <div className="glass-card rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3 opacity-20">⚖️</div>
          <p className="text-white/20 text-sm">أضف ملفك الشخصي لتظهر تقديرات الوزن</p>
          <p className="text-white/10 text-xs mt-1">اذهب إلى تبويب "ملفي" وأدخل بياناتك</p>
        </div>
      );
    }

    const {
      avgDailyCalories,
      avgDailyProtein,
      dailySurplus,
      estimatedWeightChange,
      estimatedMuscleGain,
      estimatedFatChange,
      estimatedCurrentWeight,
      goalAchievementRate,
      kgRemaining,
      daysToGoal,
      totalDays,
      goal,
      targetCalories,
      currentWeight,
    } = weightEstimates;

    const isBulk = goal === 'bulk';
    const isCut = goal === 'cut';
    const isMaintain = goal === 'maintain';

    const goalEmoji = isBulk ? '💪' : isCut ? '🔥' : '⚖️';
    const goalLabel = isBulk ? 'تضخيم' : isCut ? 'تنشيف' : 'تثبيت';
    const trendColor = isBulk ? 'text-emerald-400' : isCut ? 'text-orange-400' : 'text-blue-400';
    const trendIcon = estimatedWeightChange > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />;

    return (
      <div className="space-y-4">
        {/* بطاقة التقدير الرئيسية */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 border border-primary-500/20 bg-gradient-to-br from-primary-500/5 via-emerald-500/5 to-amber-500/5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-white/30 text-xs bg-white/[0.03] px-3 py-1 rounded-full">
              <Activity size={12} />
              <span>تقديرات الوزن والتقدم</span>
            </div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target size={14} className="text-primary-400" />
              {goalEmoji} {goalLabel}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* الوزن الحالي */}
            <div className="bg-white/[0.03] rounded-2xl p-4 text-center border border-white/[0.04]">
              <div className="text-2xl font-black text-white">{currentWeight}</div>
              <div className="text-[9px] text-white/30">الوزن الحالي (كجم)</div>
            </div>

            {/* الوزن المتوقع */}
            <div className="bg-white/[0.03] rounded-2xl p-4 text-center border border-white/[0.04]">
              <div className={`text-2xl font-black ${trendColor}`}>
                {estimatedCurrentWeight.toFixed(1)}
              </div>
              <div className="text-[9px] text-white/30">الوزن المتوقع</div>
              <div className="text-[8px] text-white/15 mt-0.5">
                {estimatedWeightChange > 0 ? '+' : ''}{estimatedWeightChange.toFixed(2)} كجم
              </div>
            </div>

            {/* تغير العضلات */}
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-2xl p-4 text-center border border-blue-500/20">
              <div className="flex items-center justify-center gap-1">
                <Dumbbell size={14} className="text-blue-400" />
                <span className="text-xl font-bold text-blue-400">
                  {estimatedMuscleGain.toFixed(2)}
                </span>
                <span className="text-[9px] text-white/30">كجم</span>
              </div>
              <div className="text-[9px] text-white/30">عضلات مضافة</div>
            </div>

            {/* تغير الدهون */}
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/5 rounded-2xl p-4 text-center border border-orange-500/20">
              <div className="flex items-center justify-center gap-1">
                <Flame size={14} className="text-orange-400" />
                <span className={`text-xl font-bold ${estimatedFatChange > 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
                  {estimatedFatChange > 0 ? '+' : ''}{estimatedFatChange.toFixed(2)}
                </span>
                <span className="text-[9px] text-white/30">كجم</span>
              </div>
              <div className="text-[9px] text-white/30">
                {estimatedFatChange > 0 ? 'دهون مضافة' : 'دهون مفقودة'}
              </div>
            </div>
          </div>

          {/* السعرات اليومية */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-white/[0.02] rounded-xl p-3 text-center border border-white/[0.03]">
              <div className="flex items-center justify-center gap-1 text-orange-400">
                <Flame size={12} />
                <span className="text-sm font-bold">{Math.round(avgDailyCalories)}</span>
                <span className="text-[8px] text-white/30">سعرة</span>
              </div>
              <div className="text-[8px] text-white/20">متوسط يومي</div>
              <div className="text-[7px] text-white/10">
                الهدف: {targetCalories} سعرة
                <span className={`mr-1 ${dailySurplus > 0 ? 'text-emerald-400/60' : 'text-orange-400/60'}`}>
                  ({dailySurplus > 0 ? '+' : ''}{Math.round(dailySurplus)})
                </span>
              </div>
            </div>

            <div className="bg-white/[0.02] rounded-xl p-3 text-center border border-white/[0.03]">
              <div className="flex items-center justify-center gap-1 text-blue-400">
                <Dumbbell size={12} />
                <span className="text-sm font-bold">{Math.round(avgDailyProtein)}</span>
                <span className="text-[8px] text-white/30">g</span>
              </div>
              <div className="text-[8px] text-white/20">بروتين يومي</div>
              <div className="text-[7px] text-white/10">
                الهدف: {profile?.targetProtein || 0}g
              </div>
            </div>
          </div>
        </motion.div>

        {/* نسبة تحقيق الهدف */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-4 border border-white/[0.04]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <div>
                <div className="text-xs text-white/60 font-medium">نسبة تحقيق الهدف</div>
                <div className="text-[8px] text-white/20">{totalDays} أيام مسجلة</div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-400">{Math.round(goalAchievementRate)}%</span>
            </div>
          </div>
          <div className="mt-2 h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${goalAchievementRate}%` }}
              transition={{ duration: 1 }}
              className={`h-full rounded-full ${
                goalAchievementRate >= 80 ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
                goalAchievementRate >= 50 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                'bg-gradient-to-r from-red-500 to-orange-400'
              }`}
            />
          </div>
          {kgRemaining > 0 && daysToGoal > 0 && (
            <div className="flex items-center justify-between mt-2 text-[8px] text-white/20">
              <span>⏳ {daysToGoal} يوم متبقية للهدف</span>
              <span>📊 {kgRemaining.toFixed(1)} كجم متبقية</span>
            </div>
          )}
        </motion.div>

        {/* نصائح مخصصة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-4 border border-white/[0.04] bg-gradient-to-r from-primary-500/5 to-emerald-500/5"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💡</span>
            <span className="text-xs text-white/40 font-medium">نصائح مخصصة لهدفك</span>
          </div>
          <ul className="space-y-1.5 text-[10px] text-white/30">
            {isBulk && (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400/50">•</span>
                  <span>أنت في مرحلة تضخيم، ركز على زيادة السعرات 300-500 فوق احتياجك</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400/50">•</span>
                  <span>بروتينك اليومي {Math.round(avgDailyProtein)}g 
                    {profile && avgDailyProtein < profile.targetProtein * 0.8 ? ' ⚠️ أقل من المطلوب، زد من مصادر البروتين' : ' ✅ ممتاز!'}
                  </span>
                </li>
                {estimatedMuscleGain > 0.5 && (
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400/50">•</span>
                    <span>💪 تقديري: كسبت {estimatedMuscleGain.toFixed(2)} كجم عضلات حتى الآن! استمر!</span>
                  </li>
                )}
              </>
            )}
            {isCut && (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400/50">•</span>
                  <span>أنت في مرحلة تنشيف، حافظ على عجز 300-500 سعرة يومياً</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400/50">•</span>
                  <span>بروتينك اليومي {Math.round(avgDailyProtein)}g
                    {profile && avgDailyProtein < profile.targetProtein * 0.9 ? ' ⚠️ زد البروتين للحفاظ على العضلات' : ' ✅ جيد!'}
                  </span>
                </li>
                {estimatedFatChange < -0.5 && (
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400/50">•</span>
                    <span>🔥 فقدت {Math.abs(estimatedFatChange).toFixed(2)} كجم دهون! استمر بنفس الوتيرة</span>
                  </li>
                )}
              </>
            )}
            {isMaintain && (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400/50">•</span>
                  <span>أنت في مرحلة تثبيت، حافظ على سعراتك قريبة من احتياجك اليومي</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400/50">•</span>
                  <span>وزنك المتوقع: {estimatedCurrentWeight.toFixed(1)} كجم 
                    {Math.abs(estimatedWeightChange) > 0.5 ? ' ⚠️ تغير ملحوظ، راجع سعراتك' : ' ✅ مستقر!'}
                  </span>
                </li>
              </>
            )}
            {goalAchievementRate < 60 && totalDays > 0 && (
              <li className="flex items-start gap-2 text-amber-400/50">
                <span>⚠️</span>
                <span>نسبة تحقيق الهدف {Math.round(goalAchievementRate)}%، حاول تلتزم بالهدف اليومي أكثر</span>
              </li>
            )}
            {goalAchievementRate >= 80 && totalDays > 0 && (
              <li className="flex items-start gap-2 text-emerald-400/50">
                <span>🌟</span>
                <span>رائع! أنت تلتزم بهدفك بنسبة {Math.round(goalAchievementRate)}%، استمر!</span>
              </li>
            )}
          </ul>
        </motion.div>
      </div>
    );
  };

  // ============================================
  // عرض الإحصائيات اليومية
  // ============================================
  const renderDailyView = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayStats = statsData.dailyStats.find(s => s.date === today);
    const last7Days = statsData.dailyStats.slice(-7);

    if (statsData.dailyStats.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-20">📊</div>
          <p className="text-white/20 text-sm">لا توجد بيانات</p>
          <p className="text-white/10 text-xs mt-1">سجل وجباتك لتظهر الإحصائيات</p>
        </div>
      );
    }

    // حساب تقديرات اليوم
    let todayEstimate = null;
    if (profile && todayStats) {
      const surplus = todayStats.totalCalories - profile.targetCalories;
      const dailyWeightChange = surplus / 7700;
      const proteinRatio = todayStats.totalProtein / (profile.targetProtein || 1);
      todayEstimate = {
        surplus,
        dailyWeightChange,
        proteinRatio,
        metGoal: todayStats.metGoal,
      };
    }

    return (
      <div className="space-y-4">
        {/* Today's Stats */}
        <div className="glass-card rounded-2xl p-4">
          <h3 className="text-xs text-white/40 font-medium text-right mb-3">📅 اليوم</h3>
          {todayStats ? (
            <>
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center">
                  <div className="text-lg font-black text-orange-400">{Math.round(todayStats.totalCalories)}</div>
                  <div className="text-[8px] text-white/20">سعرة</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-blue-400">{Math.round(todayStats.totalProtein)}g</div>
                  <div className="text-[8px] text-white/20">بروتين</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-amber-400">{Math.round(todayStats.totalCarbs)}g</div>
                  <div className="text-[8px] text-white/20">كارب</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-pink-400">{Math.round(todayStats.totalFat)}g</div>
                  <div className="text-[8px] text-white/20">دهون</div>
                </div>
              </div>

              {/* تقديرات اليوم */}
              {profile && todayEstimate && (
                <div className="mt-3 pt-3 border-t border-white/[0.05]">
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-white/30">تقديرات اليوم:</span>
                    <div className="flex gap-4">
                      <span className={todayEstimate.surplus > 0 ? 'text-emerald-400/60' : 'text-orange-400/60'}>
                        {todayEstimate.surplus > 0 ? '+' : ''}{Math.round(todayEstimate.surplus)} سعرة
                        <span className="text-white/20 text-[7px] mr-1">(فائض)</span>
                      </span>
                      <span className={todayEstimate.metGoal ? 'text-emerald-400/60' : 'text-orange-400/60'}>
                        {todayEstimate.metGoal ? '✅ حققت الهدف' : '❌ لم تحقق الهدف'}
                      </span>
                      <span className="text-white/20">
                        ⚖️ {todayEstimate.dailyWeightChange > 0 ? '+' : ''}{todayEstimate.dailyWeightChange.toFixed(3)} كجم
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-white/15 text-xs">لم تسجل أي وجبات اليوم</p>
          )}
        </div>

        {/* Last 7 Days */}
        <div className="glass-card rounded-2xl p-4">
          <h3 className="text-xs text-white/40 font-medium text-right mb-3">📈 آخر 7 أيام</h3>
          <div className="flex items-end gap-1 h-20">
            {last7Days.map((stat, i) => {
              const height = Math.min((stat.totalCalories / (profile?.targetCalories || 2000)) * 100, 100);
              const isMet = stat.metGoal;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                  <div 
                    className={`w-full rounded-sm transition-all duration-500 ${
                      isMet ? 'bg-emerald-500/60' : 'bg-orange-500/40'
                    }`}
                    style={{ height: `${Math.max(height * 0.6, 2)}%` }}
                  />
                  <span className="text-[5px] text-white/10">{new Date(stat.date).getDate()}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Streak Info */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-4 text-center border border-emerald-500/20"
          >
            <div className="flex items-center justify-center gap-1">
              <span className="text-2xl">🔥</span>
              <span className="text-2xl font-black text-emerald-400">{statsData.currentStreak}</span>
            </div>
            <div className="text-[10px] text-white/30">أيام متتالية</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="glass-card rounded-2xl p-4 text-center border border-amber-500/20"
          >
            <div className="flex items-center justify-center gap-1">
              <span className="text-2xl">🏆</span>
              <span className="text-2xl font-black text-amber-400">{statsData.bestStreak}</span>
            </div>
            <div className="text-[10px] text-white/30">أفضل سلسلة</div>
          </motion.div>
        </div>
      </div>
    );
  };

  // ============================================
  // عرض الإحصائيات الشهرية
  // ============================================
  const renderMonthlyView = () => {
    const monthData = statsData.monthlyStats.find(m => m.month === selectedMonth);
    if (!monthData) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-20">📊</div>
          <p className="text-white/20 text-sm">لا توجد بيانات لهذا الشهر</p>
          <p className="text-white/10 text-xs mt-1">سجل وجباتك لتظهر الإحصائيات</p>
        </div>
      );
    }

    const monthName = new Date(monthData.month + '-01').toLocaleDateString('ar', { month: 'long', year: 'numeric' });
    const daysInMonth = new Date(
      parseInt(monthData.month.split('-')[0]),
      parseInt(monthData.month.split('-')[1]),
      0
    ).getDate();

    const completionRate = Math.round((monthData.daysLogged / daysInMonth) * 100);
    const goalRate = Math.round((monthData.daysMetGoal / monthData.daysLogged) * 100);

    // تقديرات الشهر
    let monthlyEstimate = null;
    if (profile && monthData.daysLogged > 0) {
      const avgSurplus = monthData.avgDailyCalories - profile.targetCalories;
      const totalSurplus = avgSurplus * monthData.daysLogged;
      const weightChange = totalSurplus / 7700;
      monthlyEstimate = {
        avgSurplus,
        weightChange,
        daysLogged: monthData.daysLogged,
      };
    }

    return (
      <div className="space-y-4">
        {/* Month Header */}
        <div className="flex items-center justify-between glass-card rounded-2xl p-4">
          <button
            onClick={() => {
              const [year, month] = selectedMonth.split('-').map(Number);
              const newMonth = month === 1 ? 12 : month - 1;
              const newYear = month === 1 ? year - 1 : year;
              setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
            }}
            className="text-white/30 hover:text-white/60 p-2 rounded-xl transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-white font-bold text-sm">{monthName}</span>
          <button
            onClick={() => {
              const [year, month] = selectedMonth.split('-').map(Number);
              const newMonth = month === 12 ? 1 : month + 1;
              const newYear = month === 12 ? year + 1 : year;
              setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
            }}
            className="text-white/30 hover:text-white/60 p-2 rounded-xl transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-4 text-center"
          >
            <div className="text-3xl font-black text-blue-400">{monthData.daysLogged}</div>
            <div className="text-[10px] text-white/30">أيام مسجلة</div>
            <div className="mt-1 text-[8px] text-white/15">{completionRate}% من الشهر</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="glass-card rounded-2xl p-4 text-center"
          >
            <div className="text-3xl font-black text-emerald-400">{monthData.daysMetGoal}</div>
            <div className="text-[10px] text-white/30">أيام حققت الهدف</div>
            <div className="mt-1 text-[8px] text-white/15">{goalRate}% من الأيام</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-4 text-center"
          >
            <div className="text-2xl font-black text-orange-400">{Math.round(monthData.totalCalories).toLocaleString()}</div>
            <div className="text-[10px] text-white/30">إجمالي سعرات</div>
            <div className="mt-1 text-[8px] text-white/15">معدل {Math.round(monthData.avgDailyCalories)}/يوم</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-2xl p-4 text-center"
          >
            <div className="text-2xl font-black text-purple-400">{monthData.mealCount + monthData.extraCount}</div>
            <div className="text-[10px] text-white/30">إجمالي وجبات</div>
            <div className="mt-1 text-[8px] text-white/15">🍽️ {monthData.mealCount} | 🍿 {monthData.extraCount}</div>
          </motion.div>
        </div>

        {/* Monthly Weight Estimate */}
        {profile && monthlyEstimate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-4 border border-primary-500/20 bg-gradient-to-r from-primary-500/5 to-emerald-500/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Weight size={14} className="text-primary-400" />
                <span className="text-[10px] text-white/40">تقديرات الشهر</span>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className={monthlyEstimate.avgSurplus > 0 ? 'text-emerald-400/60' : 'text-orange-400/60'}>
                  {monthlyEstimate.avgSurplus > 0 ? '+' : ''}{Math.round(monthlyEstimate.avgSurplus)} سعرة/يوم
                </span>
                <span className="text-white/30">
                  ⚖️ {monthlyEstimate.weightChange > 0 ? '+' : ''}{monthlyEstimate.weightChange.toFixed(2)} كجم
                </span>
              </div>
            </div>
            <div className="mt-2 text-[8px] text-white/15">
              بناءً على {monthlyEstimate.daysLogged} يوم مسجل
            </div>
          </motion.div>
        )}

        {/* Macro Averages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card rounded-2xl p-4"
        >
          <h3 className="text-xs text-white/40 font-medium text-right mb-3">📊 متوسطات اليوم الواحد</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-400">
                <Dumbbell size={14} />
                <span className="text-sm font-bold">{Math.round(monthData.avgDailyProtein)}</span>
                <span className="text-[8px] text-white/20">g</span>
              </div>
              <div className="text-[8px] text-white/20">بروتين</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400">
                <Wheat size={14} />
                <span className="text-sm font-bold">{Math.round(monthData.avgDailyCarbs)}</span>
                <span className="text-[8px] text-white/20">g</span>
              </div>
              <div className="text-[8px] text-white/20">كارب</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-pink-400">
                <Droplet size={14} />
                <span className="text-sm font-bold">{Math.round(monthData.avgDailyFat)}</span>
                <span className="text-[8px] text-white/20">g</span>
              </div>
              <div className="text-[8px] text-white/20">دهون</div>
            </div>
          </div>
        </motion.div>

        {/* Daily Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-4"
        >
          <h3 className="text-xs text-white/40 font-medium text-right mb-3">📈 تقدم السعرات اليومية</h3>
          <div className="flex items-end gap-1 h-24">
            {statsData.dailyStats
              .filter(s => s.date.startsWith(selectedMonth))
              .map((stat, i) => {
                const height = Math.min((stat.totalCalories / (profile?.targetCalories || 2000)) * 100, 100);
                const isMet = stat.metGoal;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <div 
                      className={`w-full rounded-sm transition-all duration-500 ${
                        isMet ? 'bg-emerald-500/60' : 'bg-orange-500/40'
                      }`}
                      style={{ height: `${Math.max(height * 0.7, 2)}%` }}
                    />
                    <span className="text-[5px] text-white/10">{new Date(stat.date).getDate()}</span>
                  </div>
                );
              })}
          </div>
        </motion.div>
      </div>
    );
  };

  // ============================================
  // عرض الإحصائيات السنوية
  // ============================================
  const renderYearlyView = () => {
    const yearData = statsData.yearlyStats.find(y => y.year === selectedYear);
    if (!yearData) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-20">📊</div>
          <p className="text-white/20 text-sm">لا توجد بيانات لهذه السنة</p>
          <p className="text-white/10 text-xs mt-1">سجل وجباتك لتظهر الإحصائيات</p>
        </div>
      );
    }

    const monthsCount = 12;
    const completionRate = Math.round((yearData.monthsLogged / monthsCount) * 100);

    // تقديرات السنة
    let yearlyEstimate = null;
    if (profile && yearData.monthsLogged > 0) {
      const avgMonthlyCalories = yearData.totalCalories / yearData.monthsLogged;
      const avgDailyCalories = avgMonthlyCalories / 30;
      const avgSurplus = avgDailyCalories - profile.targetCalories;
      const totalSurplus = avgSurplus * yearData.totalDaysLogged;
      const weightChange = totalSurplus / 7700;
      yearlyEstimate = {
        avgSurplus,
        weightChange,
        monthsLogged: yearData.monthsLogged,
        totalDays: yearData.totalDaysLogged,
      };
    }

    return (
      <div className="space-y-4">
        {/* Year Header */}
        <div className="flex items-center justify-between glass-card rounded-2xl p-4">
          <button
            onClick={() => setSelectedYear(String(parseInt(selectedYear) - 1))}
            className="text-white/30 hover:text-white/60 p-2 rounded-xl transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-white font-bold text-sm">{selectedYear}</span>
          <button
            onClick={() => setSelectedYear(String(parseInt(selectedYear) + 1))}
            className="text-white/30 hover:text-white/60 p-2 rounded-xl transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-4 text-center"
          >
            <div className="text-3xl font-black text-blue-400">{yearData.monthsLogged}</div>
            <div className="text-[10px] text-white/30">أشهر مسجلة</div>
            <div className="mt-1 text-[8px] text-white/15">{completionRate}% من السنة</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="glass-card rounded-2xl p-4 text-center"
          >
            <div className="text-2xl font-black text-orange-400">{Math.round(yearData.totalCalories / 1000).toFixed(1)}k</div>
            <div className="text-[10px] text-white/30">إجمالي سعرات</div>
            <div className="mt-1 text-[8px] text-white/15">{Math.round(yearData.avgMonthlyCalories).toLocaleString()}/شهر</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-4 text-center"
          >
            <div className="text-2xl font-black text-purple-400">{yearData.totalDaysLogged}</div>
            <div className="text-[10px] text-white/30">إجمالي أيام</div>
            <div className="mt-1 text-[8px] text-white/15">{Math.round(yearData.totalDaysLogged / 30)} شهر</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-2xl p-4 text-center"
          >
            <div className="text-2xl font-black text-emerald-400">{yearData.totalMeals + yearData.totalExtras}</div>
            <div className="text-[10px] text-white/30">إجمالي وجبات</div>
            <div className="mt-1 text-[8px] text-white/15">🍽️ {yearData.totalMeals} | 🍿 {yearData.totalExtras}</div>
          </motion.div>
        </div>

        {/* Yearly Weight Estimate */}
        {profile && yearlyEstimate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-4 border border-primary-500/20 bg-gradient-to-r from-primary-500/5 to-emerald-500/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target size={14} className="text-primary-400" />
                <span className="text-[10px] text-white/40">تقديرات السنة</span>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className={yearlyEstimate.avgSurplus > 0 ? 'text-emerald-400/60' : 'text-orange-400/60'}>
                  {yearlyEstimate.avgSurplus > 0 ? '+' : ''}{Math.round(yearlyEstimate.avgSurplus)} سعرة/يوم
                </span>
                <span className="text-white/30">
                  ⚖️ {yearlyEstimate.weightChange > 0 ? '+' : ''}{yearlyEstimate.weightChange.toFixed(2)} كجم
                </span>
              </div>
            </div>
            <div className="mt-2 text-[8px] text-white/15">
              بناءً على {yearlyEstimate.totalDays} يوم مسجل في {yearlyEstimate.monthsLogged} شهر
            </div>
          </motion.div>
        )}

        {/* Yearly Totals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card rounded-2xl p-4"
        >
          <h3 className="text-xs text-white/40 font-medium text-right mb-3">📊 إجمالي السنة</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-sm font-bold text-blue-400">{Math.round(yearData.totalProtein / 1000).toFixed(1)}k</div>
              <div className="text-[8px] text-white/20">💪 بروتين (g)</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-amber-400">{Math.round(yearData.totalCarbs / 1000).toFixed(1)}k</div>
              <div className="text-[8px] text-white/20">🌾 كارب (g)</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-pink-400">{Math.round(yearData.totalFat / 1000).toFixed(1)}k</div>
              <div className="text-[8px] text-white/20">🧈 دهون (g)</div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // ============================================
  // Main Render
  // ============================================
  return (
    <div className="space-y-4">
      {/* View Selector */}
      <div className="flex gap-1 bg-white/[0.03] rounded-2xl p-1">
        {[
          { id: 'daily', label: '📅 يومي', icon: <Calendar size={14} /> },
          { id: 'monthly', label: '📊 شهري', icon: <BarChart3 size={14} /> },
          { id: 'yearly', label: '📈 سنوي', icon: <PieChart size={14} /> },
        ].map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView(item.id as 'daily' | 'monthly' | 'yearly')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              view === item.id
                ? 'bg-gradient-to-r from-primary-500/30 to-emerald-500/30 text-white'
                : 'text-white/30 hover:text-white/50'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {view === 'daily' && renderDailyView()}
          {view === 'monthly' && renderMonthlyView()}
          {view === 'yearly' && renderYearlyView()}
        </motion.div>
      </AnimatePresence>

      {/* ===== قسم تقديرات الوزن ===== */}
      {renderWeightEstimates()}

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-4 border border-white/[0.03]"
      >
        <div className="flex items-center justify-between text-[9px] text-white/20">
          <span>📊 إجمالي أيام التسجيل: {statsData.totalDaysLogged}</span>
          <span>📅 آخر تحديث: {statsData.dailyStats.length > 0 ? statsData.dailyStats[statsData.dailyStats.length - 1].date : 'لا يوجد'}</span>
        </div>
      </motion.div>
    </div>
  );
}