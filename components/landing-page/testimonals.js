import Image from 'next/image';

export const Testimonials = ({ testimonials }) => {
  return (
    <>
      {/* Testimonials */}
      <div className="bg-linear-to-b from-gray-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full mb-4">
              <span className="text-sm font-semibold text-indigo-700">Témoignages</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-16">
              Ce que nos clients disent
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className={`relative rounded-2xl shadow-xl p-8 bg-linear-to-br ${index === 0 ? 'from-indigo-600 to-indigo-700' :
                    index === 1 ? 'from-indigo-600 to-indigo-700' :
                      'from-indigo-600 to-pink-700'
                  } transform hover:scale-105 transition-transform duration-300`}
              >
                <div className="absolute top-0 left-0 w-20 h-20 -mt-10 -ml-6">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-white opacity-20">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                <div className="relative z-10">
                  <p className="text-white text-lg italic mb-6">"{testimonial.quote}"</p>

                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full overflow-hidden relative mr-4 border-2 border-white/30">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{testimonial.name}</h3>
                      <p className="text-white/80 text-sm">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <svg
                        key={rating}
                        className={`h-5 w-5 ${rating <= testimonial.rating ? 'text-yellow-300' : 'text-white/30'
                          }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}