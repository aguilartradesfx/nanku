'use client'

import { useState } from 'react'
import Image from 'next/image'

type Panel = 'food' | 'drinks'
type FoodCat = 'appetizers' | 'seafood' | 'pasta' | 'white-meat' | 'steaks' | 'vegetarian' | 'costa-rica' | 'desserts'
type DrinksCat = 'licores' | 'bebidas' | 'cervezas' | 'tiki' | 'cocteles'

const foodCats: { id: FoodCat; label: string }[] = [
  { id: 'appetizers', label: 'Appetizers' },
  { id: 'seafood', label: 'Sea Food' },
  { id: 'pasta', label: 'Pasta' },
  { id: 'white-meat', label: 'White Meat' },
  { id: 'steaks', label: 'Steaks' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'costa-rica', label: 'Costa Rica' },
  { id: 'desserts', label: 'Desserts' },
]

const drinksCats: { id: DrinksCat; label: string }[] = [
  { id: 'licores', label: 'Licores' },
  { id: 'bebidas', label: 'Soft Drinks' },
  { id: 'cervezas', label: 'Beer' },
  { id: 'tiki', label: 'Tiki Cocktails' },
  { id: 'cocteles', label: 'Cocktails' },
]

function MenuCard({ name, price, desc, badge }: { name: string; price: string; desc: string; badge?: { text: string; type: string } }) {
  return (
    <div className="nm-card">
      <div className="nm-card-top">
        <h3 className="nm-card-name">
          {name}
          {badge && <span className={`nm-badge nm-badge-${badge.type}`}>{badge.text}</span>}
        </h3>
        <span className="nm-card-price">{price}</span>
      </div>
      <p className="nm-card-desc">{desc}</p>
    </div>
  )
}

function PriceRow({ name, price }: { name: string; price: string }) {
  return (
    <div className="nm-price-row">
      <span className="nm-price-name">{name}</span>
      <span className="nm-price-dots"></span>
      <span className="nm-price-val">{price}</span>
    </div>
  )
}

function DPriceRow({ name, price }: { name: string; price: string }) {
  return (
    <div className="nm-dprice-row">
      <span className="nm-dprice-name">{name}</span>
      <span className="nm-dprice-dots"></span>
      <span className="nm-dprice-val">{price}</span>
    </div>
  )
}

function SectionBanner({ src, title }: { src: string; title: string }) {
  return (
    <div className="nm-banner">
      <Image src={src} alt={title} fill style={{ objectFit: 'cover' }} loading="lazy" />
      <div className="nm-banner-overlay">
        <h2 className="nm-banner-title">{title}</h2>
      </div>
    </div>
  )
}

function DrinksHeader({ title }: { title: string }) {
  return (
    <div className="nm-drinks-header">
      <span className="nm-drinks-ornament">✦ &nbsp; ✦ &nbsp; ✦</span>
      <h2 className="nm-drinks-title">{title}</h2>
      <div className="nm-drinks-divider">
        <span className="nm-ddiv-line"></span>
        <span className="nm-ddiv-gem">◆</span>
        <span className="nm-ddiv-line"></span>
      </div>
    </div>
  )
}

function DSub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="nm-dsub">
      <div className="nm-dsub-title">{title}</div>
      <div className="nm-dprice-grid">{children}</div>
    </div>
  )
}

export default function MenuClient() {
  const [panel, setPanel] = useState<Panel>('food')
  const [foodCat, setFoodCat] = useState<FoodCat>('appetizers')
  const [drinksCat, setDrinksCat] = useState<DrinksCat>('licores')

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Sticky Nav */}
      <div className="nm-sticky-nav">
        <div className="nm-main-row">
          <button
            className={`nm-main-btn${panel === 'food' ? ' active' : ''}`}
            onClick={() => setPanel('food')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2M18 2c0 0 3 0 3 6s-3 6-3 6" />
            </svg>
            Food Menu
          </button>
          <button
            className={`nm-main-btn${panel === 'drinks' ? ' active' : ''}`}
            onClick={() => setPanel('drinks')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 22h8M12 11v11M20 7H4l2 9h12z" /><path d="M4 7c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4" />
            </svg>
            Drinks Menu
          </button>
        </div>
        <div className="nm-cats-row">
          {panel === 'food' && (
            <div className="nm-cats-inner">
              {foodCats.map((c) => (
                <button
                  key={c.id}
                  className={`nm-cat-btn${foodCat === c.id ? ' active' : ''}`}
                  onClick={() => { setFoodCat(c.id); scrollToSection(c.id) }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
          {panel === 'drinks' && (
            <div className="nm-cats-inner">
              {drinksCats.map((c) => (
                <button
                  key={c.id}
                  className={`nm-cat-btn${drinksCat === c.id ? ' active' : ''}`}
                  onClick={() => { setDrinksCat(c.id); scrollToSection(c.id) }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FOOD PANEL */}
      {panel === 'food' && (
        <>
          <div className="nm-notes">
            <div className="nm-notes-inner">
              <span>Farm-to-table</span>
              <span>Locally sourced</span>
              <span>Prices include taxes</span>
              <span>Notify us of any allergies</span>
            </div>
          </div>
          <div className="nm-food-sections">

            <section className="nm-food-section" id="appetizers">
              <SectionBanner src="https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba21d29ab5e21035712b06.jpg" title="Appetizers" />
              <div className="nm-grid">
                <MenuCard name="Teriyaki Salad" price="₡9,700" desc="Green salad served with fresh yellow-fin tuna encrusted with sesame seeds and teriyaki sauce." />
                <MenuCard name="Quinoa Salad" price="₡6,500" desc="Mixed salad bowl and quinoa served with balsamic dressing." badge={{ text: 'Vegan', type: 'vegan' }} />
                <MenuCard name="Tuna Tartar" price="₡9,900" desc="Tuna marinated with soy sauce, sesame, lemon, cucumber, red onions, served with crostini." />
                <MenuCard name="Stuffed Avocado" price="₡8,350" desc="Stuffed avocado with shrimp in pomodoro sauce on a bed of lettuce." />
                <MenuCard name="Octopus Ceviche" price="₡10,500" desc="Octopus marinated with citrus soy sauce served with smashed plantains." />
                <MenuCard name="Fish Ceviche" price="₡6,900" desc="Traditional Costa Rican ceviche served with mixed chips." />
                <MenuCard name="Passion Fruit Tuna Ceviche" price="₡8,500" desc="Tuna marinated with passion fruit, soy and pepper oil served with mixed chips." />
              </div>
            </section>

            <section className="nm-food-section" id="seafood">
              <SectionBanner src="https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba21d661cba538a2a13a41.jpg" title="Sea Food" />
              <div className="nm-grid">
                <MenuCard name="Teriyaki Tuna" price="₡14,200" desc="Encrusted yellow-fin tuna with sesame seeds, served with vegetables, mashed potatoes, and teriyaki sauce." />
                <MenuCard name="Grilled Octopus" price="₡19,000" desc="Grilled octopus with sweet potato, salad, tomato chimichurri, and citrus concasse soy sauce." />
                <MenuCard name="Caribbean Soup" price="₡8,000" desc="Mixed seafood in tomato sauce with coconut milk, thyme, and chili pepper." />
                <MenuCard name="Whole Tilapia" price="₡10,500" desc="Fried local tilapia with green salad, smashed plantains, refried beans and pico de gallo." />
                <MenuCard name="Trout With Creamy" price="₡12,400" desc="Costa Rican trout in creamy sauce and shrimp served with artichoke rice and cherry tomato." />
                <MenuCard name="Mahi Mahi With Apple & Mango Chutney" price="₡12,400" desc="Grilled mahi mahi served with rosemary potatoes, apple, mango, soy sauce, and Dijon mustard." />
              </div>
            </section>

            <section className="nm-food-section" id="pasta">
              <SectionBanner src="https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba21db9ab5e22eda712c59.jpg" title="Pasta" />
              <div className="nm-grid">
                <MenuCard name="Salmon Ravioli" price="₡10,200" desc="Salmon ravioli served with grana padana, Gorgonzola sauce, cherry tomatoes, mushrooms, basil and crostini." />
                <MenuCard name="Spaghetti Pura Vida" price="₡9,500" desc="Sautéed shrimp spaghetti with onion, basil, tomato sauce, served with avocado and crostini." />
                <MenuCard name="Fettuccine Aglio E Olio" price="₡9,350" desc="Fettuccine with olive oil, cherry tomatoes, basil, mushrooms, and chicken." />
                <MenuCard name="Rigatoni In Aurora Sauce" price="₡9,500" desc="Rigatoni pasta in aurora sauce (tomato and white sauce), with shrimps, parsley, onion, Parmesan cheese, crostinis." />
              </div>
            </section>

            <section className="nm-food-section" id="white-meat">
              <SectionBanner src="https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba21e9ad0276ce1964ea9e.jpg" title="White Meat" />
              <div className="nm-grid">
                <MenuCard name="Cahuita Chicken" price="₡9,100" desc="Grilled chicken with cahuita sauce (coconut milk, thyme, and chili pepper) served with vegetables and mashed potatoes." />
                <MenuCard name="Nanku Chicken" price="₡9,100" desc="Grilled chicken filet, served with mashed sweet potatoes, mini zucchini, mushroom, tomato cherry with hibiscus sauce." />
                <MenuCard name="Pork Chop With Tamarindo" price="₡14,100" desc="Pork chop served with stuffed cassava, grilled vegetables and tamarindo sauce." />
                <MenuCard name="BBQ Pork Ribs" price="₡12,000" desc="Pork ribs with BBQ sauce with pineapple, served with house salad, smashed plantains, refried beans and pico de gallo." />
              </div>
            </section>

            <section className="nm-food-section" id="steaks">
              <SectionBanner src="https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba21eead02761cdd64eb23.jpg" title="Steaks" />
              <div className="nm-steak-grid">
                <PriceRow name="Steak Strips" price="₡14,000" />
                <PriceRow name="Churrasco" price="₡15,600" />
                <PriceRow name="Rib Eye" price="₡17,500" />
                <PriceRow name="New York" price="₡17,500" />
                <PriceRow name="Sirloin Steak" price="₡19,500" />
                <PriceRow name="Surf And Turf Tenderloin Fajitas" price="₡24,000" />
              </div>
              <p className="nm-steak-note">All of our meat cuts are served with rosemary potatoes, sweet plantain, jalapeño, and chimichurri.</p>
            </section>

            <section className="nm-food-section" id="vegetarian">
              <SectionBanner src="https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba221edac584673cb76ed5.jpg" title="Vegetarian" />
              <div className="nm-grid">
                <MenuCard name="Mushroom Bruschetta" price="₡6,000" desc="Fresh mushrooms and cherry tomatoes sautéed with olive oil, onion, Parmesan cheese, garlic, and tomato sauce." />
                <MenuCard name="Stuffed Portobello Mushroom" price="₡8,500" desc="Stuffed portobello mushrooms with basil and onions, topped with melted mozzarella cheese and served with crostini." />
                <MenuCard name="Mushroom Ceviche" price="₡5,500" desc="Mushroom ceviche with yellow pepper, cilantro, red onion and lime juice, served with mixed chips." />
                <MenuCard name="Parmesan Eggplant" price="₡8,500" desc="Encrusted eggplant with Parmesan cheese served with tomato sauce, capers, olives, and house salad." />
                <MenuCard name="Vegan Hamburger" price="₡7,000" desc="Vegan hamburger with grilled vegetables, portobello mushroom, vegan cheese, served with potato wedges." badge={{ text: 'Vegan', type: 'vegan' }} />
              </div>
            </section>

            <section className="nm-food-section" id="costa-rica">
              <SectionBanner src="https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba22259ab5e2490f7138fa.jpg" title="Costa Rica" />
              <div className="nm-grid">
                <MenuCard name="Typical Casado" price="₡7,800" desc="Typical casado served with rice, beans, picadillo, fried eggs, tortilla, cheese, salad and sweet plantain. Choice of beef, chicken or tilapia." badge={{ text: 'Vegan opt.', type: 'vegan-opt' }} />
                <MenuCard name="Rice With Chicken" price="₡7,300" desc="Sautéed chicken rice and vegetables, served with salad and french fries." />
                <MenuCard name="Chicharrones" price="₡9,100" desc="Fried pork pieces served with salad, smashed plantains, pico de gallo, refried beans and fried cassava." />
                <MenuCard name="Rice And Beans With Chicken" price="₡9,100" desc="Caribbean style chicken cooked with coconut milk, chili pepper and thyme, accompanied by sweet plantain and salad." />
                <MenuCard name="Arenal Hamburger" price="₡8,500" desc="180g Angus beef, bacon, caramelized onions, mozzarella cheese, lettuce, pickles, tomato, served with french fries." />
                <MenuCard name="Nanku Nachos" price="₡6,500" desc="Choice of beef, chicken or vegetarian. Tortilla chips, refried beans, pico de gallo, sour cream, mozzarella cheese and sliced avocado." badge={{ text: 'Vegan opt.', type: 'vegan-opt' }} />
                <MenuCard name="Nanku Sandwich" price="₡6,500" desc="Chicken, beef, or vegetarian with fresh lettuce, tomato, bacon, pickles, mozzarella cheese, served with french fries." />
              </div>
            </section>

            <section className="nm-food-section" id="desserts">
              <SectionBanner src="https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba222cdac58405aab77052.jpg" title="Desserts" />
              <div className="nm-dessert-grid">
                {[
                  { name: 'Coconut Caramel Flan', price: '₡4,700' },
                  { name: 'Chocolate Brownie With Vanilla Ice Cream', price: '₡4,700' },
                  { name: 'Passion Fruit Cheesecake', price: '₡4,700' },
                  { name: 'Banana or Pineapple in Orange & Cinnamon Sauce Flamed in Orange Liquor', price: '₡4,700' },
                ].map((d) => (
                  <div key={d.name} className="nm-dessert-item">
                    <span className="nm-dessert-name">{d.name}</span>
                    <span className="nm-dessert-price">{d.price}</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="nm-food-notes">
              <div className="nm-food-note"><span className="nm-fn-icon">✦</span><span>Our restaurant prepares locally sourced produce, seafood, and meat cuts from nearby farmland, delivering you delicious and healthy farm-to-table meals.</span></div>
              <div className="nm-food-note"><span className="nm-fn-icon">✦</span><span>Taxes included.</span></div>
              <div className="nm-food-note"><span className="nm-fn-icon">✦</span><span>If you have a food allergy or special dietary requirements, please inform a member of staff or ask for more information.</span></div>
            </div>
          </div>
        </>
      )}

      {/* DRINKS PANEL */}
      {panel === 'drinks' && (
        <div className="nm-drinks-sections">
          <section className="nm-drinks-section" id="licores">
            <DrinksHeader title="Licores" />
            <DSub title="Whiskey">
              <DPriceRow name="Macallan 12 años" price="₡10,500" />
              <DPriceRow name="Glen Fiddich 12 años" price="₡5,500" />
              <DPriceRow name="Old Parr 12 años" price="₡4,000" />
              <DPriceRow name="Old Parr 18 años" price="₡7,200" />
              <DPriceRow name="Buchanan's 12 años" price="₡4,000" />
              <DPriceRow name="Buchanan's 18 años" price="₡7,200" />
              <DPriceRow name="Crown Royal" price="₡4,000" />
              <DPriceRow name="Maker's Mark" price="₡4,000" />
              <DPriceRow name="Jameson" price="₡4,000" />
              <DPriceRow name="Jack Daniel's" price="₡4,000" />
              <DPriceRow name="Jim Beam" price="₡4,000" />
              <DPriceRow name="Chivas Regal 12 años" price="₡4,000" />
              <DPriceRow name="Chivas Regal 18 años" price="₡7,200" />
            </DSub>
            <DSub title="Tequilas">
              <DPriceRow name="Patrón Reposado" price="₡5,500" />
              <DPriceRow name="Patrón Añejo" price="₡6,500" />
              <DPriceRow name="Patrón Silver" price="₡5,500" />
              <DPriceRow name="Don Julio 70" price="₡9,000" />
              <DPriceRow name="Don Julio Reposado" price="₡5,500" />
              <DPriceRow name="Don Julio Añejo" price="₡7,000" />
              <DPriceRow name="1800 Silver" price="₡4,000" />
              <DPriceRow name="1800 Reposado" price="₡4,000" />
              <DPriceRow name="1800 Añejo" price="₡5,300" />
              <DPriceRow name="Montes Lobos" price="₡5,500" />
            </DSub>
            <DSub title="Ginebras / Gin">
              <DPriceRow name="Bombay" price="₡4,400" />
              <DPriceRow name="Hendrick's" price="₡4,400" />
              <DPriceRow name="Tanqueray" price="₡3,500" />
              <DPriceRow name="Beefeater" price="₡3,500" />
              <DPriceRow name="Martin Miller's" price="₡4,400" />
              <DPriceRow name="Tanqueray Ten" price="₡4,400" />
              <DPriceRow name="Bulldog" price="₡4,400" />
            </DSub>
            <DSub title="Vodka">
              <DPriceRow name="Absolut" price="₡3,500" />
              <DPriceRow name="Stolichnaya" price="₡3,000" />
              <DPriceRow name="Grey Goose" price="₡4,500" />
              <DPriceRow name="Tito's" price="₡3,500" />
              <DPriceRow name="Ketel One" price="₡4,000" />
              <DPriceRow name="Cîroc" price="₡4,500" />
            </DSub>
            <DSub title="Rones / Rum">
              <DPriceRow name="Capitán Morgan" price="₡2,500" />
              <DPriceRow name="Centenario 7 años" price="₡3,500" />
              <DPriceRow name="Flor de Caña 7 años" price="₡3,000" />
              <DPriceRow name="Flor de Caña 12 años" price="₡4,300" />
              <DPriceRow name="Flor de Caña 18 años" price="₡5,000" />
              <DPriceRow name="Centenario 20 años" price="₡5,500" />
              <DPriceRow name="Zacapa 23 años" price="₡5,900" />
              <DPriceRow name="Cachaça" price="₡2,500" />
              <DPriceRow name="Cacique" price="₡2,000" />
              <DPriceRow name="Appleton Estate" price="₡4,000" />
            </DSub>
            <DSub title="Aperitivo & Digestivo">
              <DPriceRow name="Jägermeister" price="₡2,500" />
              <DPriceRow name="Licor 43" price="₡2,500" />
              <DPriceRow name="Cointreau" price="₡4,100" />
              <DPriceRow name="Grand Marnier" price="₡4,500" />
              <DPriceRow name="Café Rica" price="₡3,500" />
              <DPriceRow name="Disaronno" price="₡3,500" />
              <DPriceRow name="Frangelico" price="₡3,500" />
              <DPriceRow name="Baileys" price="₡3,500" />
              <DPriceRow name="Midori" price="₡3,000" />
              <DPriceRow name="Fireball" price="₡3,500" />
            </DSub>
            <DSub title="Coñac / Cognac">
              <DPriceRow name="Courvoisier VS" price="₡5,000" />
              <DPriceRow name="Courvoisier VSOP" price="₡7,000" />
              <DPriceRow name="Hennessy VSOP" price="₡10,000" />
            </DSub>
          </section>

          <section className="nm-drinks-section" id="bebidas">
            <DrinksHeader title="Gaseosas & Aguas" />
            <DSub title="Agua / Water">
              <DPriceRow name="Large Sparkling Water" price="₡3,500" />
              <DPriceRow name="Small Sparkling Water" price="₡2,200" />
              <DPriceRow name="Large Water" price="₡3,500" />
              <DPriceRow name="Small Water" price="₡1,500" />
            </DSub>
            <DSub title="Gaseosas / Soft Drinks">
              <DPriceRow name="Coca Cola / Coke" price="₡1,800" />
              <DPriceRow name="Coca Cola Cero / Coke Zero" price="₡1,800" />
              <DPriceRow name="Ginger Ale" price="₡1,800" />
              <DPriceRow name="Fresco" price="₡1,800" />
              <DPriceRow name="Fanta Naranja / Orange Fanta" price="₡1,800" />
              <DPriceRow name="Sprite" price="₡1,800" />
            </DSub>
            <div className="nm-dsub">
              <div className="nm-dsub-title">Batidos de Frutas / Fruit Smoothies</div>
              <p className="nm-batidos-note">Flavors: Mango · Blackberry · Strawberry · Banana · Soursop · Passion Fruit · Pineapple</p>
              <div className="nm-dprice-grid">
                <DPriceRow name="1 Fruta / 1 Fruit" price="₡1,500" />
                <DPriceRow name="2 Frutas / 2 Fruits" price="₡2,000" />
                <DPriceRow name="Mixto / Mixed" price="₡2,500" />
              </div>
            </div>
            <DSub title="Limonadas / Lemonade">
              <DPriceRow name="Lemonade" price="₡1,500" />
              <DPriceRow name="Lemonade with Mint" price="₡2,000" />
              <DPriceRow name="Ginger Lemonade" price="₡2,000" />
            </DSub>
          </section>

          <section className="nm-drinks-section" id="cervezas">
            <DrinksHeader title="Cervezas" />
            <DSub title="Local Craft on Draft">
              <DPriceRow name="Pinta / Pint (500ml)" price="₡4,000" />
              <DPriceRow name="Media / Half Pint (250ml)" price="₡2,500" />
            </DSub>
            <DSub title="Cervezas Nacionales / National Beer">
              <DPriceRow name="Imperial" price="₡2,500" />
              <DPriceRow name="Pilsen" price="₡2,500" />
              <DPriceRow name="Bavaria" price="₡2,500" />
            </DSub>
            <DSub title="Cervezas Importadas / Imported Beer">
              <DPriceRow name="Corona" price="₡3,000" />
              <DPriceRow name="Heineken" price="₡3,000" />
              <DPriceRow name="Stella Artois" price="₡3,000" />
            </DSub>
          </section>

          <section className="nm-drinks-section" id="tiki">
            <DrinksHeader title="Tiki Cocktails" />
            <div className="nm-cktl-grid">
              {[
                { name: 'Arenal Volcano Punch', price: '₡5,000', desc: 'Dark rum, passion fruit, mango, lime, grenadine.' },
                { name: 'Jungle Bird', price: '₡5,000', desc: 'Campari, dark rum, pineapple juice, lime, simple syrup.' },
                { name: 'Blue Lagoon Tiki', price: '₡5,000', desc: 'Coconut rum, blue curaçao, pineapple, lime.' },
                { name: 'Nanku Sunset', price: '₡5,500', desc: 'Our signature blend of tropical spirits, fresh citrus and exotic fruit.' },
                { name: 'Volcanic Night', price: '₡5,500', desc: 'Dark rum, spiced rum, blackberry, fresh lime, ginger beer.' },
                { name: 'Jungle Elixir', price: '₡5,500', desc: 'Mezcal, cucumber, basil, jalapeño, lime, agave nectar.' },
              ].map((c) => (
                <div key={c.name} className="nm-cktl-card">
                  <div className="nm-cktl-top">
                    <h3 className="nm-cktl-name">{c.name}</h3>
                    <span className="nm-cktl-price">{c.price}</span>
                  </div>
                  <p className="nm-cktl-desc">{c.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="nm-drinks-section" id="cocteles">
            <DrinksHeader title="Cócteles" />
            <div className="nm-cktl-grid">
              {[
                { name: 'Mango Habanero Margarita', price: '₡5,500', desc: 'Tequila, mango, habanero, lime, agave.' },
                { name: 'Maracuyá Mezcalita', price: '₡5,500', desc: 'Mezcal, passion fruit, lime, salt rim.' },
                { name: 'Coconut Lime Classic', price: '₡5,000', desc: 'Tequila blanco, coconut water, lime, mint.' },
                { name: 'Caipirinha', price: '₡4,500', desc: 'Cachaça, fresh lime, sugar. The classic Brazilian cocktail.' },
                { name: 'Mojito', price: '₡4,500', desc: 'White rum, fresh mint, lime, sugar, sparkling water.' },
                { name: 'Piña Colada', price: '₡4,500', desc: 'Coconut rum, pineapple juice, coconut cream.' },
                { name: 'Aperol Spritz', price: '₡4,800', desc: 'Aperol, prosecco, sparkling water, orange slice.' },
                { name: 'Cosmopolitan', price: '₡4,800', desc: 'Vodka, triple sec, cranberry juice, lime.' },
              ].map((c) => (
                <div key={c.name} className="nm-cktl-card">
                  <div className="nm-cktl-top">
                    <h3 className="nm-cktl-name">{c.name}</h3>
                    <span className="nm-cktl-price">{c.price}</span>
                  </div>
                  <p className="nm-cktl-desc">{c.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  )
}
