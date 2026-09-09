import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, MeshTransmissionMaterial, Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import './styles.css'

const C = { blue: '#1b65ff', amber: '#ff9f32', white: '#edf3ff' }

function Wheel({ position, steer = 0 }) {
  const ref = useRef()
  useFrame((_, d) => { ref.current.rotation.x -= d * 3.2 })
  return <group position={position} rotation={[0, steer, 0]}>
    <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.42, 0.42, 0.24, 32]} /><meshStandardMaterial color="#07090e" metalness={0.92} roughness={0.2} /></mesh>
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.27, 0.055, 10, 32]} /><meshStandardMaterial color="#151a24" metalness={0.95} roughness={0.15} /></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.17, 0.17, 0.25, 20]} /><meshStandardMaterial color="#b5c0d2" metalness={1} roughness={0.13} /></mesh>
    <mesh position={[0, 0.13, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.34, 0.018, 8, 32]} /><meshStandardMaterial color="#ff3b30" emissive="#ff1500" emissiveIntensity={1.2} /></mesh>
  </group>
}

function Car() {
  const group = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    group.current.position.y = Math.sin(t * 0.65) * 0.018
    group.current.rotation.y = Math.sin(t * 0.22) * 0.025
  })
  return <group ref={group} position={[1.15, -1.05, 0.15]} rotation={[0, -0.18, 0]} scale={1.45}>
    <mesh position={[0, 0.46, 0]} castShadow><boxGeometry args={[3.55, 0.62, 1.45]} /><meshPhysicalMaterial color="#070a10" metalness={0.96} roughness={0.13} clearcoat={1} clearcoatRoughness={0.08} /></mesh>
    <mesh position={[-0.12, 0.9, 0]} rotation={[0, 0, 0]} castShadow><boxGeometry args={[2.15, 0.7, 1.25]} /><meshPhysicalMaterial color="#090d15" metalness={0.9} roughness={0.12} clearcoat={1} /></mesh>
    <mesh position={[-0.12, 0.91, 0]}><boxGeometry args={[1.92, 0.52, 1.28]} /><MeshTransmissionMaterial transmission={0.78} thickness={0.08} roughness={0.08} ior={1.48} color="#15263d" chromaticAberration={0.03} /></mesh>
    <mesh position={[1.79, 0.55, 0]}><boxGeometry args={[0.035, 0.25, 1.02]} /><meshStandardMaterial color="#111827" metalness={1} roughness={0.16} /></mesh>
    <mesh position={[1.82, 0.56, 0.48]}><boxGeometry args={[0.025, 0.14, 0.32]} /><meshStandardMaterial color="#dbe9ff" emissive="#b9d7ff" emissiveIntensity={7} /></mesh>
    <mesh position={[1.82, 0.56, -0.48]}><boxGeometry args={[0.025, 0.14, 0.32]} /><meshStandardMaterial color="#dbe9ff" emissive="#b9d7ff" emissiveIntensity={7} /></mesh>
    <mesh position={[1.835, 0.35, 0]}><boxGeometry args={[0.025, 0.18, 0.85]} /><meshStandardMaterial color="#05070b" metalness={0.7} roughness={0.2} /></mesh>
    <mesh position={[-1.8, 0.52, 0.5]}><boxGeometry args={[0.025, 0.13, 0.3]} /><meshStandardMaterial color="#ff1b14" emissive="#ff1200" emissiveIntensity={4} /></mesh>
    <mesh position={[-1.8, 0.52, -0.5]}><boxGeometry args={[0.025, 0.13, 0.3]} /><meshStandardMaterial color="#ff1b14" emissive="#ff1200" emissiveIntensity={4} /></mesh>
    <mesh position={[0.12, 0.5, 0]}><boxGeometry args={[0.42, 0.035, 1.22]} /><meshStandardMaterial color="#111827" metalness={1} roughness={0.14} /></mesh>
    <mesh position={[1.72, 0.77, 0.7]} rotation={[0.1, 0, 0]}><boxGeometry args={[0.16, 0.1, 0.035]} /><meshStandardMaterial color="#080b10" metalness={1} roughness={0.12} /></mesh>
    <Wheel position={[1.2, 0.08, 0.76]} steer={0.02} /><Wheel position={[1.2, 0.08, -0.76]} steer={0.02} />
    <Wheel position={[-1.2, 0.08, 0.76]} /><Wheel position={[-1.2, 0.08, -0.76]} />
    <pointLight position={[1.85, 0.6, 0]} color="#8db8ff" intensity={7} distance={4} />
  </group>
}

function City() {
  const buildings = useMemo(() => Array.from({ length: 34 }, (_, i) => ({
    x: -12 + (i % 17) * 1.5 + Math.random() * .25,
    z: -5 - Math.floor(i / 17) * 3.2,
    h: 1 + Math.random() * 4.8,
    w: .65 + Math.random() * .65
  })), [])
  return <group>
    {buildings.map((b, i) => <group key={i} position={[b.x, b.h / 2 - 1.4, b.z]}>
      <mesh><boxGeometry args={[b.w, b.h, .9]} /><meshStandardMaterial color={i % 3 ? '#0a0e17' : '#101827'} metalness={.55} roughness={.5} /></mesh>
      <mesh position={[0, 0, .46]}><planeGeometry args={[b.w * .75, b.h * .72]} /><meshBasicMaterial color={i % 2 ? '#315fbb' : '#e8a14a'} transparent opacity={.32} /></mesh>
    </group>)}
  </group>
}

function Bridge() {
  return <group position={[0, -1.18, -7.2]}>
    <mesh><boxGeometry args={[17, .14, .5]} /><meshStandardMaterial color="#202633" metalness={.85} roughness={.3} /></mesh>
    {[-6,-4.5,-3,-1.5,0,1.5,3,4.5,6].map(x => <mesh key={x} position={[x, 1.2, 0]} rotation={[0, 0, x > 0 ? -0.48 : 0.48]}><cylinderGeometry args={[.018, .018, 2.5, 8]} /><meshStandardMaterial color="#677386" metalness={.8} roughness={.3} /></mesh>)}
    <mesh position={[0, .35, 0]}><boxGeometry args={[.22, 2.8, .22]} /><meshStandardMaterial color="#8994a5" metalness={.9} roughness={.25} /></mesh>
  </group>
}

function Helicopter() {
  const ref = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    ref.current.position.x = Math.sin(t * .08) * 4.5
    ref.current.position.y = 3.3 + Math.sin(t * .45) * .08
    ref.current.rotation.z = Math.sin(t * .08) * .03
  })
  return <group ref={ref} position={[2, 3.3, -4]} scale={.45}>
    <mesh><sphereGeometry args={[.7, 20, 12]} /><meshPhysicalMaterial color="#0b111b" metalness={.85} roughness={.18} /></mesh>
    <mesh position={[0, .02, .72]} scale={[1, .7, .5]}><sphereGeometry args={[.52, 20, 12]} /><MeshTransmissionMaterial transmission={.7} roughness={.08} thickness={.05} color="#273c58" /></mesh>
    <mesh position={[0, .72, 0]}><boxGeometry args={[.08, 1.9, .06]} /><meshStandardMaterial color="#111824" metalness={.9} /></mesh>
    <mesh position={[0, 1.7, 0]} rotation={[0, 0, Math.PI / 2]}><boxGeometry args={[.06, 2.8, .03]} /><meshStandardMaterial color="#171e2b" metalness={.9} /></mesh>
    <pointLight color="#c7dcff" intensity={8} distance={5} position={[0, 0, 1]} />
  </group>
}

function Showroom() {
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.42, 0]} receiveShadow><planeGeometry args={[30, 22]} /><meshStandardMaterial color="#090b10" metalness={.55} roughness={.18} /></mesh>
    <mesh position={[0, 3.8, -8]}><boxGeometry args={[28, 8, .25]} /><meshStandardMaterial color="#07090e" metalness={.4} roughness={.7} /></mesh>
    {[-5.5, 0, 5.5].map(x => <mesh key={x} position={[x, 1.9, -7.75]}><boxGeometry args={[.08, 5.8, .08]} /><meshStandardMaterial color="#ff9f32" emissive="#ff6d00" emissiveIntensity={2.5} /></mesh>)}
    <mesh position={[0, 2.8, -7.6]}><boxGeometry args={[21, .08, .08]} /><meshStandardMaterial color="#d8e5ff" emissive="#6d98ff" emissiveIntensity={2} /></mesh>
  </group>
}

function Particles() {
  return <Sparkles count={650} scale={[20, 10, 18]} size={1.15} speed={.12} opacity={.55} color="#91b9ff" />
}

function Scene({ pointer, scroll }) {
  const root = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, pointer.x * .045, .035)
    root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, -pointer.y * .025, .035)
    root.current.position.y = THREE.MathUtils.lerp(root.current.position.y, -scroll * .28, .03)
    root.current.position.z = THREE.MathUtils.lerp(root.current.position.z, scroll * 1.2, .03)
    root.current.rotation.z = Math.sin(t * .12) * .003
  })
  return <group ref={root}>
    <Showroom /><City /><Bridge /><Helicopter /><Car /><Particles />
    <Float speed={.7} rotationIntensity={.12} floatIntensity={.08}><group position={[-3.9, .4, -2.8]}><mesh><boxGeometry args={[1.1, .7, .08]} /><meshStandardMaterial color="#0b1018" metalness={.4} roughness={.35} /></mesh><mesh position={[0, .38, 0]}><boxGeometry args={[1.25, .04, .04]} /><meshStandardMaterial color="#ff9f32" emissive="#ff7200" emissiveIntensity={3} /></mesh></group></Float>
  </group>
}

function App() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [scroll, setScroll] = useState(0)
  useEffect(() => {
    const move = e => setPointer({ x: (e.clientX / innerWidth - .5) * 2, y: (e.clientY / innerHeight - .5) * 2 })
    const onScroll = () => setScroll(Math.min(1, Math.max(0, scrollY / (innerHeight * 2))))
    addEventListener('pointermove', move); addEventListener('scroll', onScroll, { passive: true }); onScroll()
    return () => { removeEventListener('pointermove', move); removeEventListener('scroll', onScroll) }
  }, [])
  return <main>
    <div className="noise" />
    <header><div className="brand"><span className="mark">AK</span><span>ABHINESHWAR<br />KATNA</span></div><nav><a href="#home">Home</a><a href="#about">About</a><a href="#skills">Skills</a><a href="#projects">Projects</a><a href="#experience">Experience</a><a href="#contact">Contact</a></nav><button className="connect">Let's Connect <b>→</b></button></header>
    <aside className="side"><a href="#home">01<br /><span>HOME</span></a><a href="#about">02<br /><span>ABOUT</span></a><a href="#skills">03<br /><span>SKILLS</span></a><a href="#projects">04<br /><span>PROJECTS</span></a><a href="#experience">05<br /><span>EXPERIENCE</span></a><a href="#contact">06<br /><span>CONTACT</span></a></aside>
    <section className="hero" id="home"><div className="scene"><Canvas dpr={[1, 1.8]} camera={{ position: [0, .2, 8.7], fov: 43 }} gl={{ antialias: true, powerPreference: 'high-performance' }} shadows><color attach="background" args={['#05070b']} /><fog attach="fog" args={['#05070b', 10, 24]} /><ambientLight intensity={.28} /><directionalLight position={[4, 7, 5]} intensity={2.6} color="#e5edff" /><directionalLight position={[-5, 2, 1]} intensity={2.5} color={C.blue} /><directionalLight position={[3, 1, -3]} intensity={3} color={C.amber} /><Suspense fallback={null}><Scene pointer={pointer} scroll={scroll} /><Environment preset="night" environmentIntensity={.3} /></Suspense><EffectComposer multisampling={0}><Bloom intensity={.8} luminanceThreshold={.7} mipmapBlur /><ChromaticAberration offset={new THREE.Vector2(.00022, .00012)} /><Vignette eskil={false} offset={.22} darkness={.55} /></EffectComposer></Canvas></div>
      <div className="heroCopy"><div className="eyebrow">ENGINEER × CREATOR × PROBLEM SOLVER</div><h1>BUILDING A<br /><span>BOLDER</span> TOMORROW</h1><p>From code to real-world impact — I design, build, and innovate for a smarter, faster, and more connected future.</p><div className="actions"><button className="primary">View My Work <b>→</b></button><button className="secondary">Explore 3D Scene</button></div></div>
      <div className="quote">DISCIPLINE<br />BUILDS<br />FREEDOM<br /><i>—</i></div><div className="social">◉<br />in<br />◎<br />𝕏</div><div className="scrollPrompt">SCROLL TO EXPLORE <span>↓</span></div>
    </section>
    <section className="cards" id="about"><article><b>◇</b><span>3D & Interactive<br />Experiences</span></article><article><b>ϟ</b><span>Real-world<br />Problem Solving</span></article><article><b>▱</b><span>Modern<br />Technologies</span></article><article><b>◎</b><span>Innovation<br />for a Better Tomorrow</span></article></section>
    <section className="content" id="skills"><small>02 / SKILLS</small><h2>REAL OBJECTS.<br /><em>REAL EXPERIENCES.</em></h2><p>Interactive automotive scenes, cinematic environments, spatial interfaces and production-grade WebGL experiences.</p></section>
    <section className="content" id="projects"><small>03 / PROJECTS</small><h2>CODE THAT<br /><em>LOOKS ALIVE.</em></h2></section>
    <section className="content" id="experience"><small>04 / EXPERIENCE</small><h2>BUILD.<br /><em>SHIP. REPEAT.</em></h2></section>
    <footer id="contact"><span>AK — ABHINESHWAR KATNA</span><span>BUILT FOR THE REAL WORLD — 2026</span></footer>
  </main>
}
createRoot(document.getElementById('root')).render(<App />)
