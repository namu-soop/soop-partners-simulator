import investmentData from '@/data/investment-data.json';
import type { InvestmentData } from './types';

/**
 * 투자 데이터 가져오기
 */
export function getInvestmentData(): InvestmentData {
    return investmentData as InvestmentData;
}

/**
 * 특정 금액에 대한 비교 데이터 가져오기
 */
export function getComparisonDataForAmount(amount: number) {
    const data = getInvestmentData();
    const amountKey = amount.toString();
    return data.comparisonData[amountKey];
}

/**
 * 추가 수익 데이터 계산 (ABC 투자 개인 기준)
 */
export function getExtraProfitData(amount: number, investorType: string) {
    const comparisonData = getComparisonDataForAmount(amount);
    if (!comparisonData) return null;

    // 기준: ABC 투자 (개인)
    const baseAnnual = comparisonData.abc.individual.annual;
    const baseMonthly = comparisonData.abc.individual.monthly;

    const data = getInvestmentData();
    const extraData = data.products.map(product => {
        const productData = comparisonData[product.code];
        const typeData = productData[investorType as keyof typeof productData];

        return {
            code: product.code,
            name: product.name,
            rate: product.rateDisplay,
            annual: typeData.annual - baseAnnual,
            monthly: typeData.monthly - baseMonthly
        };
    });

    return {
        base: {
            annual: baseAnnual,
            monthly: baseMonthly
        },
        products: extraData
    };
}

/**
 * 비교 인사이트 생성
 */
export function getComparisonInsights(amount: number, investorType: string) {
    const comparisonData = getComparisonDataForAmount(amount);
    if (!comparisonData) return [];

    const insights: Array<{ type: string; title: string; message: string }> = [];

    // ABC vs 2년 기간형 비교
    const abcProfit = comparisonData.abc[investorType as keyof typeof comparisonData.abc].annual;
    const year2Profit = comparisonData.year2[investorType as keyof typeof comparisonData.year2].annual;
    const diff = year2Profit - abcProfit;

    if (diff > 0) {
        insights.push({
            type: 'compare',
            title: '투자 상품에 따른 수익 격차',
            message: `2년 기간형은 ABC 투자 대비 연 <span class="font-bold text-green-600">+${Math.round(diff).toLocaleString('ko-KR')}원</span>의 추가 수익을 기대할 수 있습니다.`
        });
    }

    // 투자자 유형별 차이
    const typeInsights = getInvestorTypeInsights(comparisonData, investorType);
    if (typeInsights.length > 0) {
        insights.push({
            type: 'entity',
            title: '투자자 유형별 차이',
            message: typeInsights.join('<br>')
        });
    }

    return insights;
}

/**
 * 투자자 유형별 인사이트 생성
 */
function getInvestorTypeInsights(comparisonData: any, currentType: string): string[] {
    const messages: string[] = [];

    // 2년 기간형 기준으로 비교
    const year2 = comparisonData.year2;

    const individualProfit = year2.individual.annual;
    const generalCorpProfit = year2.general_corp.annual;
    const loanCorpProfit = year2.loan_corp.annual;

    if (currentType === 'individual') {
        const diffGeneral = generalCorpProfit - individualProfit;
        const diffLoan = loanCorpProfit - individualProfit;

        if (diffGeneral > 0) {
            messages.push(`• 일반 법인 선택 시 연 <span class="font-bold text-green-600">+${Math.round(diffGeneral).toLocaleString('ko-KR')}원</span> 더 높은 수익입니다.`);
        }
        if (diffLoan > 0) {
            messages.push(`• 대부 법인 선택 시 연 <span class="font-bold text-green-600">+${Math.round(diffLoan).toLocaleString('ko-KR')}원</span>의 추가 수익입니다.`);
        }
    } else if (currentType === 'general_corp') {
        const diffIndividual = generalCorpProfit - individualProfit;
        const diffLoan = loanCorpProfit - generalCorpProfit;

        if (diffIndividual > 0) {
            messages.push(`• 개인 대비 연 <span class="font-bold text-green-600">+${Math.round(diffIndividual).toLocaleString('ko-KR')}원</span> 더 높은 수익입니다.`);
        }
        if (diffLoan > 0) {
            messages.push(`• 대부 법인 선택 시 연 <span class="font-bold text-green-600">+${Math.round(diffLoan).toLocaleString('ko-KR')}원</span>의 추가 수익입니다.`);
        }
    } else if (currentType === 'loan_corp') {
        const diffGeneral = loanCorpProfit - generalCorpProfit;
        const diffIndividual = loanCorpProfit - individualProfit;

        if (diffGeneral > 0) {
            messages.push(`• 일반 법인 대비 연 <span class="font-bold text-green-600">+${Math.round(diffGeneral).toLocaleString('ko-KR')}원</span> 더 높은 수익입니다.`);
        }
        if (diffIndividual > 0) {
            messages.push(`• 개인 대비 연 <span class="font-bold text-green-600">+${Math.round(diffIndividual).toLocaleString('ko-KR')}원</span> 높은 수익입니다.`);
        }
    }

    return messages;
}
