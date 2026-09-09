import React, { Suspense, useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

function LoadedCar({ url }) {
  const { scene } = useGLTF(url)
  useEffect(() => {
    scene.traverse((object) => {
      if (!object.isMesh) return
      object.castShadow = true
      object.receiveShadow = true
      if (object.material && 'envMapIntensity' in object.material) {
        object.material.envMapIntensity = Math.max(object.material.envMapIntensity ?? 1, 1.35)
      }
    })
  }, [scene])
  return <primitive object={scene} />
}

export default function RealCar({ url = '/models/car.glb', fallback = null }) {
  const group = useRef()
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    let active = true
    fetch(url, { method: 'HEAD' })
      .then((response) => active && setAvailable(response.ok))
      .catch(() => active && setAvailable(false))
    return () => { active = false }
  }, [url])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (!group.current) return
    group.current.position.y = Math.sin(t * 0.65) * 0.018
    group.current.rotation.y = Math.sin(t * 0.22) * 0.025
  })

  if (!available) return fallback

  return (
    <group ref={group} position={[1.15, -1.05, 0.15]} rotation={[0, -0.18, 0]} scale={1.45}>
      <Suspense fallback={fallback}>
        <LoadedCar url={url} />
      </Suspense>
      <pointLight position={[1.85, 0.6, 0]} color="#8db8ff" intensity={7} distance={4} />
    </group>
  )
}
