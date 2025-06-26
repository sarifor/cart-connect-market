import CommonLayout from "../components/CommonLayout";


const Home = () => {
  return (
    <CommonLayout title="ホーム">
      <div style={{ padding: '15px' }}>
        <div>
          <h2>ようこそ、Cart Connect Marketへ！</h2>

          <p>
            ここは、みんなの買い物カートをつなぐソーシャルショッピングプラットフォームです。<br />
            気になる食材を他のユーザーの公開カートから見つけて、自分のカートにコピーしてみましょう！
          </p>

          <ul>
            <li>🛒 他の人のカートを見てみよう</li>
            <li>👍 気に入ったら「いいね！」でつながろう</li>
            <li>📤 自分の買い物カートを公開してシェアしよう</li>
          </ul>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h2>お知らせ</h2>

          <ul>
            <li>2025.6.27　「いいね！」機能を追加しました。</li>
          </ul>
        </div>

        <div style={{ marginTop: '30px' }}>
          <p style={{ color: 'gray' }}>
            ※このホーム画面は開発中の仮デザインです。今後、人気の公開カートなどが表示される予定です。
          </p>
        </div>

      </div>
    </CommonLayout>
  );
};

export default Home;