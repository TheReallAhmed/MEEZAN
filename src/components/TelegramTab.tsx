import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Settings, CheckCircle, AlertCircle, Info, ExternalLink, Shield, Sparkles } from 'lucide-react';

interface TelegramTabProps {
  botToken: string;
  chatId: string;
  onSetBotToken: (token: string) => void;
  onSetChatId: (id: string) => void;
  onTestConnection: () => Promise<boolean>;
}

export default function TelegramTab({ botToken, chatId, onSetBotToken, onSetChatId, onTestConnection }: TelegramTabProps) {
  const [tokenInput, setTokenInput] = useState(botToken);
  const [chatIdInput, setChatIdInput] = useState(chatId);
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    onSetBotToken(tokenInput.trim());
    onSetChatId(chatIdInput.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleTest() {
    if (!tokenInput.trim() || !chatIdInput.trim()) return;
    setTestStatus('loading');
    onSetBotToken(tokenInput.trim());
    onSetChatId(chatIdInput.trim());
    try {
      const ok = await onTestConnection();
      setTestStatus(ok ? 'success' : 'error');
    } catch {
      setTestStatus('error');
    }
    setTimeout(() => setTestStatus('idle'), 3000);
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
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mb-3"
          style={{ boxShadow: '0 0 40px rgba(14, 165, 233, 0.2)' }}
        >
          <span className="text-3xl">📱</span>
        </motion.div>
        <h2 className="text-xl font-bold text-white">ربط تيليغرام</h2>
        <p className="text-white/30 text-sm mt-1">أرسل وجباتك مباشرة لتيليغرام</p>
      </motion.div>

      {/* Setup */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-3xl p-6"
      >
        <h3 className="text-sm font-bold text-white/60 text-right flex items-center justify-end gap-2 mb-5">
          <Settings size={14} className="text-primary-400" />
          إعدادات الاتصال
        </h3>

        <div className="space-y-5 text-right" dir="rtl">
          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-blue-500/10 rounded-2xl p-5"
          >
            <div className="flex items-start gap-3">
              <Info size={18} className="text-blue-400/60 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-blue-400/80 font-semibold text-sm mb-3 flex items-center gap-2">
                  <Sparkles size={12} />
                  خطوات سريعة
                </h4>
                <ol className="text-white/30 text-xs space-y-2.5 list-decimal list-inside leading-relaxed">
                  <li>
                    افتح{' '}
                    <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-blue-400/70 underline inline-flex items-center gap-0.5 hover:text-blue-400">
                      @BotFather <ExternalLink size={10} />
                    </a>
                    {' '}وأرسل /newbot
                  </li>
                  <li>انسخ الـ Token الذي ستحصل عليه</li>
                  <li>
                    للـ Chat ID افتح{' '}
                    <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer" className="text-blue-400/70 underline inline-flex items-center gap-0.5 hover:text-blue-400">
                      @userinfobot <ExternalLink size={10} />
                    </a>
                  </li>
                </ol>
              </div>
            </div>
          </motion.div>

          {/* Inputs */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.3 }} 
            className="space-y-4"
          >
            <div>
              <label className="block text-xs text-white/25 mb-2 font-medium">🤖 Bot Token</label>
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz..."
                className="w-full px-5 py-4 rounded-2xl text-left font-mono text-xs"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-xs text-white/25 mb-2 font-medium">🆔 Chat ID</label>
              <input
                type="text"
                value={chatIdInput}
                onChange={(e) => setChatIdInput(e.target.value)}
                placeholder="123456789"
                className="w-full px-5 py-4 rounded-2xl text-left font-mono text-xs"
                dir="ltr"
              />
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTest}
              disabled={!tokenInput.trim() || !chatIdInput.trim() || testStatus === 'loading'}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-medium disabled:opacity-30 border transition-all ${
                testStatus === 'success' 
                  ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                  : testStatus === 'error'
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'bg-white/[0.02] border-white/[0.04] text-white/40 hover:bg-white/[0.05]'
              }`}
            >
              {testStatus === 'loading' ? (
                <div className="loader" />
              ) : testStatus === 'success' ? (
                <CheckCircle size={18} />
              ) : testStatus === 'error' ? (
                <AlertCircle size={18} />
              ) : (
                <Send size={18} />
              )}
              <span className="text-sm">
                {testStatus === 'loading' ? 'جاري...' : testStatus === 'success' ? 'تم بنجاح!' : testStatus === 'error' ? 'فشل!' : 'اختبار'}
              </span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={!tokenInput.trim() || !chatIdInput.trim()}
              className="flex-1 btn-glow py-4 rounded-2xl text-white font-bold disabled:opacity-30 text-sm"
            >
              {saved ? '✅ تم الحفظ!' : '💾 حفظ'}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`glass-card rounded-3xl p-5 border ${
          botToken && chatId 
            ? 'border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-green-500/5' 
            : 'border-white/[0.04]'
        }`}
      >
        <div className="flex items-center justify-end gap-3">
          <motion.div
            animate={botToken && chatId ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield size={16} className={botToken && chatId ? 'text-emerald-400' : 'text-white/10'} />
          </motion.div>
          <span className={`text-sm font-medium ${botToken && chatId ? 'text-emerald-400' : 'text-white/20'}`}>
            {botToken && chatId
              ? '✅ متصل — يمكنك إرسال الوجبات من "وجباتي"'
              : '⚠️ غير متصل'}
          </span>
        </div>
      </motion.div>

      {/* Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-3xl p-5"
      >
        <h3 className="text-white/30 text-xs font-semibold text-right mb-4 flex items-center justify-end gap-2">
          <Sparkles size={12} className="text-primary-400" />
          معاينة الرسالة
        </h3>
        <div className="bg-gradient-to-br from-[#0f1829] to-[#0a1628] rounded-2xl p-5 font-mono text-[9px] text-white/40 text-left leading-relaxed border border-white/[0.05]" dir="ltr">
          <pre className="whitespace-pre-wrap">
{`╔══════════════════════════╗
║     🍽️ *مِيزان* ⚖️        ║
╠══════════════════════════╣
║   📋 *فطور صباحي*
╚══════════════════════════╝

📅 *التاريخ:* 15 يناير 2025
⏰ *الوقت:* 08:30 ص
🍴 *عدد الأصناف:* 4

━━━━━━━━━━━━━━━━━━━━━━
📝 *المكونات:*
━━━━━━━━━━━━━━━━━━━━━━

• بيضة
   ├ 📊 2 حبة
   └ 🔥 155 سعرة | 💪 13g بروتين

• خبز عربي
   ├ 📊 1 حبة
   └ 🔥 165 سعرة | 💪 5.5g بروتين

━━━━━━━━━━━━━━━━━━━━━━
📊 *الإجمالي:*
━━━━━━━━━━━━━━━━━━━━━━

🔥 *السعرات:* 420
   ▓▓▓▓▓▓░░░░ 60%

💪 *البروتين:* 28g
   ▓▓▓▓▓▓▓░░░ 70%

╔══════════════════════════╗
║  ⚖️ مُرسل من تطبيق مِيزان  ║
╚══════════════════════════╝`}
          </pre>
        </div>
      </motion.div>
    </div>
  );
}
