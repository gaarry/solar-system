'use client';

import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';
import { useSolarSystemStore } from '@/lib/store';

export default function PostProcessing() {
  const { quality } = useSolarSystemStore();
  
  const bloomIntensity = quality === 'ultra' ? 1.5 : 1;
  const chromaticOffset = new Vector2(0.0005, 0.0005);
  
  if (quality === 'ultra') {
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
        <ChromaticAberration
          offset={chromaticOffset}
          radialModulation={false}
          modulationOffset={0}
        />
      </EffectComposer>
    );
  }
  
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
    </EffectComposer>
  );
}
