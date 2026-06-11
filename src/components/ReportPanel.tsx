import { useGameStore } from "../store/gameStore";
import {
  SERVICE_DATA,
  SPECIES_DATA,
  PetSpecies,
  ServiceType,
} from "../utils/petData";
import { getRegularDiscountTier } from "../utils/gameLogic";
import {
  X,
  BarChart3,
  TrendingUp,
  Users,
  Cake,
  Star,
  Clock,
  Coins,
  Heart,
  Calendar,
  Sparkles,
  TrendingDown,
} from "lucide-react";

export default function ReportPanel() {
  const showReportPanel = useGameStore((s) => s.showReportPanel);
  const setShowReportPanel = useGameStore((s) => s.setShowReportPanel);
  const getReportData = useGameStore((s) => s.getReportData);
  const transactions = useGameStore((s) => s.transactions);
  const customers = useGameStore((s) => s.customers);

  if (!showReportPanel) return null;

  const report = getReportData();
  const satPercent = Math.round(report.averageSatisfaction * 100);
  const todaySatPercent = Math.round(report.today.averageSatisfaction * 100);

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-");
    return `${y}年${parseInt(m)}月${parseInt(d)}日`;
  };

  const maxServiceCount = Math.max(
    ...Object.values(report.serviceBreakdown),
    1,
  );
  const todayMaxServiceCount = Math.max(
    ...Object.values(report.today.serviceBreakdown),
    1,
  );
  const topSpeciesEntries = Object.entries(report.speciesBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxSpeciesCount =
    topSpeciesEntries.length > 0 ? topSpeciesEntries[0][1] : 1;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-indigo-200 max-w-5xl w-full max-h-[90vh] flex flex-col animate-bounce-in">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">📊 经营报表</h2>
          </div>
          <button
            onClick={() => setShowReportPanel(false)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-gradient-to-r from-orange-400 via-rose-400 to-pink-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 text-[120px] opacity-10 leading-none -mt-4 -mr-4">
              💰
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5" />
                <span className="font-bold text-lg">
                  今日经营 · {formatDate(report.dateString)}
                </span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-medium">
                  {report.today.serviceCount} 单
                </span>
              </div>
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <div className="text-white/80 text-sm mb-1 flex items-center gap-1">
                    <Coins className="w-4 h-4" /> 今日收入
                  </div>
                  <div className="text-4xl font-bold tabular-nums flex items-baseline gap-1">
                    {report.today.income}
                    <span className="text-lg font-normal opacity-80">💰</span>
                  </div>
                  <div className="text-xs text-white/70 mt-1">
                    累计 {report.totalIncome} 💰
                  </div>
                </div>
                <div>
                  <div className="text-white/80 text-sm mb-1 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> 服务量
                  </div>
                  <div className="text-4xl font-bold tabular-nums">
                    {report.today.serviceCount}
                    <span className="text-lg font-normal opacity-80"> 次</span>
                  </div>
                  <div className="text-xs text-white/70 mt-1">
                    累计 {report.totalServices} 次
                  </div>
                </div>
                <div>
                  <div className="text-white/80 text-sm mb-1 flex items-center gap-1">
                    <Users className="w-4 h-4" /> 到店客户
                  </div>
                  <div className="text-4xl font-bold tabular-nums">
                    {report.today.uniqueCustomers}
                    <span className="text-lg font-normal opacity-80"> 位</span>
                  </div>
                  <div className="text-xs text-white/70 mt-1">
                    熟客 {report.today.regularCount} 位 ⭐
                  </div>
                </div>
                <div>
                  <div className="text-white/80 text-sm mb-1 flex items-center gap-1">
                    <Heart className="w-4 h-4" /> 今日满意度
                  </div>
                  <div className="text-4xl font-bold tabular-nums">
                    {todaySatPercent}
                    <span className="text-lg font-normal opacity-80">%</span>
                  </div>
                  <div className="text-xs text-white/70 mt-1 flex items-center gap-1">
                    {report.today.discountTotal > 0 && (
                      <span className="bg-white/20 px-1.5 py-0.5 rounded-full">
                        优惠 -{report.today.discountTotal}
                      </span>
                    )}
                    {report.today.birthdayCount > 0 && (
                      <span className="bg-white/20 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        🎂 {report.today.birthdayCount}位
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {report.today.serviceCount === 0 && (
                <div className="mt-4 bg-white/10 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  今天还没有服务记录，快开始营业吧~
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-4 border-2 border-amber-200">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <Coins className="w-5 h-5" />
                <span className="text-sm font-medium">累计收入</span>
              </div>
              <div className="text-3xl font-bold text-amber-800 tabular-nums">
                💰 {report.totalIncome}
              </div>
              <div className="text-xs text-amber-500 mt-1">
                平均单客{" "}
                {report.totalServices > 0
                  ? Math.round(report.totalIncome / report.totalServices)
                  : 0}{" "}
                💰
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border-2 border-blue-200">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">累计服务量</span>
              </div>
              <div className="text-3xl font-bold text-blue-800 tabular-nums">
                {report.totalServices} 次
              </div>
              <div className="text-xs text-blue-500 mt-1">
                共 {transactions.length} 笔交易记录
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border-2 border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">客户总数</span>
              </div>
              <div className="text-3xl font-bold text-emerald-800 tabular-nums">
                {report.uniqueCustomers} 位
              </div>
              <div className="text-xs text-emerald-500 mt-1">
                熟客 {report.regularCustomers.length} 位 ⭐
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4 border-2 border-pink-200">
              <div className="flex items-center gap-2 text-pink-600 mb-2">
                <Heart className="w-5 h-5" />
                <span className="text-sm font-medium">平均满意度</span>
              </div>
              <div className="text-3xl font-bold text-pink-800 tabular-nums">
                {satPercent}%
              </div>
              <div className="text-xs text-pink-500 mt-1">
                {satPercent >= 80
                  ? "😍 非常棒！"
                  : satPercent >= 60
                    ? "😊 不错哦"
                    : satPercent >= 40
                      ? "😐 加油"
                      : "😡 需改进"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-5 border-2 border-indigo-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                </div>
                <h3 className="font-bold text-indigo-800">服务量统计</h3>
              </div>
              <div className="space-y-3">
                {(["bath", "styling", "spa"] as ServiceType[]).map((svc) => {
                  const info = SERVICE_DATA[svc];
                  const count = report.serviceBreakdown[svc] || 0;
                  const pct =
                    maxServiceCount > 0 ? (count / maxServiceCount) * 100 : 0;
                  const revenue = count * info.price;
                  return (
                    <div key={svc}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{info.emoji}</span>
                          <span className="font-medium text-gray-700">
                            {info.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-gray-500">💰 {revenue}</span>
                          <span className="font-bold text-indigo-700 tabular-nums">
                            {count} 次
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-3 bg-indigo-50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border-2 border-orange-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Star className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="font-bold text-orange-800">🏆 热门品种 TOP 5</h3>
              </div>
              <div className="space-y-3">
                {topSpeciesEntries.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    暂无数据，快开始服务吧~
                  </div>
                ) : (
                  topSpeciesEntries.map(([sp, count], idx) => {
                    const info = SPECIES_DATA[sp as PetSpecies];
                    const pct = (count / maxSpeciesCount) * 100;
                    const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
                    return (
                      <div key={sp}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg w-6">{medals[idx]}</span>
                            <span className="text-2xl">{info.emoji}</span>
                            <span className="font-medium text-gray-700">
                              {info.name}
                            </span>
                            {info.type === "cat" ? (
                              <span className="text-xs bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded-full">
                                猫
                              </span>
                            ) : (
                              <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                                狗
                              </span>
                            )}
                          </div>
                          <span className="font-bold text-orange-700 tabular-nums">
                            {count} 次
                          </span>
                        </div>
                        <div className="w-full h-3 bg-orange-50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-5 border-2 border-rose-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center">
                  <Cake className="w-4 h-4 text-rose-600" />
                </div>
                <h3 className="font-bold text-rose-800">
                  🎂 生日提醒（7天内）
                </h3>
              </div>
              {report.birthdayUpcoming.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm">
                  近期没有生日的宠物~
                </div>
              ) : (
                <div className="space-y-2">
                  {report.birthdayUpcoming.map((c) => {
                    const info = SPECIES_DATA[c.species];
                    return (
                      <div
                        key={c.customerId}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{c.emoji}</span>
                          <div>
                            <div className="font-bold text-gray-800">
                              {c.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {info.name} · 消费{c.totalSpent}💰
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-rose-600">
                            {c.birthday}
                          </div>
                          <div className="text-xs text-rose-400 flex items-center gap-1">
                            <Cake className="w-3 h-3" /> 生日特惠85折
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-5 border-2 border-amber-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Star className="w-4 h-4 text-amber-600 fill-amber-400" />
                </div>
                <h3 className="font-bold text-amber-800">⭐ 熟客榜</h3>
              </div>
              {report.regularCustomers.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm">
                  还没有熟客，服务满3次即可成为熟客~
                </div>
              ) : (
                <div className="space-y-2">
                  {report.regularCustomers.map((c, idx) => {
                    const { label } = getRegularDiscountTier(c.totalVisits);
                    const info = SPECIES_DATA[c.species];
                    return (
                      <div
                        key={c.customerId}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-amber-600 font-bold w-5 text-sm">
                            #{idx + 1}
                          </span>
                          <span className="text-2xl">{c.emoji}</span>
                          <div>
                            <div className="font-bold text-gray-800 flex items-center gap-1">
                              {c.name}
                              {c.totalVisits >= 10 && <span>👑</span>}
                            </div>
                            <div className="text-xs text-gray-500">
                              {info.name} · 到店{c.totalVisits}次
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-amber-700">
                            {c.totalSpent} 💰
                          </div>
                          {label && (
                            <div className="text-xs text-amber-500 font-medium">
                              {label}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                <Clock className="w-4 h-4 text-slate-600" />
              </div>
              <h3 className="font-bold text-slate-800">📋 最近交易记录</h3>
            </div>
            {report.recentTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                暂无交易记录
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-100 text-slate-500">
                      <th className="text-left py-2 px-2 font-medium">时间</th>
                      <th className="text-left py-2 px-2 font-medium">宠物</th>
                      <th className="text-left py-2 px-2 font-medium">服务</th>
                      <th className="text-right py-2 px-2 font-medium">原价</th>
                      <th className="text-right py-2 px-2 font-medium">优惠</th>
                      <th className="text-right py-2 px-2 font-medium">实收</th>
                      <th className="text-center py-2 px-2 font-medium">
                        满意度
                      </th>
                      <th className="text-center py-2 px-2 font-medium">
                        标签
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.recentTransactions.map((t) => {
                      const svcInfo = SERVICE_DATA[t.service];
                      const spInfo = SPECIES_DATA[t.species];
                      return (
                        <tr
                          key={t.id}
                          className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-2 px-2 text-slate-500 tabular-nums">
                            {formatTime(t.timestamp)}
                          </td>
                          <td className="py-2 px-2">
                            <div className="flex items-center gap-1.5">
                              <span>{spInfo.emoji}</span>
                              <span className="font-medium text-slate-700">
                                {t.petName}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 px-2">
                            <span className="inline-flex items-center gap-1 text-slate-600">
                              {svcInfo.emoji} {svcInfo.name}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-right text-slate-400 line-through tabular-nums">
                            {t.basePrice}
                          </td>
                          <td className="py-2 px-2 text-right text-rose-500 font-medium tabular-nums">
                            {t.discount > 0 ? `-${t.discount}` : "-"}
                          </td>
                          <td className="py-2 px-2 text-right font-bold text-amber-600 tabular-nums">
                            {t.finalPrice} 💰
                          </td>
                          <td className="py-2 px-2 text-center">
                            {t.satisfaction === "very_satisfied" && (
                              <span>😍</span>
                            )}
                            {t.satisfaction === "satisfied" && <span>😊</span>}
                            {t.satisfaction === "unsatisfied" && (
                              <span>😡</span>
                            )}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {t.isRegular && (
                                <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                                  ⭐熟客
                                </span>
                              )}
                              {t.isBirthday && (
                                <span className="text-xs bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full">
                                  🎂生日
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t-2 border-slate-100 bg-slate-50 rounded-b-3xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500">
              📊 统计了{" "}
              <span className="font-bold text-slate-700">
                {customers.length}
              </span>{" "}
              位客户，
              <span className="font-bold text-slate-700">
                {" "}
                {transactions.length}
              </span>{" "}
              笔交易
            </div>
            <button
              onClick={() => setShowReportPanel(false)}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-bold transition-all hover:scale-[1.02] shadow-md"
            >
              关闭报表
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
