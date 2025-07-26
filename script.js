let currentQuestion = 1;
let questions = [];
let score = 0;

fetch('set2_full_100.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
    loadProgress();
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
    btn.disabled = false;

    const savedAnswer = localStorage.getItem(`answer_${num}`);
    if (savedAnswer) {
      btn.disabled = true;
      btn.classList.add('disabled');
      if (key === q.answer) btn.classList.add('correct');
      if (key === savedAnswer && savedAnswer !== q.answer) btn.classList.add('incorrect');
    }

    btn.onclick = () => checkAnswer(btn, key, q.answer, q.explanation, q.textbook, q.chapter, q.page);
    optionsContainer.appendChild(btn);
  }

  document.getElementById('feedback').innerText = '';
  document.getElementById('explanation').innerHTML = '';
  document.getElementById('explanation').style.display = 'none';
  document.getElementById('toggle-explanation').style.display = 'none';
  document.getElementById('toggle-explanation').innerText = 'Show Explanation';

  const savedAnswer = localStorage.getItem(`answer_${num}`);
  const explanationShown = localStorage.getItem(`explanation_${num}`) === 'true';

  if (savedAnswer) {
    showFeedback(q.answer, savedAnswer, q.explanation, q.textbook, q.chapter, q.page);
    if (explanationShown) {
      document.getElementById('explanation').style.display = 'block';
      document.getElementById('toggle-explanation').innerText = 'Hide Explanation';
    }
    document.getElementById('toggle-explanation').style.display = 'inline-block';
  }

  updateScoreDisplay();
}

function checkAnswer(button, selected, correct, explanation, textbook, chapter, page) {
  const buttons = document.querySelectorAll('#options-container button');
  buttons.forEach(btn => {
    btn.classList.add('disabled');
    btn.disabled = true;
    if (btn.innerText.startsWith(correct)) {
      btn.classList.add('correct');
    }
    if (btn.innerText.startsWith(selected) && selected !== correct) {
      btn.classList.add('incorrect');
    }
  });

  document.getElementById('feedback').innerText = `Correct answer: ${correct}`;
  document.getElementById('toggle-explanation').style.display = 'inline-block';
  document.getElementById('toggle-explanation').innerText = 'Show Explanation';
  document.getElementById('explanation').style.display = 'none';
  document.getElementById('explanation').innerHTML = `
    <strong>Explanation:</strong><br>${explanation}<br><br>
    <em>Reference: ${textbook}</em>
  `;

  const previous = localStorage.getItem(`answer_${currentQuestion}`);
  if (!previous) {
    if (selected === correct) score++;
    localStorage.setItem('score', score);
  }

  localStorage.setItem(`answer_${currentQuestion}`, selected);
  localStorage.setItem(`explanation_${currentQuestion}`, 'false');

  updateScoreDisplay();
}

function toggleExplanation() {
  const exp = document.getElementById('explanation');
  const isHidden = exp.style.display === 'none';

  if (isHidden) {
    exp.style.display = 'block';
    document.getElementById('toggle-explanation').innerText = 'Hide Explanation';
    localStorage.setItem(`explanation_${currentQuestion}`, 'true');
  } else {
    exp.style.display = 'none';
    document.getElementById('toggle-explanation').innerText = 'Show Explanation';
    localStorage.setItem(`explanation_${currentQuestion}`, 'false');
  }
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

function updateScoreDisplay() {
  const totalAnswered = questions.filter((_, i) =>
    localStorage.getItem(`answer_${i + 1}`)
  ).length;
  document.getElementById('score-display').innerText = `Score: ${score} / ${totalAnswered}`;
}

function loadProgress() {
  const savedScore = localStorage.getItem('score');
  if (savedScore !== null) {
    score = parseInt(savedScore);
  }
}

function resetProgress() {
  if (confirm('Are you sure you want to clear all your answers and restart?')) {
    localStorage.clear();
    score = 0;
    currentQuestion = 1;
    displayQuestion(currentQuestion);
  }
}
