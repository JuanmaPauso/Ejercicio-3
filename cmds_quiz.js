const { User, Quiz } = require("./model.js").models;

// Show all quizzes in DB including <id> and <author>
exports.list = async(rl) => {

    let quizzes = await Quiz.findAll({
        include: [{
            model: User,
            as: 'author'
        }]
    });
    quizzes.forEach(
        q => rl.log(`  "${q.question}" (by ${q.author.name}, id=${q.id})`)
    );
}

// Create quiz with <question> and <answer> in the DB
exports.create = async(rl) => {

    let name = await rl.questionP("Enter user");
    let user = await User.findOne({ where: { name } });
    if (!user) throw new Error(`User ('${name}') doesn't exist!`);

    let question = await rl.questionP("Enter question");
    if (!question) throw new Error("Response can't be empty!");

    let answer = await rl.questionP("Enter answer");
    if (!answer) throw new Error("Response can't be empty!");

    await Quiz.create({
        question,
        answer,
        authorId: user.id
    });
    rl.log(`   User ${name} creates quiz: ${question} -> ${answer}`);
}

// Test (play) quiz identified by <id>
exports.test = async(rl) => {



    let id = await rl.questionP("Enter quiz Id");
    let quiz = await Quiz.findByPk(Number(id));
    if (!quiz) throw new Error(`  Quiz '${id}' is not in DB`);

    let answered = await rl.questionP(quiz.question);

    if (answered.toLowerCase().trim() === quiz.answer.toLowerCase().trim()) {
        rl.log(`  The answer "${answered}" is right!`);
    } else {
        rl.log(`  The answer "${answered}" is wrong!`);
    }
}

// Play quiz ramdon
exports.play = async(rl) => {

    // Funcion para calcular el listado de preguntas de forma aleatoria
    function ramdonQuestion(min, max) {
        if (max > 0) {
            let rept = 0;
            let end = 0;
            orderQuestion = [];
            while (rept != -1) {
                for (let i = 1; i <= max; i++) {
                    let numberRamdon = Math.floor(Math.random() * (max + 1));
                    if (orderQuestion.indexOf(numberRamdon) < 0 && numberRamdon != 0) {
                        orderQuestion.push(numberRamdon);
                        end++;
                    }
                    end == max ? rept = -1 : false;
                }
            }
        }
    }
    // Calculo de numero de preguntas
    let numberQuestions = await Quiz.count();
    // Llamada a la funcion de preguntas aleatorias pasando el parametro que contiene el numero total
    ramdonQuestion(1, numberQuestions);
    let score = 0;
    // for para iterar por todas las preguntas
    for (const n of orderQuestion) {
        let quiz = await Quiz.findByPk(Number(n));
        if (!quiz) throw new Error(`  Quiz '${n}' is not in DB`);

        let answered = await rl.questionP(quiz.question);

        if (answered.toLowerCase().trim() === quiz.answer.toLowerCase().trim()) {
            rl.log(`  The answer "${answered}" is right!`);
            score++;

        } else {
            rl.log(`  The answer "${answered}" is wrong!`);
            // Cuando se responde mal automaticamente sales de la iteración
            break;

        }
    };
    rl.log(`  Score: ${score}`);

}

// Update quiz (identified by <id>) in the DB
exports.update = async(rl) => {

    let id = await rl.questionP("Enter quizId");
    let quiz = await Quiz.findByPk(Number(id));

    let question = await rl.questionP(`Enter question (${quiz.question})`);
    if (!question) throw new Error("Response can't be empty!");

    let answer = await rl.questionP(`Enter answer (${quiz.answer})`);
    if (!answer) throw new Error("Response can't be empty!");

    quiz.question = question;
    quiz.answer = answer;
    await quiz.save({ fields: ["question", "answer"] });

    rl.log(`  Quiz ${id} updated to: ${question} -> ${answer}`);
}

// Delete quiz & favourites (with relation: onDelete: 'cascade')
exports.delete = async(rl) => {

    let id = await rl.questionP("Enter quiz Id");
    let n = await Quiz.destroy({ where: { id } });

    if (n === 0) throw new Error(`  ${id} not in DB`);
    rl.log(`  ${id} deleted from DB`);
}