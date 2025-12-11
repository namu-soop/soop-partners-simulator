// 투자 데이터 타입 정의
export interface Product {
    code: string;
    name: string;
    rate: number;
    rateDisplay: string;
    subtitle: string;
    features: string[];
    recommended?: boolean;
}

export interface InvestorType {
    code: string;
    name: string;
    taxRate: number;
    taxDisplay: string;
    description: string;
    note?: string;
    highlighted?: boolean;
}

export interface ProfitData {
    annual: number;
    monthly: number;
}

export interface ProductProfitData {
    individual: ProfitData;
    general_corp: ProfitData;
    loan_corp: ProfitData;
}

export interface ComparisonData {
    [productCode: string]: ProductProfitData;
}

export interface InvestmentData {
    products: Product[];
    investorTypes: InvestorType[];
    comparisonData: {
        [amount: string]: ComparisonData;
    };
}

// 시뮬레이션 결과 타입
export interface SimulationResult {
    investmentAmount: number;
    productName: string;
    rate: number;
    periodYears: number;
    customerType: string;
    afterTaxAnnual: number;
    afterTaxMonthly: number;
    depositAfterTaxAnnual: number;
    extraAnnual: number;
    extraMonthly: number;
    leisureHours: number;
    lifestyle: LifestyleData;
}

export interface LifestyleData {
    familyMeal: number;
    golf: number;
    meeting: number;
    hobby: number;
    shortTrip: number;
    healthCare: number;
    personalTime: number;
}

// 목표 수익 계산 결과 타입
export interface TargetProfitResult {
    targetMonthly: number;
    data: ProductRequirement[];
}

export interface ProductRequirement {
    name: string;
    preTaxRate: number;
    required: {
        individual: number;
        general_corp: number;
        loan_corp: number;
    };
}
