# Live2dExt

Live2d Cubism 2 for chrome extension

## Install

1. [下载]()并解压文件
2. 在 <kbd>扩展程序</kbd> 中打开 <kbd>开发者模式</kbd>
3. 点击 <kbd>已解压的扩展程序</kbd> 加载已解压的文件
4. 刷新任何已打开页面

## Document

1. 换装：<kbd>鼠标单击</kbd> 虚拟人物
2. 隐藏：<kbd>Ctrl</kbd> + <kbd>鼠标单击</kbd> 虚拟人物
3. 显示或隐藏虚拟人物：浏览器导航栏中点击插件图标后，可在弹出窗口中切换状态
4. 加载其他模型

### 本地模型

例如：<kbd>HyperdimensionNeptunia</kbd>模型

1. 将模型文件 copy 至 models 目录中
2. 修改<kbd>modelConfig.json</kbd>文件配置,（修改已有或添加节点）

````javascript
        {
            "models": [
            {
                "name": "noir", // 自定义名称
                "enable": true, // 启用该模型配置，仅会取第一个enable为true的数据
                "res": [ // 模型数据
                    "models/HyperdimensionNeptunia/noir_classic/index.json",
                    "models/HyperdimensionNeptunia/noir/index.json",
                    "models/HyperdimensionNeptunia/noir_santa/index.json",
                    "models/HyperdimensionNeptunia/noireswim/index.json"
                ],
                "width": "100", // 人物显示区域大小
                "height": "210", // 人物显示区域大小
                "style": "position: fixed; z-index: 9999999999; right: 0; bottom: 0;" // 人物显示区域位置
            }]
        }```
````

### 网络模型

例如：<kbd>Pio</kbd>模型（<b>网络资源可能加载较慢</b>）

1. 修改<kbd>modelConfig.json</kbd>文件配置,（修改已有或添加节点）

````javascript
        {
            "models": [
            {
                "name": "Pio", // 自定义名称
                "enable": true, // 启用该模型配置，仅会取第一个enable为true的数据
                "res": [
                    "https://imuncle.github.io/live2d/model/Pio/model.json",
                    "https://imuncle.github.io/live2d/model/Pio/model1.json",
                    "https://imuncle.github.io/live2d/model/Pio/model2.json",
                    "https://imuncle.github.io/live2d/model/Pio/model3.json",
                    "https://imuncle.github.io/live2d/model/Pio/model4.json",
                    "https://imuncle.github.io/live2d/model/Pio/model5.json"
                ],
                "width": "100", // 人物显示区域大小
                "height": "210", // 人物显示区域大小
                "style": "position: fixed; z-index: 9999999999; right: 0; bottom: 0;" // 人物显示区域位置
            }]
        }```
````
