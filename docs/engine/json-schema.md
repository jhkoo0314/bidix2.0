

**Version:** v2.2
**Last Updated:** 2025-11-13
**Status:** 🔄 완전 업데이트 (FMV·ExitPrice 3/6/12, Multi-Cost, ProfitScenario 구조 포함)

---

# 📌 **1. 개요**

본 문서는 `AuctionAnalysisResult` 전체 결과를 JSON Schema(Draft 2020-12)로 정의하는 **SSOT(Single Source of Truth)**이다.

**주요 반영 내용(v2.2):**

* ExitPrice → **3m/6m/12m 3종 구조**
* CostEngine → **보유기간별 totalCost 제공**
* ProfitEngine → **ProfitScenario 객체 구조 (3m/6m/12m 키)**
* Summary → **bestHoldingPeriod / bestScenario 추가**
* Valuation → **recommendedBidRange / exitPrices / confidence 강화**
* CourtDocsNormalized → 변경 없음(유지)

---

# 🧩 **2. JSON Schema – v2.2 정식 버전**

```json
{
  "$id": "https://bidix.ai/schemas/auction-v2.2.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "AuctionAnalysisResult (v2.2)",
  "type": "object",

  "required": [
    "property",
    "valuation",
    "rights",
    "costs",
    "profit",
    "courtDocs",
    "summary"
  ],

  "properties": {
    "property": { "$ref": "#/$defs/Property" },
    "valuation": { "$ref": "#/$defs/Valuation" },
    "rights": { "$ref": "#/$defs/Rights" },
    "costs": { "$ref": "#/$defs/Costs" },
    "profit": { "$ref": "#/$defs/Profit" },
    "courtDocs": { "$ref": "#/$defs/CourtDocsNormalized" },
    "summary": { "$ref": "#/$defs/AuctionSummary" }
  },

  "$defs": {
    "Property": {
      "type": "object",
      "required": [
        "id",
        "category",
        "type",
        "sizeM2",
        "landSizeM2",
        "yearBuilt",
        "floorInfo",
        "buildingUse",
        "address",
        "difficulty",
        "auctionStep",
        "appraisalValue"
      ],
      "properties": {
        "id": { "type": "string" },
        "category": { "type": "string", "enum": ["residential", "commercial"] },
        "type": { "type": "string" },
        "sizeM2": { "type": "number" },
        "landSizeM2": { "type": "number" },
        "yearBuilt": { "type": ["integer", "null"] },
        "floorInfo": {
          "type": "object",
          "properties": {
            "total": { "type": "integer" },
            "current": { "type": "integer" }
          },
          "required": ["total", "current"]
        },
        "buildingUse": { "type": "string" },
        "address": { "type": "string" },
        "auctionStep": { "type": "integer" },
        "difficulty": {
          "type": "string",
          "enum": ["easy", "normal", "hard"]
        },
        "appraisalValue": { "type": "number" }
      },
      "additionalProperties": false
    },

    "Valuation": {
      "type": "object",
      "required": [
        "appraisalValue",
        "baseFMV",
        "adjustedFMV",
        "minBid",
        "exitPrice_3m",
        "exitPrice_6m",
        "exitPrice_12m",
        "recommendedBidRange",
        "confidence"
      ],
      "properties": {
        "appraisalValue": { "type": "number" },
        "baseFMV": { "type": "number" },
        "adjustedFMV": { "type": "number" },
        "minBid": { "type": "number" },
        "exitPrice_3m": { "type": "number" },
        "exitPrice_6m": { "type": "number" },
        "exitPrice_12m": { "type": "number" },
        "recommendedBidRange": {
          "type": "object",
          "properties": {
            "min": { "type": "number" },
            "max": { "type": "number" }
          },
          "required": ["min", "max"]
        },
        "confidence": { "type": "number" }
      },
      "additionalProperties": false
    },

    "Rights": {
      "type": "object",
      "required": [
        "assumableRightsTotal",
        "evictionCostEstimated",
        "evictionRisk"
      ],
      "properties": {
        "assumableRightsTotal": { "type": "number" },
        "evictionCostEstimated": { "type": "number" },
        "evictionRisk": { "type": "number" }
      },
      "additionalProperties": false
    },

    "Costs": {
      "type": "object",
      "required": [
        "totalAcquisition",
        "loanPrincipal",
        "ownCash",
        "totalCost_3m",
        "totalCost_6m",
        "totalCost_12m"
      ],
      "properties": {
        "totalAcquisition": { "type": "number" },
        "loanPrincipal": { "type": "number" },
        "ownCash": { "type": "number" },

        "holdingCost_3m": { "type": "number" },
        "holdingCost_6m": { "type": "number" },
        "holdingCost_12m": { "type": "number" },

        "interestCost_3m": { "type": "number" },
        "interestCost_6m": { "type": "number" },
        "interestCost_12m": { "type": "number" },

        "totalCost_3m": { "type": "number" },
        "totalCost_6m": { "type": "number" },
        "totalCost_12m": { "type": "number" }
      },
      "additionalProperties": false
    },

    "ProfitScenario": {
      "type": "object",
      "required": [
        "months",
        "exitPrice",
        "totalCost",
        "netProfit",
        "roi",
        "annualizedRoi",
        "projectedProfitMargin",
        "meetsTargetMargin",
        "meetsTargetROI"
      ],
      "properties": {
        "months": { "type": "integer", "enum": [3, 6, 12] },
        "exitPrice": { "type": "number" },
        "totalCost": { "type": "number" },
        "netProfit": { "type": "number" },
        "roi": { "type": "number" },
        "annualizedRoi": { "type": "number" },
        "projectedProfitMargin": { "type": "number" },
        "meetsTargetMargin": { "type": "boolean" },
        "meetsTargetROI": { "type": "boolean" }
      },
      "additionalProperties": false
    },

    "Profit": {
      "type": "object",
      "required": [
        "initialSafetyMargin",
        "scenarios",
        "breakevenExit_3m",
        "breakevenExit_6m",
        "breakevenExit_12m"
      ],
      "properties": {
        "initialSafetyMargin": { "type": "number" },
        "scenarios": {
          "type": "object",
          "required": ["3m", "6m", "12m"],
          "properties": {
            "3m": { "$ref": "#/$defs/ProfitScenario" },
            "6m": { "$ref": "#/$defs/ProfitScenario" },
            "12m": { "$ref": "#/$defs/ProfitScenario" }
          },
          "additionalProperties": false
        },
        "breakevenExit_3m": { "type": "number" },
        "breakevenExit_6m": { "type": "number" },
        "breakevenExit_12m": { "type": "number" }
      },
      "additionalProperties": false
    },

    "CourtDocsNormalized": {
      "type": "object",
      "required": ["caseNumber", "registeredRights", "occupants", "baseRightDate"],
      "properties": {
        "caseNumber": { "type": "string" },
        "propertyDetails": { "type": "string" },
        "registeredRights": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["type", "date", "creditor", "amount"],
            "properties": {
              "type": { "type": "string" },
              "date": { "type": "string", "format": "date" },
              "creditor": { "type": "string" },
              "amount": { "type": "number" },
              "isBaseRight": { "type": "boolean" }
            }
          }
        },
        "occupants": {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "name",
              "moveInDate",
              "dividendRequested",
              "deposit"
            ],
            "properties": {
              "name": { "type": "string" },
              "moveInDate": { "type": "string", "format": "date" },
              "fixedDate": { "type": "string", "format": "date" },
              "dividendRequested": { "type": "boolean" },
              "deposit": { "type": "number" },
              "rent": { "type": "number" },
              "hasCountervailingPower": { "type": "boolean" }
            }
          }
        },
        "baseRightDate": { "type": "string", "format": "date" },
        "remarks": { "type": "string" }
      },
      "additionalProperties": false
    },

    "AuctionSummary": {
      "type": "object",
      "required": [
        "isProfitable",
        "grade",
        "riskLabel",
        "recommendedBidRange",
        "bestHoldingPeriod",
        "bestScenario",
        "generatedAt"
      ],
      "properties": {
        "isProfitable": { "type": "boolean" },
        "grade": {
          "type": "string",
          "enum": ["S", "A", "B", "C", "D"]
        },
        "riskLabel": { "type": "string" },
        "recommendedBidRange": {
          "type": "object",
          "properties": {
            "min": { "type": "number" },
            "max": { "type": "number" }
          },
          "required": ["min", "max"]
        },
        "bestHoldingPeriod": {
          "type": "integer",
          "enum": [3, 6, 12]
        },
        "bestScenario": { "$ref": "#/$defs/ProfitScenario" },
        "generatedAt": { "type": "string", "format": "date-time" }
      },
      "additionalProperties": false
    }
  }
}
```

---

# ✅ **완료: v2.2 완전 대응 JSON Schema 제공**

이 스키마는:

* **엔진 타입과 100% 동기화**
* **ExitPrice 멀티 시나리오 완전 반영**
* **Cost/Profit/Summary 최신 구조 적용**
* **fixtures-validator 자동화 테스트 구축 가능**
* **UI와 엔진 양측에서 그대로 사용 가능**

---


