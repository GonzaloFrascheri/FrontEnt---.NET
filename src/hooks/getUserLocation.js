import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const DEFAULT_COORDINATES = [-34.9011, -56.1645] // Coordenadas de Montevideo como fallback

export function useUserLocation() {
  const [position, setPosition] = useState(DEFAULT_COORDINATES)
  const [error, setError] = useState(undefined) 

  useEffect(() => {
    let permissionStatus = null 

    const getPosition = () => {
      if (permissionStatus.state !== 'granted') {
        setError('unauthorized')
      }

      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setPosition([coords.latitude, coords.longitude])
          setError(undefined)
        },
        (err) => {
          setError('execution')
          console.error('Error obteniendo ubicación:', err)
          toast.error('No se pudo determinar su ubicación', {
            position: 'top-left',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
            toastId: 'Location-error',
          })
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
        },
      )
    }
    
    navigator.permissions
      .query({ name: 'geolocation' })
      .then((status) => {
        permissionStatus = status
        getPosition()
        permissionStatus.addEventListener('change', getPosition)
      })
      .catch((e) => {
        setError('unauthorized')
        toast.error(
          'Error al obtener permiso de tu ubicación, deberás cambiarlo manualmente',
          {
            position: 'top-left',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
            toastId: 'Location-error',
          },
        )
        console.error(e)
      })

    return () => {
      if (permissionStatus) {
        permissionStatus.removeEventListener('change', getPosition)
      }
    }
  }, [])

  return { position, error }
}
