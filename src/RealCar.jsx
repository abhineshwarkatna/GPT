import React, { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function RealCar({ url = '/models/car.glb' }) {
  const group = useRef()
  const { scene } = useGLTF(url)

  useEffect(() => {
    scene.traverse((object) => {
      if (!object.isMesh) return
      object.castShadow = true
      object.receiveShadow = true
      if (object.material) {
        object.material.envMapIntensity = object.material.envMapIntensity ?? 1.4
      }
    })
  }, [scene])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (!group.current) return
    group.current.position.y = Math.sin(t * 0.65) * 0.018
    group.current.rotation.y = Math.sin(t * 0.22) * 0.025
  })

  return (
    <group ref={group} position={[1.15, -1.05, 0.15]} rotation={[0, -0.18, 0]} scale={1.45}>
      <primitive object={scene} />
      <pointLight position={[1.85, 0.6, 0]} color="#8db8ff" intensity={7} distance={4} />
    </group>
  )
}

useGLTF.preload('/models/car.glb')
