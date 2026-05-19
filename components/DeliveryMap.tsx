"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface DeliveryMapProps {
    onAddressSelect: (address: string) => void;
}

// Initial center: Tarout Island
const INITIAL_CENTER = [26.5615, 50.0887] as [number, number];

export default function DeliveryMap({ onAddressSelect }: DeliveryMapProps) {
    const [position, setPosition] = useState<[number, number]>(INITIAL_CENTER);
    const [loading, setLoading] = useState(false);

    // Component to handle map clicks
    function LocationMarker() {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setPosition([lat, lng]);
                fetchAddress(lat, lng);
            },
        });

        return position === null ? null : (
            <Marker position={position} />
        );
    }

    const fetchAddress = async (lat: number, lng: number) => {
        setLoading(true);
        try {
            // Free reverse geocoding from OpenStreetMap Nominatim
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            
            if (data && data.display_name) {
                onAddressSelect(data.display_name);
            } else {
                onAddressSelect("Could not determine exact address, please type it manually.");
            }
        } catch (error) {
            console.error("Geocoding error:", error);
            onAddressSelect("Error fetching address. Please type it manually.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden z-0">
            {loading && (
                <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-orange-500 font-bold tracking-widest animate-pulse">
                        LOCATING...
                    </div>
                </div>
            )}
            <MapContainer 
                center={INITIAL_CENTER} 
                zoom={14} 
                style={{ width: "100%", height: "100%", zIndex: 0 }}
            >
                {/* Beautiful Dark Mode Map Tiles from CartoDB */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
                />
                <LocationMarker />
            </MapContainer>
        </div>
    );
}
