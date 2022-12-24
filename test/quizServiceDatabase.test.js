const quizService = require("../src/quizServiceDatabase");
const connection = require("../src/connection");

jest.mock('../src/connection')

const mockQuery = (dataToReturn) => {
	connection.query.mockResolvedValue(dataToReturn)
}

const mockDataQuestions = [
	{
		id: 1,
		question: "Qual a resposta para tudo?",
		created_at: "2020-06-20T19:00:00.000Z",
	},
	{
		id: 2,
		question: "Qual o nome do seu melhor amigo?",
		created_at: "2020-06-20T19:00:00.000Z",
	}	
]

const mockDataOneQuestion = [
	{
		id: 3,
		question: "Qual o valor de x?",
		created_at: "2020-06-20T19:00:00.000Z",
	}	
]

const mockDataWithThreeQuestions = [
	...mockDataQuestions,
	...mockDataOneQuestion
]

const mockDataUser = [
	{
		id: 1,
		nickname: "teste",
		created_at: "2020-06-20T19:00:00.000Z",
	},
	{
		id: 2,
		nickname: "teste2",
		created_at: "2020-06-20T19:00:00.000Z",
	}
]

const mockDataWithOneUser = [
	{
		id: 3,
		nickname: "teste3",
		created_at: "2020-06-20T19:00:00.000Z",
	}
]

const mockDataWithThreeUsers = [
	...mockDataUser,
	...mockDataWithOneUser
]

const mockDataAnswers = [
	{
		id: 1,
		answer: "Tudo",
		question_id: 1,
		id_question: 1,
		created_at: "2020-06-20T19:00:00.000Z",
	},
	{
		id: 2,
		answer: "Nada",
		id_question: 1,
		question_id: 2,
		created_at: "2020-06-20T19:00:00.000Z",
	}
]

const mockDataOneAnswer = [
	{
		id: 3,
		answer: "ter uma toalha",
		id_question: 2,
		question_id: 2,
		created_at: "2020-06-20T19:00:00.000Z",
	}
]

const mockDataWithThreeAnswers = [
	...mockDataAnswers,
	...mockDataOneAnswer
]
describe("Test Database", function () {
	test("Should return a list of users", async function () {
		mockQuery(mockDataUser)

		const usersData = await quizService.getUsers();
		const user = usersData[0];

		expect(user.nickname).toBe("teste");
		expect(user.id).toBe(1);
	});
	
	test("Should return a list of questions", async function () {
		mockQuery(mockDataQuestions)

		const questions = await quizService.getQuestions();
		const question = questions[0];
		
		expect(question.question).toBe("Qual a resposta para tudo?");
		expect(question.id).toBe(1);
	});
	
	test("Should return a list of answers", async function () {
		mockQuery(mockDataAnswers)

		const answers = await quizService.getAnswers();
		const answer = answers[0];
		expect(answer.answer).toBe("Tudo");
		expect(answer.id).toBe(1);
	});

	test("Should return the answer of a question by id", async function () {
		const idQuestion = "2";
		const answers = await quizService.getAnswersByQuestionId(idQuestion);
		const answer = answers[1];
		expect(answer.answer).toBe("Nada");
	});
	
	test("Should save and delete a user", async function () {
		connection.query
			.mockResolvedValueOnce(mockDataUser)
			.mockResolvedValueOnce(mockDataWithOneUser)
			.mockResolvedValueOnce(mockDataWithThreeUsers)
			.mockResolvedValueOnce(null)
			.mockResolvedValue(mockDataUser)

		const userData = {
			nickname: "teste3"
		};

		await quizService.saveUser(userData.nickname);

		const user = await quizService.getUserById(3);
		expect(user.nickname).toBe(userData.nickname);

		const usersThree = await quizService.getUsers();
		expect(usersThree.length).toBe(3);

		await quizService.deleteUser(user.id);

		const users = await quizService.getUsers();
		expect(users.length).toBe(2);
	});
	
	test("Should save and delete a answer", async function () {
		connection.query
			.mockResolvedValueOnce(mockDataAnswers)
			.mockResolvedValueOnce(mockDataOneAnswer)
			.mockResolvedValueOnce(null)
			.mockResolvedValueOnce(mockDataWithThreeAnswers)
			.mockResolvedValue(mockDataAnswers)

		const answerData = {
			questionId: 2,
			userId: 2,
			answer: "ter uma toalha"
		};

		await quizService.saveAnswer(answerData.answer, answerData.userId, answerData.questionId);

		const [answer] = await quizService.getAnswersByQuestionId(2);

		expect(answer.answer).toEqual(answerData.answer);

		await quizService.deleteAnswer(answer.id);

		const answersThree = await quizService.getAnswers();
		expect(answersThree.length).toBe(3);

		const answers = await quizService.getAnswers();
		expect(answers.length).toBe(2);
	});

	test("Should save and delete a question", async function () {
		connection.query
			.mockResolvedValueOnce(mockDataQuestions)
			.mockResolvedValueOnce(mockDataOneQuestion)
			.mockResolvedValueOnce(mockDataWithThreeQuestions)
			.mockResolvedValueOnce(null)
			.mockResolvedValue(mockDataQuestions)

		const questionData = {
			question: "Qual o valor de x?",
			userId: 3
		};
		await quizService.saveQuestion(questionData.question, questionData.userId);

		const question = await quizService.getQuestionById(3);
		expect(question.question).toBe(questionData.question);

		
		const questionsThree = await quizService.getQuestions();
		expect(questionsThree.length).toBe(3);

		await quizService.deleteQuestion(question.id);

		const questions = await quizService.getQuestions();
		expect(questions.length).toBe(2);
	});
});