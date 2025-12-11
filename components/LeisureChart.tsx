'use client';

import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { formatCurrency } from '@/lib/formatters';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface LeisureChartProps {
    afterTaxAnnual: number;
    depositAfterTaxAnnual: number;
    extraAnnual: number;
}

export default function LeisureChart({ afterTaxAnnual, depositAfterTaxAnnual, extraAnnual }: LeisureChartProps) {
    const data = {
        labels: ['선택한 전략\n(세후 연 수익)', '예금\n(세후 연 수익)', '추가 여유\n(예금 대비)'],
        datasets: [
            {
                label: '금액 (원)',
                data: [afterTaxAnnual, depositAfterTaxAnnual, extraAnnual],
                backgroundColor: [
                    'rgba(5, 60, 60, 0.85)',
                    'rgba(224, 219, 209, 0.85)',
                    'rgba(212, 165, 116, 0.85)',
                ],
                borderColor: [
                    'rgba(5, 60, 60, 1)',
                    'rgba(224, 219, 209, 1)',
                    'rgba(212, 165, 116, 1)',
                ],
                borderWidth: 1.5,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2.2,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(5, 60, 60, 0.95)',
                padding: 12,
                titleFont: {
                    size: 13,
                    weight: '500' as const,
                },
                bodyFont: {
                    size: 14,
                    weight: '600' as const,
                },
                callbacks: {
                    label: function (context: any) {
                        return formatCurrency(Math.abs(context.parsed.y)) + '원';
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false,
                },
                ticks: {
                    font: {
                        size: 11,
                    },
                    callback: function (value: any) {
                        return formatCurrency(value) + '원';
                    },
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 11,
                        weight: '500' as const,
                    },
                },
            },
        },
    };

    return <Bar data={data} options={options} />;
}
