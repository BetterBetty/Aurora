# Aurora MVP

当前版本：v0.1.0。

## GitHub 发布与回退

首次将仓库 Settings → Pages → Source 设置为 GitHub Actions。
推送 main 会自动部署；发布包只包含网页资源，不含 PRD、开发文档或密钥。
网站的 version.json 记录实际部署的提交编号，Actions 保留发布执行记录。

每次迭代先提交 Git，再创建不重复的版本标签（如 v0.1.1），在 CHANGELOG.md 记录变化，提交和标签一起推送。
不覆盖旧标签，不强制推送。

临时回退：Actions → Deploy Aurora → Run workflow，在 ref 填入旧版本标签（例如 v0.1.0）。这只切换线上代码，不改写历史；下次推送 main 会重新部署 main。
长期回退：使用 git revert 撤销指定变更，提交后推送 main，并打一个新版本标签。
代码回退不会恢复或删除浏览器本地数据；未来数据结构变更需要另做兼容迁移。

一个面向手机的可交互 PWA 原型，展示 Aurora 的愿望池、极光分、小任务、恋爱小法庭和许愿树。

## 本地运行

```powershell
python -m http.server 4173
```

然后访问 `http://localhost:4173`。

## 当前限制

所有数据储存在浏览器的 `localStorage`，所以这是用于流程验证的本地演示版。真实跨手机同步、邀请绑定、图片存储和隐私权限将在接入 CloudBase 后实现。
