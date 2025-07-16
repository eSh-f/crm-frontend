import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import styles from '../styles/Carousel.module.scss'

import 'swiper/css'
import 'swiper/css/pagination'

import img1 from '../assets/login-slider-1.jpg'
import img2 from '../assets/login-slider-2.jpg'
import img3 from '../assets/login-slider-3.jpg'

const slides = [
  {
    title: 'Автоматизируй процессы',
    subtitle: 'Экономь время и силы с нашей CRM-системой',
    image: img1,
  },
  {
    title: 'Управляй заказами',
    subtitle: 'Полный контроль над задачами в одном месте',
    image: img2,
  },
  {
    title: 'Развивай бизнес',
    subtitle: 'Мы помогаем расти быстро и уверенно',
    image: img3,
  },
]

const Carousel = () => {
  return (
    <div className={styles.carousel}>
      <Swiper
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className={styles.swiper}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx} className={styles.slide}>
            <img src={slide.image} alt={slide.title} className={styles.image} />
            <div className={styles.textOverlay}>
              <h2>{slide.title}</h2>
              <p>{slide.subtitle}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Carousel
