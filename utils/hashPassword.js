import bcrypt from "bcrypt";

const saltHash = async (string) => {
	const saltRounds = parseInt(process.env.SALT);
	const hashed = await bcrypt.hashSync(string, saltRounds);
	return hashed;
};

const compareHash = (plainPassword, hashedPassword) => {
	return bcrypt.compareSync(plainPassword, hashedPassword);
};

export { saltHash, compareHash };
