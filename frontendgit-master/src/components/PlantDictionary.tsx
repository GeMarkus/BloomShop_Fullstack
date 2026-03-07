// PlantDictionary.tsx

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

/**
 * 🌿 Type Definitions
 * Define the structure for Plant and its Care details for strong typing.
 */
interface PlantCare {
  light: string;
  water: string;
  humidity: string;
  soil: string;
  fertilizer: string;
  repotEvery: string;
  difficulty: string;
}

interface Plant {
  id: number;
  name: string;
  scientificName: string;
  price: number;
  img: string;
  tag: string;
  shortDesc: string;
  origin: string;
  description: string;
  care: PlantCare;
  toxicity: string;
  benefits: string[];
  size: string;
  pests: string[];
  propagation: string;
}

/**
 * 🛠️ Utility Functions
 */
const currency = (n: number): string =>
  n.toLocaleString("th-TH", { style: "currency", currency: "THB" });

/**
 * 🪴 Data Source
 * Note: In a real application, this data would typically be fetched from an API.
 */
const PLANTS_DATA: Plant[] = [
  {
    id: 1,
    name: "Monstera Deliciosa",
    scientificName: "Monstera deliciosa",
    price: 690,
    img: "https://www.harmony-plants.com/cdn/shop/products/5BCD4C1A-3AC6-4651-87A5-4E3B4E534A39.jpg?v=1707750703q=80&w=800&auto=format&fit=crop",
    tag: "ยอดนิยม",
    shortDesc: "ไม้ใบรูปทรงทรอปิคอล ใบมีรู (fenestration) ดูโดดเด่น",
    origin: "เม็กซิโกและอเมริกากลาง",
    description:
      "Monstera Deliciosa เป็นไม้เถาที่นิยมปลูกเป็นไม้ประดับในบ้าน เพราะใบขนาดใหญ่มีรูธรรมชาติที่ให้ลุคทรอปิคอล มีความทนทานและปรับตัวได้ดีในสภาพแสงสว่างปานกลาง",
    care: {
      light: "แสงสว่างปานกลาง — หลีกเลี่ยงแดดจัด",
      water: "รดเมื่อต้นแห้งบนผิวหน้าดิน ประมาณ 7–10 วัน ขึ้นกับสภาพอากาศ",
      humidity: "ชอบความชื้นปานกลางถึงสูง",
      soil: "ดินร่วนผสมปุ๋ยหมัก และปุ๋ยคอก ระบายดี",
      fertilizer: "ปุ๋ยน้ำสูตรสมดุล ทุก 4–6 สัปดาห์ในช่วงฤดูการเติบโต",
      repotEvery: "ทุก 1–2 ปี หรือเมื่อรากแน่น",
      difficulty: "ปานกลาง",
    },
    toxicity: "เป็นพิษต่อสัตว์เลี้ยง (แมว/สุนัข) หากกิน",
    benefits: ["ฟอกอากาศเล็กน้อย", "ให้บรรยากาศทรอปิคอล"],
    size: "สูงได้ถึง 2–3 เมตรในร่ม (ขึ้นกับการตัดแต่ง)",
    pests: ["ไรแมงมุม", "เพลี้ย", "หนอนกินใบ"],
    propagation:
      "ปักชำปลายกิ่งที่มีข้อและรากอากาศ (air roots) ลงในน้ำหรือดิน ช่วยให้ติดง่าย",
  },
  {
    id: 2,
    name: "Fiddle Leaf Fig",
    scientificName: "Ficus lyrata",
    price: 1290,
    img: "https://www.dekorcompany.com/cdn/shop/files/HAL8615.png?v=1746881023q=80&w=800&auto=format&fit=crop",
    tag: "แนะนำ",
    shortDesc: "ใบใหญ่ทรงสวย เหมาะกับมุมสูงของห้องนั่งเล่น",
    origin: "แอฟริกาตะวันตก",
    description:
      "Fiddle Leaf Fig เป็นต้นไม้ที่ได้รับความนิยมสูงในการแต่งบ้านสไตล์มินิมอลและสตูดิโอ เพราะใบรูปคล้ายไวโอลินให้ความรู้สึกหรูหรา ต้องการแสงสว่างสม่ำเสมอและการดูแลที่พอเหมาะ",
    care: {
      light:
        "ชอบแสงสว่างจ้าแบบกรองแสง ต้องวางใกล้หน้าต่างที่ได้แสงสว่างแต่ไม่โดนแดดจ้าโดยตรง",
      water: "รดเมื่อดินด้านบนแห้ง อย่าให้แฉะ",
      humidity: "ชอบความชื้นปานกลาง",
      soil: "ดินระบายน้ำดี ผสมเพอร์ไลต์",
      fertilizer: "ปุ๋ยสูตรสมดุลช่วงฤดูร้อนทุก 4 สัปดาห์",
      repotEvery: "ทุก 1–2 ปี",
      difficulty: "ปานกลาง",
    },
    toxicity: "อาจเป็นพิษต่อสัตว์เลี้ยงหากกิน",
    benefits: ["เป็นของตกแต่งที่โดดเด่น", "ช่วยสร้างโฟกัสให้ห้อง"],
    size: "สามารถสูง 2–3 เมตรในร่มเมื่อโตเต็มที่",
    pests: ["ไรแมงมุม", "เพลี้ย", "ไรขาว"],
    propagation: "ปักชำกิ่งหรือตัดยอดแล้วปักชำในน้ำ/ดิน",
  },
  {
    id: 3,
    name: "Snake Plant",
    scientificName: "Sansevieria (Dracaena) trifasciata",
    price: 390,
    img: "https://shop-static.arborday.org/media/0004367_snake-plant.jpeg?q=80&w=800&auto=format&fit=crop",
    tag: "ราคาดี",
    shortDesc: "แข็งแรง ทนทาน เหมาะสำหรับมือใหม่และมุมที่มีแสงน้อย",
    origin: "แอฟริกาตะวันตก",
    description:
      "Snake Plant เป็นต้นไม้ที่เลี้ยงง่ายมาก ทนแล้งได้ดี เหมาะกับคอนโดหรือห้องที่มีแสงน้อย ใบตั้งตรงและมีลวดลายสวย",
    care: {
      light: "ทนได้ทั้งแสงน้อยและแสงจ้า แต่เติบโตดีที่สุดในแสงสว่างปานกลาง",
      water: "รดน้อย — ปล่อยให้ดินแห้งระหว่างรด",
      humidity: "ไม่ต้องการความชื้นสูง",
      soil: "ดินผสมสำหรับกระบองเพชร/อากาศถ่ายเทดี",
      fertilizer: "เล็กน้อยช่วงฤดูเติบโต",
      repotEvery: "ทุก 2–3 ปี",
      difficulty: "ง่าย",
    },
    toxicity: "มีความเป็นพิษเล็กน้อยต่อสัตว์เลี้ยง",
    benefits: ["ฟอกอากาศได้ดี", "ต้องการการดูแลต่ำ"],
    size: "ขนาดตั้งแต่ 30–120 ซม. ขึ้นกับสายพันธุ์",
    pests: ["ราโคน้ำ", "เพลี้ย"],
    propagation: "แยกหัว (division) หรือปักชำใบในบางสายพันธุ์",
  },
  {
    id: 4,
    name: "ZZ Plant",
    scientificName: "Zamioculcas zamiifolia",
    price: 590,
    img: "https://glasswingshop.com/cdn/shop/products/8D2A2069.jpg?v=1595400475?q=80&w=800&auto=format&fit=crop",
    tag: "ทนทาน",
    shortDesc: "อยู่รอดได้เก่ง เหมาะกับผู้ที่ชอบปล่อยของ",
    origin: "แอฟริกาตะวันออก",
    description:
      "ZZ Plant เป็นไม้ที่เลี้ยงง่ายมาก ทนต่อการขาดแสงและการรดน้ำไม่บ่อย ให้ใบมันวาวสวย เหมาะสำหรับตั้งมุมห้องและสำนักงาน",
    care: {
      light: "แสงสว่างปานกลางถึงแสงน้อย",
      water: "รดเมื่อต้นแห้ง — ทนน้ำท่วมไม่ค่อยได้",
      humidity: "ความชื้นปกติในบ้าน",
      soil: "ดินร่วนระบายน้ำดี",
      fertilizer: "ปุ๋ยอ่อนในช่วงฤดูปลูก",
      repotEvery: "ทุก 2–3 ปี",
      difficulty: "ง่าย",
    },
    toxicity: "พิษต่อสัตว์เลี้ยงหากกิน",
    benefits: ["ต้องดูแลน้อย", "ให้ลุคโมเดิร์น"],
    size: "สูง 40–90 ซม.",
    pests: ["เพลี้ยอ่อน", "ไร"],
    propagation: "แยกเหง้า (division) หรือปักชำกิ่ง",
  },
  {
    id: 5,
    name: "Pothos",
    scientificName: "Epipremnum aureum",
    price: 290,
    img: "https://abeautifulmess.com/wp-content/uploads/2023/06/GoldenPothos-1-1024x1024.jpg?q=80&w=800&auto=format&fit=crop",
    tag: "มือใหม่",
    shortDesc: "เถาเลื้อย ดูแลง่าย ฟอกอากาศได้ดี",
    origin: "หมู่เกาะโซโลมอน",
    description:
      "Pothos หรือ Scindapsus เป็นต้นไม้เลื้อยที่ติดง่าย ปลูกได้ทั้งในน้ำและดิน เหมาะสำหรับแขวนหรือวางบนชั้น ให้ความสดชื่นและช่วยลดสารพิษบางชนิดในอากาศ",
    care: {
      light: "แสงสว่างกรองแสง — ไม่ชอบแดดจัด",
      water: "รดเมื่อผิวหน้าดินแห้ง",
      humidity: "ชอบความชื้นเล็กน้อย",
      soil: "ดินระบายน้ำดี",
      fertilizer: "ปุ๋ยน้ำเดือนละครั้งในฤดูการเติบโต",
      repotEvery: "ทุก 1–2 ปี",
      difficulty: "ง่าย",
    },
    toxicity: "เป็นพิษต่อสัตว์เลี้ยง",
    benefits: ["ฟอกอากาศ", "ปลูกในน้ำได้"],
    size: "เลื้อยยาวได้หลายเมตรถ้าให้พื้นที่",
    pests: ["ไรแมงมุม", "เพลี้ย"],
    propagation: "ปักชำปลายกิ่งในน้ำ — ง่ายและเร็ว",
  },
  {
    id: 6,
    name: "Peace Lily",
    scientificName: "Spathiphyllum spp.",
    price: 450,
    img: "https://radhakrishnaagriculture.in/cdn/shop/files/peacelily.jpg?v=1709184309?q=80&w=800&auto=format&fit=crop",
    tag: "ออกดอก",
    shortDesc: "ดอกสีขาวบริสุทธิ์ ให้บรรยากาศสงบ",
    origin: "อเมริกากลางและใต้",
    description:
      "Peace Lily เป็นไม้ที่ออกดอกสวยในร่ม ดอกสีขาว (spathes) ตัดกับใบสีเขียวเข้ม ช่วยฟอกอากาศแต่ควรระวังว่ามีพิษหากกิน",
    care: {
      light: "แสงที่กรองแล้ว — แสงจ้าแต่หลบแดดตรง",
      water: "ชอบดินชื้นแต่ไม่ขังน้ำ — รดสม่ำเสมอ",
      humidity: "ต้องการความชื้นปานกลางถึงสูง",
      soil: "ดินร่วนที่เก็บความชื้นได้ดี",
      fertilizer: "ปุ๋ยเหลวทุก 6–8 สัปดาห์",
      repotEvery: "ทุก 1–2 ปี",
      difficulty: "ปานกลาง",
    },
    toxicity: "พิษต่อสัตว์เลี้ยงและเด็กหากเคี้ยวกิน",
    benefits: ["ฟอกอากาศได้ดี", "ออกดอกสวยในบ้าน"],
    size: "สูง 30–60 ซม.",
    pests: ["ไร", "เพลี้ย"],
    propagation: "แยกกอ (division) ขณะที่ repot",
  },
  {
    id: 7,
    name: "Calathea",
    scientificName: "Calathea spp.",
    price: 520,
    img: "https://cdn.shopify.com/s/files/1/0550/4771/6948/files/Spring_Starter_Pack_Flowers_Instagram_Post_Instagram_Post_7__mMLFt9674J.jpg?v=1743786856?q=80&w=800&auto=format&fit=crop",
    tag: "ลายสวย",
    shortDesc: "ใบมีลวดลายสวย เปิด-ปิดตามจังหวะกลางวัน-กลางคืน",
    origin: "อเมริกาใต้",
    description:
      "Calathea เป็นไม้ใบที่ได้รับความนิยมเพราะมีลวดลายหน้าต่างต่างกันหลายชนิด ต้องการความชื้นและการดูแลมากกว่าพืชทั่วไป แต่ให้ผลลัพธ์ที่สวยงาม",
    care: {
      light: "แสงกรอง — หลีกเลี่ยงแดดจัด",
      water: "ชอบความชื้นสม่ำเสมอ แต่ไม่ขังน้ำ",
      humidity: "สูง — ควรใช้เครื่องเพิ่มความชื้นหรือฉีดพ่นบ่อย",
      soil: "ดินร่วนระบายน้ำปานกลาง",
      fertilizer: "ปุ๋ยอ่อนในฤดูเติบโต",
      repotEvery: "ทุก 1–2 ปี",
      difficulty: "ปานกลาง",
    },
    toxicity: "ไม่เป็นพิษมาก แต่ควรหลีกเลี่ยงการกิน",
    benefits: ["ความสวยงาม", "การเคลื่อนไหวของใบน่าสนใจ"],
    size: "สูง 30–90 ซม.",
    pests: ["ไร", "เพลี้ย"],
    propagation: "แยกกอขณะ repot เป็นวิธีที่ดีที่สุด",
  },
  {
    id: 8,
    name: "Aloe Vera",
    scientificName: "Aloe vera",
    price: 240,
    img: "https://m.media-amazon.com/images/I/41HjuO7VwjL._UF1000,1000_QL80_.jpg?q=80&w=800&auto=format&fit=crop",
    tag: "ดูแลง่าย",
    shortDesc: "กุหลาบทะเลทรายที่มีวุ้นในใบ ใช้ประโยชน์ได้",
    origin: "คาบสมุทรอาระเบีย",
    description:
      "Aloe Vera เป็นพืชอวบน้ำที่แข็งแรง มีวุ้นในใบที่ใช้บำรุงผิวและรักษาบาดแผลเล็กน้อย เป็นตัวเลือกที่ดีสำหรับผู้ที่ต้องการต้นไม้ที่มีประโยชน์และเลี้ยงง่าย",
    care: {
      light: "ชอบแสงจ้า — เหมาะวางกลางแจ้งหรือริมหน้าต่าง",
      water: "รดน้อย — ปล่อยให้ดินแห้งก่อนรด",
      humidity: "ชอบสภาพแห้ง",
      soil: "ดินทราย/ดินสำหรับกระบองเพชร",
      fertilizer: "ปุ๋ยเจือจางช่วงฤดูปลูก",
      repotEvery: "ทุก 2–3 ปี",
      difficulty: "ง่าย",
    },
    toxicity: "บางสายพันธุ์มีพิษหากกิน",
    benefits: ["วุ้นช่วยรักษาแผลผิวหนัง", "ต้องดูแลน้อย"],
    size: "สูง 20–60 ซม.",
    pests: ["แมลงหวี่ขาว", "ไร"],
    propagation: "แยกหน่อ (pups) เพื่อปลูกต่อ",
  },
  {
    id: 9,
    name: "Philodendron Birkin",
    scientificName: "Philodendron Birkin",
    price: 650,
    img: "https://www.moffatts.co.nz/cdn/shop/products/Birkin-whitepot.png?v=1659558097?q=80&w=800&auto=format&fit=crop",
    tag: "ดูหรูหรา",
    shortDesc: "ใบมีลายขาวครีม เปรียบเสมือนงานดีไซน์ในกระถาง",
    origin: "ลูกผสมจากอเมริกาใต้",
    description:
      "Philodendron Birkin มีลายเส้นสีขาวครีมบนใบสีเขียวเข้ม ให้ความรู้สึกหรูหราเป็นไม้ประดับภายในบ้านที่นิยม",
    care: {
      light: "แสงกรองสว่าง",
      water: "รดเมื่อดินชั้นบนแห้ง",
      humidity: "ชอบความชื้นเล็กน้อย",
      soil: "ดินร่วนผสมปุ๋ยหมัก",
      fertilizer: "ปุ๋ยเหลวทุกเดือนในฤดูการเติบโต",
      repotEvery: "ทุก 1–2 ปี",
      difficulty: "ปานกลาง",
    },
    toxicity: "เป็นพิษต่อสัตว์เลี้ยงหากกิน",
    benefits: ["รูปลักษณ์พรีเมียม", "เทรนด์การแต่งบ้าน"],
    size: "สูง 30–60 ซม.",
    pests: ["ไร", "เพลี้ย"],
    propagation: "ปักชำกิ่งหรือแยกต้นเมื่อ repot",
  },
  {
    id: 10,
    name: "Areca Palm",
    scientificName: "Dypsis lutescens",
    price: 1200,
    img: "https://potsforplants.ph/cdn/shop/products/areca-palm-palmera-849528_1200x1200.jpg?v=1697027415?q=80&w=800&auto=format&fit=crop",
    tag: "ช่วยฟอกอากาศ",
    shortDesc: "ต้นปาล์มขนาดกลาง ให้บรรยากาศรีสอร์ตในบ้าน",
    origin: "มาดากัสการ์",
    description:
      "Areca Palm เป็นไม้ที่ให้บรรยากาศโปร่งสบาย ช่วยเพิ่มความชื้นและฟอกอากาศ เหมาะกับมุมห้องที่ต้องการความรู้สึกเป็นธรรมชาติ",
    care: {
      light: "ชอบแสงสว่างกรอง",
      water: "รดสม่ำเสมอ แต่ไม่ขังน้ำ",
      humidity: "ชอบความชื้นสูง",
      soil: "ดินร่วนที่ระบายได้ดี",
      fertilizer: "ปุ๋ยเม็ด/เหลวในฤดูการเติบโต",
      repotEvery: "ทุก 2 ปี",
      difficulty: "ปานกลาง",
    },
    toxicity: "ปลอดภัยกับสัตว์เลี้ยง (โดยทั่วไป)",
    benefits: ["ฟอกอากาศ", "เพิ่มความชื้นในห้อง"],
    size: "สูง 1–3 เมตร ขึ้นกับการดูแล",
    pests: ["ไร", "แมลงหวี่ขาว"],
    propagation: "แยกกอเมื่อต้นโตเต็มที่",
  },
  {
    id: 11,
    name: "Rubber Plant",
    scientificName: "Ficus elastica",
    price: 850,
    img: "https://shop-static.arborday.org/media/0004362_tineke-variegated-rubber-tree_510.jpeg?q=80&w=800&auto=format&fit=crop",
    tag: "สวยทน",
    shortDesc: "ใบเงางาม แข็งแรง ดูแลไม่ยาก",
    origin: "เอเชียตะวันออกเฉียงใต้",
    description:
      "Rubber Plant มีใบหนาเป็นมันวาว ให้ลุคโมเดิร์นและทนทาน เหมาะกับมุมที่ต้องการต้นใหญ่เป็นจุดเด่น",
    care: {
      light: "ชอบแสงสว่างปานกลางถึงจ้า",
      water: "รดเมื่อดินชั้นบนแห้ง",
      humidity: "ชอบความชื้นปานกลาง",
      soil: "ดินร่วนระบายน้ำดี",
      fertilizer: "ปุ๋ยเดือนละครั้งในฤดูการเติบโต",
      repotEvery: "ทุก 2 ปี",
      difficulty: "ปานกลาง",
    },
    toxicity: "มีน้ำยางที่สามารถระคายเคืองผิวหนังและเป็นพิษหากกิน",
    benefits: ["ใบทำความสะอาดอากาศ", "ทนทานต่อสภาพแวดล้อม"],
    size: "สูง 1–3 เมตรในร่ม",
    pests: ["ไร", "เพลี้ย"],
    propagation: "ปักชำยอดหรือแยกกอ",
  },
  {
    id: 12,
    name: "Boston Fern",
    scientificName: "Nephrolepis exaltata",
    price: 390,
    img: "https://www.thejunglecollective.com.au/wp-content/uploads/2020/03/1829.-Boston-Fern-_.__e.m.i.l.y_.__.png?q=80&w=800&auto=format&fit=crop",
    tag: "เพิ่มความชื้น",
    shortDesc: "พุ่มใบฟู เติมความสดใสในมุมเงียบ",
    origin: "อเมริกาเขตร้อน",
    description:
      "Boston Fern เป็นเฟิร์นที่ใบฟูสวย เหมาะกับการแขวนหรือวางบนชั้น ต้องการความชื้นและการดูแลระดับปานกลาง",
    care: {
      light: "แสงกรอง—ไม่ชอบแดดจ้า",
      water: "ชอบดินชื้น ต้องรดสม่ำเสมอ",
      humidity: "สูง—ควรฉีดพ่นหรือตั้งบนถาดน้ำ",
      soil: "ดินร่วนผสมที่เก็บความชื้นได้",
      fertilizer: "ปุ๋ยอ่อนทุกเดือนในฤดูปลูก",
      repotEvery: "ทุก 1–2 ปี",
      difficulty: "ปานกลาง",
    },
    toxicity: "ไม่เป็นพิษแต่ควรหลีกเลี่ยงการกิน",
    benefits: ["เพิ่มความชื้น", "ลุคธรรมชาติในบ้าน"],
    size: "พุ่มกว้าง 30–100 ซม.",
    pests: ["ไร", "หนอน"],
    propagation: "แยกกอหรือปักชำส่วนของกอ",
  },
  // เพิ่มต่อจากรายการที่ 12 ใน PLANTS_DATA

  {
    id: 13,
    name: "String of Pearls",
    scientificName: "Senecio rowleyanus",
    price: 420,
    img: "https://tse3.mm.bing.net/th/id/OIP.oXfOAD5kSM-QYmZh2dF0zQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    tag: "มินิมอล",
    shortDesc: "ใบกลมเหมือนเม็ดไข่มุก เลื้อยระย้าสวยงาม",
    origin: "แอฟริกาใต้",
    description: "ไม้อวบน้ำที่มีรูปทรงโดดเด่น ใบมีลักษณะเป็นกลมเล็กๆ คล้ายสร้อยไข่มุก นิยมปลูกในกระถางแขวนเพื่อให้เถาเลื้อยลงมาด้านล่าง",
    care: {
      light: "แสงสว่างจ้าแต่ไม่โดนแดดตรง (Indirect bright light)",
      water: "รดน้ำน้อย ปล่อยให้ดินแห้งสนิทก่อนรดใหม่",
      humidity: "ความชื้นต่ำถึงปานกลาง",
      soil: "ดินระบายน้ำดีมาก (ดินกระบองเพชร)",
      fertilizer: "ปุ๋ยละลายช้าสูตรอ่อนปีละ 1-2 ครั้ง",
      repotEvery: "2-3 ปี",
      difficulty: "ยาก (เซนซิทีฟเรื่องการให้น้ำ)",
    },
    toxicity: "เป็นพิษต่อมนุษย์และสัตว์เลี้ยงหากกินเข้าไป",
    benefits: ["ตกแต่งบ้านสไตล์มินิมอล", "ประหยัดพื้นที่"],
    size: "เถายาวได้ถึง 60-90 ซม.",
    pests: ["เพลี้ยแป้ง", "รากเน่า"],
    propagation: "ปักชำกิ่งที่มีใบกลมๆ วางบนดิน",
  },
  {
    id: 14,
    name: "Money Tree",
    scientificName: "Pachira aquatica",
    price: 990,
    img: "https://interiorplants.ca/wp-content/uploads/2024/09/money-tree-in-deco-white-6inch-1.jpg",
    tag: "เสริมโชคลาภ",
    shortDesc: "ต้นศุภโชค ลำต้นถักเปียสวยงาม ความหมายดี",
    origin: "อเมริกากลางและใต้",
    description: "นิยมนำมาถักลำต้นเป็นเกลียว เชื่อกันว่าจะช่วยกักเก็บเงินทอง เป็นต้นไม้ที่แข็งแรงและปรับตัวเข้ากับสภาพในอาคารได้ดีมาก",
    care: {
      light: "แสงสว่างปานกลางถึงแสงจ้ากรองแสง",
      water: "รดน้ำเมื่อหน้าดินแห้ง หลีกเลี่ยงน้ำขังในจานรอง",
      humidity: "ชอบความชื้นสูงเล็กน้อย",
      soil: "ดินร่วนระบายน้ำดี",
      fertilizer: "ปุ๋ยสูตรสมดุลเดือนละครั้งในฤดูร้อน",
      repotEvery: "2-3 ปี",
      difficulty: "ง่าย",
    },
    toxicity: "ปลอดภัยต่อสัตว์เลี้ยง (Non-toxic)",
    benefits: ["เสริมฮวงจุ้ย", "ช่วยฟอกอากาศ"],
    size: "สูงได้ถึง 1-2 เมตรในอาคาร",
    pests: ["เพลี้ยอ่อน", "ไรแมงมุม"],
    propagation: "ปักชำกิ่งหรือเพาะเมล็ด",
  },
  {
    id: 15,
    name: "Jade Plant",
    scientificName: "Crassula ovata",
    price: 320,
    img: "https://theplants.com.my/wp-content/uploads/2025/05/Jade_Plant_SKU00028_01.jpg",
    tag: "ไม้อวบน้ำ",
    shortDesc: "ต้นไม้สวรรค์ ใบหนาสีเขียวเข้มขอบแดง",
    origin: "แอฟริกาใต้",
    description: "ไม้อวบน้ำที่อายุยืนยาว มีลักษณะคล้ายต้นไม้จำลอง (Bonsai) ใบมีความวาวเหมือนหยก เชื่อว่าเป็นต้นไม้นำโชค",
    care: {
      light: "แสงแดดจัดหรือแสงจ้าตลอดวัน",
      water: "รดน้ำเมื่อดินแห้งสนิท (ทนแล้งได้ดีมาก)",
      humidity: "ความชื้นต่ำ",
      soil: "ดินผสมทรายหรือดินกระบองเพชร",
      fertilizer: "ปุ๋ยอ่อนๆ ทุก 2 เดือน",
      repotEvery: "3-4 ปี",
      difficulty: "ง่ายมาก",
    },
    toxicity: "เป็นพิษต่อสัตว์เลี้ยง",
    benefits: ["เสริมโชคด้านการเงิน", "ดูแลง่ายมาก"],
    size: "เติบโตช้า แต่สูงได้ถึง 60-90 ซม.",
    pests: ["เพลี้ยแป้ง"],
    propagation: "ปักชำใบหรือกิ่ง",
  },
  {
    id: 16,
    name: "Bird of Paradise",
    scientificName: "Strelitzia reginae",
    price: 1500,
    img: "https://permaflora.co.th/wp-content/uploads/2026/02/IMG_2515-1-1.jpg",
    tag: "ต้นใหญ่",
    shortDesc: "ใบใหญ่สง่างาม ให้ลุคหรูหราเหมือนโรงแรม",
    origin: "แอฟริกาใต้",
    description: "ต้นไม้ขนาดใหญ่ที่ให้ความรู้สึกกึ่งป่าฝน ลำต้นตรง ใบมีขนาดใหญ่คล้ายใบกล้วยแต่หนาและทนทานกว่ามาก",
    care: {
      light: "แสงจ้าหรือแดดส่องถึงโดยตรง",
      water: "รดน้ำสม่ำเสมอให้ดินชื้นแต่ไม่แฉะ",
      humidity: "ความชื้นสูง",
      soil: "ดินร่วนผสมอินทรียวัตถุระบายน้ำดี",
      fertilizer: "ปุ๋ยสูตรเสมอทุกเดือน",
      repotEvery: "2-3 ปี (ชอบให้รากแน่นเล็กน้อย)",
      difficulty: "ปานกลาง",
    },
    toxicity: "เป็นพิษเล็กน้อยหากกินเข้าไป",
    benefits: ["สร้างความโดดเด่นให้ห้อง", "ฟอกอากาศ"],
    size: "สูงได้ถึง 1.5 - 2 เมตร",
    pests: ["เพลี้ยแป้ง", "ไรแมงมุม"],
    propagation: "แยกกอ",
  },
  {
    id: 17,
    name: "Spider Plant",
    scientificName: "Chlorophytum comosum",
    price: 280,
    img: "https://m.media-amazon.com/images/I/61bfaK6hWpL._AC_UF1000,1000_QL80_.jpg",
    tag: "เลี้ยงง่ายมาก",
    shortDesc: "เศรษฐีเรือนใน ใบเรียวยาว มีต้นลูกห้อยระย้า",
    origin: "แอฟริกาใต้",
    description: "ต้นไม้ฟอกอากาศยอดนิยมที่ตายยากที่สุดชนิดหนึ่ง มีจุดเด่นที่การแตก 'Spiderettes' หรือต้นเล็กๆ ห้อยลงมา",
    care: {
      light: "แสงสว่างปานกลาง (ทนแสงน้อยได้)",
      water: "รดน้ำเมื่อดินแห้ง 50%",
      humidity: "ความชื้นปกติ",
      soil: "ดินร่วนทั่วไป",
      fertilizer: "ปุ๋ยสูตรเสมอเดือนละครั้งช่วงฤดูร้อน",
      repotEvery: "ทุกปี (รากโตเร็วมาก)",
      difficulty: "ง่ายมาก",
    },
    toxicity: "ปลอดภัยต่อแมวและสุนัข",
    benefits: ["ฟอกอากาศดีเยี่ยม", "ขยายพันธุ์ง่าย"],
    size: "กว้างและยาวประมาณ 30-60 ซม.",
    pests: ["ปลายใบไหม้ (จากคลอรีนในน้ำ)"],
    propagation: "ตัดต้นอ่อน (Runner) ไปแช่น้ำหรือลงดิน",
  },
  {
    id: 18,
    name: "English Ivy",
    scientificName: "Hedera helix",
    price: 350,
    img: "https://nainitalsucculents.com/wp-content/uploads/2025/03/image__G0-768x768-Photoroom-4.jpg",
    tag: "ไม้เลื้อย",
    shortDesc: "เถาไอวี่คลาสสิก เลื้อยคลุมดินหรือแขวนผนัง",
    origin: "ยุโรปและเอเชียตะวันตก",
    description: "ไม้เลื้อยที่มีความสวยงามสไตล์ยุโรป สามารถนำมาพันรอบโครงเหล็กหรือปล่อยให้เลื้อยลงจากชั้นวางของ",
    care: {
      light: "แสงสว่างจ้าแต่ไม่ร้อนจัด (ชอบที่เย็น)",
      water: "ชอบดินชื้นแต่ไม่แฉะ ฉีดพ่นละอองน้ำบ่อยๆ",
      humidity: "ความชื้นสูง",
      soil: "ดินร่วนระบายน้ำได้ดีเยี่ยม",
      fertilizer: "ปุ๋ยไนโตรเจนสูงเดือนละครั้ง",
      repotEvery: "1-2 ปี",
      difficulty: "ปานกลาง (ไม่ชอบอากาศร้อนจัด)",
    },
    toxicity: "เป็นพิษต่อคนและสัตว์เลี้ยง",
    benefits: ["ลดเชื้อราในอากาศ", "ใช้ตกแต่งกำแพง"],
    size: "เลื้อยยาวได้หลายเมตรหากไม่ตัดแต่ง",
    pests: ["ไรแมงมุม", "เพลี้ย"],
    propagation: "ปักชำกิ่งในน้ำ",
  },
  {
    id: 19,
    name: "Aglaonema",
    scientificName: "Aglaonema 'Red Joy'",
    price: 580,
    img: "https://plantnpot.com/cdn/shop/files/Aglaonema_Red_Joy_Kuwait.jpg?v=1757946047",
    tag: "ใบสีเงิน",
    shortDesc: "แก้วกาญจนา ทนทาน ใบมีสีสันหลากหลาย",
    origin: "เอเชียตะวันออกเฉียงใต้",
    description: "ราชาแห่งไม้ประดับ เป็นพืชที่อึดและทนต่อแสงน้อยได้ดีเยี่ยม มีสายพันธุ์ที่มีสีแดง ชมพู และเงินที่สวยงาม",
    care: {
      light: "แสงน้อยถึงแสงสว่างปานกลาง (ห้ามโดนแดดตรง)",
      water: "รดน้ำเมื่อดินแห้งครึ่งหนึ่ง",
      humidity: "ความชื้นต่ำถึงสูง (ปรับตัวเก่ง)",
      soil: "ดินร่วนระบายน้ำดี",
      fertilizer: "ปุ๋ยละลายช้าทุก 3-6 เดือน",
      repotEvery: "2-3 ปี",
      difficulty: "ง่ายมาก",
    },
    toxicity: "เป็นพิษหากกินเข้าไป",
    benefits: ["ฟอกอากาศ", "ทนทานต่อแสงน้อย"],
    size: "สูง 30-60 ซม.",
    pests: ["เพลี้ยแป้ง", "ไร"],
    propagation: "แยกกอหรือปักชำยอด",
  },
  {
    id: 20,
    name: "Lavender",
    scientificName: "Lavandula angustifolia",
    price: 490,
    img: "https://fitodesign.ee/wp-content/uploads/20240812_171641-scaled.jpg",
    tag: "มีกลิ่นหอม",
    shortDesc: "ดอกสีม่วง กลิ่นหอมผ่อนคลาย",
    origin: "แถบเมดิเตอร์เรเนียน",
    description: "พืชสมุนไพรที่มีดอกสวยงามและกลิ่นหอมที่เป็นเอกลักษณ์ ช่วยสร้างความผ่อนคลายและลดความเครียด",
    care: {
      light: "แดดจัดเต็มวัน (Full sun)",
      water: "รดน้ำเมื่อดินแห้ง ไม่ชอบดินแฉะ",
      humidity: "ความชื้นต่ำ (ชอบอากาศถ่ายเทดี)",
      soil: "ดินร่วนปนทราย เป็นด่างเล็กน้อย",
      fertilizer: "ไม่ต้องการปุ๋ยมาก ให้ธาตุอาหารอ่อนช่วงต้นฤดู",
      repotEvery: "1-2 ปี",
      difficulty: "ยาก (ในสภาพอากาศร้อนชื้น)",
    },
    toxicity: "เป็นพิษเล็กน้อยต่อสัตว์เลี้ยงหากกินปริมาณมาก",
    benefits: ["กลิ่นหอมช่วยการนอนหลับ", "ไล่ยุงบางชนิด"],
    size: "พุ่มสูง 30-60 ซม.",
    pests: ["รากเน่า (ถ้าชื้นเกินไป)"],
    propagation: "ปักชำกิ่งกึ่งแก่กึ่งอ่อน",
  }
];


/**
 * 🪴 Plant Card Component
 */
const PlantCard: React.FC<{
  plant: Plant;
  onOpenModal: (id: number) => void;
}> = ({ plant, onOpenModal }) => {
  const handleClick = (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
  ) => {
    e.preventDefault();
    onOpenModal(plant.id);
  };

  return (
    <article
      className="border rounded-xl overflow-hidden shadow-sm bg-white cursor-pointer 
                 transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg
                 dark:bg-gray-800 dark:border-gray-700" // Added dark mode classes
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleClick(e);
      }}
    >
      <div className="h-40 w-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
        <img
          src={plant.img}
          alt={plant.name}
          className="object-cover h-full w-full"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium dark:text-gray-100">{plant.name}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {plant.scientificName || ""}
            </p>
          </div>
          <span className="text-sm px-2 py-1 rounded-md bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            {plant.tag}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{plant.shortDesc}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-semibold dark:text-gray-100">{currency(plant.price)}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(plant.id);
            }}
            className="text-sm bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            aria-label={`ดูรายละเอียด ${plant.name}`}
          >
            รายละเอียด
          </button>
        </div>
      </div>
    </article>
  );
};

// --- Animation CSS Helper Class Definitions ---
const MODAL_TRANSITION_STYLES = `
.modal-transition-container {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 300ms ease-out, transform 300ms ease-out;
}
.modal-open .modal-transition-container {
  opacity: 1;
  transform: scale(1);
}
.modal-overlay-transition {
  opacity: 0;
  transition: opacity 300ms ease-out;
}
.modal-open .modal-overlay-transition {
  opacity: 1;
}
`;

let styleInjected = false;
const injectModalStyles = () => {
  if (typeof document !== "undefined" && !styleInjected) {
    const style = document.createElement("style");
    style.textContent = MODAL_TRANSITION_STYLES;
    document.head.appendChild(style);
    styleInjected = true;
  }
};
injectModalStyles();

/**
 * 💻 Modal Component (Portalled)
 */
const PlantModal: React.FC<{
  selectedPlant: Plant | null;
  onClose: () => void;
  isModalOpen: boolean;
}> = ({ selectedPlant, onClose, isModalOpen }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false); 
  const duration = 300;

  useEffect(() => {
    if (isModalOpen) {
      setShouldRender(true);
    } else if (shouldRender) {
      const timeoutId = setTimeout(() => {
        setShouldRender(false);
      }, duration);
      return () => clearTimeout(timeoutId);
    }
  }, [isModalOpen, shouldRender]);

  if (!shouldRender || !selectedPlant) return null;

  const modalWrapperClass = `fixed inset-0 z-50 flex items-center justify-center p-4 ${
    isModalOpen ? "modal-open" : ""
  }`;

  const modalContent = (
    <div id="plant-modal" className={modalWrapperClass}>
      <div
        id="modal-overlay"
        className="absolute inset-0 bg-black/40 dark:bg-black/70 modal-overlay-transition"
        aria-hidden
        onClick={onClose}
      ></div>

      <div
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto modal-transition-container dark:border dark:border-gray-700"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex justify-between items-start p-6 border-b dark:border-gray-700 sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur z-10">
          <div>
            <h3 id="modal-title" className="text-2xl font-semibold dark:text-gray-100">
              {selectedPlant.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <span id="modal-scientific">
                {selectedPlant.scientificName || "N/A"}
              </span>{" "}
              •<span id="modal-origin">{selectedPlant.origin || "N/A"}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">ราคา</div>
              <div id="modal-price" className="font-semibold dark:text-gray-100">
                {currency(selectedPlant.price)}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors duration-200"
              aria-label="ปิดหน้าต่าง"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <img
              id="modal-img"
              src={selectedPlant.img}
              alt={selectedPlant.name}
              onClick={() => setIsImageZoomed(true)}
              className="w-full rounded-lg object-contain h-64 bg-gray-50 dark:bg-gray-900 
                        cursor-zoom-in transition-transform duration-300 hover:scale-105"
            />

            <div className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <strong className="dark:text-gray-100">Tag:</strong>{" "}
                <span id="modal-tag">{selectedPlant.tag}</span>
              </div>
              <div>
                <strong className="dark:text-gray-100">ขนาด:</strong>{" "}
                <span id="modal-size">{selectedPlant.size || "N/A"}</span>
              </div>
              <div>
                <strong className="dark:text-gray-100">พิษ:</strong>{" "}
                <span id="modal-toxicity">
                  {selectedPlant.toxicity || "N/A"}
                </span>
              </div>
              <div>
                <strong className="dark:text-gray-100">การขยายพันธุ์:</strong>{" "}
                <span id="modal-propagation">
                  {selectedPlant.propagation || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <section className="mb-4">
              <h4 className="text-lg font-medium dark:text-gray-100">คำอธิบาย</h4>
              <p id="modal-desc" className="text-gray-700 dark:text-gray-300 mt-2">
                {selectedPlant.description || "N/A"}
              </p>
            </section>

            <section className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border dark:border-gray-700 rounded-lg">
                <h5 className="font-medium dark:text-gray-100 underline decoration-green-500/30">การดูแล (Care)</h5>
                <ul id="modal-care-list" className="mt-2 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li><strong className="dark:text-gray-100">แสง:</strong> {selectedPlant.care?.light}</li>
                  <li><strong className="dark:text-gray-100">การรดน้ำ:</strong> {selectedPlant.care?.water}</li>
                  <li><strong className="dark:text-gray-100">ความชื้น:</strong> {selectedPlant.care?.humidity}</li>
                  <li><strong className="dark:text-gray-100">ดินที่แนะนำ:</strong> {selectedPlant.care?.soil}</li>
                  <li><strong className="dark:text-gray-100">ปุ๋ย:</strong> {selectedPlant.care?.fertilizer}</li>
                  <li><strong className="dark:text-gray-100">ระดับความยาก:</strong> {selectedPlant.care?.difficulty}</li>
                </ul>
              </div>

              <div className="p-4 border dark:border-gray-700 rounded-lg">
                <h5 className="font-medium dark:text-gray-100 underline decoration-blue-500/30">ประโยชน์ & ศักยภาพ</h5>
                <ul id="modal-benefits-list" className="mt-2 text-sm text-gray-700 dark:text-gray-300 list-disc list-inside space-y-1">
                  {selectedPlant.benefits?.map((b, index) => <li key={index}>{b}</li>)}
                </ul>

                <div className="mt-3">
                  <strong className="dark:text-gray-100">ปัญหาที่พบบ่อย:</strong>
                  <ul id="modal-pests-list" className="mt-1 text-sm list-disc list-inside dark:text-gray-300">
                    {selectedPlant.pests?.map((p, index) => <li key={index}>{p}</li>)}
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-6">
              <h5 className="font-medium dark:text-gray-100">คำแนะนำเพิ่มเติม</h5>
              <ul className="mt-2 text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <li>• ตรวจใบสม่ำเสมอ ถ้าใบเหลืองอาจเกิดจากการรดน้ำมากหรือน้อยเกินไป</li>
                <li>• หลีกเลี่ยงการเปลี่ยนตำแหน่งบ่อยเกินไป เพราะต้นอาจเครียด</li>
                <li>• หากมีสัตว์เลี้ยง ควรวางต้นให้พ้นมือแมว/สุนัข</li>
              </ul>
            </section>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md border dark:border-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ IMAGE ZOOM OVERLAY ใส่ตรงนี้ */}
      {isImageZoomed && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center 
                     bg-black/80 backdrop-blur-sm"
          onClick={() => setIsImageZoomed(false)}
        >
          <div
            className="relative max-w-5xl w-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsImageZoomed(false)}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              ✕
            </button>

            <img
              src={selectedPlant.img}
              alt={selectedPlant.name}
              className="w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}

    </div>
  );

  return createPortal(modalContent, document.body);
};

/**
 * 🪴 Main Dictionary Component
 */
const PlantDictionary: React.FC = () => {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ANIMATION_DURATION = 300;

  const openModal = useCallback((plantId: number) => {
    const plant = PLANTS_DATA.find((p) => p.id === plantId);
    if (!plant) return;
    setSelectedPlant(plant);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedPlant(null);
    }, ANIMATION_DURATION);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedPlant && isModalOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedPlant, isModalOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) closeModal();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isModalOpen, closeModal]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="content-wrapper p-6 text-gray-800 dark:text-gray-100">
        <a
          href="/"
          className="link-back-home mb-4 inline-block px-4 py-2 bg-gray-200 dark:bg-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          ◀ กลับหน้าแรก
        </a>

        <h1 className="text-3xl font-semibold mb-4 dark:text-gray-100">Plant Dictionary 🌿</h1>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          คลิกการ์ดเพื่อดูรายละเอียดเต็ม — รองรับ Dark Mode
        </p>

        <div
          id="plant-grid"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {PLANTS_DATA.map((plant) => (
            <PlantCard key={plant.id} plant={plant} onOpenModal={openModal} />
          ))}
        </div>

        <PlantModal
          selectedPlant={selectedPlant}
          onClose={closeModal}
          isModalOpen={isModalOpen}
        />
      </div>
    </div>
  );
};

export default PlantDictionary;