import { useState, useEffect } from 'react';
import axios from 'axios';
import CommonLayout from '../../components/CommonLayout';
import Link from 'next/link';
import { Select, Button } from 'antd';
import { loadShippingAddressesRequest, setSelectedDeliveryDate, setSelectedDeliveryTime, setSelectedPayment } from '../../reducers/checkout';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';

let backURL;

if (process.env.NODE_ENV === 'production') {
  backURL = 'http://ccm-api.sarifor.net';
} else {
  backURL = 'http://localhost:4000';
}

const CheckoutMain = () => {
  const router = useRouter();
  const { me } = useSelector(state => state.member);
  const { 
    loadShippingAddressesLoading,
    loadShippingAddressesDone,
    loadShippingAddressesError,
    shippingAddresses,
    selectedDeliveryDate,
    selectedDeliveryTime,
    selectedPayment,
  } = useSelector(state => state.checkout);

  const dispatch = useDispatch();
  
  const [ serverTime, setServerTime ] = useState('');

  useEffect(() => {
    const getServerTime = async () => {
      const res = await axios.get(`${backURL}/checkout/server-time`, { withCredentials: true });

      if (res.status === 200 && res.data) {
        setServerTime(res.data);
      }
    };

    if (!me || !Number(me.member_id)) {
      router.replace("/");
    } else {
      dispatch(loadShippingAddressesRequest());
      getServerTime();
    }
  }, [me]);

  const handleDeliveryDateChange = (value) => {
    if (value) {
      dispatch(setSelectedDeliveryDate(value));
    }
  };

  const handleDeliveryTimeChange = (value) => {
    if (value) {
      dispatch(setSelectedDeliveryTime(value));
    }
  };
  
  const handlePaymentChange = (value) => {
    if (value) {
      dispatch(setSelectedPayment(value));
    }
  };

  const handleReviewClick = () => {
    router.push('/checkout/review');
  };

  const getDeliveryDateCandidates = (serverTime) => {
    if (!serverTime) {
      return [];
    } else {
      // 서버 시간을 Date 객체로 바꿈
      const date = new Date(serverTime);
      
      // 오늘, 내일, 모레 날짜 구하여 배열에 모으기
      const deliveryDateCandidates = [];

      for (let i = 1; i < 4; i++) {
        const candidate = new Date(date);

        candidate.setDate(date.getDate() + i);
        
        const yyyy = candidate.getFullYear();
        const mm = candidate.getMonth() + 1;
        const dd = candidate.getDate();

        const candidateStr = `${yyyy}/${mm}/${dd}`;

        deliveryDateCandidates.push({
          value: candidateStr,
          label: candidateStr,
        });
      }

      // 배열 반환
      return deliveryDateCandidates;
    }
  };

  // Q. div가 너무 많다. 대신 쓸 수 있는 것?
  // Q. 겹치는 스타일을 유형별로(예: 헤더 스타일, 제목 스타일 등) 분리하여 코드 양을 줄이고 가독성을 높이려면?
  return (
    <CommonLayout title="주문 옵션 선택">
      <div 
        style={{ 
          display: "flex", 
          flexDirection: "column",
          maxWidth: 600,
          width: '100%',
          padding: "20px"
        }}
      >

        {/* 배송 주소 */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", borderBottom: "1px solid black" }}>
            <div style={{ fontWeight: "bold", padding: "10px" }}>
              배송 주소
            </div>
            <div style={{ padding: "10px" }}>
              <Link href="" title="기능 준비 중">수정</Link> <Link href="" title="기능 준비 중">삭제</Link>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", flexDirection: "column", padding: "10px", rowGap: "10px" }}>
            {loadShippingAddressesLoading && (
              <div>
                배송 주소 가져오는 중...
              </div>
            )}
            {loadShippingAddressesDone && shippingAddresses && shippingAddresses[0] && (
              <>
                <div>{shippingAddresses[0].receiver}</div>
                <div>{shippingAddresses[0].postcode}</div>
                <div>{shippingAddresses[0].address}</div>
              </>
            )}
            {loadShippingAddressesDone && shippingAddresses && shippingAddresses.length === 0 && (
              <div>
                하단의 '새 주소 추가'를 클릭하여 배송 주소를 추가해 주세요.
              </div>
            )}
            {loadShippingAddressesError && (
              <div>
                주소를 불러올 수 없습니다: {loadShippingAddressesError}
              </div>
            )}
            </div>
            <div style={{ padding: "10px" }}>
              <Link href="" title="기능 준비 중">새 주소 추가</Link>
            </div>
          </div>

        </div>

        {/* 배송 일시 */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: "16px" }}>
          <div style={{ borderBottom: "1px solid black" }}>
            <div style={{ fontWeight: "bold", padding: "10px" }}>
              배송 일시
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px" }}>
              <Select
                placeholder="배송일 선택"
                value={selectedDeliveryDate || undefined}              
                style={{ width: 200 }}
                onChange={handleDeliveryDateChange}
                options={getDeliveryDateCandidates(serverTime)}
              />
            </div>

            <div style={{ padding: "10px" }}>
              <Select
                placeholder="배송 시간대 선택"
                value={selectedDeliveryTime || undefined}
                style={{ width: 200 }}
                onChange={handleDeliveryTimeChange}
                options={[
                  { value: '07:00 ~ 09:00', label: '07:00 ~ 09:00 ' },
                  { value: '16:00 ~ 18:00', label: '16:00 ~ 18:00' },
                  { value: '18:00 ~ 20:00', label: '18:00 ~ 20:00 ' },
                  { value: '20:00 ~ 22:00', label: '20:00 ~ 22:00' },                                    
                ]}
              />
            </div>
          </div>
        </div>

        {/* 결제 수단 */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: "16px" }}>
          <div style={{ borderBottom: "1px solid black" }}>
            <div style={{ fontWeight: "bold", padding: "10px" }}>
              결제 수단
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", padding: "10px", rowGap: "10px" }}>
            <div>
              <Select
                placeholder="결제 방법 선택"
                value={selectedPayment || undefined}
                style={{ width: 200 }}
                onChange={handlePaymentChange}
                options={[
                  { value: '신용카드', label: '신용카드' },
                  { value: '代引き', label: '代引き' },
                  { value: '프로모션 코드', label: '프로모션 코드'},
                  { value: '쿠폰', label: '쿠폰'},
                ]}
              />
            </div>
            
            { selectedPayment && selectedPayment === "신용카드" && (
              <div>
                {selectedPayment}: 서비스 준비 중!
              </div>
            )}
            { selectedPayment && selectedPayment === "代引き" && (
              <div>
                {selectedPayment}: 배달원에게 최종 구매 합계액에 해당하는 현금을 건네주세요.
              </div>
            )}
            { selectedPayment && selectedPayment === "프로모션 코드" && (
              <div>
                {selectedPayment}: 서비스 준비 중!
              </div>
            )}
            { selectedPayment && selectedPayment === "쿠폰" && (
              <div>
                {selectedPayment}: 서비스 준비 중!
              </div>
            )}                                    
          </div>
        </div>

        {/* '주문 내용 확인' 버튼 */}
        <div style={{ marginTop: "16px" }}>
          <Button type="primary" onClick={handleReviewClick}>注文内容の確認</Button>
        </div>

      </div>
    </CommonLayout>
  );
};

export default CheckoutMain;