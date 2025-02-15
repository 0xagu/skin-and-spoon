import { Canvas } from "@react-three/fiber";
import { useGLTF, PresentationControls, ContactShadows, Environment } from "@react-three/drei";

const interactiveBackground = () => {

    function ModelBg(props) {
        const { nodes, materials } = useGLTF('/models/shin-ramyun.glb')
        return (
          <group {...props} dispose={null}>
            <mesh 
              geometry={nodes?.defaultMaterial_2.geometry} 
              material={materials.initialShadingGroup_1001}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <mesh 
              castShadow 
              receiveShadow 
              geometry={nodes.defaultMaterial.geometry} 
              material={materials.initialShadingGroup_1001} 
              rotation={[Math.PI / 2, 0, 0]}
            />
          </group>
        )
      }
      
    return (
        <Canvas
            shadows
            camera={{
                position: [0, 0, 10],
                fov: 25
            }}
            style={{
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 0,
            }}
        >
            <ambientLight intensity={0.1} />
            <PresentationControls
                global
                config={{ mass: 2, tension: 500 }}
                snap={{ mass: 4, tension: 1500 }}
                rotation={[0, -1, 0]}
                polar={[-Math.PI / 10, 0]}
                azimuth={[-Math.PI / 0.5, Math.PI / 0.5]}
            >
                <ModelBg 
                    rotation={[-Math.PI / 2, 0, 0]} 
                    position={[4, -1, 0]} 
                    scale={0.006} 
                />
            </PresentationControls>
            <ContactShadows 
                position={[0, -1.4, 0]} 
                opacity={0.75} 
                scale={10} 
                blur={4} 
                far={4}
            />
            <Environment preset="apartment" />
        </Canvas>
    );
};

export default interactiveBackground;