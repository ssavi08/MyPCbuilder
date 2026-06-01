-- Run in Supabase SQL editor (table already created via dashboard).
-- id column must be type TEXT (not uuid) so IDs stay readable in AI prompts.
--
-- specs jsonb holds all slot-specific fields plus useCases[]
-- and color (used by the 3D scene for highlight tinting).

insert into components (id, slot, name, brand, price, model_url, specs) values

-- ---- CPUs ----
('cpu-001', 'cpu', 'Intel Core i3-12100', 'Intel', 89, '',
  '{"socket":"LGA1700","cores":4,"threads":8,"baseClockGHz":3.3,"boostClockGHz":4.3,"tdpW":60,"useCases":["school"],"color":"#8b7355"}'::jsonb),

('cpu-002', 'cpu', 'Intel Core i5-13400F', 'Intel', 179, '',
  '{"socket":"LGA1700","cores":10,"threads":16,"baseClockGHz":2.5,"boostClockGHz":4.6,"tdpW":65,"useCases":["school","work"],"color":"#8b7355"}'::jsonb),

('cpu-003', 'cpu', 'AMD Ryzen 5 7600X', 'AMD', 229, '',
  '{"socket":"AM5","cores":6,"threads":12,"baseClockGHz":4.7,"boostClockGHz":5.3,"tdpW":105,"useCases":["work","gaming"],"color":"#cc4400"}'::jsonb),

('cpu-004', 'cpu', 'AMD Ryzen 7 7700X', 'AMD', 299, '',
  '{"socket":"AM5","cores":8,"threads":16,"baseClockGHz":4.5,"boostClockGHz":5.4,"tdpW":105,"useCases":["work","gaming"],"color":"#cc4400"}'::jsonb),

('cpu-005', 'cpu', 'Intel Core i9-13900K', 'Intel', 549, '',
  '{"socket":"LGA1700","cores":24,"threads":32,"baseClockGHz":3.0,"boostClockGHz":5.8,"tdpW":125,"useCases":["gaming"],"color":"#8b7355"}'::jsonb),

-- ---- Motherboards ----
('mb-001', 'motherboard', 'MSI PRO B660M-A', 'MSI', 99, '',
  '{"socket":"LGA1700","chipset":"B660","ramType":"DDR4","ramSlots":4,"formFactor":"mATX","useCases":["school","work"],"color":"#2d5a1b"}'::jsonb),

('mb-002', 'motherboard', 'ASUS ROG STRIX B650-A', 'ASUS', 219, '',
  '{"socket":"AM5","chipset":"B650","ramType":"DDR5","ramSlots":4,"formFactor":"ATX","useCases":["work","gaming"],"color":"#2d5a1b"}'::jsonb),

('mb-003', 'motherboard', 'Gigabyte Z790 AORUS Elite', 'Gigabyte', 299, '',
  '{"socket":"LGA1700","chipset":"Z790","ramType":"DDR5","ramSlots":4,"formFactor":"ATX","useCases":["gaming"],"color":"#2d5a1b"}'::jsonb),

-- ---- RAM ----
('ram-001', 'ram', 'Kingston Fury Beast 16GB DDR4', 'Kingston', 45, '',
  '{"capacityGB":16,"type":"DDR4","speedMHz":3200,"modules":2,"useCases":["school","work"],"color":"#1a3a5c"}'::jsonb),

('ram-002', 'ram', 'Corsair Vengeance 32GB DDR4', 'Corsair', 89, '',
  '{"capacityGB":32,"type":"DDR4","speedMHz":3600,"modules":2,"useCases":["work"],"color":"#1a3a5c"}'::jsonb),

('ram-003', 'ram', 'G.Skill Trident Z5 32GB DDR5', 'G.Skill', 129, '',
  '{"capacityGB":32,"type":"DDR5","speedMHz":6000,"modules":2,"useCases":["work","gaming"],"color":"#1a3a5c"}'::jsonb),

('ram-004', 'ram', 'Corsair Dominator 64GB DDR5', 'Corsair', 249, '',
  '{"capacityGB":64,"type":"DDR5","speedMHz":6200,"modules":2,"useCases":["gaming"],"color":"#1a3a5c"}'::jsonb),

-- ---- GPUs ----
('gpu-001', 'gpu', 'Intel Arc A380', 'Intel', 119, '',
  '{"vramGB":6,"type":"Discrete","tdpW":75,"useCases":["school"],"color":"#1a1a3a"}'::jsonb),

('gpu-002', 'gpu', 'NVIDIA RTX 4060', 'NVIDIA', 299, '',
  '{"vramGB":8,"type":"Discrete","tdpW":115,"useCases":["work","gaming"],"color":"#1a1a3a"}'::jsonb),

('gpu-003', 'gpu', 'AMD RX 7700 XT', 'AMD', 349, '',
  '{"vramGB":12,"type":"Discrete","tdpW":245,"useCases":["gaming"],"color":"#1a1a3a"}'::jsonb),

('gpu-004', 'gpu', 'NVIDIA RTX 4080 Super', 'NVIDIA', 999, '',
  '{"vramGB":16,"type":"Discrete","tdpW":320,"useCases":["gaming"],"color":"#1a1a3a"}'::jsonb),

-- ---- Storage ----
('ssd-001', 'storage', 'Kingston NV2 500GB NVMe', 'Kingston', 39, '',
  '{"capacityGB":500,"type":"NVMe SSD","readMBs":3500,"writeMBs":2100,"useCases":["school"],"color":"#3a1a5c"}'::jsonb),

('ssd-002', 'storage', 'Samsung 980 Pro 1TB NVMe', 'Samsung', 89, '',
  '{"capacityGB":1000,"type":"NVMe SSD","readMBs":7000,"writeMBs":5000,"useCases":["school","work","gaming"],"color":"#3a1a5c"}'::jsonb),

('ssd-003', 'storage', 'WD Black SN850X 2TB NVMe', 'WD', 179, '',
  '{"capacityGB":2000,"type":"NVMe SSD","readMBs":7300,"writeMBs":6600,"useCases":["work","gaming"],"color":"#3a1a5c"}'::jsonb),

-- ---- PSUs ----
('psu-001', 'psu', 'Corsair CV550 550W Bronze', 'Corsair', 55, '',
  '{"wattage":550,"efficiency":"80+ Bronze","modular":false,"useCases":["school"],"color":"#2a2a2a"}'::jsonb),

('psu-002', 'psu', 'Seasonic Focus GX-650 Gold', 'Seasonic', 99, '',
  '{"wattage":650,"efficiency":"80+ Gold","modular":true,"useCases":["school","work"],"color":"#2a2a2a"}'::jsonb),

('psu-003', 'psu', 'be quiet! Straight Power 850W Platinum', 'be quiet!', 149, '',
  '{"wattage":850,"efficiency":"80+ Platinum","modular":true,"useCases":["work","gaming"],"color":"#2a2a2a"}'::jsonb),

('psu-004', 'psu', 'Corsair HX1000 1000W Platinum', 'Corsair', 199, '',
  '{"wattage":1000,"efficiency":"80+ Platinum","modular":true,"useCases":["gaming"],"color":"#2a2a2a"}'::jsonb),

-- ---- Cases ----
('case-001', 'case', 'Fractal Design Core 1000', 'Fractal Design', 49, '',
  '{"formFactor":"mATX","useCases":["school"],"color":"#333333"}'::jsonb),

('case-002', 'case', 'NZXT H510', 'NZXT', 89,
  '/models/case/Case_NZXT_H5_Flow_464x215x424.glb',
  '{"formFactor":"ATX","useCases":["school","work","gaming"],"color":"#333333"}'::jsonb),

('case-003', 'case', 'Lian Li PC-O11 Dynamic', 'Lian Li', 149, '',
  '{"formFactor":"ATX","useCases":["gaming"],"color":"#333333"}'::jsonb);
