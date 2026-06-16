import { motion } from 'framer-motion';
import { Utensils, Send, Flame, User, TrendingUp } from 'lucide-react';
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

export default function Header({ activeTab, setActiveTab, totalNutrition, profile }: HeaderProps) {
  const hasProfile = !!profile;
  const calories = totalNutrition.calories;
  const targetCalories = profile?.targetCalories || 2000;
  const caloriePercent = Math.min((calories / targetCalories) * 100, 100);

  const protein = totalNutrition.protein;
  const targetProtein = profile?.targetProtein || 50;
  const proteinPercent = Math.min((protein / targetProtein) * 100, 100);

  const carbs = totalNutrition.carbs;
  const targetCarbs = profile?.targetCarbs || 300;
  const carbsPercent = Math.min((carbs / targetCarbs) * 100, 100);

  const fat = totalNutrition.fat;
  const targetFat = profile?.targetFat || 65;
  const fatPercent = Math.min((fat / targetFat) * 100, 100);

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
                <h1 className="text-xl font-black gradient-text tracking-tight">مِيزان</h1>
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

          {/* Progress tracking bar - show when profile exists */}
          {hasProfile && calories > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-white/[0.02] to-white/[0.01] rounded-2xl p-3 border border-white/[0.04]"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                  <TrendingUp size={10} />
                  <span>تقدمك اليوم</span>
                </div>
                <div className="text-[10px] text-white/20">
                  {profile.goal === 'bulk' ? '💪 تضخيم' : profile.goal === 'cut' ? '🔥 تنشيف' : '⚖️ تثبيت'}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {/* Calories */}
                <div className="relative">
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
                      className={`h-full rounded-full ${caloriePercent >= 100 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}
                      style={{ boxShadow: caloriePercent >= 100 ? '0 0 10px rgba(16, 185, 129, 0.5)' : '0 0 10px rgba(249, 115, 22, 0.5)' }}
                    />
                  </div>
                  <div className="text-[8px] text-white/15 text-center mt-0.5">{targetCalories}</div>
                </div>

                {/* Protein */}
                <div className="relative">
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
                      className={`h-full rounded-full ${proteinPercent >= 100 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`}
                      style={{ boxShadow: proteinPercent >= 100 ? '0 0 10px rgba(16, 185, 129, 0.5)' : '0 0 10px rgba(14, 165, 233, 0.5)' }}
                    />
                  </div>
                  <div className="text-[8px] text-white/15 text-center mt-0.5">{targetProtein}g</div>
                </div>

                {/* Carbs */}
                <div className="relative">
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
                      className={`h-full rounded-full ${carbsPercent >= 100 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-amber-500 to-yellow-400'}`}
                      style={{ boxShadow: carbsPercent >= 100 ? '0 0 10px rgba(16, 185, 129, 0.5)' : '0 0 10px rgba(245, 158, 11, 0.5)' }}
                    />
                  </div>
                  <div className="text-[8px] text-white/15 text-center mt-0.5">{targetCarbs}g</div>
                </div>

                {/* Fat */}
                <div className="relative">
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
                      className={`h-full rounded-full ${fatPercent >= 100 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-pink-500 to-rose-400'}`}
                      style={{ boxShadow: fatPercent >= 100 ? '0 0 10px rgba(16, 185, 129, 0.5)' : '0 0 10px rgba(236, 72, 153, 0.5)' }}
                    />
                  </div>
                  <div className="text-[8px] text-white/15 text-center mt-0.5">{targetFat}g</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
