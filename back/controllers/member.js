const { Member, ShippingAddress } = require('../config/db');
const bcrypt = require('bcrypt');

/* # 로그인 처리 흐름
   이메일 검증 -> 비밀번호 검증 -> 비밀번호를 제외한 멤버 객체 생성

   # Q&A
   Q. 처리 성공 시 프론트엔드 메인 화면으로 리다이렉트시키려면?
   A. 백엔드에서는 status: 200과 함께 성공 응답을 보내고, 프론트엔드에서 리다이렉트 처리하는 것이 일반적임 (ChatGPT)
   Q. 처음 로그인했을 때 서버가 클라이언트에게 쿠키를 보내주는지 아닌지 확인하려면?
   A. 개발자 도구 (F12) -> Network 탭으로 이동 -> 로그인 요청 (/login)을 찾고 클릭 -> Response Headers에서 Set-Cookie 항목이 있는지 확인 (ChatGPT)
   Q. 회원 정보 조회 결과가 없을 때 어떤 응답 status가 적절할까?
   A. 401 Unauthorized (ChatGPT)
   Q. 유저 객체에서 비밀번호를 제외하고 리턴하려면?
   A. member 객체에서 password 속성을 분리해 password 변수에 저장하고, 나머지 속성(id, name, email 등)은 새 객체에 담는 객체 구조 분해 할당 문법을 쓰면 됩니다 (ChatGPT)
   Q. login 함수의 res.status(200).json(member);에서 memberWithoutPassword 이걸 넘겨야 하는 거 아닌가?
   Q. 유저 정보를 세션에 저장하고 클라이언트에 넘기는 부분을 함수로 따로 빼서 /signup 쪽에서도 같은 코드를 쓸 수 있게 하기? */
const login = async (req, res, next) => {
  const reqEmail = req.body.email;
  const reqPassword = req.body.password;

  try {
    const member = await Member.findOne({
      where: {
        email: reqEmail,
      }
    });

    if (!member) {
      return res.status(401).json("회원이 존재하지 않습니다.");
    }

    if (reqPassword !== member.dataValues.password) {
      return res.status(401).json("비밀번호가 일치하지 않습니다.");
    }

    const { password, ...memberWithoutPassword } = member.dataValues;

    req.session.member = memberWithoutPassword;

    await req.session.save();

    res.status(200).json(member);
  } catch (error) {
    console.log(error);
  }
};

// Q. 첫 방문 시 로그인을 하지 않았다고 401 코드를 보내는 건 좀 아닌 것 같아
// A. 첫 방문 시 로그인 여부만 확인하는 API에서는 204 No Content가 더 적절함! (ChatGPT)
const me = async (req, res, next) => {
  if (!req.session.member) {
    return res.sendStatus(204);
  } else {
    return res.status(200).json(req.session.member);
  }
};

// Q. 왜 req.session.destroy는 콜백 구조지?
// A. req.session.destroy()는 비동기 작업이라, 세션이 완전히 삭제된 후에 res.clearCookie()가 실행되어야 해요. 그 순서를 보장하기 위해 destroy의 콜백 안에서 clearCookie()를 호출하는 거예요. (ChatGPT)
// Q. 배포 상태에서 로그아웃했을 때 브라우저에서 쿠키가 사라지지 않는 문제가 있어
// A. 로그아웃 시 clearCookie()에 domain 옵션이 없으면 브라우저는 도메인이 다른 쿠키로 인식해서 삭제하지 않음. res.clearCookie() 호출 시 domain을 명시해줘야 함 (ChatGPT)
const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("세션 삭제 실패: ", err);
      return res.status(500).json({ message: "Failed to destroy session" });
    }

    if (process.env.NODE_ENV === 'production') {
      res.clearCookie("connect.sid", { 
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        domain: ".sarifor.net",
      });
    } else {
      res.clearCookie("connect.sid", { 
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
    }
    
    return res.status(200).json({ data: null, message: "ok" });
  });
};

// Q. 이미 가입한 경우의 response status?
// Q. 회원 가입 처리 실패 시의 resposne status?
// Q. status 200 vs 201 ?
// A. 200 OK는 요청이 성공했다는 일반적인 의미고, 201 Created는 서버가 요청을 처리해 새로운 리소스를 생성했음을 나타내는 응답 코드입니다 (ChatGPT)
// Q. memberWithoutPWwithShippingAddress에 ShippingAddress 모델의 정보가 안 담겨
// A. db.js에서 Member.hasMany(ShippingAddress, { foreignKey: 'member_id' }); ShippingAddress.belongsTo(Member, { foreignKey: 'member_id' }); 설정 (ChatGPT)
// Q. status 401 vs 409 ?
const signup = async (req, res, next) => {
  // 이메일로 가입 or 구글 계정으로 가입 판별
  // TBD

  const reqEmail = req.body.email;
  const reqFamilyname = req.body.familyname;
  const reqFirstname = req.body.firstname;
  const reqNickname = req.body.nickname;
  const reqPassword = req.body.password;
  const reqReceiver = req.body.receiver;
  const reqPostalnumber = req.body.postalnumber;
  const reqAddress = req.body.address;

  try {
    // 이메일 존재?
    const existingEmail = await Member.findOne({
      where: {
        email: reqEmail,
      }
    });

    if (existingEmail) {
      return res.status(409).json("이미 가입한 회원입니다.");
    }

    const existingNickname = await Member.findOne({
      where: {
        nickname: reqNickname,
      }
    });

    if (existingNickname) {
      return res.status(409).json("이미 있는 닉네임입니다. 다른 닉네임을 써 주세요.");
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(reqPassword, 12);

    // 데이터베이스 저장
    await Member.create({
      email: reqEmail,
      family_name: reqFamilyname,
      first_name: reqFirstname,
      nickname: reqNickname,
      password: hashedPassword,
    });

    const newMember = await Member.findOne({
      where: {
        email: reqEmail,
      }
    });

    const memberId = newMember.member_id;

    await ShippingAddress.create({
      member_id: memberId,
      receiver: reqReceiver,
      address: reqAddress,
      postcode: reqPostalnumber,
    });

    // 비밀번호 제외한 유저 정보와 해당 유저의 배송 주소 정보를 한 객체에 담기
    const memberWithoutPWwithShippingAddress = await Member.findOne({
      where: { member_id: memberId },
      attributes: { exclude: ['password'] },
      include: [{
        model: ShippingAddress,
        attributes: ['shipping_address_id', 'receiver', 'address', 'postcode'],
      }],
    });
     
    // 로그인 처리
    req.session.member = memberWithoutPWwithShippingAddress.dataValues;

    await req.session.save();
    
    res.status(201).json(memberWithoutPWwithShippingAddress);
  } catch (error) {
    return res.status(401).json(`회원 가입에 실패하였습니다: ${error}`);
  }
};

module.exports = { login, me, logout, signup };