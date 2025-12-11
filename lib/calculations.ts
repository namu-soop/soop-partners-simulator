import type { SimulationResult, TargetProfitResult, ProductRequirement } from './types';

/**
 * 투자 수익 시뮬레이션 계산
 */
export function calculateInvestment(params: {
    amount: number;
    product: string;
    customerType: string;
    periodYears: number;
}): SimulationResult {
    const { amount, product, customerType, periodYears } = params;

    // 상품별 수익률
    const rates: { [key: string]: number } = {
        'abc': 0.08,
        'year1': 0.085,
        'year2': 0.09,
        'mix_a': 0.0875,
        'mix_b': 0.085,
        'mix_c': 0.0825
    };

    // 세율
    const taxRates: { [key: string]: number } = {
        'individual': 0.275,
        'general_corp': 0.209,
        'loan_corp': 0
    };

    const rate = rates[product] || 0.08;
    const tax = taxRates[customerType] || 0.275;

    // 1) 세후 연 수익
    const afterTaxAnnual = amount * rate * (1 - tax);

    // 2) 세후 월 수익
    const afterTaxMonthly = afterTaxAnnual / 12;

    // 3) 예금 세후 연 수익 (2.25% 세전, 15.4% 세율 → 1.9035% 세후)
    const depositAfterTaxRate = 0.019035;
    const depositAfterTaxAnnual = amount * depositAfterTaxRate;

    // 4) 예금 대비 연 추가 수익
    const extraAnnual = afterTaxAnnual - depositAfterTaxAnnual;

    // 5) 예금 대비 월 추가 수익
    const extraMonthly = extraAnnual / 12;

    // 6) 여유 시간 (최저시급 10,030원 기준)
    const leisureHours = extraAnnual / 10030;

    // 7) 삶의 여유 환산 (월 추가 수익 기준)
    const lifestyle = {
        familyMeal: Math.floor(extraMonthly / 150000),
        golf: Math.floor(extraMonthly / 350000),
        meeting: Math.floor(extraMonthly / 25000),
        hobby: Math.floor(extraMonthly / 175000),
        shortTrip: Math.floor(extraMonthly / 300000),
        healthCare: Math.floor(extraMonthly / 185000),
        personalTime: Math.floor(extraMonthly / 10030)
    };

    return {
        investmentAmount: amount,
        productName: getProductName(product),
        rate: rate * 100,
        periodYears,
        customerType,
        afterTaxAnnual,
        afterTaxMonthly,
        depositAfterTaxAnnual,
        extraAnnual,
        extraMonthly,
        leisureHours,
        lifestyle
    };
}

/**
 * 상품명 반환
 */
export function getProductName(code: string): string {
    const names: { [key: string]: string } = {
        'abc': 'ABC 투자',
        'year1': '1년 기간형 투자',
        'year2': '2년 기간형 투자',
        'mix_a': '혼합 A (기간1+2)',
        'mix_b': '혼합 B (ABC+기간2)',
        'mix_c': '혼합 C (ABC+기간1)'
    };
    return names[code] || 'ABC 투자';
}

/**
 * 목표 수익 달성을 위한 필요 투자금 계산
 */
export function calculateRequiredInvestment(targetMonthlyProfit: number): TargetProfitResult {
    const targetMonthly = targetMonthlyProfit;

    // 상품별 세전 수익률
    const products = [
        { code: 'abc', name: 'ABC 투자', rate: 0.08 },
        { code: 'year1', name: '1년 기간형', rate: 0.085 },
        { code: 'year2', name: '2년 기간형', rate: 0.09 },
        { code: 'mix_a', name: '혼합 A', rate: 0.0875 },
        { code: 'mix_b', name: '혼합 B', rate: 0.085 },
        { code: 'mix_c', name: '혼합 C', rate: 0.0825 }
    ];

    // 세율
    const taxRates = {
        'individual': 0.275,
        'general_corp': 0.209,
        'loan_corp': 0
    };

    const result: ProductRequirement[] = [];

    products.forEach(product => {
        const productResult: ProductRequirement = {
            name: product.name,
            preTaxRate: product.rate * 100,
            required: {
                individual: 0,
                general_corp: 0,
                loan_corp: 0
            }
        };

        // 각 투자자 유형별 필요 투자금 계산
        Object.entries(taxRates).forEach(([type, tax]) => {
            // 세후 수익률 = 세전 수익률 × (1 - 세율)
            const afterTaxRate = product.rate * (1 - tax);

            // 월 세후 수익률
            const monthlyAfterTaxRate = afterTaxRate / 12;

            // 필요 투자금 = 목표 월 수익 / 월 세후 수익률
            const requiredInvestment = targetMonthly / monthlyAfterTaxRate;

            productResult.required[type as keyof typeof productResult.required] = requiredInvestment;
        });

        result.push(productResult);
    });

    return {
        targetMonthly,
        data: result
    };
}
