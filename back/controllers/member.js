const { Member, ShippingAddress } = require('../config/db');
const bcrypt = require('bcrypt');

const saveMemberInSession = async (memberId, req, res, next) => {
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
  req.session.member = memberWithoutPWwithShippingAddress.toJSON();

  await req.session.save();

  return memberWithoutPWwithShippingAddress.toJSON();
};

/* # 로그인 처리 흐름
   이메일 검증 -> 비밀번호 검증 -> 비밀번호를 제외한 멤버 객체 생성

   # Q&A
   Q. 처리 성공 시 프론트엔드 메인 화면으로 리다이렉트시키려면?
   A. 백엔드에서는 status: 200과 함께 성공 응답을 보내고, 프론트엔드에서 리다이렉트 처리하는 것이 일반적임 (ChatGPT) */
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
      return res.status(401).json("会員が存在しません。");
    }

    if (reqPassword !== member.password) {
      return res.status(401).json("パスワードが一致しません。");
    }

    const memberId = member.member_id;

    const savedMember = await saveMemberInSession(memberId, req, res, next);

    return res.status(200).json(savedMember);
  } catch (error) {
    console.log(error);
  }
};

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
      console.error("セッション削除失敗：", err);
      return res.status(500).json({ message: "セッション削除に失敗しました。" });
    }

    if (process.env.NODE_ENV === 'production') {
      res.clearCookie("connect.sid", { 
        path: "/",
        httpOnly: true,
        secure: true,
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
      return res.status(409).json("すでに会員登録済みです。");
    }

    const existingNickname = await Member.findOne({
      where: {
        nickname: reqNickname,
      }
    });

    if (existingNickname) {
      return res.status(409).json("このニックネームは既に使用されています。別のニックネームを試してください。");
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

    const savedMember = await saveMemberInSession(memberId, req, res, next);
    
    return res.status(201).json(savedMember);
  } catch (error) {
    return res.status(500).json('会員登録に失敗しました。');
  }
};

module.exports = { login, me, logout, signup };