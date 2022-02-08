import styled from '@emotion/styled';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as TypesSwiper } from 'swiper/types';
import 'swiper/css/pagination';
import 'swiper/css';
import { Pagination } from 'swiper';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { UserState, ValidRounge, UserInfo } from '@interface/StoreInterface';
import { RootReducer } from '../../store/reducer';
const SwiperStyled = styled(Swiper)`
  background-color: ${({ theme }: any) =>
    theme.customTheme.defaultMode.headerMenuBackgroundColor};
  height: 60px;
  width: 100%;
  & .swiper-pagination-bullet {
    background-color: #fff;
    height: 6px;
    width: 6px;
  }
  & .swiper-pagination {
    height: 14px;
    z-index: 1;
  }
  & .swiper-slide {
    // color: rgba(93, 93, 95, 0.9); // swiper 양 옆 글자 색
    color: ${({ theme }: any) =>
      theme.customTheme.defaultMode.swiperSlideTextColor};
    text-align: center;
    font-size: 0.8rem;
    line-height: 1.6rem;
    z-index: 1080;
  }
  & .swiper-slide-active {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
    line-height: 1.2rem;
    font-weight: bolder;
  }
  & .slide-title {
    margin-top: 16px;
  }
  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }: any) =>
      theme.customTheme.darkMode.headerMenuBackgroundColor};
    & .swiper-slide {
      color: ${({ theme }: any) =>
        theme.customTheme.darkMode.swiperSlideTextColor};
    }
    & .swiper-slide-active {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1rem;
      line-height: 1.2rem;
      font-weight: bolder;
    }
    & .slide-title {
      margin-top: 16px;
    }
  }
`;

const HeaderHome: React.FC = () => {
  const { user: myInfo } = useSelector((state: RootReducer) => state.user);
  const router = useRouter();
  const headerLinks: { url: string; title: string }[] = [];
  if (myInfo?.validRounges)
    headerLinks.push(
      ...myInfo?.validRounges.map((v: ValidRounge) => ({
        title: v.title,
        url: `/list/${v.url}`,
      })),
    );
  if (headerLinks.length === 0) {
    headerLinks.push(
      { title: '타임라인', url: 'timeline' },
      { title: '토픽', url: 'topic' },
    );
  }
  const initialSlide = headerLinks.findIndex(
    ({ url }) => url === router.asPath,
  );
  return (
    <SwiperStyled
      slidesPerView={3}
      spaceBetween={30}
      centeredSlides={true}
      pagination={{
        clickable: false,
      }}
      initialSlide={initialSlide}
      onSlideChange={(e: TypesSwiper) => {
        e.slideTo(e.activeIndex);
        router.push(headerLinks[e.activeIndex].url);
      }}
      slideToClickedSlide
      modules={[Pagination]}
    >
      {headerLinks.map(({ title }) => (
        <SwiperSlide key={title}>
          <div className="slide-title">{title}</div>
        </SwiperSlide>
      ))}
    </SwiperStyled>
  );
};
export default HeaderHome;
