🌴 Castaway – 비언어적 소통 생성형 감정 케어 서비스
🧠 Overview

Castaway는 사용자가 작성한 일기(텍스트)를 분석해
감정을 추출하고, 이를 **시각적 오브제(이미지)**와 **청각적 요소(BGM)**로 변환하는
멀티모달 기반 감정 케어 애플리케이션입니다.

단순 감정 분류에 그치지 않고,
감정 분석 → 군집화 → 생성형 AI → 서비스 제공까지 이어지는
End-to-End AI 파이프라인을 직접 설계·구현한 프로젝트입니다.

🚩 Problem Statement

기존 감정 분석 모델은 단일 라벨(기쁨/슬픔 등)에 머물러
감정의 원인과 맥락을 설명하기 어려움

규칙 기반 추천은 사용자의 복합 감정 상태를 반영하기 어려움

다수의 AI 모델을 연쇄 호출하면서 발생하는 Latency 문제

🧩 Architecture & Solution
1️⃣ Multi-Stage AI Pipeline

Emotion Analysis

RoBERTa 기반 모델을 Span Extraction 방식으로 파인튜닝

감정 라벨 + 감정의 원인이 되는 핵심 문장 추출

Generative AI

감정 분석 결과를 프롬프트로 변환

Stable Diffusion → 감정 오브제 이미지 생성

MusicGen → 감정 기반 BGM 생성

2️⃣ Day Vector & Clustering

1550차원 Day Vector 설계

감정 확률(Softmax)

키워드 임베딩(SBERT)

감정 변화량(Delta)

K-Means Clustering

감정 신호의 영향력을 높이기 위해 가중치 조정

총 125개 감정 군집으로 분리하여 사용자 상태를 정교하게 매핑

3️⃣ System Integration

Node.js (Main Server) ↔ FastAPI (AI Server) 비동기 통신

AI 추론과 생성 작업을 분리하여 응답 지연 최소화

AWS EC2 + Docker 기반 배포 환경 구성

React Native 모바일 앱과 연동

📊 Results

감정 분석 Accuracy 93% / F1-score 0.74

감정 분석 → 이미지·음악 생성까지 이어지는 End-to-End 파이프라인 완성

Day Vector 기반 사용자 군집화 및 개인화 추천 가능성 검증

실제 모바일 앱 수준에서 사용 가능한 서비스 구현

🛠 Tech Stack

AI / ML: Python, PyTorch, RoBERTa, LSTM, SBERT, Stable Diffusion, MusicGen

Backend: FastAPI (AI Serving), Node.js (Express)

Database: PostgreSQL

App: React Native

Infra: AWS EC2, Docker, Git

🔗 Links

Main Repository: https://github.com/kjw402540/castaway

AI Server Repository: https://github.com/kjw402540/castaway_AI

Demo Video: https://drive.google.com/file/d/16vsCk4iANrTL3_j-bqIYV22YgjDXsUou/view

