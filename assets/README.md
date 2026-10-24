# 水知源素材说明

所有运行所需素材均存储在此目录，页面无第三方素材请求。

## 用户提供的品牌与产品

- `product-water.jpg`：原始饮用水包装参考。
- `product-toner.jpg`：原始爽肤水包装参考。
- `product-mask.jpg`：原始面膜包装参考。
- `product-*-cutout.png`：使用内置 ImageGen 去除包装外部背景后的透明图片；原始参考保留不覆盖。
- `brand-emblem.png`：使用内置 ImageGen 从产品包装参考提取的水滴、圆环和波纹标识。

这些资料为用户提供的概念设计，不代表产品已经上市或获得认证。后续有正式 Logo 矢量源文件时应替换当前提取稿。

## 生成的场景素材

使用内置 ImageGen，参考 `design/selected-direction.png` 生成独立素材，页面文字与操作保持原生 HTML。

| 文件 | 生成方向 |
| --- | --- |
| `hero-water.png` | 蓝调时刻的深蓝湖面、前景透明流动波浪、右侧暖光玻璃会客厅；左侧为可读标题留出暗部。 |
| `experience-source.png` | 日光照耀山野溪流，石块与树叶构成自然前景，远处层叠山峰。 |
| `experience-atmosphere.png` | 新增的体验屏背景：蓝灰雾山、银蓝湖面与稀疏涟漪，无建筑、人物、文字和产品；通过内置 ImageGen 生成，独立于活动照片。 |
| `experience-tea.png` | 现代中式临水茶席，深色木桌、陶瓷茶壶与杯子、落地窗外山水。 |
| `experience-morning.png` | 临水窗边的晨间清水杯，右侧主体、左侧较暗空间，用于饮水活动。 |
| `water-light.png` | 银蓝色浅水与细小涟漪，亮色留白，两侧少量自然石块；不含文字和产品。 |

## 开源视觉资源

- 图标：[Tabler Icons v3.31.0](https://github.com/tabler/tabler-icons/tree/v3.31.0)，许可见 `icons/LICENSE`。SVG 为上游原始文件。
- 字体：[Noto Serif SC](https://fonts.google.com/specimen/Noto+Serif+SC)，通过 Google Fonts 获取本页面中文文案子集，许可见 `fonts/OFL.txt`。浏览器离线加载 `fonts/noto-serif-sc.ttf`，其他文字回退到系统字体。

字体补充：`fonts/noto-serif-sc-semibold.ttf` 为同一 OFL 字体的 600 字重页面文字子集，用于第二屏主标题及活动名称。
