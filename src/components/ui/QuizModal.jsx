import React, { useState } from 'react'

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'کدام سیاره گرم‌ترین دمای سطح را در کل منظومه شمسی دارد و علت آن چیست؟',
    options: [
      'عطارد - به دلیل نزدیک‌ترین فاصله به خورشید',
      'زهره - به دلیل اثر گلخانه‌ای شدید جو غلیظ دی‌اکسید کربن',
      'مریخ - به دلیل وجود اکسید آهن در خاک آن',
      'مشتری - به دلیل طوفان‌های عظیم چرخشی'
    ],
    answer: 1,
    explanation: 'زهره با دمای ثابت ۴۶۴ درجه سانتی‌گراد گرم‌ترین سیاره است. جو غلیظ ۹۶ درصدی دی‌اکسید کربن آن گرما را محبوس کرده و از عطارد هم داغ‌تر می‌شود.'
  },
  {
    id: 2,
    question: 'بلندترین کوه آتشفشانی شناخته‌شده در منظومه شمسی چه نام دارد و در کدام سیاره است؟',
    options: [
      'کوه اورست در زمین',
      'کوه کالوریس در عطارد',
      'کوه المپ (Olympus Mons) در مریخ',
      'کوه ماونا کیا در مشتری'
    ],
    answer: 2,
    explanation: 'کوه المپ در مریخ با ارتفاع ۲۱.۹ کیلومتر (سه برابر ارتفاع اورست)، بلندترین آتشفشان منظومه شمسی است.'
  },
  {
    id: 3,
    question: 'سیارک کوتوله سرس (Ceres) در کجا قرار دارد و چه درصدی از جرم کل کمربند سیارکی را تشکیل می‌دهد؟',
    options: [
      'فراتر از نپتون - ۵۰٪',
      'در کمربند سیارک‌ها بین مریخ و مشتری - حدود ۳۳٪ (یک‌سوم)',
      'بین زمین و زهره - ۱۰٪',
      'در مدارهای مشتری - ۷۵٪'
    ],
    answer: 1,
    explanation: 'سرس بزرگ‌ترین جرم کمربند سیارکی بین مریخ و مشتری است و به تنهایی حدود یک‌سوم جرم کل این کمربند را شامل می‌شود.'
  },
  {
    id: 4,
    question: 'کدام سیاره به صورت غیرعادی روی پهلوی خود (انحراف محوری ۹۷.۸ درجه) می‌چرخد؟',
    options: [
      'زحل',
      'نپتون',
      'اورانوس',
      'مریخ'
    ],
    answer: 2,
    explanation: 'اورانوس انحراف محوری شدید ۹۷.۸ درجه دارد؛ به طوری که تقریباً روی پهلو غلت می‌خورد و هر قطب آن ۴۲ سال پیوسته تاریک یا روشن است.'
  },
  {
    id: 5,
    question: 'کدام فضاپیمای ساخت بشر دورترین شیء دست‌ساز از کره زمین در فضای بین‌ستاره‌ای است؟',
    options: [
      'تلسکوپ جیمز وب',
      'وویجر ۱ (Voyager 1)',
      'نیوهورایزنز (New Horizons)',
      'کاوشگر پارکر'
    ],
    answer: 1,
    explanation: 'وویجر ۱ که در سال ۱۹۷۷ پرتاب شد، از منظومه شمسی خارج شده و در فاصله بیش از ۲۴ میلیارد کیلومتری، دورترین ساخت دست بشر است.'
  },
  {
    id: 6,
    question: 'چرا سیاره زحل روی آب شناور می‌ماند اگر استخری به اندازه کافی بزرگ وجود داشت؟',
    options: [
      'به دلیل داشتن سیستم حلقه‌های یخی',
      'چون چگالی آن (۰.۶۹ g/cm³) کمتر از چگالی آب (۱ g/cm³) است',
      'به دلیل میدان مغناطیسی قوی',
      'به دلیل وجود یخ متان روی سطح آن'
    ],
    answer: 1,
    explanation: 'زحل تنها سیاره منظومه شمسی است که چگالی متوسط آن کمتر از آب است و به همین دلیل روی آب شناور می‌ماند.'
  },
  {
    id: 7,
    question: 'تندترین و شدیدترین بادهای ثبت‌شده در منظومه شمسی (با سرعت ۲,۱۰۰ کیلومتر بر ساعت) در کدام سیاره می‌وزد؟',
    options: [
      'مشتری',
      'زحل',
      'نپتون',
      'زهره'
    ],
    answer: 2,
    explanation: 'بادهای نپتون با سرعتی فراتر از سرعت صوت (بیش از ۲,۱۰۰ کیلومتر بر ساعت) تندترین بادهای کل منظومه شمسی هستند.'
  },
  {
    id: 8,
    question: 'خورشید چه درصدی از کل جرم منظومه شمسی را به تنهایی تشکیل داده است؟',
    options: [
      '۵۰ درصد',
      '۷۵ درصد',
      '۹۰.۵ درصد',
      '۹۹.۸۶ درصد'
    ],
    answer: 3,
    explanation: 'خورشید ۹۹.۸۶ درصد از کل جرم منظومه شمسی را تشکیل داده و تنها ۰.۱۴ درصد باقی‌مانده سهم تمام سیارات و اجرام دیگر است.'
  },
  {
    id: 9,
    question: 'بزرگ‌ترین قمر منظومه شمسی که حتی از سیاره عطارد هم بزرگ‌تر است چه نام دارد و متعلق به کدام سیاره است؟',
    options: [
      'تایتان - زحل',
      'گانیمد - مشتری',
      'اروپا - مشتری',
      'تریتون - نپتون'
    ],
    answer: 1,
    explanation: 'گانیمد (Ganymede) قمر مشتری، با قطر ۵,۲۶۸ کیلومتر بزرگ‌ترین قمر منظومه شمسی بوده و از عطارد بزرگ‌تر است.'
  },
  {
    id: 10,
    question: 'پدیده طوفان شش‌ضلعی (Hexagon) عجیب و دائمی در قطب شمال کدام سیاره مشاهده می‌شود؟',
    options: [
      'مشتری',
      'زحل',
      'اورانوس',
      'مریخ'
    ],
    answer: 1,
    explanation: 'طوفان شش‌ضلعی قطب شمال زحل پدیده‌ای بی‌نظیر است که عرض اضلاع آن از قطر کره زمین هم بزرگ‌تر است.'
  },
  {
    id: 11,
    question: 'چرخش محوری کدام سیاره معکوس (از شرق به غرب) است؛ به طوری که خورشید از غرب طلوع می‌کند؟',
    options: [
      'زهره',
      'عطارد',
      'مریخ',
      'نپتون'
    ],
    answer: 0,
    explanation: 'زهره بر خلاف اکثر سیارات، چرخش محوری معکوس دارد و خورشید در آسمان آن از سمت غرب طلوع می‌کند.'
  },
  {
    id: 12,
    question: 'کدام قمر منظومه شمسی دارای دریاچه‌هایی از متان و اتان مایع و جوی غلیظ از نیتروژن است؟',
    options: [
      'ماه',
      'فوبوس',
      'تایتان (زحل)',
      'کالیستو'
    ],
    answer: 2,
    explanation: 'تایتان قمر عظیم زحل تنها قمر دارای جو غلیظ و اقیانوس‌ها و دریاچه‌هایی از هیدروکربن‌های مایع مانند متان است.'
  },
  {
    id: 13,
    question: 'عظیم‌ترین دره شکافی منظومه شمسی به نام "دره مارینر" در کدام سیاره قرار دارد؟',
    options: [
      'زمین',
      'مریخ',
      'عطارد',
      'زهره'
    ],
    answer: 1,
    explanation: 'دره مارینر در مریخ با طول ۴,۰۰۰ کیلومتر و عمق ۷ کیلومتر، بزرگ‌ترین دره شناخته‌شده در منظومه شمسی است.'
  },
  {
    id: 14,
    question: 'کدام کاوشگر ناسا نزدیک‌ترین فاصله تاریخی را به تاج خورشیدی (خورشید) ثبت نموده است؟',
    options: [
      'کاوشگر پارکر (Parker Solar Probe)',
      'هابل',
      'وویجر ۲',
      'کاسیینی'
    ],
    answer: 0,
    explanation: 'کاوشگر آفتاب‌پیمای پارکر با عبور از داخل تاج خورشیدی، نزدیک‌ترین شیء دست‌ساز به خورشید با سرعت‌های بی‌نظیر است.'
  },
  {
    id: 15,
    question: 'سریع‌ترین سیاره در چرخش مداری به دور خورشید (با سرعت ۴۷ کیلومتر بر ثانیه) کدام است؟',
    options: [
      'زمین',
      'عطارد',
      'مریخ',
      'زهره'
    ],
    answer: 1,
    explanation: 'عطارد هر ۸۸ روز یک بار مدار خود به دور خورشید را با سرعت ۴۷ کیلومتر بر ثانیه کامل می‌کند.'
  },
  {
    id: 16,
    question: 'طوفان عظیم چرخشی "لکه سرخ بزرگ" (Great Red Spot) در مشتری چه مدتی است که فعال می‌باشد؟',
    options: [
      'حدود ۱۰ سال',
      'حدود ۵۰ سال',
      'بیش از ۳۵۰ سال',
      '۱,۰۰۰ سال'
    ],
    answer: 2,
    explanation: 'لکه سرخ بزرگ طوفانی عظیم در مشتری است که ابعادی بزرگ‌تر از کره زمین داشته و حداقل ۳۵۰ سال است که پیوسته می‌چرخد.'
  },
  {
    id: 17,
    question: 'قمر "اروپا" (Europa) متعلق به مشتری به چه دلیلی مقصد اصلی کشف حیات کیهانی است؟',
    options: [
      'داشتن جو غلیظ اکسیژن',
      'وجود اقیانوسی از آب مایع زیر پوسته یخی آن',
      'داشتن آتشفشان‌های فعال داغ',
      'پوشش گیاهی روی سطح'
    ],
    answer: 1,
    explanation: 'قمر اروپا دارای اقیانوسی عمیق از آب مایع در زیر پوسته یخی خود است که توسط گرمای کشش گرانشی مشتری گرم نگه‌داشته می‌شود.'
  },
  {
    id: 18,
    question: 'کدام سیاره چگال‌ترین (فشرده‌ترین) سیاره در کل منظومه شمسی است؟',
    options: [
      'مشتری',
      'عطارد',
      'زمین',
      'مریخ'
    ],
    answer: 2,
    explanation: 'زمین با چگالی متوسط ۵.۵۱ گرم بر سانتی‌متر مکعب، چگال‌ترین سیاره در منظومه شمسی محسوب می‌شود.'
  },
  {
    id: 19,
    question: 'قمر "تریتون" نپتون چه ویژگی مداری منحصر‌به‌فردی در میان قمرهای بزرگ دارد؟',
    options: [
      'حرکت در جهت معکوس (پس‌گرد) مدار سیاره خود',
      'داشتن دو خورشید در آسمان',
      'ایستادن ثابت روی مدار',
      'چرخش مربع شکل'
    ],
    answer: 0,
    explanation: 'تریتون تنها قمر بزرگ منظومه شمسی است که در جهت معکوس چرخش سیاره مادر خود (نپتون) می‌چرخد.'
  },
  {
    id: 20,
    question: 'رنگ سرخ سیاره مریخ ناشی از وجود چه ماده‌ای در سطح و خاک آن است؟',
    options: [
      'دی‌اکسید کربن منجمد',
      'اکسید آهن (زنگ آهن)',
      'سولفور گوگرد',
      'مس اکسیدشده'
    ],
    answer: 1,
    explanation: 'اکسید آهن (زنگ آهن) فراوان در خاک و غبار مریخ، باعث انعکاس نور قرمز و نام‌گذاری آن به "سیاره سرخ" شده است.'
  }
]

export default function QuizModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [score, setScore] = useState(0)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const currentQ = QUIZ_QUESTIONS[currentIdx]

  const handleSelectOption = (idx) => {
    if (isAnswered) return
    setSelectedOption(idx)
    setIsAnswered(true)

    if (idx === currentQ.answer) {
      setScore(prev => prev + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx(prev => prev + 1)
      setSelectedOption(null)
      setIsAnswered(false)
    } else {
      setIsCompleted(true)
    }
  }

  const handleRestart = () => {
    setCurrentIdx(0)
    setSelectedOption(null)
    setScore(0)
    setIsAnswered(false)
    setIsCompleted(false)
  }

  return (
    <>
      {/* Top-Left Floating Button */}
      <div className="fixed left-6 top-6 z-40 pointer-events-auto select-none" dir="rtl">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-[#080b12]/90 border border-cyan-500/40 text-cyan-300 hover:text-white font-bold text-xs shadow-[0_0_20px_rgba(0,229,255,0.25)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] hover:bg-[#002f3a] transition-all flex items-center gap-2 backdrop-blur-xl border-cyan-400/30 cursor-pointer"
        >
          <span className="text-base animate-pulse">🧠</span>
          <span>آزمون علمی منظومه شمسی</span>
        </button>
      </div>

      {/* Quiz Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none" dir="rtl">
          <div className="w-full max-w-2xl bg-[#080b12]/95 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,229,255,0.2)] flex flex-col gap-6 relative overflow-hidden">
            
            {/* Background Glow Effect */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧠</span>
                <div>
                  <h3 className="text-lg font-extrabold text-white tracking-wide">آزمون علمی منظومه شمسی</h3>
                  <p className="text-xs text-cyan-400 font-medium">سنجش دانش نجوم و اخترشناسی</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white flex items-center justify-center transition-all text-sm font-bold border border-white/10"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            {!isCompleted ? (
              <div className="flex flex-col gap-5">
                {/* Progress Bar & Counter */}
                <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                  <span>سوال {currentIdx + 1} از {QUIZ_QUESTIONS.length}</span>
                  <span className="text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
                    امتیاز: {score}
                  </span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300 shadow-[0_0_10px_#00e5ff]"
                    style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                  />
                </div>

                {/* Question Text */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mt-1">
                  <h4 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    {currentQ.question}
                  </h4>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 gap-3">
                  {currentQ.options.map((opt, idx) => {
                    let btnStyle = 'bg-[#0a121c] text-gray-200 border-[#152738] hover:bg-[#0f1d2b] hover:border-cyan-500/40'

                    if (isAnswered) {
                      if (idx === currentQ.answer) {
                        btnStyle = 'bg-emerald-950/80 text-emerald-300 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] font-bold'
                      } else if (idx === selectedOption) {
                        btnStyle = 'bg-rose-950/80 text-rose-300 border-rose-500 font-bold'
                      } else {
                        btnStyle = 'bg-white/5 text-gray-500 border-transparent opacity-50'
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswered}
                        className={`w-full text-right p-4 rounded-xl text-xs sm:text-sm transition-all duration-200 border flex items-center justify-between gap-3 ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && idx === currentQ.answer && (
                          <span className="text-emerald-400 font-bold text-base shrink-0">✓</span>
                        )}
                        {isAnswered && idx === selectedOption && idx !== currentQ.answer && (
                          <span className="text-rose-400 font-bold text-base shrink-0">✕</span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Explanation Box */}
                {isAnswered && (
                  <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-xl p-4 text-xs text-cyan-200 leading-relaxed animate-fadeIn">
                    <span className="font-bold text-cyan-400 block mb-1">💡 پاسخ علمی:</span>
                    {currentQ.explanation}
                  </div>
                )}

                {/* Next Question Button */}
                {isAnswered && (
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.7)] transition-all cursor-pointer"
                    >
                      {currentIdx + 1 === QUIZ_QUESTIONS.length ? 'مشاهده نتیجه نهایی 🏆' : 'سوال بعدی ➔'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Score Summary Screen */
              <div className="flex flex-col items-center text-center gap-6 py-6 animate-fadeIn">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_40px_rgba(0,229,255,0.4)]">
                  <span className="text-5xl">🏆</span>
                </div>

                <div>
                  <h4 className="text-xl font-extrabold text-white mb-2">نتیجه نهایی آزمون کیهانی</h4>
                  <p className="text-sm text-gray-300">
                    شما به <span className="text-cyan-400 font-bold">{score}</span> سوال از <span className="font-bold">{QUIZ_QUESTIONS.length}</span> سوال پاسخ صحیح دادید.
                  </p>
                </div>

                {/* Badge Title based on Score */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 px-6 py-3 rounded-2xl text-xs font-bold text-cyan-300">
                  {score >= 18 && '🌟 رتبه: اخترشناس ارشد و کاوشگر ارشد کیهان'}
                  {score >= 12 && score < 18 && '🚀 رتبه: فضانورد حرفه‌ای منظومه شمسی'}
                  {score < 12 && '🪐 رتبه: دانش‌پژوه تازه‌کار نجوم'}
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={handleRestart}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    شروع مجدد آزمون 🔄
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    بستن ✕
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  )
}
