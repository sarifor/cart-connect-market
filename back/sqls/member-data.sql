-- # 会員

INSERT INTO member_tbl (member_id, family_name, first_name, nickname, email, password, deleted_at, created_at, updated_at) VALUES
(1, 'さくら', 'うた', 'そんぐちゃん', 'letssong@example.com', '$2b$12$tPbtrwoVA5qf5OJDRcIZouyDx9UU8LOQBein2ms2.joaIsVfn3f7i', NULL, '2025-01-01', '2025-01-01'), -- password: hashed_pw1
(2, 'たなか', 'あやか', 'あやぴ', 'ayaka@example.com', '$2b$12$iTlx2ZbaEzPhampVwV7z.OKx5PcpcDrjIu3jq5o.Y9M/9UHispEFK', NULL, '2025-01-02', '2025-01-04'), -- password: hashed_pw2
(3, 'みやざき', 'れいな', 'れいれい', 'reina@example.com', '$2b$12$4Hv0nGkqWd5ngJ/TA/iDGeV/AxZMebcZmyiBqeX4SCBDa0QP9b9Ce', NULL, '2025-01-09', '2025-05-14'), -- password: hashed_pw3
(4, 'いとう', 'ひかり', 'ひかちゃん', 'hikari4@example.com', '$2b$12$e4yL1xCVbec8GopogYmwPuiOn9jb6FC2kLWQxY1cCIZkxDs3u4lp', NULL, '2025-01-14', '2025-01-14'), -- password: hashed_pw4
(5, 'うえの', 'なおこ', 'なおぴ', 'naoko5@example.com', '$2b$12$QIgPZogUecJ5IlzaMkR6wuGv.PPpjgvZ1gCpUdzXxQt105AMk6vJC', NULL, '2025-02-13', '2025-02-13'), -- password: hashed_pw5
(6, 'おおた', 'えりな', 'えりこ', 'erina6@example.com', '$2b$12$EU3q0ZMb8iOflBbn.aqjTOWRUkdhOjZzkgUc4w7x5cKO0e7VDjCBa', NULL, '2025-03-05', '2025-03-05'), -- password: hashed_pw6
(7, 'かわむら', 'まりこ', 'まりりん', 'mariko7@example.com', '$2b$12$6ivy02.rEJoPY70zpqxSYO1IZOsGWIM8cvJkF1bZJJjJb3ALiVYT6', NULL, '2025-01-22', '2025-02-01'), -- password: hashed_pw7
(8, 'こばやし', 'はるか', 'はるる', 'haruka8@example.com', '$2b$12$kwcDVNgDEoHaJfcL9rvrVuQtWF.NfzsTaiE9g1PlIKeMu5T1OIl72', NULL, '2025-02-10', '2025-02-10'), -- password: hashed_pw8
(9, 'ささき', 'ゆい', 'ゆいっち', 'yui9@example.com', '$2b$12$5MvGvQYnT5Bxhwz2SdciregVzSQpu0YihMSZlBJslLkHwD9fAKwHK', NULL, '2025-03-01', '2025-03-01'), -- password: hashed_pw9
(10, 'しばた', 'しおり', 'しおしお', 'shiori@example.com', '$2b$12$mHOL27EV5qed..xR.JLauO/LM9tKFR8xDzZkX5lTL7uZ0rC4NObQS', NULL, '2025-05-02', '2025-05-02'), -- password: hashed_pw10
(11, 'たかはし', 'みさき', 'みさぴ', 'misaki11@example.com', '$2b$12$doYLuFJXlddQaJ/j1i71du7UIZd2spZkIbo19JZTrK/q88ZiTt98q', NULL, '2025-01-06', '2025-01-06'), -- password: hashed_pw11
(12, 'なかむら', 'あかね', 'あかぽん', 'akane12@example.com', '$2b$12$AvfxJr6ecO2krV5WGBYZ6eCJI4YpmG3Q7rCXEVcczviZgLKdJPl8G', NULL, '2025-01-09', '2025-01-09'), -- password: hashed_pw12
(13, 'はやし', 'ゆうこ', 'ゆうたん', 'yuuko13@example.com', '$2b$12$gDOQAF5UWw7/hGSY1rUXdefP7siyNAb9UyvJnHx56VdYjj.6EbR8G', NULL, '2025-02-05', '2025-02-05'), -- password: hashed_pw13
(14, 'ふじた', 'たまき', 'たまぽん', 'tamaki14@example.com', '$2b$12$3un1HFYJgBEMe9vDPs7SmO/pc7szPrF9k.IgKyrNr900Da53AwmuC', NULL, '2025-02-26', '2025-02-27'), -- password: hashed_pw14
(15, 'まつもと', 'えりか', 'えりり', 'erika15@example.com', '$2b$12$wctG8AvMyZDKj/7q9sFqdujK1Mx5AJdvguqUZfUb5.rtTBQ0KgTmK', NULL, '2025-05-01', '2025-05-01'), -- password: hashed_pw15
(16, 'むらかみ', 'じゅり', 'じゅりぴ', 'juri16@example.com', '$2b$12$CC5Xh9C0UhJcyWLCvzqyauGWIVYKqWY/.XMWPFi282aorv6rSMGkG', NULL, '2025-02-07', '2025-02-07'), -- password: hashed_pw16
(17, 'やまぐち', 'あい', 'あいあい', 'ai17@example.com', '$2b$12$nVp31sonJvuB5Xvjf.FoAOvTpYrTD.TtqCg2TkfBT2hufGFHlwGwi', NULL, '2025-01-19', '2025-01-19'), -- password: hashed_pw17
(18, 'わたなべ', 'りな', 'りなぴ', 'rina18@example.com', '$2b$12$rGU7H50rol3m04Vjs0c0x.khixU726FGqB.OAoWc5aLLDSsx2Yf7y', NULL, '2025-01-11', '2025-01-11'), -- password: hashed_pw18
(19, 'やまだ', 'かなえ', 'かなぽん', 'kanae19@example.com', '$2b$12$fykJjCGAyX2R24VjEvzIq.8FV09Aud/MzKbnoys4e2lfM0R9xiLd.', NULL, '2025-05-09', '2025-05-09'), -- password: hashed_pw19
(20, 'おかだ', 'さくら', 'さくちゃん', 'sakura20@example.com', '$2b$12$8OaVLi2h50RHM7deBVXxueWqjiitIt7TaN4PRWSomwZjop.i0KGDC', '2025-05-22', '2025-03-29', '2025-03-29'); -- password: hashed_pw20