# 💰 FinSight – Personal Finance Tracker

A modern full-stack app built with **Next.js 15**, **Tailwind CSS**, **Prisma**, and **PostgreSQL** to track income and expenses efficiently.

---

## 🔍 Project Overview

FinSight is a personal finance manager that allows users to:
- Add, view, and delete transactions
- Categorize expenses
- Visualize spending trends
- Set and monitor budgets with insights

---

## 🚀 Features Implemented

### ✅ Stage 1: Transaction Management
- Add/delete income & expenses
- View list of transactions
- Monthly expense bar chart (Recharts)

### ✅ Stage 2: Category Management
- Add transactions by category
- Visualize spending by category (pie chart)
- API + Prisma relations for categories

### ✅ Stage 3: Budget + Insights
- Set per-category monthly budgets
- Display current vs budget spending
- Alerts if over-budget

---

## ⚙️ Setup Instructions

### 🖥 Local Development

```bash
git clone https://github.com/your-username/finsight-tracker.git
cd finsight
cp .env.example .env    # Add your PostgreSQL URL
npm install
docker compose up -d    # Start PostgreSQL
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
