'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

type Panel = 'food' | 'drinks'
type FoodCat = 'appetizers' | 'seafood' | 'pasta' | 'white-meat' | 'steaks' | 'vegetarian' | 'costa-rica' | 'desserts'
type DrinksCat = 'licores' | 'bebidas' | 'cervezas' | 'tiki' | 'cocteles' | 'vinos'

const CDN = 'https://assets.cdn.filesafe.space/ftiLAicHGn0i3cqS3Rye/media/'

interface FoodItem {
  name: string
  price: string
  desc?: string
  badge?: { text: string; type: string }
  photo?: string
  photoPosition?: string
  variants?: { label: string; price: string }[]
}

interface ModalState {
  name: string
  price: string
  desc?: string
  photo: string
  photoPosition?: string
  suggestions: FoodItem[]
  allSectionItems: FoodItem[]
  variants?: { label: string; price: string }[]
}

// ─── EN DATA ────────────────────────────────────────────────────────────────

const enFood = {
  appetizers: [
    { name: 'Teriyaki Salad', price: '₡9,700', desc: 'Green salad served with fresh yellow-fin tuna encrusted with sesame seeds and teriyaki sauce.', photo: CDN + '69c5f5dc7794bffe444fbf93.jpg' },
    { name: 'Quinoa Salad', price: '₡6,500', desc: 'Mixed salad bowl and quinoa served with balsamic dressing.', badge: { text: 'Vegan', type: 'vegan' }, photo: CDN + '69c5f6dc9619ac798a99f4d1.jpg' },
    { name: 'Tuna Tartar', price: '₡9,900', desc: 'Tuna marinated with soy sauce, sesame, lemon, cucumber, red onions, served with crostini.', photo: CDN + '69c5f866421e24593383c6c8.jpg' },
    { name: 'Stuffed Avocado', price: '₡8,350', desc: 'Stuffed avocado with shrimp in pomodoro sauce on a bed of lettuce.' },
    { name: 'Octopus Ceviche', price: '₡10,500', desc: 'Octopus marinated with citrus soy sauce served with smashed plantains.', photo: CDN + '69c5f674146bc581d6ebd34f.jpg' },
    { name: 'Fish Ceviche', price: '₡6,900', desc: 'Traditional Costa Rican ceviche served with mixed chips.', photo: CDN + '69c5f674146bc59c7debd350.jpg' },
    { name: 'Passion Fruit Tuna Ceviche', price: '₡8,500', desc: 'Tuna marinated with passion fruit, soy and pepper oil served with mixed chips.', photo: CDN + '69c194d5eb06d8b53fe532fc.jpg', photoPosition: '70% center' },
  ] as FoodItem[],
  seafood: [
    { name: 'Teriyaki Tuna', price: '₡14,200', desc: 'Encrusted yellow-fin tuna with sesame seeds, served with vegetables, mashed potatoes, and teriyaki sauce.', photo: CDN + '69d85b05d7871cddf7ea19e0.webp' },
    { name: 'Grilled Octopus', price: '₡19,000', desc: 'Grilled octopus with sweet potato, salad, tomato chimichurri, and citrus concasse soy sauce.', photo: CDN + '69b9175087f0f2768356c731.jpg' },
    { name: 'Caribbean Soup', price: '₡8,000', desc: 'Mixed seafood in tomato sauce with coconut milk, thyme, and chili pepper.', photo: CDN + '69c5f6dc7794bf5d9b4fe34b.jpg' },
    { name: 'Trout With Creamy', price: '₡12,400', desc: 'Costa Rican trout in creamy sauce and shrimp served with artichoke rice and cherry tomato.', photo: CDN + '69c5f8665ebd49a0c4779e7f.jpg' },
    { name: 'Mahi Mahi With Apple & Mango Chutney', price: '₡12,400', desc: 'Grilled mahi mahi served with rosemary potatoes, apple, mango, soy sauce, and Dijon mustard.', photo: CDN + '69b917505b89c7a116e859db.jpg' },
  ] as FoodItem[],
  pasta: [
    { name: 'Salmon Ravioli', price: '₡10,200', desc: 'Salmon ravioli served with grana padana, Gorgonzola sauce, cherry tomatoes, mushrooms, basil and crostini.', photo: CDN + '69c194d56f10179ea435b639.jpg' },
    { name: 'Spaghetti Pura Vida', price: '₡9,500', desc: 'Sautéed shrimp spaghetti with onion, basil, tomato sauce, served with avocado and crostini.', photo: CDN + '69c194d5c1e996220ba4333f.jpg' },
    { name: 'Fettuccine Aglio E Olio', price: '₡9,350', desc: 'Fettuccine with olive oil, cherry tomatoes, basil, mushrooms, and chicken.', photo: CDN + '69d7378a3dd00cb232c432a1.jpg' },
    { name: 'Rigatoni In Aurora Sauce', price: '₡9,500', desc: 'Rigatoni pasta in aurora sauce (tomato and white sauce), with shrimps, parsley, onion, Parmesan cheese, crostinis.', photo: CDN + '69c194d5b0fe813a7003ff83.jpg' },
  ] as FoodItem[],
  whiteMeat: [
    { name: 'Cahuita Chicken', price: '₡9,100', desc: 'Grilled chicken with cahuita sauce (coconut milk, thyme, and chili pepper) served with vegetables and mashed potatoes.', photo: CDN + '69c5f8667794bfe0805014c0.jpg' },
    { name: 'Nanku Chicken', price: '₡9,100', desc: 'Grilled chicken filet, served with mashed sweet potatoes, mini zucchini, mushroom, tomato cherry with hibiscus sauce.' },
    { name: 'Pork Chop With Tamarindo', price: '₡14,100', desc: 'Pork chop served with stuffed cassava, grilled vegetables and tamarindo sauce.', photo: CDN + '69c194d5427f6e70175279b8.jpg' },
    { name: 'BBQ Pork Ribs', price: '₡12,000', desc: 'Pork ribs with BBQ sauce with pineapple, served with house salad, smashed plantains, refried beans and pico de gallo.', photo: CDN + '69b91750269d6516ffc77360.jpg' },
  ] as FoodItem[],
  steaks: [
    { name: 'Steak Strips', price: '₡14,000', photo: CDN + '69c194d5fa8b211e8d5a9298.jpg' },
    { name: 'Churrasco', price: '₡15,600', photo: CDN + '69c5edb5146bc5f778eaab9e.jpg' },
    { name: 'Rib Eye', price: '₡17,500', photo: CDN + '69c5fbd8146bc51f9eec8ca7.jpg' },
    { name: 'New York', price: '₡17,500', photo: CDN + '69c194d5fa8b2122095a9294.jpg' },
    { name: 'Sirloin Steak', price: '₡19,500', photo: CDN + '69c5fbd8146bc52decec8ca6.jpg' },
    { name: 'Surf And Turf', price: '₡31,900', photo: CDN + '69c194d50d1082cd084c8590.jpg' },
  ],
  steakNote: 'All of our meat cuts are served with rosemary potatoes, sweet plantain, jalapeño, and chimichurri.',
  vegetarian: [
    { name: 'Mushroom Bruschetta', price: '₡6,000', desc: 'Fresh mushrooms and cherry tomatoes sautéed with olive oil, onion, Parmesan cheese, garlic, and tomato sauce.' },
    { name: 'Stuffed Portobello Mushroom', price: '₡8,500', desc: 'Stuffed portobello mushrooms with basil and onions, topped with melted mozzarella cheese and served with crostini.' },
    { name: 'Mushroom Ceviche', price: '₡5,500', desc: 'Mushroom ceviche with yellow pepper, cilantro, red onion and lime juice, served with mixed chips.' },
    { name: 'Parmesan Eggplant', price: '₡8,500', desc: 'Encrusted eggplant with Parmesan cheese served with tomato sauce, capers, olives, and house salad.', photo: CDN + '69c5f8669619ac67709a2600.jpg' },
    { name: 'Vegan Hamburger', price: '₡7,000', desc: 'Vegan hamburger with grilled vegetables, portobello mushroom, vegan cheese, served with potato wedges.', badge: { text: 'Vegan', type: 'vegan' } },
  ] as FoodItem[],
  costaRica: [
    { name: 'Typical Casado', price: '₡7,800', desc: 'Typical casado served with rice, beans, picadillo, fried eggs, tortilla, cheese, salad and sweet plantain. Choice of beef, chicken or tilapia.', badge: { text: 'Vegan opt.', type: 'vegan-opt' } },
    { name: 'Rice With Chicken', price: '₡7,300', desc: 'Sautéed chicken rice and vegetables, served with salad and french fries.', photo: CDN + '69c5f94c7794bf5a7b5031c0.jpg' },
    { name: 'Chicharrones', price: '₡9,100', desc: 'Fried pork pieces served with salad, smashed plantains, pico de gallo, refried beans and fried cassava.', photo: CDN + '69c194d5c1e996eb22a43340.jpg' },
    { name: 'Rice And Beans With Chicken', price: '₡9,100', desc: 'Caribbean style chicken cooked with coconut milk, chili pepper and thyme, accompanied by sweet plantain and salad.', photo: CDN + '69c5f94c5ebd497c7c77bc60.jpg' },
    { name: 'Arenal Hamburger', price: '₡8,500', desc: '180g Angus beef, bacon, caramelized onions, mozzarella cheese, lettuce, pickles, tomato, served with french fries.', photo: CDN + '69c5f94d9619ac299c9a439d.png' },
    { name: 'Nanku Nachos', price: '₡6,500', desc: 'Choice of beef, chicken or vegetarian. Tortilla chips, refried beans, pico de gallo, sour cream, mozzarella cheese and sliced avocado.', badge: { text: 'Vegan opt.', type: 'vegan-opt' }, photo: CDN + '69b91750269d65241dc77361.jpg' },
    { name: 'Nanku Sandwich', price: '₡6,500', desc: 'Chicken, beef, or vegetarian with fresh lettuce, tomato, bacon, pickles, mozzarella cheese, served with french fries.' },
  ] as FoodItem[],
  desserts: [
    { name: 'Coconut Caramel Flan', price: '₡4,700', photo: CDN + '69d85ba09c84d38e9e925485.jpg' },
    { name: 'Chocolate Brownie With Vanilla Ice Cream', price: '₡4,700', photo: CDN + '69c5f94c7794bf69985031bf.jpg' },
    { name: 'Passion Fruit Cheesecake', price: '₡4,700', photo: CDN + '69d85cf8019dc508d3de6c98.png' },
    { name: 'Banana or Pineapple in Orange & Cinnamon Sauce Flamed in Orange Liquor', price: '₡4,700', photo: CDN + '69ec4de6b0e5e2bb7f933572.webp' },
  ],
  notes: [
    'Our restaurant prepares locally sourced produce, seafood, and meat cuts from nearby farmland, delivering you delicious and healthy farm-to-table meals.',
    'Taxes included.',
    'If you have a food allergy or special dietary requirements, please inform a member of staff or ask for more information.',
  ],
  topNotes: ['Farm-to-table', 'Locally sourced', 'Prices include taxes', 'Notify us of any allergies'],
  cats: [
    { id: 'appetizers' as FoodCat, label: 'Appetizers' },
    { id: 'seafood' as FoodCat, label: 'Sea Food' },
    { id: 'pasta' as FoodCat, label: 'Pasta' },
    { id: 'white-meat' as FoodCat, label: 'White Meat' },
    { id: 'steaks' as FoodCat, label: 'Steaks' },
    { id: 'vegetarian' as FoodCat, label: 'Vegetarian' },
    { id: 'costa-rica' as FoodCat, label: 'Costa Rica' },
    { id: 'desserts' as FoodCat, label: 'Desserts' },
  ],
  panelFood: 'Food Menu',
  panelDrinks: 'Drinks Menu',
}

// ─── ES DATA ────────────────────────────────────────────────────────────────

const esFood = {
  appetizers: [
    { name: 'Ensalada Teriyaki', price: '₡9,700', desc: 'Ensalada verde con atún aleta amarilla fresco encostrado en ajonjolí con salsa teriyaki.', photo: CDN + '69c5f5dc7794bffe444fbf93.jpg' },
    { name: 'Ensalada de Quinoa', price: '₡6,500', desc: 'Bowl de ensalada mixta con quinoa y aderezo balsámico.', badge: { text: 'Vegano', type: 'vegan' }, photo: CDN + '69c5f6dc9619ac798a99f4d1.jpg' },
    { name: 'Tartar de Atún', price: '₡9,900', desc: 'Atún marinado con salsa de soya, ajonjolí, limón, pepino y cebolla morada, servido con crostini.', photo: CDN + '69c5f866421e24593383c6c8.jpg' },
    { name: 'Aguacate Relleno', price: '₡8,350', desc: 'Aguacate relleno con camarones en salsa pomodoro sobre cama de lechuga.' },
    { name: 'Ceviche de Pulpo', price: '₡10,500', desc: 'Pulpo marinado con salsa cítrica de soya, servido con patacones.', photo: CDN + '69c5f674146bc581d6ebd34f.jpg' },
    { name: 'Ceviche de Pescado', price: '₡6,900', desc: 'Ceviche tradicional costarricense servido con chips mixtos.', photo: CDN + '69c5f674146bc59c7debd350.jpg' },
    { name: 'Ceviche de Atún con Maracuyá', price: '₡8,500', desc: 'Atún marinado con maracuyá, soya y aceite de pimienta, servido con chips mixtos.', photo: CDN + '69c194d5eb06d8b53fe532fc.jpg', photoPosition: '70% center' },
  ] as FoodItem[],
  seafood: [
    { name: 'Atún Teriyaki', price: '₡14,200', desc: 'Atún aleta amarilla encostrado en ajonjolí, servido con vegetales, puré de papas y salsa teriyaki.', photo: CDN + '69d85b05d7871cddf7ea19e0.webp' },
    { name: 'Pulpo a la Parrilla', price: '₡19,000', desc: 'Pulpo a la parrilla con camote, ensalada, chimichurri de tomate y salsa cítrica de soya.', photo: CDN + '69b9175087f0f2768356c731.jpg' },
    { name: 'Sopa Caribeña', price: '₡8,000', desc: 'Mariscos mixtos en salsa de tomate con leche de coco, tomillo y chile.', photo: CDN + '69c5f6dc7794bf5d9b4fe34b.jpg' },
    { name: 'Trucha en Salsa Cremosa', price: '₡12,400', desc: 'Trucha costarricense en salsa cremosa con camarones, servida con arroz de alcachofas y tomates cherry.', photo: CDN + '69c5f8665ebd49a0c4779e7f.jpg' },
    { name: 'Mahi Mahi con Chutney de Manzana y Mango', price: '₡12,400', desc: 'Mahi mahi a la parrilla con papas al romero, manzana, mango, salsa de soya y mostaza Dijon.', photo: CDN + '69b917505b89c7a116e859db.jpg' },
  ] as FoodItem[],
  pasta: [
    { name: 'Ravioles de Salmón', price: '₡10,200', desc: 'Ravioles de salmón con grana padana, salsa Gorgonzola, tomates cherry, champiñones, albahaca y crostini.', photo: CDN + '69c194d56f10179ea435b639.jpg' },
    { name: 'Spaghetti Pura Vida', price: '₡9,500', desc: 'Spaghetti salteado con camarones, cebolla, albahaca y salsa de tomate, servido con aguacate y crostini.', photo: CDN + '69c194d5c1e996220ba4333f.jpg' },
    { name: 'Fettuccine Aglio e Olio', price: '₡9,350', desc: 'Fettuccine con aceite de oliva, tomates cherry, albahaca, champiñones y pollo.', photo: CDN + '69d7378a3dd00cb232c432a1.jpg' },
    { name: 'Rigatoni en Salsa Aurora', price: '₡9,500', desc: 'Rigatoni en salsa aurora (tomate y salsa blanca) con camarones, perejil, cebolla, queso Parmesano y crostini.', photo: CDN + '69c194d5b0fe813a7003ff83.jpg' },
  ] as FoodItem[],
  whiteMeat: [
    { name: 'Pollo Cahuita', price: '₡9,100', desc: 'Pollo a la parrilla con salsa cahuita (leche de coco, tomillo y chile), servido con vegetales y puré de papas.', photo: CDN + '69c5f8667794bfe0805014c0.jpg' },
    { name: 'Pollo Nanku', price: '₡9,100', desc: 'Filete de pollo a la parrilla con puré de camote, mini zucchini, champiñones y tomates cherry con salsa de hibisco.' },
    { name: 'Chuleta de Cerdo con Tamarindo', price: '₡14,100', desc: 'Chuleta de cerdo con yuca rellena, vegetales a la parrilla y salsa de tamarindo.', photo: CDN + '69c194d5427f6e70175279b8.jpg' },
    { name: 'Costillas BBQ', price: '₡12,000', desc: 'Costillas de cerdo con salsa BBQ de piña, servidas con ensalada de la casa, patacones, frijoles molidos y pico de gallo.', photo: CDN + '69b91750269d6516ffc77360.jpg' },
  ] as FoodItem[],
  steaks: [
    { name: 'Tiras de Lomo', price: '₡14,000', photo: CDN + '69c194d5fa8b211e8d5a9298.jpg' },
    { name: 'Churrasco', price: '₡15,600', photo: CDN + '69c5edb5146bc5f778eaab9e.jpg' },
    { name: 'Rib Eye', price: '₡17,500', photo: CDN + '69c5fbd8146bc51f9eec8ca7.jpg' },
    { name: 'New York', price: '₡17,500', photo: CDN + '69c194d5fa8b2122095a9294.jpg' },
    { name: 'Sirloin', price: '₡19,500', photo: CDN + '69c5fbd8146bc52decec8ca6.jpg' },
    { name: 'Surf And Turf', price: '₡31,900', photo: CDN + '69c194d50d1082cd084c8590.jpg' },
  ],
  steakNote: 'Todos nuestros cortes se sirven con papas al romero, plátano maduro, jalapeño y chimichurri.',
  vegetarian: [
    { name: 'Bruschetta de Champiñones', price: '₡6,000', desc: 'Champiñones frescos y tomates cherry salteados con aceite de oliva, cebolla, queso Parmesano, ajo y salsa de tomate.' },
    { name: 'Champiñón Portobello Relleno', price: '₡8,500', desc: 'Champiñones portobello rellenos con albahaca y cebolla, cubiertos con mozzarella derretida y servidos con crostini.' },
    { name: 'Ceviche de Champiñones', price: '₡5,500', desc: 'Ceviche de champiñones con chile amarillo, cilantro, cebolla morada y limón, servido con chips mixtos.' },
    { name: 'Berenjena Parmesana', price: '₡8,500', desc: 'Berenjena encostrada con queso Parmesano, servida con salsa de tomate, alcaparras, aceitunas y ensalada de la casa.', photo: CDN + '69c5f8669619ac67709a2600.jpg' },
    { name: 'Hamburguesa Vegana', price: '₡7,000', desc: 'Hamburguesa vegana con vegetales a la parrilla, champiñón portobello y queso vegano, servida con papas en gajos.', badge: { text: 'Vegano', type: 'vegan' } },
  ] as FoodItem[],
  costaRica: [
    { name: 'Casado Típico', price: '₡7,800', desc: 'Casado típico con arroz, frijoles, picadillo, huevo frito, tortilla, queso, ensalada y plátano maduro. A elección: carne, pollo o tilapia.', badge: { text: 'Vegano opt.', type: 'vegan-opt' } },
    { name: 'Arroz con Pollo', price: '₡7,300', desc: 'Arroz salteado con pollo y vegetales, servido con ensalada y papas fritas.', photo: CDN + '69c5f94c7794bf5a7b5031c0.jpg' },
    { name: 'Chicharrones', price: '₡9,100', desc: 'Trozos de cerdo fritos con ensalada, patacones, pico de gallo, frijoles molidos y yuca frita.', photo: CDN + '69c194d5c1e996eb22a43340.jpg' },
    { name: 'Rice and Beans con Pollo', price: '₡9,100', desc: 'Pollo estilo caribeño cocinado con leche de coco, chile y tomillo, acompañado de plátano maduro y ensalada.', photo: CDN + '69c5f94c5ebd497c7c77bc60.jpg' },
    { name: 'Hamburguesa Arenal', price: '₡8,500', desc: 'Carne Angus 180g, tocino, cebollas caramelizadas, mozzarella, lechuga, encurtidos y tomate, servida con papas fritas.', photo: CDN + '69c5f94d9619ac299c9a439d.png' },
    { name: 'Nachos Nanku', price: '₡6,500', desc: 'A elección: carne, pollo o vegetariano. Totopos, frijoles molidos, pico de gallo, crema, mozzarella y aguacate.', badge: { text: 'Vegano opt.', type: 'vegan-opt' }, photo: CDN + '69b91750269d65241dc77361.jpg' },
    { name: 'Sándwich Nanku', price: '₡6,500', desc: 'Pollo, carne o vegetariano con lechuga fresca, tomate, tocino, encurtidos y mozzarella, servido con papas fritas.' },
  ] as FoodItem[],
  desserts: [
    { name: 'Flan de Coco y Caramelo', price: '₡4,700', photo: CDN + '69d85ba09c84d38e9e925485.jpg' },
    { name: 'Brownie de Chocolate con Helado de Vainilla', price: '₡4,700', photo: CDN + '69c5f94c7794bf69985031bf.jpg' },
    { name: 'Cheesecake de Maracuyá', price: '₡4,700', photo: CDN + '69d85cf8019dc508d3de6c98.png' },
    { name: 'Banano o Piña en Salsa de Naranja y Canela Flameado con Licor de Naranja', price: '₡4,700', photo: CDN + '69ec4de6b0e5e2bb7f933572.webp' },
  ],
  notes: [
    'Nuestro restaurante prepara ingredientes de origen local, mariscos y cortes de carne de granjas cercanas, ofreciéndole comida deliciosa y saludable del campo a la mesa.',
    'Impuestos incluidos.',
    'Si tiene alguna alergia alimentaria o requisitos dietéticos especiales, por favor informe a un miembro del personal.',
  ],
  topNotes: ['Del campo a la mesa', 'Ingredientes locales', 'Precios incluyen impuestos', 'Avísenos sobre alergias'],
  cats: [
    { id: 'appetizers' as FoodCat, label: 'Entradas' },
    { id: 'seafood' as FoodCat, label: 'Mariscos' },
    { id: 'pasta' as FoodCat, label: 'Pasta' },
    { id: 'white-meat' as FoodCat, label: 'Carnes Blancas' },
    { id: 'steaks' as FoodCat, label: 'Carnes' },
    { id: 'vegetarian' as FoodCat, label: 'Vegetariano' },
    { id: 'costa-rica' as FoodCat, label: 'Costa Rica' },
    { id: 'desserts' as FoodCat, label: 'Postres' },
  ],
  panelFood: 'Comida',
  panelDrinks: 'Bebidas',
}

const drinksCats: { id: DrinksCat; label: string }[] = [
  { id: 'tiki', label: 'Tiki Cocktails' },
  { id: 'cocteles', label: 'Cocktails' },
  { id: 'vinos', label: 'Wines' },
  { id: 'licores', label: 'Licores' },
  { id: 'cervezas', label: 'Beer' },
  { id: 'bebidas', label: 'Soft Drinks' },
]

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function MenuCard({ item, onOpen }: { item: FoodItem; onOpen?: (item: FoodItem) => void }) {
  const clickable = !!item.photo && !!onOpen
  return (
    <div
      className={`nm-card${clickable ? ' nm-card-clickable' : ''}`}
      onClick={clickable ? () => onOpen!(item) : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => e.key === 'Enter' && onOpen!(item) : undefined}
    >
      <div className="nm-card-body">
        <div className="nm-card-top">
          <h3 className="nm-card-name">
            {item.name}
            {item.badge && <span className={`nm-badge nm-badge-${item.badge.type}`}>{item.badge.text}</span>}
          </h3>
          <span className="nm-card-price">{item.price}</span>
        </div>
        {item.desc && <p className="nm-card-desc">{item.desc}</p>}
      </div>
    </div>
  )
}

function PriceRow({ item, onOpen }: { item: FoodItem; onOpen?: (item: FoodItem) => void }) {
  const clickable = !!item.photo && !!onOpen
  return (
    <div
      className={`nm-price-row${clickable ? ' nm-card-clickable' : ''}`}
      onClick={clickable ? () => onOpen!(item) : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => e.key === 'Enter' && onOpen!(item) : undefined}
    >
      <span className="nm-price-name">{item.name}</span>
      <span className="nm-price-dots"></span>
      <span className="nm-price-val">{item.price}</span>
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

function WineRow({ name, detail, price }: { name: string; detail: string; price: string }) {
  return (
    <div className="nm-wine-row">
      <div className="nm-wine-info">
        <span className="nm-wine-name">{name}</span>
        <span className="nm-wine-detail">{detail}</span>
      </div>
      <span className="nm-wine-dots"></span>
      <span className="nm-wine-price">{price}</span>
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

function DrinksHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="nm-drinks-header">
      <span className="nm-drinks-ornament">✦ &nbsp; ✦ &nbsp; ✦</span>
      <h2 className="nm-drinks-title">{title}</h2>
      <div className="nm-drinks-divider">
        <span className="nm-ddiv-line"></span>
        <span className="nm-ddiv-gem">◆</span>
        <span className="nm-ddiv-line"></span>
      </div>
      {subtitle && <p className="nm-drinks-subtitle">{subtitle}</p>}
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

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function MenuClient({ lang = 'en' }: { lang?: 'en' | 'es' }) {
  const [panel, setPanel] = useState<Panel>('food')
  const [foodCat, setFoodCat] = useState<FoodCat>('appetizers')
  const [drinksCat, setDrinksCat] = useState<DrinksCat>('tiki')

  const searchParams = useSearchParams()
  useEffect(() => {
    setPanel(searchParams.get('tab') === 'drinks' ? 'drinks' : 'food')
  }, [searchParams])
  const [modal, setModal] = useState<ModalState | null>(null)

  const d = lang === 'es' ? esFood : enFood

  const openModal = (item: FoodItem, sectionItems: FoodItem[]) =>
    setModal({
      name: item.name,
      price: item.price,
      desc: item.desc,
      photo: item.photo!,
      photoPosition: item.photoPosition,
      suggestions: sectionItems.filter(s => s.name !== item.name && s.photo).slice(0, 4),
      allSectionItems: sectionItems,
      variants: item.variants,
    })

  const suggestLabel = lang === 'es' ? 'Platillos que te podrían gustar' : 'You might also like'

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const banners = {
    appetizers: 'https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba21d29ab5e21035712b06.jpg',
    seafood: 'https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba21d661cba538a2a13a41.jpg',
    pasta: 'https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba21db9ab5e22eda712c59.jpg',
    whiteMeat: 'https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba21e9ad0276ce1964ea9e.jpg',
    steaks: 'https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba21eead02761cdd64eb23.jpg',
    vegetarian: 'https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba221edac584673cb76ed5.jpg',
    costaRica: 'https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba22259ab5e2490f7138fa.jpg',
    desserts: 'https://assets.cdn.filesafe.space/0M6K8lmvNdLqq7S28Bmn/media/69ba222cdac58405aab77052.jpg',
  }

  const catTitles: Record<FoodCat, string> = {
    'appetizers': d.cats[0].label,
    'seafood': d.cats[1].label,
    'pasta': d.cats[2].label,
    'white-meat': d.cats[3].label,
    'steaks': d.cats[4].label,
    'vegetarian': d.cats[5].label,
    'costa-rica': d.cats[6].label,
    'desserts': d.cats[7].label,
  }

  return (
    <>
      {/* Photo Modal */}
      {modal && (
        <div className="nm-modal-backdrop" onClick={() => setModal(null)}>
          <div className="nm-modal" onClick={(e) => e.stopPropagation()}>
            <button className="nm-modal-close" onClick={() => setModal(null)} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="nm-modal-columns">
              {/* Left — Photo */}
              <div
                className="nm-modal-photo"
                style={modal.name === 'Passion Fruit Cheesecake' || modal.name === 'Cheesecake de Maracuyá' ? { width: '80%' } : undefined}
              >
                <Image src={modal.photo} alt={modal.name} fill style={{ objectFit: 'cover', objectPosition: modal.photoPosition ?? 'center' }} />
              </div>

              {/* Right — Info + Suggestions + Reserve */}
              <div className="nm-modal-info">
                <h3 className="nm-modal-name">{modal.name}</h3>
                {modal.variants ? (
                  <div className="nm-modal-variants">
                    {modal.variants.map(v => (
                      <div key={v.label} className="nm-modal-variant-row">
                        <span className="nm-modal-variant-label">{v.label}</span>
                        <span className="nm-modal-variant-price">{v.price}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="nm-modal-price">{modal.price}</span>
                )}
                {modal.desc && <p className="nm-modal-desc">{modal.desc}</p>}

                {modal.suggestions.length > 0 && (
                  <div className="nm-modal-sugg">
                    <p className="nm-modal-sugg-title">{suggestLabel}</p>
                    <div className="nm-modal-sugg-row">
                      {modal.suggestions.map((s) => (
                        <button
                          key={s.name}
                          className="nm-modal-sugg-card"
                          onClick={() => setModal({
                            name: s.name,
                            price: s.price,
                            desc: s.desc,
                            photo: s.photo ?? modal.photo,
                            suggestions: modal.allSectionItems.filter(x => x.name !== s.name && x.photo).slice(0, 4),
                            allSectionItems: modal.allSectionItems,
                          })}
                        >
                          {s.photo && (
                            <div className="nm-modal-sugg-img">
                              <Image src={s.photo} alt={s.name} fill style={{ objectFit: 'cover' }} />
                            </div>
                          )}
                          <div className="nm-modal-sugg-text">
                            <span className="nm-modal-sugg-name">{s.name}</span>
                            <span className="nm-modal-sugg-price">{s.price}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="nm-modal-reserve">
                  <Link
                    href={lang === 'es' ? '/es#reservations' : '/#reservations'}
                    className="nm-modal-reserve-btn"
                    onClick={() => setModal(null)}
                  >
                    {lang === 'es' ? 'Reservar una Mesa' : 'Reserve a Table'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Nav */}
      <div className="nm-sticky-nav">
        <div className="nm-main-row">
          <button className={`nm-main-btn${panel === 'food' ? ' active' : ''}`} onClick={() => setPanel('food')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2M18 2c0 0 3 0 3 6s-3 6-3 6" />
            </svg>
            {d.panelFood}
          </button>
          <button className={`nm-main-btn${panel === 'drinks' ? ' active' : ''}`} onClick={() => setPanel('drinks')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 22h8M12 11v11M20 7H4l2 9h12z" /><path d="M4 7c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4" />
            </svg>
            {d.panelDrinks}
          </button>
        </div>
        <div className="nm-cats-row">
          {panel === 'food' && (
            <div className="nm-cats-inner">
              {d.cats.map((c) => (
                <button key={c.id} className={`nm-cat-btn${foodCat === c.id ? ' active' : ''}`}
                  onClick={() => { setFoodCat(c.id); scrollToSection(c.id) }}>
                  {c.label}
                </button>
              ))}
            </div>
          )}
          {panel === 'drinks' && (
            <div className="nm-cats-inner">
              {drinksCats.map((c) => (
                <button key={c.id} className={`nm-cat-btn${drinksCat === c.id ? ' active' : ''}`}
                  onClick={() => { setDrinksCat(c.id); scrollToSection(c.id) }}>
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
              {d.topNotes.map((n) => <span key={n}>{n}</span>)}
            </div>
          </div>
          <div className="nm-food-sections">

            <section className="nm-food-section" id="appetizers">
              <SectionBanner src={banners.appetizers} title={catTitles['appetizers']} />
              <div className="nm-grid">
                {d.appetizers.map((item) => (
                  <MenuCard key={item.name} item={item}
                    onOpen={item.photo ? (i) => openModal(i, d.appetizers) : undefined} />
                ))}
              </div>
            </section>

            <section className="nm-food-section" id="seafood">
              <SectionBanner src={banners.seafood} title={catTitles['seafood']} />
              <div className="nm-grid">
                {d.seafood.map((item) => (
                  <MenuCard key={item.name} item={item}
                    onOpen={item.photo ? (i) => openModal(i, d.seafood) : undefined} />
                ))}
              </div>
            </section>

            <section className="nm-food-section" id="pasta">
              <SectionBanner src={banners.pasta} title={catTitles['pasta']} />
              <div className="nm-grid">
                {d.pasta.map((item) => (
                  <MenuCard key={item.name} item={item}
                    onOpen={item.photo ? (i) => openModal(i, d.pasta) : undefined} />
                ))}
              </div>
            </section>

            <section className="nm-food-section" id="white-meat">
              <SectionBanner src={banners.whiteMeat} title={catTitles['white-meat']} />
              <div className="nm-grid">
                {d.whiteMeat.map((item) => (
                  <MenuCard key={item.name} item={item}
                    onOpen={item.photo ? (i) => openModal(i, d.whiteMeat) : undefined} />
                ))}
              </div>
            </section>

            <section className="nm-food-section" id="steaks">
              <SectionBanner src={banners.steaks} title={catTitles['steaks']} />
              <div className="nm-steak-grid">
                {d.steaks.map((s) => (
                  <PriceRow key={s.name} item={s}
                    onOpen={s.photo ? (i) => openModal(i, d.steaks) : undefined} />
                ))}
              </div>
              <p className="nm-steak-note">{d.steakNote}</p>
            </section>

            <section className="nm-food-section" id="vegetarian">
              <SectionBanner src={banners.vegetarian} title={catTitles['vegetarian']} />
              <div className="nm-grid">
                {d.vegetarian.map((item) => (
                  <MenuCard key={item.name} item={item}
                    onOpen={item.photo ? (i) => openModal(i, d.vegetarian) : undefined} />
                ))}
              </div>
            </section>

            <section className="nm-food-section" id="costa-rica">
              <SectionBanner src={banners.costaRica} title={catTitles['costa-rica']} />
              <div className="nm-grid">
                {d.costaRica.map((item) => (
                  <MenuCard key={item.name} item={item}
                    onOpen={item.photo ? (i) => openModal(i, d.costaRica) : undefined} />
                ))}
              </div>
            </section>

            <section className="nm-food-section" id="desserts">
              <SectionBanner src={banners.desserts} title={catTitles['desserts']} />
              <div className="nm-dessert-grid">
                {d.desserts.map((item) => (
                  <div key={item.name}
                    className={`nm-dessert-item${item.photo ? ' nm-card-clickable' : ''}`}
                    onClick={item.photo ? () => openModal(item, d.desserts) : undefined}
                    role={item.photo ? 'button' : undefined}
                    tabIndex={item.photo ? 0 : undefined}
                  >
                    <span className="nm-dessert-name">{item.name}</span>
                    <span className="nm-dessert-price">{item.price}</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="nm-food-notes">
              {d.notes.map((n) => (
                <div key={n} className="nm-food-note">
                  <span className="nm-fn-icon">✦</span>
                  <span>{n}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* DRINKS PANEL */}
      {panel === 'drinks' && (
        <div className="nm-drinks-sections">
          <section className="nm-drinks-section" id="tiki">
            <DrinksHeader title="Tiki Cocktails" subtitle={lang === 'es'
              ? 'Escápate al trópico con nuestras vibrantes creaciones tiki — mezclas exóticas y audaces perfectamente equilibradas para transportarte al paraíso del sabor.'
              : 'Escape to the tropics with our vibrant tiki creations — bold, exotic blends perfectly balanced to transport you to flavor paradise.'} />
            {(() => {
              const tikisEn: FoodItem[] = [
                { name: 'Pura Vida', price: '₡8,000', desc: 'The spirit of Costa Rica in a glass. White rum and vodka meet gin and pineapple juice, while lime and starfruit add irresistible tropical freshness.', photo: CDN + '69ee79140d66f2a6656398cc.png' },
                { name: 'Nanku', price: '₡8,000', desc: 'Our signature tiki. Dark and white rum united in perfect harmony with lime, cinnamon syrup, and the sweet kiss of mango.', photo: CDN + '69ee744905d4199001c71026.png' },
                { name: 'Julia', price: '₡8,000', desc: 'Caribbean elegance. Aged rum and pineapple dance with ginger syrup and lime, crowned with the aromatic touch of cranberry juice.', photo: CDN + '69ee777f717d5dd4e12d8ee5.png' },
                { name: 'A Cachete', price: '₡8,000', desc: 'Pure tropical power. Aged rum and watermelon juice lead this exotic escape, elevated with lime, pineapple, cinnamon, Malibu, and mysterious blue curaçao.', photo: CDN + '69ee77ea05d4199001c7c357.png' },
                { name: 'Tuanis', price: '₡8,000', desc: 'Simply "tuanis" (awesome). The refreshing combination of white and dark rum, lime and Jamaica syrup, with the vibrant touch of ginger.', photo: CDN + '69ee76d2b0e5e2bb7ff40bd3.png' },
                { name: 'Jack Sparrow', price: '₡8,000', desc: 'Adventure in every sip. Campari and Jack Daniel\'s meet passion fruit and ginger syrup, sailing on a sea of orange juice.', photo: CDN + '69ee78aa05d4199001c7e731.png' },
                { name: 'Mai Tai', price: '₡8,000', desc: 'The timeless classic. Rum, Cointreau, lime, and sugar, crowned with exotic horchata syrup.', photo: CDN + '69ee762e0d66f2a665630ced.png' },
              ]
              const tikisEs: FoodItem[] = [
                { name: 'Pura Vida', price: '₡8,000', desc: 'El espíritu de Costa Rica en un vaso. Ron blanco y vodka se encuentran con ginebra y jugo de piña, mientras que el limón y el carambolo añaden una frescura tropical irresistible.', photo: CDN + '69ee79140d66f2a6656398cc.png' },
                { name: 'Nanku', price: '₡8,000', desc: 'Nuestro tiki insignia. Ron oscuro y blanco unidos en perfecta armonía con limón, jarabe de canela y el dulce beso del mango.', photo: CDN + '69ee744905d4199001c71026.png' },
                { name: 'Julia', price: '₡8,000', desc: 'Elegancia caribeña. Ron añejo y piña bailan con jarabe de jengibre y limón, coronados con el toque aromático del jugo de arándano.', photo: CDN + '69ee777f717d5dd4e12d8ee5.png' },
                { name: 'A Cachete', price: '₡8,000', desc: 'Puro poder tropical. Ron añejo y jugo de sandía lideran esta escapada exótica, elevada con limón, piña, canela, Malibu y el misterioso curaçao azul.', photo: CDN + '69ee77ea05d4199001c7c357.png' },
                { name: 'Tuanis', price: '₡8,000', desc: 'Simplemente "tuanis" (genial). La refrescante combinación de ron blanco y oscuro, limón y jarabe de Jamaica, con el toque vibrante del jengibre.', photo: CDN + '69ee76d2b0e5e2bb7ff40bd3.png' },
                { name: 'Jack Sparrow', price: '₡8,000', desc: 'Aventura en cada sorbo. Campari y Jack Daniel\'s se encuentran con maracuyá y jarabe de jengibre, navegando en un mar de jugo de naranja.', photo: CDN + '69ee78aa05d4199001c7e731.png' },
                { name: 'Mai Tai', price: '₡8,000', desc: 'El clásico atemporal. Ron, Cointreau, limón y azúcar, coronado con el exótico jarabe de horchata.', photo: CDN + '69ee762e0d66f2a665630ced.png' },
              ]
              const tikis = lang === 'es' ? tikisEs : tikisEn
              return (
                <div className="nm-cktl-grid">
                  {tikis.map((c) => c.photo ? (
                    <div key={c.name}
                      className="nm-cktl-card nm-cktl-card--photo nm-card-clickable"
                      onClick={() => openModal(c, tikis.filter(t => t.name !== c.name && !!t.photo).slice(0, 4))}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && openModal(c, tikis.filter(t => t.name !== c.name && !!t.photo).slice(0, 4))}
                    >
                      <div className="nm-cktl-photo-wrap">
                        <Image src={c.photo} alt={c.name} fill style={{ objectFit: 'cover', objectPosition: 'center 15%' }} />
                        <div className="nm-cktl-photo-overlay">
                          <h3 className="nm-cktl-name">{c.name}</h3>
                        </div>
                      </div>
                      <div className="nm-cktl-body">
                        <span className="nm-cktl-price">{c.price}</span>
                        <p className="nm-cktl-desc">{c.desc}</p>
                      </div>
                    </div>
                  ) : (
                    <div key={c.name} className="nm-cktl-card">
                      <div className="nm-cktl-top">
                        <h3 className="nm-cktl-name">{c.name}</h3>
                        <span className="nm-cktl-price">{c.price}</span>
                      </div>
                      <p className="nm-cktl-desc">{c.desc}</p>
                    </div>
                  ))}
                </div>
              )
            })()}
          </section>

          <section className="nm-drinks-section" id="cocteles">
            <DrinksHeader title="Cócteles / Cocktails" />

            <div className="nm-dsub">
              <div className="nm-dsub-title">Los Sours</div>
              <div className="nm-cktl-grid">
                {[
                  { name: 'Guaro Sour Clásico', price: '₡3,500', desc: 'Guaro, limón, jarabe simple.' },
                  { name: 'Guaro Sour Arándanos', price: '₡4,500', desc: 'Guaro, arándanos, limón, sirope de moras.' },
                  { name: 'Whiskey Sour', price: '₡4,500', desc: 'Clara de huevo, limón, jarabe simple, Ezra Brooks Bourbon.' },
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
            </div>

            <div className="nm-dsub">
              <div className="nm-dsub-title">Margaritas</div>
              <div className="nm-cktl-grid">
                {[
                  { name: 'Margarita Clásica', price: '₡4,000', desc: 'Tequila Jarana Blanco, triple sec, limón, jarabe simple.' },
                  { name: 'Wild Passion Margarita', price: '₡4,500', desc: 'Infusión de tequila y jalapeño, triple sec, maracuyá y jarabe simple.' },
                  { name: 'Margarita de Mango', price: '₡4,000', desc: 'Tequila Jarana Blanco, triple sec, mango, limón.' },
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
            </div>

            <div className="nm-dsub">
              <div className="nm-dsub-title">With a Twist</div>
              <div className="nm-cktl-grid">
                {[
                  { name: 'Tom Collins de Fresa y Tomillo', price: '₡4,000', desc: 'Ginebra Master\'s, limón, jarabe de fresa y tomillo, soda.' },
                  { name: 'Gin Tonic de Mandarina', price: '₡4,500', desc: 'Ginebra Martin Miller\'s, rosas persas, jugo de mandarina, agua tónica.' },
                  { name: 'Mula Tica', price: '₡4,500', desc: 'Guaro Cacique, limón, cerveza de jengibre.' },
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
            </div>

            <div className="nm-dsub">
              <div className="nm-dsub-title">Los Clásicos / The Classics</div>
              <div className="nm-cktl-grid">
                {[
                  { name: 'Mojito', price: '₡4,500', desc: 'Hierba buena fresca, limón, jarabe de hierba buena, ron blanco.' },
                  { name: 'Piña Colada', price: '₡4,500', desc: 'Piña fresca, crema de coco, leche de coco, ron blanco.' },
                  { name: 'Old Fashioned', price: '₡4,500', desc: 'Azúcar, amargos de angostura, Ezra Brooks Bourbon, cherry.' },
                  { name: 'Negroni', price: '₡4,500', desc: 'Campari, Vermouth Rosso, Ginebra.' },
                  { name: 'Aperol Spritz', price: '₡4,500', desc: 'Aperol, soda, vino espumante.' },
                  { name: 'Long Island', price: '₡4,500', desc: 'Ron blanco, Vodka, Tequila, triple sec, ginebra, limón, azúcar, cola.' },
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
            </div>
          </section>

          <section className="nm-drinks-section" id="vinos">
            <DrinksHeader title="Vinos / Wines" />

            <DSub title="Vino Espumoso / Sparkling Wine">
              <WineRow name="Lunneta Prosecco DOC" detail="Veneto, Italia · Glera" price="₡19,500" />
            </DSub>

            <DSub title="Vinos Blancos / White Wine">
              <WineRow name="Legaris DO Rueda" detail="España · Verdejo" price="₡19,000" />
              <WineRow name="Cavit Valdobbiadene DOC" detail="Italia · Pinot Grigio" price="₡19,500" />
              <WineRow name="Santa Rita Medalla Real Reserva" detail="DO Valle de Casa Blanca, Chile · Sauvignon Blanc" price="₡17,000" />
              <WineRow name="Carmen Premier Reserva" detail="DO Valle de Casa Blanca, Chile · Chardonnay" price="₡18,500" />
              <WineRow name="Santa Rita Medalla Real Reserva" detail="DO Valle de Limari, Chile · Chardonnay" price="₡17,000" />
              <WineRow name="Carmen Gran Reserva" detail="DO Valle de Limari, Chile · Chardonnay" price="₡20,000" />
            </DSub>

            <DSub title="Vino Rosado / Rosé Wine">
              <WineRow name="Domaines Paul Mass Jardin de Roses" detail="AOC Languedoc, Francia · Garnacha, Cinsaul & Syrah" price="₡20,000" />
            </DSub>

            <DSub title="Vinos Tintos / Red Wine">
              <WineRow name="Cavit Red Blend, Trentino DOC" detail="Italia · Merlot, Cabernet & Teroldego" price="₡17,000" />
              <WineRow name="Care Nouveau Blend, DO Cariñena" detail="España · Tempranillo, Garnacha & Cabernet Sauvignon" price="₡19,500" />
              <WineRow name="Domaines Paul Reserva, IGT Pays d'Oc" detail="Francia · Pinot Noir" price="₡19,500" />
              <WineRow name="Santa Rita Medalla Real Reserva" detail="DO Valle del Maipo, Chile · Cabernet Sauvignon" price="₡17,000" />
              <WineRow name="Carmen Series Vintage Gran Reserva" detail="DO Alto Jahuel, Chile · Cabernet Sauvignon" price="₡21,500" />
              <WineRow name="Legaris Crianza, DO Ribera del Duero" detail="España · Tempranillo" price="₡24,500" />
              <WineRow name="Doña Paula Estate" detail="Valle de Uco, Argentina · Malbec" price="₡22,000" />
              <WineRow name="Norton Altura" detail="Valle de Uco, Argentina · Malbec" price="₡26,500" />
            </DSub>

            <DSub title="Vino de la Casa / House Wine · Copa / Glass">
              <DPriceRow name="Doña Paula Malbec, Argentina" price="₡4,500" />
              <DPriceRow name="Carmen Merlot, Chile" price="₡4,500" />
              <DPriceRow name="Carmen Cabernet Sauvignon, Chile" price="₡4,500" />
              <DPriceRow name="Carmen Sauvignon Blanc, Chile" price="₡4,500" />
              <DPriceRow name="Principato Pinot Grigio, Italia" price="₡4,500" />
              <DPriceRow name="Carmen Chardonnay, Chile" price="₡4,500" />
            </DSub>
          </section>

          <section className="nm-drinks-section" id="licores">
            <DrinksHeader title="Licores / Liqueur" />
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
            <DSub title="Aperitivo & Digestivo">
              <DPriceRow name="Jägermeister" price="₡2,500" />
              <DPriceRow name="Licor 43" price="₡2,500" />
              <DPriceRow name="Cointreau" price="₡4,000" />
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
            <DSub title="Rones / Rum">
              <DPriceRow name="Capitán Morgan" price="₡2,500" />
              <DPriceRow name="Centenario 7 años" price="₡3,500" />
              <DPriceRow name="Flor de Caña 7 años" price="₡3,000" />
              <DPriceRow name="Flor de Caña 12 años" price="₡4,300" />
              <DPriceRow name="Flor de Caña 18 años" price="₡5,500" />
              <DPriceRow name="Centenario 20 años" price="₡5,500" />
              <DPriceRow name="Zacapa 23 años" price="₡5,900" />
              <DPriceRow name="Cachaça" price="₡2,500" />
              <DPriceRow name="Cacique" price="₡2,000" />
              <DPriceRow name="Appleton Estate" price="₡4,000" />
            </DSub>
          </section>

          <section className="nm-drinks-section" id="cervezas">
            <DrinksHeader title="Cervezas / Beer" />
            <DSub title="Artesanal Local en Sifón / Local Craft on Draft">
              <DPriceRow name="Indómito IPA 7.6%" price="₡4,500" />
              <DPriceRow name="Libertas Golden Ale 4.3%" price="₡4,500" />
              <DPriceRow name="Segua Red Ale 4.8%" price="₡4,500" />
              <DPriceRow name="Nanku Premium Lager 4.3%" price="₡4,500" />
              <DPriceRow name="Passion de Maracuyá" price="₡4,500" />
            </DSub>
            <DSub title="Artesanal Local en Botella / Local Craft on Bottle">
              <DPriceRow name="Mama Candela" price="₡4,500" />
            </DSub>
            <DSub title="Cerveza sin Gluten / Gluten-Free Beer">
              <DPriceRow name="Daura Damm" price="₡3,000" />
            </DSub>
            <DSub title="Las Lager">
              <DPriceRow name="Imperial" price="₡1,900" />
              <DPriceRow name="Imperial Silver" price="₡1,900" />
              <DPriceRow name="Imperial Light" price="₡1,900" />
              <DPriceRow name="Imperial Ultra" price="₡1,900" />
              <DPriceRow name="Pilsen" price="₡1,900" />
              <DPriceRow name="Bavaria Gold" price="₡2,200" />
              <DPriceRow name="Bavaria Light" price="₡2,200" />
            </DSub>
            <DSub title="Importadas / Imported">
              <DPriceRow name="Heineken" price="₡2,200" />
              <DPriceRow name="Corona" price="₡2,200" />
              <DPriceRow name="Sol" price="₡2,200" />
            </DSub>
          </section>

          <section className="nm-drinks-section" id="bebidas">
            <DrinksHeader title="Gaseosas & Aguas / Soft Drinks & Water" />
            <DSub title="Agua / Water">
              <DPriceRow name="Agua con gas grande / Large Sparkling Water" price="₡3,500" />
              <DPriceRow name="Agua con gas pequeña / Small Sparkling Water" price="₡2,200" />
              <DPriceRow name="Agua grande / Large Water" price="₡3,500" />
              <DPriceRow name="Agua pequeña / Small Water" price="₡1,500" />
            </DSub>
            <DSub title="Gaseosas / Soft Drinks">
              <DPriceRow name="Coca Cola / Coke" price="₡1,800" />
              <DPriceRow name="Coca Cola Cero / Coke Zero" price="₡1,800" />
              <DPriceRow name="Ginger Ale" price="₡1,800" />
              <DPriceRow name="Fresco" price="₡1,800" />
              <DPriceRow name="Fanta Naranja / Orange Fanta" price="₡1,800" />
              <DPriceRow name="Fanta Uva / Grape Fanta" price="₡1,800" />
              <DPriceRow name="Fanta Kolita / Red Fanta" price="₡1,800" />
              <DPriceRow name="Sprite" price="₡1,800" />
            </DSub>
            <div className="nm-dsub">
              <div className="nm-dsub-title">Batidos de Frutas / Fruit Smoothies</div>
              <p className="nm-batidos-note">Sabores / Flavors: Mango · Mora/Blackberry · Fresa/Strawberry · Banano · Guanábana/Soursop · Maracuyá/Passion Fruit · Piña/Pineapple</p>
              <div className="nm-dprice-grid">
                <DPriceRow name="1 Fruta / 1 Fruit" price="₡1,500" />
                <DPriceRow name="2 Frutas / 2 Fruits" price="₡2,000" />
                <DPriceRow name="Mixto / Mixed" price="₡2,500" />
              </div>
            </div>
            <DSub title="Limonadas / Lemonade">
              <DPriceRow name="Limonada / Lemonade" price="₡1,500" />
              <DPriceRow name="Limonada con Hierba Buena / Lemonade with Mint" price="₡2,000" />
              <DPriceRow name="Limonada con Gengibre / Ginger Lemonade" price="₡2,000" />
            </DSub>
          </section>

        </div>
      )}
    </>
  )
}