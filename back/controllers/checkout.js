const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { ShippingAddress } = require('../config/db');

const getShippingAddress = async (req, res, next) => {
  try {
    // 로그인한 회원인지 확인하고,
    if (!req.session.member) {
      return res.status(401).send("로그인이 필요합니다.");
    }

    // 응답으로 배송처 목록 반환
    const shippingAddresses = await ShippingAddress.findAll({
      where: {
        member_id: req.session.member.member_id,
      },
    });

    res.status(200).json(shippingAddresses);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Q. ChatGPT에 의하면 'dayjs.tz(date, 'Asia/Tokyo')처럼 명시적으로 지정하는 게 안전합니다'라는데, 이렇게 고쳐야 하나?
const getServerTime = async (req, res, next) => {
  try {
    // 응답으로 서버 시간(JST) 반환
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault('Asia/Tokyo');
    // const currentServerTime = dayjs.tz().format("YYYY-MM-DD HH:mm:ss");
    const currentServerTime = dayjs.tz().format();

    res.status(200).json(currentServerTime);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { getShippingAddress, getServerTime };