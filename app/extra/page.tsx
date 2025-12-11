'use client';

import { useState, useEffect } from 'react';
import { getExtraProfitData, getInvestmentData } from '@/lib/dataService';
import { formatCurrency, formatCurrencyWithSign } from '@/lib/formatters';

export default function ExtraProfitPage() {
    const data = getInvestmentData();
    const [selectedAmount, setSelectedAmount] = useState(500000000);
    const [selectedType, setSelectedType] = useState('individual');
    const [extraData, setExtraData] = useState<any>(null);

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
        const result = getExtraProfitData(selectedAmount, selectedType);
        if (result) {
            const maxExtra = Math.max(...result.products.filter((p: any) => p.annual > 0).map((p: any) => p.annual));
            result.products.forEach((p: any) => {
                p.isBest = p.annual > 0 && p.annual === maxExtra;
                p.hasExtra = p.annual !== 0;
            });
            setExtraData(result);
        }
    }, [selectedAmount, selectedType]);

    return (
        <div className="container mx-auto px-6 fade-in">
            <div className="page-header">
                <h2>전략별 추가 수익</h2>
                <p>
                    투자 전략을 바꾸는 것만으로<br />
                    어느 정도의 추가 수익이 발생하는지 확인해보세요.
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

            {/* 기준 정보 */}
            {extraData && (
                <div className="bg-white border-2 border-gray-300 rounded-xl p-6 mb-8 shadow-sm">
                    <div className="inline-block bg-gray-600 text-white px-3 py-1 rounded-xl text-xs font-semibold mb-3">
                        기준
                    </div>
                    <div className="flex justify-between items-center flex-wrap gap-5">
                        <div className="text-xl font-semibold text-primary">
                            ABC 투자 (개인)
                        </div>
                        <div className="flex gap-8">
                            <div className="flex flex-col items-end">
                                <span className="text-xs text-gray-600 mb-1">연간 (세후)</span>
                                <span className="text-2xl font-bold text-primary">
                                    {formatCurrency(extraData.base.annual)}
                                </span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs text-gray-600 mb-1">월간 (세후)</span>
                                <span className="text-2xl font-bold text-primary">
                                    {formatCurrency(extraData.base.monthly)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 결과 라벨 */}
            <div className="text-right mb-4">
                <span className="text-sm text-gray-500 font-medium tracking-wide">
                    단위: 원 (세후 수익 기준)
                </span>
            </div>

            {/* 추가 수익 결과 */}
            {extraData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {extraData.products.map((product: any) => (
                        <div
                            key={product.code}
                            className={`result-card ${product.hasExtra ? 'border-green-600' : ''
                                } ${product.isBest ? 'best' : ''}`}
                        >
                            {product.isBest && (
                                <div className="absolute -top-2 left-4 bg-accent text-white px-3 py-1 rounded-xl text-xs font-semibold shadow-sm">
                                    최고 추가 수익
                                </div>
                            )}

                            <div className="flex justify-between items-center mb-5 pb-4 border-b-2 border-secondary">
                                <div className="text-lg font-semibold text-primary">
                                    {product.name}
                                </div>
                                <div className="text-base font-semibold text-accent">
                                    {product.rate}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 font-medium">연간 추가 수익</span>
                                    <span className={`text-2xl font-bold ${product.annual > 0 ? 'text-green-600' :
                                            product.annual < 0 ? 'text-orange-600' :
                                                'text-gray-400'
                                        }`}>
                                        {formatCurrencyWithSign(product.annual)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 font-medium">월간 추가 수익</span>
                                    <span className={`text-2xl font-bold ${product.monthly > 0 ? 'text-green-600' :
                                            product.monthly < 0 ? 'text-orange-600' :
                                                'text-gray-400'
                                        }`}>
                                        {formatCurrencyWithSign(product.monthly)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
