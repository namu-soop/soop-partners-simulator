'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { calculateInvestment } from '@/lib/calculations';
import { formatCurrency, formatMoneyInput, numberToKorean } from '@/lib/formatters';
import LeisureChart from '@/components/LeisureChart';
import type { SimulationResult } from '@/lib/types';

export default function SimulatorPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // URL 파라미터에서 초기값 로드
    const initialAmount = searchParams.get('amount') || '';
    const initialProduct = searchParams.get('product') || 'abc';
    const initialType = searchParams.get('type') || 'individual';
    const initialPeriod = searchParams.get('period') || '1';

    const [inputAmount, setInputAmount] = useState(initialAmount ? formatMoneyInput(initialAmount) : '');
    const [koreanAmount, setKoreanAmount] = useState('');
    const [product, setProduct] = useState(initialProduct);
    const [customerType, setCustomerType] = useState(initialType);
    const [period, setPeriod] = useState(initialPeriod);
    const [result, setResult] = useState<SimulationResult | null>(null);

    // URL 파라미터가 있으면 초기 계산 실행
    useState(() => {
        if (initialAmount) {
            handleSimulate();
        }
    });

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatMoneyInput(e.target.value);
        setInputAmount(formatted);

        const numValue = parseInt(formatted.replace(/,/g, ''), 10);
        if (numValue > 0) {
            setKoreanAmount(numberToKorean(numValue));
        } else {
            setKoreanAmount('');
        }
    };

    const handleSimulate = () => {
        const amount = parseFloat(inputAmount.replace(/,/g, ''));

        if (!amount || amount <= 0) {
            alert('올바른 투자 금액을 입력해주세요.');
            return;
        }

        const periodYears = parseFloat(period);
        if (periodYears < 0.5) {
            alert('투자 기간은 최소 0.5년 이상이어야 합니다.');
            return;
        }

        // 계산 실행
        const simulationResult = calculateInvestment({
            amount,
            product,
            customerType,
            periodYears,
        });

        setResult(simulationResult);

        // URL 업데이트 (공유 가능하도록)
        const params = new URLSearchParams({
            amount: amount.toString(),
            product,
            type: customerType,
            period: period,
        });
        router.push(`/simulator?${params.toString()}`, { scroll: false });
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        alert('결과 페이지 URL이 클립보드에 복사되었습니다!\n이 링크를 공유하면 동일한 결과를 확인할 수 있습니다.');
    };

    return (
        <div className="container mx-auto px-6 fade-in">
            <div className="page-header">
                <h2>
                    숲파트너스와 함께하는 나의 삶,
                    <br />
                    지금보다 얼마나 더 깊고 여유로워질 수 있을까요?
                </h2>
                <p>
                    숫자는 자산을 말하지만, 여유는 삶을 말합니다.
                    <br />
                    당신의 선택이 어떤 변화를 만들어낼 수 있는지 차분히 살펴보세요.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
                {/* 입력 패널 */}
                <div className="bg-white rounded-xl p-8 shadow-sm h-fit lg:sticky lg:top-[120px]">
                    <div className="space-y-6">
                        {/* 투자 금액 */}
                        <div>
                            <label className="block font-semibold text-gray-900 mb-2 text-sm">
                                어떤 규모의 자산을 계획하고 계신가요?
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputAmount}
                                    onChange={handleAmountChange}
                                    placeholder="예: 500,000,000"
                                    className="input-field pr-12"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-base font-semibold pointer-events-none">
                                    원
                                </span>
                            </div>
                            {koreanAmount && (
                                <div className="mt-1 text-accent text-sm font-semibold">
                                    {koreanAmount}
                                </div>
                            )}
                        </div>

                        {/* 상품 선택 */}
                        <div>
                            <label className="block font-semibold text-gray-900 mb-2 text-sm">
                                당신의 자산을 어떤 방식으로 성장시키고 싶으신가요?
                            </label>
                            <select
                                value={product}
                                onChange={(e) => setProduct(e.target.value)}
                                className="input-field"
                            >
                                <option value="abc">ABC 투자 (8%)</option>
                                <option value="year1">1년 기간형 투자 (8.5%)</option>
                                <option value="year2">2년 기간형 투자 (9%)</option>
                                <option value="mix_a">혼합 A (8.75%)</option>
                                <option value="mix_b">혼합 B (8.5%)</option>
                                <option value="mix_c">혼합 C (8.25%)</option>
                            </select>
                        </div>

                        {/* 고객 유형 */}
                        <div>
                            <label className="block font-semibold text-gray-900 mb-2 text-sm">
                                고객 유형
                            </label>
                            <select
                                value={customerType}
                                onChange={(e) => setCustomerType(e.target.value)}
                                className="input-field"
                            >
                                <option value="individual">개인</option>
                                <option value="general_corp">일반 법인</option>
                                <option value="loan_corp">대부 법인</option>
                            </select>
                        </div>

                        {/* 투자 기간 */}
                        <div>
                            <label className="block font-semibold text-gray-900 mb-2 text-sm">
                                계획하신 기간을 선택해주세요
                            </label>
                            <input
                                type="number"
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                                placeholder="예: 1"
                                min="0.5"
                                max="10"
                                step="0.5"
                                className="input-field"
                            />
                            <small className="block mt-1 text-xs text-gray-500">
                                0.5년 단위로 입력 가능
                            </small>
                        </div>

                        <button
                            onClick={handleSimulate}
                            className="w-full btn-primary mt-2"
                        >
                            내 자산의 성장 그려보기
                        </button>
                    </div>
                </div>

                {/* 결과 패널 */}
                <div className="bg-white rounded-xl p-8 shadow-sm min-h-[500px]">
                    {!result ? (
                        <div className="flex items-center justify-center h-full min-h-[500px]">
                            <div className="text-center text-gray-400">
                                <svg
                                    className="w-20 h-20 mx-auto mb-4 opacity-30"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5" />
                                    <path d="M2 12l10 5 10-5" />
                                </svg>
                                <p className="text-lg leading-relaxed">
                                    당신의 자산 계획을 입력해주세요
                                    <br />
                                    선택에 따라 삶이 만들어내는 공간은 달라집니다
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="fade-in">
                            {/* 결과 헤더 */}
                            <div className="text-center mb-12 p-10 bg-gradient-to-br from-primary to-primary/90 rounded-xl text-white">
                                <h3 className="text-2xl font-semibold mb-4 leading-tight tracking-tight">
                                    당신의 선택이 만들어낸 여유입니다
                                </h3>
                                <p className="text-sm opacity-90 mb-2">
                                    {result.productName} | {formatCurrency(result.investmentAmount)}원 | 수익률 {result.rate.toFixed(2)}%
                                </p>
                                <p className="text-xs opacity-75 leading-relaxed">
                                    조용하지만 확실하게, 자산이 자라는 속도를 확인해보세요
                                </p>
                            </div>

                            {/* 4개 핵심 카드 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                <div className="bg-white border border-primary/10 rounded-xl p-7 shadow-md text-center transition-all hover:-translate-y-1 hover:shadow-xl">
                                    <div className="text-xs text-gray-600 mb-3 font-medium tracking-tight">
                                        세후 연 수익
                                    </div>
                                    <div className="text-3xl font-bold text-primary tracking-tighter">
                                        {formatCurrency(result.afterTaxAnnual)}
                                        <span className="text-base font-medium ml-1">원</span>
                                    </div>
                                </div>

                                <div className="bg-white border border-primary/10 rounded-xl p-7 shadow-md text-center transition-all hover:-translate-y-1 hover:shadow-xl">
                                    <div className="text-xs text-gray-600 mb-3 font-medium tracking-tight">
                                        세후 월 수익
                                    </div>
                                    <div className="text-3xl font-bold text-primary tracking-tighter">
                                        {formatCurrency(result.afterTaxMonthly)}
                                        <span className="text-base font-medium ml-1">원</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-secondary to-secondary/50 border-2 border-accent rounded-xl p-7 shadow-md text-center transition-all hover:-translate-y-1 hover:shadow-xl">
                                    <div className="text-xs text-gray-600 mb-3 font-medium tracking-tight">
                                        예금 대비 연 추가 수익
                                    </div>
                                    <div className="text-3xl font-bold text-green-600 tracking-tighter">
                                        +{formatCurrency(result.extraAnnual)}
                                        <span className="text-base font-medium ml-1">원</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-secondary to-secondary/50 border-2 border-accent rounded-xl p-7 shadow-md text-center transition-all hover:-translate-y-1 hover:shadow-xl">
                                    <div className="text-xs text-gray-600 mb-3 font-medium tracking-tight">
                                        예금 대비 월 추가 수익
                                    </div>
                                    <div className="text-3xl font-bold text-green-600 tracking-tighter">
                                        +{formatCurrency(result.extraMonthly)}
                                        <span className="text-base font-medium ml-1">원</span>
                                    </div>
                                </div>
                            </div>

                            {/* 메시지 */}
                            <div className="text-center mb-12 p-6 bg-gray-50 rounded-lg">
                                <p className="text-base text-gray-600 leading-relaxed">
                                    동일한 금액이라도, 선택에 따라 삶이 만들어내는 공간은 달라집니다.
                                </p>
                            </div>

                            {/* 삶의 여유 환산 */}
                            <div className="bg-white border border-primary/5 rounded-xl p-10 mb-12 shadow-md">
                                <h4 className="text-2xl font-semibold text-primary mb-2 text-center tracking-tight leading-relaxed">
                                    이 정도 수익이라면, 한 달의 리듬이 이렇게 달라집니다
                                </h4>
                                <p className="text-sm text-gray-600 mb-8 text-center">
                                    당신의 일상에 자연스럽게 스며드는 여유들을 담아보았습니다
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {result.lifestyle.familyMeal > 0 && (
                                        <div>
                                            <h5 className="font-semibold text-gray-900 mb-3">가족과의 시간</h5>
                                            <div className="space-y-2">
                                                <div className="flex items-start">
                                                    <span className="text-green-600 mr-2">✓</span>
                                                    <div className="flex-1 text-sm text-gray-700">
                                                        <span>편안한 한식·퓨전 식사</span>
                                                        <span className="ml-2 font-semibold text-accent">약 {result.lifestyle.familyMeal}회</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <span className="text-green-600 mr-2">✓</span>
                                                    <div className="flex-1 text-sm text-gray-700">
                                                        <span>기념일이나 여유로운 저녁 외식</span>
                                                        <span className="ml-2 font-semibold text-accent">약 {Math.floor(result.lifestyle.familyMeal * 0.6)}회</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {result.lifestyle.meeting > 0 && (
                                        <div>
                                            <h5 className="font-semibold text-gray-900 mb-3">지인과의 만남</h5>
                                            <div className="space-y-2">
                                                <div className="flex items-start">
                                                    <span className="text-green-600 mr-2">✓</span>
                                                    <div className="flex-1 text-sm text-gray-700">
                                                        <span>점심 모임</span>
                                                        <span className="ml-2 font-semibold text-accent">약 {result.lifestyle.meeting}회</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <span className="text-green-600 mr-2">✓</span>
                                                    <div className="flex-1 text-sm text-gray-700">
                                                        <span>조용한 레스토랑에서의 식사</span>
                                                        <span className="ml-2 font-semibold text-accent">약 {Math.floor(result.lifestyle.meeting * 0.3)}회</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {result.lifestyle.hobby > 0 && (
                                        <div>
                                            <h5 className="font-semibold text-gray-900 mb-3">취미와 자기관리</h5>
                                            <div className="space-y-2">
                                                <div className="flex items-start">
                                                    <span className="text-green-600 mr-2">✓</span>
                                                    <div className="flex-1 text-sm text-gray-700">
                                                        <span>가벼운 취미 강좌</span>
                                                        <span className="ml-2 font-semibold text-accent">약 {result.lifestyle.hobby}개</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <span className="text-green-600 mr-2">✓</span>
                                                    <div className="flex-1 text-sm text-gray-700">
                                                        <span>개인 레슨 혹은 소규모 클래스</span>
                                                        <span className="ml-2 font-semibold text-accent">약 {Math.floor(result.lifestyle.hobby * 2)}회</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {result.lifestyle.healthCare > 0 && (
                                        <div>
                                            <h5 className="font-semibold text-gray-900 mb-3">건강을 위한 루틴</h5>
                                            <div className="space-y-2">
                                                <div className="flex items-start">
                                                    <span className="text-green-600 mr-2">✓</span>
                                                    <div className="flex-1 text-sm text-gray-700">
                                                        <span>필라테스·요가 등 정기 케어</span>
                                                        <span className="ml-2 font-semibold text-accent">약 {result.lifestyle.healthCare}회</span>
                                                    </div>
                                                </div>
                                                {result.lifestyle.golf > 0 && (
                                                    <div className="flex items-start">
                                                        <span className="text-green-600 mr-2">✓</span>
                                                        <div className="flex-1 text-sm text-gray-700">
                                                            <span>골프 라운딩</span>
                                                            <span className="ml-2 font-semibold text-accent">약 {result.lifestyle.golf}회</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {result.lifestyle.shortTrip > 0 && (
                                        <div>
                                            <h5 className="font-semibold text-gray-900 mb-3">재충전의 시간</h5>
                                            <div className="space-y-2">
                                                <div className="flex items-start">
                                                    <span className="text-green-600 mr-2">✓</span>
                                                    <div className="flex-1 text-sm text-gray-700">
                                                        <span>근교 1박 여행</span>
                                                        <span className="ml-2 font-semibold text-accent">약 {result.lifestyle.shortTrip}회</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <span className="text-green-600 mr-2">✓</span>
                                                    <div className="flex-1 text-sm text-gray-700">
                                                        <span>나만의 고요한 시간</span>
                                                        <span className="ml-2 font-semibold text-accent">약 {result.lifestyle.personalTime}시간</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <p className="mt-8 text-sm text-gray-600 text-center leading-relaxed">
                                    지출의 목적이 아닌, 삶의 리듬을 위한 여유.
                                    <br />
                                    숲파트너스는 그 균형을 함께 설계합니다.
                                </p>
                            </div>

                            {/* 시간 가치 */}
                            <div className="bg-gradient-to-br from-primary to-primary/90 text-white rounded-xl p-10 mb-12 text-center">
                                <h4 className="text-2xl font-semibold mb-6 leading-relaxed tracking-tight">
                                    예금에 두었을 때보다
                                    <br />
                                    당신에게 돌아오는 &quot;시간&quot;이 더 많습니다
                                </h4>
                                <div className="text-5xl font-bold mb-4 tracking-tighter">
                                    연 {formatCurrency(Math.floor(result.leisureHours))}
                                    <span className="text-2xl font-medium ml-2">시간</span>
                                </div>
                                <div className="text-sm opacity-90 leading-relaxed">
                                    자산에서 얻는 건 숫자가 아니라,
                                    <br />
                                    내 삶의 속도를 다시 선택할 수 있는 힘입니다
                                </div>
                            </div>

                            {/* 차트 */}
                            <div className="mt-8 pt-8 border-t-2 border-gray-300">
                                <h4 className="text-xl font-semibold text-primary mb-4 text-center">
                                    선택의 차이는 시간이 지날수록 더 크게 드러납니다
                                </h4>
                                <div className="max-w-3xl mx-auto">
                                    <LeisureChart
                                        afterTaxAnnual={result.afterTaxAnnual}
                                        depositAfterTaxAnnual={result.depositAfterTaxAnnual}
                                        extraAnnual={result.extraAnnual}
                                    />
                                </div>
                            </div>

                            {/* 마무리 메시지 */}
                            <div className="mt-12 text-center p-8 bg-gray-50 rounded-xl">
                                <h4 className="text-2xl font-bold text-gray-900 mb-3">
                                    지금의 선택이, 내일의 품격을 만듭니다
                                </h4>
                                <p className="text-gray-600 leading-relaxed">
                                    숲파트너스는 단순한 수익이 아닌
                                    <br />
                                    당신의 삶 전체를 바라보는 금융 파트너입니다
                                </p>
                            </div>

                            {/* 공유 버튼 */}
                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={handleShare}
                                    className="px-8 py-3 bg-secondary text-gray-900 font-semibold rounded-lg border-2 border-secondary transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary"
                                >
                                    결과 페이지 공유하기
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
