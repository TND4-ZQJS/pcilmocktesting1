let currentQuestion = 1;
let questions = [];
let userAnswers = JSON.parse(localStorage.getItem("userAnswers")) || {};
let explanationStates = JSON.parse(localStorage.getItem("explanationStates")) || {};

fetch('set2_full_100.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
    calculateScore();
    displayQuestion(currentQuestion);
  });

function displayQuestion(num) {
  const q = questions[num - 1];
  if (!q) return;

  document.getElementById('question-number').innerText = `Question ${q.questionNumber}`;
  document.getElementById('question-text').innerText = q.question;

  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';

  for (let key in q.options) {
    const btn = document.createElement('button');
    btn.innerText = `${key}. ${q.options[key]}`;
    btn.className = 'option';
    btn.onclick = () => checkAnswer(btn, key, q.answer, q.explanation, q.textbook, q.chapter, q.page, num);
    optionsContainer.appendChild(btn);
  }

  document.getElementById('feedback').innerText = '';
  document.getElementById('explanation').style.display = 'none';
  document.getElementById('toggle-explanation').style.display = 'none';
  document.getElementById('toggle-explanation').innerText = 'Show Explanation';
  document.getElementById('explanation').innerHTML = '';

  const savedAnswer = userAnswers[num];
  if (savedAnswer) {
    checkAnswer(null, savedAnswer, q.answer, q.explanation, q.textbook, q.chapter, q.page, num, true);
  }

  if (explanationStates[num]) {
    document.getElementById('explanation').style.display = 'block';
    document.getElementById('toggle-explanation').style.display = 'inline-block';
    document.getElementById('toggle-explanation').innerText = 'Hide Explanation';
    document.getElementById('explanation').innerHTML = `
      <strong>Explanation:</strong><br>${q.explanation}<br><br>
      <em>Reference: ${q.textbook}</em>
    `;
  }
}

function checkAnswer(button, selected, correct, explanation, textbook, chapter, page, qNum, isRestore = false) {
  const buttons = document.querySelectorAll('#options-container button');
  buttons.forEach(btn => {
    btn.classList.add('disabled');
    btn.disabled = true;
    if (btn.innerText.startsWith(correct)) btn.classList.add('correct');
    if (btn.innerText.startsWith(selected) && selected !== correct) btn.classList.add('incorrect');
  });

  if (button) button.classList.add('selected');
  document.getElementById('feedback').innerText = `Correct answer: ${correct}`;
  document.getElementById('toggle-explanation').style.display = 'inline-block';

  document.getElementById('explanation').innerHTML = `
    <strong>Explanation:</strong><br>${explanation}<br><br>
    <em>Reference: ${textbook}</em>
  `;

  if (!isRestore) {
    userAnswers[qNum] = selected;
    localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
    calculateScore();
  }
}

function toggleExplanation() {
  const exp = document.getElementById('explanation');
  const button = document.getElementById('toggle-explanation');

  const isVisible = exp.style.display === 'block';
  exp.style.display = isVisible ? 'none' : 'block';
  button.innerText = isVisible ? 'Show Explanation' : 'Hide Explanation';

  explanationStates[currentQuestion] = !isVisible;
  localStorage.setItem("explanationStates", JSON.stringify(explanationStates));
}

function nextQuestion() {
  if (currentQuestion < questions.length) {
    currentQuestion++;
    displayQuestion(currentQuestion);
  }
}

function prevQuestion() {
  if (currentQuestion > 1) {
    currentQuestion--;
    displayQuestion(currentQuestion);
  }
}

function goToQuestion() {
  const num = parseInt(document.getElementById('jump-input').value);
  if (num >= 1 && num <= questions.length) {
    currentQuestion = num;
    displayQuestion(currentQuestion);
  } else {
    alert(`Please enter a valid question number (1–${questions.length})`);
  }
}

function calculateScore() {
  let total = 0;
  let correct = 0;
  for (let num in userAnswers) {
    const userAns = userAnswers[num];
    const q = questions[num - 1];
    if (q && userAns === q.answer) correct++;
    total++;
  }
  const scoreText = total > 0
    ? `Score: ${correct}/${total} correct (${Math.round((correct / total) * 100)}%)`
    : `No questions answered yet`;
  document.getElementById('score').innerText = scoreText;
}

function resetProgress() {
  if (confirm("Are you sure you want to reset all progress?")) {
    localStorage.removeItem("userAnswers");
    localStorage.removeItem("explanationStates");
    userAnswers = {};
    explanationStates = {};
    currentQuestion = 1;
    document.getElementById('score').innerText = '';
    displayQuestion(currentQuestion);
  }
}
