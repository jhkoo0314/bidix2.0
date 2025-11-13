# lib 폴더 파일명 대소문자 규칙

## 📋 규칙 요약

**모든 파일명은 소문자로 통일합니다.**

## 📁 디렉토리별 파일명 패턴

### ✅ engines/
모든 파일명: **소문자**
- `auctionengine.ts`
- `costengine.ts`
- `courtdocslayer.ts`
- `profitengine.ts`
- `propertyengine.ts`
- `rightsengine.ts`
- `scoreengine.ts`
- `valuationengine.ts`

### ✅ generators/
모든 파일명: **소문자**
- `courtdocsmocker.ts`
- `datasetpresets.ts`
- `generatorhelpers.ts`
- `propertygenerator.ts`
- `simulationgenerator.ts` ⚠️ (주의: 대문자 S로 import하면 안 됨)

### ✅ types/
모든 파일명: **소문자**
- `cost.ts`
- `courtdocs.ts`
- `index.ts`
- `profit.ts`
- `property.ts` ⚠️ (주의: 대문자 P로 import하면 안 됨)
- `result.ts`
- `rights.ts`
- `valuation.ts`

### ✅ services/
모든 파일명: **소문자**
- `simulationservice.ts`

### ✅ policy/
모든 파일명: **소문자**
- `defaultpolicy.ts`
- `difficultypolicy.ts`
- `index.ts`
- `policy.ts`
- `rightspolicy.ts`

### ✅ utils/
모든 파일명: **소문자**
- `number.ts`

### ✅ supabase/
모든 파일명: **소문자** (kebab-case 허용)
- `clerk-client.ts`
- `client.ts`
- `server.ts`
- `service-role.ts`

## ⚠️ 주의사항

### 1. Windows vs Linux 대소문자 구분
- **Windows**: 대소문자를 구분하지 않음 (로컬에서는 작동할 수 있음)
- **Linux/Vercel**: 대소문자를 엄격히 구분함 (배포 시 에러 발생)

### 2. Import 경로는 반드시 실제 파일명과 일치해야 함

```typescript
// ❌ 잘못된 예 (대문자 사용)
import { generateSimulationScenario } from "@/lib/generators/Simulationgenerator";
import { Property } from "@/lib/types/Property";

// ✅ 올바른 예 (소문자 사용)
import { generateSimulationScenario } from "@/lib/generators/simulationgenerator";
import { Property } from "@/lib/types/property";
```

### 3. Barrel Export (index.ts) 사용 시

`lib/types/index.ts`에서:
```typescript
// ✅ 올바른 export
export * from "./property";  // 소문자
export * from "./valuation";
```

## 🔍 검증 방법

새로운 파일을 추가하거나 import를 작성할 때:
1. 파일명이 모두 소문자인지 확인
2. Import 경로가 실제 파일명과 정확히 일치하는지 확인
3. Vercel 배포 전 빌드 테스트 수행

## 📝 예외 사항

- `supabase/` 폴더의 경우 kebab-case (`clerk-client.ts`, `service-role.ts`) 허용
- 나머지 모든 파일은 소문자만 사용

