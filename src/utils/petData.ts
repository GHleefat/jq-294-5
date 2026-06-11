export type PetSpecies =
  | "orange_cat"
  | "british_shorthair"
  | "ragdoll"
  | "siamese"
  | "maine_coon"
  | "corgi"
  | "golden_retriever"
  | "shiba"
  | "poodle"
  | "husky";

export type PetTemperament = "calm" | "normal" | "impatient";
export type ServiceType = "bath" | "styling" | "spa";

export interface Pet {
  id: string;
  species: PetSpecies;
  name: string;
  emoji: string;
  temperament: PetTemperament;
  patienceMax: number;
  patienceCurrent: number;
  dirtyLevel: number;
  arrivedAt: number;
  customerId: string;
  visitCount: number;
  birthday: string;
  isBirthday: boolean;
}

export interface CustomerRecord {
  customerId: string;
  species: PetSpecies;
  name: string;
  emoji: string;
  temperament: PetTemperament;
  birthday: string;
  totalVisits: number;
  totalSpent: number;
  lastVisitAt: number;
  firstVisitAt: number;
}

export interface TransactionRecord {
  id: string;
  timestamp: number;
  customerId: string;
  petName: string;
  species: PetSpecies;
  service: ServiceType;
  basePrice: number;
  discount: number;
  finalPrice: number;
  satisfaction: "very_satisfied" | "satisfied" | "unsatisfied";
  isBirthday: boolean;
  isRegular: boolean;
}

export interface DailyReport {
  date: string;
  totalIncome: number;
  serviceCount: number;
  serviceBreakdown: Record<ServiceType, number>;
  speciesBreakdown: Record<PetSpecies, number>;
  topSpecies: PetSpecies | null;
  averageSatisfaction: number;
  birthdayCount: number;
  regularCustomerCount: number;
}

export interface DailyStats {
  income: number;
  serviceCount: number;
  serviceBreakdown: Record<ServiceType, number>;
  speciesBreakdown: Record<PetSpecies, number>;
  uniqueCustomers: number;
  averageSatisfaction: number;
  discountTotal: number;
  birthdayCount: number;
  regularCount: number;
}

export interface ReportData {
  totalIncome: number;
  totalServices: number;
  serviceBreakdown: Record<ServiceType, number>;
  speciesBreakdown: Record<PetSpecies, number>;
  topSpecies: { species: PetSpecies; count: number } | null;
  topServices: { service: ServiceType; count: number }[];
  recentTransactions: TransactionRecord[];
  birthdayUpcoming: CustomerRecord[];
  regularCustomers: CustomerRecord[];
  uniqueCustomers: number;
  averageSatisfaction: number;
  today: DailyStats;
  dateString: string;
}

export interface GroomingStation {
  id: string;
  petId: string | null;
  serviceType: ServiceType | null;
  progress: number;
  progressMax: number;
  isWorking: boolean;
}

export type EquipmentType = "permanent" | "consumable";

export interface Equipment {
  id: string;
  name: string;
  emoji: string;
  description: string;
  price: number;
  effectType:
    | "speed_bath"
    | "speed_styling"
    | "speed_spa"
    | "patience_boost"
    | "new_station"
    | "snack";
  purchased: boolean;
  equipmentType: EquipmentType;
}

export interface SettlementData {
  stationId: string;
  pet: Pet;
  service: ServiceType;
  basePrice: number;
  discount: number;
  coins: number;
  satisfaction: "very_satisfied" | "satisfied" | "unsatisfied";
  reputationChange: number;
  isRegularCustomer: boolean;
  isBirthday: boolean;
  totalVisits: number;
}

export interface SpeciesInfo {
  name: string;
  emoji: string;
  type: "cat" | "dog";
}

export const SPECIES_DATA: Record<PetSpecies, SpeciesInfo> = {
  orange_cat: { name: "橘猫", emoji: "🐱", type: "cat" },
  british_shorthair: { name: "英短", emoji: "😸", type: "cat" },
  ragdoll: { name: "布偶", emoji: "😻", type: "cat" },
  siamese: { name: "暹罗", emoji: "😽", type: "cat" },
  maine_coon: { name: "缅因", emoji: "🙀", type: "cat" },
  corgi: { name: "柯基", emoji: "🐶", type: "dog" },
  golden_retriever: { name: "金毛", emoji: "🐕", type: "dog" },
  shiba: { name: "柴犬", emoji: "🐕‍🦺", type: "dog" },
  poodle: { name: "泰迪", emoji: "🐩", type: "dog" },
  husky: { name: "哈士奇", emoji: "🐺", type: "dog" },
};

export const TEMPERAMENT_DATA: Record<
  PetTemperament,
  { name: string; multiplier: number; emoji: string }
> = {
  calm: { name: "乖巧", multiplier: 0.7, emoji: "😊" },
  normal: { name: "普通", multiplier: 1.0, emoji: "😐" },
  impatient: { name: "急躁", multiplier: 1.8, emoji: "😤" },
};

export const SERVICE_DATA: Record<
  ServiceType,
  { name: string; emoji: string; duration: number; price: number }
> = {
  bath: { name: "洗澡", emoji: "💧", duration: 8000, price: 30 },
  styling: { name: "造型", emoji: "✂️", duration: 15000, price: 60 },
  spa: { name: "SPA", emoji: "🧴", duration: 25000, price: 100 },
};

export const EQUIPMENT_DATA: Equipment[] = [
  {
    id: "station_3",
    name: "第三美容台",
    emoji: "🪑",
    description: "增加一个美容台位",
    price: 200,
    effectType: "new_station",
    purchased: false,
    equipmentType: "permanent",
  },
  {
    id: "station_4",
    name: "第四美容台",
    emoji: "🪑",
    description: "再增加一个美容台位",
    price: 400,
    effectType: "new_station",
    purchased: false,
    equipmentType: "permanent",
  },
  {
    id: "premium_bath",
    name: "高级浴缸",
    emoji: "🛁",
    description: "洗澡速度+30%",
    price: 150,
    effectType: "speed_bath",
    purchased: false,
    equipmentType: "permanent",
  },
  {
    id: "pro_scissors",
    name: "专业剪刀",
    emoji: "✂️",
    description: "造型速度+30%",
    price: 200,
    effectType: "speed_styling",
    purchased: false,
    equipmentType: "permanent",
  },
  {
    id: "spa_kit",
    name: "SPA套装",
    emoji: "🧖",
    description: "SPA速度+30%",
    price: 300,
    effectType: "speed_spa",
    purchased: false,
    equipmentType: "permanent",
  },
  {
    id: "snack_pack",
    name: "耐心零食",
    emoji: "🍪",
    description: "投喂宠物恢复15秒耐心",
    price: 20,
    effectType: "snack",
    purchased: false,
    equipmentType: "consumable",
  },
];

export const SNACK_PATIENCE_BOOST = 15000;

export const PET_NAMES: Record<PetSpecies, string[]> = {
  orange_cat: ["橘子", "胖橘", "橘座", "大橘", "橘仔"],
  british_shorthair: ["蓝蓝", "圆圆", "毛球", "嘟嘟", "胖胖"],
  ragdoll: ["仙女", "棉花", "雪球", "云朵", "小白"],
  siamese: ["黑脸", "小暹", "巧巧", "墨墨", "咖啡"],
  maine_coon: ["大毛", "狮子", "毛毛", "大王", "巨无霸"],
  corgi: ["短腿", "屁屁", "小柯", "电臀", "蜜桃"],
  golden_retriever: ["大金", "暖男", "金宝", "毛毛", "阳光"],
  shiba: ["柴柴", "笑柴", "狗子", "豆豆", "小柴"],
  poodle: ["卷卷", "泰泰", "毛毛", "棉花糖", "小卷"],
  husky: ["二哈", "拆家", "帅哈", "阿哈", "酷酷"],
};
