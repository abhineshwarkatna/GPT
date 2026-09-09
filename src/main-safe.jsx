import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import './styles.css'

const BLUE = '#1b65ff'
const AMBER = '#ff9f32'

function Car() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.position.y = -1.05 + Math.sin(t * .65) * .018
    ref.current.rotation.y = -.18 + Math.sin(t * .22) * .025
  })
  return <group ref={ref} position={[1.15, -1.05, .15]} rotation={[0, -.18, 0]} scale={1.45}>
    <mesh castShadow><boxGeometry args={[3.55,.62,1.45]} /><meshPhysicalMaterial color="#080b11" metalness={.96} roughness={.14} clearcoat={1} clearcoatRoughness={.08} /></mesh>
    <mesh position={[-.12,.44,0]} castShadow><boxGeometry args={[2.15,.72,1.25]} /><meshPhysicalMaterial color="#0b1018" metalness={.9} roughness={.13} clearcoat={1} /></mesh>
    <mesh position={[-.12,.46,0]}><boxGeometry args={[1.92,.5,1.27]} /><meshPhysicalMaterial color="#14263b" metalness={.18} roughness={.08} transmission={.72} thickness={.08} ior={1.46} /></mesh>
    {[.76,-.76].map(z => <group key={'f'+z} position={[1.2,-.38,z]}><mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.42,.42,.24,32]} /><meshStandardMaterial color="#07090e" metalness={.95} roughness={.18} /></mesh><mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[.29,.05,10,32]} /><meshStandardMaterial color="#b9c4d6" metalness={1} roughness={.13} /></mesh><mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[.35,.018,8,32]} /><meshStandardMaterial color="#ff3328" emissive="#ff1200" emissiveIntensity={1.5} /></mesh></group>)}
    {[-.76,.76].map(z => <group key={'r'+z} position={[-1.2,-.38,z]}><mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.42,.42,.24,32]} /><meshStandardMaterial color="#07090e" metalness={.95} roughness={.18} /></mesh><mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[.29,.05,10,32]} /><meshStandardMaterial color="#b9c4d6" metalness={1} roughness={.13} /></mesh></group>)}
    <mesh position={[1.8,.05,.48]}><boxGeometry args={[.03,.16,.32]} /><meshStandardMaterial color="#dbe9ff" emissive="#b9d7ff" emissiveIntensity={8} /></mesh>
    <mesh position={[1.8,.05,-.48]}><boxGeometry args={[.03,.16,.32]} /><meshStandardMaterial color="#dbe9ff" emissive="#b9d7ff" emissiveIntensity={8} /></mesh>
    <mesh position={[-1.8,.03,.5]}><boxGeometry args={[.03,.15,.3]} /><meshStandardMaterial color="#ff1b14" emissive="#ff1200" emissiveIntensity={5} /></mesh>
    <mesh position={[-1.8,.03,-.5]}><boxGeometry args={[.03,.15,.3]} /><meshStandardMaterial color="#ff1b14" emissive="#ff1200" emissiveIntensity={5} /></mesh>
    <pointLight position={[1.9,.1,0]} color="#8db8ff" intensity={6} distance={4} />
  </group>
}

function City() {
  const buildings = useMemo(() => Array.from({length:28},(_,i)=>({x:-11+(i%14)*1.65,z:-5-Math.floor(i/14)*3.5,h:1+Math.random()*4.2,w:.7+Math.random()*.6})),[])
  return <group>{buildings.map((b,i)=><group key={i} position={[b.x,b.h/2-1.4,b.z]}><mesh><boxGeometry args={[b.w,b.h,.9]} /><meshStandardMaterial color="#0b0f17" metalness={.5} roughness={.55} /></mesh><mesh position={[0,0,.46]}><planeGeometry args={[b.w*.72,b.h*.7]} /><meshBasicMaterial color={i%2?'#315fbb':'#e8a14a'} transparent opacity={.3} /></mesh></group>)}</group>
}

function Background() {
  return <group>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-1.42,0]}><planeGeometry args={[30,22]} /><meshStandardMaterial color="#090b10" metalness={.55} roughness={.2} /></mesh>
    <mesh position={[0,3.8,-8]}><boxGeometry args={[28,8,.25]} /><meshStandardMaterial color="#07090e" roughness={.72} /></mesh>
    {[-5.5,0,5.5].map(x=><mesh key={x} position={[x,1.8,-7.75]}><boxGeometry args={[.08,5.7,.08]} /><meshStandardMaterial color={AMBER} emissive="#ff6d00" emissiveIntensity={2.5} /></mesh>)}
    <mesh position={[0,2.8,-7.6]}><boxGeometry args={[21,.08,.08]} /><meshStandardMaterial color="#d8e5ff" emissive="#6d98ff" emissiveIntensity={2} /></mesh>
  </group>
}

function Helicopter() {
  const ref=useRef()
  useFrame(({clock})=>{if(!ref.current)return;const t=clock.elapsedTime;ref.current.position.x=Math.sin(t*.08)*4.5;ref.current.position.y=3.2+Math.sin(t*.45)*.08})
  return <group ref={ref} position={[2,3.2,-4]} scale={.42}><mesh><sphereGeometry args={[.7,18,12]} /><meshStandardMaterial color="#0b111b" metalness={.85} roughness={.2} /></mesh><mesh position={[0,0,.7]} scale={[1,.7,.5]}><sphereGeometry args={[.52,18,12]} /><meshStandardMaterial color="#263d5a" metalness={.15} roughness={.1} transparent opacity={.72} /></mesh><mesh position={[0,.72,0]}><boxGeometry args={[.08,1.9,.06]} /><meshStandardMaterial color="#111824" metalness={.9} /></mesh><mesh position={[0,1.7,0]} rotation={[0,0,Math.PI/2]}><boxGeometry args={[.06,2.8,.03]} /><meshStandardMaterial color="#171e2b" metalness={.9} /></mesh></group>
}

function Scene({pointer,scroll}) {
  const ref=useRef()
  useFrame(({clock})=>{if(!ref.current)return;const t=clock.elapsedTime;ref.current.rotation.y=THREE.MathUtils.lerp(ref.current.rotation.y,pointer.x*.045,.035);ref.current.rotation.x=THREE.MathUtils.lerp(ref.current.rotation.x,-pointer.y*.025,.035);ref.current.position.y=THREE.MathUtils.lerp(ref.current.position.y,-scroll*.28,.03);ref.current.position.z=THREE.MathUtils.lerp(ref.current.position.z,scroll*1.2,.03);ref.current.rotation.z=Math.sin(t*.12)*.003})
  return <group ref={ref}><Background/><City/><Helicopter/><Car/><Sparkles count={420} scale={[20,10,18]} size={1} speed={.1} opacity={.45} color="#91b9ff"/><Float speed={.7} rotationIntensity={.12} floatIntensity={.08}><mesh position={[-3.9,.4,-2.8]}><boxGeometry args={[1.1,.7,.08]} /><meshStandardMaterial color="#0b1018" metalness={.4} roughness={.35} /></mesh></Float></group>
}

function App(){
  const [pointer,setPointer]=useState({x:0,y:0}); const [scroll,setScroll]=useState(0)
  useEffect(()=>{const move=e=>setPointer({x:(e.clientX/innerWidth-.5)*2,y:(e.clientY/innerHeight-.5)*2});const onScroll=()=>setScroll(Math.min(1,Math.max(0,scrollY/(innerHeight*2))));addEventListener('pointermove',move);addEventListener('scroll',onScroll,{passive:true});onScroll();return()=>{removeEventListener('pointermove',move);removeEventListener('scroll',onScroll)}},[])
  return <main><div className="noise"/><header><div className="brand"><span className="mark">AK</span><span>ABHINESHWAR<br/>KATNA</span></div><nav><a href="#home">Home</a><a href="#about">About</a><a href="#skills">Skills</a><a href="#projects">Projects</a><a href="#experience">Experience</a><a href="#contact">Contact</a></nav><button className="connect">Let's Connect <b>→</b></button></header><aside className="side"><a href="#home">01<br/><span>HOME</span></a><a href="#about">02<br/><span>ABOUT</span></a><a href="#skills">03<br/><span>SKILLS</span></a><a href="#projects">04<br/><span>PROJECTS</span></a><a href="#experience">05<br/><span>EXPERIENCE</span></a><a href="#contact">06<br/><span>CONTACT</span></a></aside><section className="hero" id="home"><div className="scene"><Canvas dpr={[1,1.5]} camera={{position:[0,.2,8.7],fov:43}} gl={{antialias:true,powerPreference:'high-performance'}}><color attach="background" args={['#05070b']}/><fog attach="fog" args={['#05070b',10,24]}/><ambientLight intensity={.45}/><directionalLight position={[4,7,5]} intensity={2.8} color="#e5edff"/><directionalLight position={[-5,2,1]} intensity={2.3} color={BLUE}/><directionalLight position={[3,1,-3]} intensity={2.5} color={AMBER}/><Scene pointer={pointer} scroll={scroll}/><EffectComposer multisampling={0}><Bloom intensity={.6} luminanceThreshold={.72} mipmapBlur/><Vignette eskil={false} offset={.22} darkness={.5}/></EffectComposer></Canvas></div><div className="heroCopy"><div className="eyebrow">ENGINEER × CREATOR × PROBLEM SOLVER</div><h1>BUILDING A<br/><span>BOLDER</span> TOMORROW</h1><p>From code to real-world impact — I design, build, and innovate for a smarter, faster, and more connected future.</p><div className="actions"><button className="primary">View My Work <b>→</b></button><button className="secondary">Explore 3D Scene</button></div></div><div className="quote">DISCIPLINE<br/>BUILDS<br/>FREEDOM<br/><i>—</i></div><div className="social">◉<br/>in<br/>◎<br/>𝕏</div><div className="scrollPrompt">SCROLL TO EXPLORE <span>↓</span></div></section><section className="cards" id="about"><article><b>◇</b><span>3D & Interactive<br/>Experiences</span></article><article><b>ϟ</b><span>Real-world<br/>Problem Solving</span></article><article><b>▱</b><span>Modern<br/>Technologies</span></article><article><b>◎</b><span>Innovation<br/>for a Better Tomorrow</span></article></section><section className="content" id="skills"><small>02 / SKILLS</small><h2>REAL OBJECTS.<br/><em>REAL EXPERIENCES.</em></h2><p>Interactive automotive scenes, cinematic environments, spatial interfaces and production-grade WebGL experiences.</p></section><section className="content" id="projects"><small>03 / PROJECTS</small><h2>CODE THAT<br/><em>LOOKS ALIVE.</em></h2></section><section className="content" id="experience"><small>04 / EXPERIENCE</small><h2>BUILD.<br/><em>SHIP. REPEAT.</em></h2></section><footer id="contact"><span>AK — ABHINESHWAR KATNA</span><span>BUILT FOR THE REAL WORLD — 2026</span></footer></main>
}

createRoot(document.getElementById('root')).render(<App/>)
