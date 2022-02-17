import axios from 'axios';
import { getDateTime } from '@utils/function';
// 됨 - asdf.jpg
// const txtDataToJoin =
//   '사업자등록증(법인사업자)등록번호 :130-81-83505법인명(단체명):주식회사창세환경대표자:천창봉개업년월일:2001년12월01일법인등록번호:134911-0020965사업장소재지:경기도광명시하안로108.719(소하동에이스굉명타워)본점소재지:경기도광명시하안로108719(소하동에이스공명타워)S사업의 종류:업태서비스종목청소업저수조청소소독업도소매청소용품통신판매소독약품건물관리업건물관리업H10NANTS교부사유:사업장이전국세청KOREA사업자단위과세적용사업자여부:여()부(V)2012년03 월13 일시 흥세무서장단위는(인)NTS국세청';
const txtDataToJoin =
  '사업자등록증(법인사업자)등록번호:13083505법인명(단체명):주식회사창세환경대표천창봉개업년2001년12월01일법인등록번호:134911-0020965사업장소재지:경기도광명시하안로108.719(소하동에이스굉명타워)본점소재지:경기도광명시하안로108719(소하동에이스공명타워)S사업의종류:업태서비스종목청소업저수조청소소독업도소매청소용품통신판매소독약품건물관리업건물관리업H10NANTS교부사유:사업장이전국세청KOREA사업자단위과세적용사업자여부:여()부(V)2012년03월13일시흥세무서장단위는(인)NTS국세청';

// 됨 - business_license.jpg
const txtDataToJoin1 =
  '국세청nts.go.kr사업자등록증(법인사업자:본점)등록번호:101-82-07976법인명(단체명):아름다운재단대표자:한찬희개업연월일:2002년10월17일법인등록번호:110122-0032797사업장소재지:서울특별시종로구자하문로19길6(옥인동)본점소재지:서울특별시종로구자하문로19길6(옥인동)REER사업의종류:업태소매종목재활용품제조출판서비스광고업OFTANAT발급사유:재출력희망(컬러출)N국세청KOREA사업자단위과세적용사업자여부:여()부(V)전자세금계산서전용전자우편주소:2019년07월22일종로세무서장국세청국세청Service';

// 됨 - ocr2.jpg
const txtDataToJoin2 =
  '국세청사업자등록증us.oa.kr(법인사업자)등록번호:104-86-53569법인명(단체명):(주)리그라운드대표자:서성덕임윤희(각자대표)개업연월일:2014년02월20일법인등록번호:110111-5337765사업장소재지:서울특별시중구동호로387-2135층(방산동)본점소재지:서울특별시중구동호로387-2135층(방산동)사업의종류:업태제조업종목생분해성제품포장자재도소매일회용품포장자재발급사유:정정국세청사업자단위과세적용사업자여부:여()부(V)전자세금계산서전용전자우편주소:2019년06월26일중부세무서장국세청NationalTaxService';
// 됨 - ocr1.jpg
const txtDataToJoin3 =
  '국세청사업자등록증ntoolk(법인사업자)등록번호:214-87-39314법인명(단체명):드림에이피에스주식회사대표자:김현권개업연월일:2003년08월05 일법인등록번호:110111-2835209사업장소재지:서울특별시마포구월드컵로964층(서교동영훈빌딩)본점소재지:서울특별시마포구월드컵로96.4층(서교동영훈빌딩)사업의종류:업태건설종목철물공사건설기계설비공사서비스기타도급TEL:02-323-3261발급사유 :FAX:02-323-3610국MAIL:draps@draps.co.kr사업자단위과세적용사업자여부:여()부(V)전자세금계산서전용전자우편주소:2020년06월16 일마포세무서장국세청';

// ocr3.jpeg = 생년월일 / 성명
const txtDataToJoin4 =
  '국세청MENURDS사업자등록증(일반과세자)등록번호:829-07-00318상호:홈119성명:백재봉생년월일:1991년01월20일개업연월일:2016년04월01일사업장소재지:울산광역시남구수암로59(신정동)사업의종류:업태건설업종목인테리어도소매타일금구류발급사유:공동사업자:이메일home-1194naver.com사업자단위과세적용사업자여부:여()부(V)전자세금계산서전용전자우편주소:2016년05월03일울산세무서장국세청';

// ocr4.jpg = 성명 / 생년월일 / 이름 두글자
const txtDataToJoin5 =
  '국세청사업자등록증ntsa0.kk(간이과세자)등록번호:569-19-01664상호:오산조은참치안양평촌점성명:서준생년월일:2002년11월28일개업연월일:2021년09월01일사업장소재지:경기도안양시동안구관악대로297-71층(관양동)사업의종류:업태음식점업종목일식VICESERTAXL발급사유:분실공동사업자:ATTOSEPURATEOFKOREA주류판매신고번호:138-5-35793세청사업범위:판매할주류의종류만을면허장소에서소매하여야한다.판매할주류의종류:주정이외의주류지정조건:1.사업범위를위반하면면허를취소한다.2.타법령에의해허가·등록이취소되면이면허도취소된다.사업자단위과세적용사업자여부:여()부(V)전자세금계산서전용전자우편주소:2021년09월02일동안양세무서장국세청국세청';
type OcrData = {
  b_no: string;
  start_dt: string;
  p_nm: string;
};
export const getOcrData = async (imageUrl: string, imageExt: string) => {
  const timestamp = new Date().getTime();
  let getOcrResult;
  try {
    const data = {
      images: [
        {
          format: imageExt,
          name: 'medium',
          data: imageUrl.split(',')[1],
          url: null,
        },
      ],
      lang: 'ko',
      requestId: 'string',
      resultType: 'string',
      timestamp: timestamp,
      version: 'V1',
    };
    const response = await axios.post('http://localhost:3000/api/ocr', data);
    console.log(response.data.message);
    getOcrResult = resultTxt(response.data.message);
  } catch (e) {
    console.error(e);
  }

  return getOcrResult;
};

const resultTxt = (data: any) => {
  console.log(data);

  const regNum = /([0-9]{3})-([0-9]{2})-([0-9]{5})/;
  const regex = /[^0-9]/g;
  const regDate = /([0-9]{4})년([0-1][0-9])월([0-3][0-9])일/;
  let startDTFilter;
  let nameFilterIdx;
  let p_nm: string;
  //const res = data;
  const filteredText: any = [];
  data.forEach((el: any, idx: number) => {
    filteredText.push(el.inferText);
  });
  console.log(filteredText);
  const res = filteredText.join().replaceAll(',', '').replaceAll(' ', '');

  // 사업자 등록번호 가져옴
  if (!res.match(regNum)) {
    console.log('b_no err');
    return false;
  }
  const b_no: string = res.match(regNum)[0].replaceAll('-', '');

  // 개업연월일 가져옴
  if (res.indexOf('개업연월일:') > 0) {
    console.log('연월일');
    startDTFilter = res.substr(res.indexOf('개업연월일:'));
  } else if (res.indexOf('개업년월일:') > 0) {
    console.log('년월일');
    startDTFilter = res.substr(res.indexOf('개업년월일:'));
  } else {
    return false;
  }
  console.log(startDTFilter);
  if (!startDTFilter.match(regDate)) {
    console.log('not match');
    return false;
  }
  const start_dt: string = startDTFilter.match(regDate)[0].replace(regex, '');

  //이름 가져옴
  if (res.indexOf('성명:') > 0) {
    nameFilterIdx = res.indexOf('성명:');
    p_nm = res.substr(nameFilterIdx + 3, 3);
  } else if (res.indexOf('대표자:') > 0) {
    nameFilterIdx = res.indexOf('대표자:');
    p_nm = res.substr(nameFilterIdx + 4, 3);
  } else {
    console.log('p_nm err');
    return false;
  }

  return { b_no, start_dt, p_nm } as OcrData;
};

export const validateData = async (ocrData: OcrData) => {
  const validateData = {
    businesses: [ocrData],
  };

  // // req data format - 실패확인용 데이터
  // const validateData = {
  //   businesses: [
  //     {
  //       b_no: '8290700318',
  //       start_dt: '20160401',
  //       p_nm: '백봉',
  //     },
  //   ],
  // };

  try {
    const data = await axios.post(
      'http://localhost:3000/api/validateOcrData',
      validateData,
    );
    console.log(data.data.message);
    if (data.data.message) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
  }
};
