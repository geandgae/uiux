// node
const StyleDictionary = require("style-dictionary");

function formatDate(date) {
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  };
  return date.toLocaleString("en-US", options);
}

// preset
const preset = `
@charset "utf-8";

// Do not edit directly
// Generated on ${formatDate(new Date())}
`;

// transformName
// 디자인 토큰의 경로(`prop.path`)를 연결하여 SCSS 변수로 사용하기에 적합한 형식으로 변환
function transformName(prop, suffix) {
  const path = prop.path.join("-");
  // 접두사(suffix)가 있는 경우, 접두사 적용
  return suffix ? `${suffix}-${path}` : path;
}

// transformScssVariable
// 참조 토큰을 시용하기 편한 형태로 변환 {color.primary} > color-primary
function transformScssVariable(reference) {
  return reference.replace(/\{|\}/g, "").replace(/\./g, "-").replace(/\s+/g, "-").replace(/\//g, "-");
}

// custom SCSS 포맷 정의
StyleDictionary.registerFormat({
  name: "custom/scss-format",

  formatter: function (dictionary) {
    // 사용자 정의 그룹별로 카테고리화 (color-light-primary 등)
    const groupedTokens = dictionary.allProperties.reduce((acc, prop) => {
      // 첫 번째와 두 번째 경로 요소를 결합하여 사용자 정의 그룹으로 사용
      const customGroup = `${prop.path[0]}-${prop.path[1]}`; // 첫 번째와 두 번째 요소 결합
      if (!acc[customGroup]) acc[customGroup] = {};
      
      // 세 번째 경로를 기준으로 하위 항목 추가
      const subGroup = prop.path[2]; // 세 번째 요소 (예: "primary")
      if (!acc[customGroup][subGroup]) acc[customGroup][subGroup] = [];
      
      acc[customGroup][subGroup].push(prop);
      return acc;
    }, {});

    // SCSS 작성
    let scssContent = preset + "\n";
    Object.keys(groupedTokens).forEach((group) => {
      // 그룹별 주석 추가 (예: COLOR-LIGHT)
      scssContent += `\n// ${group.toUpperCase()} \n`;

      Object.keys(groupedTokens[group]).forEach((subGroup) => {
        const tokenList = groupedTokens[group][subGroup];

        // 각 토큰을 SCSS 변수로 변환
        tokenList.forEach((prop) => {
          let name = transformName(prop);
          let value = prop.original && prop.original.value ? prop.original.value : prop.value;
          if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
            value = `$${transformScssVariable(value)}`;
          }
          scssContent += `$${name}: ${value} !default;\n`;
        });

        // 각 서브 그룹에 대해 맵 생성 (예: $color-light-primary)
        scssContent += `\n$${group}-${subGroup}: (\n`;
        tokenList.forEach((prop) => {
          const tokenValue = transformName(prop);
          scssContent += `\t${prop.path[3]}: $${tokenValue},\n`; // 네 번째 경로 (예: "5", "10" 등)
        });
        scssContent += `) !default;\n\n`;
      });
    });

    return scssContent;
  },

});

// export
module.exports = {
  source: ["./tokens/transformed_tokens.json"],
  platforms: {
    scss: {
      transformGroup: "scss",
      buildPath: "./resources/scss/tokens/",
      files: [
        {
          destination: "_krds_tokens_custom.scss",
          format: "custom/scss-format",
        },
      ],
    },
  },
};
