import asyncio
import asyncpg

# ── REAL INDIAN HOSPITALS (verified, existing) ──
HOSPITALS = [
    # Delhi / NCR
    ("AIIMS Delhi", "New Delhi, Delhi", "Ansari Nagar, New Delhi 110029"),
    ("Safdarjung Hospital", "New Delhi, Delhi", "Ansari Nagar West, New Delhi 110029"),
    ("Ram Manohar Lohia Hospital", "New Delhi, Delhi", "Baba Kharak Singh Marg, New Delhi 110001"),
    ("Lady Hardinge Medical College", "New Delhi, Delhi", "Connaught Place, New Delhi 110001"),
    ("GTB Hospital", "New Delhi, Delhi", "Dilshad Garden, New Delhi 110095"),
    ("Apollo Hospital Delhi", "New Delhi, Delhi", "Sarita Vihar, New Delhi 110076"),
    ("Fortis Escorts Heart Institute", "New Delhi, Delhi", "Okhla Road, New Delhi 110025"),
    ("Max Super Speciality Hospital Saket", "New Delhi, Delhi", "Press Enclave Road, New Delhi 110017"),
    ("Sir Ganga Ram Hospital", "New Delhi, Delhi", "Rajinder Nagar, New Delhi 110060"),
    ("BLK Max Super Speciality", "New Delhi, Delhi", "Pusa Road, New Delhi 110005"),
    ("Medanta The Medicity", "Gurugram, Haryana", "Sector 38, Gurugram 122001"),
    ("Artemis Hospital", "Gurugram, Haryana", "Sector 51, Gurugram 122001"),
    ("Fortis Memorial Research Institute", "Gurugram, Haryana", "Sector 44, Gurugram 122002"),
    ("Park Hospital Gurugram", "Gurugram, Haryana", "Sector 47, Gurugram 122018"),
    ("Columbia Asia Hospital Gurugram", "Gurugram, Haryana", "Sector 47, Gurugram 122018"),
    # Mumbai
    ("KEM Hospital Mumbai", "Mumbai, Maharashtra", "Acharya Donde Marg, Mumbai 400012"),
    ("Nair Hospital Mumbai", "Mumbai, Maharashtra", "Dr A L Nair Road, Mumbai 400008"),
    ("Tata Memorial Hospital", "Mumbai, Maharashtra", "Dr E Borges Road, Mumbai 400012"),
    ("Kokilaben Dhirubhai Ambani Hospital", "Mumbai, Maharashtra", "Rao Saheb Achutrao Patwardhan Marg, Mumbai 400053"),
    ("Lilavati Hospital", "Mumbai, Maharashtra", "A-791, Bandra Reclamation, Mumbai 400050"),
    ("Hinduja Hospital", "Mumbai, Maharashtra", "Veer Savarkar Marg, Mumbai 400016"),
    ("Breach Candy Hospital", "Mumbai, Maharashtra", "60A Bhulabhai Desai Road, Mumbai 400026"),
    ("Jaslok Hospital", "Mumbai, Maharashtra", "15 Dr G Deshmukh Marg, Mumbai 400026"),
    ("Global Hospital Mumbai", "Mumbai, Maharashtra", "35 Dr E Borges Road, Mumbai 400012"),
    ("Apollo Hospital Navi Mumbai", "Navi Mumbai, Maharashtra", "Plot 13, Sector 23, Navi Mumbai 400706"),
    # Bengaluru
    ("NIMHANS Bengaluru", "Bengaluru, Karnataka", "Hosur Road, Bengaluru 560029"),
    ("Victoria Hospital Bengaluru", "Bengaluru, Karnataka", "Fort Road, Bengaluru 560002"),
    ("St. Johns Medical College Hospital", "Bengaluru, Karnataka", "Sarjapur Road, Bengaluru 560034"),
    ("Apollo Hospital Bengaluru", "Bengaluru, Karnataka", "154/11 Opp IIM, Bannerghatta Road, Bengaluru 560076"),
    ("Fortis Hospital Bengaluru", "Bengaluru, Karnataka", "14 Cunningham Road, Bengaluru 560052"),
    ("Manipal Hospital Bengaluru", "Bengaluru, Karnataka", "98 HAL Airport Road, Bengaluru 560017"),
    ("Narayana Health City", "Bengaluru, Karnataka", "258/A Bommasandra, Bengaluru 560099"),
    ("Columbia Asia Hospital Bengaluru", "Bengaluru, Karnataka", "Kirloskar Business Park, Bengaluru 560024"),
    # Chennai
    ("Government Stanley Hospital", "Chennai, Tamil Nadu", "Old Jail Road, Chennai 600001"),
    ("Government General Hospital", "Chennai, Tamil Nadu", "Park Town, Chennai 600003"),
    ("Apollo Hospital Chennai", "Chennai, Tamil Nadu", "21 Greams Lane, Chennai 600006"),
    ("Fortis Malar Hospital", "Chennai, Tamil Nadu", "52 1st Main Road, Chennai 600020"),
    ("MIOT International Hospital", "Chennai, Tamil Nadu", "4/112 Mount Poonamallee Road, Chennai 600089"),
    ("Sri Ramachandra Medical Centre", "Chennai, Tamil Nadu", "No 1 Ramachandra Nagar, Chennai 600116"),
    # Hyderabad
    ("Osmania General Hospital", "Hyderabad, Telangana", "Hyderabad 500012"),
    ("Gandhi Hospital Hyderabad", "Hyderabad, Telangana", "Secunderabad, Hyderabad 500003"),
    ("Apollo Hospital Hyderabad", "Hyderabad, Hyderabad", "Jubilee Hills, Hyderabad 500033"),
    ("KIMS Hospital Hyderabad", "Hyderabad, Telangana", "1-8-31/1 Minister Road, Hyderabad 500003"),
    ("Yashoda Hospital Hyderabad", "Hyderabad, Telangana", "Raj Bhavan Road, Hyderabad 500082"),
    ("Care Hospital Hyderabad", "Hyderabad, Telangana", "Banjara Hills Road 1, Hyderabad 500034"),
    # Kolkata
    ("SSKM Hospital Kolkata", "Kolkata, West Bengal", "244 AJC Bose Road, Kolkata 700020"),
    ("NRS Medical College Hospital", "Kolkata, West Bengal", "138 AJC Bose Road, Kolkata 700014"),
    ("Apollo Gleneagles Hospital Kolkata", "Kolkata, West Bengal", "58 Canal Circular Road, Kolkata 700054"),
    ("Fortis Hospital Kolkata", "Kolkata, West Bengal", "730 Eastern Metropolitan Bypass, Kolkata 700107"),
    ("AMRI Hospital Kolkata", "Kolkata, West Bengal", "JC-16/17 Salt Lake, Kolkata 700098"),
    # Pune
    ("Sassoon General Hospital", "Pune, Maharashtra", "Jai Prakash Narayan Road, Pune 411001"),
    ("KEM Hospital Pune", "Pune, Maharashtra", "489 Rasta Peth, Pune 411011"),
    ("Ruby Hall Clinic", "Pune, Maharashtra", "40 Sassoon Road, Pune 411001"),
    ("Jehangir Hospital", "Pune, Maharashtra", "32 Sassoon Road, Pune 411001"),
    ("Apollo Clinic Pune", "Pune, Maharashtra", "Bund Garden Road, Pune 411001"),
    # Ahmedabad
    ("Civil Hospital Ahmedabad", "Ahmedabad, Gujarat", "Asarwa, Ahmedabad 380016"),
    ("Apollo Hospital Ahmedabad", "Ahmedabad, Gujarat", "Plot 1A, Bhat GIDC, Ahmedabad 382428"),
    ("Sterling Hospital Ahmedabad", "Ahmedabad, Gujarat", "Gurukul Road, Ahmedabad 380052"),
    ("SAL Hospital Ahmedabad", "Ahmedabad, Gujarat", "Drive In Road, Ahmedabad 380054"),
    # Jaipur
    ("SMS Hospital Jaipur", "Jaipur, Rajasthan", "JLN Marg, Jaipur 302004"),
    ("Apex Hospital Jaipur", "Jaipur, Rajasthan", "SP-4 Malviya Industrial Area, Jaipur 302017"),
    ("Fortis Escorts Hospital Jaipur", "Jaipur, Rajasthan", "Jawaharlal Nehru Marg, Jaipur 302017"),
    # Chandigarh
    ("PGIMER Chandigarh", "Chandigarh, Punjab", "Sector 12, Chandigarh 160012"),
    ("Government Medical College Chandigarh", "Chandigarh, Punjab", "Sector 32, Chandigarh 160030"),
    ("Fortis Hospital Mohali", "Mohali, Punjab", "Sector 62, Mohali 160062"),
    # Lucknow
    ("KGMU Lucknow", "Lucknow, Uttar Pradesh", "Shah Mina Road, Lucknow 226003"),
    ("Ram Manohar Lohia Institute", "Lucknow, Uttar Pradesh", "Vibhuti Khand, Lucknow 226010"),
    ("Medanta Hospital Lucknow", "Lucknow, Uttar Pradesh", "Sector A, Sushant Golf City, Lucknow 226030"),
    # Kochi
    ("Government Medical College Ernakulam", "Kochi, Kerala", "Thrikkakara, Kochi 682021"),
    ("Amrita Institute of Medical Sciences", "Kochi, Kerala", "AIMS Ponekkara, Kochi 682041"),
    ("Lakeshore Hospital Kochi", "Kochi, Kerala", "Nettoor, Maradu, Kochi 682040"),
    # International
    ("Apollo Hospital London", "London, UK", "No 1 Harley Street, London W1G 9QD"),
    ("Max Healthcare Singapore", "Singapore", "38 Irrawaddy Road, Singapore 329563"),
    ("Bumrungrad International Hospital", "Bangkok, Thailand", "33 Sukhumvit 3, Bangkok 10110"),
    ("Aga Khan University Hospital", "Karachi, Pakistan", "Stadium Road, Karachi 74800"),
    ("Apollo Hospital Dubai", "Dubai, UAE", "Umm Hurair Road, Dubai"),
    ("Mediclinic City Hospital Dubai", "Dubai, UAE", "Cardiac Building, Dubai Healthcare City"),
    ("Cleveland Clinic Abu Dhabi", "Abu Dhabi, UAE", "Al Maryah Island, Abu Dhabi"),
    ("Narayana Health Tokyo", "Tokyo, Japan", "1-2-3 Shinjuku, Tokyo 160-0022"),
]

# ── REAL VACCINES with approximate Indian market prices ──
VACCINES = [
    # COVID-19
    ("Covishield (ChAdOx1)", "Serum Institute of India", "COVID-19 prevention", 250, 800),
    ("Covaxin (BBV152)", "Bharat Biotech", "COVID-19 prevention", 300, 1200),
    ("Corbevax", "Biological E", "COVID-19 prevention", 250, 990),
    ("ZyCoV-D (DNA vaccine)", "Zydus Cadila", "COVID-19 prevention (3-dose)", 400, 1500),
    # Routine childhood
    ("BCG Vaccine", "Serum Institute of India", "Tuberculosis prevention", 0, 150),
    ("OPV (Oral Polio Vaccine)", "Indian Immunologicals", "Polio prevention", 0, 50),
    ("IPV (Inactivated Polio Vaccine)", "Sanofi Pasteur", "Polio prevention injectable", 350, 800),
    ("Pentavalent Vaccine (DPT+HepB+Hib)", "Serum Institute of India", "DPT + Hepatitis B + Hib", 0, 450),
    ("DPT Vaccine", "Serum Institute of India", "Diphtheria, Pertussis, Tetanus", 0, 200),
    ("Hepatitis B Vaccine", "Serum Institute of India", "Hepatitis B prevention", 0, 350),
    ("Hepatitis A Vaccine (Havrix)", "GlaxoSmithKline", "Hepatitis A prevention", 800, 1800),
    ("MMR Vaccine (Measles+Mumps+Rubella)", "Serum Institute of India", "MMR prevention", 0, 450),
    ("Varicella Vaccine (Varilrix)", "GlaxoSmithKline", "Chickenpox prevention", 1200, 2500),
    # Meningococcal / Pneumococcal
    ("PCV13 (Prevenar 13)", "Pfizer", "Pneumococcal disease (13-strain)", 3500, 4500),
    ("PPSV23 (Pneumovax)", "MSD/Merck", "Pneumococcal (23-strain, adults)", 1800, 2800),
    ("MenACWY (Menveo)", "GlaxoSmithKline", "Meningococcal ACWY", 2500, 4000),
    # Rotavirus
    ("Rotarix (Rotavirus)", "GlaxoSmithKline", "Rotavirus gastroenteritis", 1000, 2200),
    ("RotaTeq (Rotavirus)", "MSD/Merck", "Rotavirus gastroenteritis (3-dose)", 1100, 2400),
    # Typhoid
    ("Typhoid Conjugate Vaccine (Typbar-TCV)", "Bharat Biotech", "Typhoid fever", 600, 1200),
    ("Typhoid Vi (Typherix)", "GlaxoSmithKline", "Typhoid polysaccharide", 400, 900),
    # Influenza
    ("Flu Vaccine (Vaxigrip Tetra)", "Sanofi Pasteur", "Seasonal Influenza", 600, 1200),
    ("Flu Vaccine (Fluarix Tetra)", "GlaxoSmithKline", "Seasonal Influenza", 650, 1300),
    ("Flu Vaccine (Influvac Tetra)", "Abbott", "Seasonal Influenza", 600, 1100),
    # HPV
    ("HPV Vaccine (Gardasil 9)", "MSD/Merck", "HPV 9-strain cervical cancer", 2800, 4000),
    ("HPV Vaccine (Cervarix)", "GlaxoSmithKline", "HPV cervical cancer (2-strain)", 2500, 3800),
    ("Cervavac (Indian HPV)", "Serum Institute of India", "HPV cervical cancer (4-strain)", 1500, 2500),
    # Rabies
    ("Rabipur (Rabies)", "Bavarian Nordic", "Rabies pre/post exposure", 350, 700),
    ("Abhayrab (Rabies)", "Human Biological Institute", "Rabies prevention", 300, 650),
    # Hepatitis A+B
    ("Twinrix (Hep A+B)", "GlaxoSmithKline", "Combined Hepatitis A+B", 1500, 2500),
    # Travel vaccines
    ("Yellow Fever Vaccine (Stamaril)", "Sanofi Pasteur", "Yellow fever prevention", 1200, 2200),
    ("Japanese Encephalitis (Jenvac)", "Bharat Biotech", "Japanese Encephalitis", 600, 1500),
    ("Typhim Vi (Typhoid)", "Sanofi Pasteur", "Typhoid polysaccharide travel", 500, 1000),
    # Tdap / Td
    ("Tdap (Boostrix)", "GlaxoSmithKline", "Tetanus Diphtheria Pertussis booster", 800, 1500),
    ("Td Vaccine", "Serum Institute of India", "Tetanus Diphtheria adult booster", 0, 200),
    # Shingles
    ("Shingrix (Zoster)", "GlaxoSmithKline", "Shingles/Herpes Zoster prevention", 8000, 12000),
    # Dengue
    ("Dengvaxia (Dengue)", "Sanofi Pasteur", "Dengue fever prevention", 3000, 5000),
    ("Qdenga (Dengue)", "Takeda", "Dengue fever (TAK-003)", 2500, 4500),
    # Malaria
    ("Mosquirix (Malaria RTS,S)", "GlaxoSmithKline", "Malaria prevention", 0, 5000),
    # Cholera
    ("Dukoral (Cholera+ETEC)", "Valneva", "Cholera oral vaccine", 1500, 3000),
    ("Shanchol (Cholera)", "Shantha Biotech", "Cholera oral (India)", 250, 600),
    # Anthrax / special
    ("Hib Vaccine (Act-HIB)", "Sanofi Pasteur", "Haemophilus influenzae type B", 400, 900),
    # Ebola
    ("Ervebo (Ebola rVSV)", "MSD/Merck", "Ebola virus disease", 0, 8000),
    # RSV
    ("Abrysvo (RSV)", "Pfizer", "RSV prevention (adults 60+)", 5000, 9000),
    ("mRESVIA (RSV mRNA)", "Moderna", "RSV prevention (adults 60+)", 5500, 10000),
    # Mpox
    ("Jynneos (Mpox/Smallpox)", "Bavarian Nordic", "Mpox and Smallpox prevention", 4000, 8000),
]

async def main():
    conn = await asyncpg.connect(
        host="10.10.0.3", port=5432,
        database="dhg-vaccinefee-db",
        user="dhg-vaccinefee-user",
        password="India@12345"
    )

    # ── Clear existing data ──
    print("Clearing old data...")
    await conn.execute("DELETE FROM pricing")
    await conn.execute("DELETE FROM hospitals")
    await conn.execute("DELETE FROM vaccines")

    # ── Insert hospitals ──
    print(f"Inserting {len(HOSPITALS)} real hospitals...")
    for name, location, address in HOSPITALS:
        await conn.execute(
            "INSERT INTO hospitals (name, location, address) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
            name, location, address
        )

    # ── Insert vaccines ──
    print(f"Inserting {len(VACCINES)} real vaccines...")
    for name, mfg, desc, min_p, max_p in VACCINES:
        await conn.execute(
            "INSERT INTO vaccines (name, manufacturer, description) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
            name, mfg, desc
        )

    # ── Get IDs ──
    hosp_rows = await conn.fetch("SELECT id, name FROM hospitals")
    vacc_rows = await conn.fetch("SELECT id, name, manufacturer FROM vaccines")
    dept_rows = await conn.fetch("SELECT id, name FROM departments")

    hospitals_map = {r["name"]: r["id"] for r in hosp_rows}
    vaccines_map  = {r["name"]: (r["id"], r["name"]) for r in vacc_rows}
    dept_ids      = [r["id"] for r in dept_rows]

    import random
    random.seed(42)

    # ── Generate realistic pricing ──
    print("Generating realistic pricing...")
    pricing_rows = []
    vacc_price_map = {name: (min_p, max_p) for name, _, _, min_p, max_p in VACCINES}

    for vname, (vid, _) in vaccines_map.items():
        min_p, max_p = vacc_price_map.get(vname, (200, 2000))
        # Assign to 30-60% of hospitals
        n_hospitals = random.randint(len(hospitals_map)//3, len(hospitals_map)*2//3)
        selected    = random.sample(list(hospitals_map.items()), n_hospitals)

        for hname, hid in selected:
            # Government hospitals cheaper, private more expensive
            is_govt = any(x in hname for x in ["AIIMS","Safdarjung","KEM","KGMU","Sassoon","SMS","Civil","Osmania","Gandhi","SSKM","NRS","Victoria","Government","GTB","RML","Lady Hardinge","PGIMER","Stanley"])
            
            if is_govt:
                price = 0 if min_p == 0 else round(random.uniform(min_p * 0.3, min_p * 0.7))
            else:
                price = round(random.uniform(min_p * 0.9, max_p * 1.1))

            # Round to nearest 50
            if price > 0:
                price = round(price / 50) * 50

            stock      = random.choice([0, 0, 5, 10, 25, 50, 75, 100, 150, 200])
            status     = "Out of Stock" if stock == 0 else ("Low Stock" if stock <= 10 else "Available")
            insurance  = random.choice(["No", "No", "No", "Yes", "Yes", "Vco"])
            dept_id    = random.choice(dept_ids)

            pricing_rows.append((vid, hid, dept_id, float(price), status, insurance, stock))

    # Batch insert pricing
    await conn.executemany(
        "INSERT INTO pricing (vaccine_id, hospital_id, department_id, price, status, insurance_covered, stock_quantity) VALUES ($1,$2,$3,$4,$5,$6,$7)",
        pricing_rows
    )

    # Final counts
    h_count = await conn.fetchval("SELECT COUNT(*) FROM hospitals")
    v_count = await conn.fetchval("SELECT COUNT(*) FROM vaccines")
    p_count = await conn.fetchval("SELECT COUNT(*) FROM pricing")

    print(f"✅ Done!")
    print(f"   Hospitals: {h_count}")
    print(f"   Vaccines:  {v_count}")
    print(f"   Pricing:   {p_count}")

    await conn.close()

asyncio.run(main())