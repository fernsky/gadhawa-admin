import { family } from "@/server/db/schema";
import { gadhawaAnimalProduct } from "@/server/db/schema/family/animal-products";
import { gadhawaAnimal } from "@/server/db/schema/family/animals";
import { gadhawaCrop } from "@/server/db/schema/family/crops";
import gadhawaAgriculturalLand from "@/server/db/schema/family/agricultural-lands";
import { gadhawaIndividual } from "@/server/db/schema/family/individual";

export type FamilyResult = typeof family.$inferSelect & {
  agriculturalLands: (typeof gadhawaAgriculturalLand.$inferSelect)[];
  animals: (typeof gadhawaAnimal.$inferSelect)[];
  animalProducts: (typeof gadhawaAnimalProduct.$inferSelect)[];
  crops: (typeof gadhawaCrop.$inferSelect)[];
  individuals: (typeof gadhawaIndividual.$inferSelect)[];
};
