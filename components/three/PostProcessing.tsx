'use client';

import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useSolarSystemStore } from '@/lib/store';

export default function PostProcessing() {
  const { quality } = useSolarSystemStore();
  
  const bloomIntensity = quality === 'ultra' ? 1.5 : 1;
  
  return (
    <EffectComposer>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette
        offset={0.3}
        darkness={0.6}
        blendFunction={BlendFunction.NORMAL}
      />
      {quality === 'ultra' && (
        <ChromaticAberration
          offset={[0.0005, 0.0005]}
          blendFunction={BlendFunction.NORMAL}
        />
      )}
    </EffectComposer>
  );
}

