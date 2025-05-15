import { publicProcedure } from "@/server/api/trpc";
import { sql } from "drizzle-orm";
import { gadhawaAggregateBuilding } from "@/server/db/schema/aggregate-building";

export const getDistinctWardNumbers = publicProcedure.query(async ({ ctx }) => {
  const results = await ctx.db
    .selectDistinct({
      wardNumber: gadhawaAggregateBuilding.ward_number,
    })
    .from(gadhawaAggregateBuilding)
    .where(sql`${gadhawaAggregateBuilding.ward_number} IS NOT NULL`)
    .orderBy(gadhawaAggregateBuilding.ward_number);

  return results
    .filter(({ wardNumber }) => wardNumber !== null)
    .map(({ wardNumber }) => ({
      id: wardNumber!.toString(),
      wardNumber: wardNumber!,
    }));
});

export const getDistinctAreaCodes = publicProcedure.query(async ({ ctx }) => {
  const results = await ctx.db
    .selectDistinct({
      areaCode: gadhawaAggregateBuilding.area_code,
    })
    .from(gadhawaAggregateBuilding)
    .where(sql`${gadhawaAggregateBuilding.area_code} IS NOT NULL`)
    .orderBy(gadhawaAggregateBuilding.area_code);

  return results
    .filter(({ areaCode }) => areaCode !== null)
    .map(({ areaCode }) => ({
      id: areaCode!.toString(),
      areaCode: areaCode!,
    }));
});

export const getDistinctEnumerators = publicProcedure.query(async ({ ctx }) => {
  const results = await ctx.db
    .selectDistinct({
      enumeratorId: gadhawaAggregateBuilding.enumerator_id,
      enumeratorName: gadhawaAggregateBuilding.enumerator_name,
    })
    .from(gadhawaAggregateBuilding)
    .where(sql`${gadhawaAggregateBuilding.enumerator_id} IS NOT NULL`)
    .orderBy(gadhawaAggregateBuilding.enumerator_name);

  return results
    .filter(({ enumeratorId }) => enumeratorId !== null)
    .map(({ enumeratorId, enumeratorName }) => ({
      id: enumeratorId!,
      name: enumeratorName || "Unknown Enumerator",
    }));
});

export const getDistinctMapStatuses = publicProcedure.query(async ({ ctx }) => {
  const results = await ctx.db
    .selectDistinct({
      mapStatus: gadhawaAggregateBuilding.map_status,
    })
    .from(gadhawaAggregateBuilding)
    .where(sql`${gadhawaAggregateBuilding.map_status} IS NOT NULL`)
    .orderBy(gadhawaAggregateBuilding.map_status);

  return results
    .filter(({ mapStatus }) => mapStatus !== null)
    .map(({ mapStatus }) => ({
      id: mapStatus!,
      name: mapStatus!,
    }));
});

export const getDistinctBuildingOwnerships = publicProcedure.query(
  async ({ ctx }) => {
    const results = await ctx.db
      .selectDistinct({
        buildingOwnership: gadhawaAggregateBuilding.building_ownership_status,
      })
      .from(gadhawaAggregateBuilding)
      .where(
        sql`${gadhawaAggregateBuilding.building_ownership_status} IS NOT NULL`,
      )
      .orderBy(gadhawaAggregateBuilding.building_ownership_status);

    return results
      .filter(({ buildingOwnership }) => buildingOwnership !== null)
      .map(({ buildingOwnership }) => ({
        id: buildingOwnership!,
        name: buildingOwnership!.replace(/_/g, " "),
      }));
  },
);

export const getDistinctBuildingBases = publicProcedure.query(
  async ({ ctx }) => {
    const results = await ctx.db
      .selectDistinct({
        buildingBase: gadhawaAggregateBuilding.building_base,
      })
      .from(gadhawaAggregateBuilding)
      .where(sql`${gadhawaAggregateBuilding.building_base} IS NOT NULL`)
      .orderBy(gadhawaAggregateBuilding.building_base);

    return results
      .filter(({ buildingBase }) => buildingBase !== null)
      .map(({ buildingBase }) => ({
        id: buildingBase!,
        name: buildingBase!.replace(/_/g, " "),
      }));
  },
);
