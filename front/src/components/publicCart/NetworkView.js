import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadPublicCartsNetworkRequest } from '@/reducers/publicCart';
import { Network } from 'vis-network'; 
import { useRouter } from 'next/router';

// Q. '관계 네트워크' 메뉴 클릭할 때 networkInstance가 한 번만 생성되게 하려면?
// Q. 공개 장바구니 네트워크 뷰 화면에서 로그아웃했을 때, 가장 최근 '좋아요' 표시가 즉시 사라지게 하려면?
const NetworkView = () => {
  const {
    loadPublicCartsNetworkLoading,
    loadPublicCartsNetworkDone,
    loadPublicCartsNetworkError,
    publicCartsNetwork,
  } = useSelector(state => state.publicCart);

  const router = useRouter();
  const dispatch = useDispatch();
  const dispatched = useRef(false);
  const networkInstance = useRef(null);
  const container = useRef(null);

  // 초기 데이터 로드
  useEffect(() => {
    if (!dispatched.current) {
      dispatched.current = true;

      // 컴포넌트가 마운트될 때 데이터 요청
      dispatch(loadPublicCartsNetworkRequest());
    }
    
    return () => {
      // 컴포넌트 언마운트 시 네트워크 인스턴스 정리
      if (networkInstance.current) {
        networkInstance.current.destroy();
        networkInstance.current = null;
      }
    };
  }, []);

  // 데이터와 컨테이너 상태에 따라 네트워크 초기화
  useEffect(() => {
    // 로딩 중이거나 컨테이너가 없으면 초기화하지 않음
    if (!container.current || loadPublicCartsNetworkLoading) {
      return;
    }

    // 데이터 로드 완료 및 데이터가 있는지 확인
    if (loadPublicCartsNetworkDone && publicCartsNetwork && publicCartsNetwork.nodes) {
      // 기존 네트워크 인스턴스가 있으면 정리
      if (networkInstance.current) {
        networkInstance.current.destroy();
        networkInstance.current = null;
      }

      try {
        // 데이터 처리 및 검증
        const rawNodes = publicCartsNetwork.nodes || [];
        const rawEdges = publicCartsNetwork.edges || [];
        const latestLikedNodeId = publicCartsNetwork.latestLikedPublicCartId || null;

        // ID가 정의된 노드만 필터링하고, 로그인 회원이 가장 최근에 '좋아요' 누른 노드(공개 장바구니)가 있다면 설명 달기
        const validNodes = rawNodes
          .filter(node => 
            node && 
            node.id !== undefined && 
            node.id !== null
          )
          .map(node => ({
            ...node,            
            shape: node.id === `public-cart-${latestLikedNodeId}` ? 'star' : 'dot',
            label: node.id === `public-cart-${latestLikedNodeId}` ? `${node.label}\n(あなたの最新「いいね」)` : node.label,
          }));

        // 노드가 없으면 초기화하지 않음
        if (validNodes.length === 0) {
          console.log("유효한 노드가 없습니다");
          return;
        } else {
          // 노드 ID 목록 생성
          const nodeIds = new Set(validNodes.map(node => node.id));

          // 유효한 엣지만 필터링
          // - edge.from, edge.to가 undefined 또는 null이 아니고
          // - 해당 ID들이 모두 유효한 노드 ID 집합(nodeIds)에 포함된 경우만 통과
          const validEdges = rawEdges
            .filter(edge => 
              edge && 
              edge.from !== undefined && edge.to !== undefined &&
              edge.from !== null && edge.to !== null &&
              nodeIds.has(edge.from) && 
              nodeIds.has(edge.to)
            )
            .map(edge => ({...edge}));

          // 네트워크 옵션 설정
          const options = {
            physics: {
              enabled: true,
              solver: 'forceAtlas2Based',
              forceAtlas2Based: {
                gravitationalConstant: -100,
                centralGravity: 0.02,
                springLength: 150,
                springConstant: 0.05,
                avoidOverlap: 1
              },
              maxVelocity: 50,
              stabilization: {
                enabled: true,
                iterations: 200
              }
            },
            nodes: {
              font: { size: 16, color: "black", },
              borderWidth: 1,
              shadow: true
            },
            edges: {
              // arrows: { to: { enabled: true } },
              shadow: true,
              smooth: false,
              color: {
                color: 'rgba(100,100,100,0.4)',
                highlight: '#666'
              },
              width: 1,
            },
            interaction: {
              hover: true
            }
          };
      
          // 네트워크 인스턴스 생성
          const data = { nodes: validNodes, edges: validEdges };
          networkInstance.current = new Network(container.current, data, options);
          console.log("networkInstance 생성됨");

          // 클릭 이벤트 추가
          networkInstance.current.on("click", (param) => {
            if (param.nodes && param.nodes.length > 0) {
              const clickedNodeId = param.nodes[0];

              if (clickedNodeId && clickedNodeId.startsWith("public-cart-")) {
                const publicCartId = clickedNodeId.replace("public-cart-", "");
                router.push(`/public-cart/${publicCartId}`);
              }
            }
          });

        }
      } catch (error) {
        console.error("네트워크 생성 오류:", error);
      }
    }
  }, [loadPublicCartsNetworkLoading, loadPublicCartsNetworkDone, publicCartsNetwork]);

  return (
    <>
      {loadPublicCartsNetworkLoading && !loadPublicCartsNetworkDone ? (
        <div>네트워크 그래프 로딩 중...</div>
      ) : !loadPublicCartsNetworkDone && loadPublicCartsNetworkError ? (
        <div>네트워크 그래프를 불러올 수 없습니다.</div>
      ) : loadPublicCartsNetworkDone && publicCartsNetwork && publicCartsNetwork.nodes.length === 0 ? (
        <div>작성된 공개 장바구니가 없습니다.</div>
      ) : loadPublicCartsNetworkDone && publicCartsNetwork && publicCartsNetwork.nodes.length > 0 ? (
        <div 
          ref={container} 
          style={{ 
            height: "500px", 
            width: "100%", 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
          }}
        >
        </div>
      ) : null}
    </>
  );
}

export default NetworkView;