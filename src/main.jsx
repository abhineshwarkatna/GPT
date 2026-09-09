import React, { Suspense, useMemo, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial, OrbitControls, Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import './styles.css'

const C = { cobalt: '#1769ff', amber: '#ffad36', ice: '#b8d7ff' }

function Particles({ count = 1400 }) {
  const ref = useRef()
  const data = useMemo(() => Array.from({ length: count }, () => ({
    p: new THREE.Vector3((Math.random()-.5)*22, (Math.random()-.5)*14, (Math.random()-.5)*16),
    s: .35 + Math.random()*1.4,
    phase: Math.random()*Math.PI*2
  })), [count])
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const pos = ref.current.geometry.attributes.position.array
    data.forEach((d,i) => {
      const j=i*3
      pos[j]=d.p.x + Math.sin(t*.18+d.phase)*.12
      pos[j+1]=d.p.y + Math.cos(t*.16+d.phase)*.10
      pos[j+2]=d.p.z + Math.sin(t*.11+d.phase)*.16
    })
    ref.current.geometry.attributes.position.needsUpdate=true
  })
  return <points ref={ref} frustumCulled={false}>
    <bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={new Float32Array(data.flatMap(d=>d.p.toArray()))} itemSize={3}/></bufferGeometry>
    <pointsMaterial size={.035} transparent opacity={.65} color="#78aaff" depthWrite={false} blending={THREE.AdditiveBlending}/>
  </points>
}

function GyroRing({ radius, tube, speed, tilt, color, scroll }) {
  const ref=useRef()
  useFrame((state)=>{
    const t=state.clock.elapsedTime
    ref.current.rotation.z=t*speed + scroll*.9
    ref.current.rotation.x=tilt + Math.sin(t*.25)*.08
    ref.current.rotation.y=t*speed*.37 + scroll*.45
  })
  return <mesh ref={ref}>
    <torusGeometry args={[radius,tube,12,96]}/>
    <meshStandardMaterial color={color} metalness={.92} roughness={.16} emissive={color} emissiveIntensity={.22}/>
  </mesh>
}

function Armor({ i, radius=1.72, scroll }) {
  const ref=useRef()
  const a=(i/12)*Math.PI*2
  useFrame((state)=>{
    const t=state.clock.elapsedTime
    const explode=scroll*1.5
    ref.current.position.x=Math.cos(a)*(radius+explode)
    ref.current.position.y=Math.sin(a)*(radius+explode)
    ref.current.position.z=Math.sin(t*.7+a)*.13 + scroll*Math.sin(a)*.45
    ref.current.rotation.z=a+Math.PI/2
    ref.current.rotation.y=t*.18 + a
  })
  return <mesh ref={ref}>
    <boxGeometry args={[.42,.82,.10]}/>
    <MeshTransmissionMaterial backside thickness={.25} roughness={.13} transmission={.92} ior={1.45} chromaticAberration={.055} anisotropy={.35} color="#a9caff"/>
  </mesh>
}

function Orb({ scroll }) {
  const core=useRef()
  useFrame((state)=>{
    const t=state.clock.elapsedTime
    core.current.position.y=Math.sin(t*.85)*.16-scroll*.35
    core.current.rotation.x=t*.3+scroll
    core.current.rotation.y=t*.5
  })
  return <Float speed={1.25} rotationIntensity={.18} floatIntensity={.35}>
    <group>
      <mesh ref={core}>
        <icosahedronGeometry args={[.72,4]}/>
        <meshPhysicalMaterial color="#07111f" metalness={.85} roughness={.12} emissive={C.cobalt} emissiveIntensity={2.8} clearcoat={1}/>
      </mesh>
      <pointLight color={C.cobalt} intensity={6} distance={5}/>
      <pointLight color={C.amber} intensity={3.5} distance={4} position={[1.7,-1.2,1.3]}/>
      <GyroRing radius={1.05} tube={.045} speed={.72} tilt={.35} color={C.cobalt} scroll={scroll}/>
      <GyroRing radius={1.32} tube={.032} speed={-.48} tilt={1.1} color={C.ice} scroll={scroll}/>
      <GyroRing radius={1.56} tube={.028} speed={.31} tilt={-.7} color={C.amber} scroll={scroll}/>
      <GyroRing radius={1.84} tube={.022} speed={-.21} tilt={.15} color="#6d8cff" scroll={scroll}/>
      {Array.from({length:12},(_,i)=><Armor key={i} i={i} scroll={scroll}/>) }
    </group>
  </Float>
}

function Scene({ pointer, scroll }) {
  const group=useRef()
  useFrame((state)=>{
    const t=state.clock.elapsedTime
    group.current.rotation.y=THREE.MathUtils.lerp(group.current.rotation.y,pointer.x*.22, .045)
    group.current.rotation.x=THREE.MathUtils.lerp(group.current.rotation.x,-pointer.y*.16, .045)
    group.current.position.y=THREE.MathUtils.lerp(group.current.position.y,-scroll*.9,.035)
    group.current.position.z=THREE.MathUtils.lerp(group.current.position.z,-scroll*.8,.035)
  })
  return <group ref={group}>
    <Orb scroll={scroll}/>
    <Sparkles count={120} scale={[12,8,8]} size={1.5} speed={.18} color="#7da7ff"/>
    <Particles/>
  </group>
}

function App(){
  const [pointer,setPointer]=React.useState({x:0,y:0})
  const [scroll,setScroll]=React.useState(0)
  React.useEffect(()=>{
    const move=e=>setPointer({x:(e.clientX/innerWidth-.5)*2,y:(e.clientY/innerHeight-.5)*2})
    const wheel=()=>setScroll(Math.min(1,Math.max(0,scrollY/(innerHeight*2))))
    addEventListener('pointermove',move); addEventListener('scroll',wheel,{passive:true}); wheel()
    return()=>{removeEventListener('pointermove',move);removeEventListener('scroll',wheel)}
  },[])
  return <main>
    <div className="noise"/>
    <header><div className="brand"><span className="dot"/>Q/ORBIT</div><nav><a href="#system">SYSTEM</a><a href="#architecture">ARCHITECTURE</a><a href="#contact">CONNECT</a></nav><button className="mini">ENTER ↗</button></header>
    <section className="hero" id="system">
      <div className="copy"><div className="eyebrow">// QUANTUM ENGINE 09</div><h1>ENGINEERED<br/><em>BEYOND</em><br/>REALITY.</h1><p>A cinematic interface for the next generation of intelligent machines. Precision geometry, living materials and responsive spatial computing.</p><div className="actions"><button className="primary">EXPLORE SYSTEM <span>→</span></button><button className="ghost">WATCH FILM</button></div></div>
      <div className="scene"><Canvas dpr={[1,2]} camera={{position:[0,0,7],fov:42}} gl={{antialias:true,powerPreference:'high-performance'}}><color attach="background" args={['#07080d']}/><ambientLight intensity={.18}/><directionalLight position={[4,5,4]} intensity={2.2} color="#dbe8ff"/><directionalLight position={[-4,1,2]} intensity={2.5} color={C.cobalt}/><directionalLight position={[2,-3,-2]} intensity={2.1} color={C.amber}/><Suspense fallback={null}><Scene pointer={pointer} scroll={scroll}/></Suspense><EffectComposer multisampling={0}><Bloom intensity={1.25} luminanceThreshold={.55} mipmapBlur/><ChromaticAberration offset={new THREE.Vector2(.00035,.0002)} radialModulation={false}/><Vignette eskil={false} offset={.18} darkness={.72}/></EffectComposer><OrbitControls enableZoom={false} enablePan={false} enableRotate={false}/></Canvas></div>
      <div className="hud hud-a"><span>CORE TEMP</span><b>27.4°C</b></div><div className="hud hud-b"><span>FIELD STATUS</span><b><i/> STABLE</b></div><div className="scroll">SCROLL TO DECONSTRUCT <span>↓</span></div>
    </section>
    <section className="lower" id="architecture"><div><small>01 / ARCHITECTURE</small><h2>FORM FOLLOWS<br/><em>ENERGY.</em></h2></div><p>Every surface is built to react. Scroll through the assembly and watch the machine separate into its constituent systems.</p></section>
    <footer id="contact"><span>Q/ORBIT — 2026</span><span>BUILT FOR THE UNREAL</span></footer>
  </main>
}
createRoot(document.getElementById('root')).render(<App/>)
