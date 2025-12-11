/**
 * 프리미엄 투자 수익 시뮬레이터
 * Apps Script 서버 로직
 */

// ========================================
// 1. 메인 함수
// ========================================

/**
 * 웹앱 실행 시 HTML 반환
 */
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('프리미엄 투자 수익 시뮬레이터')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * HTML 파일 include 함수
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ========================================
// 2. 상품 데이터 함수
// ========================================

/**
 * 시트에서 상품 데이터 읽기
 */
function get_product_data() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('상품 제안 패키지') || ss.getSheets()[0];
    
    // 상품별 수익률
    var products = {
      'abc': 0.08,      // ABC 투자 8%
      'year1': 0.085,   // 1년 기간형 8.5%
      'year2': 0.09     // 2년 기간형 9%
    };
    
    // 세율 정보
    var tax_rates = {
      'individual': 0.275,    // 개인 27.5%
      'general_corp': 0.209,  // 일반법인 20.9%
      'loan_corp': 0.209      // 대부법인 20.9%
    };
    
    return {
      products: products,
      tax_rates: tax_rates
    };
    
  } catch(e) {
    Logger.log('상품 데이터 읽기 오류: ' + e.toString());
    return null;
  }
}

/**
 * 전체 상품 비교 데이터 가져오기
 */
function get_all_comparison_data() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('상품 제안 패키지') || ss.getSheets()[0];
    
    var data = [];
    var investment_amounts = [500000000, 800000000, 1000000000]; // 5억, 8억, 10억
    
    // 연간 수익 데이터 (10-21행, A-P열까지)
    var annual_range = sheet.getRange('A10:P21').getValues();
    var monthly_range = sheet.getRange('A27:P38').getValues();
    
    // 투자 금액별로 데이터 구성
    for (var i = 0; i < investment_amounts.length; i++) {
      var amount = investment_amounts[i];
      var col_offset = i * 3; // 5억(0), 8억(3), 10억(6)
      
      var amount_data = {
        investment: amount,
        products: []
      };
      
      // 각 상품별 데이터
      var product_rows = [
        {name: 'ABC 투자', row: 0, rate: '8%'},
        {name: '1년 기간형', row: 2, rate: '8.5%'},
        {name: '2년 기간형', row: 4, rate: '9%'},
        {name: '혼합 A', row: 6, rate: '8.75%'},
        {name: '혼합 B', row: 8, rate: '8.5%'},
        {name: '혼합 C', row: 10, rate: '8.25%'}
      ];
      
      product_rows.forEach(function(product) {
        var annual_row = annual_range[product.row];
        var monthly_row = monthly_range[product.row];
        
        // H열=7, I열=8, J열=9 (5억)
        // K열=10, L열=11, M열=12 (8억)
        // N열=13, O열=14, P열=15 (10억)
        amount_data.products.push({
          name: product.name,
          rate: product.rate,
          annual: {
            individual: annual_row[7 + col_offset],
            general_corp: annual_row[8 + col_offset],
            loan_corp: annual_row[9 + col_offset]
          },
          monthly: {
            individual: monthly_row[7 + col_offset],
            general_corp: monthly_row[8 + col_offset],
            loan_corp: monthly_row[9 + col_offset]
          }
        });
      });
      
      data.push(amount_data);
    }
    
    return data;
    
  } catch(e) {
    Logger.log('비교 데이터 가져오기 오류: ' + e.toString());
    return [];
  }
}

/**
 * 추가 수익 비교 데이터 가져오기
 * 무조건 ABC 투자 (개인)을 기준으로 추가 수익 계산
 */
function get_extra_profit_data() {
  try {
    var all_data = get_all_comparison_data();
    var result = [];
    
    all_data.forEach(function(amount_data) {
      // 기준: 항상 ABC 투자 (개인)
      var base_abc = amount_data.products[0]; // ABC 투자
      var base_individual_annual = base_abc.annual.individual;
      var base_individual_monthly = base_abc.monthly.individual;
      
      var extra_data = {
        investment: amount_data.investment,
        base: {
          annual: base_individual_annual,
          monthly: base_individual_monthly
        },
        products: []
      };
      
      // 각 상품별 추가 수익 계산 (모두 개인 기준으로)
      amount_data.products.forEach(function(product) {
        extra_data.products.push({
          name: product.name,
          rate: product.rate,
          annual: {
            individual: product.annual.individual - base_individual_annual,
            general_corp: product.annual.general_corp - base_individual_annual,
            loan_corp: product.annual.loan_corp - base_individual_annual
          },
          monthly: {
            individual: product.monthly.individual - base_individual_monthly,
            general_corp: product.monthly.general_corp - base_individual_monthly,
            loan_corp: product.monthly.loan_corp - base_individual_monthly
          }
        });
      });
      
      result.push(extra_data);
    });
    
    return result;
    
  } catch(e) {
    Logger.log('추가 수익 데이터 오류: ' + e.toString());
    return [];
  }
}

// ========================================
// 3. 시뮬레이션 계산 함수
// ========================================

/**
 * 노후 여유 시뮬레이터 계산 (세후 기준)
 */
function calculate_investment(params) {
  try {
    var amount = parseFloat(params.amount);
    var product = params.product;
    var customer_type = params.customer_type;
    var period_years = parseFloat(params.period_years);
    
    // 상품별 수익률
    var rates = {
      'abc': 0.08,
      'year1': 0.085,
      'year2': 0.09,
      'mix_a': 0.0875,
      'mix_b': 0.085,
      'mix_c': 0.0825
    };
    
    // 세율
    var tax_rates = {
      'individual': 0.275,
      'general_corp': 0.209,
      'loan_corp': 0
    };
    
    var rate = rates[product] || 0.08;
    var tax = tax_rates[customer_type] || 0.275;
    
    // 1) 세후 연 수익
    var after_tax_annual = amount * rate * (1 - tax);
    
    // 2) 세후 월 수익
    var after_tax_monthly = after_tax_annual / 12;
    
    // 3) 예금 세후 연 수익 (2.25% 세전, 15.4% 세율 → 1.9035% 세후)
    var deposit_after_tax_rate = 0.019035;
    var deposit_after_tax_annual = amount * deposit_after_tax_rate;
    
    // 4) 예금 대비 연 추가 수익
    var extra_annual = after_tax_annual - deposit_after_tax_annual;
    
    // 5) 예금 대비 월 추가 수익
    var extra_monthly = extra_annual / 12;
    
    // 6) 여유 시간 (최저시급 10,030원 기준)
    var leisure_hours = extra_annual / 10030;
    
    // 7) 삶의 여유 환산 (월 추가 수익 기준 - 실제 소비 패턴 반영)
    var lifestyle = {
      family_meal: Math.floor(extra_monthly / 150000),       // 가족과의 식사 (10~20만원대)
      golf: Math.floor(extra_monthly / 350000),              // 골프 라운딩 (25~45만원대)
      meeting: Math.floor(extra_monthly / 25000),            // 지인과의 점심 모임 (2~3만원대)
      hobby: Math.floor(extra_monthly / 175000),             // 가벼운 취미 강좌 (월 10~25만원)
      short_trip: Math.floor(extra_monthly / 300000),        // 근교 1박 여행 (20~40만원)
      health_care: Math.floor(extra_monthly / 185000),       // 건강관리 (필라테스/요가 월 12~25만원)
      personal_time: Math.floor(extra_monthly / 10030)       // 나만의 시간 (최저시급 기준)
    };
    
    return {
      success: true,
      data: {
        investment_amount: amount,
        product_name: get_product_name(product),
        rate: rate * 100,
        period_years: period_years,
        customer_type: customer_type,
        
        // 세후 수익
        after_tax_annual: after_tax_annual,
        after_tax_monthly: after_tax_monthly,
        
        // 예금 비교
        deposit_after_tax_annual: deposit_after_tax_annual,
        extra_annual: extra_annual,
        extra_monthly: extra_monthly,
        
        // 여유 환산
        leisure_hours: leisure_hours,
        lifestyle: lifestyle
      }
    };
    
  } catch(e) {
    Logger.log('계산 오류: ' + e.toString());
    return {
      success: false,
      error: e.toString()
    };
  }
}

/**
 * 상품명 반환
 */
function get_product_name(code) {
  var names = {
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
 * 목표 수익 달성을 위한 필요 투자금 계산 (세후 기준)
 */
function calculate_required_investment(target_monthly_profit) {
  try {
    var target_monthly = parseFloat(target_monthly_profit);
    
    // 상품별 세전 수익률
    var products = [
      {code: 'abc', name: 'ABC 투자', rate: 0.08},
      {code: 'year1', name: '1년 기간형', rate: 0.085},
      {code: 'year2', name: '2년 기간형', rate: 0.09},
      {code: 'mix_a', name: '혼합 A', rate: 0.0875},
      {code: 'mix_b', name: '혼합 B', rate: 0.085},
      {code: 'mix_c', name: '혼합 C', rate: 0.0825}
    ];
    
    // 세율
    var tax_rates = {
      'individual': 0.275,      // 개인 27.5%
      'general_corp': 0.209,    // 일반법인 20.9%
      'loan_corp': 0            // 대부법인 0%
    };
    
    var result = [];
    
    products.forEach(function(product) {
      var product_result = {
        name: product.name,
        pre_tax_rate: product.rate * 100,  // 세전 수익률(%)
        after_tax_rates: {},                // 세후 수익률(%)
        required: {}                        // 필요 투자금
      };
      
      // 각 투자자 유형별 세후 수익률 및 필요 투자금 계산
      Object.keys(tax_rates).forEach(function(type) {
        var tax = tax_rates[type];
        
        // 세후 수익률 = 세전 수익률 × (1 - 세율)
        var after_tax_rate = product.rate * (1 - tax);
        product_result.after_tax_rates[type] = after_tax_rate * 100; // %로 저장
        
        // 월 세후 수익률
        var monthly_after_tax_rate = after_tax_rate / 12;
        
        // 필요 투자금 = 목표 월 수익 / 월 세후 수익률
        var required_investment = target_monthly / monthly_after_tax_rate;
        
        // 반올림 금지 - 정확한 금액 저장
        product_result.required[type] = required_investment;
      });
      
      result.push(product_result);
    });
    
    return {
      success: true,
      target_monthly: target_monthly,
      data: result
    };
    
  } catch(e) {
    Logger.log('목표 수익 계산 오류: ' + e.toString());
    return {
      success: false,
      error: e.toString()
    };
  }
}

/**
 * 주요 인사이트 생성 (프리미엄 금융 톤)
 */
function get_comparison_insights(investment_amount, investor_type) {
  try {
    var all_data = get_all_comparison_data();
    
    var amount_data = all_data.find(function(item) {
      return item.investment === investment_amount;
    });
    
    if (!amount_data) {
      return {success: false, error: '데이터 없음'};
    }
    
    var insights = [];
    
    // 1) 투자 상품에 따른 수익 격차 (ABC vs 2년 기간형)
    var abc_profit = amount_data.products[0].annual[investor_type];
    var year2_profit = amount_data.products[2].annual[investor_type];
    var diff = year2_profit - abc_profit;
    
    if (diff > 0) {
      insights.push({
        type: 'compare',
        title: '투자 상품에 따른 수익 격차',
        message: '2년 기간형은 ABC 투자 대비 연 <span class="highlight-amount">+' + format_number_kr(diff) + '원</span>의 추가 수익을 기대할 수 있습니다.'
      });
    }
    
    // 2) 투자자 유형별 차이
    var type_insights = get_investor_type_insights(amount_data, investor_type);
    if (type_insights.length > 0) {
      insights.push({
        type: 'entity',
        title: '투자자 유형별 차이',
        message: type_insights.join('<br>')
      });
    }
    
    return {
      success: true,
      insights: insights
    };
    
  } catch(e) {
    Logger.log('인사이트 생성 오류: ' + e.toString());
    return {
      success: false,
      error: e.toString()
    };
  }
}

/**
 * 투자자 유형별 인사이트 생성
 */
function get_investor_type_insights(amount_data, current_type) {
  var messages = [];
  
  // 2년 기간형 기준으로 비교 (가장 수익률 높은 상품)
  var year2 = amount_data.products[2];
  
  var individual_profit = year2.annual.individual;
  var general_corp_profit = year2.annual.general_corp;
  var loan_corp_profit = year2.annual.loan_corp;
  
  if (current_type === 'individual') {
    // 개인 선택 시
    var diff_general = general_corp_profit - individual_profit;
    var diff_loan = loan_corp_profit - individual_profit;
    
    if (diff_general > 0) {
      messages.push('• 일반 법인 선택 시 연 <span class="highlight-amount">+' + format_number_kr(diff_general) + '원</span> 더 높은 수익입니다.');
    }
    if (diff_loan > 0) {
      messages.push('• 대부 법인 선택 시 연 <span class="highlight-amount">+' + format_number_kr(diff_loan) + '원</span>의 추가 수익입니다.');
    }
    
  } else if (current_type === 'general_corp') {
    // 일반법인 선택 시
    var diff_individual = general_corp_profit - individual_profit;
    var diff_loan = loan_corp_profit - general_corp_profit;
    
    if (diff_individual > 0) {
      messages.push('• 개인 대비 연 <span class="highlight-amount">+' + format_number_kr(diff_individual) + '원</span> 더 높은 수익입니다.');
    }
    if (diff_loan > 0) {
      messages.push('• 대부 법인 선택 시 연 <span class="highlight-amount">+' + format_number_kr(diff_loan) + '원</span>의 추가 수익입니다.');
    }
    
  } else if (current_type === 'loan_corp') {
    // 대부법인 선택 시
    var diff_general = loan_corp_profit - general_corp_profit;
    var diff_individual = loan_corp_profit - individual_profit;
    
    if (diff_general > 0) {
      messages.push('• 일반 법인 대비 연 <span class="highlight-amount">+' + format_number_kr(diff_general) + '원</span> 더 높은 수익입니다.');
    }
    if (diff_individual > 0) {
      messages.push('• 개인 대비 연 <span class="highlight-amount">+' + format_number_kr(diff_individual) + '원</span> 높은 수익입니다.');
    }
  }
  
  return messages;
}

/**
 * 숫자 포맷팅 (한국어)
 */
function format_number_kr(num) {
  return Math.round(num).toLocaleString('ko-KR');
}

// ========================================
// 4. 결과 내보내기 함수
// ========================================

/**
 * 결과를 새 시트로 내보내기
 */
function export_to_sheet(result_data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var timestamp = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
    var sheet_name = '시뮬레이션_' + Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyyMMdd_HHmmss');
    
    // 새 시트 생성
    var sheet = ss.insertSheet(sheet_name);
    
    // 헤더
    sheet.getRange('A1:B1').merge().setValue('투자 수익 시뮬레이션 결과');
    sheet.getRange('A1:B1').setFontWeight('bold').setFontSize(14);
    
    // 데이터 입력
    var row = 3;
    sheet.getRange(row, 1).setValue('작성일시:');
    sheet.getRange(row, 2).setValue(timestamp);
    row += 2;
    
    sheet.getRange(row, 1).setValue('투자금액:');
    sheet.getRange(row, 2).setValue(result_data.investment_amount).setNumberFormat('#,##0');
    row++;
    
    sheet.getRange(row, 1).setValue('상품명:');
    sheet.getRange(row, 2).setValue(result_data.product_name);
    row++;
    
    sheet.getRange(row, 1).setValue('수익률:');
    sheet.getRange(row, 2).setValue(result_data.rate + '%');
    row++;
    
    sheet.getRange(row, 1).setValue('투자기간:');
    sheet.getRange(row, 2).setValue(result_data.period_years + '년');
    row += 2;
    
    sheet.getRange(row, 1).setValue('세전 수익:');
    sheet.getRange(row, 2).setValue(result_data.gross_profit).setNumberFormat('#,##0');
    row++;
    
    sheet.getRange(row, 1).setValue('세금:');
    sheet.getRange(row, 2).setValue(result_data.tax_amount).setNumberFormat('#,##0');
    row++;
    
    sheet.getRange(row, 1).setValue('세후 수익:');
    sheet.getRange(row, 2).setValue(result_data.net_profit).setNumberFormat('#,##0');
    sheet.getRange(row, 1, 1, 2).setFontWeight('bold');
    row++;
    
    sheet.getRange(row, 1).setValue('월 수익:');
    sheet.getRange(row, 2).setValue(result_data.monthly_profit).setNumberFormat('#,##0');
    row += 2;
    
    sheet.getRange(row, 1).setValue('예금 대비 초과 수익:');
    sheet.getRange(row, 2).setValue(result_data.extra_profit).setNumberFormat('#,##0');
    sheet.getRange(row, 1, 1, 2).setBackground('#e0dbd1');
    
    // 열 너비 조정
    sheet.setColumnWidth(1, 200);
    sheet.setColumnWidth(2, 150);
    
    return {
      success: true,
      sheet_name: sheet_name,
      url: ss.getUrl() + '#gid=' + sheet.getSheetId()
    };
    
  } catch(e) {
    Logger.log('시트 내보내기 오류: ' + e.toString());
    return {
      success: false,
      error: e.toString()
    };
  }
}
