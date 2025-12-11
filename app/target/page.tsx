'use client';

import { useState } from 'react';
import { calculateRequiredInvestment } from '@/lib/calculations';
import { formatCurrency, formatCurrencyExact, formatMoneyInput, numberToKorean } from '@/lib/formatters';
import type { TargetProfitResult } from '@/lib/types';

export default function TargetProfitPage() {
    const [inputValue, setInputValue] = useState('');
    const [koreanAmount, setKoreanAmount] = useState('');
    const [result, setResult] = useState<TargetProfitResult | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatMoneyInput(e.target.value);
        setInputValue(formatted);

        const numValue = parseInt(formatted.replace(/,/g, ''), 10);
        if (numValue > 0) {
            setKoreanAmount(numberToKorean(numValue));
        } else {
            setKoreanAmount('');
        }
    };

    const handleCalculate = () => {
        const targetMonthly = parseFloat(inputValue.replace(/,/g, ''));

        if (!targetMonthly || targetMonthly <= 0) {
            alert('올바른 목표 수익을 입력해주세요.');
            return;
        }

        const calculationResult = calculateRequiredInvestment(targetMonthly);
        setResult(calculationResult);
    };

    return (
        <div className="container mx-auto px-6 max-w-5xl fade-in">
            <div className="page-header">
                <h2>
                    매달 확보하고 싶은 현금흐름을
                    <br />
                    어떤 전략으로 만들 수 있는지 확인해보세요.
                </h2>
            </div>

            {/* 목표 수익 입력 */}
            <div className="max-w-2xl mx-auto mb-12">
                <div className="bg-white rounded-xl p-8 shadow-sm">
                    <label className="block text-lg font-semibold text-primary mb-3">
                        원하시는 월 수익을 입력하세요 (세후 기준)
                    </label>

                    <div className="flex gap-3 mb-2 flex-col sm:flex-row">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                placeholder="예: 3,000,000"
                                className="input-field pr-12"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-lg font-semibold pointer-events-none">
                                원
                            </span>
                        </div>
                        <button
                            onClick={handleCalculate}
                            className="btn-secondary whitespace-nowrap"
                        >
                            계산하기
                        </button>
                    </div>

                    {koreanAmount && (
                        <div className="min-h-[28px] pt-1 text-accent text-sm font-semibold">
                            {koreanAmount}
                        </div>
                    )}
                </div>
            </div>

            {/* 결과 표시 */}
            {result && (
                <div className="fade-in">
                    <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold text-primary mb-2">
                            세후 월 <span className="text-accent">{formatCurrency(result.targetMonthly)}</span>원의
                            <br />
                            현금흐름을 만들기 위한 상품별 필요 투자금
                        </h3>
                    </div>

                    <div className="text-right mb-4">
                        <span className="text-sm text-gray-500 font-medium">단위: 원</span>
                    </div>

                    <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-8">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse min-w-[700px]">
                                <thead>
                                    <tr className="bg-primary text-white">
                                        <th className="p-4 text-left font-semibold text-base w-[18%]">
                                            상품
                                        </th>
                                        <th className="p-4 text-center font-semibold text-base w-[12%] whitespace-nowrap">
                                            세전 수익률
                                        </th>
                                        <th className="p-4 text-center font-semibold text-base w-[23.33%]">
                                            개인
                                        </th>
                                        <th className="p-4 text-center font-semibold text-base w-[23.33%]">
                                            일반법인
                                        </th>
                                        <th className="p-4 text-center font-semibold text-base w-[23.33%]">
                                            대부법인
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.data.map((product, idx) => {
                                        const isRecommended = idx === 2; // 2년 기간형
                                        return (
                                            <tr
                                                key={idx}
                                                className={`border-b border-gray-200 transition-colors ${isRecommended
                                                        ? 'bg-amber-50 hover:bg-amber-100'
                                                        : 'hover:bg-gray-50'
                                                    } ${idx === result.data.length - 1 ? 'border-b-0' : ''}`}
                                            >
                                                <td className="p-6 font-semibold text-primary text-base">
                                                    {product.name}
                                                </td>
                                                <td className="p-6 text-center text-accent font-semibold">
                                                    {product.preTaxRate.toFixed(2)}%
                                                </td>
                                                <td className="p-6 text-center font-semibold text-gray-900 whitespace-nowrap">
                                                    {formatCurrencyExact(product.required.individual)}
                                                </td>
                                                <td className={`p-6 text-center font-semibold whitespace-nowrap ${isRecommended ? 'text-green-600 text-lg' : 'text-gray-900'
                                                    }`}>
                                                    {formatCurrencyExact(product.required.general_corp)}
                                                </td>
                                                <td className={`p-6 text-center font-semibold whitespace-nowrap ${isRecommended ? 'text-green-600 text-lg' : 'text-gray-900'
                                                    }`}>
                                                    {formatCurrencyExact(product.required.loan_corp)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-gray-50 border-l-4 border-primary rounded-lg p-5">
                        <p className="text-xs text-gray-600 leading-relaxed">
                            ※ 세후 수익 기준의 예시 계산이며, 실제 수익은 세무 처리 및 상품 구조에 따라 달라질 수 있습니다.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
