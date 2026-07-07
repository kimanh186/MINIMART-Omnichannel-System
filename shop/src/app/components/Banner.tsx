import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import {
  Autoplay,
  EffectFade,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

interface BannerData {
  id: number;
  title: string | null;
  image: string;
  image_url: string;
  sort_order: number;
  active: boolean;
}

export default function Banner() {
  const [banners, setBanners] =
    useState<BannerData[]>([]);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/banners"
      );

      setBanners(
        res.data.data || []
      );
    } catch (err) {
      console.error(
        "Lỗi lấy banner:",
        err
      );
    }
  };

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="relative h-[350px] overflow-hidden">
      <Swiper
        modules={[
          Autoplay,
          EffectFade,
        ]}
        effect="fade"
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={banners.length > 1}
        className="h-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <img
              src={banner.image_url}
              alt={
                banner.title ||
                "MINIMART Banner"
              }
              className="w-full h-[350px] object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}