import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadTopSellingProductsRequest, resetProductState } from '@/reducers/product';
import CommonLayout from "../components/CommonLayout";

const Home = () => {
  const {
    loadTopSellingProductsLoading,
    loadTopSellingProductsDone, 
    loadTopSellingProductsError,
    topSellingProducts
  } = useSelector(state => state.product);

  const dispatch = useDispatch();
  const dispatched = useRef(false);

  useEffect(() => {
    if (!dispatched.current) {
      dispatched.current = true;
      dispatch(loadTopSellingProductsRequest());
    }
  }, []);

  let content;

  if (loadTopSellingProductsLoading && !loadTopSellingProductsDone) {
    content = <div style={{ width: '400px', paddingLeft: '40px' }}>ランキングを読み込み中...</div>;
  } else if (!loadTopSellingProductsDone && loadTopSellingProductsError) {
    content = <div style={{ width: '400px', paddingLeft: '40px' }}>ランキングを読み込めませんでした。</div>;
  } else if (loadTopSellingProductsDone && topSellingProducts && topSellingProducts.length === 0) {
    content = <div style={{ width: '400px', paddingLeft: '40px' }}>ランキングデータがありません。</div>;
  } else if (loadTopSellingProductsDone && topSellingProducts && topSellingProducts.length > 0) {
    content = <div style={{ width: '400px', paddingLeft: '40px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: "1px solid silver" }}>
            <th style={{ width: '60px', padding: '10px', textAlign: 'left' }}>順位</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>商品</th>
            <th style={{ padding: '10px', textAlign: 'right' }}>販売数</th>
          </tr>
        </thead>
        
        <tbody>
          {topSellingProducts.map((product) => {
            return (
              <tr key={product.id} style={{ borderBottom: "1px solid silver" }}>
                <td style={{ width: '60px', padding: '10px', textAlign: 'left' }}>{product.rank}</td>
                <td style={{ padding: '10px', textAlign: 'left' }}>{product.name} {product.emoji}</td>
                <td style={{ padding: '10px', textAlign: 'right' }}>{Math.trunc(product.total_sales)}</td>
              </tr>
            )
          })}          
        </tbody>
      </table>
    </div>;

  } else {
    content = null;
  }

  return (
    <CommonLayout title="ホーム">
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column',
          maxWidth: 700,
          width: '100%',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        {/* 紹介 */}
        <section style={{ display: 'flex', flexDirection: 'column', rowGap: '5px' }}>
          <h2>ようこそ、Cart Connect Marketへ！</h2>

          <p style={{ paddingLeft: '40px' }}>
            ここは、みんなの買い物カートをつなぐソーシャルショッピングサイトです。<br />
            気になる食材を他のユーザーの公開カートから見つけて、自分のカートにコピーしてみましょう！
          </p>

          <ul style={{ listStyle: 'none', paddingLeft: '40px' }}>
            <li>🛒 他の人のカートを見てみよう</li>
            <li>👍 気に入ったら「いいね！」でつながろう</li>
            <li>📤 自分の買い物カートを公開してシェアしよう</li>
          </ul>
        </section>

        {/* ランキング */}
        <section style={{ display: 'flex', flexDirection: 'column', rowGap: '5px', marginTop: '30px' }}>
          <h2>歴代販売ランキング</h2>

          {content}

          <p style={{ paddingLeft: '40px' }}>
            ※販売数：歴代販売数の累積値です。販売数が同じ場合は、最新商品が上位に表示されます。<br/>
          </p>

        </section>

      </div>
    </CommonLayout>
  );
};

export default Home;