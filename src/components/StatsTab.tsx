import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, ChevronLeft, ChevronRight, BarChart3, PieChart,
  Dumbbell, Wheat, Droplet, Flame, Target, TrendingUp, 
  TrendingDown, Activity, Weight, CheckCircle, XCircle
} from 'lucide-react';
import type { 
  DailyStats, MonthlyStats, YearlyStats, 
  NutritionValues, UserProfile, DailyEatenFood 
} from '../types';

interface StatsTabProps {
  profile: UserProfile | null;
  eatenFoods: DailyEatenFood[];
}

export default function StatsTab({ profile, eatenFoods }: StatsTabProps) {
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

    return {
      dailyStats,
      monthlyStats,
      yearlyStats,
      currentStreak,
      bestStreak,
      totalDaysLogged: dailyStats.length,
    };
  }, [eatenFoods, profile]);

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

    return (
      <div className="space-y-4">
        {/* Today's Stats */}
        <div className="glass-card rounded-2xl p-4">
          <h3 className="text-xs text-white/40 font-medium text-right mb-3">📅 اليوم</h3>
          {todayStats ? (
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
    const goalRate = monthData.daysLogged > 0 ? Math.round((monthData.daysMetGoal / monthData.daysLogged) * 100) : 0;

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

        {/* Macro Averages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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

        {/* Yearly Totals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
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