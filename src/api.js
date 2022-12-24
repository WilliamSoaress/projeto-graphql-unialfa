const { ApolloServer } = require("apollo-server");
const quizService = require("./quizServiceDatabase");

const typeDefs = `
	type User {
		id: ID
		nickname: String!
	}

	type Question {
		id: ID
		user: User
		answers: [Answer]
		question: String!
		createdAt: String!
	}

	type Answer {
		id: ID
		user: User
		answer: String!
		createdAt: String!
	}

	type Query {
		questions: [Question]
		userById (id: ID!): User
		questionById (id: ID!): Question
	}

	type Mutation {
		addQuestion (question: String!, userId: ID!): Question
		addAnswer (answer: String!, userId: ID!, questionId: ID!): Answer
		addUser (nickname: String!): User
		deleteAnswer (id: ID!): Answer
		deleteQuestion (id: ID!): Question
		deleteUser (id: ID!): User
	}
`;

const resolvers = {
	Query: {
		async questions() {
			return await quizService.getQuestions();
		},
		async userById(_, params) {
			if (!params.id) return;
			return await quizService.getUserById(params.id);
		},
		async questionById(_, params) {
			if (!params.id) return;
			return await quizService.getQuestionById(params.id);
		},
	},
	Question: {
		async answers(question) {
			return await quizService.getAnswersByQuestionId(question.id);
		},
	  async user(question) {
			return await quizService.getUserById(question.id_user);
		}
	},
	Answer: {
		async user(answer) {
			return await quizService.getUserById(answer.id_user);
		},
	},
	Mutation: {
		async addQuestion(_, params) {
			const { question, userId } = params;
			return await quizService.saveQuestion(question, userId);
		},
		async addAnswer(_, params) {
			const { answer, userId, questionId } = params;
			console.log({ answer, userId, questionId })
			return await quizService.saveAnswer(answer, userId, questionId);
		},
		async addUser(_, params) {
			const { nickname } = params;
			return await quizService.saveUser(nickname);
		},
		async deleteAnswer(_, params) {
			const { id } = params;
			return await quizService.deleteAnswer(id);
		},
		async deleteQuestion(_, params) {
			const { id } = params;
			return await quizService.deleteQuestion(id);
		},
		async deleteUser(_, params) {
			const { id } = params;
			return await quizService.deleteUser(id);
		}
	}
};

const server = new ApolloServer({
	typeDefs, 
	resolvers, 
	formatError: (err) => {
		console.log(err);
    return err;
  } 
});

server.listen(3000);
