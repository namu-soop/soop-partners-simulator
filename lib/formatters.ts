/**
 * 통화 포맷팅 함수
 */
export function formatCurrency(value: number | null | undefined): string {
    if (value == null || isNaN(value)) {
        return '0';
    }
    return Math.round(value).toLocaleString('ko-KR');
}

/**
 * 정확한 통화 포맷팅 (반올림 없음)
 */
export function formatCurrencyExact(value: number | null | undefined): string {
    if (value == null || isNaN(value)) {
        return '0';
    }
    return Math.floor(value).toLocaleString('ko-KR');
}

/**
 * 부호가 포함된 통화 포맷팅
 */
export function formatCurrencyWithSign(value: number | null | undefined): string {
    if (value == null || isNaN(value)) {
        return '0';
    }
    const formatted = Math.round(Math.abs(value)).toLocaleString('ko-KR');
    if (value > 0) {
        return '+' + formatted;
    } else if (value < 0) {
        return '-' + formatted;
    } else {
        return formatted;
    }
}

/**
 * 금액 입력 필드 포맷팅
 */
export function formatMoneyInput(value: string): string {
    // 숫자만 추출
    const numbersOnly = value.replace(/[^\d]/g, '');

    if (numbersOnly === '') {
        return '';
    }

    // 숫자로 변환 후 콤마 추가
    const num = parseInt(numbersOnly, 10);
    return num.toLocaleString('ko-KR');
}

/**
 * 숫자를 한글로 변환
 */
export function numberToKorean(num: number): string {
    if (num === 0) return '영원';

    const units = ['', '만', '억', '조'];
    const digitUnits = ['', '십', '백', '천'];
    const numbers = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];

    let result = '';
    let unitIndex = 0;

    while (num > 0) {
        const part = num % 10000;
        if (part > 0) {
            let partStr = '';
            let partNum = part;

            for (let i = 0; i < 4; i++) {
                const digit = partNum % 10;
                if (digit > 0) {
                    // 1천, 1백, 1십의 경우 '일' 생략
                    if (digit === 1 && i > 0) {
                        partStr = digitUnits[i] + partStr;
                    } else {
                        partStr = numbers[digit] + digitUnits[i] + partStr;
                    }
                }
                partNum = Math.floor(partNum / 10);
            }

            result = partStr + units[unitIndex] + result;
        }

        num = Math.floor(num / 10000);
        unitIndex++;
    }

    return result + '원';
}

/**
 * 금액 클래스 반환 (양수/음수/0)
 */
export function getAmountClass(amount: number): string {
    if (amount > 0) {
        return 'positive';
    } else if (amount < 0) {
        return 'negative';
    } else {
        return 'zero';
    }
}
