// apps/mobile/components/islandTheme.js

// 1) 기본 테마 (현재 화면에 보이는 값과 최대한 맞춤)
export const defaultTheme = {
  sky: {
    top: '#9FD1FF',
    bottom: '#9FD1FF',
    cloudColor: '#FFFFFF',
    cloudSpeed: 0.6,      // 0.1~3.0 권장
    cloudShape: 'fluffy', // placeholder (향후 모양 스위치)
  },
  sea: {
    top: '#6EC9FF',
    bottom: '#4FA9F3',
    waveAmplitude: 8,     // 0~20 px
    waveSpeed: 1.0,       // 0.1~3.0
  },
  island: {
    baseColor: '#EFD8A6', // 모래/땅
    rockColor: '#9BA3AF',
  },
  palm: {
    trunkColor: '#7B4F2B',
    leafColor: '#2FA067',
    sway: 10,    // 흔들림 각도 (deg)
    size: 1.0,   // 0.6~1.6 배
    leafCount: 5 // 사용 중인 SVG 잎 수에 맞춰 clamp
  },
};

// 2) 안전한 숫자 범위 보정
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// 3) AI가 주는 키(대문자/플랫) → 내부 스키마로 매핑
//   - 둘 다 지원: (a) 평문 키 "SKYCOLOR_TOP", (b) 구조형 { sky: { top: ... } }
export function normalizeThemeInput(ai) {
  if (!ai || typeof ai !== 'object') return {};

  // 구조형이면 거의 그대로 받되, 숫자 범위 보정만
  const hasStructured =
    ai.sky || ai.sea || ai.island || ai.palm;

  const out = {};

  if (hasStructured) {
    if (ai.sky) {
      out.sky = {
        top: ai.sky.colorTop ?? ai.sky.top ?? undefined,
        bottom: ai.sky.colorBottom ?? ai.sky.bottom ?? undefined,
        cloudColor: ai.sky.cloudColor ?? undefined,
        cloudSpeed: ai.sky.cloudSpeed != null ? clamp(Number(ai.sky.cloudSpeed), 0.1, 3.0) : undefined,
        cloudShape: ai.sky.cloudShape ?? undefined,
      };
    }
    if (ai.sea) {
      out.sea = {
        top: ai.sea.colorTop ?? ai.sea.top ?? undefined,
        bottom: ai.sea.colorBottom ?? ai.sea.bottom ?? undefined,
        waveAmplitude: ai.sea.waveAmplitude != null ? clamp(Number(ai.sea.waveAmplitude), 0, 20) : undefined,
        waveSpeed: ai.sea.waveSpeed != null ? clamp(Number(ai.sea.waveSpeed), 0.1, 3.0) : undefined,
      };
    }
    if (ai.island) {
      out.island = {
        baseColor: ai.island.baseColor ?? undefined,
        rockColor: ai.island.rockColor ?? undefined,
      };
    }
    if (ai.palm) {
      out.palm = {
        trunkColor: ai.palm.trunkColor ?? undefined,
        leafColor: ai.palm.leafColor ?? undefined,
        sway: ai.palm.sway != null ? clamp(Number(ai.palm.sway), 0, 25) : undefined,
        size: ai.palm.size != null ? clamp(Number(ai.palm.size), 0.6, 1.6) : undefined,
        leafCount: ai.palm.leafCount != null ? clamp(Number(ai.palm.leafCount), 1, 8) : undefined,
      };
    }
    return out;
  }

  // 평문(플랫) 키 스타일 지원: SKYCOLOR, SKY_TOP, CLOUD_SPEED, SEA_WAVE_SPEED 등
  const k = (name) => ai[name] ?? ai[name.toLowerCase()];
  const skyTop   = k('SKY_TOP')   ?? k('SKYCOLOR_TOP')   ?? k('SKYCOLOR');
  const skyBot   = k('SKY_BOTTOM')?? k('SKYCOLOR_BOTTOM');
  const cloudCol = k('CLOUD_COLOR');
  const cloudSpd = k('CLOUD_SPEED');

  const seaTop   = k('SEA_TOP')   ?? k('SEACOLOR_TOP');
  const seaBot   = k('SEA_BOTTOM')?? k('SEACOLOR_BOTTOM');
  const waveAmp  = k('WAVE_AMPLITUDE') ?? k('WAVE_SIZE');
  const waveSpd  = k('WAVE_SPEED');

  const islandBase = k('ISLAND_COLOR') ?? k('ISLAND_BASE');
  const rockColor  = k('ROCK_COLOR');

  const trunkCol = k('PALM_TRUNK_COLOR');
  const leafCol  = k('PALM_LEAF_COLOR');
  const sway     = k('PALM_SWAY');
  const size     = k('PALM_SIZE');
  const leafCnt  = k('PALM_LEAF_COUNT');

  if (skyTop || skyBot || cloudCol || cloudSpd) {
    out.sky = {
      top: skyTop ?? undefined,
      bottom: skyBot ?? undefined,
      cloudColor: cloudCol ?? undefined,
      cloudSpeed: cloudSpd != null ? clamp(Number(cloudSpd), 0.1, 3.0) : undefined,
    };
  }
  if (seaTop || seaBot || waveAmp || waveSpd) {
    out.sea = {
      top: seaTop ?? undefined,
      bottom: seaBot ?? undefined,
      waveAmplitude: waveAmp != null ? clamp(Number(waveAmp), 0, 20) : undefined,
      waveSpeed: waveSpd != null ? clamp(Number(waveSpd), 0.1, 3.0) : undefined,
    };
  }
  if (islandBase || rockColor) {
    out.island = {
      baseColor: islandBase ?? undefined,
      rockColor: rockColor ?? undefined,
    };
  }
  if (trunkCol || leafCol || sway || size || leafCnt) {
    out.palm = {
      trunkColor: trunkCol ?? undefined,
      leafColor: leafCol ?? undefined,
      sway: sway != null ? clamp(Number(sway), 0, 25) : undefined,
      size: size != null ? clamp(Number(size), 0.6, 1.6) : undefined,
      leafCount: leafCnt != null ? clamp(Number(leafCnt), 1, 8) : undefined,
    };
  }
  return out;
}

// 4) 딥 머지: 부분 업데이트만 들어와도 기존 테마 위에 안전하게 덮기
export function mergeTheme(base, patch) {
  const out = JSON.parse(JSON.stringify(base));
  ['sky','sea','island','palm'].forEach(section => {
    if (patch[section]) {
      out[section] = { ...out[section], ...Object.fromEntries(
        Object.entries(patch[section]).filter(([,v]) => v !== undefined && v !== null)
      )};
    }
  });
  return out;
}
