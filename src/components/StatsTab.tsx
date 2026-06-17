import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, ChevronLeft, ChevronRight, BarChart3, PieChart,
  Dumbbell, Wheat, Droplet, Flame, Target, TrendingUp, 
  TrendingDown, Activity, Weight, CheckCircle, XCircle,
  Send, FileText, Clock, Award, Crown, Medal, Zap, GitBranch
} from 'lucide-react';
import type { 
  DailyStats, MonthlyStats, YearlyStats, 
  NutritionValues, UserProfile, DailyEatenFood 
} from '../types';

interface StatsTabProps {
  profile: UserProfile | null;
  eatenFoods: DailyEatenFood[];
  botToken?: string;
  chatId?: string;
  onSendToTelegram?: (message: string) => void;
}

// ===== دوال حساب التقديرات =====
function calculateCalorieSurplus(caloriesEaten: number, targetCalories: number): number {
  return caloriesEaten - targetCalories;
}

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

export default function StatsTab({ profile, eatenFoods, botToken, chatId, onSendToTelegram }: StatsTabProps) {
  const [view, setView] = useState<'daily' | 'monthly' | 'yearly' | 'estimates'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    return String(new Date().getFullYear());
  });
  const [sendingReport, setSendingReport] = useState(false);

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
      const todayStats = dailyStats.find(s => s.date === today);
      const targetCalories = profile.targetCalories;
      const targetProtein = profile.targetProtein;
      const currentWeight = profile.weight;

      // ===== التقدير اليومي =====
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
        const muscleGain = estimateMuscleGain(
          avgSurplus, 
          monthData.avgDailyProtein, 
          targetProtein, 
          monthData.daysLogged
        );
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
        const muscleGain = estimateMuscleGain(
          avgSurplus,
          avgProtein,
          targetProtein,
          yearData.totalDaysLogged
        );
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

  // ===== دالة إرسال التقرير لتليغرام =====
  const sendReportToTelegram = async (type: 'daily' | 'monthly' | 'yearly') => {
    if (!botToken || !chatId) {
      alert('⚠️ يرجى إعداد تيليغرام أولاً من تبويب تيليغرام');
      return;
    }

    setSendingReport(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const currentMonth = today.substring(0, 7);
      const currentYear = today.substring(0, 4);
      const est = statsData.estimates;

      let message = '';
      const header = `╔══════════════════════════════╗\n║     📊 *مِيزان - تقرير* ⚖️     ║\n╚══════════════════════════════╝\n\n`;

      if (type === 'daily' && est?.daily) {
        const d = est.daily;
        const weightChangeKg = d.weightChange;
        const isBulk = est.goal === 'bulk';
        
        message = header;
        message += `📅 *التقرير اليومي*\n`;
        message += `📆 التاريخ: ${new Date(today).toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric' })}\n\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `📊 *ما أكلت اليوم:*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        message += `🔥 السعرات: ${Math.round(d.calories)} / ${est.targetCalories}\n`;
        message += `💪 البروتين: ${Math.round(d.protein)}g / ${est.targetProtein}g\n`;
        message += `📈 ${d.metGoal ? '✅ حققت الهدف' : '❌ لم تحقق الهدف'}\n\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `⚖️ *تقديرات الوزن:*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        message += `📊 الفائض/العجز: ${d.surplus > 0 ? '+' : ''}${Math.round(d.surplus)} سعرة\n`;
        message += `⚖️ تغير الوزن المتوقع: ${weightChangeKg > 0 ? '+' : ''}${weightChangeKg.toFixed(3)} كجم\n`;
        if (isBulk) {
          message += `💪 العضلات المتوقعة: ${d.muscleGain.toFixed(3)} كجم\n`;
          message += `🧈 الدهون المتوقعة: ${d.fatChange.toFixed(3)} كجم\n`;
        } else if (est.goal === 'cut') {
          message += `🔥 الدهون المتوقعة: ${Math.abs(d.fatChange).toFixed(3)} كجم\n`;
          message += `💪 الحفاظ على العضلات: ${d.muscleGain >= 0 ? '✅' : '⚠️'}\n`;
        }
        message += `\n💡 *نصيحة:* `;
        if (d.metGoal) {
          message += `👏 ممتاز! أنت على الطريق الصحيح. استمر!`;
        } else if (d.surplus > 0 && isBulk) {
          message += `💪 أنت في تضخيم، الفائض جيد لكن حاول تلتزم بالهدف اليومي.`;
        } else if (d.surplus < 0 && est.goal === 'cut') {
          message += `🔥 أنت في تنشيف، العجز جيد لكن تأكد من كفاية البروتين.`;
        } else {
          message += `📌 حاول تعديل سعراتك لتقترب من هدفك اليومي.`;
        }
      }

      else if (type === 'monthly' && est?.monthly) {
        const m = est.monthly;
        const monthData = statsData.monthlyStats.find(m => m.month === currentMonth);
        const monthName = new Date(currentMonth + '-01').toLocaleDateString('ar', { month: 'long', year: 'numeric' });
        
        message = header;
        message += `📅 *التقرير الشهري*\n`;
        message += `📆 الشهر: ${monthName}\n\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `📊 *إحصائيات الشهر:*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        message += `📆 أيام مسجلة: ${m.daysLogged}\n`;
        message += `✅ أيام حققت الهدف: ${m.daysMetGoal}\n`;
        message += `🔥 متوسط السعرات: ${Math.round(m.avgCalories)} / ${est.targetCalories}\n`;
        message += `💪 متوسط البروتين: ${Math.round(m.avgProtein)}g / ${est.targetProtein}g\n\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `⚖️ *تقديرات الوزن:*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        message += `📊 متوسط الفائض/العجز: ${m.avgSurplus > 0 ? '+' : ''}${Math.round(m.avgSurplus)} سعرة/يوم\n`;
        message += `⚖️ الوزن المتوقع حالياً: ${m.projectedWeight.toFixed(1)} كجم\n`;
        message += `📈 التغير المتوقع: ${m.weightChange > 0 ? '+' : ''}${m.weightChange.toFixed(2)} كجم\n`;
        if (est.goal === 'bulk') {
          message += `💪 العضلات المتوقعة: ${m.muscleGain.toFixed(2)} كجم\n`;
          message += `🧈 الدهون المتوقعة: ${m.fatChange.toFixed(2)} كجم\n`;
        } else if (est.goal === 'cut') {
          message += `🔥 الدهون المفقودة: ${Math.abs(m.fatChange).toFixed(2)} كجم\n`;
        }
        message += `\n💡 *نصيحة:* `;
        if (m.daysMetGoal / m.daysLogged > 0.8) {
          message += `🌟 ممتاز! التزمت بهدفك في ${Math.round((m.daysMetGoal/m.daysLogged)*100)}% من الأيام!`;
        } else if (m.daysMetGoal / m.daysLogged > 0.5) {
          message += `📊 جيد، لكن حاول زيادة الالتزام بالهدف اليومي.`;
        } else {
          message += `⚠️ نسبة الالتزام ${Math.round((m.daysMetGoal/m.daysLogged)*100)}%، حاول التركيز أكثر على هدفك.`;
        }
      }

      else if (type === 'yearly' && est?.yearly) {
        const y = est.yearly;
        const yearData = statsData.yearlyStats.find(y => y.year === currentYear);
        
        message = header;
        message += `📅 *التقرير السنوي*\n`;
        message += `📆 السنة: ${currentYear}\n\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `📊 *إحصائيات السنة:*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        message += `📆 أشهر مسجلة: ${y.monthsLogged}\n`;
        message += `📆 أيام مسجلة: ${y.totalDaysLogged}\n`;
        message += `🔥 متوسط السعرات: ${Math.round(y.avgDailyCalories)} / ${est.targetCalories}\n`;
        message += `💪 متوسط البروتين: ${Math.round(y.avgProtein)}g / ${est.targetProtein}g\n\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += `⚖️ *تقديرات الوزن:*\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        message += `📊 متوسط الفائض/العجز: ${y.avgSurplus > 0 ? '+' : ''}${Math.round(y.avgSurplus)} سعرة/يوم\n`;
        message += `⚖️ الوزن المتوقع حالياً: ${y.projectedWeight.toFixed(1)} كجم\n`;
        message += `📈 التغير السنوي المتوقع: ${y.weightChange > 0 ? '+' : ''}${y.weightChange.toFixed(2)} كجم\n`;
        if (est.goal === 'bulk') {
          message += `💪 العضلات المتوقعة: ${y.muscleGain.toFixed(2)} كجم\n`;
          message += `🧈 الدهون المتوقعة: ${y.fatChange.toFixed(2)} كجم\n`;
        } else if (est.goal === 'cut') {
          message += `🔥 الدهون المفقودة: ${Math.abs(y.fatChange).toFixed(2)} كجم\n`;
        }
        message += `\n💡 *نصيحة:* `;
        if (y.monthsLogged > 6) {
          message += `🌟 عمل رائع! سجلت ${y.monthsLogged} شهر كامل. استمر!`;
        } else if (y.monthsLogged > 3) {
          message += `📊 بداية جيدة، استمر في التسجيل للحصول على نتائج أفضل.`;
        } else {
          message += `📌 ابدأ بتسجيل وجباتك باستمرار للحصول على تحليل دقيق.`;
        }
      }

      message += `\n\n━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `╔══════════════════════════════╗\n`;
      message += `║  ⚖️ مِيزان - حاسبة التغذية   ║\n`;
      message += `║     🎯 ${est?.goalLabel || 'تتبع'}    ║\n`;
      message += `╚══════════════════════════════╝`;

      if (onSendToTelegram) {
        await onSendToTelegram(message);
      } else {
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' }),
        });
      }
      alert(`✅ تم إرسال التقرير ${type === 'daily' ? 'اليومي' : type === 'monthly' ? 'الشهري' : 'السنوي'} بنجاح!`);
    } catch (error) {
      alert('❌ فشل إرسال التقرير');
    }
    setSendingReport(false);
  };

  // ===== عرض تقديرات الوزن =====
  const renderEstimates = () => {
    const est = statsData.estimates;
    if (!est) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-20">⚖️</div>
          <p className="text-white/20 text-sm">لا توجد بيانات كافية للتقدير</p>
          <p className="text-white/10 text-xs mt-1">سجل وجباتك لمدة يوم على الأقل مع إعداد الملف الشخصي</p>
        </div>
      );
    }

    const goalEmoji = est.goal === 'bulk' ? '💪' : est.goal === 'cut' ? '🔥' : '⚖️';

    return (
      <div className="space-y-4">
        {/* ===== التقدير اليومي ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-5 border border-emerald-500/10"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-white/20 bg-white/[0.03] px-3 py-1 rounded-full">تقدير يومي</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/30">{goalEmoji} {est.goalLabel}</span>
              <button
                onClick={() => sendReportToTelegram('daily')}
                disabled={sendingReport}
                className="text-[10px] flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all"
              >
                <Send size={12} />
                إرسال
              </button>
            </div>
          </div>

          {est.daily ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center bg-white/[0.02] rounded-xl p-3">
                <div className="text-sm font-bold text-orange-400">{Math.round(est.daily.calories)}</div>
                <div className="text-[8px] text-white/20">سعرة اليوم</div>
                <div className={`text-[8px] mt-0.5 ${est.daily.metGoal ? 'text-emerald-400' : 'text-orange-400'}`}>
                  {est.daily.metGoal ? '✅ حققت الهدف' : '❌ لم تحقق'}
                </div>
              </div>
              <div className="text-center bg-white/[0.02] rounded-xl p-3">
                <div className={`text-sm font-bold ${est.daily.surplus > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
                  {est.daily.surplus > 0 ? '+' : ''}{Math.round(est.daily.surplus)}
                </div>
                <div className="text-[8px] text-white/20">الفائض/العجز</div>
              </div>
              <div className="text-center bg-white/[0.02] rounded-xl p-3">
                <div className={`text-sm font-bold ${est.daily.weightChange > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
                  {est.daily.weightChange > 0 ? '+' : ''}{est.daily.weightChange.toFixed(3)}
                </div>
                <div className="text-[8px] text-white/20">تغير الوزن (كجم)</div>
              </div>
              <div className="text-center bg-white/[0.02] rounded-xl p-3">
                <div className="text-sm font-bold text-blue-400">{Math.round(est.daily.protein)}g</div>
                <div className="text-[8px] text-white/20">بروتين اليوم</div>
              </div>
            </div>
          ) : (
            <p className="text-white/15 text-xs text-center py-2">لم تسجل أي وجبات اليوم</p>
          )}
        </motion.div>

        {/* ===== التقدير الشهري ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-5 border border-primary-500/10"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-white/20 bg-white/[0.03] px-3 py-1 rounded-full">تقدير شهري</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/30">📊 {new Date().toLocaleDateString('ar', { month: 'long' })}</span>
              <button
                onClick={() => sendReportToTelegram('monthly')}
                disabled={sendingReport}
                className="text-[10px] flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all"
              >
                <Send size={12} />
                إرسال
              </button>
            </div>
          </div>

          {est.monthly ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center bg-white/[0.02] rounded-xl p-2">
                  <div className="text-sm font-bold text-blue-400">{est.monthly.daysLogged}</div>
                  <div className="text-[7px] text-white/20">أيام مسجلة</div>
                </div>
                <div className="text-center bg-white/[0.02] rounded-xl p-2">
                  <div className="text-sm font-bold text-emerald-400">{est.monthly.daysMetGoal}</div>
                  <div className="text-[7px] text-white/20">أيام حققت الهدف</div>
                </div>
                <div className="text-center bg-white/[0.02] rounded-xl p-2">
                  <div className={`text-sm font-bold ${est.monthly.avgSurplus > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {est.monthly.avgSurplus > 0 ? '+' : ''}{Math.round(est.monthly.avgSurplus)}
                  </div>
                  <div className="text-[7px] text-white/20">متوسط الفائض</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center bg-gradient-to-br from-emerald-500/10 to-green-500/5 rounded-xl p-2 border border-emerald-500/20">
                  <div className={`text-sm font-bold ${est.monthly.weightChange > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {est.monthly.weightChange > 0 ? '+' : ''}{est.monthly.weightChange.toFixed(2)} كجم
                  </div>
                  <div className="text-[7px] text-white/20">تغير الوزن</div>
                </div>
                <div className="text-center bg-gradient-to-br from-primary-500/10 to-blue-500/5 rounded-xl p-2 border border-primary-500/20">
                  <div className="text-sm font-bold text-primary-400">{est.monthly.projectedWeight.toFixed(1)} كجم</div>
                  <div className="text-[7px] text-white/20">الوزن المتوقع</div>
                </div>
              </div>
              {est.goal === 'bulk' && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center bg-blue-500/5 rounded-xl p-2 border border-blue-500/20">
                    <div className="text-sm font-bold text-blue-400">{est.monthly.muscleGain.toFixed(2)} كجم</div>
                    <div className="text-[7px] text-white/20">💪 عضلات متوقعة</div>
                  </div>
                  <div className="text-center bg-orange-500/5 rounded-xl p-2 border border-orange-500/20">
                    <div className="text-sm font-bold text-orange-400">{est.monthly.fatChange.toFixed(2)} كجم</div>
                    <div className="text-[7px] text-white/20">🧈 دهون متوقعة</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-white/15 text-xs text-center py-2">لا توجد بيانات كافية لهذا الشهر</p>
          )}
        </motion.div>

        {/* ===== التقدير السنوي ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-5 border border-amber-500/10"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-white/20 bg-white/[0.03] px-3 py-1 rounded-full">تقدير سنوي</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/30">📅 {new Date().getFullYear()}</span>
              <button
                onClick={() => sendReportToTelegram('yearly')}
                disabled={sendingReport}
                className="text-[10px] flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all"
              >
                <Send size={12} />
                إرسال
              </button>
            </div>
          </div>

          {est.yearly ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center bg-white/[0.02] rounded-xl p-2">
                  <div className="text-sm font-bold text-blue-400">{est.yearly.monthsLogged}</div>
                  <div className="text-[7px] text-white/20">أشهر مسجلة</div>
                </div>
                <div className="text-center bg-white/[0.02] rounded-xl p-2">
                  <div className="text-sm font-bold text-purple-400">{est.yearly.totalDaysLogged}</div>
                  <div className="text-[7px] text-white/20">أيام مسجلة</div>
                </div>
                <div className="text-center bg-white/[0.02] rounded-xl p-2">
                  <div className={`text-sm font-bold ${est.yearly.avgSurplus > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {est.yearly.avgSurplus > 0 ? '+' : ''}{Math.round(est.yearly.avgSurplus)}
                  </div>
                  <div className="text-[7px] text-white/20">متوسط الفائض</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center bg-gradient-to-br from-emerald-500/10 to-green-500/5 rounded-xl p-2 border border-emerald-500/20">
                  <div className={`text-sm font-bold ${est.yearly.weightChange > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {est.yearly.weightChange > 0 ? '+' : ''}{est.yearly.weightChange.toFixed(2)} كجم
                  </div>
                  <div className="text-[7px] text-white/20">التغير السنوي</div>
                </div>
                <div className="text-center bg-gradient-to-br from-primary-500/10 to-blue-500/5 rounded-xl p-2 border border-primary-500/20">
                  <div className="text-sm font-bold text-primary-400">{est.yearly.projectedWeight.toFixed(1)} كجم</div>
                  <div className="text-[7px] text-white/20">الوزن المتوقع</div>
                </div>
              </div>
              {est.goal === 'bulk' && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center bg-blue-500/5 rounded-xl p-2 border border-blue-500/20">
                    <div className="text-sm font-bold text-blue-400">{est.yearly.muscleGain.toFixed(2)} كجم</div>
                    <div className="text-[7px] text-white/20">💪 عضلات متوقعة</div>
                  </div>
                  <div className="text-center bg-orange-500/5 rounded-xl p-2 border border-orange-500/20">
                    <div className="text-sm font-bold text-orange-400">{est.yearly.fatChange.toFixed(2)} كجم</div>
                    <div className="text-[7px] text-white/20">🧈 دهون متوقعة</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-white/15 text-xs text-center py-2">لا توجد بيانات كافية لهذه السنة</p>
          )}
        </motion.div>

        {/* ===== ملخص الحالة ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-4 border border-white/[0.03] bg-gradient-to-r from-primary-500/5 to-emerald-500/5"
        >
          <div className="flex items-center justify-between text-[10px] text-white/30">
            <span>⚖️ الوزن الحالي: {est.currentWeight} كجم</span>
            <span>🎯 الهدف: {est.goalLabel}</span>
            <span>📊 أيام مسجلة: {statsData.totalDaysLogged}</span>
          </div>
        </motion.div>
      </div>
    );
  };

  // ============================================
  // العرض الرئيسي
  // ============================================
  return (
    <div className="space-y-4">
      {/* View Selector */}
      <div className="flex gap-1 bg-white/[0.03] rounded-2xl p-1 flex-wrap">
        {[
          { id: 'daily', label: '📅 يومي', icon: <Calendar size={14} /> },
          { id: 'monthly', label: '📊 شهري', icon: <BarChart3 size={14} /> },
          { id: 'yearly', label: '📈 سنوي', icon: <PieChart size={14} /> },
          { id: 'estimates', label: '⚖️ تقديرات', icon: <Weight size={14} /> },
        ].map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView(item.id as any)}
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
          {view === 'estimates' ? (
            renderEstimates()
          ) : view === 'daily' ? (
            renderDailyView()
          ) : view === 'monthly' ? (
            renderMonthlyView()
          ) : (
            renderYearlyView()
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}