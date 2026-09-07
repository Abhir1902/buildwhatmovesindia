import seed from "@/data/db.json";
import type { BusinessProfile } from "@/domain/types";

export const businessProfile = seed.business as BusinessProfile;
