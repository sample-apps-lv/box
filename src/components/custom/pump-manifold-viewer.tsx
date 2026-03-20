import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Center } from '@react-three/drei';
import * as THREE from 'three';
import { UploadCloud, Loader2, FileBox } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// @ts-ignore - occt-import-js lacks official TS types
import initOpenCascade from 'occt-import-js';

export default function PumpManifoldViewer() {
  const [modelGeometry, setModelGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>("Pump Manifold v3.step");

  const processStepFile = async (fileBuffer: ArrayBuffer) => {
    setIsProcessing(true);
    try {
      // THE SILVER BULLET FIX: Load the WebAssembly parser directly from a public CDN
      // This bypasses Vite's strict MIME type and local pathing rules entirely.
      const occt = await initOpenCascade({
        // This tells the app to look directly in your Vite 'public' folder
        locateFile: () => "/occt-import-js.wasm",
      });

      const result = occt.ReadStepFile(new Uint8Array(fileBuffer), null);
      
      const combinedGeometry = new THREE.BufferGeometry();
      const positions: number[] = [];
      const normals: number[] = [];
      const indices: number[] = [];
      
      let indexOffset = 0;

      for (const mesh of result.meshes) {
        positions.push(...mesh.attributes.position.array);
        normals.push(...mesh.attributes.normal.array);
        
        for (let i = 0; i < mesh.index.array.length; i++) {
          indices.push(mesh.index.array[i] + indexOffset);
        }
        indexOffset += mesh.attributes.position.array.length / 3;
      }

      combinedGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      combinedGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
      combinedGeometry.setIndex(indices);
      combinedGeometry.computeBoundingSphere();

      setModelGeometry(combinedGeometry);
    } catch (error) {
      console.error("Failed to parse STEP file:", error);
      alert("Error parsing the Pump Manifold file. Is it a valid STEP format?");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        processStepFile(e.target.result as ArrayBuffer);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-slate-200">
      <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <FileBox className="w-6 h-6 text-blue-600" />
          {fileName} Viewer
        </CardTitle>
        <label>
          <Button asChild variant="outline" size="sm" disabled={isProcessing}>
            <span>Upload New Version</span>
          </Button>
          <input 
            type="file" 
            accept=".step,.stp" 
            className="hidden" 
            onChange={handleFileUpload} 
          />
        </label>
      </CardHeader>
      
      <CardContent className="p-0 relative">
        {isProcessing && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <h3 className="text-lg font-medium text-slate-800">Parsing CAD Data...</h3>
            <p className="text-sm text-slate-500">Converting mathematical surfaces to polygons from CDN</p>
          </div>
        )}

        {!modelGeometry && !isProcessing ? (
          <div className="flex flex-col items-center justify-center h-[500px] border-2 border-dashed border-slate-300 m-4 rounded-xl bg-slate-50">
            <UploadCloud className="w-16 h-16 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-1">Load Pump Manifold v3.step</h3>
            <p className="text-sm text-slate-500">Please upload the file to begin rendering</p>
          </div>
        ) : (
          <div className="h-[600px] w-full bg-slate-900 cursor-move">
            <Canvas shadows >
              <Stage environment="apartment" intensity={0.8} castShadow={false}>
                <Center>
                  {modelGeometry && (
                    <mesh geometry={modelGeometry}>
                      <meshStandardMaterial 
                        color="#8a929e" 
                        roughness={0.4} 
                        metalness={0.7} 
                        side={THREE.DoubleSide}
                      />
                    </mesh>
                  )}
                </Center>
              </Stage>
              <OrbitControls makeDefault autoRotate autoRotateSpeed={1.5} />
            </Canvas>
          </div>
        )}
      </CardContent>
    </Card>
  );
}








// import React, { useState } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, Stage, Center } from '@react-three/drei';
// import * as THREE from 'three';
// import { UploadCloud, Loader2, FileBox } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';

// // @ts-ignore
// import initOpenCascade from 'occt-import-js';
// // THE MAGIC FIX: Tell Vite to automatically bundle the WASM file and give us the URL
// // @ts-ignore
// import wasmUrl from 'occt-import-js/dist/occt-import-js.wasm?url';

// export default function PumpManifoldViewer() {
//   const [modelGeometry, setModelGeometry] = useState<THREE.BufferGeometry | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [fileName, setFileName] = useState<string>("Pump Manifold v3.step");

//   const processStepFile = async (fileBuffer: ArrayBuffer) => {
//     setIsProcessing(true);
//     try {
//       // THE MAGIC FIX: Feed the Vite-generated URL directly into the parser
//       const occt = await initOpenCascade({
//         locateFile: () => wasmUrl, 
//       });

//       const result = occt.ReadStepFile(new Uint8Array(fileBuffer), null);
      
//       const combinedGeometry = new THREE.BufferGeometry();
//       const positions: number[] = [];
//       const normals: number[] = [];
//       const indices: number[] = [];
      
//       let indexOffset = 0;

//       for (const mesh of result.meshes) {
//         positions.push(...mesh.attributes.position.array);
//         normals.push(...mesh.attributes.normal.array);
        
//         for (let i = 0; i < mesh.index.array.length; i++) {
//           indices.push(mesh.index.array[i] + indexOffset);
//         }
//         indexOffset += mesh.attributes.position.array.length / 3;
//       }

//       combinedGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
//       combinedGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
//       combinedGeometry.setIndex(indices);
//       combinedGeometry.computeBoundingSphere();

//       setModelGeometry(combinedGeometry);
//     } catch (error) {
//       console.error("Failed to parse STEP file:", error);
//       alert("Error parsing the Pump Manifold file. Is it a valid STEP format?");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (!files || files.length === 0) return;

//     const file = files[0];
//     setFileName(file.name);
    
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       if (e.target && e.target.result) {
//         processStepFile(e.target.result as ArrayBuffer);
//       }
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   return (
//     <Card className="w-full max-w-4xl mx-auto shadow-lg border-slate-200">
//       <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between">
//         <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
//           <FileBox className="w-6 h-6 text-blue-600" />
//           {fileName} Viewer
//         </CardTitle>
//         <label>
//           <Button asChild variant="outline" size="sm" disabled={isProcessing}>
//             <span>Upload New Version</span>
//           </Button>
//           <input 
//             type="file" 
//             accept=".step,.stp" 
//             className="hidden" 
//             onChange={handleFileUpload} 
//           />
//         </label>
//       </CardHeader>
      
//       <CardContent className="p-0 relative">
//         {isProcessing && (
//           <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
//             <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
//             <h3 className="text-lg font-medium text-slate-800">Parsing CAD Data...</h3>
//             <p className="text-sm text-slate-500">Converting mathematical surfaces to polygons</p>
//           </div>
//         )}

//         {!modelGeometry && !isProcessing ? (
//           <div className="flex flex-col items-center justify-center h-[500px] border-2 border-dashed border-slate-300 m-4 rounded-xl bg-slate-50">
//             <UploadCloud className="w-16 h-16 text-slate-400 mb-4" />
//             <h3 className="text-lg font-medium text-slate-700 mb-1">Load Pump Manifold v3.step</h3>
//             <p className="text-sm text-slate-500">Please upload the file to begin rendering</p>
//           </div>
//         ) : (
//           <div className="h-[600px] w-full bg-slate-900 cursor-move">
//             {/* UNCOMMENTED AND FIXED: The Canvas will now render the model properly! */}
//             <Canvas shadows camera={{ position:, fov: 45 }}>
//               <Stage environment="apartment" intensity={0.8} castShadow={false}>
//                 <Center>
//                   {modelGeometry && (
//                     <mesh geometry={modelGeometry}>
//                       <meshStandardMaterial 
//                         color="#8a929e" 
//                         roughness={0.4} 
//                         metalness={0.7} 
//                         side={THREE.DoubleSide}
//                       />
//                     </mesh>
//                   )}
//                 </Center>
//               </Stage>
//               <OrbitControls makeDefault autoRotate autoRotateSpeed={1.5} />
//             </Canvas>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }








// import React, { useState } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, Stage, Center } from '@react-three/drei';
// import * as THREE from 'three';
// import initOpenCascade from 'occt-import-js';
// import { UploadCloud, Loader2, FileBox } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';

// export default function PumpManifoldViewer() {
//   const [modelGeometry, setModelGeometry] = useState<THREE.BufferGeometry | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [fileName, setFileName] = useState<string>("Pump Manifold v3.step");

//   // The core function that uses WebAssembly to parse the STEP file
//   const processStepFile = async (fileBuffer: ArrayBuffer) => {
//     setIsProcessing(true);
//     try {
//       // 1. Initialize the OpenCASCADE WebAssembly engine
//       const occt = await initOpenCascade({
//         locateFile: (path: string) => `/${path}`, // Assumes occt-import-js.wasm is in your public/ folder
//       });

//       // 2. Read the STEP file from memory
//       const result = occt.ReadStepFile(new Uint8Array(fileBuffer), null);
      
//       // 3. Convert OpenCASCADE meshes into Three.js BufferGeometry
//       const combinedGeometry = new THREE.BufferGeometry();
//       const positions: number[] = [];
//       const normals: number[] = [];
//       const indices: number[] = [];
      
//       let indexOffset = 0;

//       // STEP files often contain multiple solid bodies/meshes. We merge them.
//       for (const mesh of result.meshes) {
//         positions.push(...mesh.attributes.position.array);
//         normals.push(...mesh.attributes.normal.array);
        
//         for (let i = 0; i < mesh.index.array.length; i++) {
//           indices.push(mesh.index.array[i] + indexOffset);
//         }
//         indexOffset += mesh.attributes.position.array.length / 3;
//       }

//       combinedGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
//       combinedGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
//       combinedGeometry.setIndex(indices);
//       combinedGeometry.computeBoundingSphere();

//       setModelGeometry(combinedGeometry);
//     } catch (error) {
//       console.error("Failed to parse STEP file:", error);
//       alert("Error parsing the Pump Manifold file. Is it a valid STEP format?");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     // FIXED: Added to correctly extract the first file from the FileList
//     const file = event.target.files?.item; 
//     if (!file) return;

//     setFileName(file.name);
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       if (e.target?.result) {
//         processStepFile(e.target.result as ArrayBuffer);
//       }
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   return (
//     <Card className="w-full max-w-4xl mx-auto shadow-lg border-slate-200">
//       <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between">
//         <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
//           <FileBox className="w-6 h-6 text-blue-600" />
//           {fileName} Viewer
//         </CardTitle>
//         <label>
//           <Button asChild variant="outline" size="sm" disabled={isProcessing}>
//             <span>Upload New Version</span>
//           </Button>
//           <input 
//             type="file" 
//             accept=".step,.stp" 
//             className="hidden" 
//             onChange={handleFileUpload} 
//           />
//         </label>
//       </CardHeader>
      
//       <CardContent className="p-0 relative">
//         {isProcessing && (
//           <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
//             <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
//             <h3 className="text-lg font-medium text-slate-800">Parsing CAD Data...</h3>
//             <p className="text-sm text-slate-500">Converting mathematical surfaces to polygons</p>
//           </div>
//         )}

//         {!modelGeometry && !isProcessing ? (
//           <div className="flex flex-col items-center justify-center h-[500px] border-2 border-dashed border-slate-300 m-4 rounded-xl bg-slate-50">
//             <UploadCloud className="w-16 h-16 text-slate-400 mb-4" />
//             <h3 className="text-lg font-medium text-slate-700 mb-1">Load Pump Manifold v3.step</h3>
//             <p className="text-sm text-slate-500">Please upload the file to begin rendering</p>
//           </div>
//         ) : (
//           <div className="h-[600px] w-full bg-slate-900 cursor-move">
//             {/* FIXED: Added array brackets around the position values */}
//             <Canvas shadows camera={{ position: 1, fov: 45 }}>
//               <Stage environment="apartment" intensity={0.8} castShadow={false}>
//                 <Center>
//                   {modelGeometry && (
//                     <mesh geometry={modelGeometry}>
//                       <meshStandardMaterial 
//                         color="#8a929e" 
//                         roughness={0.4} 
//                         metalness={0.7} 
//                         side={THREE.DoubleSide}
//                       />
//                     </mesh>
//                   )}
//                 </Center>
//               </Stage>
//               <OrbitControls makeDefault autoRotate autoRotateSpeed={1.5} />
//             </Canvas>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }