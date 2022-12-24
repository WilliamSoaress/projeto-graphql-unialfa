const connection = require("../src/connection");
const { schema } = require("./utils/schema")

describe("Connection", () => {
	beforeEach(async function () {
		await connection.query("drop table if exists users, questions, answers");
		await connection.query(schema);
	});

	test("Should connect to the database", async function () {
		const users = await connection.query("select * from users", []);
		expect(users).toHaveLength(3);
	});
})