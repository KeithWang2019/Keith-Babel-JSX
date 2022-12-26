
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/KeithWang2019/Keith-Babel-JSX/blob/master/LICENSE)
[![webpack](https://img.shields.io/badge/webpack-%5E5.74.0-green)](#)
[![@babel/core](https://img.shields.io/badge/%40babel%2Fcore-%5E7.19.3-green)](#)
[![@babel/plugin-transform-react-jsx](https://img.shields.io/badge/%40babel%2Fplugin--transform--react--jsx-%5E7.19.0-green)](#)
# [Keith-Babel-JSX](https://github.com/KeithWang2019/Keith-Babel-JSX)


```json
{
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: {
    loader: "babel-loader",
    options: {
      presets: ["@babel/preset-env"],
      plugins: [
        [
          "@babel/plugin-transform-react-jsx",
          {
            runtime: "automatic",
            importSource: "@keithwang/keith-babel-jsx",
          },
        ],
      ],
    },
  },
}
```
