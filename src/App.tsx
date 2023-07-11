import React, { useCallback, useRef, useState } from 'react'
import cs from 'classnames'
import { Marker, InfoWindow, LoadScript, GoogleMap } from '@react-google-maps/api'
import { useFarm } from './hooks/useFarm'
import { Location } from './models'

import './App.css'

function App() {
  const { farms, fertilizer, currentFarmId, setCurrentFarmId } = useFarm()

  const [selected, setSelected] = useState<Location>()

  const mapRef = useRef<google.maps.Map | null>(null)

  const centerRef = useRef<google.maps.LatLng | google.maps.LatLngLiteral>({
    lat: 59.91097179457186,
    lng: 10.669202958861451
  })

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  return (
    <div className="overflow-hidden w-full h-screen relative flex">
      <div className="flex-shrink-0 bg-slate-50 flex  p-3 flex-col gap-3  md:w-[260px] ">
        <h1 className="h3">Test Smartfert</h1>
        <select
          id="country"
          name="country"
          autoComplete="country-name"
          className="outline-none w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-lime-600 sm:max-w-xs sm:text-sm sm:leading-6"
          onChange={(e) => setCurrentFarmId(e.target.value)}
          value={currentFarmId}
        >
          {farms.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <div className="flex-1 overflow-auto">
          <ol className="rounded-md bg-white border list-disc text-sm shadow-sm ">
            {fertilizer?.locations.map((item, index) => {
              return (
                <li
                  key={item.id}
                  className={cs('hover:bg-gray-100', {
                    'text-white !bg-lime-600': item.id === selected?.id
                  })}
                >
                  <a
                    className="p-3 flex justify-between"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setSelected(item)
                    }}
                  >
                    <span>{index + 1}.</span> {item.nit.toFixed(2)}
                  </a>
                </li>
              )
            })}
          </ol>
        </div>
        <div className="rounded-md bg-white border p-3 mb-auto flex justify-between divide-y">
          <span>Total: </span>
          {fertilizer?.total || 0}
        </div>
      </div>

      <div className="flex flex-1 w-full">
        <LoadScript googleMapsApiKey={''} >
          <GoogleMap
            mapContainerClassName="w-full"
            center={centerRef.current}
            zoom={16}
            onLoad={onMapLoad}
            onCenterChanged={() => {
              centerRef.current = mapRef.current?.getCenter()?.toJSON() as
                | google.maps.LatLng
                | google.maps.LatLngLiteral
            }}
          >
            {fertilizer?.locations.map((location, index) => {
              const [lat, lng] = location.geo
              return (
                <Marker
                  key={location.id}
                  position={{ lng, lat }}
                  onMouseOver={() => {
                    setSelected(location)
                  }}
                  label={`${index + 1}`}
                />
              )
            })}
            {selected && (
              <InfoWindow
                position={{
                  lat: selected.geo[0],
                  lng: selected.geo[1]
                }}
                zIndex={10}
                onCloseClick={() => {
                  setSelected(undefined)
                }}
              >
                <div className="text-lg">{selected.nit}</div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  )
}

export default App
