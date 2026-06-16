import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Ruler, Scale, Calendar, Activity, Target, Zap, TrendingUp, Calculator, Sparkles } from 'lucide-react';
import type { UserProfile, Gender, ActivityLevel, Goal } from '../types';
import { activityLabels, goalLabels, calculateAllTargets } from '../utils/calculations';

interface ProfileTabProps {
  profile: UserProfile | null;
  onSaveProfile: (profile: UserProfile) => void;
}

export default function ProfileTab({ profile, onSaveProfile }: ProfileTabProps) {
  const [weight, setWeight] = useState(profile?.weight || 70);
  const [height, setHeight] = useState(profile?.height || 170);
  const [age, setAge] = useState(profile?.age || 25);
  const [gender, setGender] = useState<Gender>(profile?.gender || 'male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile?.activityLevel || 'moderate');
  const [goal, setGoal] = useState<Goal>(profile?.goal || 'bulk');
  const [showResults, setShowResults] = useState(!!profile);
  const [results, setResults] = useState<ReturnType<typeof calculateAllTargets> | null>(null);

  useEffect(() => {
    if (profile) {
      const calc = calculateAllTargets(profile.weight, profile.height, profile.age, profile.gender, profile.activityLevel, profile.goal);
      setResults(calc);
    }
  }, [profile]);

  function handleCalculate() {
    const calc = calculateAllTargets(weight, height, age, gender, activityLevel, goal);
    setResults(calc);
    setShowResults(true);

    const newProfile: UserProfile = {
      weight,
      height,
      age,
      gender,
      activityLevel,
      goal,
      targetCalories: calc.targetCalories,
      targetProtein: calc.protein,
      targetCarbs: calc.carbs,
      targetFat: calc.fat,
    };
    onSaveProfile(newProfile);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-4"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 mb-3"
        >
          <span className="text-3xl">💪</span>
        </motion.div>
        <h2 className="text-xl font-bold text-white">حساب احتياجاتك اليومية</h2>
        <p className="text-white/30 text-sm mt-1">أدخل بياناتك لحساب السعرات والماكروز المطلوبة</p>
      </motion.div>

      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-3xl p-6 space-y-5"
      >
        {/* Basic Info Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Weight */}
          <div>
            <label className="flex items-center justify-end gap-1.5 text-xs text-white/30 mb-2 font-medium">
              <Scale size={12} />
              الوزن (كغ)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-xl text-center text-lg font-bold"
              min="30"
              max="200"
            />
          </div>

          {/* Height */}
          <div>
            <label className="flex items-center justify-end gap-1.5 text-xs text-white/30 mb-2 font-medium">
              <Ruler size={12} />
              الطول (سم)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-xl text-center text-lg font-bold"
              min="100"
              max="250"
            />
          </div>

          {/* Age */}
          <div>
            <label className="flex items-center justify-end gap-1.5 text-xs text-white/30 mb-2 font-medium">
              <Calendar size={12} />
              العمر
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-xl text-center text-lg font-bold"
              min="15"
              max="80"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="flex items-center justify-end gap-1.5 text-xs text-white/30 mb-2 font-medium">
              <User size={12} />
              الجنس
            </label>
            <div className="flex gap-1.5">
              <button
                onClick={() => setGender('male')}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                  gender === 'male'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-white/[0.03] text-white/30 border border-transparent hover:bg-white/[0.06]'
                }`}
              >
                ♂️ ذكر
              </button>
              <button
                onClick={() => setGender('female')}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                  gender === 'female'
                    ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                    : 'bg-white/[0.03] text-white/30 border border-transparent hover:bg-white/[0.06]'
                }`}
              >
                ♀️ أنثى
              </button>
            </div>
          </div>
        </div>

        {/* Activity Level */}
        <div>
          <label className="flex items-center justify-end gap-1.5 text-xs text-white/30 mb-3 font-medium">
            <Activity size={12} />
            مستوى النشاط البدني
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(Object.keys(activityLabels) as ActivityLevel[]).map((level) => {
              const info = activityLabels[level];
              const isSelected = activityLevel === level;
              return (
                <motion.button
                  key={level}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActivityLevel(level)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    isSelected
                      ? 'bg-primary-500/20 border border-primary-500/30'
                      : 'bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="text-xl">{info.emoji}</span>
                  <div className={`text-xs font-semibold mt-1 ${isSelected ? 'text-primary-400' : 'text-white/50'}`}>
                    {info.name}
                  </div>
                  <div className="text-[9px] text-white/20 mt-0.5 leading-tight hidden sm:block">
                    {info.desc}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Goal */}
        <div>
          <label className="flex items-center justify-end gap-1.5 text-xs text-white/30 mb-3 font-medium">
            <Target size={12} />
            هدفك
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(goalLabels) as Goal[]).map((g) => {
              const info = goalLabels[g];
              const isSelected = goal === g;
              const colorClasses = {
                bulk: isSelected ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : '',
                maintain: isSelected ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : '',
                cut: isSelected ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' : '',
              };
              return (
                <motion.button
                  key={g}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setGoal(g)}
                  className={`p-4 rounded-2xl text-center transition-all border ${
                    isSelected
                      ? colorClasses[g]
                      : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="text-2xl">{info.emoji}</span>
                  <div className={`text-sm font-bold mt-1 ${isSelected ? '' : 'text-white/50'}`}>
                    {info.name}
                  </div>
                  <div className="text-[10px] text-white/20 mt-0.5">{info.desc}</div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Calculate Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCalculate}
          className="w-full btn-success py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2"
        >
          <Calculator size={20} />
          احسب احتياجاتي
          <Sparkles size={16} />
        </motion.button>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {showResults && results && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', bounce: 0.2 }}
            className="space-y-4"
          >
            {/* TDEE Info */}
            <div className="glass-card rounded-3xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs text-white/20 bg-white/[0.03] px-3 py-1 rounded-full">
                  BMR: {results.bmr} cal
                </div>
                <h3 className="text-sm font-bold text-white/60 flex items-center gap-2">
                  <Zap size={14} className="text-amber-400" />
                  حرقك اليومي (TDEE)
                </h3>
              </div>
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.4, delay: 0.2 }}
                  className="text-5xl font-black text-white"
                >
                  {results.tdee}
                </motion.div>
                <div className="text-white/30 text-sm mt-1">سعرة حرارية / يوم</div>
              </div>
            </div>

            {/* Target Calories */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={`rounded-3xl p-6 border ${
                goal === 'bulk'
                  ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20'
                  : goal === 'cut'
                  ? 'bg-gradient-to-br from-orange-500/10 to-red-500/5 border-orange-500/20'
                  : 'bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20'
              }`}
            >
              <div className="flex items-center justify-end gap-2 mb-3">
                <h3 className="text-sm font-bold text-white/80">
                  {goal === 'bulk' ? '🎯 هدف التضخيم' : goal === 'cut' ? '🎯 هدف التنشيف' : '🎯 هدف التثبيت'}
                </h3>
              </div>

              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.4, delay: 0.4 }}
                  className={`text-6xl font-black ${
                    goal === 'bulk' ? 'text-emerald-400' : goal === 'cut' ? 'text-orange-400' : 'text-blue-400'
                  }`}
                >
                  {results.targetCalories}
                </motion.div>
                <div className="text-white/30 text-sm mt-1">سعرة / يوم</div>
                <div className="text-xs text-white/20 mt-2">
                  {goal === 'bulk' && `+400 سعرة فائضة للتضخيم`}
                  {goal === 'cut' && `-500 سعرة عجز للتنشيف`}
                  {goal === 'maintain' && `نفس حرقك اليومي للتثبيت`}
                </div>
              </div>

              {/* Macros */}
              <div className="grid grid-cols-3 gap-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-blue-500/10 rounded-2xl p-4 text-center border border-blue-500/10"
                >
                  <div className="text-3xl font-black text-blue-400">{results.protein}g</div>
                  <div className="text-[10px] text-white/30 mt-1">💪 بروتين</div>
                  <div className="text-[9px] text-blue-400/50 mt-0.5">
                    {goal === 'bulk' ? '2g/kg' : goal === 'cut' ? '2.2g/kg' : '1.6g/kg'}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-amber-500/10 rounded-2xl p-4 text-center border border-amber-500/10"
                >
                  <div className="text-3xl font-black text-amber-400">{results.carbs}g</div>
                  <div className="text-[10px] text-white/30 mt-1">🌾 كربوهيدرات</div>
                  <div className="text-[9px] text-amber-400/50 mt-0.5">
                    {Math.round((results.carbs * 4 / results.targetCalories) * 100)}% من السعرات
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-pink-500/10 rounded-2xl p-4 text-center border border-pink-500/10"
                >
                  <div className="text-3xl font-black text-pink-400">{results.fat}g</div>
                  <div className="text-[10px] text-white/30 mt-1">🧈 دهون</div>
                  <div className="text-[9px] text-pink-400/50 mt-0.5">
                    {goal === 'cut' ? '20%' : '25%'} من السعرات
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="glass-card rounded-3xl p-5"
            >
              <h4 className="text-xs font-bold text-white/40 text-right mb-3 flex items-center justify-end gap-1.5">
                <TrendingUp size={12} />
                نصائح {goal === 'bulk' ? 'للتضخيم' : goal === 'cut' ? 'للتنشيف' : 'للتثبيت'}
              </h4>
              <div className="space-y-2 text-right">
                {goal === 'bulk' && (
                  <>
                    <p className="text-xs text-white/30">• تناول وجبة غنية بالبروتين كل 3-4 ساعات</p>
                    <p className="text-xs text-white/30">• ركز على الكربوهيدرات قبل وبعد التمرين</p>
                    <p className="text-xs text-white/30">• اهدف لزيادة 0.25-0.5 كغ أسبوعياً</p>
                    <p className="text-xs text-white/30">• احصل على 7-9 ساعات نوم للتعافي</p>
                  </>
                )}
                {goal === 'cut' && (
                  <>
                    <p className="text-xs text-white/30">• حافظ على البروتين العالي للحفاظ على العضلات</p>
                    <p className="text-xs text-white/30">• اشرب الكثير من الماء للشعور بالشبع</p>
                    <p className="text-xs text-white/30">• اهدف لخسارة 0.5-1 كغ أسبوعياً</p>
                    <p className="text-xs text-white/30">• لا تقطع السعرات بشكل كبير دفعة واحدة</p>
                  </>
                )}
                {goal === 'maintain' && (
                  <>
                    <p className="text-xs text-white/30">• وازن بين الأيام العالية والمنخفضة السعرات</p>
                    <p className="text-xs text-white/30">• راقب وزنك أسبوعياً وعدّل حسب الحاجة</p>
                    <p className="text-xs text-white/30">• استمر بالتمارين للحفاظ على الكتلة العضلية</p>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
