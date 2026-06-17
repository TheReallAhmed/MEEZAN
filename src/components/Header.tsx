import { motion } from 'framer-motion';
import { Utensils, User, BookOpen, Send, Dumbbell, Wheat, Droplet, BarChart3 } from 'lucide-react';
import type { TabType, NutritionValues, UserProfile } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  totalNutrition: NutritionValues;
  profile: UserProfile | null;
  todayCount?: number;
}

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'tracker', label: 'الحاسبة', icon: <Utensils size={16} /> },
  { id: 'meals', label: 'وجباتي', icon: <BookOpen size={16} /> },
  { id: 'stats', label: 'الإحصائيات', icon: <BarChart3 size={16} /> },
  { id: 'profile', label: 'ملفي', icon: <User size={16} /> },
  { id: 'telegram', label: 'تيليغرام', icon: <Send size={16} /> },
];

function AnimatedNumber({ value }: { value: number }) {
  return <span>{Math.round(value)}</span>;
}

export default function Header({ activeTab, setActiveTab, totalNutrition, profile, todayCount }: HeaderProps) {
  const displayTotal = totalNutrition;
  const hasData = displayTotal.calories > 0 && todayCount && todayCount > 0;

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

  const calPercent = Math.min((displayTotal.calories / targets.calories) * 100, 100);
  const proteinPercent = Math.min((displayTotal.protein / targets.protein) * 100, 100);
  const carbsPercent = Math.min((displayTotal.carbs / targets.carbs) * 100, 100);
  const fatPercent = Math.min((displayTotal.fat / targets.fat) * 100, 100);

  const goalEmoji = profile?.goal === 'bulk' ? '💪' : profile?.goal === 'cut' ? '🔥' : '⚖️';
  const goalLabel = profile?.goal === 'bulk' ? 'تضخيم' : profile?.goal === 'cut' ? 'تنشيف' : 'تثبيت';

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/[0.05]">
      <div className="max-w-4xl mx-auto px-4">
        {/* الصف العلوي */}
        <div className="flex items-center justify-between py-2">
          {/* التابز - الجانب الأيسر */}
          <nav className="flex gap-0.5 bg-white/[0.04] rounded-2xl p-0.5 order-1">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500/40 to-emerald-500/40 text-white shadow-lg shadow-primary-500/20'
                    : 'text-white/30 hover:text-white/60 hover:bg-white/[0.05]'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* اللوجو والاسم - الجانب الأيمن */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 order-2"
          >
            <span className="text-2xl">⚖️</span>
            <div>
              <h1 className="text-base font-bold bg-gradient-to-r from-primary-400 to-emerald-400 bg-clip-text text-transparent">
                مِيزان
              </h1>
              <p className="text-[8px] text-white/25 font-medium">حاسبة التغذية الذكية</p>
            </div>
          </motion.div>
        </div>

        {/* شريط الإحصائيات - يظهر فقط إذا كان هناك أكلات */}
        {hasData && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="pb-2"
          >
            <div className="bg-gradient-to-r from-primary-500/5 via-emerald-500/5 to-amber-500/5 rounded-2xl p-2.5 border border-white/[0.04]">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                {/* الجهة اليمنى: الهدف + السعرات */}
                <div className="flex items-center gap-3">
                  {profile && (
                    <div className="flex items-center gap-1 text-[9px] text-white/30 bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.04]">
                      <span>{goalEmoji}</span>
                      <span>{goalLabel}</span>
                    </div>
                  )}
                  
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-orange-400" style={{ textShadow: '0 0 30px rgba(249, 115, 22, 0.3)' }}>
                      <AnimatedNumber value={displayTotal.calories} />
                    </span>
                    <span className="text-[9px] text-white/30">سعرة</span>
                    {profile && (
                      <span className="text-[8px] text-white/15 bg-white/[0.03] px-1.5 py-0.5 rounded-full">
                        / {targets.calories}
                      </span>
                    )}
                  </div>
                </div>

                {/* الجهة اليسرى: الماكروز */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* البروتين */}
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-0.5">
                      <Dumbbell size={11} className="text-blue-400" />
                      <span className="text-[11px] font-bold text-blue-400">
                        <AnimatedNumber value={displayTotal.protein} />
                      </span>
                      <span className="text-[7px] text-white/20">g</span>
                    </div>
                    <div className="w-10 h-1 bg-white/[0.08] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${proteinPercent}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                      />
                    </div>
                  </div>

                  {/* الكارب */}
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-0.5">
                      <Wheat size={11} className="text-amber-400" />
                      <span className="text-[11px] font-bold text-amber-400">
                        <AnimatedNumber value={displayTotal.carbs} />
                      </span>
                      <span className="text-[7px] text-white/20">g</span>
                    </div>
                    <div className="w-10 h-1 bg-white/[0.08] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${carbsPercent}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                      />
                    </div>
                  </div>

                  {/* الدهون */}
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-0.5">
                      <Droplet size={11} className="text-pink-400" />
                      <span className="text-[11px] font-bold text-pink-400">
                        <AnimatedNumber value={displayTotal.fat} />
                      </span>
                      <span className="text-[7px] text-white/20">g</span>
                    </div>
                    <div className="w-10 h-1 bg-white/[0.08] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${fatPercent}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full"
                      />
                    </div>
                  </div>

                  {/* دائرة النسبة المئوية */}
                  <div className="hidden sm:flex items-center gap-1">
                    <div className="relative w-6 h-6">
                      <svg className="w-6 h-6 -rotate-90">
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="rgba(255,255,255,0.06)"
                          strokeWidth="2.5"
                          fill="none"
                        />
                        <motion.circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="url(#calGrad)"
                          strokeWidth="2.5"
                          fill="none"
                          strokeLinecap="round"
                          initial={{ strokeDasharray: '0 56.55' }}
                          animate={{ strokeDasharray: `${(calPercent / 100) * 56.55} 56.55` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                        <defs>
                          <linearGradient id="calGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#ef4444" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[6px] font-bold text-white/40">
                        {Math.round(calPercent)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* عدد العناصر */}
                {todayCount && todayCount > 0 && (
                  <span className="text-[7px] text-white/20 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.03]">
                    {todayCount} عناصر
                  </span>
                )}
              </div>

              {/* التفاصيل الإضافية */}
              <div className="flex items-center justify-end gap-3 mt-1 text-[7px] text-white/15">
                <span>🥬 ألياف: {Math.round(displayTotal.fiber)}g</span>
                <span>🍬 سكر: {Math.round(displayTotal.sugar)}g</span>
                <span>🧂 صوديوم: {Math.round(displayTotal.sodium)}mg</span>
                <span>⚖️ {Math.round(displayTotal.grams)}g</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}