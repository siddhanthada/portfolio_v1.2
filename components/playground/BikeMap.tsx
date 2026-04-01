'use client'

import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useRef, useEffect } from 'react'
import type { Map as LeafletMap } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icon bug with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: '/leaflet/marker-icon.png',
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

const accentIcon = new L.DivIcon({
  className: '',
  html: `<div style="width:10px;height:10px;border-radius:50%;background:var(--accent);border:2px solid #080808;box-shadow:0 0 0 3px rgba(200,255,0,0.25)"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
  popupAnchor: [0, -12],
})

const rides = [
  {
    name: 'Sakleshpur',
    lat: 12.9517,
    lng: 75.7828,
    date: '26 Jul 2025',
    distance: '230 km',
    photo: '/work/playground/rides/sakleshpur.jpeg',
  },
  {
    name: 'Shivanasamudra Falls',
    lat: 12.262,
    lng: 77.16,
    date: '25 Sep 2025',
    distance: '135 km',
    photo: '/work/playground/rides/shivanasamudra.jpeg',
  },
  {
    name: 'Mysore',
    lat: 12.2958,
    lng: 76.6394,
    date: '25 Sep 2025',
    distance: '150 km',
    photo: '/work/playground/rides/mysore.jpeg',
  },
  {
    name: 'Ooty',
    lat: 11.4102,
    lng: 76.695,
    date: '23 Oct 2025',
    distance: '270 km',
    photo: '/work/playground/rides/ooty.JPG',
  },
  {
    name: 'Kaiwara Hills',
    lat: 13.515,
    lng: 77.8,
    date: '21 Dec 2025',
    distance: '95 km',
    photo: '/work/playground/rides/kaiwara-hills.jpeg',
  },
  {
    name: 'Coorg',
    lat: 12.3375,
    lng: 75.8069,
    date: '6 Feb 2026',
    distance: '260 km',
    photo: '/work/playground/rides/coorg.jpeg',
  },
  {
    name: 'Rameshwaram',
    lat: 9.2881,
    lng: 79.3129,
    date: '20 Mar 2026',
    distance: '580 km',
    photo: '/work/playground/rides/rameshwaram.jpeg',
  },
]

function OpenDefaultPopup({ markerRef }: { markerRef: React.RefObject<L.Marker | null> }) {
  const map = useMap()
  useEffect(() => {
    const timer = setTimeout(() => {
      if (markerRef.current) {
        markerRef.current.openPopup()
      }
    }, 600)
    return () => clearTimeout(timer)
  }, [map, markerRef])
  return null
}

export default function BikeMap() {
  const mapRef = useRef<LeafletMap | null>(null)
  const sakleshpurRef = useRef<L.Marker | null>(null)

  return (
    <div>
      <MapContainer
        center={[12.5, 77.5]}
        zoom={6}
        scrollWheelZoom={false}
        ref={mapRef}
        style={{
          width: '100%',
          height: 480,
          borderRadius: 4,
          border: '1px solid var(--border)',
        }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="CartoDB"
        />
        <OpenDefaultPopup markerRef={sakleshpurRef} />

        {rides.map((ride) => (
          <Marker
            key={ride.name}
            position={[ride.lat, ride.lng]}
            icon={accentIcon}
            ref={ride.name === 'Sakleshpur' ? sakleshpurRef : undefined}
          >
            <Popup>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-sans, sans-serif)',
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'var(--text)',
                  }}
                >
                  {ride.name}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: 11,
                    color: 'var(--muted)',
                    marginTop: 4,
                  }}
                >
                  {ride.date} · {ride.distance}
                </div>
                {ride.photo && (
                  <div style={{ position: 'relative', marginTop: 10 }}>
                    <img
                      src={ride.photo}
                      alt={ride.name}
                      onClick={(e) => {
                        e.stopPropagation()
                        window.dispatchEvent(new CustomEvent('open-ride-photo', {
                          detail: { src: ride.photo, alt: ride.name },
                        }))
                      }}
                      style={{
                        width: '100%',
                        aspectRatio: '16/9',
                        objectFit: 'cover',
                        borderRadius: 2,
                        display: 'block',
                        cursor: 'zoom-in',
                      }}
                    />
                    <div style={{
                      position: 'absolute', top: 6, right: 6,
                      fontSize: 12, color: 'var(--muted)',
                      pointerEvents: 'none', lineHeight: 1,
                    }}>⤢</div>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Ride list below map */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          overflowX: 'auto',
          paddingTop: 20,
          paddingBottom: 4,
        }}
      >
        {rides.map((ride) => (
          <div
            key={ride.name}
            style={{ flexShrink: 0, cursor: 'pointer' }}
            onClick={() => {
              mapRef.current?.flyTo([ride.lat, ride.lng], 10, { duration: 1.2 })
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--text)',
              }}
            >
              {ride.name}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 11,
                color: 'var(--muted)',
                marginTop: 2,
              }}
            >
              {ride.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
