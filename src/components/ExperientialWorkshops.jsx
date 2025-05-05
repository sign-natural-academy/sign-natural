export function ExperientialWorkshops() {
    return (
      <section className="bg-[#fdf9f9] py-16 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-green-900 mb-4">
            Experiential Workshops
          </h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto mb-10 sm:mb-12">
            Turn skincare education into memorable experiences with our specialized workshop options.
          </p>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1: Birthday */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col  overflow-hidden min-w-3xs">
              <div className="relative h-44 sm:h-48 bg-gradient-to-t from-[#a58d82] to-[#d3c1b6]">
                <div className="absolute top-4 left-4 bg-[#f8e6b8] rounded-full p-2">
                  🎁
                </div>
                <img src="/images/birthday.jpg" alt="Birthday & Celebration" className="w-full h-full object-cover opacity-0" />
              </div>
              <div className="p-5 text-left flex-1 flex flex-col">
                <h3 className="text-lg sm:text-xl font-serif font-semibold text-gray-900 mb-2">
                  Birthday & Celebration Sessions
                </h3>
                <p className="text-sm text-gray-700 mb-4 flex-1">
                  Create personalized skincare products with custom labels as memorable party activities.
                </p>
                <button className="mt-4 w-full border border-gray-700 text-gray-900 py-2 rounded-md hover:bg-gray-100 transition">
                  Book This Experience
                </button>
              </div>
            </div>
  
            {/* Card 2: Diasporan */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col overflow-hidden min-w-3xs">
              <div className="relative h-44 sm:h-48 bg-gradient-to-t from-[#a58d82] to-[#d3c1b6]">
                <div className="absolute top-4 left-4 bg-[#f8e6b8] rounded-full p-2">
                  ✈️
                </div>
                <img src="/images/diaspora.jpg" alt="Diasporan Packages" className="w-full h-full object-cover opacity-0" />
              </div>
              <div className="p-5 text-left flex-1 flex flex-col">
                <h3 className="text-lg sm:text-xl font-serif font-semibold text-gray-900 mb-2">
                  Diasporan Packages
                </h3>
                <p className="text-sm text-gray-700 mb-4 flex-1">
                  Take a piece of Ghana home by creating authentic skincare products using traditional ingredients.
                </p>
                <button className="mt-4 w-full border border-gray-700 text-gray-900 py-2 rounded-md hover:bg-gray-100 transition">
                  Book This Experience
                </button>
              </div>
            </div>
  
            {/* Card 3: Group Events */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col overflow-hidden min-w-3xs">
              <div className="relative h-44 sm:h-48">
                <div className="absolute top-4 left-4 bg-[#f8e6b8] rounded-full p-2">
                  👥
                </div>
                <img
                  src="/images/group-events.jpg"
                  alt="Group Events"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 text-left flex-1 flex flex-col">
                <h3 className="text-lg sm:text-xl font-serif font-semibold text-gray-900 mb-2">
                  Group Events
                </h3>
                <p className="text-sm text-gray-700 mb-4 flex-1">
                  Corporate wellness, bridal showers, women's groups and team-building through collaborative creation.
                </p>
                <button className="mt-4 w-full border border-gray-700 text-gray-900 py-2 rounded-md hover:bg-gray-100 transition">
                  Book This Experience
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  