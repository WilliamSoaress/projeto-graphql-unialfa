const schema = `
	create table public.users (
		id serial primary key,
		nickname varchar(255) not null
	);

	create table public.questions (
		id serial primary key,
		id_user integer not null,
		question text not null,
		created_at timestamp(0) not null,
		CONSTRAINT question_id_user_foreign FOREIGN KEY (id_user) REFERENCES public.users(id)
	);

	create table public.answers (
		id serial primary key,
		id_user integer not null,
		id_question integer not null,
		answer text not null,
		created_at timestamp(0) not null,
		CONSTRAINT answer_id_user_foreign FOREIGN KEY (id_user) REFERENCES public.users(id),
		CONSTRAINT answer_id_question_foreign FOREIGN KEY (id_question) REFERENCES public.questions(id)
	);

	INSERT INTO public.users (nickname) VALUES('Junior');
	INSERT INTO public.users (nickname) VALUES('Marcos');
	INSERT INTO public.users (nickname) VALUES('Leticia');

	INSERT INTO public.questions (id_user, question, created_at) VALUES(1, 'Qual a resposta para tudo?', '2022-04-03 16:58:02');
	INSERT INTO public.questions (id_user, question, created_at) VALUES(2, 'O que significa concatenar?', '2022-04-03');
	INSERT INTO public.questions (id_user, question, created_at) VALUES(2, 'Quantos bits cabem em um byte?', '2022-04-03 17:41:42');

	INSERT INTO public.answers (id_user, id_question, answer, created_at) VALUES(3, 1, '42', '2022-04-03 17:00:00');
	INSERT INTO public.answers (id_user, id_question, answer, created_at) VALUES(2, 3, '8', '2022-04-03 17:00:00');
	INSERT INTO public.answers (id_user, id_question, answer, created_at) VALUES(1, 2, 'Concatenar é uma palavra chique da programação que significa colocar junto. Para colocar strings juntas em JavaScript, usamos o operador (+)', '2022-04-03 17:00:00');
`

module.exports = {
  schema
}