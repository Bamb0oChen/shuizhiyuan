# 水知源 · 设计与交互验收

final result: passed

## 实时水面与拨水交互（2026-10-24，当前验收）

- 已接入本地 Three.js 0.180.0 与自定义水面着色器，对现有摄影背景做低幅流动、局部折射与扩散衰减涟漪。不是完整物理流体模拟。
- 字体、产品与控件继续由 DOM 绘制；仅遮罩内的背景参与水效。茶席、玻璃杯两张首屏照片保持静止。
- 新增右上角「水面动效」开关，和首屏暂停按钮同步。每次仅一个 canvas / WebGLRenderer，跨屏复用，退出首页移除画布并停止循环。
- 桌面 1440 × 900 的真实浏览器验证：拖动背景后 `data-ripples=2`、输入为 mouse、状态为 running；暂停后两次独立读取帧数均为 2220；恢复后继续渲染。
- 跨屏后 canvasCount 始终为 1，产品屏父节点为 panel 2；产品链接可点击，进入爽肤水详情后 canvasCount=0、状态 inactive。
- 手机尺寸 390 × 844 验证：实际绘制缓冲为 390 × 844，无横向溢出；整屏滚动后停靠于 scrollTop=1688、当前与 canvas 均指向 panel 2。触屏事件不调用 preventDefault / setPointerCapture，轻触分支已代码检查；未在真实手机硬件上进行性能与手势审计。
- 控制台 error / warn 列表为空。6 项 Node 逻辑测试通过，覆盖裁切、归一化坐标、水面范围、像素预算、暂停条件与涟漪容量/衰减；`water-model.mjs` 行/分支/函数覆盖率均 100%，该数值不代表整个网站或 GPU 模块覆盖率。
- 不支持 WebGL、纹理加载失败、上下文丢失时保留原背景；减少动态效果/页面隐藏有停止分支。降级状态逻辑已单元测试与代码检查，未在浏览器中强制模拟 GPU 丢失。
- 视觉证据：`preview/water-effect-comparison.jpg` 将原静态首屏与水效开启后的 1440 × 900 浏览器画面等宽放在同一张比较图内。主要文字、产品、留白与色调保持一致，背景局部变形为期望效果。已同时查看两者。
- 其他截图：`preview/water-ripple-desktop.png`、`preview/water-effect-mobile.png`、`preview/water-partners-mobile.png`。现有半粗字体、整屏结构和蓝灰合作页保持。
- 通过 `node --check app.js`、`node --check water-effects.mjs`、`node --test tests/water-model.test.mjs`、`git diff --check`。
- 无新增 P0/P1/P2 问题。实际设备性能、原生触屏体验可作为后续验证；未部署外网或推送本轮修改。

water-effect revision result: passed


## 最新一轮：背景层次与合作页亮度（2026-10-24）

本节保留背景调整阶段的验收，当前水效状态见上方。用户后续反馈要求体验屏与产品屏具有可见背景，并提高合作屏亮度。保留四屏布局、字体、路由及停靠交互。

- [P2，已修复] 体验屏纯白缺少环境感：新增 `assets/experience-atmosphere.png`，以雾山、湖面和低对比涟漪构成底图，标题及说明使用深蓝文字。未复用活动照片作为大背景，避免视觉重复。
- [P2，已修复] 产品背景被 screen 混合过度洗白：恢复正常摄影背景与浅色透明覆盖，保留清晰水纹和远山，产品与标题位置不变。
- [P2，已修复] 合作屏深色 multiply 令暗部过重：改用蓝灰色 soft-light 混合，恢复水面、建筑和山体层次；右侧说明增加轻薄的半透明阅读底，避免提亮后白字混入高光。
- 同视口比较证据：`preview/background-comparison-v2.jpg`，三屏调整前后各为 1440 × 900，等比例缩放到每列 640 像素；已同时打开比较。
- 最新桌面截图：`preview/experiences-background-v2.png`、`preview/products-background-v2.png`、`preview/partners-background-v2.png`。
- 最新手机截图：`preview/experiences-background-mobile-v2.png`、`preview/products-background-mobile-v2.png`、`preview/partners-background-mobile-v2.png`；390 × 844。
- 字体、间距与文案保持原版本，仅调整背景图、覆盖层、相关文字颜色以及合作说明底层。已在实际截图查看标题、正文、产品轮廓和页脚；无新的 P0/P1/P2 问题。
- 手机检查四屏 clientHeight/scrollHeight 均为 844，无横向溢出；屏幕切换有效，控制台 error 为空，`git diff --check` 通过。测试后已恢复浏览器原始视口并刷新用户预览。

latest background revision result: passed

## 视觉依据与范围

- 原始视觉目标：`D:/Water/design/selected-direction.png`，1003 × 1568，用户选定的第三套方向。
- 后续明确反馈：`D:/Water/design/readability-feedback.png`。要求提高文字对比、首页每屏独立停靠、翻页留出停顿、品牌合作与页脚合成一屏。
- 实现：`http://127.0.0.1:4173/#/`。
- 当前首页结构按照后续反馈调整，四个屏幕各占一个视口；它与最初长页面的纵向分区高度存在有意差异，不作为设计偏差。

## 证据

- 初版完整比较：`preview/comparison-v1.jpg`，原图与 1424 × 2352 的浏览器长页等宽并排，用于检查最初结构与素材。
- 最终首屏比较：`preview/comparison-final-hero.jpg`。原稿首屏取 1003 × 605 内容区域，与 1440 × 900 的实现分别等比归一到 720 像素宽；不拉伸图片。实现按要求增加至整屏高度。
- 最终合作页比较：`preview/comparison-final-partner.jpg`。用户反馈的横条与实际完整合作屏一并呈现，验证文字对比与页脚整合。
- 桌面实际截图：`preview/home-desktop.png`、`preview/experiences-desktop.png`、`preview/products-desktop.png`、`preview/partners-desktop.png`。
- 手机实际截图：`preview/home-mobile.png`、`preview/experiences-mobile.png`、`preview/partners-mobile.png`；390 × 844 CSS 像素。
- 短屏实际截图：`preview/home-small-mobile.png`、`preview/partners-small-mobile.png`；320 × 568 CSS 像素。
- 浏览器实际检查：1440 × 900 CSS 像素、设备像素比例约 1。截图通过受支持的浏览器截图接口获得；固定视口检查结束后恢复原始预览尺寸。

## 对比历史与修复

1. [P2，已修复] 初版桌面导航、标题与辅助文字偏小。增大中文标题、导航与正文尺寸，保持宋体标题和简洁控件的层级。证据：`comparison-v1.jpg` → `comparison-final-hero.jpg`。
2. [P1，已修复] 合作区域水面高光与白字竞争。改为整体深色混合背景、接近纯白的文字、稳定的实底按钮，保留水纹而降低高光。证据：用户反馈图 → `comparison-final-partner.jpg`。
3. [P2，已修复] 合作横条与白色页脚视觉割裂。改成完整品牌合作屏，底部以细分隔线整合品牌、链接和版权。桌面与 390/320 手机截图均显示同一背景贯穿全屏。
4. [P2，已修复] 自由长页不符合一次一屏的要求。首页使用独立滚动容器、完整视口章节与强制停靠；滚轮切换有 1050 毫秒节流，缩小窗口后重新对齐当前屏。
5. [P2，已修复] 首屏产品推荐文字缺乏稳定背景。提高推荐区域底色不透明度，保持产品透明图与白色文字分离。

## 必查视觉面

- 字体：Noto Serif SC 本地子集，正文系统无衬线。桌面导航和主标题层级清晰；移动端按屏高缩放。未见主要标题或按钮裁切。
- 布局：四屏实际 clientHeight 与 scrollHeight 在 1440 × 900、390 × 844、320 × 568 均相等，没有横向溢出。详情页保留自然滚动。
- 色彩：首屏白字配暗色水面，浅色屏采用深蓝文字；合作页整体压暗，按钮使用实底或高对比边框。已视觉检查三种轮播背景。未声称完成全面 WCAG 认证。
- 图片：真实独立栅格素材、用户包装透明图与提取的品牌标识均已加载，没有 CSS 包装假图或绘制的山水替代图。图片适配容器而未拉伸。
- 文案：品牌统一「水知源」。产品调整为饮用水、爽肤水、面膜。筹备活动与未上市产品在详情中说明；表单说明仅本地预览，企业数据标注示例。

## 交互检查

- 首页三组活动切换与暂停控制；大幅滚轮输入从合作屏停靠到产品屏，未连续跳过多屏。
- 桌面和移动端屏幕导航、菜单展开收起、顶部导航进入对应章节。
- 「我的知源」面板读取已有本机记录、关闭和跳转至已收藏产品。
- 产品详情链接与已收藏状态保留；旧 `drink` 产品路径兼容映射至爽肤水。
- 合作意向使用示例品牌与 `demo@example.com` 测试，成功输出本地预览，未向外部发送。
- 浏览器图片加载检查无缺失；最后读取控制台 error 列表为空。
- `node --check app.js` 通过。减少动态效果与键盘分支已代码检查；未进行真实手机硬件或屏幕阅读器完整审计。

## 可接受差异与后续细化

- 原设计是静态长页，现在按明确反馈为四屏；最后一屏增加产品共创、体验共创、长期同行三项说明，形成完整页面。
- 「会员空间」在原型中称为「我的知源」，实际提供本机收藏，不假装已上线账户系统。
- [P3] 生成场景与概念图细节不完全相同，但主体、构图与色调一致。
- [P3] 正式发布前可提供原始矢量 Logo、真实产品素材并优化大图传输体积。当前原型使用本地高质量图片。

## 完成检查

- [x] 三款产品、品牌标识与四组场景已接入。
- [x] 字体与背景分离，合作页整合完成。
- [x] 四屏停靠与主要交互通过浏览器验证。
- [x] 桌面、手机与短屏的主要区域已查看。
- [x] 无仍需处理的 P0/P1/P2 问题；未部署后台；最新导航与尺寸修正、验收记录仍在本地工作区。


## 第二页字体强化（2026-10-24）

- 用户要求第二页字体更加突出。仅调整体验屏的字重、字号和相关文字颜色，未引入实时水面或粒子实现。
- 新增本地 Noto Serif SC 600 字重，主标题与活动标题使用真实半粗字重；说明改用更深的无衬线文字。
- 实际桌面计算样式：主标题 54.72px / weight 600（1440 × 900）。
- 比较：`preview/typography-comparison-v3.jpg`；截图 `preview/experiences-type-v3.png`、`preview/experiences-type-mobile-v3.png`。
- 手机 390 × 844：无横向溢出，体验屏 clientHeight 与 scrollHeight 均为 844。标题、说明、操作未发生重叠。
- 既有水境背景、页面停靠和交互逻辑保持不变。
- typography revision result: passed
