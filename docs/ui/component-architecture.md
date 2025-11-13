

# ?›ï¸?**Component Architecture for BIDIX AI (v2.2)**

**Version:** 2.2
**Last Updated:** 2025-11-13
**Status:** ???”ì§„ v2.2 + Design System v2.2 ê¸°ì? ìµœì¢… ?•ì •
**Applies To:** Next.js App Router (13/14/15), BIDIX Engine 2.2

---

# 1. ëª©ì  ë°?ì² í•™

**ë³?ë¬¸ì„œ??BIDIX AI???„ë¡ ?¸ì—”???„ì²´ë¥?êµ¬ì„±?˜ëŠ” ì»´í¬?ŒíŠ¸ ê³„ì¸µ êµ¬ì¡°???¨ì¼ ê¸°ì?(SSOT)**?´ë‹¤.

**?µì‹¬ ì² í•™**

* **Colocation:** ?˜ì´ì§€?€ ì»´í¬?ŒíŠ¸??ê°€?¥í•œ ê°€ê¹Œì´??ë°°ì¹˜?œë‹¤.
* **?”ì§„-UI 1:1 ë§¤í•‘:** AuctionAnalysisResult ??UI ì»´í¬?ŒíŠ¸ ê°?ë³€?˜ì´ ?„ìš”?˜ì? ?Šë„ë¡??¤ê³„?œë‹¤.
* **ê´€?¬ì‚¬ ë¶„ë¦¬:** ?˜ì´ì§€???ˆì´?„ì›ƒÂ·?°ì´??ê³µê¸‰, ì»´í¬?ŒíŠ¸???œí˜„Â·?íƒœ ê´€ë¦?
* **?œì½ê¸??¬ìš´ êµ¬ì¡°??*: Vibe Coding ?¨ê³„?ì„œ ë°”ë¡œ ì»´í¬?ŒíŠ¸ë¥??ë³„?????ˆë„ë¡?ëª…í™•??ì±…ì„ ë¶„ë¦¬.

---

# 2. ìµœìƒ??ì»´í¬?ŒíŠ¸ ?”ë ‰? ë¦¬ êµ¬ì¡° (v2.2 ?•ì •)

```
/app/
 ?”â? components/                   
    ?œâ? ui/                        # shadcn/ui
    ?œâ? common/                    # Header, Footer, SectionTitle ??ê³µìš©
    ?œâ? dashboard/                 # /dashboard
    ?œâ? simulations/               # /simulations, /simulations/[id]
    ?œâ? bid/                       # /simulations/[id]/bid
    ?œâ? result/                    # /simulations/[id]/result
    ?”â? reports/                   # (?”’ Premium) ?ì„¸ ë¦¬í¬??ë·°ì–´
```

### v2.2 ë³€ê²½ì‚¬??

| ë³€ê²?                         | ?´ìœ                                                          |
| --------------------------- | ---------------------------------------------------------- |
| `bid/` ?´ë” ? ì„¤                | ?…ì°° ?˜ì´ì§€??ì»´í¬?ŒíŠ¸ ??ì¦ê????°ë¼ ë¶„ë¦¬ ?„ìš”                                |
| `result/` ?˜ìœ„ êµ¬ì¡° ê°œí¸          | ExitScenarioTable / MetricsStrip / BidOutcomeBlock ??ëª…í™• ë¶„ë¦¬ |
| reports ?´ë”??Premium ë¦¬í¬?¸ë§Œ ë³´ê? | ë¬´ë£Œ ?”ì•½?€ simulations/ ?´ë??ì„œ ?Œë”ë§?                              |

---

# 3. ?˜ì´ì§€ë³?ì»´í¬?ŒíŠ¸ êµ¬ì¡° (v2.2)

---

## 3.1 **Dashboard Components (`/components/dashboard/`)**

?´ë? ?•í™•?˜ê²Œ êµ¬ì„±??v2.0 êµ¬ì¡°ê°€ v2.2?ì„œ??ê·¸ë?ë¡?? íš¨??

---

## 3.2 **Simulation Components (`/components/simulations/`)**

> `/simulations` (ëª©ë¡)
> `/simulations/[id]` (?ì„¸ - ?…ì°° ??

| ì»´í¬?ŒíŠ¸                         | ??•             | ì£¼ìš” Props (v2.2 ê¸°ì?)                                     |
| ---------------------------- | ------------- | ------------------------------------------------------ |
| **SimulationList.tsx**       | ë¦¬ìŠ¤??Fetch/?„í„°ë§?| ?†ìŒ (`use client` ?´ë? ?íƒœ)                                |
| **FilterBar.tsx**            | ì§€??? í˜•/?œì´???„í„°  | `onFilterChange(filters)`                              |
| **PropertyCard.tsx**         | ë§¤ë¬¼ ë¦¬ìŠ¤??ì¹´ë“œ     | `property: Property`, `valuation.minBid`               |
| **SaleStatementSummary.tsx** | ë§¤ê°ë¬¼ê±´ëª…ì„¸???”ì•½    | `property: Property`, `courtDocs: CourtDocsNormalized` |
| **RightsSummary.tsx**        | ê¶Œë¦¬ ë¶„ì„ ?”ì•½      | `rights: Rights`                                       |

### v2.2 ë³€ê²½ì‚¬??

* **PropertyCard**ê°€ `PropertySeed`ê°€ ?„ë‹ˆ??**Property(?•ê·œ??** ë¥?ë°›ë„ë¡?ë³€ê²½ë¨.
* `SaleStatementSummary`??courtDocsRawê°€ ?„ë‹Œ **CourtDocsNormalized**ë§??¬ìš©.

---

## 3.3 **Bid Components (`/components/bid/`)**

> ?…ì°° ??UI ??QuickFacts / BidForm ??

| ì»´í¬?ŒíŠ¸                   | ??•                       | Props                                    |
| ---------------------- | ----------------------- | ---------------------------------------- |
| **QuickFacts.tsx**     | FMVÂ·minBidÂ·ExitPrice ?œì‹œ | `valuation: Valuation (v2.2)`            |
| **BidAmountInput.tsx** | ?…ë ¥ ì»´í¬?ŒíŠ¸                 | `initialValue?: number`, `onSubmit(bid)` |
| **BidGuidanceBox.tsx** | ?ˆì „ë§ˆì§„Â·ìµœì??…ì°°ê°€ ?ˆë‚´           | `valuation: Valuation`                   |

### v2.2 ë³€ê²½ì‚¬??

* ExitPrice ?¨ì¼ê°??? œ ??**exitPrice3m / 6m / 12m** ?œì‹œ.

---

## 3.4 **Result Components (`/components/result/`)**

> `/simulations/[id]/result`

### ?µì‹¬ 5?€ ì»´í¬?ŒíŠ¸ (v2.2 ê¸°ì?)

| ì»´í¬?ŒíŠ¸                      | ??•                    | Props                                        |          |              |
| ------------------------- | -------------------- | -------------------------------------------- | -------- | ------------ |
| **BidOutcomeBlock.tsx**   | ?±ê³µ/?¤íŒ¨/ê·¼ì ‘             | `summary: AuctionSummary`, `userBid: number` |          |              |
| **MetricsStrip.tsx**      | MoS/ROI/Score 3ì¢??¤íŠ¸ë¦?| `profit: Profit`, `score: ScoreBreakdown`    |          |              |
| **ExitScenarioTable.tsx** | 3/6/12ê°œì›” ?˜ìµ ë¹„êµ       | `scenarios: ProfitScenario[]`                |          |              |
| **PremiumReportCTA.tsx**  | ?”’ ?„ë¦¬ë¯¸ì—„ ë¦¬í¬??? ê¸ˆ       | `{ type: "rights"                            | "profit" | "auction" }` |
| **ResultActions.tsx**     | ?ˆìŠ¤? ë¦¬ ?€?? ?¤ìŒ ?ˆë ¨       | `simulationId: string`                       |          |              |

### v2.2 ?µì‹¬ ?„ë“œ ?€??

* profit.scenarios[] ?¬ìš©
* profit.initialSafetyMargin ?¬ìš©
* summary.isProfitable3m/6m/12m ?¬ìš©

---

## 3.5 **Premium Report Components (`/components/reports/`)**

?”’ Premium ì½˜í…ì¸?(MVP??? ê¸ˆ ?íƒœë¡œë§Œ ?œì‹œ)

| ì»´í¬?ŒíŠ¸                      | ??•           | Props                                                               |
| ------------------------- | ----------- | ------------------------------------------------------------------- |
| RightsAnalysisReport.tsx  | ê¶Œë¦¬ ë¶„ì„ ?ì„¸    | `rights: Rights`, `courtDocs: CourtDocsNormalized`                  |
| ProfitAnalysisReport.tsx  | ?˜ìµ ë¶„ì„ ?ì„¸    | `profit: Profit`, `valuation: Valuation`, `costs: Costs`            |
| AuctionAnalysisReport.tsx | ?…ì°° ë¶„ì„ ?ì„¸    | `summary: AuctionSummary`, `valuation: Valuation`, `profit: Profit` |
| SaleStatementReport.tsx   | ë§¤ê°ë¬¼ê±´ëª…ì„¸???´ì„¤??| `courtDocs: CourtDocsNormalized`                                    |

### v2.2 ë³€ê²½ì‚¬??

* ëª¨ë“  Premium ë¦¬í¬?¸ëŠ” **ExitPrice 3/6/12 ?œë‚˜ë¦¬ì˜¤ ê¸°ë°˜?¼ë¡œ ?¬ì‘???„ìš”**
* ê¸°ì¡´ ?¨ì¼ ExitPrice ê¸°ë°˜ êµ¬ì¡°???ê¸°??

---

# 4. ?¬ì‚¬??ì»´í¬?ŒíŠ¸ (common/?€ ui/)

```
common/
 ?œâ? SectionHeader.tsx
 ?œâ? SectionCard.tsx
 ?œâ? Badge.tsx
 ?œâ? DataRow.tsx
 ?”â? ErrorState.tsx
```

```
ui/
 ?œâ? Button.tsx
 ?œâ? Card.tsx
 ?œâ? Table.tsx
 ?œâ? Tabs.tsx
 ?œâ? Alert.tsx
 ?œâ? Separator.tsx
 ?”â? Input.tsx
```

### v2.2 ì¶”ê? ê·œì¹™

* ê¸ˆì•¡ ?œì‹œ????ƒ common/DataRow?ì„œ ì²˜ë¦¬
* ê°??˜ì´ì§€??ìµœì†Œ?œì˜ ë§ˆí¬?…ë§Œ ? ì?
* ?°ì´???¬ë§·?…ì? ì»´í¬?ŒíŠ¸?ì„œë§??˜í–‰

---

# 5. ?˜ì´ì§€ êµ¬ì¡° ??ì»´í¬?ŒíŠ¸ ë§¤í•‘ (v2.2)

### ?“„ `/simulations/[id]/result/page.tsx`

```
<BidOutcomeBlock summary={result.summary} userBid={userBid} />

<MetricsStrip profit={result.profit} score={score} />

<ExitScenarioTable scenarios={result.profit.scenarios} />

<PremiumReportCTA type="rights" />
<PremiumReportCTA type="profit" />
<PremiumReportCTA type="auction" />

<ResultActions simulationId={id} />
```

### ?“„ `/simulations/[id]/bid/page.tsx`

```
<QuickFacts valuation={result.valuation} />

<BidGuidanceBox valuation={result.valuation} />

<BidAmountInput onSubmit={handleSubmit} />
```

### ?“„ `/simulations/[id]/page.tsx`

```
<SaleStatementSummary property={result.property} courtDocs={result.courtDocs} />

<RightsSummary rights={result.rights} />

<Link href="./bid">?…ì°°?˜ê¸°</Link>
```

---

# 6. v2.2 ì»´í¬?ŒíŠ¸ ë³€ê²??”ì•½

| ??ª©              | v2.0            | v2.2 ë³€??                       |
| --------------- | --------------- | ------------------------------ |
| ExitPrice       | ?¨ì¼              | 3Â·6Â·12ê°œì›” ?œë‚˜ë¦¬ì˜¤ë¡?ë¶„ë¦¬              |
| Profit          | ?¨ì¼ ROI          | scenarios ë°°ì—´ ê¸°ë°˜                |
| Summary         | ?¨ì¼ isProfitable | 3Â·6Â·12 ê°œë³„ ?„ë“œ                   |
| RightsSummary   | ë³€ê²??†ìŒ           | riskFlags / evictionRisk ê¸°ì? ê°•í™” |
| BidOutcomeBlock | ??êµ¬ì¡°            | summary.grade / riskLabel ?¬ìš©   |

---

# 7. ?•ì¥ ê³„íš (v2.3)

| ê¸°ëŠ¥                       | ?¤ëª…              |
| ------------------------ | --------------- |
| Competitor AI Simulation | ê²½ìŸ??6ëª??œë‚˜ë¦¬ì˜¤ ?œê°??|
| Score Distribution Graph | ?ìˆ˜ ë¶„í¬ ?ˆíŠ¸ë§?      |
| Rights Timeline Chart    | ê¶Œë¦¬ ë°œìƒ ?€?„ë¼???œê°?? |
| Profit Tornado Graph     | ë¯¼ê°??ë¶„ì„ ê·¸ë˜??     |

---

# **END OF DOCUMENT ??Component Architecture v2.2**

