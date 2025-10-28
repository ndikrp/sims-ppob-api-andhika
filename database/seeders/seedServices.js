import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import pool from "../db.js";

const seedBanners = async () => {
	const services = [
		{
			service_code: "PAJAK",
			service_name: "Pajak PBB",
			service_icon: "https://nutech-integrasi.app/dummy.jpg",
			service_tariff: 40000,
		},
		{
			service_code: "PLN",
			service_name: "Listrik",
			service_icon: "https://nutech-integrasi.app/dummy.jpg",
			service_tariff: 10000,
		},
		{
			service_code: "PDAM",
			service_name: "PDAM Berlangganan",
			service_icon: "https://nutech-integrasi.app/dummy.jpg",
			service_tariff: 40000,
		},
		{
			service_code: "PULSA",
			service_name: "Pulsa",
			service_icon: "https://nutech-integrasi.app/dummy.jpg",
			service_tariff: 40000,
		},
		{
			service_code: "PGN",
			service_name: "PGN Berlangganan",
			service_icon: "https://nutech-integrasi.app/dummy.jpg",
			service_tariff: 50000,
		},
		{
			service_code: "MUSIK",
			service_name: "Musik Berlangganan",
			service_icon: "https://nutech-integrasi.app/dummy.jpg",
			service_tariff: 50000,
		},
		{
			service_code: "TV",
			service_name: "TV Berlangganan",
			service_icon: "https://nutech-integrasi.app/dummy.jpg",
			service_tariff: 50000,
		},
		{
			service_code: "PAKET_DATA",
			service_name: "Paket data",
			service_icon: "https://nutech-integrasi.app/dummy.jpg",
			service_tariff: 50000,
		},
		{
			service_code: "VOUCHER_GAME",
			service_name: "Voucher Game",
			service_icon: "https://nutech-integrasi.app/dummy.jpg",
			service_tariff: 100000,
		},
		{
			service_code: "VOUCHER_MAKANAN",
			service_name: "Voucher Makanan",
			service_icon: "https://nutech-integrasi.app/dummy.jpg",
			service_tariff: 100000,
		},
		{
			service_code: "QURBAN",
			service_name: "Qurban",
			service_icon: "https://nutech-integrasi.app/dummy.jpg",
			service_tariff: 200000,
		},
		{
			service_code: "ZAKAT",
			service_name: "Zakat",
			service_icon: "https://nutech-integrasi.app/dummy.jpg",
			service_tariff: 300000,
		},
	];

	try {
		for (const service of services) {
			await pool.query(
				`
        INSERT INTO services (id, service_code, service_name, service_icon, service_tariff)
        VALUES ($1, $2, $3, $4, $5)
      `,
				[
					uuidv4(),
					service.service_code,
					service.service_name,
					service.service_icon,
					service.service_tariff,
				]
			);
		}

		console.log("Successfully seeded services");
		process.exit(0);
	} catch (error) {
		console.error("Error seeding services:", error.message);
		process.exit(1);
	}
};

seedBanners();
