export type Currency = 'EUR' | 'TRY' | 'USD'
export type TransactionType = 'income' | 'expense'
export type Theme = 'light' | 'dark'
export type Language = 'tr' | 'de' | 'en'

export type IncomeCategory = 'Maaş' | 'Serbest Çalışma' | 'Yatırım Getirisi' | 'Diğer'
export type ExpenseCategory =
  | 'Kira'
  | 'Market'
  | 'Ulaşım'
  | 'Sağlık'
  | 'Eğlence'
  | 'Yatırım'
  | 'Diğer'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  currency: Currency
  category: IncomeCategory | ExpenseCategory
  date: string
  note: string
  createdAt: string
}

export interface GoldInvestment {
  id: string
  gramsAmount: number
  pricePerGram: number
  totalPaid: number
  store: string
  date: string
  note: string
}

export interface Settings {
  currency: Currency
  language: Language
  monthlyBudgetLimit: number
  theme: Theme
}
