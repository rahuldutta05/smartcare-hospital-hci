# GOMS / KLM Analysis
Operators (standard values): K=0.28 s, P=1.1 s, H=0.4 s, M=1.35 s.
## Goal 1: Open patient history
**Poor (via Patients menu):** P(Patients) M P(search box) K×5 (ID) P(Search) P(card) P(History tab) → M×3 + P×4 + K×5 + H = 4.05+4.4+1.4+0.4 ≈ **10.3 s**
**SmartCare:** M, K×5 on dashboard search (H), Enter(K), P(card), P(tab) → M×2 + K×6 + P×2 + H = 2.7+1.7+2.2+0.4 ≈ **7.0 s** (~32% faster).
## Goal 2: Reschedule appointment
**Poor:** open booking form, cancel, rebook: M×4 + P×6 + K×… ≈ 14 s.
**SmartCare:** M P(Reschedule) P(choose time) ≈ 1.35+1.1+1.1 ≈ **3.6 s**.
## CMN-GOMS (Goal 1)
GOAL: open history → GOAL: find patient [select: search box | Patients page] → GOAL: open record → GOAL: choose tab.
