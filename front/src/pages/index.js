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
      {/* コラム名 */}
      <div style={{ display: 'flex', flexDirection: 'row', padding: '3px', borderBottom: "1px solid silver" }} >
        <span style={{ flexBasis: '60px' }}>順位</span>
        <span style={{ flex: 1 }}>商品</span>
        <span style={{ flex: 1, textAlign: 'right' }}>販売数</span>
      </div>

      {/* データ */}
      <ol style={{ display: 'flex', flexDirection: 'column', rowGap: '10px', padding: '0px', width: '400px', listStyle: 'none' }}>
        {topSellingProducts.map((product) => {
          return (
            <li style={{ display: 'flex', flexDirection: 'row', padding: '3px', paddingRight: '10px', borderBottom: "1px solid silver" }} >
              <span style={{ flexBasis: '60px' }}>{product.rank}</span>
              <span style={{ flex: 1 }}>{product.name} {product.emoji}</span>
              <span style={{ flex: 1, textAlign: 'right' }}>{Math.trunc(product.total_sales)}</span>
            </li>
          )
        })}
      </ol>
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