import { useGameStore } from "../store/gameStore";
import { ShoppingBag, Cookie } from "lucide-react";
import { calculateServiceTime } from "../utils/gameLogic";
import { SERVICE_DATA, ServiceType } from "../utils/petData";
import { useEffect, useState } from "react";

export default function UpgradeShop() {
  const coins = useGameStore((s) => s.coins);
  const equipments = useGameStore((s) => s.equipments);
  const stations = useGameStore((s) => s.stations);
  const snackCount = useGameStore((s) => s.snackCount);
  const purchaseEquipment = useGameStore((s) => s.purchaseEquipment);
  const purchaseFeedback = useGameStore((s) => s.purchaseFeedback);
  const dismissPurchaseFeedback = useGameStore((s) => s.dismissPurchaseFeedback);

  const [showFeedback, setShowFeedback] = useState(false);

  const stationCount = stations.length;
  const maxStations = 4;

  const actualBathTime = calculateServiceTime("bath", equipments);
  const actualStylingTime = calculateServiceTime("styling", equipments);
  const actualSpaTime = calculateServiceTime("spa", equipments);

  useEffect(() => {
    if (purchaseFeedback) {
      setShowFeedback(true);
      const timer = setTimeout(() => {
        setShowFeedback(false);
        dismissPurchaseFeedback();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [purchaseFeedback, dismissPurchaseFeedback]);

  const getSpeedBonusText = (serviceType: ServiceType) => {
    const baseTime = SERVICE_DATA[serviceType].duration;
    const actualTime = calculateServiceTime(serviceType, equipments);
    const speedUp = Math.round((1 - actualTime / baseTime) * 100);
    if (speedUp > 0) {
      return `⚡ +${speedUp}%`;
    }
    return null;
  };

  const permanentEquipments = equipments.filter((e) => e.equipmentType === "permanent");
  const consumableEquipments = equipments.filter((e) => e.equipmentType === "consumable");

  return (
    <div className="bg-gradient-to-b from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 shadow-inner overflow-hidden relative">
      {showFeedback && purchaseFeedback && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-2xl border-2 border-emerald-400 animate-bounce-in">
            <span className="text-lg font-bold text-emerald-700">{purchaseFeedback.text}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-3 bg-emerald-100 border-b border-emerald-200">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-emerald-600" />
          <span className="font-bold text-emerald-800">升级商店</span>
        </div>
        <div className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full">
          <Cookie className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-bold text-amber-700 tabular-nums">{snackCount}</span>
        </div>
      </div>

      <div className="p-3 space-y-3 max-h-full overflow-y-auto">
        <div className="bg-white/60 rounded-xl p-3 border border-emerald-200">
          <div className="text-xs font-bold text-emerald-700 mb-2">📊 当前效率</div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">💧 洗澡</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 line-through">8秒</span>
                <span className="font-bold text-emerald-600">{(actualBathTime / 1000).toFixed(1)}秒</span>
                {getSpeedBonusText("bath") && (
                  <span className="text-emerald-500 font-medium">{getSpeedBonusText("bath")}</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">✂️ 造型</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 line-through">15秒</span>
                <span className="font-bold text-emerald-600">{(actualStylingTime / 1000).toFixed(1)}秒</span>
                {getSpeedBonusText("styling") && (
                  <span className="text-emerald-500 font-medium">{getSpeedBonusText("styling")}</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">🧴 SPA</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 line-through">25秒</span>
                <span className="font-bold text-emerald-600">{(actualSpaTime / 1000).toFixed(1)}秒</span>
                {getSpeedBonusText("spa") && (
                  <span className="text-emerald-500 font-medium">{getSpeedBonusText("spa")}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-emerald-700 mb-2 px-1">🏪 永久设备</div>
          <div className="grid grid-cols-2 gap-2">
            {permanentEquipments.map((eq) => {
              const isStationUpgrade = eq.effectType === "new_station";
              const isMaxStations = isStationUpgrade && stationCount >= maxStations;
              const canAfford = coins >= eq.price;
              const isDisabled = eq.purchased || !canAfford || isMaxStations;

              return (
                <button
                  key={eq.id}
                  onClick={() => !isDisabled && purchaseEquipment(eq.id)}
                  disabled={isDisabled}
                  className={`
                    flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center
                    ${eq.purchased
                      ? "bg-emerald-50 border-emerald-300"
                      : isMaxStations
                        ? "bg-gray-100 border-gray-200 opacity-60"
                        : canAfford
                          ? "bg-white border-emerald-300 hover:border-emerald-500 hover:shadow-md hover:scale-105 cursor-pointer"
                          : "bg-white border-gray-200 opacity-70 cursor-not-allowed"
                    }
                  `}
                >
                  <span className="text-2xl">{eq.emoji}</span>
                  <span className="text-xs font-bold text-emerald-800 leading-tight">{eq.name}</span>
                  <span className="text-xs text-gray-500 leading-tight">{eq.description}</span>
                  {eq.purchased ? (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <span>✅</span> 已拥有
                    </span>
                  ) : isMaxStations ? (
                    <span className="text-xs text-gray-400 font-bold">已满</span>
                  ) : (
                    <span className={`text-xs font-bold ${canAfford ? "text-amber-600" : "text-gray-400"}`}>
                      💰 {eq.price}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-amber-700 mb-2 px-1">🍪 消耗道具</div>
          <div className="grid grid-cols-2 gap-2">
            {consumableEquipments.map((eq) => {
              const canAfford = coins >= eq.price;
              const isDisabled = !canAfford;

              return (
                <button
                  key={eq.id}
                  onClick={() => !isDisabled && purchaseEquipment(eq.id)}
                  disabled={isDisabled}
                  className={`
                    flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center
                    ${canAfford
                      ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 hover:border-amber-500 hover:shadow-md hover:scale-105 cursor-pointer"
                      : "bg-white border-gray-200 opacity-70 cursor-not-allowed"
                    }
                  `}
                >
                  <span className="text-2xl">{eq.emoji}</span>
                  <span className="text-xs font-bold text-amber-800 leading-tight">{eq.name}</span>
                  <span className="text-xs text-gray-500 leading-tight">{eq.description}</span>
                  <span className={`text-xs font-bold ${canAfford ? "text-amber-600" : "text-gray-400"}`}>
                    💰 {eq.price}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
