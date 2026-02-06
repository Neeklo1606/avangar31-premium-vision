import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui'

const ABOUT_IMAGES = {
  exclusive: '/images/about-exclusive.png',
  lowPercent: '/images/about-low-percent.png',
  experience: '/images/about-experience.png',
}

const CrownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 text-primary">
    <path d="M15.3674 12.4874C17.8574 13.2154 20.0444 14.7307 21.6007 16.8062C23.1571 18.8818 23.9989 21.4058 24 24H0C0.000522782 21.4056 0.842094 18.8813 2.39851 16.8057C3.95493 14.73 6.1423 13.2148 8.63262 12.4874L12 17.5385L15.3674 12.4874ZM18 6C18 7.5913 17.3679 9.11742 16.2426 10.2426C15.1174 11.3679 13.5913 12 12 12C10.4087 12 8.88258 11.3679 7.75736 10.2426C6.63214 9.11742 6 7.5913 6 6C6 4.4087 6.63214 2.88258 7.75736 1.75736C8.88258 0.632141 10.4087 0 12 0C13.5913 0 15.1174 0.632141 16.2426 1.75736C17.3679 2.88258 18 4.4087 18 6Z" fill="currentColor" />
  </svg>
)
const PeopleIcon = () => (
  <svg width="24" height="22" viewBox="0 0 28 26" fill="none" className="shrink-0 text-primary">
    <path d="M4.2 26V23.1111H23.8V26H4.2ZM4.2 20.9444L2.415 9.35278C2.36834 9.35278 2.3156 9.35904 2.2568 9.37156C2.198 9.38408 2.14574 9.38985 2.1 9.38889C1.51667 9.38889 1.02107 9.178 0.613203 8.75623C0.205336 8.33445 0.000936515 7.82311 3.18182e-06 7.22222C-0.000930151 6.62134 0.20347 6.11 0.613203 5.68823C1.02294 5.26645 1.51854 5.05556 2.1 5.05556C2.68147 5.05556 3.17754 5.26645 3.5882 5.68823C3.99887 6.11 4.2028 6.62134 4.2 7.22222C4.2 7.39074 4.18227 7.54722 4.1468 7.69167C4.11133 7.83611 4.07073 7.96852 4.025 8.08889L8.4 10.1111L12.775 3.93611C12.5183 3.74352 12.3083 3.49074 12.145 3.17778C11.9817 2.86482 11.9 2.52778 11.9 2.16667C11.9 1.56482 12.1044 1.053 12.5132 0.631225C12.922 0.209448 13.4176 -0.000959673 14 3.2903e-06C14.5824 0.000966253 15.0785 0.211855 15.4882 0.63267C15.8979 1.05348 16.1019 1.56482 16.1 2.16667C16.1 2.52778 16.0183 2.86482 15.855 3.17778C15.6917 3.49074 15.4817 3.74352 15.225 3.93611L19.6 10.1111L23.975 8.08889C23.9283 7.96852 23.8873 7.83611 23.8518 7.69167C23.8163 7.54722 23.7991 7.39074 23.8 7.22222C23.8 6.62037 24.0044 6.10856 24.4132 5.68678C24.822 5.265 25.3176 5.0546 25.9 5.05556C26.4824 5.05652 26.9785 5.26741 27.3882 5.68823C27.7979 6.10904 28.0019 6.62037 28 7.22222C27.9981 7.82408 27.7942 8.33589 27.3882 8.75767C26.9822 9.17945 26.4861 9.38985 25.9 9.38889C25.8533 9.38889 25.8011 9.38311 25.7432 9.37156C25.6853 9.36 25.6326 9.35374 25.585 9.35278L23.8 20.9444H4.2Z" fill="currentColor" />
  </svg>
)
const KeysIcon = () => (
  <svg width="18" height="30" viewBox="0 0 21 35" fill="none" className="shrink-0 text-primary">
    <path d="M10.8906 0.000283245C10.4081 0.000283245 9.91794 0.0328306 9.42013 0.0895992C6.77024 0.393122 4.45733 1.42101 2.82604 2.89472C1.18709 4.36919 0.206783 6.34323 0.45186 8.43231C0.666302 10.2943 1.8151 11.8536 3.44639 12.9284C3.64551 12.4591 3.89825 12.0277 4.15099 11.6795C2.80306 10.8015 1.97593 9.6131 1.82276 8.27336C1.64661 6.78224 2.33589 5.27749 3.7221 4.02404C5.11597 2.76983 7.19147 1.82445 9.58862 1.55044C11.9858 1.27568 14.2298 1.7268 15.8764 2.63283C17.5153 3.53961 18.5339 4.85135 18.7101 6.33566C18.8786 7.7965 18.2352 9.27248 16.9179 10.4987C16.1034 9.99572 15.167 9.71859 14.2068 9.69635H14.0383C13.6477 9.70392 13.2648 9.74934 12.8665 9.8326C9.99453 10.4911 8.21006 13.2766 8.86871 16.0923C9.27462 17.8332 10.523 19.1654 12.1007 19.7633L15.1411 32.7974L18.7407 35L21 31.4652L19.2002 30.3677L20.3337 28.5965L18.5339 27.4914L19.6597 25.7278L17.86 24.6227L18.9934 22.8515L17.9595 18.4311C19.116 17.2125 19.6444 15.4716 19.2385 13.7231C19.0317 12.8376 18.6105 12.0579 18.0284 11.4221C19.4759 9.98398 20.3107 8.12954 20.081 6.18427C19.8359 4.09897 18.4267 2.39667 16.4891 1.3317C14.919 0.465029 12.9814 -0.0133412 10.8906 0.000283245ZM9.34354 10.2565C7.35996 10.3397 5.52188 11.5281 4.71772 13.4507C4.02079 15.1083 4.25821 16.9097 5.19256 18.31L0 30.6477L1.63129 34.508L5.55252 32.9261L4.73304 30.9959L6.69365 30.2087L5.88184 28.2786L7.84245 27.4914L7.02298 25.5613L8.98359 24.7665L10.7298 20.6186C9.15974 19.7482 7.95733 18.2571 7.52079 16.395C6.99234 14.1016 7.7582 11.8081 9.34354 10.2565ZM13.7856 10.8014C14.4672 10.7939 15.1105 11.0664 15.5777 11.5129C15.1565 11.7779 14.6893 12.0125 14.1991 12.2244C14.0766 12.179 13.9464 12.1639 13.8085 12.1639C13.7626 12.1639 13.7243 12.1639 13.686 12.1715C13.1499 12.232 12.7516 12.6332 12.6827 13.1327C12.6674 13.2084 12.6674 13.2841 12.6674 13.3523C12.6751 13.375 12.6751 13.4052 12.6751 13.4279C12.7516 14.0638 13.3107 14.5028 13.954 14.4271C14.4748 14.3665 14.8731 13.9805 14.9497 13.4961C15.4245 13.2841 15.8687 13.0495 16.2899 12.7846C16.3053 12.8603 16.3206 12.9359 16.3282 13.0116C16.4891 14.3741 15.4858 15.623 14.1072 15.7819C12.7363 15.9409 11.465 14.9493 11.3118 13.5869C11.151 12.2244 12.1543 10.9755 13.5328 10.8166C13.6171 10.809 13.7013 10.8014 13.7856 10.8014Z" fill="currentColor" />
  </svg>
)

const AboutPlatformSection = () => {
  return (
    <section id="about" className="w-full bg-white py-8 lg:py-12">
      <div className="max-w-container mx-auto px-4">
        <h2 className="text-dark text-2xl lg:text-3xl font-rubik font-bold mb-6 lg:mb-8">
          О платформе Live Grid
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Левая колонка: карточки с фото */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
            {/* Большая карточка */}
            <div className="sm:col-span-2 relative rounded-lg overflow-hidden min-h-[240px] lg:min-h-[280px]">
              <img
                src={ABOUT_IMAGES.exclusive}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5 text-white">
                <h3 className="text-lg font-rubik font-bold mb-1">
                  Эксклюзивные объекты
                </h3>
                <p className="text-sm font-rubik opacity-95">
                  Мы работаем с самыми редкими объектами недвижимости
                </p>
              </div>
            </div>

            {/* Малые карточки */}
            <div className="relative rounded-lg overflow-hidden min-h-[160px] lg:min-h-[180px]">
              <img
                src={ABOUT_IMAGES.lowPercent}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 text-white">
                <h3 className="text-base font-rubik font-bold mb-1">Низкий %</h3>
                <p className="text-xs font-rubik opacity-95">
                  Выгодный платеж по ипотеке
                </p>
              </div>
            </div>

            <div className="relative rounded-lg overflow-hidden min-h-[160px] lg:min-h-[180px]">
              <img
                src={ABOUT_IMAGES.experience}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 text-white">
                <h3 className="text-base font-rubik font-bold mb-1">Большой опыт</h3>
                <p className="text-xs font-rubik opacity-95">
                  Найдем выгодные предложения
                </p>
              </div>
            </div>
          </div>

          {/* Правая колонка */}
          <div className="flex flex-col justify-center">
            <h3 className="text-dark text-xl lg:text-2xl font-rubik font-bold mb-4">
              Платформа по недвижимости
            </h3>
            <div className="text-gray-medium text-sm font-rubik space-y-3 mb-5">
              <p>
                LiveGrid — современная платформа для поиска недвижимости. Мы помогаем найти идеальный объект среди тысяч предложений.
              </p>
              <p>
                Наша команда профессионалов обеспечивает полное сопровождение сделки от первого просмотра до получения ключей.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              <Button variant="primary" size="sm" to="/#register">
                Зарегистрироваться
              </Button>
              <Button variant="primary" size="sm" to="/#help">
                Помощь с подбором
              </Button>
            </div>
            
            {/* Статистика */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-start gap-2">
                <CrownIcon />
                <div>
                  <div className="text-dark text-lg font-rubik font-bold">12+ лет</div>
                  <div className="text-gray-medium text-xs font-rubik">опыта на рынке</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <PeopleIcon />
                <div>
                  <div className="text-dark text-lg font-rubik font-bold">15+</div>
                  <div className="text-gray-medium text-xs font-rubik">сотрудников</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <KeysIcon />
                <div>
                  <div className="text-dark text-lg font-rubik font-bold">5 тыс+</div>
                  <div className="text-gray-medium text-xs font-rubik">клиентов</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutPlatformSection
