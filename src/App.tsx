import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import TrackerTab from './components/TrackerTab';
import { sumNutrition } from './components/TrackerTab';
import ProfileTab from './components/ProfileTab';
import MealsTab from './components/MealsTab';
import TelegramTab from './components/TelegramTab';
import StatsTab from './components/StatsTab';
import type { TabType, SavedMeal, FoodEntry, UserProfile, DailyEatenFood } from './types';
import { unitLabels } from './data/foodDatabase';

function loadFromLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToLS(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore */ }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('tracker');
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [meals, setMeals] = useState<SavedMeal[]>(() => loadFromLS('mizan_meals', []));
  const [eatenFoods, setEatenFoods] = useState<DailyEatenFood[]>(() => loadFromLS('mizan_eaten_foods', []));
  const [profile, setProfile] = useState<UserProfile | null>(() => loadFromLS('mizan_profile', null));
  const [botToken, setBotToken] = useState(() => loadFromLS('mizan_bot_token', ''));
  const [chatId, setChatId] = useState(() => loadFromLS('mizan_chat_id', ''));
  const [toast, setToast] = useState<string | null>(null);

  // ===== حساب إجمالي اليوم =====
  function getTodayTotal() {
    const today = new Date().toISOString().split('T')[0];
    const todayFoods = eatenFoods.filter(f => {
      const date = new Date(f.eatenAt).toISOString().split('T')[0];
      return date === today;
    });

    const entries = todayFoods.map(f => ({
      id: f.id,
      foodId: f.id,
      foodName: f.name,
      foodNameAr: f.nameAr,
      quantity: f.quantity,
      unit: f.unit,
      nutrition: f.nutrition,
      category: 'prepared',
    }));

    return {
      total: sumNutrition(entries),
      count: todayFoods.length,
      foods: todayFoods,
    };
  }

  const todayData = getTodayTotal();

  // Persist
  useEffect(() => { saveToLS('mizan_meals', meals); }, [meals]);
  useEffect(() => { saveToLS('mizan_eaten_foods', eatenFoods); }, [eatenFoods]);
  useEffect(() => { saveToLS('mizan_profile', profile); }, [profile]);
  useEffect(() => { saveToLS('mizan_bot_token', botToken); }, [botToken]);
  useEffect(() => { saveToLS('mizan_chat_id', chatId); }, [chatId]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  // ===== إدارة الوجبات المحفوظة =====
  function handleSaveMeal(meal: SavedMeal) {
    setMeals((prev) => [meal, ...prev]);
    showToast(`✅ تم حفظ "${meal.name}" في وجباتي!`);
  }

  function handleDeleteMeal(id: string) {
    setMeals((prev) => prev.filter((m) => m.id !== id));
    showToast('🗑️ تم حذف الوجبة');
  }

  // ===== إدارة أكلات اليوم =====
  function handleAddFoodToToday(food: DailyEatenFood) {
    setEatenFoods(prev => [food, ...prev]);
    showToast(`✅ تم إضافة ${food.nameAr} إلى قائمة اليوم!`);
  }

  function handleRemoveFoodFromToday(id: string) {
    setEatenFoods(prev => prev.filter(f => f.id !== id));
  }

  function handleClearToday() {
    const today = new Date().toISOString().split('T')[0];
    setEatenFoods(prev => prev.filter(f => {
      const date = new Date(f.eatenAt).toISOString().split('T')[0];
      return date !== today;
    }));
    showToast('🗑️ تم مسح قائمة اليوم');
  }

  // ===== إضافة وجبة محفوظة إلى أكلات اليوم (كوجبة كاملة) =====
  function handleAddMealToToday(meal: SavedMeal) {
    const today = new Date().toISOString();
    const newFood: DailyEatenFood = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name: meal.name,
      nameAr: meal.name,
      nutrition: meal.totalNutrition,
      quantity: 1,
      unit: 'وجبة',
      eatenAt: today,
      mealType: 'وجبة رئيسية',
      notes: `وجبة كاملة: ${meal.name}`,
      source: 'saved_meal',
      isMeal: true,
      mealId: meal.id,
    };
    setEatenFoods(prev => [newFood, ...prev]);
    showToast(`✅ تم إضافة "${meal.name}" كوجبة كاملة!`);
  }

  function handleSaveProfile(newProfile: UserProfile) {
    setProfile(newProfile);
    showToast('✅ تم حفظ بياناتك وأهدافك!');
  }

  // ===== تيليغرام =====
  function formatMealMessage(meal: SavedMeal): string {
    const t = meal.totalNutrition;
    const date = new Date(meal.createdAt).toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric' });
    const time = new Date(meal.createdAt).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' });

    const hasProfile = !!profile;
    const calPercent = hasProfile ? Math.round((t.calories / profile.targetCalories) * 100) : 0;
    const proteinPercent = hasProfile ? Math.round((t.protein / profile.targetProtein) * 100) : 0;
    const carbsPercent = hasProfile ? Math.round((t.carbs / profile.targetCarbs) * 100) : 0;
    const fatPercent = hasProfile ? Math.round((t.fat / profile.targetFat) * 100) : 0;

    const makeBar = (percent: number) => {
      const filled = Math.round(percent / 10);
      const empty = 10 - filled;
      return '▓'.repeat(Math.min(filled, 10)) + '░'.repeat(Math.max(empty, 0));
    };

    let msg = ``;
    msg += `╔══════════════════════════╗\n`;
    msg += `║     🍽️ *مِيزان* ⚖️        ║\n`;
    msg += `╠══════════════════════════╣\n`;
    msg += `║   📋 *${meal.name}*\n`;
    msg += `╚══════════════════════════╝\n\n`;

    msg += `📅 *التاريخ:* ${date}\n`;
    msg += `⏰ *الوقت:* ${time}\n`;
    msg += `🍴 *عدد الأصناف:* ${meal.entries.length}\n\n`;

    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📝 *المكونات:*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    for (const entry of meal.entries) {
      const unitLabel = unitLabels[entry.unit] || entry.unit;
      msg += `• ${entry.foodNameAr}\n`;
      msg += `   ├ 📊 ${entry.quantity} ${unitLabel}\n`;
      msg += `   └ 🔥 ${entry.nutrition.calories} سعرة | 💪 ${entry.nutrition.protein}g بروتين\n\n`;
    }

    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📊 *الإجمالي:*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    msg += `🔥 *السعرات:* ${Math.round(t.calories)}\n`;
    if (hasProfile) msg += `   ${makeBar(calPercent)} ${calPercent}%\n\n`;
    else msg += `\n`;

    msg += `💪 *البروتين:* ${t.protein}g\n`;
    if (hasProfile) msg += `   ${makeBar(proteinPercent)} ${proteinPercent}%\n\n`;
    else msg += `\n`;

    msg += `🌾 *الكربوهيدرات:* ${t.carbs}g\n`;
    if (hasProfile) msg += `   ${makeBar(carbsPercent)} ${carbsPercent}%\n\n`;
    else msg += `\n`;

    msg += `🧈 *الدهون:* ${t.fat}g\n`;
    if (hasProfile) msg += `   ${makeBar(fatPercent)} ${fatPercent}%\n\n`;
    else msg += `\n`;

    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📋 *تفاصيل إضافية:*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    msg += `🥬 الألياف: ${t.fiber}g\n`;
    msg += `🍬 السكر: ${t.sugar}g\n`;
    msg += `🧂 الصوديوم: ${Math.round(t.sodium)}mg\n`;
    msg += `🩸 الحديد: ${t.iron}mg\n`;
    msg += `🦴 الكالسيوم: ${Math.round(t.calcium)}mg\n`;
    msg += `🍊 فيتامين C: ${t.vitaminC}mg\n`;
    msg += `⚖️ الوزن الكلي: ${Math.round(t.grams)}g\n\n`;

    if (hasProfile) {
      msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      msg += `🎯 *هدفك اليومي:*\n`;
      msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      msg += `${profile.goal === 'bulk' ? '💪 تضخيم' : profile.goal === 'cut' ? '🔥 تنشيف' : '⚖️ تثبيت'}\n`;
      msg += `🎯 السعرات: ${profile.targetCalories}\n`;
      msg += `💪 البروتين: ${profile.targetProtein}g\n`;
      msg += `🌾 الكارب: ${profile.targetCarbs}g\n`;
      msg += `🧈 الدهون: ${profile.targetFat}g\n\n`;
    }

    msg += `╔══════════════════════════╗\n`;
    msg += `║  ⚖️ مُرسل من تطبيق مِيزان  ║\n`;
    msg += `║   حاسبة التغذية الذكية   ║\n`;
    msg += `╚══════════════════════════╝`;

    return msg;
  }

  const sendToTelegram = useCallback(
    async (meal: SavedMeal) => {
      if (!botToken || !chatId) {
        showToast('⚠️ يرجى إعداد تيليغرام أولاً');
        setActiveTab('telegram');
        return;
      }
      try {
        const message = formatMealMessage(meal);
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' }),
        });
        const data = await res.json();
        if (data.ok) {
          showToast('✅ تم إرسال الوجبة لتيليغرام!');
        } else {
          showToast('❌ فشل: ' + (data.description || 'خطأ'));
        }
      } catch {
        showToast('❌ فشل الاتصال بتيليغرام');
      }
    },
    [botToken, chatId, profile]
  );

  async function testTelegramConnection(): Promise<boolean> {
    try {
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const msg = `╔══════════════════════════╗
║     ⚖️ *مِيزان* 🎉        ║
╠══════════════════════════╣
║   ✅ تم الاتصال بنجاح!    ║
║                          ║
║  يمكنك الآن إرسال وجباتك  ║
║     وتتبع تغذيتك! 💪      ║
╚══════════════════════════╝`;
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'Markdown' }),
      });
      const data = await res.json();
      return data.ok === true;
    } catch {
      return false;
    }
  }

  return (
    <div className="min-h-screen text-white relative">
      <div className="bg-mesh" />

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              left: `${Math.random() * 100}%`,
              bottom: '-10px',
              background: i % 3 === 0 
                ? 'rgba(14, 165, 233, 0.4)' 
                : i % 3 === 1 
                  ? 'rgba(52, 211, 153, 0.4)' 
                  : 'rgba(251, 191, 36, 0.3)',
              animationDuration: `${12 + Math.random() * 15}s`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          totalNutrition={todayData.total}
          profile={profile}
          todayCount={todayData.count}
        />

        <main className="max-w-4xl mx-auto px-4 py-6 pb-20">
          <AnimatePresence mode="wait">
            {activeTab === 'tracker' && (
              <motion.div
                key="tracker"
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <TrackerTab 
                  onSaveMeal={handleSaveMeal}
                  eatenFoods={eatenFoods}
                  onAddFoodToToday={handleAddFoodToToday}
                  onRemoveFoodFromToday={handleRemoveFoodFromToday}
                  onClearToday={handleClearToday}
                  profile={profile}
                  todayTotal={todayData.total}
                />
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <ProfileTab profile={profile} onSaveProfile={handleSaveProfile} />
              </motion.div>
            )}

            {activeTab === 'meals' && (
              <motion.div
                key="meals"
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <MealsTab
                  meals={meals}
                  onDeleteMeal={handleDeleteMeal}
                  onSendToTelegram={sendToTelegram}
                  telegramConfigured={!!botToken && !!chatId}
                  onAddMealToToday={handleAddMealToToday}
                />
              </motion.div>
            )}

            {activeTab === 'telegram' && (
              <motion.div
                key="telegram"
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <TelegramTab
                  botToken={botToken}
                  chatId={chatId}
                  onSetBotToken={(t) => setBotToken(t)}
                  onSetChatId={(id) => setChatId(id)}
                  onTestConnection={testTelegramConnection}
                />
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <StatsTab 
                  profile={profile}
                  eatenFoods={eatenFoods}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              transition={{ type: 'spring', bounce: 0.4 }}
              className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 glass-strong px-8 py-4 rounded-2xl text-white font-bold text-sm"
              style={{ boxShadow: '0 0 40px rgba(14, 165, 233, 0.2), 0 20px 40px rgba(0,0,0,0.3)' }}
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="fixed bottom-0 left-0 right-0 glass py-2.5 text-center z-20">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/15 text-[10px] font-medium flex items-center justify-center gap-2"
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ⚖️
            </motion.span>
            مِيزان — حاسبة التغذية الذكية
            <span className="text-white/10">•</span>
            <span className="text-white/10">{new Date().getFullYear()}</span>
          </motion.p>
        </footer>
      </div>
    </div>
  );
}