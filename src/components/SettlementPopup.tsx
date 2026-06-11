import { useGameStore } from "../store/gameStore";
import { SERVICE_DATA } from "../utils/petData";
import {
  calculateSatisfaction,
  getRegularDiscountTier,
} from "../utils/gameLogic";
import { X, Gift, Star } from "lucide-react";

export default function SettlementPopup() {
  const settlement = useGameStore((s) => s.settlement);
  const dismissSettlement = useGameStore((s) => s.dismissSettlement);

  if (!settlement) return null;

  const sat = calculateSatisfaction(
    settlement.pet.patienceCurrent / settlement.pet.patienceMax,
  );
  const serviceInfo = SERVICE_DATA[settlement.service];
  const { label } = getRegularDiscountTier(settlement.pet.visitCount);
  const hasDiscount = settlement.discount > 0;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 shadow-2xl border-2 border-orange-200 max-w-sm w-full mx-4 animate-bounce-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-orange-800">🎉 服务完成</h3>
          <button
            onClick={dismissSettlement}
            className="p-1 hover:bg-orange-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-orange-400" />
          </button>
        </div>

        <div
          className={`flex items-center gap-3 mb-4 p-3 rounded-2xl ${settlement.isBirthday ? "bg-gradient-to-r from-rose-50 to-pink-50" : settlement.isRegularCustomer ? "bg-gradient-to-r from-amber-50 to-yellow-50" : "bg-orange-50"}`}
        >
          <span className="text-4xl relative">
            {settlement.pet.emoji}
            {settlement.isBirthday && (
              <span className="absolute -top-2 -left-2 text-xl animate-bounce">
                🎂
              </span>
            )}
            {settlement.isRegularCustomer &&
              !settlement.isBirthday &&
              settlement.totalVisits >= 10 && (
                <span className="absolute -top-2 -left-2 text-xl">👑</span>
              )}
          </span>
          <div className="flex-1">
            <div className="font-bold text-orange-900 flex items-center gap-1.5 flex-wrap">
              {settlement.pet.name}
              {settlement.isRegularCustomer && (
                <span className="text-xs bg-gradient-to-r from-amber-300 to-yellow-300 text-amber-900 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-600" />
                  累计{settlement.totalVisits}次
                </span>
              )}
              {settlement.isBirthday && (
                <span className="text-xs bg-gradient-to-r from-rose-300 to-pink-300 text-rose-900 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                  <Gift className="w-3 h-3" />
                  生日快乐!
                </span>
              )}
            </div>
            <div className="text-sm text-orange-500">
              {serviceInfo.emoji} {serviceInfo.name}
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {hasDiscount && (
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-500">服务原价</span>
              <span className="text-gray-400 line-through">
                {settlement.basePrice} 💰
              </span>
            </div>
          )}
          {label && (
            <div className="flex items-center justify-between p-2 bg-amber-50 rounded-xl">
              <span className="text-sm text-amber-600 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400" /> {label}
              </span>
              <span className="font-bold text-amber-600">
                -
                {settlement.isBirthday
                  ? Math.round((settlement.discount * 0.4) / 0.55)
                  : settlement.discount}
              </span>
            </div>
          )}
          {settlement.isBirthday && (
            <div className="flex items-center justify-between p-2 bg-rose-50 rounded-xl">
              <span className="text-sm text-rose-600 flex items-center gap-1">
                <Gift className="w-4 h-4" /> 🎂生日特惠 85折
              </span>
              <span className="font-bold text-rose-600">
                -{Math.round(settlement.basePrice * 0.15)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between p-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl border-2 border-amber-300">
            <span className="text-sm text-amber-700 font-bold">实收金额</span>
            <span className="font-bold text-amber-900 text-lg">
              +{settlement.coins} 💰
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-xl">
            <span className="text-sm text-yellow-700">满意度</span>
            <span className="font-bold text-yellow-800">
              {sat.emoji} {sat.label}
            </span>
          </div>
          <div
            className={`flex items-center justify-between p-2 rounded-xl ${
              settlement.reputationChange > 0 ? "bg-emerald-50" : "bg-red-50"
            }`}
          >
            <span
              className={`text-sm ${settlement.reputationChange > 0 ? "text-emerald-700" : "text-red-700"}`}
            >
              口碑变化
            </span>
            <span
              className={`font-bold ${settlement.reputationChange > 0 ? "text-emerald-800" : "text-red-800"}`}
            >
              {settlement.reputationChange > 0 ? "+" : ""}
              {settlement.reputationChange} ⭐
            </span>
          </div>
        </div>

        <button
          onClick={dismissSettlement}
          className="w-full py-3 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] shadow-md"
        >
          收下 💰
        </button>
      </div>
    </div>
  );
}
