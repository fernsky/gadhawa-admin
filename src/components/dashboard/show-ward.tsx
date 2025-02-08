"use client";

import { api } from "@/trpc/react";
import { Loader2, MapIcon } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { GeoJsonObject } from "geojson";
import * as turf from "@turf/turf";
import { Button } from "@/components/ui/button";
import { useMapViewStore } from "@/store/toggle-layer-store";

import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);

const GeoJSON = dynamic(
  () => import("react-leaflet").then((mod) => mod.GeoJSON),
  { ssr: false },
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);

export const ShowWard = ({ wardNumber }: { wardNumber: number }) => {
  const { isStreetView, toggleView } = useMapViewStore();
  const ward = api.ward.getWardByNumber.useQuery({ wardNumber });

  useEffect(() => {
    return () => {
      const container = document.querySelector(".leaflet-container");
      if (container) {
        // @ts-ignore
        container._leaflet_id = null;
      }
    };
  }, []);

  if (ward.isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (ward.error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
        Error fetching ward: {ward.error.message}
      </div>
    );
  }

  const geoJSON = ward.data.geometry as unknown as turf.AllGeoJSON;
  const center = turf.center(geoJSON);
  const centerCoords = center.geometry.coordinates;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Ward Number</h3>
            <p className="text-2xl font-semibold text-gray-900">
              {ward.data.wardNumber}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">
              Ward Area Code
            </h3>
            <p className="text-2xl font-semibold text-gray-900">
              {ward.data.wardAreaCode}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Ward Boundary</h2>
        </div>
        <div className="relative">
          <div className="absolute top-5 left-10 z-[400]">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white"
              onClick={(e) => {
                e.preventDefault();
                toggleView();
              }}
            >
              <MapIcon className="h-4 w-4 mr-2" />
              {isStreetView ? "Satellite View" : "Street View"}
            </Button>
          </div>
          <MapContainer
            className="h-[600px] w-full"
            zoom={13}
            scrollWheelZoom={false}
            center={[centerCoords[1], centerCoords[0]]}
          >
            <TileLayer
              key={isStreetView ? "street" : "satellite"}
              attribution={
                isStreetView ? "© OpenStreetMap contributors" : "© Google"
              }
              url={
                isStreetView
                  ? "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                  : "https://mt1.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}"
              }
            />
            <GeoJSON
              data={geoJSON}
              style={{
                color: "#2563eb",
                weight: 2,
                opacity: 0.6,
                fillColor: "#3b82f6",
                fillOpacity: 0.1,
              }}
            />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};
