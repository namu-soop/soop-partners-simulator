'use client';

import { useState, useEffect } from 'react';
import { getInvestmentData, getComparisonDataForAmount, getComparisonInsights } from '@/lib/dataService';
import { formatCurrency } from '@/lib/formatters';

export default function ComparisonPage() {
    const data = getInvestmentData();
    const [selectedAmount, setSelectedAmount] = useState(500000000);
    const [selectedType, setSelectedType] = useState('individual');
    const [comparisonResults, setComparisonResults] = useState<any>(null);
    const [insights, setInsights] = useState<any[]>([]);

    const amounts = [
        { value: 500000000, label: '5억원' },
        { value: 800000000, label: '8억원' },
        { value: 1000000000, label: '10억원' },
    ];

    const investorTypes = [
        { code: 'individual', label: '개인' },
        { code: 'general_corp', label: '일반법인' },
        { code: 'loan_corp', label: '대부법인' },
    ];

    useEffect(() => {
        const compData = getComparisonDataForAmount(selectedAmount);
        if (compData) {
            const results = data.products.map(product => {
                const productData = compData[product.code];
                const typeData = productData[selectedType as keyof typeof productData];
                return {
                    ...product,
                    annual: typeData.annual,
                    monthly: typeData.monthly
                };
            });
            setComparisonResults(results);

            const maxAnnual = Math.max(...results.map(r => r.annual));
            const bestProduct = results.find(r => r.annual === maxAnnual);
            if (bestProduct) {
                bestProduct.isBest = true;
            }
        }

        const insightsData = getComparisonInsights(selectedAmount, selectedType);
        setInsights(insightsData);
    }, [selectedAmount, selectedType, data.products]);

    return (
        <div className="container mx-auto px-6 fade-in">
            <div className="page-header">
                <h2>상품별 수익 비교</h2>
                <p>
                    동일 조건에서 각 상품이 만들어내는 수익의 차이를<br />
                    한눈에 확인하실 수 있습니다.
                </p>
            </div>

            {/* 투자 금액 선택 */}
            <div className="mb-10">
                <h3 className="text-xl font-semibold text-primary mb-4 text-center">
                    투자 금액 선택
                </h3>
                <div className="flex gap-4 justify-center flex-wrap">
                    {amounts.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setSelectedAmount(value)}
                            className={`selector-btn ${selectedAmount === value ? 'active' : ''}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 투자자 유형 선택 */}
            <div className="mb-10">
                <h3 className="text-xl font-semibold text-primary mb-4 text-center">
                    투자자 유형 선택
                </h3>
                <div className="flex gap-4 justify-center flex-wrap">
                    {investorTypes.map(({ code, label }) => (
                        <button
                            key={code}
                            onClick={() => setSelectedType(code)}
                            className={`selector-btn ${selectedType === code ? 'active' : ''}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 결과 라벨 */}
            <div className="text-right mb-4">
                <span className="text-sm text-gray-500 font-medium tracking-wide">
                    단위: 원 (세후 수익 기준)
                </span>
            </div>

            {/* 상품 비교 결과 */}
            {comparisonResults && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                    {comparisonResults.map((product: any) => (
                        <div
                            key={product.code}
                            className={`result-card ${product.isBest ? 'best' : ''}`}
                        >
                            {product.isBest && (
                                <div className="absolute -top-2 left-4 bg-accent text-white px-3 py-1 rounded-xl text-xs font-semibold shadow-sm">
                                    최고 수익
                                </div>
                            )}

                            <div className="flex justify-between items-center mb-5 pb-4 border-b-2 border-secondary">
                                <div className="text-lg font-semibold text-primary">
                                    {product.name}
                                </div>
                                <div className="text-xl font-bold text-accent">
                                    {product.rateDisplay}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 font-medium">연간 수익</span>
                                    <span className="text-2xl font-bold text-primary">
                                        {formatCurrency(product.annual)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 font-medium">월간 수익</span>
                                    <span className="text-2xl font-bold text-primary">
                                        {formatCurrency(product.monthly)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 인사이트 섹션 */}
            {insights.length > 0 && (
                <div className="mt-12 pt-8 border-t-2 border-gray-300">
                    <h3 className="text-2xl font-semibold text-primary mb-7 flex items-center">
                        <span className="inline-block w-1 h-5 bg-accent mr-3"></span>
                        주요 인사이트
                    </h3>
                    <div className="space-y-5">
                        {insights.map((insight, idx) => (
                            <div
                                key={idx}
                                className="bg-gray-50 border-l-4 border-accent p-6 rounded-lg transition-all duration-300 hover:bg-white hover:shadow-sm hover:translate-x-1"
                            >
                                <h4 className="text-base font-semibold text-primary mb-3 tracking-tight">
                                    {insight.title}
                                </h4>
                                <p
                                    className="text-sm text-gray-900 leading-relaxed tracking-tight"
                                    dangerouslySetInnerHTML={{ __html: insight.message }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
