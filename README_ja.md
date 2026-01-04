# ContextUI

[English](./README.md) | [日本語](./README_ja.md)

LLMでUIを生成・カスタマイズできる、Reactベースのヘッドレスエンジン

既存のコンポーネントをそのまま使いながら、ユーザーごとに最適化されたUIを動的に生成できます。

## なぜContextUIか?

### 🎯 ハイパーパーソナライゼーション
- ユーザーの役割、行動履歴、状況に応じて最適化されたUIを動的生成
- 各ユーザーに合わせた体験を提供

### 🎨 既存資産を完全活用
- あなたのReactコンポーネントをそのまま使用
- 独自のデザインシステムとブランディングを維持
- 安全なランタイム環境で動作、拡張性も確保

### 🤖 柔軟なSpec生成
- 任意のLLM（OpenAI、Anthropic、ローカルモデル等）を選択可能
- Spec生成ロジックは完全にあなたが実装・管理
- オープンなJSON形式、いつでも移行可能


## 30秒 Quickstart（最短で動かす）

```bash
npm install @context_ui/core
// or yarn add @context_ui/core 
// or pnpm add @context_ui/core
```

```tsx
import { ContextUI, createRegistry } from '@context_ui/core'

type ProfilePanelProps = {
  title: string
}

const ProfilePanel = ({ title }: ProfilePanelProps) => (
  <section className="profile-panel">
    <h2>{title}</h2>
    <p>ここにプロフィール情報を表示します。</p>
  </section>
)

const registry = createRegistry()
  .register('ProfilePanel', {
    component: ProfilePanel,
    propsHint: {
      title: 'string',
    },
  })

const spec = {
  version: '1.0',
  components: [
    { id: 'profile', component: 'ProfilePanel', props: { title: 'プロフィール' } },
  ],
}

export function App() {
  return <ContextUI spec={spec} registry={registry} />
}
```


## Core Concepts
### アーキテクチャの概要
- Layer 1はデータとアクションからOrganismsを作るボトムアップ
- Layer 2は目的に合わせてOrganismsを並べるトップダウン
- 生成と構成を分けることで一貫性と柔軟性を両立

現時点で提供しているのはLayer 2（Templatesの構成とレンダリング）で、Layer 1は今後追加予定です。

[//]: # (コアコンセプト（なぜこの設計が普及するか、新しいパラダイム）)

### Layer 1: Organismsの生成

![](/docs/readme/concept_generate.png)

このフェーズでは、LLMがUIコンテキストを使ってAtoms/MoleculesからOrganismsを生成します。
- 入力: あなたのReactコンポーネント（Atoms / Molecules）
- UIコンテキスト: 表示するデータモデル、利用可能なアクション
- 出力: 生成されたOrganisms（例: 検索バー）

今後「管理すべき状態」、「データ」、「利用可能なアクション」からOrganismsを生成できるようにする予定です。

これにより、事前に定義されたコンポーネントを構成するだけでなく、新たなコンポーネントの定義にも対応できます。

### Layer 2: Templatesの構成

![](/docs/readme/concept_compose.png)

LLMがユーザーの意図に合わせてOrganismsを選択・配置し、Templatesを構成します。
- 入力: Atoms / Molecules + 既存Organisms + 生成Organisms
- System/User Context: 目的/意図、制約
- 出力: Templates（画面レイアウトのSpec）


## Use Cases
[//]: # (これが刺さるユースケース（最初の楔を明示）)

- **パーソナライズドダッシュボード**: ユーザーの役割に応じてウィジェットを動的配置
- **チャットボットUI**: 会話の流れに応じてフォームやカードを生成
- **A/Bテスト自動化**: LLMが複数のレイアウトバリエーションを生成

更なる情報は、[React Example](./examples/react-app)を参照して下さい。

## UI Spec（JSON）仕様

**最小構造**
```json
{
  "version": "1.0",
  "components": [
    { "component": "ProfilePanel", "props": { "title": "プロフィール" } }
  ]
}
```

**主要フィールド**
- `layout?`: `'vertical' | 'horizontal'`（省略時は`'vertical'`）
- `components[].children?`: 子ノード配列
- `components[].id?`: 安定キー

**重要ルール（制約）**
- 許可コンポーネントのみ使用可能
- `component` はRegistry名（大文字小文字は区別されない）
- `props` はそのまま渡される


## Contributing / License

- コントリビューション手順: `CONTRIBUTING.md`
- License: Apache 2.0
