# 技术栈
Python3.8，React，Flask, Bootstrap5

# 总体需求
## 这个一个用于管理应用版本发布管理工具
- 根据requirements.md修改代码，必须完全实现需求，不能随意改变。
- 支持多环境多应用多版本管理
- 所有配置文件都是json格式
- 每个页面的数据以json格式保存到对应的以应用名为名的文件夹中，如versions/compliance-check/1.0.0.json
- 支持访问GitHub，Confluence，Jira，Jenkins的API
- backend端口为6000，frontend端口为3000

# 功能需求
## 主页面
- URL为https://localhost:6000/。
- 读取services.json, key为应用名，value为github仓库，每个应用为一个按钮，点击按钮进入应用页面。

## 应用页面
- 以下需求，以compliance-check为例，URL为http://localhost:6000/compliance-check。
- version/compliance-check/下的json文件名为应用版本号，应用页面列出这些版本号，版本号为一个按钮，点击按钮进入tag页面。

## tag页面
- URL为http://localhost:6000/compliance-check/1.0.0。详情页面中留有允许填上Jira的issue编号，以及填写发布说明。
- tag详情页面中，以下按钮，用于之后触发相应API，并在按钮右侧显示返回结果：
    - 保存tag：将tag信息保存到tag/compliance-check/1.0.0.json文件中。
    - 创建UAT的CR。
    - 发布到测试环境：将tag发布到测试环境。
    - 创建生产的CR。
    - 发布到生产环境：将tag发布到生产环境。 
- tag详情页面上的数据以json格式保存，有以下信息：
    - tag名称
    - GitHub仓库链接
    - pull request链接
    - 测试结果链接
    - Jira的issue编号
    - 发布到测试环境的CR编号
    - 发布到生产环境的CR编号
