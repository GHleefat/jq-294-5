import { create } from "zustand";
import {
  Pet,
  Equipment,
  ServiceType,
  SettlementData,
  EQUIPMENT_DATA,
  SNACK_PATIENCE_BOOST,
  CustomerRecord,
  TransactionRecord,
} from "../utils/petData";
import {
  generateRandomPet,
  calculateSatisfaction,
  calculateServiceTime,
  calculateFinalPrice,
  getPatienceDecayRate,
  createOrUpdateCustomer,
  createTransactionRecord,
  calculateBirthdayReputationBonus,
  generateReportData,
} from "../utils/gameLogic";

export interface StationState {
  id: string;
  pet: Pet | null;
  serviceType: ServiceType | null;
  progress: number;
  progressMax: number;
  isWorking: boolean;
  feedAnimation: boolean;
}

export interface PurchaseFeedback {
  show: boolean;
  equipmentId: string;
  text: string;
}

interface GameStore {
  coins: number;
  reputation: number;
  level: number;
  petsServed: number;
  queue: Pet[];
  stations: StationState[];
  equipments: Equipment[];
  snackCount: number;
  isPaused: boolean;
  isGameOver: boolean;
  selectedStationId: string | null;
  settlement: SettlementData | null;
  lastSpawnTime: number;
  spawnInterval: number;
  maxQueueSize: number;
  draggedPetId: string | null;
  purchaseFeedback: PurchaseFeedback | null;
  feedingPetId: string | null;
  customers: CustomerRecord[];
  transactions: TransactionRecord[];
  showReportPanel: boolean;

  addPetToQueue: () => void;
  assignPetToStation: (petId: string, stationId: string) => void;
  selectService: (stationId: string, serviceType: ServiceType) => void;
  updateGameTick: (deltaMs: number) => void;
  dismissSettlement: () => void;
  purchaseEquipment: (equipmentId: string) => void;
  feedPet: (
    petId: string,
    location: "queue" | "station",
    stationId?: string,
  ) => void;
  togglePause: () => void;
  resetGame: () => void;
  setDraggedPetId: (id: string | null) => void;
  dismissPurchaseFeedback: () => void;
  toggleReportPanel: () => void;
  setShowReportPanel: (show: boolean) => void;
  getReportData: () => ReturnType<typeof generateReportData>;
}

const createInitialStations = (): StationState[] => [
  {
    id: "station_1",
    pet: null,
    serviceType: null,
    progress: 0,
    progressMax: 0,
    isWorking: false,
    feedAnimation: false,
  },
  {
    id: "station_2",
    pet: null,
    serviceType: null,
    progress: 0,
    progressMax: 0,
    isWorking: false,
    feedAnimation: false,
  },
];

const createInitialEquipments = (): Equipment[] =>
  EQUIPMENT_DATA.map((eq) => ({ ...eq, purchased: false }));

export const useGameStore = create<GameStore>((set, get) => ({
  coins: 50,
  reputation: 30,
  level: 1,
  petsServed: 0,
  queue: [],
  stations: createInitialStations(),
  equipments: createInitialEquipments(),
  snackCount: 3,
  isPaused: false,
  isGameOver: false,
  selectedStationId: null,
  settlement: null,
  lastSpawnTime: Date.now(),
  spawnInterval: 8000,
  maxQueueSize: 8,
  draggedPetId: null,
  purchaseFeedback: null,
  feedingPetId: null,
  customers: [],
  transactions: [],
  showReportPanel: false,

  addPetToQueue: () => {
    const { queue, maxQueueSize, customers } = get();
    if (queue.length >= maxQueueSize) return;
    const pet = generateRandomPet(customers);
    set({ queue: [...queue, pet] });
  },

  assignPetToStation: (petId: string, stationId: string) => {
    const { queue, stations } = get();
    const pet = queue.find((p) => p.id === petId);
    if (!pet) return;
    const station = stations.find((s) => s.id === stationId);
    if (!station || station.pet) return;

    set({
      queue: queue.filter((p) => p.id !== petId),
      stations: stations.map((s) =>
        s.id === stationId
          ? {
              ...s,
              pet: { ...pet },
              serviceType: null,
              progress: 0,
              progressMax: 0,
              isWorking: false,
            }
          : s,
      ),
      selectedStationId: stationId,
    });
  },

  selectService: (stationId: string, serviceType: ServiceType) => {
    const { stations, equipments } = get();
    const station = stations.find((s) => s.id === stationId);
    if (!station || !station.pet) return;

    const serviceTime = calculateServiceTime(serviceType, equipments);
    set({
      stations: stations.map((s) =>
        s.id === stationId
          ? {
              ...s,
              serviceType,
              progress: 0,
              progressMax: serviceTime,
              isWorking: true,
            }
          : s,
      ),
      selectedStationId: null,
    });
  },

  updateGameTick: (deltaMs: number) => {
    const state = get();
    if (state.isPaused || state.isGameOver) return;

    const { queue, stations, equipments, lastSpawnTime, spawnInterval } = state;

    const newQueue = queue.map((pet) => {
      const decayRate = getPatienceDecayRate(pet.temperament);
      const newPatience = pet.patienceCurrent - deltaMs * decayRate;
      return { ...pet, patienceCurrent: Math.max(0, newPatience) };
    });

    let reputationDelta = 0;
    const expiredQueuePets = newQueue.filter((p) => p.patienceCurrent <= 0);
    reputationDelta += expiredQueuePets.length * -1;
    const remainingQueue = newQueue.filter((p) => p.patienceCurrent > 0);

    const newStations: StationState[] = [];
    let completedStation: StationState | null = null;

    for (const s of stations) {
      let updated = { ...s };

      if (updated.pet && !updated.isWorking) {
        const decayRate = getPatienceDecayRate(updated.pet.temperament);
        const newPatience =
          updated.pet.patienceCurrent - deltaMs * decayRate * 0.5;
        updated.pet = {
          ...updated.pet,
          patienceCurrent: Math.max(0, newPatience),
        };
        if (updated.pet.patienceCurrent <= 0) {
          reputationDelta -= 1;
          updated = {
            ...updated,
            pet: null,
            serviceType: null,
            progress: 0,
            progressMax: 0,
            isWorking: false,
          };
        }
      }

      if (updated.isWorking && updated.pet) {
        const decayRate = getPatienceDecayRate(updated.pet.temperament);
        const newPatience =
          updated.pet.patienceCurrent - deltaMs * decayRate * 0.3;
        updated.pet = {
          ...updated.pet,
          patienceCurrent: Math.max(0, newPatience),
        };

        const newProgress = updated.progress + deltaMs;
        if (newProgress >= updated.progressMax) {
          updated.progress = updated.progressMax;
          if (!completedStation) {
            completedStation = { ...updated };
          }
        } else {
          updated.progress = newProgress;
        }
      }

      newStations.push(updated);
    }

    const now = Date.now();
    const shouldSpawn = now - lastSpawnTime >= spawnInterval;

    if (completedStation && completedStation.pet) {
      const patienceRatio =
        completedStation.pet.patienceCurrent / completedStation.pet.patienceMax;
      const sat = calculateSatisfaction(patienceRatio);
      const priceInfo = calculateFinalPrice(
        completedStation.serviceType!,
        completedStation.pet.visitCount,
        completedStation.pet.isBirthday,
      );
      const birthdayBonus = calculateBirthdayReputationBonus(
        completedStation.pet.isBirthday,
      );
      const totalRepChange = sat.reputationChange + birthdayBonus;
      const newReputation = state.reputation + reputationDelta + totalRepChange;

      const updatedCustomers = createOrUpdateCustomer(
        state.customers,
        completedStation.pet,
        priceInfo.finalPrice,
      );
      const newTransaction = createTransactionRecord({
        customerId: completedStation.pet.customerId,
        petName: completedStation.pet.name,
        species: completedStation.pet.species,
        service: completedStation.serviceType!,
        basePrice: priceInfo.basePrice,
        discount: priceInfo.basePrice - priceInfo.finalPrice,
        finalPrice: priceInfo.finalPrice,
        satisfaction: sat.satisfaction,
        isBirthday: completedStation.pet.isBirthday,
        isRegular: completedStation.pet.visitCount >= 3,
      });
      const isRegularCustomer = completedStation.pet.visitCount >= 3;

      set({
        queue: remainingQueue,
        stations: newStations.map((s) =>
          s.id === completedStation!.id
            ? {
                ...s,
                pet: null,
                serviceType: null,
                progress: 0,
                progressMax: 0,
                isWorking: false,
              }
            : s,
        ),
        coins: state.coins + priceInfo.finalPrice,
        reputation: Math.max(0, newReputation),
        petsServed: state.petsServed + 1,
        customers: updatedCustomers,
        transactions: [...state.transactions, newTransaction],
        settlement: {
          stationId: completedStation.id,
          pet: completedStation.pet,
          service: completedStation.serviceType!,
          basePrice: priceInfo.basePrice,
          discount: priceInfo.basePrice - priceInfo.finalPrice,
          coins: priceInfo.finalPrice,
          satisfaction: sat.satisfaction,
          reputationChange: totalRepChange,
          isRegularCustomer,
          isBirthday: completedStation.pet.isBirthday,
          totalVisits: completedStation.pet.visitCount + 1,
        },
        isGameOver: newReputation <= 0,
        lastSpawnTime: shouldSpawn ? now : lastSpawnTime,
      });
      if (shouldSpawn) {
        get().addPetToQueue();
      }
      return;
    }

    const newReputation = state.reputation + reputationDelta;
    set({
      queue: remainingQueue,
      stations: newStations,
      reputation: Math.max(0, newReputation),
      isGameOver: newReputation <= 0,
      lastSpawnTime: shouldSpawn ? now : lastSpawnTime,
    });
    if (shouldSpawn) {
      get().addPetToQueue();
    }
  },

  dismissSettlement: () => {
    set({ settlement: null });
  },

  purchaseEquipment: (equipmentId: string) => {
    const { coins, equipments, stations, snackCount } = get();
    const eq = equipments.find((e) => e.id === equipmentId);
    if (!eq || coins < eq.price) return;
    if (eq.equipmentType === "permanent" && eq.purchased) return;

    let feedbackText = "";

    if (eq.effectType === "snack") {
      set({
        coins: coins - eq.price,
        snackCount: snackCount + 1,
        purchaseFeedback: {
          show: true,
          equipmentId,
          text: `+1 ${eq.emoji} ${eq.name}`,
        },
      });
      return;
    }

    if (eq.effectType === "new_station") {
      const newStation: StationState = {
        id: `station_${stations.length + 1}`,
        pet: null,
        serviceType: null,
        progress: 0,
        progressMax: 0,
        isWorking: false,
        feedAnimation: false,
      };
      set({
        coins: coins - eq.price,
        stations: [...stations, newStation],
        equipments: equipments.map((e) =>
          e.id === equipmentId ? { ...e, purchased: true } : e,
        ),
        purchaseFeedback: {
          show: true,
          equipmentId,
          text: `🎉 ${eq.name} 已就位！`,
        },
      });
    } else {
      feedbackText = eq.effectType.startsWith("speed_")
        ? `⚡ ${eq.description}`
        : `✨ ${eq.description}`;
      set({
        coins: coins - eq.price,
        equipments: equipments.map((e) =>
          e.id === equipmentId ? { ...e, purchased: true } : e,
        ),
        purchaseFeedback: {
          show: true,
          equipmentId,
          text: feedbackText,
        },
      });
    }
  },

  feedPet: (
    petId: string,
    location: "queue" | "station",
    stationId?: string,
  ) => {
    const { snackCount, queue, stations } = get();
    if (snackCount <= 0) return;

    if (location === "queue") {
      set({
        snackCount: snackCount - 1,
        queue: queue.map((pet) =>
          pet.id === petId
            ? {
                ...pet,
                patienceCurrent: Math.min(
                  pet.patienceMax,
                  pet.patienceCurrent + SNACK_PATIENCE_BOOST,
                ),
              }
            : pet,
        ),
        feedingPetId: petId,
      });
    } else if (location === "station" && stationId) {
      set({
        snackCount: snackCount - 1,
        stations: stations.map((s) =>
          s.id === stationId && s.pet
            ? {
                ...s,
                pet: {
                  ...s.pet,
                  patienceCurrent: Math.min(
                    s.pet.patienceMax,
                    s.pet.patienceCurrent + SNACK_PATIENCE_BOOST,
                  ),
                },
                feedAnimation: true,
              }
            : s,
        ),
        feedingPetId: petId,
      });
    }

    setTimeout(() => {
      set({ feedingPetId: null });
      if (stationId) {
        const currentStations = get().stations;
        set({
          stations: currentStations.map((s) =>
            s.id === stationId ? { ...s, feedAnimation: false } : s,
          ),
        });
      }
    }, 800);
  },

  dismissPurchaseFeedback: () => {
    set({ purchaseFeedback: null });
  },

  togglePause: () => {
    set({ isPaused: !get().isPaused });
  },

  resetGame: () => {
    set({
      coins: 50,
      reputation: 30,
      level: 1,
      petsServed: 0,
      queue: [],
      stations: createInitialStations(),
      equipments: createInitialEquipments(),
      snackCount: 3,
      isPaused: false,
      isGameOver: false,
      selectedStationId: null,
      settlement: null,
      lastSpawnTime: Date.now(),
      spawnInterval: 8000,
      draggedPetId: null,
      purchaseFeedback: null,
      feedingPetId: null,
      customers: [],
      transactions: [],
      showReportPanel: false,
    });
  },

  setDraggedPetId: (id: string | null) => {
    set({ draggedPetId: id });
  },

  toggleReportPanel: () => {
    set({ showReportPanel: !get().showReportPanel });
  },

  setShowReportPanel: (show: boolean) => {
    set({ showReportPanel: show });
  },

  getReportData: () => {
    const { transactions, customers } = get();
    return generateReportData(transactions, customers);
  },
}));
