const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Package = require('../models/Package');
const Destination = require('../models/Destination');
const FAQ = require('../models/FAQ');
const Testimonial = require('../models/Testimonial');
const BlogPost = require('../models/BlogPost');

const seedData = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wandervista';
    console.log(`Seeding database at: ${connStr}`);
    await mongoose.connect(connStr);

    // Clear existing data
    await User.deleteMany();
    await Package.deleteMany();
    await Destination.deleteMany();
    await FAQ.deleteMany();
    await Testimonial.deleteMany();
    await BlogPost.deleteMany();

    console.log('Database cleared. Seeding fresh data...');

    // 1. Seed Users
    const adminUser = await User.create({
      name: 'Dhanish Travel Admin',
      email: 'admin@dhanishtravel.com',
      password: 'adminpassword',
      phone: '+918484859316',
      role: 'admin',
    });

    const standardUser = await User.create({
      name: 'John Doe',
      email: 'user@dhanishtravel.com',
      password: 'userpassword',
      phone: '+919988776655',
      role: 'user',
    });

    console.log('Users seeded!');

    // 2. Seed Packages
    const packageList = [
      {
        title: 'Splendors of Kashmir',
        slug: 'splendors-of-kashmir',
        category: 'Domestic',
        description: 'Experience the paradise on Earth with our premium 6-day Kashmir package. Float on the scenic Dal Lake in a Shikara, walk through the vibrant Mughal Gardens, and witness the snow-capped mountains of Gulmarg.',
        images: [
          'https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1598305372100-877a4a762820?auto=format&fit=crop&w=800&q=80',
        ],
        duration: { days: 6, nights: 5 },
        price: 24999,
        discountPrice: 19999,
        destinationRoute: 'Srinagar - Gulmarg - Pahalgam - Srinagar',
        rating: 4.8,
        reviewCount: 42,
        highlights: [
          'Stay in a luxury Houseboat on Dal Lake',
          'Shikara ride at sunset',
          'Gondola cable car ride in Gulmarg',
          'Explore beautiful Betaab Valley in Pahalgam',
        ],
        inclusions: [
          '5 Nights accommodation on twin sharing basis',
          'Daily Breakfast and Dinner',
          'All transfers and sightseeing by private sedan',
          '1 Shikara Ride on Dal Lake',
          'Toll taxes, driver allowance, and parking fees',
        ],
        exclusions: [
          'Airfare / Train fare',
          'Gondola ride tickets',
          'Lunch and personal expenses',
          'Travel Insurance',
        ],
        itinerary: [
          { day: 1, title: 'Arrival in Srinagar & Houseboat Stay', description: 'Arrive at Srinagar airport. Meet our representative and transfer to the houseboat. In the evening, enjoy a 1-hour Shikara ride on Dal Lake.', overnightAt: 'Srinagar Houseboat' },
          { day: 2, title: 'Srinagar Local Sightseeing', description: 'Visit the famous Mughal Gardens: Nishat Bagh (Garden of Pleasure) and Shalimar Bagh (Abode of Love). Visit the Shankaracharya Temple.', overnightAt: 'Srinagar Hotel' },
          { day: 3, title: 'Excursion to Gulmarg', description: 'Drive to Gulmarg, the "Meadow of Flowers". Enjoy the Gondola cable car ride up to Apharwat peak (Phase 1 & 2). Return to Srinagar.', overnightAt: 'Srinagar Hotel' },
          { day: 4, title: 'Srinagar to Pahalgam', description: 'Drive to Pahalgam, the "Valley of Shepherds". Route scenic stopovers at saffron fields and Avantipura ruins. Relax by the Lidder River.', overnightAt: 'Pahalgam Hotel' },
          { day: 5, title: 'Explore Pahalgam Valley', description: 'Visit Betaab Valley, Aru Valley, and Chandanwari by local union cabs. Enjoy pony rides and return to Srinagar in the evening.', overnightAt: 'Srinagar Hotel' },
          { day: 6, title: 'Departure', description: 'After breakfast, check out from the hotel and transfer to Srinagar Airport for your onward journey.', overnightAt: '' },
        ],
        hotels: ['Kashmir Houseboat Premium', 'Srinagar Grand Palace Resort', 'Pahalgam Lidder Heights'],
        transportation: 'Private Sedan (AC Toyota Etios / DZire)',
        meals: 'MAPAI Plan (Breakfast and Dinner included)',
        badge: 'BEST SELLER',
        isActive: true,
      },
      {
        title: 'Tropical Bali Getaway',
        slug: 'tropical-bali-getaway',
        category: 'International',
        description: 'Immerse yourself in Balinese culture, white sand beaches, and lush terraced rice fields. This 7-day international tour takes you through Ubud, Uluwatu, and Nusa Penida.',
        images: [
          'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1518548419070-58404c00ac0c?auto=format&fit=crop&w=800&q=80',
        ],
        duration: { days: 7, nights: 6 },
        price: 59999,
        discountPrice: 52999,
        destinationRoute: 'Ubud - Seminyak - Nusa Penida',
        rating: 4.9,
        reviewCount: 38,
        highlights: [
          'Private pool villa stay in Seminyak',
          'Bali swing and Tegallalang rice terrace tour',
          'Kelingking Beach day-trip to Nusa Penida',
          'Sunset seafood dinner at Jimbaran Bay',
        ],
        inclusions: [
          '6 Nights accommodation (3N Ubud + 3N Seminyak)',
          'Daily buffet breakfast at hotels',
          'Nusa Penida fast boat transfers',
          'All airport transfers and private guided tours',
          'Jimbaran Bay dinner experience',
        ],
        exclusions: [
          'International Flights',
          'Bali Visa on Arrival (VoA)',
          'Lunch and Dinners not specified',
          'Gratuities and tips',
        ],
        itinerary: [
          { day: 1, title: 'Arrive in Bali & Transfer to Ubud', description: 'Arrive at Ngurah Rai airport. Meet your driver and transfer to Ubud. Check into your hotel and relax.', overnightAt: 'Ubud Resort' },
          { day: 2, title: 'Ubud Swing & Kintamani Volcano Tour', description: 'Experience the famous Bali Swing, hike Tegallalang rice fields, and view the active Mt. Batur volcano in Kintamani.', overnightAt: 'Ubud Resort' },
          { day: 3, title: 'Ubud Waterfalls and Temples', description: 'Visit Tegenungan Waterfall, Tirta Empul Holy Water temple, and Ubud Monkey Forest.', overnightAt: 'Ubud Resort' },
          { day: 4, title: 'Nusa Penida West Coast Island Trip', description: 'Take a fast boat to Nusa Penida. Visit Kelingking Beach, Broken Beach, and Angel Billabong. Return to mainland Bali.', overnightAt: 'Seminyak Hotel' },
          { day: 5, title: 'Uluwatu Temple & Kecak Dance Show', description: 'Relax at Seminyak beaches. In the afternoon, visit the cliffside Uluwatu Temple and watch a traditional Kecak fire dance.', overnightAt: 'Seminyak Hotel' },
          { day: 6, title: 'Leisure Day & Sunset Dinner', description: 'Enjoy shopping or beach club hopping. In the evening, savor a sunset seafood dinner on the beach at Jimbaran Bay.', overnightAt: 'Seminyak Villa (Private Pool)' },
          { day: 7, title: 'Departure', description: 'Enjoy breakfast. Free time until your transfer to Denpasar Airport for departure.', overnightAt: '' },
        ],
        hotels: ['Ubud Green Resort', 'Seminyak Premium Pool Villas'],
        transportation: 'Private AC Coach with English-speaking Guide',
        meals: 'Breakfast Only (CPAI Plan)',
        badge: 'TRENDING',
        isActive: true,
      },
      {
        title: 'Romantic Maldives Honeymoon',
        slug: 'romantic-maldives-honeymoon',
        category: 'Honeymoon',
        description: 'Celebrate your love in a private overwater villa surrounded by turquoise waters. Enjoy romantic beach dinners, couple spa treatments, and snorkeling over vibrant coral reefs.',
        images: [
          'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
        ],
        duration: { days: 5, nights: 4 },
        price: 99999,
        discountPrice: 89999,
        destinationRoute: 'Male Airport - South Male Atoll Resort',
        rating: 5.0,
        reviewCount: 29,
        highlights: [
          'Stay in an Overwater Villa with private lagoon access',
          'Complimentary bottle of wine and fruit platter',
          'Candlelit dinner on a private sandbank',
          'Speedboat transfers included',
        ],
        inclusions: [
          '4 Nights stay in a Premium Overwater Villa',
          'All Meals (Breakfast, Lunch, and Dinner)',
          'Unlimited alcoholic and non-alcoholic beverages (All-Inclusive Plan)',
          'Return speed boat transfers from Male Airport',
          'Complimentary snorkeling gear hire',
        ],
        exclusions: [
          'International Flights',
          'Extra excursions and diving sessions',
          'Spa treatments (available on discount)',
          'Green tax ($6 per night per person)',
        ],
        itinerary: [
          { day: 1, title: 'Speedboat Arrival & Overwater Villa Check-in', description: 'Arrive at Male Airport, board the speed boat to your island resort. Sip a welcome drink and check into your Overwater Villa.', overnightAt: 'Maldives Island Resort' },
          { day: 2, title: 'Water Sports & Beach Relaxation', description: 'Spend the day snorkeling, kayaking, or relaxing on the white sandy beaches.', overnightAt: 'Maldives Island Resort' },
          { day: 3, title: 'Sandbank Candlelight Dinner', description: 'Enjoy resort activities. In the evening, surprise your spouse with a private sandbank candlelit dinner experience.', overnightAt: 'Maldives Island Resort' },
          { day: 4, title: 'Couple Spa Therapy & Sunset Cruise', description: 'Rejuvenate with a complimentary Balinese massage. Embark on a romantic sunset cruise with dolphin watching.', overnightAt: 'Maldives Island Resort' },
          { day: 5, title: 'Farewell Maldives', description: 'Enjoy your final island breakfast, then take the return speed boat to Male Airport for flight home.', overnightAt: '' },
        ],
        hotels: ['Adaaran Club Rannalhi Overwater Suites'],
        transportation: 'Luxury Shared Speedboat',
        meals: 'All Inclusive (AI Plan)',
        badge: 'POPULAR',
        isActive: true,
      },
      {
        title: 'Kerala Scenic Backwaters',
        slug: 'kerala-scenic-backwaters',
        category: 'Family',
        description: 'Explore the serene beauty of God\'s Own Country. Climb the tea gardens of Munnar, search for elephants in Thekkady, and cruise the calm Alleppey backwaters on a private houseboat.',
        images: [
          'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
        ],
        duration: { days: 6, nights: 5 },
        price: 21999,
        discountPrice: 17999,
        destinationRoute: 'Kochi - Munnar - Thekkady - Alleppey - Kochi',
        rating: 4.7,
        reviewCount: 31,
        highlights: [
          'Overnight cruise on an Alleppey Houseboat',
          'Tea museum and plantation walk in Munnar',
          'Spice plantation walk in Thekkady',
          'Boating on Periyar Lake',
        ],
        inclusions: [
          '5 Nights accommodation (2N Munnar + 1N Thekkady + 1N Houseboat + 1N Kochi)',
          'All Houseboat meals (Lunch, Tea, Dinner, Breakfast)',
          'Daily buffet breakfast in hotels',
          'AC vehicle for all ground transfers',
          'All entry tickets to parks and spice garden',
        ],
        exclusions: [
          'Flights or train fares to/from Kochi',
          'Optional boating in Periyar Lake',
          'Traditional Ayurvedic Massages',
        ],
        itinerary: [
          { day: 1, title: 'Arrive Kochi & Transfer to Munnar', description: 'Arrive at Cochin Airport/Railway Station. Travel towards Munnar. See Cheeyappara and Valara waterfalls on the way.', overnightAt: 'Munnar Valley Resort' },
          { day: 2, title: 'Munnar Sightseeing Tour', description: 'Visit Mattupetty Dam, Echo Point, Kundala Lake, Eravikulam National Park (to spot Nilgiri Tahr), and the Tea Museum.', overnightAt: 'Munnar Valley Resort' },
          { day: 3, title: 'Munnar to Thekkady', description: 'Travel to Thekkady. Check-in. In the afternoon, enjoy a guided walk through spice plantations (cardamom, pepper, cinnamon).', overnightAt: 'Thekkady Jungle Lodge' },
          { day: 4, title: 'Thekkady to Alleppey Houseboat', description: 'Drive to Alleppey. Board your traditional private AC Houseboat. Cruise through Vembanad Lake and local canals.', overnightAt: 'Alleppey Private Houseboat' },
          { day: 5, title: 'Alleppey to Kochi City Tour', description: 'Check out of houseboat, drive to Kochi. Visit historic Fort Kochi, Chinese Fishing Nets, Mattancherry Palace, and St. Francis Church.', overnightAt: 'Kochi Boutique Hotel' },
          { day: 6, title: 'Departure', description: 'Breakfast. Transfer to Cochin Airport for departure flights.', overnightAt: '' },
        ],
        hotels: ['Munnar Greens', 'Thekkady Wild Haven', 'Alleppey Premium Houseboats', 'Kochi Fort Manor'],
        transportation: 'AC Sedan (Toyota Etios)',
        meals: 'Breakfast at hotels & All Meals in Houseboat',
        badge: 'FAMILY PICK',
        isActive: true,
      },
      {
        title: 'Ladakh Adventure Odyssey',
        slug: 'ladakh-adventure-odyssey',
        category: 'Adventure',
        description: 'Embark on an extreme adventure to the land of high passes. Drive through Khardung La (one of the world\'s highest motorable roads), camp at Pangong Tso lake, and ride double-humped camels in Nubra Valley.',
        images: [
          'https://images.unsplash.com/photo-1581791538302-03537b9c97bf?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
        ],
        duration: { days: 7, nights: 6 },
        price: 29999,
        discountPrice: 26999,
        destinationRoute: 'Leh - Nubra Valley - Pangong Lake - Leh',
        rating: 4.9,
        reviewCount: 45,
        highlights: [
          'Camping near the turquoise Pangong Lake',
          'Crossing the mighty Khardung La pass (17,582 ft)',
          'Bactrian Double-Humped Camel Ride in Nubra Valley',
          'Visit Magnetic Hill and Pathar Sahib Gurudwara',
        ],
        inclusions: [
          '6 Nights accommodation (3N Leh + 2N Nubra + 1N Pangong Lake Camp)',
          'Daily Breakfast and Dinner in all hotels & camps',
          '4x4 Scorpio / SUV for high-pass mountain driving',
          'Inner Line Permits for restricted areas (Nubra/Pangong)',
          'Oxygen Cylinder backup in vehicle',
        ],
        exclusions: [
          'Flights to/from Leh Airport',
          'Personal purchases, camel rides, quad biking fees',
          'Lunch and bottled water',
        ],
        itinerary: [
          { day: 1, title: 'Arrival in Leh & Acclimatization', description: 'Land at Kushok Bakula Rimpochee Airport. Check into your hotel. Complete rest is mandatory on day 1 to acclimatize to high altitude.', overnightAt: 'Leh Mountain Hotel' },
          { day: 2, title: 'Leh Local Sightseeing', description: 'Visit Leh Palace, Shanti Stupa, Hall of Fame, Magnetic Hill, and Sangam (Confluence of Indus & Zanskar rivers).', overnightAt: 'Leh Mountain Hotel' },
          { day: 3, title: 'Leh to Nubra Valley via Khardung La', description: 'Drive over Khardung La Pass. Descend into Nubra Valley. In the evening, visit Hunder Sand Dunes and ride the Bactrian camels.', overnightAt: 'Nubra Valley Desert Camp' },
          { day: 4, title: 'Nubra Valley Tour & Diskit Monastery', description: 'Visit Diskit Monastery with its giant Maitreya Buddha statue. Rest of the day at leisure for village walks.', overnightAt: 'Nubra Valley Deluxe Resort' },
          { day: 5, title: 'Nubra to Pangong Tso Lake', description: 'Drive via Shyok River route to Pangong Lake. Witness the lake changing colors. Experience freezing nights in cozy luxury dome tents.', overnightAt: 'Pangong Lake Luxury Camp' },
          { day: 6, title: 'Pangong to Leh via Chang La Pass', description: 'Witness the morning sunrise by the lake. Drive back to Leh crossing the Chang La pass. Shop at Leh market in the evening.', overnightAt: 'Leh Mountain Hotel' },
          { day: 7, title: 'Departure flight', description: 'Early morning transfer to Leh Airport for departure flights back home.', overnightAt: '' },
        ],
        hotels: ['Leh Grand Dragon Palace', 'Nubra Hunder Camps', 'Pangong Lakeview Tents'],
        transportation: 'Private 4x4 SUV (Toyota Innova or Mahindra Scorpio)',
        meals: 'MAP plan (Breakfast and Dinner)',
        badge: 'POPULAR',
        isActive: true,
      },
    ];

    const seededPackages = await Package.insertMany(packageList);
    console.log('Packages seeded!');

    // 3. Seed Destinations
    const destinationsList = [
      {
        name: 'Kashmir',
        slug: 'kashmir',
        country: 'India',
        state: 'Jammu & Kashmir',
        description: 'Nestled in the Himalayas, Kashmir is known as the "Paradise on Earth". It features beautiful valleys, majestic shikaras on quiet lakes, and beautiful pine forests.',
        images: [
          'https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?auto=format&fit=crop&w=800&q=80',
        ],
        bestTimeToVisit: 'March to October (Summer/Spring) & December to February (Snow)',
        duration: '5 to 9 Days',
        height: '1,585 meters (Srinagar)',
        topAttractions: ['Dal Lake', 'Gulmarg Cable Car', 'Betaab Valley', 'Shalimar Bagh'],
        thingsToDo: ['Shikara riding', 'Snow Skiing', 'River Rafting', 'Houseboat stays'],
        sampleItinerary: [
          { day: 1, activities: ['Arrival, check-in to Srinagar houseboat', 'Evening 1-hour Shikara ride on Dal Lake'] },
          { day: 2, activities: ['Explore Nishat and Shalimar gardens', 'Visit old Shankaracharya Temple'] },
          { day: 3, activities: ['Drive to Gulmarg, ride Gondola cable car', 'Play golf or sledge in snow'] },
        ],
        nearbyAttractions: ['Sonamarg', 'Yusmarg', 'Doodhpathri'],
        travelTips: ['Carry heavy woolens for winter and light jackets for summer', 'Pre-paid mobile networks do not work; get a postpaid SIM'],
        linkedPackages: [seededPackages[0]._id],
      },
      {
        name: 'Bali',
        slug: 'bali',
        country: 'Indonesia',
        state: 'Bali Province',
        description: 'Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs. It holds deeply spiritual Hindu temples and retreats.',
        images: [
          'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        ],
        bestTimeToVisit: 'April to October (Dry Season)',
        duration: '5 to 10 Days',
        height: 'Sea Level to 3,142 meters (Mt. Agung)',
        topAttractions: ['Tegallalang Rice Terrace', 'Uluwatu Temple', 'Kelingking Beach', 'Tirta Empul'],
        thingsToDo: ['Jungle Swings', 'Surfing', 'Scuba Diving', 'Yoga Retreats'],
        sampleItinerary: [
          { day: 1, activities: ['Land in Denpasar, transfer to Ubud jungle resort'] },
          { day: 2, activities: ['Bali Swing experience', 'Kintamani volcano lookout lunch'] },
          { day: 3, activities: ['Fast boat trip to Nusa Penida cliffs', 'Sunset seafood dinner at Jimbaran'] },
        ],
        nearbyAttractions: ['Lombok Island', 'Gili Islands', 'Nusa Lembongan'],
        travelTips: ['Rent a scooter to bypass Ubud traffic', 'Drink bottled water only ("Bali Belly" prevention)'],
        linkedPackages: [seededPackages[1]._id],
      },
      {
        name: 'Maldives',
        slug: 'maldives',
        country: 'Maldives',
        state: 'South Male Atoll',
        description: 'The Maldives is a tropical nation in the Indian Ocean composed of 26 ring-shaped atolls, which are made up of more than 1,000 coral islands. It is famous for its blue lagoons and extensive reefs.',
        images: [
          'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=80',
        ],
        bestTimeToVisit: 'November to April (Sunny and dry)',
        duration: '4 to 7 Days',
        height: '1.5 meters',
        topAttractions: ['Maafushi Island', 'Male City Fish Market', 'Sandbank Islands'],
        thingsToDo: ['Snorkeling with Turtles', 'Deep Sea Scuba Diving', 'Sunset Cruise', 'Water Spa treatments'],
        sampleItinerary: [
          { day: 1, activities: ['Speedboat ride to luxury water villa resort'] },
          { day: 2, activities: ['Snorkel on the house reef', 'Beach cocktail reception'] },
          { day: 3, activities: ['Sunset dolphin cruise', 'Sandbank candlelight dinner'] },
        ],
        nearbyAttractions: ['Ari Atoll', 'Hulhumale Island'],
        travelTips: ['Pack reef-safe sunscreen to protect marine life', 'Check-in rules: respect island cultures and strict custom guidelines'],
        linkedPackages: [seededPackages[2]._id],
      },
    ];

    await Destination.insertMany(destinationsList);
    console.log('Destinations seeded!');

    // 4. Seed FAQs
    const faqsList = [
      {
        topic: 'General Booking',
        question: 'How do I book a tour package with Dhanish Travel Co.?',
        answer: 'You can browse our tour packages from the website, select your favorite package, and click the "Book Now" button. Follow the 5-step wizard to choose your travel dates, input traveler details, select optional add-ons, and complete secure payments. You can also send customized package inquiries from the "Contact Us" or "Customize Tour" page.',
        order: 1,
      },
      {
        topic: 'General Booking',
        question: 'Can I customize a package itinerary?',
        answer: 'Yes! We specialize in customized tours. On the details page of any package or from our services page, you can request custom edits. Our travel agents will coordinate with hotels and transport providers to tailor the itinerary exactly to your choice.',
        order: 2,
      },
      {
        topic: 'Payments & Refunds',
        question: 'What payment modes do you accept?',
        answer: 'We accept Credit Cards, Debit Cards, Netbanking, and UPI transfers through our secure integration with Razorpay. During development and testing, you can choose "Pay Simulation" to confirm bookings without a real transaction.',
        order: 3,
      },
      {
        topic: 'Payments & Refunds',
        question: 'What is your cancellation and refund policy?',
        answer: 'Cancellations made 30 days or more prior to departure receive a 100% refund (minus booking charges). Cancellations between 15-29 days receive a 50% refund, while cancellations less than 15 days prior to departure are non-refundable. Please refer to our full Cancellation policy page for more details.',
        order: 4,
      },
      {
        topic: 'Travel Documents',
        question: 'Do you assist with Visas and Passports?',
        answer: 'Yes, Dhanish Travel Co. provides complete Visa support, Passport application guidance, and foreign exchange (Forex) assistance. You can submit a service query under our Services section.',
        order: 5,
      },
    ];

    await FAQ.insertMany(faqsList);
    console.log('FAQs seeded!');

    // 5. Seed Testimonials
    const testimonialsList = [
      {
        name: 'Rahul Sharma',
        location: 'Delhi, India',
        rating: 5,
        message: 'Our Kashmir honeymoon was perfectly managed by Dhanish Travel Co. The houseboat was beautiful, the food was delicious, and the driver was extremely professional and helpful. Highly recommended!',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
        tourTaken: 'Splendors of Kashmir',
        source: 'website',
        videoUrl: '',
        isApproved: true,
      },
      {
        name: 'Sophia Patel',
        location: 'Mumbai, India',
        rating: 5,
        message: 'The Bali trip was amazing. Kelingking Beach was breathtaking, and the private pool villa in Seminyak was clean and luxurious. Standard booking flow was very smooth!',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
        tourTaken: 'Tropical Bali Getaway',
        source: 'google',
        videoUrl: '',
        isApproved: true,
      },
      {
        name: 'Amit and Ritu Verma',
        location: 'Bangalore, India',
        rating: 5,
        message: 'Highly satisfied with the Kerala family package. Kids loved the Alleppey backwaters houseboat stay. Driver drove very safely on Munnar ghats. Will book again with Dhanish Travel Co!',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
        tourTaken: 'Kerala Scenic Backwaters',
        source: 'website',
        videoUrl: '',
        isApproved: true,
      },
    ];

    await Testimonial.insertMany(testimonialsList);
    console.log('Testimonials seeded!');

    // 6. Seed Blog Posts
    const blogPostsList = [
      {
        title: 'Top 10 Things to Pack for a Ladakh Adventure Tour',
        slug: 'top-10-things-to-pack-for-a-ladakh-adventure-tour',
        category: 'Travel Guide',
        excerpt: 'Heading to the high passes of Ladakh? Packing the right gear is critical to surviving the extreme altitudes and freezing temperatures. Here is your definitive checklist.',
        content: `
          <p>Traveling to Ladakh is a dream for many, but its unique geography requires careful preparation. At altitudes above 10,000 feet, temperatures can drop rapidly, and the sun can be intense. Here are the top 10 items you must pack:</p>
          
          <h3 style="color:#0B2447; margin-top:15px;">1. Thermal Layers</h3>
          <p>Thermal innerwear is a lifesaver. Pack high-quality merino wool or synthetic thermals that trap body heat.</p>
          
          <h3 style="color:#0B2447; margin-top:15px;">2. Hydration Salts & Medications</h3>
          <p>Acute Mountain Sickness (AMS) is common. Keep Diamox (after consulting your doctor) and hydration salts (ORS) handy. Drink plenty of water.</p>
          
          <h3 style="color:#0B2447; margin-top:15px;">3. Heavy Sunscreen and Lip Balm</h3>
          <p>At high altitudes, the UV rays are extremely strong. Use SPF 50+ sunscreen and a UV-protecting lip balm to avoid skin damage.</p>
          
          <h3 style="color:#0B2447; margin-top:15px;">4. Good Quality Polarized Sunglasses</h3>
          <p>Protect your eyes from the bright glare of the sun reflecting off snow and lakes.</p>

          <p>By preparing carefully and checking in with Dhanish Travel Co., you can ensure an unforgettable mountain experience without any altitude hazards!</p>
        `,
        coverImage: 'https://images.unsplash.com/photo-1581791538302-03537b9c97bf?auto=format&fit=crop&w=800&q=80',
        author: 'Dhanish Travel Guide',
        views: 124,
      },
      {
        title: 'Why Bali is the Perfect Destination for Couples in 2026',
        slug: 'why-bali-is-the-perfect-destination-for-couples-in-2026',
        category: 'Honeymoon Tips',
        excerpt: 'From private pool villas to spiritual temples and beach sunsets, discover why Bali continues to be the ultimate romantic getaway.',
        content: `
          <p>Bali has earned its reputation as the Island of the Gods, and it remains the top choice for honeymooners and couples seeking romance. Let us explore the reasons why Bali is the perfect couple retreat:</p>
          
          <h3 style="color:#0B2447; margin-top:15px;">1. Affordable Luxury Villas</h3>
          <p>Unlike other destinations where private pool villas cost a fortune, Bali offers gorgeous, private retreats with personalized service at a fraction of the cost.</p>
          
          <h3 style="color:#0B2447; margin-top:15px;">2. Spiritual Heritage & Serene Settings</h3>
          <p>Ubud\'s lush green rice terraces and quiet water temples offer a peaceful space for couples to disconnect from the world and reconnect with each other.</p>
          
          <h3 style="color:#0B2447; margin-top:15px;">3. Sunset Seafood Dinners</h3>
          <p>Watching the golden sun melt into the Indian Ocean while enjoying fresh lobster and prawns on Jimbaran Beach is a highlight of any couple\'s itinerary.</p>

          <p>Dhanish Travel Co. offers customized Bali Honeymoon packages complete with couple spa credits and private tours.</p>
        `,
        coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        author: 'Admin',
        views: 89,
      },
    ];

    await BlogPost.insertMany(blogPostsList);
    console.log('Blog posts seeded!');

    console.log('Database seeding completed successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedData();
