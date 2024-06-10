// import
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
  const isDevelopment = env.mode === 'development';
  
  return {
    mode: isDevelopment ? 'development' : 'production',

<<<<<<< HEAD
// export
// node js 환경에서는 module.export = {}로 내보네야함
module.exports = {
  //// 임시테스트
  mode: 'development', // 개발 모드로 설정하여 압축을 방지
  
  // parcel index.html
  // 파일을 읽어들이기 시작하는 진입점 설정
  entry : './ia/assets/js/static/core.js',
  
  output: {
    filename: 'nomin.js', // 압축되지 않은 파일 이름
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: false, // 압축 비활성화
  },
  //// 임시테스트

=======
    entry: './ia/assets/js/static/core.js',
>>>>>>> 1129ae554f3effe98f5fc9c2561e73017b6eba5c

    output: {
      filename: isDevelopment ? './assets/js/core.js' : './assets/js/core.min.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true
    },

    resolve: {
      alias: {
        '@scss': path.resolve(__dirname, 'ia/assets/scss'),
        '@css': path.resolve(__dirname, 'ia/assets/css')
      }
    },

    module: {
      rules: [
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ],
          include: path.resolve(__dirname, 'ia/assets/scss')
        },
        {
          test: /\.css$/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader'
          ],
          include: path.resolve(__dirname, 'ia/assets/css')
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          include: path.resolve(__dirname, 'ia/assets')
        },
        {
          test: /\.json$/,
          loader: 'json-loader',
          type: 'javascript/auto',
          include: path.resolve(__dirname, 'ia/assets/js/test_core_json'),
        },
      ]
    },

    plugins: [
      new HtmlPlugin({
        template: './ia/test_static.html',
        filename: isDevelopment ? './index.html' : './src/test_static.html',
        minify: !isDevelopment,
      }),
      isDevelopment ? undefined : new MiniCssExtractPlugin({
        filename: './assets/css/styles.css',
      }),
    ].filter(Boolean),

    optimization: {
      minimize: !isDevelopment,
    },

    devServer: {
      host: 'localhost',
      // static: {
      //   directory: path.resolve(__dirname, './'),
      // }
    }
<<<<<<< HEAD
  },
  
  
  // 결과물(번들)을 반환하는 설정
  /*
  output : {
    // 절대경로를 명시해주어야 함!
    path : path.resolve(__dirname, 'dist'),
    filename: 'core.js',
    clean : true
  },
  */

  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader',
        type: 'javascript/auto',
        include: path.resolve(__dirname, 'ia/assets/js/test_core_json'), // JSON 파일이 있는 디렉토리 지정
      },
      {
        test: /\.s?css$/,
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
        test: /\.js$/,
        exclude: /node_modules/,
        // use: {
        //   loader: 'babel-loader', // babel-loader를 사용하지 않음
        // },
        include: path.resolve(__dirname, 'ia/assets')
      },
    ]
  },

  // 번들링 후 결과물의 처리 방식 등 다양한 플러그인들을 설정
  plugins: [
    // 생성자 함수
    new HtmlPlugin({
      // template: './index.html',
      template: './ia/test_static.html',
      // 파비콘 파일이 없으면 주석 처리하거나 빈 값으로 설정
      // favicon: path.resolve(__dirname, 'static', 'favicon.ico')
      // favicon: isProduction ? path.resolve(__dirname, 'static', 'favicon.ico') : false // 개발 환경에서는 파비콘 로드 비활성화
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
      filename: 'styles.css', // 출력할 CSS 파일의 이름 설정
    }),
  ],

  devServer: {
    host: 'localhost'
  }
}
=======
  };
};
>>>>>>> 1129ae554f3effe98f5fc9c2561e73017b6eba5c
