import { motion } from 'framer-motion';
import { Utensils, Send, Flame, User, TrendingUp, Award, Target } from 'lucide-react';
import type { TabType, UserProfile, NutritionValues } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  totalNutrition: NutritionValues;
  profile: UserProfile | null;
}

const tabs: { id: TabType; label: string; labelShort: string; icon: React.ReactNode }[] = [
  { id: 'tracker', label: 'حاسبة التغذية', labelShort: 'حاسبة', icon: <Flame size={16} /> },
  { id: 'profile', label: 'أهدافي', labelShort: 'أهداف', icon: <User size={16} /> },
  { id: 'meals', label: 'وجباتي', labelShort: 'وجبات', icon: <Utensils size={16} /> },
  { id: 'telegram', label: 'تيليغرام', labelShort: 'إرسال', icon: <Send size={16} /> },
];

// دالة لجلب النصيحة حسب النسبة المئوية
function getAdvice(percent: number, label: string): string {
  if (percent >= 100) return `✅ ممتاز! ${label} مكتمل`;
  if (percent >= 75) return `👍 قريب جداً، كمل ${label}`;
  if (percent >= 50) return `💪 نص الطريق، استمر`;
  if (percent >= 25) return `📈 بداية جيدة، زود ${label}`;
  return `🌱 ابدأ بإضافة ${label}`;
}

// دالة لجلب لون النسبة المئوية
function getPercentColor(percent: number): string {
  if (percent >= 100) return 'from-green-500 to-emerald-400';
  if (percent >= 75) return 'from-blue-500 to-cyan-400';
  if (percent >= 50) return 'from-amber-500 to-orange-400';
  if (percent >= 25) return 'from-orange-500 to-red-500';
  return 'from-red-500 to-rose-600';
}

// دالة لجلب النصيحة حسب الهدف
function getGoalEmoji(goal: string): string {
  switch (goal) {
    case 'bulk': return '💪 تضخيم';
    case 'cut': return '🔥 تنشيف';
    case 'maintain': return '⚖️ تثبيت';
    default: return '🎯 تتبع';
  }
}

// الأكلات المصرية الأكثر شيوعاً لعرضها في الـ Header
const egyptianFoods = ['عيش بلدي', 'فول مدمس', 'طعمية', 'كشري', 'ملوخية'];

export default function Header({ activeTab, setActiveTab, totalNutrition, profile }: HeaderProps) {
  const hasProfile = !!profile;
  const calories = totalNutrition.calories || 0;
  const targetCalories = profile?.targetCalories || 2000;
  const caloriePercent = Math.min((calories / targetCalories) * 100, 100);

  const protein = totalNutrition.protein || 0;
  const targetProtein = profile?.targetProtein || 50;
  const proteinPercent = Math.min((protein / targetProtein) * 100, 100);

  const carbs = totalNutrition.carbs || 0;
  const targetCarbs = profile?.targetCarbs || 300;
  const carbsPercent = Math.min((carbs / targetCarbs) * 100, 100);

  const fat = totalNutrition.fat || 0;
  const targetFat = profile?.targetFat || 65;
  const fatPercent = Math.min((fat / targetFat) * 100, 100);

  // حساب مجموع السعرات المتبقية
  const remainingCalories = Math.max(targetCalories - calories, 0);

  return (
    <header className="glass-strong sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex flex-col gap-3">
          {/* Top row - Logo RIGHT, Tabs LEFT */}
          <div className="flex items-center gap-4">
            {/* Tabs - LEFT */}
            <nav className="flex gap-0.5 bg-white/[0.02] rounded-2xl p-1 border border-white/[0.03]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                    activeTab === tab.id ? 'text-white' : 'text-white/30 hover:text-white/50'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-emerald-600/90 rounded-xl"
                      style={{ boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)' }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1">
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </span>
                </button>
              ))}
            </nav>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Logo - RIGHT */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', bounce: 0.4 }}
              className="flex items-center gap-3"
            >
              <div className="text-right">
                <div className="flex items-center gap-1.5 justify-end">
                  <h1 className="text-xl font-black gradient-text tracking-tight">مِيزان</h1>
                  <span className="text-sm">🇪🇬</span>
                </div>
                <p className="text-[9px] text-white/20 -mt-0.5 font-medium">حاسبة التغذية الذكية</p>
              </div>
              <motion.div
                className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 via-emerald-500 to-amber-500 flex items-center justify-center"
                style={{ boxShadow: '0 0 30px rgba(14, 165, 233, 0.4), 0 0 60px rgba(16, 185, 129, 0.2)' }}
                whileHover={{ rotate: 15, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="text-2xl">⚖️</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Quick Stats - show when profile exists */}
          {hasProfile && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-white/[0.02] to-white/[0.01] rounded-2xl p-3 border border-white/[0.04]"
            >
              {/* Top row: goal + progress summary */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                    <Target size={10} />
                    <span>{getGoalEmoji(profile.goal || 'maintain')}</span>
                  </div>
                  {calories > 0 && (
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className="text-white/30">متبقي:</span>
                      <span className={`font-bold ${remainingCalories > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {Math.round(remainingCalories)}
                      </span>
                      <span className="text-white/20 text-[8px]">سعرة</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[9px] text-white/20">
                  <Award size={10} className="text-primary-400/50" />
                  <span>أكلات مصرية: {egyptianFoods.join('، ')}</span>
                </div>
              </div>

              {/* Progress bars - 4 columns */}
              <div className="grid grid-cols-4 gap-2">
                {/* Calories */}
                <div className="relative group">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold ${caloriePercent >= 100 ? 'text-green-400' : 'text-orange-400'}`}>
                      {Math.round(calories)}
                    </span>
                    <span className="text-[9px] text-white/20">🔥</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${caloriePercent}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${getPercentColor(caloriePercent)}`}
                      style={{ boxShadow: `0 0 10px rgba(${caloriePercent >= 100 ? '16, 185, 129' : '249, 115, 22'}, 0.5)` }}
                    />
                  </div>
                  <div className="flex justify-between text-[8px] text-white/15 mt-0.5">
                    <span>{targetCalories}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {getAdvice(caloriePercent, 'السعرات')}
                    </span>
                  </div>
                </div>

                {/* Protein */}
                <div className="relative group">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold ${proteinPercent >= 100 ? 'text-green-400' : 'text-blue-400'}`}>
                      {Math.round(protein)}g
                    </span>
                    <span className="text-[9px] text-white/20">💪</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${proteinPercent}%` }}
                      transition={{ duration: 1, delay: 0.1, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${getPercentColor(proteinPercent)}`}
                      style={{ boxShadow: `0 0 10px rgba(${proteinPercent >= 100 ? '16, 185, 129' : '14, 165, 233'}, 0.5)` }}
                    />
                  </div>
                  <div className="flex justify-between text-[8px] text-white/15 mt-0.5">
                    <span>{targetProtein}g</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {getAdvice(proteinPercent, 'البروتين')}
                    </span>
                  </div>
                </div>

                {/* Carbs - مهم جداً للمصريين */}
                <div className="relative group">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold ${carbsPercent >= 100 ? 'text-green-400' : 'text-amber-400'}`}>
                      {Math.round(carbs)}g
                    </span>
                    <span className="text-[9px] text-white/20">🌾</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${carbsPercent}%` }}
                      transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${getPercentColor(carbsPercent)}`}
                      style={{ boxShadow: `0 0 10px rgba(${carbsPercent >= 100 ? '16, 185, 129' : '245, 158, 11'}, 0.5)` }}
                    />
                  </div>
                  <div className="flex justify-between text-[8px] text-white/15 mt-0.5">
                    <span>{targetCarbs}g</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {getAdvice(carbsPercent, 'الكارب')}
                    </span>
                  </div>
                </div>

                {/* Fat */}
                <div className="relative group">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold ${fatPercent >= 100 ? 'text-green-400' : 'text-pink-400'}`}>
                      {Math.round(fat)}g
                    </span>
                    <span className="text-[9px] text-white/20">🧈</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${fatPercent}%` }}
                      transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${getPercentColor(fatPercent)}`}
                      style={{ boxShadow: `0 0 10px rgba(${fatPercent >= 100 ? '16, 185, 129' : '236, 72, 153'}, 0.5)` }}
                    />
                  </div>
                  <div className="flex justify-between text-[8px] text-white/15 mt-0.5">
                    <span>{targetFat}g</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {getAdvice(fatPercent, 'الدهون')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom row: motivational message based on progress */}
              {calories > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-center"
                >
                  <span className="text-[9px] text-white/20">
                    {caloriePercent >= 100 ? '🎉 أحسنت! أكملت احتياجك اليومي من السعرات' :
                     caloriePercent >= 75 ? '💪 طريقك للصحة، استمر!' :
                     caloriePercent >= 50 ? '🌿 نص الطريق، كمل خير!' :
                     '🌱 ابدأ يومك بصحة، أضف وجبتك القادمة'}
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}