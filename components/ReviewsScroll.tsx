'use client'

import { useEffect, useRef } from 'react'

export default function ReviewsScroll() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={wrapRef}
      className="reviews-inner container"
      style={{ opacity: 0, transform: 'translateY(50px)', transition: 'opacity 0.8s ease-out, transform 0.8s ease-out' }}
    >
      <div className="reviews-header">
        <span className="section-label" style={{ marginBottom: '0.75rem' }}>Guest Reviews</span>
        <h2 className="section-title">What Our Guests Say</h2>
        <div className="section-divider"></div>
        <div className="reviews-stars">
          <div className="star-row">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="22" height="22" viewBox="0 0 24 24" fill="#D4A853" stroke="#D4A853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <span className="reviews-rating">4.8</span>
          <span className="reviews-count">/ 5 · 200+ Reviews</span>
        </div>
        <p className="reviews-desc">Real reviews from guests who have experienced Nanku.</p>
      </div>

      <div className="tst-columns-wrap" role="region" aria-label="Guest testimonials">
        {/* Column 1 */}
        <div className="tst-column tst-col-1">
          <div className="tst-column-inner">
            {[0, 1].map((setIdx) => (
              <div className="tst-set" key={setIdx}>
                <ReviewCard
                  text="Great meal, ambiance, and service. The tuna tartare was tasty, steak presentation was fun and cooked to my liking. Passion fruit jalapeño margarita was excellent. Really enjoyable dinner and drinks with a large group."
                  source="Google Reviews"
                  initials="JH"
                  name="Julia H."
                  ratings="Food 5/5 · Service 5/5 · Atmosphere 4/5"
                  avatarColor="#D97706"
                />
                <ReviewCard
                  text="10/10 we loved this restaurant, best one in La Fortuna! Guatavo was great and recommended cool places to check out during our stay. Coconut shrimp special was amazing, and so was the Mahi mahi!"
                  source="Google Reviews"
                  initials="AM"
                  name="AMG"
                  avatarColor="#059669"
                />
                <ReviewCard
                  text="Nice meal at Nanku. Our guide suggested it and it was a good recommendation. I had the chicken which was well cooked and tasty. The al dente veg was particularly good."
                  source="Google · Local Guide"
                  initials="JL"
                  name="Jenny L."
                  avatarColor="#2563EB"
                />
                <ReviewCard
                  text="Great food and vibes in the heart of La Fortuna! The service was quick and the food had great portions. The drinks were very fresh and used lots of real fruit. The nachos and coconut shrimp special was very good."
                  source="Google · Local Guide"
                  initials="AB"
                  name="Annie B."
                  ratings="Food 5/5 · Service 5/5 · Atmosphere 5/5"
                  avatarColor="#7C3AED"
                />
                <ReviewCard
                  text="All in all I love this spot. We had a great experience. If you order a steak, get your phones ready to take pictures or videos. The service was great as soon as we walked up. The whole atmosphere was on point. The live music was great."
                  source="Google · Local Guide"
                  initials="RC"
                  name="Roberta C."
                  ratings="Food 5/5 · Service 5/5 · Atmosphere 5/5"
                  avatarColor="#DC2626"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 */}
        <div className="tst-column tst-col-2">
          <div className="tst-column-inner">
            {[0, 1].map((setIdx) => (
              <div className="tst-set" key={setIdx}>
                <ReviewCard
                  text="I'm still thinking about the Trout! This restaurant was a last resort 15 minutes before closing. My friend stumbled across Nanku and it was the best place I ate at in La Fortuna. The staff were amazing and the food was SO DAMN GOOD! They even sung happy birthday to me!"
                  source="Google · Local Guide"
                  initials="NW"
                  name="Nydia W."
                  avatarColor="#0D9488"
                />
                <ReviewCard
                  text="Lovely comida típica — a cut above the typical típica. My son had pasta with shrimp, which was also good. The lunch servers were attentive and good humored. Best of all was the quinoa salad as an appetizer."
                  source="Google · Local Guide"
                  initials="KE"
                  name="Ken E."
                  ratings="Food 4/5 · Service 5/5 · Atmosphere 5/5"
                  avatarColor="#4F46E5"
                />
                <ReviewCard
                  text="We had a wonderful meal at Nanku Restaurant — the flavors were vibrant, fresh, and beautifully presented. Every dish felt thoughtfully prepared. The atmosphere was warm and inviting, making it a great place to unwind and enjoy a good meal."
                  source="Google · Local Guide"
                  initials="TK"
                  name="Taylor K."
                  ratings="Food 5/5 · Service 4/5 · Atmosphere 5/5"
                  avatarColor="#EA580C"
                />
                <ReviewCard
                  text="First of all, thumbs up for the staff. They delivered an excellent service. And, although it was busy, they were still attentive! Food was good, atmosphere was great. I had the burger and my wife had the Salmon & shrimp suggestion. Prices are correct."
                  source="Google · Local Guide"
                  initials="SV"
                  name="Sam V."
                  ratings="Food 4/5 · Service 5/5 · Atmosphere 5/5"
                  avatarColor="#0891B2"
                />
                <ReviewCard
                  text="Incredible live open mic music on Sunday evening starting around 7:00 p.m. and a really fun service worker who gets everyone enjoying the music. Food is good too."
                  source="Google Reviews"
                  initials="BD"
                  name="Brenda D."
                  avatarColor="#DB2777"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Column 3 */}
        <div className="tst-column tst-col-3">
          <div className="tst-column-inner">
            {[0, 1].map((setIdx) => (
              <div className="tst-set" key={setIdx}>
                <ReviewCard
                  text="We went here twice during our stay in La Fortuna. Jason the waiter was fantastic and so personable. He even allowed us to adapt the menu items. The food was top notch. Way better than expected. Totally recommend for a real Costa Rican food experience."
                  source="Google · Local Guide"
                  initials="BB"
                  name="Brad B."
                  ratings="Food 5/5 · Service 5/5 · Atmosphere 4/5"
                  avatarColor="#CA8A04"
                />
                <ReviewCard
                  text="We've eaten at several locations in La Fortuna during our stay, but Nanku far exceeds the others! Our waiter Manuel was friendly, respectful, spending a good deal of time conversing with us. We just wish we had more time here now! Nanku will be our regular eatery when we come back. Pura Vida!"
                  source="Google Reviews"
                  initials="DR"
                  name="Dick R."
                  ratings="Food 5/5 · Service 5/5 · Atmosphere 5/5"
                  avatarColor="#16A34A"
                />
                <ReviewCard
                  text="One of the best meals we've had in La Fortuna! Make reservations — it fills up fast. Get the steak! The servers were fantastic. Don't visit La Fortuna without eating at Nanku!"
                  source="Google · Local Guide"
                  initials="ME"
                  name="Michael E."
                  ratings="Food 5/5 · Service 5/5 · Atmosphere 5/5"
                  avatarColor="#1D4ED8"
                />
                <ReviewCard
                  text="This place was a lot of fun, and the food was excellent. Highly recommend the passion fruit ceviche appetizer, the grilled octopus entrée, and the churrasco entrée. The waitstaff was very friendly and attentive, regularly checking in to see if we needed refills."
                  source="Google · Local Guide"
                  initials="KU"
                  name="Kyle U."
                  avatarColor="#9333EA"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="reviews-cta">
        <a
          href="https://www.tripadvisor.es/Restaurant_Review-g309226-d7273982-Reviews-Restaurante_Nanku-La_Fortuna_de_San_Carlos_Arenal_Volcano_National_Park_Province_.html"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline-gold"
        >
          Leave a Review
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    </div>
  )
}

function ReviewCard({
  text,
  source,
  initials,
  name,
  ratings,
  avatarColor,
}: {
  text: string
  source: string
  initials: string
  name: string
  ratings?: string
  avatarColor: string
}) {
  return (
    <div className="tst-card">
      <div className="tst-stars">★★★★★</div>
      <p className="tst-text">&ldquo;{text}&rdquo;</p>
      <span className="tst-source">
        <span className="tst-g">G</span> {source}
      </span>
      <div className="tst-author">
        <div className="tst-avatar" style={{ background: avatarColor }}>
          {initials}
        </div>
        <div>
          <div className="tst-name">{name}</div>
          {ratings && <div className="tst-ratings">{ratings}</div>}
        </div>
      </div>
    </div>
  )
}
