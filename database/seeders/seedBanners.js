import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import pool from "../db.js";

const seedBanners = async () => {
	const banners = [
		{
			banner_name: "Banner 1",
			banner_image: "https://nutech-integrasi.app/dummy.jpg",
			description: "Lerem Ipsum Dolor sit amet",
		},
		{
			banner_name: "Banner 2",
			banner_image: "https://nutech-integrasi.app/dummy.jpg",
			description: "Lerem Ipsum Dolor sit amet",
		},
		{
			banner_name: "Banner 3",
			banner_image: "https://nutech-integrasi.app/dummy.jpg",
			description: "Lerem Ipsum Dolor sit amet",
		},
		{
			banner_name: "Banner 4",
			banner_image: "https://nutech-integrasi.app/dummy.jpg",
			description: "Lerem Ipsum Dolor sit amet",
		},
		{
			banner_name: "Banner 5",
			banner_image: "https://nutech-integrasi.app/dummy.jpg",
			description: "Lerem Ipsum Dolor sit amet",
		},
		{
			banner_name: "Banner 6",
			banner_image: "https://nutech-integrasi.app/dummy.jpg",
			description: "Lerem Ipsum Dolor sit amet",
		},
	];

	try {
		for (const banner of banners) {
			await pool.query(
				`
        INSERT INTO banners (id, banner_name, banner_image, description)
        VALUES ($1, $2, $3, $4)
      `,
				[
					uuidv4(),
					banner.banner_name,
					banner.banner_image,
					banner.description,
				]
			);
		}

		console.log("Successfully seeded banners");
		process.exit(0);
	} catch (error) {
		console.error("Error seeding banners:", error.message);
		process.exit(1);
	}
};

seedBanners();
