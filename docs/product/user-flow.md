flowchart TD

A[사용자 접속] --> B{로그인 상태?}

B --> C[Clerk 로그인] 
B --> D[대시보드 이동]

C --> D

D --> E[Usage 조회]
E --> F{bids_used < 5?}

F --> G[입찰 생성 제한] 
F --> H[시뮬 생성 요청]

H --> I[엔진 실행]
I --> J[Simulations 저장]
J --> K[Usage 업데이트]
K --> L[결과 화면]

L --> M{입찰 제출?}

M --> N[대시보드로 복귀]
M --> O[Submit-Bid 실행]

O --> P[Simulations 업데이트]
P --> Q[History 업데이트]
Q --> D

D --> R{리포트 요청?}

R --> S[대시보드 유지]
R --> T{무료 리포트 사용함?}

T --> U[리포트 제한]
T --> V[리포트 생성]

V --> W[Usage 업데이트]
W --> D
