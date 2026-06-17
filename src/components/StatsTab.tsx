import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, ChevronLeft, ChevronRight, BarChart3, PieChart,
  Dumbbell, Wheat, Droplet, Flame, Target, TrendingUp, 
  TrendingDown, Activity, Weight, CheckCircle, XCircle,
  Rocket, Sparkles, Gem, Award, Crown, Medal, Zap
} from 'lucide-react';
import type { 
  DailyStats, MonthlyStats, YearlyStats, 
  NutritionValues, UserProfile, DailyEatenFood 
} from '../types';

interface StatsTabProps {
  profile: UserProfile | null;
  eatenFoods: DailyEatenFood[];
}

// ===== دوال حساب التقديرات =====
function estimateWeightChange(calorieSurplus: number, days: number): number {
  const totalSurplus = calorieSurplus * days;
  return totalSurplus / 7700;
}

function estimateMuscleGain(calorieSurplus: number, proteinIntake: number, targetProtein: number, days: number): number {
  if (calorieSurplus > 0 && proteinIntake >= targetProtein * 0.8) {
    const totalSurplus = calorieSurplus * days;
    const muscleRatio = Math.min(proteinIntake / targetProtein, 1.5) * 0.25;
    return (totalSurplus / 7700) * muscleRatio;
  }
  if (calorieSurplus < 0 && proteinIntake >= targetProtein * 0.9) {
    return 0;
  }
  return 0;
}

export default function StatsTab({ profile, eatenFoods }: StatsTabProps) {
  const [view, setView] = useState<'daily' | 'monthly' | 'yearly' | 'estimates'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    return String(new Date().getFullYear());
  });

  // ===== حساب الإحصائيات =====
  const statsData = useMemo(() => {
    const dailyMap: Map<string, DailyStats> = new Map();

    eatenFoods.forEach(food => {
      const date = new Date(food.eatenAt).toISOString().split('T')[0];
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
      stat.totalCalories += food.nutrition.calories;
      stat.totalProtein += food.nutrition.protein;
      stat.totalCarbs += food.nutrition.carbs;
      stat.totalFat += food.nutrition.fat;
      stat.totalFiber += food.nutrition.fiber;
      stat.totalSugar += food.nutrition.sugar;
      stat.totalSodium += food.nutrition.sodium;
      if (food.mealType === 'وجبة رئيسية') stat.mealCount += 1;
      else stat.extraCount += 1;
    });

    const dailyStats: DailyStats[] = Array.from(dailyMap.values()).map(stat => {
      if (profile) {
        const calPercent = (stat.totalCalories / profile.targetCalories) * 100;
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
      if (stat.daysLogged > 0) {
        stat.avgDailyCalories = Math.round(stat.totalCalories / stat.daysLogged);
        stat.avgDailyProtein = Math.round(stat.totalProtein / stat.daysLogged);
        stat.avgDailyCarbs = Math.round(stat.totalCarbs / stat.daysLogged);
        stat.avgDailyFat = Math.round(stat.totalFat / stat.daysLogged);
      }
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
      if (stat.monthsLogged > 0) {
        stat.avgMonthlyCalories = Math.round(stat.totalCalories / stat.monthsLogged);
      }
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

    // ===== حساب التقديرات =====
    let estimates = null;
    if (profile && dailyStats.length > 0) {
      const targetCalories = profile.targetCalories;
      const targetProtein = profile.targetProtein;
      const currentWeight = profile.weight;

      // ===== التقدير اليومي =====
      const todayStats = dailyStats.find(s => s.date === today);
      let dailyEstimate = null;
      if (todayStats) {
        const surplus = todayStats.totalCalories - targetCalories;
        const dailyWeightChange = surplus / 7700;
        const muscleGain = estimateMuscleGain(surplus, todayStats.totalProtein, targetProtein, 1);
        dailyEstimate = {
          calories: todayStats.totalCalories,
          protein: todayStats.totalProtein,
          surplus,
          weightChange: dailyWeightChange,
          muscleGain,
          fatChange: dailyWeightChange - muscleGain,
          metGoal: todayStats.metGoal,
        };
      }

      // ===== التقدير الشهري =====
      const currentMonth = today.substring(0, 7);
      const monthData = monthlyStats.find(m => m.month === currentMonth);
      let monthlyEstimate = null;
      if (monthData && monthData.daysLogged > 0) {
        const avgSurplus = monthData.avgDailyCalories - targetCalories;
        const totalSurplus = avgSurplus * monthData.daysLogged;
        const weightChange = totalSurplus / 7700;
        const muscleGain = estimateMuscleGain(avgSurplus, monthData.avgDailyProtein, targetProtein, monthData.daysLogged);
        monthlyEstimate = {
          avgCalories: monthData.avgDailyCalories,
          avgProtein: monthData.avgDailyProtein,
          avgSurplus,
          weightChange,
          muscleGain,
          fatChange: weightChange - muscleGain,
          daysLogged: monthData.daysLogged,
          daysMetGoal: monthData.daysMetGoal,
          projectedWeight: currentWeight + weightChange,
          goalAchievementRate: monthData.daysLogged > 0 ? Math.round((monthData.daysMetGoal / monthData.daysLogged) * 100) : 0,
        };
      }

      // ===== التقدير السنوي =====
      const currentYear = today.substring(0, 4);
      const yearData = yearlyStats.find(y => y.year === currentYear);
      let yearlyEstimate = null;
      if (yearData && yearData.monthsLogged > 0) {
        const avgMonthlyCalories = yearData.totalCalories / yearData.monthsLogged;
        const avgDailyCalories = avgMonthlyCalories / 30;
        const avgSurplus = avgDailyCalories - targetCalories;
        const totalSurplus = avgSurplus * yearData.totalDaysLogged;
        const weightChange = totalSurplus / 7700;
        const avgProtein = yearData.totalProtein / yearData.totalDaysLogged;
        const muscleGain = estimateMuscleGain(avgSurplus, avgProtein, targetProtein, yearData.totalDaysLogged);
        yearlyEstimate = {
          avgDailyCalories,
          avgProtein,
          avgSurplus,
          weightChange,
          muscleGain,
          fatChange: weightChange - muscleGain,
          monthsLogged: yearData.monthsLogged,
          totalDaysLogged: yearData.totalDaysLogged,
          projectedWeight: currentWeight + weightChange,
          goalAchievementRate: yearData.monthsLogged > 0 ? Math.round((yearData.monthsLogged / 12) * 100) : 0,
        };
      }

      estimates = {
        daily: dailyEstimate,
        monthly: monthlyEstimate,
        yearly: yearlyEstimate,
        currentWeight,
        targetCalories,
        targetProtein,
        goal: profile.goal,
        goalLabel: profile.goal === 'bulk' ? 'تضخيم' : profile.goal === 'cut' ? 'تنشيف' : 'تثبيت',
        goalEmoji: profile.goal === 'bulk' ? '💪' : profile.goal === 'cut' ? '🔥' : '⚖️',
      };
    }

    return {
      dailyStats,
      monthlyStats,
      yearlyStats,
      currentStreak,
      bestStreak,
      totalDaysLogged: dailyStats.length,
      estimates,
    };
  }, [eatenFoods, profile]);

  // ===== دالة عرض اليومي =====
  const renderDailyView = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayStats = statsData.dailyStats.find(s => s.date === today);
    const last7Days = statsData.dailyStats.slice(-7);
    const est = statsData.estimates;

    if (statsData.dailyStats.length === 0) {
      return (
        <div className="text-center py-16">
          <motion.div animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-7xl mb-4 opacity-20">📊</motion.div>
          <p className="text-white/25 text-lg font-bold">لا توجد بيانات</p>
          <p className="text-white/15 text-sm mt-1">سجل وجباتك لتظهر الإحصائيات</p>
        </div>
      );
    }

    return (
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-5 border border-white/5">
          <h3 className="text-xs text-white/40 font-bold text-right mb-4">📅 اليوم</h3>
          {todayStats ? (
            <div className="grid grid-cols-4 gap-3">
              <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.05, type: 'spring', bounce: 0.5 }} className="text-center bg-orange-500/10 rounded-xl p-3 border border-orange-500/20">
                <div className="text-2xl font-black text-orange-400">{Math.round(todayStats.totalCalories)}</div>
                <div className="text-[10px] text-white/30 font-bold">سعرة</div>
              </motion.div>
              <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: 'spring', bounce: 0.5 }} className="text-center bg-blue-500/10 rounded-xl p-3 border border-blue-500/20">
                <div className="text-2xl font-black text-blue-400">{Math.round(todayStats.totalProtein)}g</div>
                <div className="text-[10px] text-white/30 font-bold">بروتين</div>
              </motion.div>
              <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15, type: 'spring', bounce: 0.5 }} className="text-center bg-amber-500/10 rounded-xl p-3 border border-amber-500/20">
                <div className="text-2xl font-black text-amber-400">{Math.round(todayStats.totalCarbs)}g</div>
                <div className="text-[10px] text-white/30 font-bold">كارب</div>
              </motion.div>
              <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }} className="text-center bg-pink-500/10 rounded-xl p-3 border border-pink-500/20">
                <div className="text-2xl font-black text-pink-400">{Math.round(todayStats.totalFat)}g</div>
                <div className="text-[10px] text-white/30 font-bold">دهون</div>
              </motion.div>
            </div>
          ) : (
            <p className="text-center text-white/15 text-sm font-medium">لم تسجل أي وجبات اليوم</p>
          )}
        </div>

        {/* ===== تقدير اليوم ===== */}
        {est?.daily && profile && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, type: 'spring', bounce: 0.4 }} className="glass-card rounded-2xl p-5 border border-primary-500/15 bg-gradient-to-r from-primary-500/5 to-emerald-500/5">
            <div className="flex items-center gap-2 mb-3">
              <Rocket size={16} className="text-primary-400" />
              <span className="text-xs text-white/40 font-bold">⚡ تقدير اليوم</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.35 }} className="text-center">
                <div className={`text-sm font-black ${est.daily.surplus > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>{est.daily.surplus > 0 ? '+' : ''}{Math.round(est.daily.surplus)}</div>
                <div className="text-[8px] text-white/20 font-bold">فائض/عجز</div>
              </motion.div>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }} className="text-center">
                <div className={`text-sm font-black ${est.daily.weightChange > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>{est.daily.weightChange > 0 ? '+' : ''}{est.daily.weightChange.toFixed(3)}</div>
                <div className="text-[8px] text-white/20 font-bold">تغير الوزن</div>
              </motion.div>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.45 }} className="text-center">
                <div className="text-sm font-black text-blue-400">{Math.round(est.daily.protein)}g</div>
                <div className="text-[8px] text-white/20 font-bold">بروتين</div>
              </motion.div>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }} className="text-center">
                <div className={`text-sm font-black ${est.daily.metGoal ? 'text-emerald-400' : 'text-orange-400'}`}>{est.daily.metGoal ? '✅' : '❌'}</div>
                <div className="text-[8px] text-white/20 font-bold">حققت الهدف؟</div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ===== آخر 7 أيام ===== */}
        <div className="glass-card rounded-2xl p-5 border border-white/5">
          <h3 className="text-xs text-white/40 font-bold text-right mb-4">📈 آخر 7 أيام</h3>
          <div className="flex items-end gap-1.5 h-24">
            {last7Days.map((stat, i) => {
              const height = Math.min((stat.totalCalories / (profile?.targetCalories || 2000)) * 100, 100);
              return (
                <motion.div key={i} initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: i * 0.08, duration: 0.6, type: 'spring', bounce: 0.3 }} className="flex-1 flex flex-col items-center gap-0.5">
                  <motion.div className={`w-full rounded-sm transition-all duration-500 ${stat.metGoal ? 'bg-gradient-to-t from-emerald-500 to-green-400' : 'bg-gradient-to-t from-orange-500 to-red-400'}`} style={{ height: `${Math.max(height * 0.7, 3)}%` }} />
                  <span className="text-[5px] text-white/15 font-bold">{new Date(stat.date).getDate()}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ===== Streak ===== */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4, type: 'spring', bounce: 0.5 }} className="glass-card rounded-2xl p-4 text-center border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-green-500/5">
            <div className="flex items-center justify-center gap-2"><span className="text-3xl">🔥</span><motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.6 }} className="text-3xl font-black text-emerald-400">{statsData.currentStreak}</motion.span></div>
            <div className="text-[10px] text-white/30 font-bold">أيام متتالية</div>
          </motion.div>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.45, type: 'spring', bounce: 0.5 }} className="glass-card rounded-2xl p-4 text-center border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-yellow-500/5">
            <div className="flex items-center justify-center gap-2"><span className="text-3xl">🏆</span><motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.6 }} className="text-3xl font-black text-amber-400">{statsData.bestStreak}</motion.span></div>
            <div className="text-[10px] text-white/30 font-bold">أفضل سلسلة</div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  // ===== دالة عرض الشهري =====
  const renderMonthlyView = () => {
    const monthData = statsData.monthlyStats.find(m => m.month === selectedMonth);
    const est = statsData.estimates;

    if (!monthData) {
      return (
        <div className="text-center py-16">
          <div className="text-7xl mb-4 opacity-20">📊</div>
          <p className="text-white/25 text-lg font-bold">لا توجد بيانات لهذا الشهر</p>
          <p className="text-white/15 text-sm mt-1">سجل وجباتك لتظهر الإحصائيات</p>
        </div>
      );
    }

    const monthName = new Date(monthData.month + '-01').toLocaleDateString('ar', { month: 'long', year: 'numeric' });
    const daysInMonth = new Date(parseInt(monthData.month.split('-')[0]), parseInt(monthData.month.split('-')[1]), 0).getDate();
    const completionRate = Math.round((monthData.daysLogged / daysInMonth) * 100);
    const goalRate = monthData.daysLogged > 0 ? Math.round((monthData.daysMetGoal / monthData.daysLogged) * 100) : 0;

    return (
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-4">
        <div className="flex items-center justify-between glass-card rounded-2xl p-4 border border-white/5">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { const [year, month] = selectedMonth.split('-').map(Number); const newMonth = month === 1 ? 12 : month - 1; const newYear = month === 1 ? year - 1 : year; setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`); }} className="text-white/30 hover:text-white/60 p-2 rounded-xl transition-all"><ChevronLeft size={20} /></motion.button>
          <span className="text-white font-bold text-base">{monthName}</span>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { const [year, month] = selectedMonth.split('-').map(Number); const newMonth = month === 12 ? 1 : month + 1; const newYear = month === 12 ? year + 1 : year; setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`); }} className="text-white/30 hover:text-white/60 p-2 rounded-xl transition-all"><ChevronRight size={20} /></motion.button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.05, type: 'spring', bounce: 0.4 }} className="glass-card rounded-2xl p-4 text-center border border-white/5">
            <div className="text-3xl font-black text-blue-400">{monthData.daysLogged}</div>
            <div className="text-[10px] text-white/30 font-bold">أيام مسجلة</div>
            <div className="mt-1 text-[8px] text-white/15">{completionRate}% من الشهر</div>
          </motion.div>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: 'spring', bounce: 0.4 }} className="glass-card rounded-2xl p-4 text-center border border-white/5">
            <div className="text-3xl font-black text-emerald-400">{monthData.daysMetGoal}</div>
            <div className="text-[10px] text-white/30 font-bold">أيام حققت الهدف</div>
            <div className="mt-1 text-[8px] text-white/15">{goalRate}% من الأيام</div>
          </motion.div>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15, type: 'spring', bounce: 0.4 }} className="glass-card rounded-2xl p-4 text-center border border-white/5">
            <div className="text-2xl font-black text-orange-400">{Math.round(monthData.totalCalories).toLocaleString()}</div>
            <div className="text-[10px] text-white/30 font-bold">إجمالي سعرات</div>
            <div className="mt-1 text-[8px] text-white/15">معدل {Math.round(monthData.avgDailyCalories)}/يوم</div>
          </motion.div>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }} className="glass-card rounded-2xl p-4 text-center border border-white/5">
            <div className="text-2xl font-black text-purple-400">{monthData.mealCount + monthData.extraCount}</div>
            <div className="text-[10px] text-white/30 font-bold">إجمالي وجبات</div>
            <div className="mt-1 text-[8px] text-white/15">🍽️ {monthData.mealCount} | 🍿 {monthData.extraCount}</div>
          </motion.div>
        </div>

        {/* ===== تقدير الشهر ===== */}
        {est?.monthly && profile && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, type: 'spring', bounce: 0.4 }} className="glass-card rounded-2xl p-5 border border-primary-500/15 bg-gradient-to-r from-primary-500/5 to-emerald-500/5">
            <div className="flex items-center gap-2 mb-3">
              <Target size={16} className="text-primary-400" />
              <span className="text-xs text-white/40 font-bold">🎯 تقدير الشهر</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.35 }} className="text-center">
                <div className={`text-sm font-black ${est.monthly.avgSurplus > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>{est.monthly.avgSurplus > 0 ? '+' : ''}{Math.round(est.monthly.avgSurplus)}</div>
                <div className="text-[8px] text-white/20 font-bold">متوسط الفائض</div>
              </motion.div>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }} className="text-center">
                <div className={`text-sm font-black ${est.monthly.weightChange > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>{est.monthly.weightChange > 0 ? '+' : ''}{est.monthly.weightChange.toFixed(2)}</div>
                <div className="text-[8px] text-white/20 font-bold">تغير الوزن</div>
              </motion.div>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.45 }} className="text-center">
                <div className="text-sm font-black text-primary-400">{est.monthly.projectedWeight.toFixed(1)} كجم</div>
                <div className="text-[8px] text-white/20 font-bold">الوزن المتوقع</div>
              </motion.div>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }} className="text-center">
                <div className="text-sm font-black text-emerald-400">{est.monthly.goalAchievementRate}%</div>
                <div className="text-[8px] text-white/20 font-bold">نسبة الالتزام</div>
              </motion.div>
            </div>
          </motion.div>
        )}

        <div className="glass-card rounded-2xl p-5 border border-white/5">
          <h3 className="text-xs text-white/40 font-bold text-right mb-4">📊 متوسطات اليوم الواحد</h3>
          <div className="grid grid-cols-3 gap-3">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="text-center bg-blue-500/5 rounded-xl p-3 border border-blue-500/10">
              <div className="flex items-center justify-center gap-1 text-blue-400"><Dumbbell size={14} /><span className="text-lg font-black">{Math.round(monthData.avgDailyProtein)}</span><span className="text-[10px] text-white/30">g</span></div>
              <div className="text-[8px] text-white/30 font-bold">بروتين</div>
            </motion.div>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.25 }} className="text-center bg-amber-500/5 rounded-xl p-3 border border-amber-500/10">
              <div className="flex items-center justify-center gap-1 text-amber-400"><Wheat size={14} /><span className="text-lg font-black">{Math.round(monthData.avgDailyCarbs)}</span><span className="text-[10px] text-white/30">g</span></div>
              <div className="text-[8px] text-white/30 font-bold">كارب</div>
            </motion.div>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="text-center bg-pink-500/5 rounded-xl p-3 border border-pink-500/10">
              <div className="flex items-center justify-center gap-1 text-pink-400"><Droplet size={14} /><span className="text-lg font-black">{Math.round(monthData.avgDailyFat)}</span><span className="text-[10px] text-white/30">g</span></div>
              <div className="text-[8px] text-white/30 font-bold">دهون</div>
            </motion.div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/5">
          <h3 className="text-xs text-white/40 font-bold text-right mb-4">📈 تقدم السعرات اليومية</h3>
          <div className="flex items-end gap-1 h-24">
            {statsData.dailyStats.filter(s => s.date.startsWith(selectedMonth)).map((stat, i) => {
              const height = Math.min((stat.totalCalories / (profile?.targetCalories || 2000)) * 100, 100);
              return (
                <motion.div key={i} initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: i * 0.05, duration: 0.5, type: 'spring', bounce: 0.3 }} className="flex-1 flex flex-col items-center gap-0.5">
                  <motion.div className={`w-full rounded-sm transition-all duration-500 ${stat.metGoal ? 'bg-gradient-to-t from-emerald-500 to-green-400' : 'bg-gradient-to-t from-orange-500 to-red-400'}`} style={{ height: `${Math.max(height * 0.7, 3)}%` }} />
                  <span className="text-[5px] text-white/15 font-bold">{new Date(stat.date).getDate()}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  };

  // ===== دالة عرض السنوي =====
  const renderYearlyView = () => {
    const yearData = statsData.yearlyStats.find(y => y.year === selectedYear);
    const est = statsData.estimates;

    if (!yearData) {
      return (
        <div className="text-center py-16">
          <div className="text-7xl mb-4 opacity-20">📊</div>
          <p className="text-white/25 text-lg font-bold">لا توجد بيانات لهذه السنة</p>
          <p className="text-white/15 text-sm mt-1">سجل وجباتك لتظهر الإحصائيات</p>
        </div>
      );
    }

    const completionRate = Math.round((yearData.monthsLogged / 12) * 100);

    return (
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-4">
        <div className="flex items-center justify-between glass-card rounded-2xl p-4 border border-white/5">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setSelectedYear(String(parseInt(selectedYear) - 1))} className="text-white/30 hover:text-white/60 p-2 rounded-xl transition-all"><ChevronLeft size={20} /></motion.button>
          <span className="text-white font-bold text-base">{selectedYear}</span>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setSelectedYear(String(parseInt(selectedYear) + 1))} className="text-white/30 hover:text-white/60 p-2 rounded-xl transition-all"><ChevronRight size={20} /></motion.button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.05, type: 'spring', bounce: 0.4 }} className="glass-card rounded-2xl p-4 text-center border border-white/5">
            <div className="text-3xl font-black text-blue-400">{yearData.monthsLogged}</div>
            <div className="text-[10px] text-white/30 font-bold">أشهر مسجلة</div>
            <div className="mt-1 text-[8px] text-white/15">{completionRate}% من السنة</div>
          </motion.div>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: 'spring', bounce: 0.4 }} className="glass-card rounded-2xl p-4 text-center border border-white/5">
            <div className="text-2xl font-black text-orange-400">{Math.round(yearData.totalCalories / 1000).toFixed(1)}k</div>
            <div className="text-[10px] text-white/30 font-bold">إجمالي سعرات</div>
            <div className="mt-1 text-[8px] text-white/15">{Math.round(yearData.avgMonthlyCalories).toLocaleString()}/شهر</div>
          </motion.div>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15, type: 'spring', bounce: 0.4 }} className="glass-card rounded-2xl p-4 text-center border border-white/5">
            <div className="text-2xl font-black text-purple-400">{yearData.totalDaysLogged}</div>
            <div className="text-[10px] text-white/30 font-bold">إجمالي أيام</div>
            <div className="mt-1 text-[8px] text-white/15">{Math.round(yearData.totalDaysLogged / 30)} شهر</div>
          </motion.div>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }} className="glass-card rounded-2xl p-4 text-center border border-white/5">
            <div className="text-2xl font-black text-emerald-400">{yearData.totalMeals + yearData.totalExtras}</div>
            <div className="text-[10px] text-white/30 font-bold">إجمالي وجبات</div>
            <div className="mt-1 text-[8px] text-white/15">🍽️ {yearData.totalMeals} | 🍿 {yearData.totalExtras}</div>
          </motion.div>
        </div>

        {/* ===== تقدير السنة ===== */}
        {est?.yearly && profile && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, type: 'spring', bounce: 0.4 }} className="glass-card rounded-2xl p-5 border border-amber-500/15 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
            <div className="flex items-center gap-2 mb-3">
              <Crown size={16} className="text-amber-400" />
              <span className="text-xs text-white/40 font-bold">👑 تقدير السنة</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.35 }} className="text-center">
                <div className={`text-sm font-black ${est.yearly.avgSurplus > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>{est.yearly.avgSurplus > 0 ? '+' : ''}{Math.round(est.yearly.avgSurplus)}</div>
                <div className="text-[8px] text-white/20 font-bold">متوسط الفائض</div>
              </motion.div>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }} className="text-center">
                <div className={`text-sm font-black ${est.yearly.weightChange > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>{est.yearly.weightChange > 0 ? '+' : ''}{est.yearly.weightChange.toFixed(2)}</div>
                <div className="text-[8px] text-white/20 font-bold">التغير السنوي</div>
              </motion.div>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.45 }} className="text-center">
                <div className="text-sm font-black text-primary-400">{est.yearly.projectedWeight.toFixed(1)} كجم</div>
                <div className="text-[8px] text-white/20 font-bold">الوزن المتوقع</div>
              </motion.div>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }} className="text-center">
                <div className="text-sm font-black text-emerald-400">{est.yearly.goalAchievementRate}%</div>
                <div className="text-[8px] text-white/20 font-bold">نسبة الإنجاز</div>
              </motion.div>
            </div>
          </motion.div>
        )}

        <div className="glass-card rounded-2xl p-5 border border-white/5">
          <h3 className="text-xs text-white/40 font-bold text-right mb-4">📊 إجمالي السنة</h3>
          <div className="grid grid-cols-3 gap-3">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="text-center bg-blue-500/5 rounded-xl p-3 border border-blue-500/10">
              <div className="text-2xl font-black text-blue-400">{Math.round(yearData.totalProtein / 1000).toFixed(1)}k</div>
              <div className="text-[8px] text-white/30 font-bold">💪 بروتين</div>
            </motion.div>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.25 }} className="text-center bg-amber-500/5 rounded-xl p-3 border border-amber-500/10">
              <div className="text-2xl font-black text-amber-400">{Math.round(yearData.totalCarbs / 1000).toFixed(1)}k</div>
              <div className="text-[8px] text-white/30 font-bold">🌾 كارب</div>
            </motion.div>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="text-center bg-pink-500/5 rounded-xl p-3 border border-pink-500/10">
              <div className="text-2xl font-black text-pink-400">{Math.round(yearData.totalFat / 1000).toFixed(1)}k</div>
              <div className="text-[8px] text-white/30 font-bold">🧈 دهون</div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  };

  // ===== عرض تقديرات الوزن (Tab منفصل) =====
  const renderEstimates = () => {
    const est = statsData.estimates;
    if (!est) {
      return (
        <div className="text-center py-16">
          <div className="text-6xl mb-4 opacity-20">⚖️</div>
          <p className="text-white/25 text-lg font-bold">لا توجد بيانات كافية للتقدير</p>
          <p className="text-white/15 text-sm mt-1">سجل وجباتك لمدة يوم على الأقل مع إعداد الملف الشخصي</p>
        </div>
      );
    }

    const goalEmoji = est.goal === 'bulk' ? '💪' : est.goal === 'cut' ? '🔥' : '⚖️';

    return (
      <div className="space-y-4">
        {/* ===== التقدير اليومي ===== */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', bounce: 0.4 }} className="glass-card rounded-2xl p-5 border border-emerald-500/10 bg-gradient-to-r from-emerald-500/5 to-green-500/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-white/30 bg-white/10 px-3 py-1 rounded-full font-bold">📅 تقدير يومي</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40 font-bold">{goalEmoji} {est.goalLabel}</span>
            </div>
          </div>

          {est.daily ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.05, type: 'spring', bounce: 0.4 }} className="text-center bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-lg font-black text-orange-400">{Math.round(est.daily.calories)}</div>
                <div className="text-[8px] text-white/30 font-bold">سعرة اليوم</div>
                <div className={`text-[8px] mt-0.5 font-bold ${est.daily.metGoal ? 'text-emerald-400' : 'text-orange-400'}`}>{est.daily.metGoal ? '✅ حققت الهدف' : '❌ لم تحقق'}</div>
              </motion.div>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: 'spring', bounce: 0.4 }} className="text-center bg-white/5 rounded-xl p-3 border border-white/5">
                <div className={`text-lg font-black ${est.daily.surplus > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>{est.daily.surplus > 0 ? '+' : ''}{Math.round(est.daily.surplus)}</div>
                <div className="text-[8px] text-white/30 font-bold">الفائض/العجز</div>
              </motion.div>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15, type: 'spring', bounce: 0.4 }} className="text-center bg-white/5 rounded-xl p-3 border border-white/5">
                <div className={`text-lg font-black ${est.daily.weightChange > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>{est.daily.weightChange > 0 ? '+' : ''}{est.daily.weightChange.toFixed(3)}</div>
                <div className="text-[8px] text-white/30 font-bold">تغير الوزن</div>
              </motion.div>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }} className="text-center bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-lg font-black text-blue-400">{Math.round(est.daily.protein)}g</div>
                <div className="text-[8px] text-white/30 font-bold">بروتين اليوم</div>
              </motion.div>
            </div>
          ) : (
            <p className="text-white/15 text-xs text-center py-2 font-bold">لم تسجل أي وجبات اليوم</p>
          )}
        </motion.div>

        {/* ===== التقدير الشهري ===== */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, type: 'spring', bounce: 0.4 }} className="glass-card rounded-2xl p-5 border border-primary-500/10 bg-gradient-to-r from-primary-500/5 to-blue-500/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-white/30 bg-white/10 px-3 py-1 rounded-full font-bold">📊 تقدير شهري</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40 font-bold">📆 {new Date().toLocaleDateString('ar', { month: 'long' })}</span>
            </div>
          </div>

          {est.monthly ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15, type: 'spring', bounce: 0.3 }} className="text-center bg-white/5 rounded-xl p-2 border border-white/5">
                  <div className="text-lg font-black text-blue-400">{est.monthly.daysLogged}</div>
                  <div className="text-[7px] text-white/30 font-bold">أيام مسجلة</div>
                </motion.div>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', bounce: 0.3 }} className="text-center bg-white/5 rounded-xl p-2 border border-white/5">
                  <div className="text-lg font-black text-emerald-400">{est.monthly.daysMetGoal}</div>
                  <div className="text-[7px] text-white/30 font-bold">أيام حققت الهدف</div>
                </motion.div>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.25, type: 'spring', bounce: 0.3 }} className="text-center bg-white/5 rounded-xl p-2 border border-white/5">
                  <div className={`text-lg font-black ${est.monthly.avgSurplus > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>{est.monthly.avgSurplus > 0 ? '+' : ''}{Math.round(est.monthly.avgSurplus)}</div>
                  <div className="text-[7px] text-white/30 font-bold">متوسط الفائض</div>
                </motion.div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, type: 'spring', bounce: 0.3 }} className="text-center bg-emerald-500/10 rounded-xl p-2 border border-emerald-500/20">
                  <div className={`text-lg font-black ${est.monthly.weightChange > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>{est.monthly.weightChange > 0 ? '+' : ''}{est.monthly.weightChange.toFixed(2)} كجم</div>
                  <div className="text-[7px] text-white/30 font-bold">تغير الوزن</div>
                </motion.div>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.35, type: 'spring', bounce: 0.3 }} className="text-center bg-primary-500/10 rounded-xl p-2 border border-primary-500/20">
                  <div className="text-lg font-black text-primary-400">{est.monthly.projectedWeight.toFixed(1)} كجم</div>
                  <div className="text-[7px] text-white/30 font-bold">الوزن المتوقع</div>
                </motion.div>
              </div>
            </div>
          ) : (
            <p className="text-white/15 text-xs text-center py-2 font-bold">لا توجد بيانات كافية لهذا الشهر</p>
          )}
        </motion.div>

        {/* ===== التقدير السنوي ===== */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }} className="glass-card rounded-2xl p-5 border border-amber-500/10 bg-gradient-to-r from-amber-500/5 to-orange-500/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-white/30 bg-white/10 px-3 py-1 rounded-full font-bold">📈 تقدير سنوي</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40 font-bold">📅 {new Date().getFullYear()}</span>
            </div>
          </div>

          {est.yearly ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.25, type: 'spring', bounce: 0.3 }} className="text-center bg-white/5 rounded-xl p-2 border border-white/5">
                  <div className="text-lg font-black text-blue-400">{est.yearly.monthsLogged}</div>
                  <div className="text-[7px] text-white/30 font-bold">أشهر مسجلة</div>
                </motion.div>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, type: 'spring', bounce: 0.3 }} className="text-center bg-white/5 rounded-xl p-2 border border-white/5">
                  <div className="text-lg font-black text-purple-400">{est.yearly.totalDaysLogged}</div>
                  <div className="text-[7px] text-white/30 font-bold">أيام مسجلة</div>
                </motion.div>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.35, type: 'spring', bounce: 0.3 }} className="text-center bg-white/5 rounded-xl p-2 border border-white/5">
                  <div className={`text-lg font-black ${est.yearly.avgSurplus > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>{est.yearly.avgSurplus > 0 ? '+' : ''}{Math.round(est.yearly.avgSurplus)}</div>
                  <div className="text-[7px] text-white/30 font-bold">متوسط الفائض</div>
                </motion.div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4, type: 'spring', bounce: 0.3 }} className="text-center bg-emerald-500/10 rounded-xl p-2 border border-emerald-500/20">
                  <div className={`text-lg font-black ${est.yearly.weightChange > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>{est.yearly.weightChange > 0 ? '+' : ''}{est.yearly.weightChange.toFixed(2)} كجم</div>
                  <div className="text-[7px] text-white/30 font-bold">التغير السنوي</div>
                </motion.div>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.45, type: 'spring', bounce: 0.3 }} className="text-center bg-primary-500/10 rounded-xl p-2 border border-primary-500/20">
                  <div className="text-lg font-black text-primary-400">{est.yearly.projectedWeight.toFixed(1)} كجم</div>
                  <div className="text-[7px] text-white/30 font-bold">الوزن المتوقع</div>
                </motion.div>
              </div>
            </div>
          ) : (
            <p className="text-white/15 text-xs text-center py-2 font-bold">لا توجد بيانات كافية لهذه السنة</p>
          )}
        </motion.div>

        {/* ===== ملخص الحالة ===== */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-4 border border-white/5 bg-gradient-to-r from-primary-500/5 to-emerald-500/5">
          <div className="flex items-center justify-between text-[10px] text-white/40 font-bold">
            <span>⚖️ الوزن الحالي: <span className="text-white/60">{est.currentWeight} كجم</span></span>
            <span>🎯 الهدف: <span className="text-white/60">{est.goalLabel}</span></span>
            <span>📊 أيام مسجلة: <span className="text-white/60">{statsData.totalDaysLogged}</span></span>
          </div>
        </motion.div>
      </div>
    );
  };

  // ===== العرض الرئيسي =====
  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-white/5 rounded-2xl p-1 flex-wrap">
        {[
          { id: 'daily', label: '📅 يومي', icon: <Calendar size={14} /> },
          { id: 'monthly', label: '📊 شهري', icon: <BarChart3 size={14} /> },
          { id: 'yearly', label: '📈 سنوي', icon: <PieChart size={14} /> },
          { id: 'estimates', label: '⚖️ تقديرات', icon: <Target size={14} /> },
        ].map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView(item.id as any)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              view === item.id
                ? 'bg-gradient-to-r from-primary-500/30 to-emerald-500/30 text-white shadow-lg shadow-primary-500/20'
                : 'text-white/30 hover:text-white/60'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={view} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
          {view === 'daily' && renderDailyView()}
          {view === 'monthly' && renderMonthlyView()}
          {view === 'yearly' && renderYearlyView()}
          {view === 'estimates' && renderEstimates()}
        </motion.div>
      </AnimatePresence>

      <div className="glass-card rounded-2xl p-4 border border-white/5">
        <div className="flex items-center justify-between text-[9px] text-white/20 font-bold">
          <span>📊 إجمالي أيام التسجيل: {statsData.totalDaysLogged}</span>
          <span>📅 آخر تحديث: {statsData.dailyStats.length > 0 ? statsData.dailyStats[statsData.dailyStats.length - 1].date : 'لا يوجد'}</span>
        </div>
      </div>
    </div>
  );
}