// import
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');


// export
// node js 환경에서는 module.export = {}로 내보네야함
module.exports = {
  mode: 'development', // 개발 모드 설정
  // parcel index.html
  // 파일을 읽어들이기 시작하는 진입점 설정
  entry : './ia/assets/js/static/core.js',

  // 참고 https://jjnooys.medium.com/webpack-config-js-%ED%9B%91%EC%96%B4%EB%B3%B4%EA%B8%B0-99fcfc649a04

  // entry: {
  //   home: './home.js',
  //   about: './about.js',
  //   contact: './contact.js',
  // },

  // entry: {
  //   home: ['./home.js', './about.js', './contact.js'],
  // },

  // entry: {
  //   catalog: {
  //     import: './catalog.js',
  //     filename: 'pages/[name].js',
  //     dependOn: 'shared',
  //   }, 
  //   shared: ['react', 'react-dom', 'redux', 'react-redux'],
  // },
  
  // app 파일은 react-vendors의 모듈을 직접 포함하지 않지만 react-vendors 파일의 모듈을 공유한다.
  // module.exports = {
  //   //...
  //   entry: {
  //     app: { 
  //       import: './app.js', 
  //       dependOn: 'react-vendors' 
  //     },
  //     'react-vendors': [
  //       'react', 
  //       'react-dom', 
  //       'prop-types'
  //     ],
  //   },
  // };

  // context는 entry와 loaders 옵션의 기본 디렉토리를 절대경로로 설정
  context: path.resolve(__dirname, './'),

  resolve: {
    // 절대 경로로 사용할 별칭을 지정합니다.
    alias: {
      // 아래 경로는 실제 프로젝트 구조에 맞게 수정하세요.
      '@scss': path.resolve(__dirname, 'ia/assets/scss'),
      '@css': path.resolve(__dirname, 'ia/assets/css')
    }
  },
  
  
  // 결과물(번들)을 반환하는 설정
  output : {
    // 절대경로를 명시해주어야 함!
    filename: './assets/js/core.js',
    path : path.resolve(__dirname, 'dist'),
    clean : true
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        // use는 밑부분부터 실행됨
        use: [
          MiniCssExtractPlugin.loader, // 스타일 파일로 분리 패키지
          // 'style-loader', // style-loader head 에 스타일을 넣음
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
        include: path.resolve(__dirname, 'ia/assets/scss')
      },
      {
        test: /\.css$/, // CSS 파일을 처리하는 부분
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ],
        include: path.resolve(__dirname, 'ia/assets/css')
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // use: {
        //   loader: 'babel-loader', // babel-loader를 사용하지 않음
        // },
        include: path.resolve(__dirname, 'ia/assets')
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        type: 'javascript/auto',
        include: path.resolve(__dirname, 'ia/assets/js/test_core_json'), // JSON 파일이 있는 디렉토리 지정
      },
    ]
  },

  // 번들링 후 결과물의 처리 방식 등 다양한 플러그인들을 설정
  plugins: [
    // 생성자 함수
    new HtmlPlugin({
      // template: './index.html',
      template: './ia/test_static.html', // 생성할 대상
      filename: './src/test_static.html', // 생성될 HTML 파일 이름 설정
      // 파비콘 파일이 없으면 주석 처리하거나 빈 값으로 설정
      // favicon: path.resolve(__dirname, 'static', 'favicon.ico')
      // favicon: isProduction ? path.resolve(__dirname, 'static', 'favicon.ico') : false // 개발 환경에서는 파비콘 로드 비활성화
      // chunks: ['css', 'index', 'app', 'system', 'monitor']
      minify: false, // 압축 비활성화
    }),
    // new CopyPlugin({
    //   // static 폴더를 복사해 dist 폴더 안에 붙여넣어주는 plugin
    //   // patterns: [
    //   //   { from: 'static' }
    //   // ]
    //   patterns: [
    //     { from: path.resolve(__dirname, 'static') }
    //   ]
    // })
    new MiniCssExtractPlugin({
      filename: './assets/css/styles.css', // 출력할 CSS 파일의 이름 설정
    }),
  ],

  // 코드압축 비활성
  optimization: {
    minimize: false, // 코드 압축을 비활성화
    // minimizer: [
    //   new CssMinimizerPlugin({
    //     minimizerOptions: {
    //       preset: [
    //         'default',
    //         {
    //           discardComments: { removeAll: true }, // 주석 제거
    //         },
    //       ],
    //     },
    //   }),
    // ],
  },

  devServer: {
    host: 'localhost'
  }
}