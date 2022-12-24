const connection = require("./connection");

const [date, time] = new Date().toISOString().split("T");

const getUsers = async function () {
	const users = await connection.query("select * from users", []);
	return users;
}

const getQuestions = async function () {
	const questions = await connection.query("select * from questions", []);

	for (const question of questions) {
		question.createdAt = question.created_at;
	}

	return questions;
}

const getQuestionById = async function (id) {
	const [question] = await connection.query("select * from questions where id = $1", [id]);

	question.createdAt = question.created_at;
	
	return question;
}

const getAnswers = async function () {
	const answers = await connection.query("select * from answers", []);

	for (const answer of answers) {
		answer.createdAt = answer.created_at;
	}

	return answers;
}

const getAnswersByQuestionId = async function (idQuestion) {
	const answers = await connection.query("select * from answers a join questions q on q.id = a.id_question where q.id = $1", [idQuestion]);
	for (const answer of answers) {
		answer.createdAt = answer.created_at;
	}
	return answers;
}

const getUserById = async function (idUser) {
	const [user] = await connection.query("select * from users where id = $1", [idUser]);
	return user;
}

const saveUser = async function (nickname) {
	const [user] = await connection.query("insert into users (nickname) values ($1) returning *", [nickname]);
	return user;
}

const saveQuestion = async function (question, idUser) {
	const [questionSaved] = await connection.query(
		"insert into questions (question, id_user, created_at) values ($1, $2, $3) returning *",
	  [
			question, 
			idUser, 
			`${date} ${time}`
		]
	);
	questionSaved.createdAt = questionSaved.created_at;
	return questionSaved;
}

const saveAnswer = async function (answer, idUser, idQuestion) {
	const [answerSaved] = await connection.query(
		"insert into answers (answer, id_user, id_question, created_at) values ($1, $2, $3, $4) returning *", 
		[
			answer, 
			idUser, 
			idQuestion, 
			`${date} ${time}`
		]
	);

	answerSaved.createdAt = answerSaved.created_at;
	return answerSaved;
}

const deleteAnswer = async function (id) {
	await connection.query("delete from answers where id = $1 returning *", [id]);
}

const deleteQuestion = async function (id) {
	await connection.query("delete from answers where id_question = $1 returning *", [id]);
	await connection.query("delete from questions where id = $1 returning *", [id]);
}

const deleteUser = async function (id) {
	await connection.query("delete from users where id = $1 returning *", [id]);
}

module.exports = {
	getUsers,
	getQuestions,
	getAnswers,
	getAnswersByQuestionId,
	getUserById,
	saveUser,
	saveQuestion,
	saveAnswer,
	deleteAnswer,
	deleteQuestion,
	deleteUser,
	getQuestionById
}