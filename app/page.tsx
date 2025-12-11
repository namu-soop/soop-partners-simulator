import { getInvestmentData } from '@/lib/dataService';

export default function Home() {
    const data = getInvestmentData();
    const { products, investorTypes } = data;

    // 기본 상품과 혼합형 상품 분리
    const basicProducts = products.filter(p => !p.code.startsWith('mix_'));
    const mixProducts = products.filter(p => p.code.startsWith('mix_'));

    return (
        <div className="container mx-auto px-6 fade-in">
            {/* 상품 안내 섹션 */}
            <div className="page-header">
                <h2>투자 상품 안내</h2>
                <p>고객님의 투자 목적과 성향에 맞춰 가장 적합한 전략을 제안드립니다</p>
            </div>

            {/* 기본 상품 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {basicProducts.map((product) => (
                    <div
                        key={product.code}
                        className={`product-card ${product.recommended ? 'border-2 border-accent' : ''}`}
                    >
                        {product.recommended && (
                            <div className="absolute -top-2 left-4 bg-accent text-white px-3 py-1 rounded-xl text-xs font-semibold shadow-sm">
                                추천
                            </div>
                        )}

                        <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-secondary">
                            <h3 className="text-xl font-semibold text-primary">{product.name}</h3>
                            <span className="text-3xl font-bold text-accent">{product.rateDisplay}</span>
                        </div>

                        <div className="text-gray-600">
                            <p className="text-sm font-semibold text-accent mb-3">
                                {product.subtitle}
                            </p>
                            <ul className="space-y-2">
                                {product.features.map((feature, idx) => (
                                    <li key={idx} className="text-sm flex items-start">
                                        <span className="text-green-600 font-bold mr-2">✓</span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {/* 구분선 */}
            <div className="h-px bg-gray-300 my-12"></div>

            {/* 혼합형 포트폴리오 */}
            <div className="page-header">
                <h2>혼합형 포트폴리오</h2>
                <p>두 가지 전략을 50:50으로 구성한 분산형 포트폴리오입니다</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {mixProducts.map((product) => (
                    <div key={product.code} className="product-card">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-secondary">
                            <h3 className="text-xl font-semibold text-primary">{product.name}</h3>
                            <span className="text-3xl font-bold text-accent">{product.rateDisplay}</span>
                        </div>

                        <div className="text-gray-600">
                            <p className="text-sm font-semibold text-accent mb-3">
                                {product.subtitle}
                            </p>
                            <ul className="space-y-2">
                                {product.features.map((feature, idx) => (
                                    <li key={idx} className="text-sm flex items-start">
                                        <span className="text-green-600 font-bold mr-2">✓</span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {/* 구분선 */}
            <div className="h-px bg-gray-300 my-12"></div>

            {/* 투자자 유형별 안내 */}
            <div className="page-header">
                <h2>투자자 유형별 안내</h2>
                <p>고객 유형에 따라 적용되는 세율과 특징</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-primary text-white">
                            <th className="p-4 text-left font-semibold text-base border-r border-white border-opacity-10">
                                투자자 유형
                            </th>
                            <th className="p-4 text-left font-semibold text-base border-r border-white border-opacity-10">
                                적용 세율 기준
                            </th>
                            <th className="p-4 text-left font-semibold text-base">
                                특징
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {investorTypes.map((type, idx) => (
                            <tr
                                key={type.code}
                                className={`border-b border-gray-200 transition-colors ${type.highlighted ? 'bg-accent bg-opacity-8' : 'hover:bg-gray-50'
                                    } ${idx === investorTypes.length - 1 ? 'border-b-0' : ''}`}
                            >
                                <td className="p-5 font-semibold text-primary text-base align-middle">
                                    {type.name}
                                </td>
                                <td className="p-5 font-bold text-accent text-base align-middle">
                                    {type.taxDisplay}
                                </td>
                                <td className="p-5 text-gray-600 leading-relaxed align-middle">
                                    {type.description}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {investorTypes.find(t => t.note) && (
                    <p className="mt-5 p-4 bg-gray-50 border-l-4 border-accent text-gray-600 text-xs leading-relaxed">
                        ※ {investorTypes.find(t => t.note)?.note}
                    </p>
                )}
            </div>
        </div>
    );
}
