import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const YANDEX_MAPS_SCRIPT = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU'

// Примерные координаты объектов в Москве (детерминированные)
function getCoordinatesForComplexes(count) {
  const center = [55.7558, 37.6173]
  const coords = []
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const r = 0.04 + (i % 3) * 0.02
    coords.push([
      center[0] + Math.cos(angle) * r + ((i % 5) - 2) * 0.005,
      center[1] + Math.sin(angle) * r + ((i % 7) - 3) * 0.005,
    ])
  }
  return coords
}

function buildBalloonContent(complex) {
  const img = complex.image ? `<img src="${complex.image}" alt="" style="width:100%;max-width:200px;height:120px;object-fit:cover;border-radius:8px;margin-bottom:8px;" />` : ''
  return `
    <div style="font-family:Rubik,sans-serif;padding:4px;min-width:200px;max-width:280px;">
      ${img}
      <div style="font-weight:600;font-size:14px;color:#3F3F3F;margin-bottom:4px;">${complex.title}</div>
      <div style="font-size:13px;color:#3CA4F4;margin-bottom:2px;">${complex.priceFrom}</div>
      <div style="font-size:12px;color:#8E8E8E;">${complex.apartmentsCount}</div>
      <a href="/new-building/${complex.id}" style="display:inline-block;margin-top:8px;font-size:12px;color:#3CA4F4;font-weight:600;">Подробнее</a>
    </div>
  `
}

const YandexMapBlock = ({ complexes, containerClassName = '' }) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!complexes?.length) return

    if (mapInstanceRef.current) {
      mapInstanceRef.current.destroy()
      mapInstanceRef.current = null
    }

    const loadMap = () => {
      if (!window.ymaps) return
      window.ymaps.ready(() => {
        if (!mapRef.current || mapInstanceRef.current) return

        const center = [55.7558, 37.6173]
        const map = new window.ymaps.Map(mapRef.current, {
          center,
          zoom: 11,
          controls: ['zoomControl', 'fullscreenControl'],
        })
        mapInstanceRef.current = map

        const coords = getCoordinatesForComplexes(complexes.length)

        complexes.forEach((complex, index) => {
          const coord = coords[index] || center
          const balloonContent = buildBalloonContent(complex)
          const placemark = new window.ymaps.Placemark(
            coord,
            { balloonContent },
            {
              preset: 'islands#blueCircleIcon',
              iconColor: '#3CA4F4',
            }
          )

          placemark.events.add('mouseenter', () => {
            placemark.balloon.open()
          })
          placemark.events.add('mouseleave', () => {
            placemark.balloon.close()
          })

          placemark.events.add('click', (e) => {
            e.preventDefault()
            navigate(`/new-building/${complex.id}`)
          })

          map.geoObjects.add(placemark)
        })

        if (complexes.length > 1) {
          map.setBounds(
            map.geoObjects.getBounds(),
            { checkZoomRange: true, zoomMargin: 50 }
          )
        }
      })
    }

    if (window.ymaps) {
      loadMap()
      return
    }

    const script = document.createElement('script')
    script.src = YANDEX_MAPS_SCRIPT
    script.async = true
    script.onload = loadMap
    document.head.appendChild(script)
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy()
        mapInstanceRef.current = null
      }
    }
  }, [complexes, navigate])

  return (
    <div
      ref={mapRef}
      className={containerClassName}
      style={{ width: '100%', height: '500px', borderRadius: '15px', overflow: 'hidden' }}
    />
  )
}

export default YandexMapBlock
