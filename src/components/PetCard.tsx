import { Pet, SPECIES_DATA, TEMPERAMENT_DATA } from "../utils/petData";
import { useGameStore } from "../store/gameStore";
import { getRegularDiscountTier } from "../utils/gameLogic";
import { Cookie } from "lucide-react";

interface PetCardProps {
  pet: Pet;
  inQueue?: boolean;
  showFeedButton?: boolean;
  onFeed?: () => void;
  isFeeding?: boolean;
}

export default function PetCard({
  pet,
  inQueue = true,
  showFeedButton = false,
  onFeed,
  isFeeding = false,
}: PetCardProps) {
  const setDraggedPetId = useGameStore((s) => s.setDraggedPetId);
  const snackCount = useGameStore((s) => s.snackCount);
  const patienceRatio = pet.patienceCurrent / pet.patienceMax;
  const speciesInfo = SPECIES_DATA[pet.species];
  const temperInfo = TEMPERAMENT_DATA[pet.temperament];
  const { label: discountLabel, tier: discountTier } = getRegularDiscountTier(
    pet.visitCount,
  );
  const isRegular = pet.visitCount >= 3;
  const isVIP = pet.visitCount >= 10;

  const patienceColor =
    patienceRatio > 0.6
      ? "bg-emerald-400"
      : patienceRatio > 0.3
        ? "bg-yellow-400"
        : "bg-red-400";

  const patienceBgColor =
    patienceRatio > 0.6
      ? "bg-emerald-100"
      : patienceRatio > 0.3
        ? "bg-yellow-100"
        : "bg-red-100";

  const lowPatience = patienceRatio <= 0.3 && inQueue;
  const canFeed = showFeedButton && onFeed && snackCount > 0;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("petId", pet.id);
    e.dataTransfer.effectAllowed = "move";
    setDraggedPetId(pet.id);
  };

  const handleDragEnd = () => {
    setDraggedPetId(null);
  };

  const handleFeedClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (canFeed && onFeed) {
      onFeed();
    }
  };

  return (
    <div
      draggable={inQueue}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        relative flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-200 select-none
        ${pet.isBirthday ? "border-rose-400 bg-gradient-to-r from-rose-50 to-pink-50" : lowPatience ? "border-red-300 bg-red-50 animate-pulse" : isRegular ? "border-amber-300 bg-gradient-to-br from-white to-amber-50 hover:border-amber-400 hover:shadow-md" : "border-orange-200 bg-white hover:border-orange-300 hover:shadow-md"}
        ${inQueue ? "hover:scale-[1.02] cursor-grab active:cursor-grabbing" : ""}
        ${isFeeding ? "ring-2 ring-amber-400 ring-offset-2" : ""}
      `}
    >
      <div
        className={`text-3xl flex-shrink-0 relative ${isFeeding ? "animate-bounce" : ""}`}
      >
        {pet.emoji}
        {isFeeding && (
          <span className="absolute -top-2 -right-2 text-lg animate-ping">
            🍪
          </span>
        )}
        {pet.isBirthday && (
          <span className="absolute -top-3 -left-1 text-lg animate-bounce">
            �
          </span>
        )}
        {isVIP && !pet.isBirthday && (
          <span className="absolute -top-3 -left-1 text-lg">👑</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          <span className="font-bold text-orange-900 text-sm truncate">
            {pet.name}
          </span>
          {pet.visitCount > 0 && (
            <span className="text-xs text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full font-medium">
              第{pet.visitCount + 1}次
            </span>
          )}
          <span className="text-xs text-orange-500 bg-orange-100 px-1.5 py-0.5 rounded-full">
            {speciesInfo.name}
          </span>
          <span className="text-xs">{temperInfo.emoji}</span>
          {isRegular && (
            <span className="text-xs text-amber-700 bg-gradient-to-r from-amber-200 to-yellow-200 px-1.5 py-0.5 rounded-full font-bold">
              ⭐
              {discountTier >= 3 ? "VIP" : discountTier >= 2 ? "老客" : "熟客"}
            </span>
          )}
          {pet.isBirthday && (
            <span className="text-xs text-rose-700 bg-gradient-to-r from-rose-200 to-pink-200 px-1.5 py-0.5 rounded-full font-bold animate-pulse">
              🎂生日
            </span>
          )}
        </div>
        {discountLabel && (
          <div className="text-[10px] text-amber-600 font-medium mb-1">
            💎 {discountLabel}
            {pet.isBirthday && " + 生日特惠"}
          </div>
        )}
        <div
          className={`w-full h-2.5 rounded-full ${patienceBgColor} overflow-hidden`}
        >
          <div
            className={`h-full rounded-full ${patienceColor} transition-all duration-300 ease-linear`}
            style={{ width: `${Math.max(0, patienceRatio * 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">
            {Math.ceil(pet.patienceCurrent / 1000)}秒
          </span>
          <div className="flex gap-0.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className={`text-xs ${i < pet.dirtyLevel ? "opacity-100" : "opacity-20"}`}
              >
                🐾
              </span>
            ))}
          </div>
        </div>
      </div>

      {showFeedButton && (
        <button
          onClick={handleFeedClick}
          disabled={!canFeed}
          className={`
            flex-shrink-0 p-2 rounded-xl transition-all duration-200
            ${
              canFeed
                ? "bg-amber-100 hover:bg-amber-200 text-amber-600 hover:scale-110 cursor-pointer"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }
          `}
          title={canFeed ? "投喂零食，恢复15秒耐心" : "没有零食了"}
        >
          <Cookie className="w-5 h-5" />
        </button>
      )}

      {inQueue && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">⬆</span>
        </div>
      )}
    </div>
  );
}
