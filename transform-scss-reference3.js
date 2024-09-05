// Node.js 환경에서 Style Dictionary 라이브러리를 가져옵니다.
// 이 라이브러리는 디자인 토큰을 다양한 형식으로 변환하는 도구입니다.
const StyleDictionary = require("style-dictionary");

// 날짜를 읽기 쉽게 포맷팅하는 함수입니다. 현재 날짜와 시간을 받아서
// "Thu, Sep 5, 2024, 08:24:38 PM GMT+9" 같은 형식으로 반환합니다.
function formatDate(date) {
  const options = {
    weekday: "short",       // 요일 (약식)
    year: "numeric",        // 연도 (숫자)
    month: "short",         // 월 (약식)
    day: "numeric",         // 일 (숫자)
    hour: "2-digit",        // 시 (2자리)
    minute: "2-digit",      // 분 (2자리)
    second: "2-digit",      // 초 (2자리)
    timeZoneName: "short",  // 시간대 이름 (약식)
  };
  return date.toLocaleString("en-US", options);
}

// 미리 설정된 내용(preset)입니다. SCSS 파일의 헤더 부분에 들어가며,
// 파일을 직접 수정하지 말라는 경고와 함께 현재 생성된 날짜와 시간을 기록합니다.
const preset = `
@charset "utf-8";

// Do not edit directly
// Generated on ${formatDate(new Date())}
`;

// SCSS 변수 이름을 변환하는 함수입니다. 
// 디자인 토큰의 경로(예: ['color', 'light', 'primary', '5'])를 결합하여 
// 사용하기에 적합한 형식(예: 'color-light-primary-5')으로 변환합니다.
// 'suffix'가 제공된 경우 접두사를 변수 이름에 붙입니다.
function transformName(prop, suffix) {
  // 경로 요소를 '-'로 연결하여 변수 이름을 만듭니다.
  const path = prop.path.join("-");
  // 접두사가 있는 경우 접두사를 변수 이름 앞에 붙입니다.
  return suffix ? `${suffix}-${path}` : path;
}

// 참조되는 토큰 이름을 변환하는 함수입니다. 
// 예를 들어 참조된 토큰이 {color.primary} 형식이라면 이를 SCSS 형식인
// 'color-primary'로 변환하여 사용합니다.
function transformScssVariable(reference) {
  return reference
    .replace(/\{|\}/g, "")        // 중괄호 {, } 제거
    .replace(/\./g, "-")          // 점(.)을 대시(-)로 대체
    .replace(/\s+/g, "-")         // 공백을 대시(-)로 대체
    .replace(/\//g, "-");         // 슬래시(/)를 대시(-)로 대체
}

// Style Dictionary의 커스텀 SCSS 형식(format)을 정의합니다.
// 이 함수는 디자인 토큰을 특정 SCSS 형식으로 변환하여 출력합니다.
StyleDictionary.registerFormat({
  name: "custom/scss-format", // 포맷 이름을 정의합니다.

  // SCSS 파일을 생성하는 로직이 담긴 formatter 함수입니다.
  formatter: function (dictionary) {
    // 토큰을 사용자 정의 그룹으로 분류합니다.
    // 예: 'color-light-primary' 같은 형식으로 그룹화
    const groupedTokens = dictionary.allProperties.reduce((acc, prop) => {
      // 첫 번째와 두 번째 경로 요소를 결합하여 사용자 정의 그룹 이름을 생성합니다.
      // 예: ['color', 'light', 'primary', '5'] -> 'color-light'
      const customGroup = `${prop.path[0]}-${prop.path[1]}`;
      
      // 해당 그룹이 처음 생성되는 경우, 초기값으로 빈 객체를 할당합니다.
      if (!acc[customGroup]) acc[customGroup] = {};
      
      // 세 번째 경로 요소를 기준으로 하위 항목(서브 그룹)을 추가합니다.
      // 예: 'primary'
      const subGroup = prop.path[2];
      
      // 서브 그룹이 처음 생성되는 경우, 초기값으로 빈 배열을 할당합니다.
      if (!acc[customGroup][subGroup]) acc[customGroup][subGroup] = [];
      
      // 서브 그룹에 속한 토큰(prop)을 배열에 추가합니다.
      acc[customGroup][subGroup].push(prop);
      return acc;
    }, {});

    // SCSS 파일의 콘텐츠를 생성하는 변수입니다.
    let scssContent = preset + "\n"; // 미리 설정된 헤더 추가

    // 그룹별로 SCSS 변수를 생성하는 로직입니다.
    Object.keys(groupedTokens).forEach((group) => {
      // 각 그룹에 주석을 달아 구분합니다. 
      // 예: // COLOR-LIGHT
      scssContent += `\n// ${group.toUpperCase()} \n`;

      // 각 서브 그룹에 대해 변수와 맵을 생성합니다.
      Object.keys(groupedTokens[group]).forEach((subGroup) => {
        const tokenList = groupedTokens[group][subGroup];

        // 서브 그룹에 속한 각 토큰을 SCSS 변수로 변환하여 추가합니다.
        tokenList.forEach((prop) => {
          let name = transformName(prop); // 변수 이름 변환
          let value = prop.original && prop.original.value ? prop.original.value : prop.value;
          
          // 참조된 토큰은 SCSS 형식으로 변환합니다.
          if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
            value = `$${transformScssVariable(value)}`;
          }
          
          // 변수 선언을 추가합니다. 예: $color-light-primary-5: #eff5ff !default;
          scssContent += `$${name}: ${value} !default;\n`;
        });

        // 서브 그룹에 대해 맵을 생성합니다. 예: $color-light-primary
        scssContent += `\n$${group}-${subGroup}: (\n`;
        
        // 서브 그룹의 각 토큰을 맵 형식으로 추가합니다.
        tokenList.forEach((prop) => {
          const tokenValue = transformName(prop);
          // 예: 5: $color-light-primary-5
          scssContent += `\t${prop.path[3]}: $${tokenValue},\n`;
        });
        
        // 맵 닫기
        scssContent += `) !default;\n\n`;
      });
    });

    return scssContent; // 최종 SCSS 콘텐츠 반환
  },
});

// Style Dictionary 설정을 내보냅니다.
// 변환할 디자인 토큰 파일의 경로와 결과물을 저장할 경로를 지정합니다.
module.exports = {
  source: ["./tokens/transformed_tokens.json"], // 변환할 디자인 토큰의 JSON 파일 경로
  platforms: {
    scss: {
      transformGroup: "scss", // SCSS 형식으로 변환
      buildPath: "./resources/scss/tokens/", // 결과물이 저장될 경로
      files: [
        {
          destination: "_krds_tokens_custom.scss", // 생성될 SCSS 파일 이름
          format: "custom/scss-format", // 커스텀 SCSS 포맷 사용
        },
      ],
    },
  },
};
