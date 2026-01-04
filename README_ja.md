# ContextUI

[English](./README.md) | [日本語](./README_ja.md)

あなたのReactコンポーネントとコンテキストからJSONスペックを生成し、JSONスペックに基づいてUIをレンダリングする、ヘッドレスなGenerative UIエンジン。

- UIのハイパーパーソナライゼーション: 独自デザインのUIをランタイムで生成し、各ユーザに最適化
- 既存の資産が利用可能: 既存のReactコンポーネントを完全に利用可能
- ロックインなし: ユーザ独自のSpec生成ロジックを利用可能


## Core Concepts

[//]: # (コアコンセプト（なぜこの設計が普及するか、新しいパラダイム）)

![](/docs/readme/concept_compose.png)

SDKは、
1. Atomic Designにおける 既存Organisms を構成して Template（画面構成） のSpecを作る
2. そのSpecを解釈し、レンダリングする

を提供します。

- あなたが定義したコンポーネントを描画します。
  - 安全なランタイム環境
  - 独自ブランディングでの表示
  - 拡張性
- Spec生成のLLMを自由に選択できます。
  - Spec生成のロジックは、あなたが提供します



## 30秒 Quickstart（最短で動かす）

**Install**
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

ContextUIはコンポーネントの状態管理、アクション、データバインディングを提供しません。


## Use Cases
[//]: # (これが刺さるユースケース（最初の楔を明示）)

TBD

For more information, see [React Example](./examples/react-app).

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


## Future Work
現在のContextUIはOrganismの構成を行うのみですが、今後はデザインシステムからOrganismsの生成を可能にすることを検討しています。
つまり「管理すべき状態」、「データ」、「利用可能なアクション」から、あなたのデザインシステムでOrganismを生成します。

![](/docs/readme/concept_generate.png)

これによって、現在の事前に定義されたコンポーネントを適切に構成して表示する機能に加え、新たなコンポーネントを定義することが可能になり、より自由度の高い利用が可能になります。

## Contributing / License

- コントリビューション手順: `CONTRIBUTING.md`
- License: Apache 2.0
