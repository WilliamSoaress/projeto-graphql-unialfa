const axios = require("axios");
const connection = require("../src/connection");
const { schema } = require("./utils/schema")

const queryAxios = async (query, variables) => {
	const { data } = await axios({
		url: "http://localhost:3000",
		method: "post",
		headers: { "Content-Type": "application/json" },
		data: { query, variables }
	});

	return data.data
}

describe("API Test", function () {
	beforeEach(async function () {
		await connection.query("drop table if exists users, questions, answers");
		await connection.query(schema);
	});

	test("Should test for a mutation to enter a user", async function () {
		const { addUser } = await queryAxios(
			`
				mutation {
					addUser (nickname: "teste") {
						nickname
					}
				}
			`
		);

		expect(addUser.nickname).toBe("teste");
		});

	test("Should test a query with the description, id and the user who", async function () {
		const { questions } = await queryAxios(
			`
				{
					questions {
						id
						question
						createdAt
						user {
							nickname
						}
					}
				}
			`
		);

		const [questionOne, questionTwo, questionThree] = questions;

		expect(questionOne.question).toBe("Qual a resposta para tudo?");
		expect(questionOne.user.nickname).toBe("Junior");
		expect(questionOne.id).toBe("1");

		expect(questionTwo.question).toBe("O que significa concatenar?");
		expect(questionTwo.user.nickname).toBe("Marcos");
		expect(questionTwo.id).toBe("2");

		expect(questionThree.question).toBe("Quantos bits cabem em um byte?");
		expect(questionThree.user.nickname).toBe("Marcos");
		expect(questionThree.id).toBe("3");
	});

	test("Should test a search of a user by id", async function () {
		const { userById } = await queryAxios(
			`
				{
					userById (id: 1) {
						nickname
					}
				}
			`
		);

		expect(userById.nickname).toBe("Junior");
	});

	test("Should test for a mutation to insert and delete a question", async function () {
		const question = "Qual a melhor comida?";

		const { addQuestion } = await queryAxios(
			`
				mutation {
					addQuestion (question: "${question}", userId: 2) {
						id
						question
						createdAt
						user {
							nickname
						}						
					}
				}
			`
		)

		expect(addQuestion.question).toBe(question);
		expect(addQuestion.user.nickname).toBe("Marcos");

		const { questions } = await queryAxios(
			`
				{	
					questions {
						id
						question
					} 
				}
			`
		);

		expect(questions[3].question).toBe(question);
		expect(questions).toHaveLength(4);

		await queryAxios(
			`
				mutation {
					deleteQuestion (id: 4) {
						question
					}
				}
			`
		)
	
		const { questions: questionsWithRemove } = await queryAxios(
			`
				{	
					questions {
						id
						question
					} 
				}
			`
		);
				
		expect(questionsWithRemove).toHaveLength(3);
	});
	
	test("Should test for a mutation to delete a response", async function () {
		const { addAnswer } = await queryAxios(
			`
				mutation {
					addAnswer (answer: "Resposta teste", userId: "3", questionId: "1") {
						id
						answer
						createdAt
						user {
							nickname
						}
					}
				}
			`
		);

		const { questionById: questionByIdWithTwoAnswers } = await queryAxios(
			`
				query QuestionById ($id: ID!) {
					questionById (id: $id) {
						answers {
							answer
						}
					}
				}
			`,
			{id: 1}
		);

		expect(questionByIdWithTwoAnswers.answers).toHaveLength(2);

		await queryAxios(
			`
				mutation DeleteAnswer ($deleteAnswerId: ID!) {
					deleteAnswer (id: $deleteAnswerId) {
						answer
					}
				}
			`,
			{
				deleteAnswerId: addAnswer.id
			}
		);

		const { questionById } = await queryAxios(
			`
				query QuestionById ($id: ID!) {
					questionById (id: $id) {
						answers {
							answer
						}
					}
				}
			`,
			{id: 1}
		);

		expect(questionById.answers).toHaveLength(1);
	});
});
