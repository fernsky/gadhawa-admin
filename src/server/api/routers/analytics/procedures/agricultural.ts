import { sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { and, count, eq } from "drizzle-orm";
import gadhawaAgriculturalLand from "@/server/db/schema/family/agricultural-lands";
import { gadhawaCrop } from "@/server/db/schema/family/crops";
import { gadhawaAnimal } from "@/server/db/schema/family/animals";
import { gadhawaAnimalProduct } from "@/server/db/schema/family/animal-products";

export const getAgriculturalLandStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        ownershipType: gadhawaAgriculturalLand.landOwnershipType,
        totalArea: sql<number>`sum(${gadhawaAgriculturalLand.landArea})::float`,
        count: sql<number>`count(*)::int`,
      })
      .from(gadhawaAgriculturalLand);

    if (input.wardNumber) {
      query.where(eq(gadhawaAgriculturalLand.wardNo, input.wardNumber));
    }

    return await query.groupBy(gadhawaAgriculturalLand.landOwnershipType);
  });

export const getIrrigationStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        isIrrigated: gadhawaAgriculturalLand.isLandIrrigated,
        totalArea: sql<number>`sum(${gadhawaAgriculturalLand.irrigatedLandArea})::float`,
        count: sql<number>`count(*)::int`,
      })
      .from(gadhawaAgriculturalLand);

    if (input.wardNumber) {
      query.where(eq(gadhawaAgriculturalLand.wardNo, input.wardNumber));
    }

    return await query.groupBy(gadhawaAgriculturalLand.isLandIrrigated);
  });

export const getCropStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        cropType: gadhawaCrop.cropType,
        cropName: gadhawaCrop.cropName,
        totalArea: sql<number>`sum(${gadhawaCrop.cropArea})::float`,
        totalProduction: sql<number>`sum(${gadhawaCrop.cropProduction})::float`,
        totalRevenue: sql<number>`sum(${gadhawaCrop.cropRevenue})::float`,
        count: sql<number>`count(*)::int`,
      })
      .from(gadhawaCrop);

    if (input.wardNumber) {
      query.where(eq(gadhawaCrop.wardNo, input.wardNumber));
    }

    return await query.groupBy(gadhawaCrop.cropType, gadhawaCrop.cropName);
  });

export const getAnimalStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        animalName: gadhawaAnimal.animalName,
        totalCount: sql<number>`sum(${gadhawaAnimal.totalAnimals})::int`,
        totalSales: sql<number>`sum(${gadhawaAnimal.animalSales})::float`,
        totalRevenue: sql<number>`sum(${gadhawaAnimal.animalRevenue})::float`,
        householdCount: sql<number>`count(*)::int`,
      })
      .from(gadhawaAnimal);

    if (input.wardNumber) {
      query.where(eq(gadhawaAnimal.wardNo, input.wardNumber));
    }

    return await query.groupBy(gadhawaAnimal.animalName);
  });

export const getAnimalProductStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        productName: gadhawaAnimalProduct.animalProductName,
        unit: gadhawaAnimalProduct.animalProductUnit,
        totalProduction: sql<number>`sum(${gadhawaAnimalProduct.animalProductProduction})::float`,
        totalSales: sql<number>`sum(${gadhawaAnimalProduct.animalProductSales})::float`,
        totalRevenue: sql<number>`sum(${gadhawaAnimalProduct.animalProductRevenue})::float`,
        householdCount: sql<number>`count(*)::int`,
      })
      .from(gadhawaAnimalProduct);

    if (input.wardNumber) {
      query.where(eq(gadhawaAnimalProduct.wardNo, input.wardNumber));
    }

    return await query.groupBy(
      gadhawaAnimalProduct.animalProductName,
      gadhawaAnimalProduct.animalProductUnit
    );
  });

export const getAgriculturalLandOverview = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        totalLandArea: sql<number>`sum(${gadhawaAgriculturalLand.landArea})::float`,
        totalIrrigatedArea: sql<number>`sum(${gadhawaAgriculturalLand.irrigatedLandArea})::float`,
        householdCount: sql<number>`count(distinct ${gadhawaAgriculturalLand.familyId})::int`,
      })
      .from(gadhawaAgriculturalLand);

    if (input.wardNumber) {
      query.where(eq(gadhawaAgriculturalLand.wardNo, input.wardNumber));
    }

    return (await query)[0];
  });

export const getAgricultureOverview = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const baseWhere = input.wardNumber
      ? sql`ward_no = ${input.wardNumber}`
      : sql`1=1`;

    const [crops, animals, products] = await Promise.all([
      ctx.db.execute(sql`
        SELECT 
          COUNT(DISTINCT family_id)::int as total_households,
          SUM(crop_revenue)::float as total_revenue,
          SUM(crop_area)::float as total_area
        FROM ${gadhawaCrop}
        WHERE ${baseWhere}
      `),
      ctx.db.execute(sql`
        SELECT 
          COUNT(DISTINCT family_id)::int as total_households,
          SUM(animal_revenue)::float as total_revenue,
          SUM(total_animals)::int as total_count
        FROM ${gadhawaAnimal}
        WHERE ${baseWhere}
      `),
      ctx.db.execute(sql`
        SELECT 
          COUNT(DISTINCT family_id)::int as total_households,
          SUM(animal_product_revenue)::float as total_revenue
        FROM ${gadhawaAnimalProduct}
        WHERE ${baseWhere}
      `),
    ]);

    return {
      crops: crops[0],
      animals: animals[0],
      animalProducts: products[0],
    };
  });
